---
title: Canonical Instances are Problematic.
---

After half a year of playing with Haskell, I've found that typeclasses are the most interesting feature of the language in terms of their breadth of effects on the language. Haskell would definitely not be Haskell without typeclasses; they can be credited for contributing to the incredible expressiveness of Haskell syntax, but they also present a few systemic issues to the language and ecosystem.

In my opinion, the greatest benefit of typeclasses to Haskell is enabling the language's signature concision: we can get type-driven *ad-hoc* polymorphism with zero annotations. For example, we can use the same operators and same literals on numbers of different types, or use the same function to `show` terms of different types:

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

How does this mechanism of ad-hoc polymorphism work? Typeclasses relegate instance resolution to a typing judgment, so wherever a type of a term is unambiguous, we can unambiguously resolve a typeclass instance. This is because we require *canonicity*, aka globally uniqueness, of typeclass instances; when there is *just one* instance in a given codebase, then we can pick one without ambiguity. Having canonical and therefore unambiguous instances gives rise to a nice property called
[coherence](http://blog.ezyang.com/2014/07/type-classes-confluence-coherence-global-uniqueness/),
which essentially means a well-typed program will run unambiguously.


However, a few issues arise from this requirement of canonical instances. Here I'll discuss what I think are the most problematic of these issues: loss of generality of types/signatures, forced unergonomic practices, and non-modularity of code.


## 1. Canonical instances take away expected generality from the roles of types and signatures.


So `(,)` is just a product of types in Haskell, right?



No! A tuple in Haskell is *more* than just a product of types. It is a product *along with* a prescribed permutation of typeclass instances. The problem is that any given permutation unavoidably privillege some use-cases over others.

> `Haskell Type = ADT + Name + (Permutation of instances)`

For example, `(,)` has a implementation of `Functor` included in the Prelude which is functorial over the right parameter:
```haskell
instance Functor ((,) a) where
    fmap f (x,y) = (x, f y)
```
But what if I want to `fmap` over the left parameter? Shouldn't our HKT capture notions of symmetry inherent to its algebraic construction? We cannot, because 

Canonicity forces us to pick at most one instance, and therefore prescribe an asymmetry to the HKT. The issue is excacerbated by the fact that `(,)` has a privilleged syntactic form; it is not the algebraically-defined, but the socially-defined *canonical* version of a product type. 


Despite Haskell supporting ADTs, at the end of the day (higher-kinded) types in Haskell are less algebraic than meets the eye. They correspond not to algebraic constructions, but "*usage-based views*" of algebraic constructions, where a view carries a particular permutation of typeclass instances that prescribe its optimal usage. These usage-based views are not based on the intrinsic properties of an algebraic construction, but based on social convention. Canonicity forces *types to lose the generality* of their algebraic forms by necessitating socially-defined properties of their usage; if we want to use our type with typeclass instances other than the prescribed ones, we are forced to create a whole new type with the same algebraic construction.

<br/>
No only does canonicity of instances take away generality from our types, they also take away generality from our signatures. In a dual way to how a Haskell type is more than an algebraic construction, a Haskell typeclass signature is more than just an algebraic signature.

``` haskell
class Monoid m where
  mempty :: m
  mappend :: m -> m -> m
```

Upon naive observation, this typeclass signature looks like an algebraic signature of a monoid (minus requirements that it respect associative and unital laws).

But because of the way typeclasses work, the typeclass does not simply describe monoids; it does *more*! This typeclasses signature in Haskell describes *canonical* monoids *corresponding* to a type. 

The difference here is subtle. In math, we don't really say the natural numbers *are* a monoid; we say they *form* a monoid *with* an identity element and a binary operator (such that the associative and unital axioms hold). The data of the monoid is (\N, +, 0), not just (\N). In Haskell, we treat signatures like the later; the actual *monoid* is *implicit* along with a type:

When we say...

``` haskell
instance Monoid [a] where
  mempty = []
  mappend = (++)
```
... we are not just describing a monoid; we are describing a monoid *and* describing its *canonicity* for a type. 

Despite Haskell being advertised as a language with plenty of algebraic abstractions, it strikes me as backwards that there is no way to even talk about *instances of algebraic objects* by themselves! We can only talk about them through talking about the types that they correspond with.










## 2. Canonical instances force systemic unergonomic practices.

Canonicity of instances forces types and HKT's to prescribe canonical algebraic *views*, which in mind is not only inelegant but makes types *weaker*! We lose the power of generality of an algebraic construction, and instead force a proliferation of *equivalent* (modulo alpha renaming) types ergonomic to different use-cases. This leads to the next point.

One can easily come up with two natural instances of `Monoid for `Int`. In actually, `Int` has no , because we can't choose one out of two natural implementations. Instead, we force our users to awkwardly convert their values to *different* types: `Sum Int` or `Product Int`!


By requiring canonicity of instances, these ubiquitous algebraic signatures are not *descriptive* properties of our types as one would intuitively expect. After all, if our type can be *described* as a monoid, we should have some way to directly take advantage of its monoid behavior. Instead, these signatures are *prescriptive* properties of our types. To me this is a vast underpowering



Despite all the 
Haskell types are not simply algebraic constructions with names! Canonicity causes Haskell types have corresponding *permutations of typeclass instances*.



How do we use a different permutation of typeclass instances for a type? The name of the game in Haskell is `newtype`. 

However, `newtype` doesn't fix the fact that now we've created an entirely new type; these types don't interact at all without conversion! The problem is each time we require a different functionality, we need to create a new type.

*"But newtyping is good practice to prevent mistyping!"*  This is true, but it's orthogonal to whether or not we should be forced to newtype just to use another implementation of a signature. A type's interaction with other types should be external to the type; we shouldn't be forced to create a bunch of definitionally equivalent types just to work around the a limitation of typeclasses.

Convoluted.


> **3. Our language becomes non-modular.**

Despite the previously mentioned ergonomic annoyances, the most serious side effect of requiring canonicity is that it leads *non-modular code* and a *non-modular ecosystem*.

In Haskell, imposing global uniqueness of instances forces us to think globally, not only across our codebase, but also with anticipation to future states of our codebase! This is regardless or not we have orphan instances, aka instances defined in neither the module of the  class or of the type:

If we allow orphan instances, then we cannot arbitrarily compose two pieces of code, because they could have overlapping implementations of a typeclasses for the same type!

If we don't allow orphan instances, then we have to anticipate all future uses of the type when we create our type! So for library writers cannot just define a type for it to be useful; they have to also define all the ways to use it!


In Haskell, we use typeclasses to achieve *ad-hoc polymorphism*, i.e. *type-directed* name-resolution. Because we want our programs to be [coherent](http://blog.ezyang.com/2014/07/type-classes-confluence-coherence-global-uniqueness/), we can only have one instance of a typeclass for a given type, i.e. *canonicity* of instances. 
Canonicity has the benefit of making reasoning easier for the compiler and the programer because given any valid typing judgement, our program can only mean one thing. However, it has a few pervasive side effects:

