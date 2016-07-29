---
title: "Typeclasses: The Good and the Bad"
---

After playing with Haskell for half a year, I've grown to love and hate typeclasses -- and maybe even Haskell. After all, Haskell would definitely not be Haskell without typeclasses. They enable Haskell's signature concision, yet they also present a few issues systemic to the language and ecosystem.

## Good

Haskell's signature concision can be credited to typeclasses: we can get type-driven *ad-hoc* polymorphism with zero annotations. For example, we can use the same operators and same literals on numbers of different types, or use the same function to `show` terms of different types:

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

Notice how `+`, `+.`; `string_of_int`, `string_of_float` are necessarily different functions in OCaml.

So how do typeclasses achieve ad-hoc polymorphism? Typeclasses relegate instance resolution to a typing judgment, so wherever a type of a term is unambiguous, we can unambiguously resolve a typeclass instance. All of this is possible because we require *canonicity*, aka globally uniqueness, of typeclass instances. When there is *just one* instance in a given codebase, then we can pick that instance without ambiguity. 

## Bad


### 1. Canonical instances make types *usage based*, as opposed to *structure based*

> `Haskell Type = ADT + Name + (Permutation of instances)`

Despite Haskell supporting ADTs, at the end of the day in Haskell are less algebraic than meets the eye! They correspond not to algebraic constructions, but "*usage-based views*" of algebraic constructions, where a view carries a particular permutation of typeclass instances that prescribe its optimal usage. 

Take `Monoid` instances for `Int`. In the Prelude, there are none. Which is strange, because in my head I can already think of two instances -- the additive and multiplicative monoids! But let's just go ahead and make one:

``` haskell
class Monoid m where
  mempty :: m
  mappend :: m -> m -> m

instance Monoid Int where
  mempty = 0
  mappend = (+)
```

Great! But now what if we want the multiplicative Monoid? Well lets just define it...

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

-- but wait, the preceeding code will never compile, because the two instances overlap. For any type, there can only be at most one implementation of a typeclass -- we need *canonicity* of instances.


So because of this issue, the Prelude decides that `Int` should just have *no* implementation of Monoid. This means `Int` corresponds to a usage-based view that we *don't* use monoidal append for our type! There exists *representationally equal* types, namely `Sum Int` and `Product Int`, which individually correspond to their own usage based views.

The key issue here is that `Sum Int` and `Product Int` are representationally equal with `Int`, yet they *have* to exist if we want to use an Int with their corresponding Monoid instances. Keep in mind I'm not against newtyping -- in fact I'm a fan of using it as a semantic tool to prevent errors -- but forcing conversion to a new type just for a new usage seems like a language smell. **Typeclasses make types correspond to their usages**, which in my mind takes away the generality and elegance of their underlying algebraic constructions.

### 2. Typeclasses do not correspond to algebraic signatures

What is a monoid? nlab says:

> Classically, a monoid is a set `M` equipped with a binary operation `μ:M×M→M` and special element `1` such that `1` and `x⋅y=μ(x,y)` satisfy the usual axioms of an associative product with unit, namely the associative law:
> `(x⋅y)⋅z=x⋅(y⋅z)`
> and the left and right unit laws:
> `1⋅x⋅=x=x⋅1`

The important part here is that a monoid is a set *and* a binary operation,  *and* a distinguished element (that together satisfy the monoid axioms). That is, the binary operation and identity element are a *part* of the data that forms the monoid.

This is to contrast with the Monoid being the set, or type, itself -- the way Haskell does it:

In Haskell, the way typeclasses are structured make it *seem like* Monoid is a property of a type. Sure, typeclass membership is a property of a type, but when we use typeclasses to describe algebraic signatures, there is a semantic mismatch: Being a monoid is not a property of a type -- a type is a property of a monoid!


In Haskell, in a technical sense *actual* monoids are *implicit*. For example, here's the signature for `Monoid`, and an instance. Where is the monoid here?

``` Haskell
class Monoid m where
  zero :: m
  (<>) ::  m -> m -> m

instance Int Monoid where
  zero = 0
  (<>) = (+)

```

Is Int the monoid? The monoid is the typeclass *instance*, which can only be talked about through the type that it corresponds to!

Which means in Haskell, we never really technically directly talk about actual monoids, functors, monads, etc. despite Haskell being notorious for having all these algebraic structures. **In Haskell, we can only talk about algebraic structures through the type they are implicitly carried around with for typeclass instance resolution!**

For Haskell typeclasses to really be semantically truthful, instead of `Monoid`, `Functor`, `Monad`, they should be called `HasMonoid`, `HasFunctor`, `HasMonad`.

### 3. Our language becomes non-modular.

Perhaps the most *insidious* side effect of requiring canonicity of instances is that it leads *non-modular code* and a *non-modular ecosystem*.

In Haskell, imposing global uniqueness of instances forces us to think globally, not only across our codebase, but also with anticipation to future states of our codebase! This is regardless or not we have orphan instances, aka instances defined in neither the module of the  class or of the type:

If we allow orphan instances, then we cannot arbitrarily compose two pieces of code, because they could have overlapping implementations of a typeclasses for the same type!

If we don't allow orphan instances, then we have to anticipate all future uses of the type when we create our type! So for library writers cannot just define a type for it to be useful; they have to also define all the ways to use it!

## Oh no!

Typeclasses are really nice because of ad-hoc polymorphism, but unfortunately they make types and algebraic structures clunky, and code non modular. Oh no! What are the alternatives? 

In the next post I'll talk about alternatives to typeclasses found in other languages, namely ML modules and Scala implicits.

