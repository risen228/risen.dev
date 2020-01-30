---
title: Моя идеальная архитектура Redux
date: "2020-01-30T00:37:42.751Z"
description: "Дьявол никогда не выглядел так хорошо."
---

Я часто вижу, как начинающие и даже опытные редаксеры допускают ошибки в архитектуре, обрекая приложение на неизбежное погружение в пучину горя, боли и разрушения. 

К тому, что перечислено в этом посте, я пришел за несколько лет использования Redux, и надеюсь эти практики помогут вам разорвать порочный круг насилия.

## Итак, в чем же суть?

Будем рассматривать все на примере самого обычного "голого" редакса, без `@reduxjs/toolkit` и подобных штук.  
Ничто не помешает вам адаптировать этот подход и под другие инструменты.

Основная единица архитектуры - это **модуль**. Они могут быть глобальными и локальными.

Глобальные находятся рядом со стором, так как они не закреплены за определенной фичей.  
Данные о юзере и авторизации, состояние общих для приложения модалок и все такое - это глобальные модули.

Локальные модули всегда закреплены за определенной фичей и находятся внутри ее.  
К локальным модулям можно отнести список пользователей, заметки, задачи.

Модуль имеет следующую структуру:

```
counter
 ┣ actions.js
 ┣ index.js
 ┣ reducer.js
 ┣ selectors.js
 ┗ types.js
```

По очереди:

- `types.js`

Здесь в виде констант находятся типы экшнов.

```js
export const INCREASE = 'counter/INCREASE'
export const DECREASE = 'counter/DECREASE'
export const SET_COUNT = 'counter/SET_COUNT'
export const RESET = 'counter/RESET'
```

- `reducer.js`

Не трудно догадаться, что тут обитает редьюсер.

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

Здесь живут наши экшны (если точнее, action creators).

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

Селекторы, которым, кстати, будет посвящена отдельная статья.

```js
export const everything = state => state.counter

export const count = state => everything(state)
```

- `index.js`

Здесь начинается самое интересное.  
В этом файле модуль объявляет свое внешнее api.

Данная архитектура интересна тем, что селекторы и экшны "упаковываются" в объекты, и в таком виде их становится очень удобно использовать снаружи.  
Благодаря этому мы не засоряем файлы кучей импортов, а просто импортируем группы селекторов/экшнов определенного модуля.  
Также это позволяет давать селекторам понятные имена и избегать конфликтов с другими модулями, а экшны передавать внутрь компонента сразу группой, без перечисления.

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

**Важная заметка:**  
Иногда в экшнах нужно использовать селекторы из этого же модуля.  
В таком случае их нужно импортировать как и типы экшнов, через `import * as selectors`.  
Иначе высок риск столкнуться с циклической зависимостью.

## Вид снаружи

Теперь нам нужно подключить модуль к компоненту.

Раньше для этого всегда использовались `mapStateToProps` и `mapDispatchToProps`, но теперь, с появлением хуков, все делается намного проще и элегантнее. Но помимо базовых `useSelector` и `useDispatch` нам понадобится магический хук `useActions`. Магическим он является потому, что позволяет невероятно легко получить за`bind`женные экшны в компоненте, избавляя нас от необходимости оборачивать их в `dispatch` руками.

`useActions` был удален из `react-redux`, так как великий Дэн Абрамов [был против такого подхода](https://github.com/reduxjs/react-redux/issues/1252#issuecomment-488160930).  
Но к счастью, слова Дэна нас не касаются, так как мы будем использовать этот хук разумно.

Вот так он выглядит:

```js
import { useDispatch } from 'react-redux'
import { useMemo } from 'react'
import { bindActionCreators } from 'redux'

export function useActions(actions) {
  const dispatch = useDispatch()

  const boundActions = useMemo(() => {
    return bindActionCreators(actions, dispatch)
  }, [])

  return boundActions
}
```

А теперь используем все это в компоненте:

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

Единственная проблема возникает тогда, когда нам нужны экшны с одинаковыми именами из разных модулей.  
Ситуация редкая, но случиться может.  
Чаще всего будет достаточно просто положить значение в другую переменную при деструктуризации:

```js
const { reset: resetUsers } = useActions(usersActions)
const { reset: resetBlacklist } = useActions(blacklistActions)
```

## Небольшие итоги

Как мы видим, даже такой монстр как редакс может быть вполне юзабелен.

Тем не менее, рекомендую ознакомиться с более современными и удобными стейт-менеджерами, такими как [Effector](https://effector.now.sh/) и [Reatom](https://reatom.js.org/).