# rvl-pipe

Helper functions for easier async pipelining/composing of promises

Promises are a simple (and cool) way of doing async programming in
JavaScript. A promise encapsulates a future result, async in nature, that
has only 3 possible states: Pending, Resolved, Rejected. Once the promise
is resolved we can query its result, if it was rejected then catch and
process the error accordingly.

We can run as many promises in parallel or chain them as we want. Like a
pipeline.

This library contains helper functions to do simple pipelining of promises
reusing a context object that will be pass down and can be queried or
modified.

## How it works?

`rvl-pipe` provides a set of functions to help you create, interact and
query the context object using this approach. We have 2 types of functions:
composability and querying, and also some error handling helpers.

### Composition functions
- `startWith`: this is mostly a bootstraping function. It takes an object,
wraps it in a promise and passes down as context in the first
function all. You will usually start here. If no param is passed it will
use an empty object `{}`

```javascript
return startWith({prop: 'value'})
```

- `each`: Runs a list of async functions serially, passing the context
to all of them.
```javascript
return startWith({})
    .then(each(
        asyncTask1(...),
        asyncTask2(...)
    ))
```

`each` is very handy to make reusable composition

```javascript
const asyncStep = (...) => each(
    doSomeAsync1(...),
    doSomeASync2(...)
)

return startWith({})
    .then(asyncStep(...))
```

- `all`: Runs a list of async functions in parallel. Continues execution
after all have finished.

```javascript
return startWith({})
    .then(all(
        parallelAsyncTask1(...),
        parallelAsyncTask2(...)
    ))
```

- `iff`: Performs a conditional step passing a condition (or predicate)
and a async function. Also accepts an else async function.

```javascript
return startWith()
    .then(iff(
        prop('account'),
        asyncTask(...)
    ))

// Else is possible too

return startWith()
    .then(iff(
        prop('account'),
        asyncTask(...),
        elseAsyncTask(...)
    ))

// Negation
return startWith()
    .then(iff(
        not(prop('account')),
        asyncTask(...)
    ))
```

- `should`: Performs a validation check for a property, it throws a
`ContextError` if the predicate is not satisfied.

```javascript
return startWith({name: 'John'})
    .then(should(prop('name')))  // passes
    .then(should(prop('last')))  // throws
```

- `noop`: This is a no brainer, does nothing, just returns the context.

```javascript
return startWith()
    .then(noop())
```

- `set`: Will add/merge data into the context

```javascript
return startWith({ name: 'Mary' })
    .then(set({ name: 'John })) // statically
    .then(set(prev => ({ last: 'Doe' })))  // dinamically

// returns { name: 'John', last: 'Doe' }
```

### Querying functions

Querying functions can be used to pull data from the context and also
allow to perform logical operations on them.

- `equals`: returns the triple equality of two query functions

```javascript
return startWith({ a: 3, b: 3 })
    .then(iff(
        equals(prop('a'), 3),   // checkink a prop with a static value
        doAsyncTask(...)
    ))
    .then(iff(
        equals(prop('a'), prop('b')),   // checking 2 props dynamically
        doAsyncTask(...)
    ))
```

- `passData`: is a helper function to be able to build async tasks or
composition that accepts both dynamically props or static values

```javascript
const myAsyncStep = prop => context => {
    const value = passData(prop, context)

    // do something with the context
    // based on value

    return context
}
```

- `every`: Evaluates true if all values or predicates are true

```javascript
return startWith()
    .then(iff(
        every(prop('a'), prop('b'), true, 10),  // a and b must evaluate truthy for doAsyncTask to run
        doASyncTask(...)
    ))
```

- `some`: Same as every but we only need one to be true
```javascript
return startWith()
    .then(iff(
        some(prop('a'), prop('b')), // a or b should be truthy for doAsyncTask to run
        doAsyncTask(...)
    ))
```

- `not`: This is a simple complement function. The interesting part is that if we pass a
function `not(fn)` will return a function that negates the result of the wrapped function.

```javascript
return startWith()
    .then(iff(
        not(prop('a')),
        doAsyncTask(...)
    ))
```

- `prop`: returns the value of a prop. It can be nested via dots.

```javascript
return startWith()
    .then(iff(
        prop('user.name'),
        doAsyncTask(...)
    ))
```

- `props`: Helper to construct objects where props can be static or dynamically evaluated

```javascript
const createAccountDocument = props({
    user: prop('auth.user'),
    token: prop('auth.token'),
    newUser: true,
    team: {
        name: prop('auth.team')  // nested props too :)
    }
})

return startWith()
    .then(doAsyncAuth())        // Asumming this adds prop 'auth' to context
    .then(saveToDB(createAccountDocument))
```

- `createTracer`: Sometimes we need to trace some properties on the context.
This function creates a no-op operation that performs that side-effect for us in a
plugable way. The provided tracer should receive two params `path` and `value`

```javascript
const logger = createTracer((path, value) => {
    // perform a log of the path and the value on our logging service
})

return startWith()
    .then(logger('user'))
```

- `consoleTracer` is a pre-made simple console.log tracer ready to use

```javascript
return startWith()
    .then(consoleTracer('user'))
```

### Error handling

If you need to send and error in the pipeline you must use the `ContextError` type
this will help error handling to recover and close the necessary resources. The context
must be passed in the creating of the `ContextError` object.

const myAsyncTask = () => context => {
    // doing some async stuff

    // oh no we found a error, lets throw
    throw new ContextError('MyAsyncTaskError', context)
}

If you are throwing the error as part of a promise chain inside your async task you can do

```javascript
const myAsyncTask = () => context => {
    return asyncPromises()
        .then(...)
        .catch(throwContextError(context))
}
```

Passing the context in the error helps cleaning steps in the pipeline.

```javascript
return startWith()
    .then(connectToDB())
    .then(myAsyncTask(...))
    .catch(err => {
        console.log(err.message)
        return err.context
    })
    .then(closeDB())
```

## So, how to create async pipeline functions

If you are building a async pipeline function from scratch you function signature should
look like this:

```javascript
// Arrow function
const myAsyncFunction = (params) => context => {

    // Async stuff depending on params that prob mutates context

    return context;
}

// Function notation
function myAsyncFunction (params) {
    return function(context) {
        // Async stuff depending on params that prob mutates context

        return context;
    }
}


// Usage
return startWith()
    .then(myAsyncFunction(...))
    .then(otherAsyncFunction(...))
```

This way you can write your own set of mongodb, redis, request, etc.
