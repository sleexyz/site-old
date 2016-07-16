---
title: Canonical Instances are Problematic.
---

After half a year of playing with Haskell, I've found that typeclasses have the most interesting effects on the language. Haskell would definitely not be Haskell without typeclasses; they can be credited for contributing to the incredible expressiveness of Haskell syntax, but they also present a few issues systemic to the language.

In my opinion the greatest benefit of typeclasses to Haskell is enabling the language's signature concision: At the core, typeclasses are simply a mechanism for type-driven *ad-hoc* polymorphism. Typeclasses relegate instance resolution to the problem of typing, and so therefore instances can be inferred whenever types can be inferred. In Haskell inference can be done almost everywhere, which means this mechanism of name-resolution almost never requires annotation! This allows us to use the same operator `+` whether we mean addition on `Int`'s or addition on `Float`'s, or use the same function `show` to show `Int`'s or lists of `Int`'s.


However, typeclasses do not come without their problems, and these problems all stem from the fact that typeclasses require *canonical* instances for [coherent](http://blog.ezyang.com/2014/07/type-classes-confluence-coherence-global-uniqueness/) type-driven instance resolution. Why canonical instances, i.e. globally unique instances? Without canonical instances, a program's behavior would need to be determined by more than just a typing judgment. 

Here are what I think are the three most problematic issues that arise from Haskell's requirement of canonical instances:


## 1. We're stuck with arbitrary conventions.

`(,)` has an included implementation of `Functor`, which is over functorial over the second parameter. But what if I want to `fmap` over the first parameter?

One can easily come up with two natural instances of `Monoid for `Int`. In actually, `Int` has no , because we can't choose one out of two natural implementations. Instead, we force our users to awkwardly convert their values to *different* types: `Sum Int` or `Product Int`!


These category-theoretic typeclasses at the end of the day are not *descriptive* of our type, but are *prescriptive* of our types.


## 2. We have to create new types if we want to use our type differently.

Despite all the 
Haskell types are not simply algebraic constructions with names! Canonicity causes Haskell types have corresponding *permutations of typeclass instances*.

> `Haskell Type = ADT + Name + (Permutation of instances)`


How do we use a different permutation of typeclass instances for a type? The name of the game in Haskell is `newtype`. 

However, `newtype` doesn't fix the fact that now we've created an entirely new type; these types don't interact at all without conversion! The problem is each time we require a different functionality, we need to create a new type.

*"But newtyping is good practice to prevent mistyping!"*  This is true, but it's orthogonal to whether or not we should be forced to newtype just to use another implementation of a signature. A type's interaction with other types should be external to the type; we shouldn't be forced to create a bunch of definitionally equivalent types just to work around the a limitation of typeclasses.



> **3. Our language becomes non-modular.**

Despite the previously mentioned ergonomic annoyances, the most serious side effect of requiring canonicity is that it leads *non-modular code* and a *non-modular ecosystem*.

In Haskell, imposing global uniqueness of instances forces us to think globally, not only across our codebase, but also with anticipation to future states of our codebase! This is regardless or not we have orphan instances, aka instances defined in neither the module of the  class or of the type:

If we allow orphan instances, then we cannot arbitrarily compose two pieces of code, because they could have overlapping implementations of a typeclasses for the same type!

If we don't allow orphan instances, then we have to anticipate all future uses of the type when we create our type! So for library writers cannot just define a type for it to be useful; they have to also define all the ways to use it!


In Haskell, we use typeclasses to achieve *ad-hoc polymorphism*, i.e. *type-directed* name-resolution. Because we want our programs to be [coherent](http://blog.ezyang.com/2014/07/type-classes-confluence-coherence-global-uniqueness/), we can only have one instance of a typeclass for a given type, i.e. *canonicity* of instances. 
Canonicity has the benefit of making reasoning easier for the compiler and the programer because given any valid typing judgement, our program can only mean one thing. However, it has a few pervasive side effects:

