---
title: JS in details [Part 1]
date: "2021-04-30T12:40:18.374Z"
description: "Specification explained"
---

## Navigation {#navigation}

- [Before we start](#before-we-start)
- [Lexical environments](#lexical-environments)
  - [Variables](#lexical-environments-variables)
  - [Function outer lexical environment](#function-outer-lexical-environment)
  - [Declaring/writing variables](#declaring-and-writing-variables)
  - [Specification](#lexical-environments-spec)
      - [Environment Record types](#environment-record-types)
      - [Function outer lexical environment](#function-outer-lexical-environment-spec)
      - [Variable states](#variable-states-spec)
      - [Declaring variables](#declaring-variables-spec)
      - [Reading variables](#reading-variables-spec)
- [Execution Context](#execution-context)
  - [Specification](#execution-context-spec)

## Before we start {#before-we-start}

When I was writing this article, I also wanted to explain the **Event Loop**. But it will be long hours of exploring Blink engine sources, and I can't afford it now. So, in the first part, we only talk about lexical environments and execution contexts.

## Lexical environments {#lexical-environments}

Variables need to be stored somewhere. Lexical environments carry out this task.

They are special objects created as the program executes: for the function body or code block, for every cycle iteration, and so on.

On variable reading/writing, the engine communicates with lexical environments.

Let's figure out how that is happening.

### Variables {#lexical-environments-variables}

Consider the following code:

```js
/* 1st lexical environment */

const one = 1
const bool = true

if (bool) {
  /* 2nd lexical environment */
  
  const two = 2
  
  if (one + two === 3) {
    /* 3rd lexical environment */

    const three = 3
  }

  if (two - one === one) {
    /* 4th lexical environment */
    
    const four = 4
  }
}
```

It's clear that in the 2nd lexical environment, besides variable `two`, we also have access to `one` and `bool`, located in the 1st lexical environment.

In 3rd and 4th lexical environments, we also have access to 1st and 2nd. But 3rd and 4th do not have access to each other: 3rd cannot read the variable `four`, and 4th cannot read `three`.

But why? How does it work under the hood?

The reason is that every lexical environment (except for the global one) has a "parent" - another lexical environment in which the one was created. This "parent" may also be called an outer lexical environment.

Every lexical environment has a link to its "parent". Thereby, collectively, all the lexical environments form a tree structure. The root of this tree is the global lexical environment that was created before the script execution.

For the code from above, the tree looks like the following:

```
  1
   \
    2
   / \
  3   4
```

When we read the variable, the engine searches it in the tree, starting from the current lexical environment and ending the root. This way, it cannot touch the neighbors, so we don't have access to their variables.

So:

- when reading variables in the 3rd lexical environment, the engine searches them in branch `1 -> 2 -> 3`.
- when reading variables in the 4th lexical environment, the engine searches them in branch `1 -> 2 -> 4`.
- when reading variables in the 2nd lexical environment, the engine searches them in branch `1 -> 2`.

### Function's outer lexical environment {#function-outer-lexical-environment}

Consider another situation:

```javascript
/* 1st lexical environment */

const v = 1

function A() {
  /* 2nd lexical environment */

  console.log(v)
}

function B() {
  /* 3rd lexical environment */
  
  const v = 2
  A()
}
```

The function `A` is called in the 3rd lexical environment. But gets the value of `v` from the 1st and doesn't have access to variables of 3rd.

Or imagine we created the function in one module, then imported it in another and called it there. It will not lose access to variables declared in the first module, right? You would say "sure" without even thinking, but do you know why exactly it happens?

The answer is simple: the outer (parent) lexical environment for a function is always the lexical environment where it was created. The place of execution doesn't affect this.

### Declaring/writing variables {#declaring-and-writing-variables}

`let` and `const` declarations are scoped to the block. So, they are always written to the current lexical environment.

But `var` declarations are scoped to the function or the script in case of global level. Thereby, `var` "ignores" the regular code blocks and uses the nearest function/script lexical environment.

Also, there is a function declaration - its scope depends on the mode. When `strict` - it's the nearest block's lexical environment; else - the closest function/script' lexical environment, just like for `var` statements.

Technically, it's strongly related to Execution Context. If you want to know a more in-depth explanation, read ahead.

### Specification {#lexical-environments-spec}

Every lexical environment is an [Environment Record](https://tc39.es/ecma262/#sec-environment-records).

Each Environment Record has some basic API for using it:

- `CreateMutableBinding(N)` and `CreateImmutableBinding(N)` - create a property named `N` (mutable/immutable).
- `InitializeBinding(N, V)` - initialize a property named `N` and assign it a value `V`.
- `SetMutableBinding(N, V)` - set the value `V` for a mutable property named `N`.
- `HasBinding(N)` - check if the lexical environment has a property named `N`.
- `GetBindingValue(N)` - get the value of a property named `N`.
- `DeleteBinding(N)` - delete a property named `N`.
- `HasThisBinding()` - check if the lexical environment has information about `this` binding. We'll learn more about it in the next parts.
- `HasSuperBinding()` - check if the lexical environment has information about `super` binding.
- `WithBaseObject()` - check if the lexical environment was created for the `with` statement. This method is not important for us.

Also, each lexical environment has the internal field `[[OuterEnv]]`, which can be `null` or the reference to the outer lexical environment.

#### Environment Record types {#environment-record-types}

- Declarative Environment Record - a base type used for simple code blocks, switch/case constructions, cycle iterations, etc.

- Function Environment Record - a subclass of Declarative Environment Record, used for functions' lexical environments.

  It also has the following fields:

  - `[[ThisValue]]` - `this` value. It is stored right here.

  - `[[ThisBindingStatus]]` - `this` binding status. The value can be `lexical` / `uninitialized` / `initialized`. 

    - `lexical` - `this` value is taken from the outer lexical environment (arrow functions).
    - `uninitialized` - `this` value is not set yet. It can be, for example, on the stage of creating context.
    - `initialized` - `this` is set.

  - `[[FunctionObject]]` - the function object whose invocation caused this Environment Record to be created.

  - `[[NewTarget]]` - a constructor function. We don't need this information.

- Module Environment Record - a subclass of Declarative Environment Record, used for modules' lexical environments.

  It also has the following fields:

  - `CreateImportBinding(N, M, N2)` - create an immutable indirect binding in a module Environment Record to property `N2` from module `M`. For the current module, it will have the name `N`. Imports use this method; that's why we can't re-define module variable from another module, even when this variable was declared using `let`.

  And it re-defines the method `GetThisBinding()`. A module is always in the `strict` mode, so `this` is always `undefined`. For this reason, `GetThisBinding()` in Module Environment Record returns `undefined`.

- Object Environment Record - used for working with the global object or `with` statement.

  It's like abstraction for using some object as a lexical environment. When using this environment record, we always read/change its binding object.

  It has the following additional fields:

  - `[[BindingObject]]`
  - `[[IsWithEnvironment]]` - was it created for `with` statement?

  Also, this environment record re-defines some default methods to make it work with the object.

- Global Environment Record - used for the top-level lexical environment, created only for the script.

  `[[OuterEnv]]` of this environment record is always `null`.

  It doesn't store variables by itself but contains Object Environment Record and Declarative Environment Record inside.

  It has the following additional fields:

  - `[[ObjectRecord]]` - Object Environment Record, bound to the global object. Used for `var` declarations at global (script) level.
  - `[[DeclarativeRecord]]` - Declarative Environment Record. Used for other declarations.
  - `[[GlobalThisValue]]` - global `this` value. Usually, it references the global object.
  - `[[VarNames]]` - list of `var` declarations at global (script) level.

  And methods:

  - `GetThisBinding()` - returns global `this`.
  - `HasVarDeclaration(N)` - check if `[[VarNames]]` has an element `N`.
  - `HasLexicalDeclaration(N)` - check if `[[DeclarativeRecord]]` has a property named `N`.
  - `HasRestrictedGlobalProperty(N)` - check if the global object has a property named `N`, restricted for re-defining.
  - `CanDeclareGlobalVar(N)` - check if it possible to declare a global variable named `N` using `var`.
  - `CanDeclareGlobalFunction(N)`  - check if it possible to declare a global function named `N` using a function declaration.
  - `CreateGlobalVarBinding(N, D)` - create a global variable named `N` into `[[ObjectRecord]]` (for `var` declarations).
  - `CreateGlobalFunctionBinding(N, V, D)` - create a global function named `N` into `[[ObjectRecord]]` (for function declarations).

#### Function's outer lexical environment {#function-outer-lexical-environment-spec}

[Above](#function-outer-lexical-environment), we talked about the function's outer lexical environment. Let's figure out how it works.

Each function object has a special hidden property, `[[Environment]]`, used to store a reference to the outer lexical environment.

When the function is called, the value of `[[Environment]]` is assigned to the newly created lexical environment's `[[OuterEnv]]` field. Therefore, after the new lexical environment, the search continues there.

#### Variable states {#variable-states-spec}

The bindings in lexical environments can have one of two states:

- not initialized
- initialized

Technically, the variable exists before it is initialized, but usually, we can't use it. We need this information to understand the next chapters.

> Actually, the specification has no information about how this state is determined and stored. Most likely, not initialized bindings have some special value.

#### Declaring variables {#declaring-variables-spec}

Before running the code, the engine scans it for variable and function declarations. For each declaration in the current scope, it creates the binding in the lexical environment. But, depending on the declaration type, there can be some additional actions.

The variables are divided into two groups:

- `varDeclarations` - `var` (in all function code).
- `lexDeclarations` - `let`, `const`, `class` (only in code, which belongs to the current lexical environment).

When scanning the function, the engine does the following:

1. Creates bindings for each of `varDeclarations` and **instantly initializes** them: `var` declarations - with `undefined`, and function declarations - with their function object. That's why we can read these variables before they were declared.
2. Creates bindings for each of `lexDeclarations`, but **doesn't initialize** them. Therefore, when accessing them before the declaration, we get `ReferenceError: Cannot access before initialization`. These bindings are initialized while executing the code.

When scanning the script, the engine does the same, but `varDeclarations` are written in `[[ObjectRecord]]` of the global lexical environment, and `lexDeclarations` - in `[[DeclarativeRecord]]`.

And when scanning any other block, only the 2nd step is used since `varDeclarations` are present only for functions and the script.

#### Reading variables {#reading-variables-spec}

It's much more straightforward.

When accessing the variable, the operation [ResolveBinding](https://tc39.es/ecma262/#sec-resolvebinding) is executed. Inside, it uses [GetIdentifierReference](https://tc39.es/ecma262/#sec-getidentifierreference). This function performs the recursive tree search, starting from the lexical environment passed in and ending with the global lexical environment.

> This operation doesn't check the variable initialization state. Most likely, this functionality is implemented by the engine.

## Execution context {#execution-context}

Consider the following code:

```js
/* 1st lexical environment */

A()

function A() {
  /* 2nd lexical environment */
  
  const one = 1
  B()
  return one
}

function B() {
  /* 3rd lexical environment */

  const two = 2
}
```

For the code from above, the tree looks like that:

```
  1
 / \
2   3
```

The function `B` is called into the function `A`. And as we learned before, the 1st lexical environment is the outer lexical environment for both 2nd and 3rd, no matter where their functions were called.

So, when the function `B` execution ends, and the function `A` retakes the control, how can we determine that we should use the 2nd lexical environment now if we have only the branch `1 -> 3`? If we try to use the `B` function's outer lexical environment, it will be the wrong choice.

Besides, how we know what lexical environment is active at the current moment? And how can we get the target lexical environment for a `var` variable?

We need something for controlling our code execution and operating the lexical environments.

Exactly for these purposes, the **Execution Context** was invented.

Execution Context is a special structure used to store the code execution state and references for the actual lexical environments. It is created for every script, module, function, or `eval` execution.

An execution context is only deleted after its associated part of the code finished the execution. So, there can be many execution contexts (but only one of them is active and executing the code).

Collectively, all the execution contexts are stored as a [LIFO](https://en.wikipedia.org/wiki/Stack_(abstract_data_type)) stack called **Execution Stack** (or Call Stack in other words). For the initial script execution, the first element of the stack is always the global execution context created for the script. Then, as the code runs, the engine can add function/module execution contexts to the end of the stack. The last element of the stack is always the **running** execution context.

Let's look on the code again:

```js
/* 1st lexical environment */

A()

function A() {
  /* 2nd lexical environment */
  
  const one = 1
  B()
  return one
}

function B() {
  /* 3rd lexical environment */

  const two = 2
}
```

1. Initially, the execution stack is empty: `[]`.
2. When the script is starting to execute, the stack looks like that: `[script]`
3. When the function `A` is called, it goes to the stack: `[script, A]`
4. The function `B` is called, but `A` execution is not finished yet. `[script, A, B]`
5. The `B` execution is finished. We go back to `A`. `[script, A]`
6. The function `A` returns the results and finishes the execution. We go back to script. `[script]`
7. There is nothing more to execute. The execution stack becomes empty again: `[]`
8. The empty stack is not always the end. Promises, timeouts, events - all these can fill the stack and make code execute again. But this is a topic related to the Event Loop.

### Specification {#execution-context-spec}

References:
- [Execution Context](https://tc39.es/ecma262/#sec-execution-contexts)
- [Execution / Call Stack](https://tc39.es/ecma262/#execution-context-stack)

An execution context contains the following elements:

- Any state needed to perform, suspend, and resume evaluation of the code associated with this execution context.
- `Function` - the function object, which code is executed (`null` for script/module).
- `ScriptOrModule` - an object of script/module, which code is executed (`null` for functions).
- `Realm` - a special object, containing the base runtime's things.

And the most important:

- `VariableEnvironment` - it's constant and points to the root lexical environment for the code associated with this execution context. The `var` declarations are always written here.
- `LexicalEnvironment` - the current lexical enviroment. Initially, it's the root lexical environment (as in `VariableEnvironment`), but it can change as the code runs. The newly created lexical environments' `[[OuterEnv]]` always points to the previous `LexicalEnvironment` value, so execution context can restore it back after leaving the nested block.

And now a little rough demo (`VE` = `VariableEnvironment`, `LE` = `LexicalEnvironment`):

```js
///////
// 1 //
///////

/*
 * Execution stack: [
 *   script: { VE: 1, LE: 1 }
 * ]
 */

A()

function A() {
  ///////
  // 2 //
  ///////
  
  /*
   * Execution stack: [
   *   script: { VE: 1, LE: 1 },
   *   A: { VE: 2, LE: 2 }
   * ]
   */
  
  if (3 > foo) {
    ///////
    // 3 //
    ///////
    
    /*
     * Execution stack: [
     *   script: { VE: 1, LE: 1 },
     *   A: { VE: 2, LE: 3 }
     * ]
     */
    
    const foo = 2 // goes in LE
    var zoo = 3 // goes in VE
    
    B()
  }
  
  /*
   * Execution stack: [
   *   script: { VE: 1, LE: 1 },
   *   A: { VE: 2, LE: 2 }
   * ]
   */
  
  D()
}

function B() {
  ///////
	// 4 //
	///////
  
  /*
   * Execution stack: [
   *   script: { VE: 1, LE: 1 },
   *   A: { VE: 2, LE: 3 },
   *   B: { VE: 4, LE: 4 }
   * ]
   */
  
  console.log('Hello!')
  
  C()
}

function C() {
  ///////
  // 5 //
  ///////
  
  /*
   * Execution stack: [
   *   script: { VE: 1, LE: 1 },
   *   A: { VE: 2, LE: 3 },
   *   B: { VE: 4, LE: 4 },
   *   C: { VE: 5, LE: 5 }
   * ]
   */
  
  const bar = 'baz'
  
  if (bar) {
    ///////
    // 6 //
    ///////
    
    /*
     * Execution stack: [
     *   script: { VE: 1, LE: 1 },
     *   A: { VE: 2, LE: 3 },
     *   B: { VE: 4, LE: 4 },
     *   C: { VE: 5, LE: 6 }
     * ]
     */
    
    return 1
  }
  
  return 2
}

function D() {
  ///////
  // 7 //
  ///////
  
  /*
   * Execution stack: [
   *   script: { VE: 1, LE: 1 },
   *   A: { VE: 2, LE: 2 },
   *   D: { VE: 7, LE: 7 },
   * ]
   */
}
```