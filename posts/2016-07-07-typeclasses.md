---
title: Haskell types are not abstract enough.
---


After six months playing with Haskell, the most serious deficiency I see in the language is that types are not abstract enough. Types in Haskell fail to capture all the extensional properties of an object of that type; specifically, they fail to capture *capabilities* of a type to implement a signature. This is because typeclasses can have *at most one* implementation of a typeclass per type, with respect to one's subset of the entire Haskell universe. This means everyday programming in Haskell is programming against more or less arbitrary conventions. For example:

- `(,)` has one implementation of `Functor`, which is over the second parameter. But what if I want to `fmap` over the first parameter?

- `Int` does not even implement the `Monoid` typeclass, because there are two instances that are equally natural. It has the capabilities of acting as a Monoid, but in Haskell it can't without wrapping in a newtype.

In Haskell, when we speak of a type, we end up saying *more* than just the properties of its objects. We end up additionally speaking of *a particular permutation of implementations of all the typeclasses in the Haskell universe*.



Why is this the case? In their essence, typeclasses are a tool to achieve implicit *ad-hoc polymorphism*, i.e. type-directed name-resolution. Because we want [coherence](http://blog.ezyang.com/2014/07/type-classes-confluence-coherence-global-uniqueness/) of this name-resolution, we can only have one instance of a class for a given type. Global uniqueness has the benefit of reducing reasoning about run-time behavior to reasoning through types.

However, global uniqueness has a serious side-effect. When we program in Haskell, we are programming against a global database of types and their chosen permutation of typeclass implementations that spans across (one's subset of) the Haskell universe. That is, a type in Haskell is not just characterized by its construction, but also its implementations of all signatures. *Typeclasses makes Haskell types maximally anti-modular, because every type is intertwined with every typeclass!*


<br/>

One place to look for a [proper](https://existentialtype.wordpress.com/2011/04/16/modules-matter-most/) treatment of modularity is the ML family of languages. With respect to modularity, the key difference between ML and Haskell can be boiled down to the following:


<br/>

- *Haskell:* Signature implementations are properties of types.

- *ML:* Types are properties of signature implementations.

<br/>


In Haskell, a type's interaction with other types is 
[complected](https://www.infoq.com/presentations/Simple-Made-Easy/)
with the type. This gives us a very narrow notion of a type, because a type in Haskell corresponds to a particular permutation of implementations of all typeclasses in the Haskell universe.


In ML, a type's interaction with other types is not determined by the type itself, but via *implementation objects*, aka modules. In ML types we don't really say that "a type implement a signature", because *types are elements of implementations objects*. This means a type can partake in multiple implementations of the same signature; a type in ML is more abstract, and is not complected with specific implementations of signatures.

Haskell typeclasses and ML signatures may look similar because they both parametrize over types, but the key difference is that Haskell treats typeclasses implementations as *intrinsic* properties of the type. ML treats signature implementations (known in ML as "structures") as their own objects; they are *extrinsic* to the type.



Interestingly, if we interpret "type" loosely as "a property", we can see how Haskell and ML take two 
[entirely different philosophical approaches](https://ncatlab.org/nlab/show/intrinsic+and+extrinsic+views+of+typing)
in its treatment of "types of types"! 
In Haskell, signature implementation is treated as an *intrinsic* property of a type; this corresponds to "typing" of types
*à la Church*.
ML corresponds to typing of types *à la Curry*. In ML, signature implementation is treated as an *extrinsic* property of a type; implementations are first-class objects of their own.


<br/>

What is a type anyways? In the most general sense, a type is just a property of programs of that given type. Naturally, we want properties of types to be the "greatest thing" that characterizes objects of that type.



While we wait for [Backpack](https://ghc.haskell.org/trac/ghc/wiki/Backpack), in the meantime we can embed modules in Haskell with typeclasses, associated type families and implicit parameters.
