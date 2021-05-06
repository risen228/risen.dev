---
title: Cooking selectors
date: "2020-07-20T12:34:37.608Z"
description: "You can do a lot of things without reselect!"
---

Redux, unlike [Effector](https://effector.dev/) and many other state-managers, by itself doesn't provide a convenient way to get and combine data from the store. Selectors were created to address this problem. They act as sort of getters, extracting specific parts of the state.

```js
// src/features/cart/module/selectors.js

// Cart state selector
export const everything = state => state.cart

// Items added to the cart
export const items = state => everything(state).items

// Bonuses that will be collected from a successful purchase
export const collectedBonuses = state => everything(state).collectedBonuses

/*
 * Total purchase amount
 * Here we use createSelector function from reselect.
 * In this case, it is needed to prevent extra computations.
 * We will learn more about this type of selectors later on.
 */
export const totalAmount = createSelector(
  items,
  items => items.reduce((acc, item) => {
    const { price, count } = item
    return acc + price * count
  }, 0)
)
```

## Main rules of using selectors {#rules}

To use selectors most effectively, we should follow some rules.

### Encapsulation {#encapsulation-rule}

Selectors allow us to hide some logic responsible for getting a specific part of the state.

Therefore, external code (including other selectors) doesn't need to know about details like property path to the state's part.

```js
/*
 * Option 1
 * Here we specify the full path to state slice.
 * 
 * And if some property changes ('cart' for example),
 * we'll have to update all three lines of code.
 * 
 * It can become a real problem in big applications.
 */
const everything = state => state.cart
const items = state => state.cart.items 
const collectedBonuses = state => state.cart.collectedBonuses

/*
 * Option 2
 * Here we rely on other selectors.
 * 
 * And if some property changes,
 * we'll have to update only 1 line of code.
 * 
 * For example, in the case of 'cart', it will be only selector 'everything'.
 * 
 * So, each of the selectors is responsible only for its slice of the state.
 * It's easy to maintain and refactor.
 */
const everything = state => state.cart
const items = state => everything(state).items 
const collectedBonuses = state => everything(state).collectedBonuses
```

### Reusability {#reusability-rule}

We can declare a selector once and then use it everywhere in the app. In this case, reusability is the consequence of encapsulation.

```js
/*
 * Bad!
 * 1) We can't use it in other selectors.
 * 2) If some path changes, we will need to update a lot of components
 *    relying on this selector.
 *    Just like in the example from encapsulation section.
 */
useSelector(state => state.cart.items)

/*
 * Good.
 * 1) We use the already declared selector.
 * 2) If some path changes, we will only have to update the selector
 */
useSelector(cartSelectors.items)
```

## Selector types {#selector-types}

- Memoized selectors, created using `createSelector` function from `reselect`
- Not memoized selectors (it's just a simple function)

### Memoized {#memoized-selectors}

The example from `reselect` repository can give us a wrong understanding of how and where memoized selectors should be used.

After seeing this library for the first time, a lot of people start using `createSelector` literally everywhere. Of course, this is a wrong approach. Memoized selectors are good only in some situations.

Here are the main cases for using them:

#### Heavy computations {#heavy-computations}

```js
// only paid items
const paidItems = createSelector(
  items,
  items => items.filter(filters.onlyPaid)
)

// only paid amount
const paidAmount = createSelector(
  paidItems,
  items => items.reduce(reducers.total, 0)
)

// total purchase amount
const totalAmount = createSelector(
  items,
  items => items.reduce(reducers.total, 0)
)
```

We don't need to re-calculate a value until the input data has changed.

Any state change leads to every `mapStateToProps` and `useSelector` to being executed. And if we use a not memoized function for selector, all heavy computations will be re-computed every time, no matter whether their input data was changed or not.

It means, for example, when the user opens/closes some global modal, which state lies in redux store, we will re-calculate all the values coming from not memoized selectors, even if the shopping cart is not relying on this modal at all.

#### Data mapping and composition {#data-mapping-and-composition}

```js
const loadingState = createSelector(
  isLoading,
  isLoaded,
  isFailed,
  (isLoading, isLoaded, isFailed) => ({
    isLoading,
    isLoaded,
    isFailed
  })
)
```

This selector doesn't do any heavy computations, but it returns a new object on each call, even when input data remains the same. `mapStateToProps` and `useSelector` will count it as data change, and the component will re-render.

On the other hand, a memoized selector will return the same reference all the time until the input data has changed. So, there won't be any extra re-renders.

This rule applies to any values which are an object technically (arrays, instances of `Date`, `Map`, `Set`, and so on). We will call it just an "object" for simplicity.

There could be another case:

```js
const somePrimitive = createSelector(
  isA,
  isB,
  isC,
  (isA, isB, isC) => {
    return isA && isB && isC
  }
)
```

This selector returns a primitive value and doesn't do any heavy computations. So, from an optimization point of view, we don't need to use `createSelector` here. Moreover, it will take more memory and will do more work than just a simple function:

```js
const somePrimitive = state => {
  return isA(state) && isB(state) && isC(state)
}
```

Sadly, this doesn't look so good and simple.

I prefer using `createSelector` version in situations like this, even if it's not so fast and takes some memory. It's just not a big problem in the context of an entire application.

### Simple (not memoized) {#not-memoized-selectors}

```js
const everything = state => state.cart

const items = state => everything(state).items

const calculation = state => everything(state).calculation

const bonuses = state => calculation(state).bonuses
```

Use it if you need to get some data directly from the store, without any calculations or composition.

Don't worry; even if the return type is an object, you will get the reference to an already existing object, which is located in the store. It won't lead to any problems.

Memoized selectors are not good in cases like this. First, they are about 30 times slower. And second, they need some memory for storing previous computations data. These problems are not usually visible, but they may become such if you use memoized selectors everywhere.

## useSelector in details {#use-selector-in-details}

It may seem that `useSelector` allows us not to use memoized selectors, but it is not.

The first reason: the function passed in there will be called for every change in the store. It means that every heavy computation will re-calculate, no matter what slice of the state was changed. `useSelector` has no way to compare the input data since it just takes the function with a single parameter `state`.

The second reason: it would be a bad idea to throw out a [composition](#data-mapping-and-composition). We can't do the same thing without `reselect`, or else we'll have to write an additional helper.

To prevent the re-render when the selector's result remains the same, `useSelector` compares the results of current and previous calls of the function (just like `connect` works with `mapStateToProps`).

It uses `===` for comparison, so in the case of objects - it won't work, and the component will be re-rendered. And in the case of primitives, it still does the computations but without re-render.
Therefore, it's not a good idea to "replace" `reselect` with `useSelector`:

```js
/*
 * The selector function will be called on any change in the state.
 * And our component will re-render every time, since the function always returns a new object.
 * We can solve the problem if we pass shallowCompare as a second argument, but it's just a kludge.
 * The good solution is to divide it into two calls of useSelector (1st for one, 2nd for two).
 * (this is only an example; do not declare selector functions directly in components)
 */
useSelector(state => ({
  one: state.one,
  two: state.two
}))
```

## Conclusion {#conclusion}

**Follow the main rules:**

- Declare selectors only once (on a module level, for example) and use them in other parts of your app.
- Do not count on `useSelector` in terms of optimization. It just prevents the re-rendering when `===` comparison between current and previous results returned `true`.

**Use simple selectors without memoization when:**

- You want to get a value exactly from the store (without computations/composing).
- *(optional)* You need to apply a simple operation to some value, and the result of this operation is a primitive type.

**Use memoized selectors when:**

- The selector contains heavy computations.
- The selector returns a new object every time.
