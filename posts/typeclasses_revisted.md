---
title: "Typeclasses, revisted"
date: 2016-12-18
---

I wrote [a post](./posts/typeclasses) a while ago about issues I saw with typeclasses. These were all issues that arose from the requirement that typeclasses have canonical instances:

1. Typeclasses weaken the generality of types.
2. Typeclasses are nonideal for describing algebraic structures.
3. Typeclasses introduce non-modulary of one's codebase/the whole ecosystem.

In retrospect, all issues I in that post were less about typeclasses themselves, but more about how typeclasses are *abused* in the absence of a proper parametrized module system.

I've come to realize that despite the issues they can cause when abused, typeclasses can also be very powerful tools if one considers them as an answer to not just ad-hoc polymorphism, but also *program synthesis*!

## Typeclasses as Logic Metaprogramming
Haskell's typeclass system amounts to deterministic, type-driven constraint-based metaprogramming

### Deterministic

TODO: elaborate ("haha")

Given a set of constraints and query, Haskell's typeclass resolution allows *at most* one answer to enforce canonicity of instances.
This to constrast with logic programming languages, which usually support [non-determinism](https://en.wikipedia.org/wiki/Nondeterministic_programming).

### Constraint-Based

TODO: elaborate ("haha")

Every instance declaration in Haskell comes in two parts; the constraint declaration, and the function definitions.

### Type-driven


### Metaprogramming
Typeclasses are a system for programming the compile-time generation of terms. In a language with typeclasses, one can, instead of always referencing terms by their definitions, *generate* them during compilation by defining an appropriate system of types, classes and instances.

Because typeclasses are often thought as extensions to the type system, the point of view of "metaprogramming" is rarely brought up. Under this perspective, GHC actually supports two(!) "languages" for metaprogramming: Template Haskell *and* the constraint language!


## Typeclasses for Program Synthesis

So if take and run with the idea of typeclasses as *a constraint-based system for programming the generation of terms*, you can achieve what people would consider program synthesis!

[Servant Client](https://hackage.haskell.org/package/servant-client) is a prime example of a real-world example of how typeclasses allow for program synthesis. Servant API's are essentially type declarations that are sufficiently rich in information to generate a set of API client.

Another example: Haskell's mechanism for generics amounts to giving the constraint system additional information about types. This gives us the ability to do things like [*derive* JSON serializers and deserializers](https://artyom.me/aeson#records-and-json-generics) for our types at compile-time just based on information annotated by GHC, which we get for free!

## Typeclasses for Proof Generation
By the Curry-Howard isomorphism, if typeclasses can be thought of a constraint-based mechanism for type-directed program synthesis, typeclases can also be thought of a constraint-based mechanism for type-directed *proof generation*.

[This Agda-wiki article](http://agda.readthedocs.io/en/latest/language/instance-arguments.html#proof-search) gives a simple example of this in Agda.

This is to contrast with *tactics*, which provide a more direct method for metaprogramming proofs.

## But typeclasses only work at compile-time...

While writing production Haskell at [Originate](http://www.originate.com/), the feature I wish I had the most was some way to leverage the constraint system at runtime.

To use Haskell's constraint system at runtime always requires *coercing* terms into concrete, monomorphic types. There is no way to dynamically generate a type-level value at runtime...

### Typeclasses and Dependent Types = Runtime, type-safe program synthesis?

...unless we have dependent types!

With a language that supports both dependent types and typeclasses, one can probably do runtime program synthesis.

*To be continued :)*
