---
title: My perfect Redux architecture
date: "2020-01-30T00:37:42.751Z"
description: "The devil never looked so good."
---

I've seen many times how people make common architectural mistakes using Redux. And even experienced people do it sometimes. These mistakes push the application into a pit of despair, pain, and destruction.

The things I wrote in this post are the result of my long experience with Redux. So I hope these practices help you break the vicious circle of violence.

## So, what's the point? {#so-whats-the-point}

I will use "pure" Redux since it's easier to understand for everyone. There are many things like `@reduxjs/toolkit`, but nothing prevents you from adapting this architecture for them.

**Module** is the primary unit in this architecture. It can be global or local.

The global ones are located near the store since they cannot be bound to a specific feature. The information about the current user, authentification, global application modals, and anything like these are the global modules.

The local modules are always located inside some feature. It can be a data slice for user profiles, notes, or tasks, for example.

Each module has the following structure:

```tree
counter
 ┣ types.js
 ┣ reducer.js
 ┣ actions.js
 ┣ selectors.js
 ┗ index.js
```

By the order:

- `types.js`

This is the action types.

```js
export const INCREASE = 'counter/INCREASE'
export const DECREASE = 'counter/DECREASE'
export const SET_COUNT = 'counter/SET_COUNT'
export const RESET = 'counter/RESET'
```

- `reducer.js`

I think you already know what that is for.

```js
import * as types from './types'

const initialState = 0

export function reducer(state = initialState, action) {
  const { payload } = action

  switch(action.type) {
    case types.INCREASE:
      return state + 1

    case types.DECREASE:
      return state - 1

    case types.SET_COUNT:
      return payload

    case types.RESET:
      return initialState

    default:
      return state
  }
}
```

- `actions.js`

Here we keep all of our action creators and thunks.

```js
import * as types from './types.js'

export const increase = () => ({ type: types.INCREASE })
export const decrease = () => ({ type: types.DECREASE })

export const setCount = count => ({
  type: types.SET_COUNT,
  payload: count
})

export const reset = () => ({ type: types.RESET })
```

- `selectors.js`

Selectors. You can discover more about them [here](/posts/cooking-selectors).

```js
export const everything = state => state.counter

export const count = state => everything(state)
```

- `index.js`

It is the most exciting part.
In this place, we define the public API for our module.

We "pack" actions and selectors into the objects, which are much more convenient for using outside:
1. We write only one import line for each module.
2. It prevents any conflicts between modules' action/selector names.
3. We can pass the group of actions into a component just by one line of code.

```js
import { reducer } from './reducer'
import * as selectors from './selectors'
import * as actions from './actions'

export {
  reducer as counterReducer,
  selectors as counterSelectors,
  actions as counterActions
}
```

**An important note:**
Sometimes, we need to use the same module's selectors in actions.
In this case, import them just like actions types, using `import * as selectors`.
Otherwise, there is a significant risk of getting a circular dependency.

## The view from outside {#the-view-from-outside}

Let's connect a module to the component.

In good ol' times, we used `connect` for these purposes. But now, after React team introduced hooks, this task has become a lot easier.

Before we start, let's write a nice magic hook, `useActions`, that will get bound actions for us. I call it magic because, in one line, it allows us to do such a big boilerplate job and hide `dispatch` inside.

`useActions` was removed from `react-redux` since mighty [Dan Abramov was against this practice](https://github.com/reduxjs/react-redux/issues/1252#issuecomment-488160930).  
But it's not our problem; we use this hook for a reason.

That's how it looks:

```js
import { useDispatch } from 'react-redux'
import { useMemo } from 'react'
import { bindActionCreators } from 'redux'

export function useActions(actions) {
  const dispatch = useDispatch()

  const boundActions = useMemo(() => {
    return bindActionCreators(actions, dispatch)
  }, [actions, dispatch])

  return boundActions
}
```

Let's try it in the component:

```jsx
export const Counter = () => {
  const count = useSelector(counterSelectors.count)
  const { increment, decrement, reset } = useActions(counterActions)

  return (
    <div>
      <p>Count: {count}</p>
      <div>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
```

The only problem you can run into is when you need to get two actions with the same name from the different modules.  
It's a rare situation, but it's real.  
Most often, it will be enough to rename the action through destructuring assignment:

```js
const { reset: resetUsers } = useActions(usersActions)
const { reset: resetBlacklist } = useActions(blacklistActions)
```

## Folder structure example {#folder-structure-example}

Based on [feature slices](https://featureslices.dev/).

```tree
src
 ┣ features
 ┃ ┣ files
 ┃ ┃ ┣ modules
 ┃ ┃ ┃ ┗ files
 ┃ ┃ ┃ ┃ ┣ actions.js
 ┃ ┃ ┃ ┃ ┣ index.js
 ┃ ┃ ┃ ┃ ┣ reducer.js
 ┃ ┃ ┃ ┃ ┣ selectors.js
 ┃ ┃ ┃ ┃ ┗ types.js
 ┃ ┃ ┣ Files.js
 ┃ ┃ ┗ index.js
 ┃ ┗ users
 ┃ ┃ ┣ modules
 ┃ ┃ ┃ ┗ users
 ┃ ┃ ┃ ┃ ┣ actions.js
 ┃ ┃ ┃ ┃ ┣ index.js
 ┃ ┃ ┃ ┃ ┣ reducer.js
 ┃ ┃ ┃ ┃ ┣ selectors.js
 ┃ ┃ ┃ ┃ ┗ types.js
 ┃ ┃ ┣ Users.js
 ┃ ┃ ┗ index.js
 ┣ pages
 ┃ ┣ files
 ┃ ┃ ┗ index.js
 ┃ ┣ users
 ┃ ┃ ┗ index.js
 ┃ ┗ main
 ┃ ┃ ┗ index.js
 ┣ lib
 ┃ ┗ store
 ┃ ┃ ┣ modules
 ┃ ┃ ┃ ┣ global-modals
 ┃ ┃ ┃ ┃ ┣ actions.js
 ┃ ┃ ┃ ┃ ┣ index.js
 ┃ ┃ ┃ ┃ ┣ reducer.js
 ┃ ┃ ┃ ┃ ┣ selectors.js
 ┃ ┃ ┃ ┃ ┗ types.js
 ┃ ┃ ┃ ┗ session
 ┃ ┃ ┃ ┃ ┣ actions.js
 ┃ ┃ ┃ ┃ ┣ index.js
 ┃ ┃ ┃ ┃ ┣ reducer.js
 ┃ ┃ ┃ ┃ ┣ selectors.js
 ┃ ┃ ┃ ┃ ┗ types.js
 ┃ ┃ ┣ store.js
 ┃ ┃ ┣ root-reducer.js
 ┃ ┃ ┗ index.js
 ┣ ui
 ┃ ┗ templates
 ┃ ┃ ┗ common.js
 ┣ App.js
 ┗ index.js
```

## Conclusion {#conclusion}

As you see, even Redux can become clean if you do some tweaks.

However, I recommend you to check more modern and convenient state-managers, for example, [Effector](https://effector.dev/) and [Reatom](https://reatom.js.org/).