---
title: "Typeclasses, revisted"
date: 2016-12-18
---

I wrote [a post](./posts/typeclasses) a while ago about issues I saw with typeclasses, namely how they

1. weaken the generality of types *in the presence of canonicity*
2. are nonideal for describing algebraic structures *in the presence of canonicity*
3. introduce non-modulary of one's codebase/the whole ecosystem *in the presence of canonicity*

I've realized that these issues I raised are less about typeclasses themsleves, but more about how typeclasses are *(ab)used* in the absence of something like ML's modules system.

If we suspend our annoyance for Haskell's lack of a proper parametrized module system (and maybe we can with [Backpack](http://blog.ezyang.com/category/haskell/backpack/)), then we can consider the real power typeclasses give you: not that of just ad-hoc polymorphism, but that of constraint-based *program synthesis*!

## Typeclasses as Deterministic Constraint-Based Metaprogramming
From a logic programming perspective, Haskell's typeclass system amounts to a *deterministic* constraint-based metaprogramming

#### Deterministic
Given a set of constraints and query, Haskell's typeclass resolution allows at most one answer, i.e. canonicity of instances.
This to constrast with most logic programming languages, which support [non-determinism](https://en.wikipedia.org/wiki/Nondeterministic_programming)

#### Constraint-Based
Every instance declaration in Haskell comes in two parts; the constraint declaration, and the function definitions.

TODO: elaborate ("haha")

### Metaprogramming
Typeclasses are ultimately mechanisms for compile-time generation of terms. In a language with typeclasses, one can, instead of always referencing terms by their binders, *generate* them during the elaboration phase of compilation.

Because typeclasses are often thought as extensions to the typesystem, this point of view is rarely brought up. Under this perspective, GHC actually supports two(!) "languages" for metaprogramming: Template Haskell *and* the constraint language!


## Typeclasses for Program Synthesis

Although typeclasses were invented as a principled solution to the problem of ad-hoc polymorphism, the way the constraint system has evolved has turned it into a powerful language for program synthesis. Under this perspective, ad-hoc polymorphism seem like just a minor detail.


[Servant Client](https://hackage.haskell.org/package/servant-client) is a prime example of a real-world example of how typeclasses allow for program synthesis. Servant API's are essentially type declarations that are sufficiently rich in information to generate a set of API client

Haskell's support for generic programming essentially amounts to giving the constraint system additional compile-time information about types. This gives us the ability to do things like [*derive* JSON serializers and deserializers](https://artyom.me/aeson#records-and-json-generics) for our types just based on information annotated by GHC, which we get for free!

## Typeclasses for Proof Generation
By Curry-Howard, if typeclasses can be thought of a constraint-based mechanism for type-directed program synthesis, typeclases can also be thought of a constraint-based mechanism for type-directed *proof generation*.

[This Agda-wiki article](http://agda.readthedocs.io/en/latest/language/instance-arguments.html#proof-search) gives a simple example of this in Agda.

This is to contrast with *tactics*, which provide a more direct method for metaprogramming proofs.

## Typeclasses and Dependent Types

While writing production Haskell at [Originate](http://www.originate.com/), the feature I wish I had the most was some way to leverage the constraint system at runtime.

To use Haskell's constraint system at runtime always requires *first* coercing terms into concrete, monomorphic types, at which point the instances already exist. 

However, with a language that supports both dependent types and typeclasses where constraints are defined, one can probably do runtime *term-driven* program synthesis... I'm going to try that next :)
