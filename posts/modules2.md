---
title: "ML Modules: a comparison"
date: 2016-07-14
draft: True
---

Do these side-effects of canonicity have to exist in our programming languages? What happens if we don't use typeclasses? One good place to look is the ML family of languages.

The ML module system ends up solving a good portion of the problems created by typeclasses. One immediate benefit of modules over typeclasses is flexibility; modules let us speak of multiple components, via *first-class implementation objects*.


In ML, name resolution is not driven by types but by *implementation-carrying objects*. In Haskell terms, it is analogous to think of these objects as "first-class instances". In ML these implementation-carrying objects are known as "structures", and their types are known as "signatures":

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

Because types can be associated with structures, the same type can partake in multiple structures of the same signature:

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

A type in ML is therefore *more lightweight*, as it is not intertwined with specific implementations of signatures. It is simply a ADT and a name, as it should. By moving these properties from *intrisic* to *extrinsic*, we create a more abstract, more flexible notion of a type!



<br/>

```
Haskell Type = ADT + Name + (Permutation of instances)`
ML type      = ADT + Name`
```

<br/>

Okay, so ML's *extrinsic* treatment of implementations gives types more flexibility. But it also gives the language more modularity! In ML *code can be developed without concern about the global state of the codebase!*  This seems like a trivial feature that every language should have, but it is not the case in Haskell!

In ML we can also parametrize on implementations themselves; i.e. ML functors. ML functors are functions in the module language: given an implementation they return another implementation:


```ml
functor Cayley (M : MONOID) : MONOID =
struct
  type t = M.t -> M.t

  val mappend = fn (f, g) => fn x => f (g (x))
  val mempty = fn (x) => x
end

structure AdditiveAction = Cayley(Additive)
```

Being able to parametrize over *implementations* means not only can we ignore the global state of the codebase, we can *ignore subcomponents* of our components! Abstraction capabilitiies is an area where Haskell pales most in comparison to ML languages.



<br/>

Besides modularity, we can also see how ML modules obviate our other mentioned annoyances with Haskell. Explicit instances mean we no longer need to stick with arbitrary choices of canonical instances, and therefore neither do we need to newtype everywhere.



### But we want ad-hoc polymorphism!

Despite all these fundamental issues created by typeclasses in Haskell, typeclasses have the really nice benefit of allowing *ad-hoc polymorphism*, i.e. implicit name-resolution. 

Notice how in ML we had to prefix `mempty` with `Additive`, to specify our implementation. In ML, we trade compositionality for verbosity:

```ml
(* ML *)
Additive.mempty
```

```haskell
{- Haskell -}
mempty
```
In Haskell, we can infer an instance *because there is at most one instance* due to canonicity. In Haskell, we trade concision for non-modularity. The question remains:

> *How can we have both ad-hoc polymorphism and a modular language?*

There's [*modular implicits*](http://arxiv.org/pdf/1512.01895.pdf) in research for OCaml. They achieve ad-hoc polymorphism in a way similar to typeclasses: by relegating instance/implementation resolution to type resolution. 

Unfortunately, the authors mention that adding modular implicits will take away top-level compositionality, in an otherwise fully compositional language (modulo alpha-renaming). This is exactly the problem in Haskell! It is of no surpise because it also does resolution by backtracking from the type.

Is non-modularity of type-driven instance resolution unavoidable? Composes two code bases means we have to union two injective functions from instances to types. Scoping rules guarantee the union is a function by construction, but what guarantees the union is an injection?

<br/>


While we wait for [Backpack](https://ghc.haskell.org/trac/ghc/wiki/Backpack), in the meantime we can play with embeddings of modules in Haskell!
In the next post, I show one way to simulate ML-style modules in Haskell via typeclasses, associated type families and implicit parameters.
