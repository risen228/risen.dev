---
title: Cooking selectors
date: "2020-07-20T12:34:37.608Z"
description: "You can do a lot of things without reselect!"
---

Redux, unlike Effector and many other state-managers, by itself doesn't provide a convenient way to get and combine data from the store. Selectors were created to address this problem. And they sort of stand as a getters for extracting specific parts of the state.

```js
// src/features/cart/module/selectors.js

// Cart state selector
export const everything = state => state.cart

// Items added to the cart
export const items = state => everything(state).items

// Bonuses that will be collected from successful purchase
export const collectedBonuses = state => everything(state).collectedBonuses

/*
 * Total purchase amount
 * Here we use createSelector function from reselect.
 * In this case it needed to prevent extra computations.
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

To use selectors in the most effective way, we should follow some rules.

### Encapsulation {#encapsulation-rule}

Selector is allowing us to hide some logic responsible for getting a specific part of the state.

Thereby, external code (including other selectors) doesn't need to know about details like property path to state's part.

```js
/*
 * Option 1
 * Here we specify the full path to state slice.
 * 
 * And if some key changes (cart for example),
 * we will need to update all 3 lines of code.
 * 
 * It can become a serious problem in big applications.
 */
const everything = state => state.cart
const items = state => state.cart.items 
const collectedBonuses = state => state.cart.collectedBonuses

/*
 * Option 2
 * Here we rely on other selectors.
 * 
 * And if some key changes,
 * we will need to update only 1 line of code.
 * 
 * For example, in case of 'card' it will be only selector 'everything'.
 * 
 * So, each of selectors is responsible only for its slice of the state.
 * It's easy to maintain and refactor.
 */
const everything = state => state.cart
const items = state => everything(state).items 
const collectedBonuses = state => everything(state).collectedBonuses
```

### Reusability {#reusability-rule}

We can declare a selector once, and then use it everywhere in the app. In this case, reusability is the consequence of encapsulation.

```js
/*
 * Bad!
 * 1) We can't use it in other selectors.
 * 2) If some path changes, we will need to update a lot of components
 *    relying on this selector. Just like in example from encapsulation section.
 */
useSelector(state => state.cart.items)

/*
 * Good.
 * 1) We use already declared selector.
 * 2) If some path changes, we will only need to update the selector
 */
useSelector(cartSelectors.items)
```

## Selector types {#selector-types}

- Memoized selectors, created using `createSelector` function from `reselect`
- Not memoized selectors (it's just a simple function)

### Memoized {#memoized-selectors}

The example from `reselect` repository can give us a wrong understanding of how and where memoized selectors should be used.

After seeing this library in the first time, a lot of people start using `createSelector` literally everywhere. Of course, this is the wrong approach. Memoized selectors are good only in some situations.

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

We don't need to re-calculate a value until the input data have changed.

Any state change leads to every `mapStateToProps` and `useSelector` to being executed. And if we use not memoized function for selector, all heavy computations will be re-computed every time, no matter whether their input data was changed or not.

It means, for example, when user opens/closes some global modal, which state lies in redux store, we will re-calculate all the values coming from not memoized selectors, even if the shopping card is not relying on this modal at all.

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

This selector aren't doing any heavy computations, but it returns an object.

Without memoization, on each call it will return the new object, even when input data is remained the same. `mapStateToProps` and `useSelector` will count it as data change and component will re-render.

Memoized selector, on the other hand, will return the same reference all the time, until the input data have changed. So, there will be not extra re-renders.

This can be applied for any values which are object technically (arrays, instances of `Date`, `Map`, `Set`, and so on). We will call it just an "object" for simplicity.

There can be another case:

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

This selector returns a primitive value and doesn't do any heavy computations. So, from optimization point of view, we don't need to use `createSelector` here. Moreover, it will take more memory and will do more work than just a simple function:

```js
const somePrimitive = state => {
  return isA(state) && isB(state) && isC(state)
}
```

Sadly, this doesn't look so good and simple.

In situations like this, I prefer using `createSelector` version, even while it's not so fast and takes some memory. It's just not a big problem in context of entire application.

### Simple (not memoized) {#not-memoized-selectors}

```js
const everything = state => state.cart

const items = state => everything(state).items

const calculation = state => everything(state).calculation

const bonuses = state => calculation(state).bonuses
```

Use it if you need to get some data directly from the store, without any calculations or composition.

Don't worry even if return type is object - you will just get the reference to already existing object, which is located in the store. It won't lead to any problem.

Memoized selectors are not good in cases like this. First, they are about 30 times slower. And second, they are need some memory for storing previous computations data. Those problems are not so visible, but they can become if you use it everywhere.

## useSelector in details {#use-selector-in-details}

It may seem that `useSelector` is allowing us to not using memoized selectors, but it is not.

The first reason - function passed into it is executed for every change in the store. It means that every heavy computation will re-calculate, no matter what slice of the state was changed. `useSelector` has no way to compare the input data, since it just taking the function with single parameter `state`.

The second - it would be a bad idea to throw out a composition (that was described [there](#data-mapping-and-composition)). We can't do the same without `reselect`, or we will have to write the own helper.

To prevent the re-render when selector's result remained the same, `useSelector` compares the results of current and previous calls of the function (just like `connect` works with `mapStateToProps`).

It uses `===` for comparison, so in case of objects - it won't work and component will be re-rendered. And in case of primitives it still will do the computations, but without re-render.

Therefore, it's not a good idea to "replace" `reselect` with `useSelector`:

```js
/*
 * Selector function will be called on any change in store's state.
 * And our component will re-render every time, since the function returns an object.
 * We can solve the problem if we pass shallowCompare as a second argument, but it's just a kludge.
 * The good solution is to divide it into two calls of useSelector (1st for one, 2nd for two)
 * (it's just an example, don't declare selector functions directly in component)
 */
useSelector(state => ({
  one: state.one,
  two: state.two
}))
```

## A conclusion {#conclusion}

**Follow the main rules:**

- Declare selectors only once (on a module level for example) and use it in other parts of your app.
- Doesn't count on `useSelector` in terms of optimization. It just prevents the re-rendering when `===` comparison between current and previous results returned `true`.

**Use simple selectors without memoization when:**

- You want to get the value from the store, without modifying it.
- *(optional)* You need to apply a simple operation to some value, and the result of this operation has a primitive type.

**Use memoized selectors when:**

- Selector contains heavy computations.
- Selector returns a new object every time.
