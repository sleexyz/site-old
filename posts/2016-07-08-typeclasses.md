---
title: Haskell Types are Too Heavyweight
---



After six months playing with Haskell, the most serious deficiency I see in the language is that types are too specific. Specifically, types in Haskell are not just algebraic constructions with names; they also carry the baggage of dictating a single canonical permutation of typeclass instances.


> `Haskell Type = ADT + Name + (Permutation of instances)`



Why is this the case? Because of the nature of typeclasses. Typeclasses are a tool to achieve *ad-hoc polymorphism*, i.e. implicit type-directed name-resolution. Because we want the benefits of [coherence](http://blog.ezyang.com/2014/07/type-classes-confluence-coherence-global-uniqueness/) of this name-resolution, we can only have one instance of a class for a given type, i.e. canonicity.


Canonicity has benefits of making reasoning easier for the compiler and the programer because given any valid typing judgement, our program can only mean one thing. However, it has a few side effects, namely:


> **We're stuck with more or less arbitrary, sometimes unergonomic conventions.**

`(,)` has an included implementation of `Functor`, which is over functorial over the second parameter. But what if I want to `fmap` over the first parameter?

`Int` does not even implement the `Monoid` typeclass, because we can't choose one out of two natural implementations. Instead, we force our users to convert their values to *different* types: `Sum Int` or `Product Int`.


> **We have to create new types if we want to use our type differently.**


How do we use a different permutation of typeclass instances for a type? The name of the game in Haskell is `newtype`. 

However, `newtype` doesn't fix the fact that now we've created an entirely new type; now in our code we have to convert between types just to use different typeclass instances! The problem gets combinatorially worse, because as our number of representation grows, we have to account for the permutations of conversions between them.

*"But newtyping is good practice to prevent mistyping!"*  This is true, but it's orthogonal to whether or not we should be forced to newtype just to use another implementation of a signature. A type's interaction with other types should be external to the type; we shouldn't be forced to create a bunch of definitionally equivalent types just to work around the a limitation of typeclasses.



> **Our language becomes non-modular.**

Despite the ergonomic annoyances of arbitrary conventions and newtyping, the most serious side effect of requiring canonicity is that it leads *non-modular code* and a *non-modular ecosystem*.

In Haskell, imposing global uniqueness of instances forces us to think globally, regardless or not we have orphan instances (instances defined in neither the module of the  class or of the type):

If we allow orphan instances, then we cannot arbitrarily compose two pieces of code, because they could have overlapping implementations of a typeclasses for the same type!

If we don't allow orphan instances, then we have to anticipate all future uses of the type when we create our type! So for library writers cannot just define a type for it to be useful; they have to also define all the ways to use it. *Types in Haskell are too heavyweight.*


In general, global uniqueness of some property *inherently* imposes non-modularity on a system. To require global uniqueness, every component of a system must be aware of every component. For evolving systems like language ecosystems or even codebases, this is a very bad thing, because we are forced not only to think across our entire system at the current moment, but also in anticipation of future states.

### So what does a more modular language look like? 

One place to look for a [proper](https://existentialtype.wordpress.com/2011/04/16/modules-matter-most/) treatment of modularity is the ML family of languages. With respect to modularity, the key difference between ML and Haskell can be boiled down to the following:



> *Haskell:* Implementations of signatures are properties of types.
> *ML:* Types are properties of implementations of signatures.



In Haskell, because instances of classes must be canonical, a type in Haskell carries the additional baggage of a particular permutation of implementations of all typeclasses in the Haskell universe. This gives us a narrower, less abstract notion of a type, because to define a type we have to additionally specify its interaction with signatures. 


In ML, instead of type-driven polymorphism, we have polymorphism driven by *values* in the module language. These values *free our types* from carrying the weight of having to define a canonical permutation of instances. 

These objects are known as "structures", and their types are known as "signatures":

```ml
signature MONOID =
sig
    type t
    val mappend : t * t -> t
    val mempty : t
end

structure Additive =
struct
  type t = int
  val mappend = fn (x, y) => x + y
  val mempty = 0
end

val foo = Additive.mempty 
```

Because types are values in structures, the same type can partake in multiple structures of the same signature:

```ml
...

structure Additive =
struct
  type t = int
  val mappend = fn (x, y) => x + y
  val mempty = 0
end

structure Multiplicative =
struct
  type t = int
  val mappend = fn (x, y) => x * y
  val mempty = 1
end

val foo  = Additive.mempty + Multiplicative.mempty 

(*
val foo = 1 : int
*)
```

A type in ML is therefore more general in nature, as it is not intertwined with specific implementations of signatures. It is just a ADT and a name; its interaction with signatures are external to the type. *ML types are lighter-weight than Haskell types.*



<br/>

```
Haskell Type = ADT + Name + (Permutation of instances)`
ML type      = ADT + Name`
```

<br/>


Haskell typeclasses and ML signatures may look similar because they both parametrize over types, but the most important difference is that Haskell treats typeclasses instances as *intrinsic* properties of the type. 
ML treats implementations as their own objects; they are *extrinsic* to the type.*

This *extrinsic* treatment of signature implementations means code can be developed without concern about the global state of the codebase! This is not even to mention that we can parametrize on implementations; i.e. ML functors. ML functors are functions in the module language: given an implementation, returns an implementation:


```ml
functor MonoidAction (M : MONOID) : MONOID =
struct
  type t = M.t -> M.t

  val mappend = fn (f, g) => fn x => f (g (x))
  val mempty = fn (x) => x
end

structure AdditiveAction = Action(Additive)
```

Being able to parametrize over *implementations* means not only can we ignore the global state of the codebase, we can ignore subcomponents of our components!



<br/>

Besides modularity, we can also see how ML modules obviate our other annoyances with Haskell. We no longer need to throw newtypes everywhere or stick with arbitrary choices of implementation, because by default we call our functions through our choice of implementation.







### A more modular Haskell?

Despite all these fundamental issues created by typeclasses in Haskell, typeclasses have the really nice benefit of allowing *ad-hoc polymorphism*, i.e. implicit name-resolution. 

Notice how in ML we had to prefix `mempty` with `Additive`, to specify our implementation. In ML, we've treated compositionality for verbosity:

```ml
Additive.mempty
```


In Haskell, because we have canonicity, we can infer the implementation, *because there is exactly one implementation* if our program type checks.

```haskell
mempty
```

Haskell's concision is due to ad-hoc polymorphism à la typeclasses; typeclasses relegate the issue of instance resolution to typing. So we naturally admit the following quesetion:

> *Can we have a more modular approach to ad-hoc polymorphism and a modular language?*

There's [*modular implicits*](http://arxiv.org/pdf/1512.01895.pdf), researched in 2015 for OCaml. They achieve ad-hoc polymorphism in a way similar to typeclasses: by relegating implicit resolution to typing. 

Unfortunately, they mention adding modular implicits will take away top-level compositionality due to potentially overlapping instances. This is the same problem that plagues Haskell! 

Perhaps this problem of non-modularity of purely type-driven instance resolution is unavoidable. Combining two code bases means we have to union two injective functions from instances to types. Scoping rules guarantee the union is a function, but what guarantees the union is an injection?

<br/>


While we wait for [Backpack](https://ghc.haskell.org/trac/ghc/wiki/Backpack), in the meantime we can play with embeddings of ML modules in Haskell. In the next post, I show one way to embed modules in Haskell via typeclasses, associated type families and implicit parameters.
