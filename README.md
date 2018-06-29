# rvl-pipe

[![Build Status](https://travis-ci.org/revelatio/rvl-pipe.svg?branch=master)](https://travis-ci.org/revelatio/rvl-pipe)
[![Coverage Status](https://coveralls.io/repos/github/revelatio/rvl-pipe/badge.svg?branch=master)](https://coveralls.io/github/revelatio/rvl-pipe?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/revelatio/rvl-pipe/badge.svg)](https://snyk.io/test/github/revelatio/rvl-pipe)

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

You can require/import the helpers you need.

```javascript
const { should, each, iff, prop, props } = require('rvl-pipe')

// as ES6 Modules
import { should, each, iff, prop, props } from 'rvl-pipe'
```

### Composition functions
Composition functions can be always described as:

```javascript
const createStep = (params) => context => Promise(context)
```

So, basically functions that return a function that only takes the `context`
return a Promise with the `context` after some async transformation. Or a rejection.

This steps can then be reused in a async pipeline, where the `context` object gets passed down.

We already provide some helper functions for several common cases like parallel execution, conditionals, noops, etc.

- `each`: Composition function that runs other composition functions in sequence, passing the context
to all of them and returning the resulting context.
```javascript
const runAll = each(
    asyncTask1(...),
    asyncTask2(...)
)

return runAll({})   // {} is the starting context
    .then(context => {
        // context will have the resulting context after asyncTask2
    })
```

`each` is very handy to make reusable composition of common steps.

```javascript
const myAsyncStep = each(
    doSomeAsync1(...),
    doSomeASync2(...)
)

return each(
    myAsyncStep(...),
    otherASyncStep(),
    ...
    yetAnotherAsyncStep(),
    myAsyncStep()
)()
```

- `all`: Same as each but running all task in parallel and merging the resulting contexts.

```javascript
return all(
    parallelAsyncTask1(...),
    parallelAsyncTask2(...)
)({})  // Starting context
```

- `iff`: Performs a conditional step passing a condition (or predicate)
and a async function. Also accepts an else async function.

```javascript
return iff(
    prop('account'),
    asyncTask(...)
)({})

// Else is possible too
return iff(
    prop('account'),
    asyncTask(...),
    elseAsyncTask(...)
)()

// Negation (using Ramda's complement)

const { complement } = require('ramda')

return iff(
    complement(prop('account')),
    asyncTask(...)
)()
```

- `should`: Performs a validation check for a property, it fails with a
`ContextError` if the predicate is not satisfied.

```javascript
return each(
    should(prop('name')),  // passes
    should(prop('last')),  // throws ContextError
)({name: 'John'})

// prop is a query function, check down for documentation

// You can also define your custom error names
return each(
    should(prop('name')),  // passes
    should(prop('last'), 'InvalidLastName'),  // throws ContextError(message='InvalidLastName', context=context)
)({name: 'John'})
```

- `noop`: This is a no brainer, does nothing, just returns the context.

```javascript
return noop()({})
```

- `set`: Will add/merge data into the context. The parameters to this function can be a static object where a simple merge will be performed or a query function where the value depends on the context being passed.

```javascript
return each(
    set(always({ name: 'John' })), // statically
    set(context => ({ last: 'Doe' })),  // dinamically
    set(context => ({ initial: context.name[0] }))
)({ name: 'Mary' })

// returns { name: 'John', last: 'Doe', initial: 'J' }
```

### Querying functions

Querying functions can be used to pull data from the context and also
allow to perform logical operations on them.

- `equals`: returns the triple equality of two query functions

```javascript
return each(
    iff(
        equals(prop('a'), always(3)),   // checkink a prop with a static value
        doAsyncTask(...)
    ),
    iff(
        equals(prop('a'), prop('b')),   // checking 2 props dynamically
        doAsyncTask(...)
    )
)({ a: 3, b: 3 })
```

- `always`: is a helper function that returns the same value of the first parameter passed

```javascript
const name = always('John)
const b = name()   // John
```

- `every`: Evaluates true if all values or predicates are true

```javascript
return iff(
    every(prop('a'), prop('b'), always(true), always(10)),  // a and b must evaluate truthy for doAsyncTask to run
    doASyncTask(...)
)()
```

- `some`: Same as every but we only need one to be true
```javascript
return iff(
    some(prop('a'), prop('b')), // a or b should be truthy for doAsyncTask to run
    doAsyncTask(...)
)()
```

- `prop`: returns the query function for the value of a prop. It can be nested via dots. This is only a property lookup in a object.

```javascript
const getUserName = prop('user.name')

const name = getUserName({ user: { name: 'John' }})  // name === John

return iff(
    getUserName,
    doAsyncTask(...)
)()
```

- `props`: Helper to construct objects where props can be static or dynamically evaluated

```javascript
const createAccountDocument = props({
    user: {
        name: prop('auth.username'),
        token: prop('auth.token'),
        newUser: true,
        team: {
            name: prop('auth.team')  // nested props too :)
        }
    }
})

return each(
    doAsyncAuth(),        // Asumming this adds prop 'auth' to context
    set(createAccountDocument),
    saveToDB()
)()
```

- `createTracer`: Sometimes we need to trace some properties on the context.
This function creates a no-op operation that performs that side-effect for us in a
plugable way. The provided tracer should receive two params `path` and `value`

```javascript
const logger = createTracer((path, value) => {
    // perform a log of the path and the value on our logging service
})

return each(
    doAsyncAuth(),        // Asumming this adds prop 'auth' to context
    set(createAccountDocument),
    logger('user'),
    saveToDB()
)()
```

- `consoleTracer` is a pre-made simple console.log tracer ready to use

```javascript
return each(
    doAsyncAuth(),        // Asumming this adds prop 'auth' to context
    set(createAccountDocument),
    consoleTracer('user'),
    saveToDB()
)()
```

### Error handling

If you need to send and error in the pipeline you must return an exception.
Depending in the context your async function is used the error message alone
will be wrapped in a `ContextError`. This will help error handling to recover and close the necessary resources.

```javascript
const myAsyncTask = () => context => {
    // doing some async stuff

    // oh no we found a error, lets throw
    return Resolve.reject(new Error('MyAsyncTaskError'))
}
```

Passing the context in the error helps cleaning steps in the pipeline.

```javascript
return each(
    connectToDB(),
    myAsyncTask(...),  // This returns an error
    closeDB()          // This never gets executed
)()
```

We might want to capture the error and recover from it to close allocated resources. For that we use the `capture` async helper.

```javascript
return each(
    connectToDB(),
    capture(
        myAsyncTask(...),   // This returns an error
        noop()              // This will be executed only if there is an in the previous call error
    ),
    closeDB()               // This never will be executed
)()
```

Another way to achieve the same goal is to use the `ensure` function.

```javascript
return ensure(
    each(
        connectToDB(),
        myAsyncTask(...),   // This returns an error
    ),
    closeDB()               // This never will be always executed
)()
```

We can also define different error handlers depending on error type (message)

```javascript
return each(
    connectToDB(),
    capture(
        myAsyncTask(...),   // This returns an error
        {
            'AsyncError': noop()              // This will be executed only if there is an in the previous call error,
            'VeryRareAsyncError': logItRemotely()   // Will be executing if error.message === 'VeryRareAsyncError'
        }
    ),
    closeDB()               // This never will be executed
)()
```

Notice that if we don't provide a handler for some error type the whole async function will fail with a promise rejection containing the error.

## So, how to create async pipeline functions

If you are building a async pipeline function from scratch you function signature should
look like this:

```javascript
// Arrow function
const myAsyncFunction = (params) => context => {
    // Async stuff depending on params that prob mutates context
    if (someErrorCondition) {
        return Promise.reject(new Error('MyCustomError'))
    }

    return Promise.resolve(context);
}

// Function notation
function myAsyncFunction (params) {
    return function(context) {
        // Async stuff depending on params that prob mutates context
        if (someErrorCondition) {
            return Promise.reject(new Error('MyCustomError'))
        }

        return Promise.resolve(context);
    }
}


// Usage
return each(
    myAsyncFunction(...),
    otherAsyncFunction(...)
)({ starting: 'context' })
```

This way you can write your own set for mongodb, redis, request, rabbitmq, etc.
