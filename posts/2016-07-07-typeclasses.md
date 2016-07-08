---
title: Haskell types are not abstract enough
---


After six months playing with Haskell, the most serious deficiency I see in the language is that types are not abstract enough. Haskell types say too much, as they impose *how types must be used* in addition to saying how types are constructed.

Types in Haskell fail to capture all the intrinsic properties of its algebraic construction; specifically, they fail to capture *capabilities* of a type to implement a signature. This is because typeclasses can have *at most one* implementation of a typeclass per type with respect to one's subset of the entire Haskell universe. As a result, in Haskell we're always programming against more or less arbitrary conventions. For example:

- `(,)` has one implementation of `Functor`, which is over functorial over the second parameter. But what if I want to `fmap` over the first parameter?

- `Int` does not even implement the `Monoid` typeclass, because there are two instances that are equally natural. It surely has the capability of acting as a Monoid, but because we can't choose one out of two, we force our users to convert to different types: `Sum Int` or `Product Int`.

In Haskell, when we speak of a type, we end up saying *more* than its algebraic construction. We end up additionally speaking of *a particular permutation of implementations of all the typeclasses in the Haskell universe*.



Why is this the case? In their essence, typeclasses are just a tool to achieve implicit *ad-hoc polymorphism*, i.e. type-directed name-resolution. Because we want [coherence](http://blog.ezyang.com/2014/07/type-classes-confluence-coherence-global-uniqueness/) of this name-resolution, we can only have one instance of a class for a given type. Global uniqueness has the benefit of reducing the problem of reasoning about run-time behavior to reasoning through types.

However, global uniqueness has a serious side-effect. Because we can only have one instance per class, as said before, a type in Haskell is not just characterized by its algebraic construction, but by its particular permutation of implementations of signatures. *Typeclasses make the Haskell type system anti-modular, because every type is intertwined with every typeclass.*


<br/>

What's a modular type-system look like? One place to look for a [proper](https://existentialtype.wordpress.com/2011/04/16/modules-matter-most/) treatment of modularity is the ML family of languages. With respect to modularity, the key difference between ML and Haskell can be boiled down to the following:


<br/>

- *Haskell:* Implementations of signatures are properties of types.

- *ML:* Types are properties of implementations of signatures.

<br/>


In Haskell, because instances of classes are globally unique, a type in Haskell corresponds to a particular permutation of implementations of all typeclasses in the Haskell universe. In other words, types are
[complected](https://www.infoq.com/presentations/Simple-Made-Easy/)
with all their interactions with other types. This gives us a very narrow, anti-modular notion of a type.


In ML, a type's interaction with other types is not determined by the type itself, but via first-class *implementation objects*. These implementation objects in ML are known in ML as "structures" and are [values of the module language](http://jozefg.bitbucket.org/posts/2015-01-08-modules.html). The types of these values are known as "signatures". In ML we don't really say that "a type implements a signature", because in ML *types can be elements of implementation objects*. This means a type can partake in multiple structures of the same signature; a type in ML is more abstract, and is not complected with specific implementations of signatures.

Haskell typeclasses and ML signatures may look similar because they both parametrize over types, but the most important difference is that Haskell treats typeclasses implementations as *intrinsic* properties of the type. 
ML treats implementations as their own objects; they are *extrinsic* to the type. In ML, instead of type-driven polymorphism, we have polymorphism driven by values in the module language.





<br/>

What is a type anyways? In the most general sense, a type is just a property of a collection of programs. We naturally want our types to be minimally maximal in the sense that they should capture all intrinsic properties of their constituent objects and no more. In a language where types are constructed with ADTs, a type should reflect all the intrinsic capabilities of objects of its algebraic construction. In Haskell, we end up not only forgoing maximality of capabilities in exchange for coherence, but we also forgo the ability to think locally and modularly about our types and programs.



While I wait for [Backpack](https://ghc.haskell.org/trac/ghc/wiki/Backpack), in the meantime I show one way to embed ML modules in Haskell with via typeclasses, associated type families and implicit parameters.

<br/>

<sub>
\*Interestingly, if we interpret "type" loosely as "a property of objects", we can see how Haskell and ML take two 
[entirely different philosophical approaches](https://ncatlab.org/nlab/show/intrinsic+and+extrinsic+views+of+typing)
in its treatment of "types of types". 
In Haskell, typeclass implementation is treated as an *intrinsic* property of a type;this corresponds to "typing" (of types)
*à la Church*. In ML, signature implementation is treated as an *extrinsic* property of a type, via external implementation objects.
ML corresponds to typing (of types) *à la Curry*. 
</sub>
