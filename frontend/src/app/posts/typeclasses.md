---
title: "A Critique of Typeclasses"
date: 2016-07-28
---

*Note: Since writing this, I've become much less bothered by the issues outlined here. Typeclasses amount to a mechanism for type-directed logic metaprogramming, which can lead to some badass program generation. [Servant Client is an example.](https://hackage.haskell.org/package/servant-client)*

---

After playing with Haskell for half a year, I've grown to love and hate typeclasses. After all, Haskell would not be Haskell without typeclasses; they enable Haskell's signature concision, yet they also present a few issues systemic to the language and ecosystem. In this post I'll speak of what I think are the three biggest issues caused by typeclasses:
1) a weakened role of types,
2) a semantic incompatibility with algebraic signatures,
3) non-modularity of code.

## The Good

Haskell's signature concision can be credited to typeclasses: we can get type-driven *ad-hoc* polymorphism with zero additional annotations. This gives Haskell its incredible expressive efficiency. For example, we can use the same operators and same literals on numbers of different types, or use the same function to `show` terms of different types:

```haskell
foo :: Int
foo = 2 + 2

bar :: Float
bar = 2 + 2

baz :: String
baz = show bar ++ show baz
```

Compare this with the same written in OCaml, a typed functional language *without* ad-hoc polymorphism:

```ocaml
let foo : int = 2 + 2

let bar : float = 2.0 +. 2.0

let baz : string = string_of_int foo ^ string_of_float bar
```

Notice how in OCaml, we need different function names and operators to capture operations that are morally the same. In terms of polymorphism, OCaml only admits parametrically polymorphic functions -- functions that act *uniformly* across *all* types. Ad-hoc polymorphism allows one to write functions that can act *differently depending on a type*, across *some* types.

So how do typeclasses achieve ad-hoc polymorphism? Typeclasses relegate instance resolution to a typing judgment, so wherever a type of a term is unambiguous, we can unambiguously resolve a typeclass instance.

We guarantee non-ambiguity because we require *canonical typeclass instances* -- in other words, globally unique typeclasses instances. When there is *just one* canonical instance in a given codebase, then we can pick that instance without ambiguity. 

On one hand, having only one valid instance at all times makes programming a lot easier, since one does not have to think of a changing instance context. On the other hand, it causes a few issues that I explore next:

## Bad


### 1. Canonical instances make types less reusable

> `Haskell Type = ADT + Name + (Permutation of instances)`

What is a type in Haskell anyways? A type has a name, and a type has some sort of algebraic construction. If we consider typeclasses, we see that a type also has a particular permutation of canonical instances it corresponds to. Because different permutations are optimal for different usages, this means a type in Haskell really correspond to something weaker than it would be without typeclasses: a Haskell type is a *usage-based view* of a construction with a name, as opposed to just a construction with a name.

Take `Monoid` implementations for `Int`. In the Prelude, there are none. Why is that, when in my head I can already think of two instances -- the additive and multiplicative monoids? Let's just go ahead and make one:

``` haskell
class Monoid m where
  mempty :: m
  mappend :: m -> m -> m

instance Monoid Int where
  mempty = 0
  mappend = (+)
```

Great! But now what if we want the multiplicative Monoid? Well let's just define it...

``` haskell
class Monoid m where
  mempty :: m
  mappend :: m -> m -> m

instance Monoid Int where
  mempty = 0
  mappend = (+)

instance Monoid Int where
  mempty = 1
  mappend = (*)

...
```

-- but the preceeding code will never compile, because the two instances overlap. Haskell requires instances to be canonical. Because of this, the Prelude decides that `Int` should just have *no* implementation of Monoid. 

The only way to use the monoid implementations is via newtyping -- we have to convert our type to *representationally equal* types, namely `Sum Int` and `Product Int`. These types are just different views of `Int`, just corresponding to different usages.

The issue is that although they are representationally equal with `Int`, *to do anything useful with the term requires nominal equality*. So if a function takes an `Int`, we cannot pass it a `Sum Int`; it is a different type! This means any time we want to take advantage of an additive monoid instance for `Int`, we have to do an explicit conversion to and from the new type. I would argue further that this conversion is unergonomic enough that we don't even really use it; after all, how often do you see yourself reaching for `Sum Int`?

---

*Edit: Libraries that use Conor McBride's techniques from Epigram like [Control.Newtype](https://hackage.haskell.org/package/newtype-0.2/docs/Control-Newtype.html) or [Control.Lens.Iso](https://hackage.haskell.org/package/lens-4.15.1/docs/Control-Lens-Iso.html#v:au) make working with newtypes a lot more seamless.*

---

By requiring canonicity of instances, **typeclasses weaken the role of types** to usage-based views. In our case, `Int` is not general enough of a type to account for different usages involing different Monoid instances. If we want to use other instances, we have to convert it to and from newtypes like `Sum Int` or `Product Int`; this is an unergonomic compromise at most, which could have been avoided if a Haskell type had the generality to admit different usages.

### 2. Typeclasses are semantically incompatible with algebraic signatures

What is a monoid? nlab says:

> Classically, a monoid is a set `M` equipped with a binary operation `μ:M×M→M` and special element `1` such that `1` and `x⋅y=μ(x,y)` satisfy the usual axioms of an associative product with unit, namely the associative law:
> `(x⋅y)⋅z=x⋅(y⋅z)`
> and the left and right unit laws:
> `1⋅x⋅=x=x⋅1`

The important part here is that a monoid is a set *and* a binary operation,  *and* a distinguished element (that together satisfy the monoid axioms). That is, the binary operation and identity element are a *part* of the data that forms the monoid.

This is to contrast with the monoid being the set *itself*, like saying that the natural numbers *are* a monoid as opposed to how they *form* a monoid. This is exactly what typeclass semantics seem to suggest when we use typeclasses for algebraic signatures:

In Haskell, the way typeclasses are structured make it *seem like* being a monoid is a property of a type. Sure, typeclass membership is a property of a type, but when we use typeclasses to describe algebraic signatures, there is a semantic mismatch: being a monoid is not a property of a type -- a type is a property of a monoid!


In Haskell, in a technical sense the *actual* monoids are *implicit*. For example, here's the signature for `Monoid`, and an instance. Where is the monoid here?

``` Haskell
class Monoid m where
  zero :: m
  (<>) ::  m -> m -> m

instance Int Monoid where
  zero = 0
  (<>) = (+)

```

Is Int the monoid? The monoid is the typeclass *instance*, as it carries the data of the type, the distinguished term of that type, and the binary operator on that type. In Haskell, this instance can only be talked about through `Int`, the type it corresponds to!

Which means in Haskell, we never really technically directly talk about actual monoids, functors, monads, etc. despite Haskell being a language known for having all these algebraic structures! **In Haskell, we can only talk about algebraic structures through the type they are implicitly carried around with for typeclass instance resolution.**

For algebraic signatures to be really be semantically truthful to their typeclass semantics, instead of `Monoid`, `Functor`, `Monad`, they should be called `HasCanonicalMonoid`, `HasCanonicalFunctor`, `HasCanonicalMonad`.

### 3. Canonical instances make Haskell non-modular.

Perhaps the most insidious side effect of requiring canonicity of instances is that it leads *non-modular code* and a *non-modular ecosystem*.

In Haskell, imposing global uniqueness of instances forces us to think globally, not only across our codebase, but also with anticipation to future states of our codebase! This is regardless or not we have orphan instances, aka instances defined in neither the module of the  class or of the type:

If we allow orphan instances, then we cannot arbitrarily compose two pieces of code, because they could have overlapping implementations of a typeclasses for the same type!

If we don't allow orphan instances, then we have to anticipate all future uses of the type when we create our type! So for library writers cannot just define a type for it to be useful; they have to also define all the ways to use it!

---

Typeclasses are really great because they enable ad-hoc polymorphism, but unfortunately they make types and algebraic structures clunky and code non modular. Can we get ad-hoc polymorphism another way that fixes these issues?

~~In future posts I'll hopefully talk about language features that solve the problems introduced by typeclasses, a few of which also get ad-hoc polymorphism. These might include Scala implicits, ML modules, [modular implicits](http://arxiv.org/pdf/1512.01895.pdf), and [modular typeclasses](http://lambda-the-ultimate.org/node/1844).~~
