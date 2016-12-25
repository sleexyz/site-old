---
title: "Blah blah category of endofunctors..."
date: 2016-10-29
draft: true
---

<div hidden>

$$ \def\lb{⟦} \def\rb{⟧} \def\cat#1{\mathbf #1}$$

~~~ {.haskell}
{-# LANGUAGE TypeOperators #-}
{-# LANGUAGE UnicodeSyntax #-}
{-# LANGUAGE RankNTypes #-}
{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE UndecidableInstances #-}
module Indexed1Spec where

import Test.Hspec
import Prelude hiding (Monad (..), pure)

spec = it "really works!" pending
~~~

</div>

I wanted to write about indexed monads, but I figured I should write about monads first.
So here it is; the world's worst monad tutorial:


## Monad
Let's revisit the ol' snarky adage:

> A monad is just a monoid in the category of endofunctors, what's the problem?

There is a problem! The problem is we're not talking about set-theoretic monoids! Let's be more explicit:

> A monad is a **monoid object** in the **monoidal category** of endofunctors with endofunctor composition as tensor product.

### Monoidal category
A *monoidal category* consists of a category and some extra data. So we have:

- a category: $\mathbf C$
- a bifunctor pronounced *tensor*:  $\otimes : \mathbf C\times\mathbf C\to\mathbf C$
- an object pronounced *unit*: $I :: \mathbf C$
- natural isomorphisms:
    - an *associator*: $\alpha_{A,B,C} \colon (A\otimes B)\otimes C \cong A\otimes(B\otimes C)$
    - a *left unitor*: $\lambda_A \colon I\otimes A\cong A$
    - a *right unitor*: $\rho _{A}\colon A\otimes I\cong A$
- [satisfaction coherence conditons](https://en.wikipedia.org/wiki/Monoidal_category)
    
A *strict monoidal category* strengthens the natural isomorphisms to be equalities.

#### Example: Cartesian monoidal categories
A [cartesian monoidal category](https://ncatlab.org/nlab/show/cartesian+monoidal+category) is a monoidal category with the category-theoretic product as tensor, and the terminal object as unit.

$Hask$ forms a cartesian monoidal category, where the product is just tupling and the terminal object is the unit type. The natural isomorphisms are spelled out as follows:

~~~{.haskell}
-- 〚C 〛 = Hask
-- 〚⊗ 〛 = (,)
-- 〚I 〛 = ()

α_to ((x, y), z) = (x, (y, z))
α_from (x, (y, z)) = ((x, y), z)

λ_to ((), x) = x
λ_from x = ((), x)

ρ_to (x, ()) = x
ρ_from x = (x, ())
~~~


#### Example: Endofunctor categories
The category of endofunctors on a category $\mathbf C$, denoted $[\mathbf C, \mathbf C]$, is category *itself*, where

- objects are *functors* $f : \mathbf C\to\mathbf C$
- morphisms are *natural transformations* $\alpha : f \Rightarrow f'$

$[\cat C, \cat C]$ forms a strict monoidal category by taking functor composition as *tensor* and the identity functor as *unit*.

$$\lb - \otimes - \rb = - \circ -$$
$$\lb I \rb = id_\cat C$$

### Monoid object in a monoidal category

Now we can define a monoid object in a monoidal category $(\mathbf C, \otimes, I)$, which consists of:

- an object $m :: \mathbf C$
- a morphism pronounced *multiplication* $\mu : m \otimes m \to m$
- a morphism pronounced *unit* $\eta : I \to m$
- [satisfaction of coherence conditions](https://en.wikipedia.org/wiki/Monoid_(category_theory))


An important point is that a monoid object is meaningless without referencing its underlying monoidal category, implicitly or not. Whereas a monoidal category is a special kind of category, 
a monoid object is a special kind of object *in a monoidal category*.

#### Example: Set-theoretic monoids

A set-theoretic monoid is a monoid object in the cartesian monoidal category of $Set$, i.e. a set equipped with multiplication and an identity element.

First, the cartesian monoidal category $Set$:*

$$\lb\cat C\rb = Set$$
$$\lb - \otimes - \rb = - \times -$$
$$\lb I \rb = 1$$


A set-theoretic monoid is a set $m$ equipped with:

$$\lb \mu \rb = \mu : m \times m \to m$$
$$\lb \eta \rb = \eta \in m$$

Note that in the case of $Set$, [global elements](https://ncatlab.org/nlab/show/global+element) coincide with elements, which gives us the traditional notion of identity element from $\eta$

<sub> *(where $\times$ is the cartesian product, $1$ is a singleton set) </sub>

#### Example: `Prelude.Monoid` 

The `Monoid` typeclass in Haskell defines monoid objects in the cartesian monoidal category of Hask, modulo currying of `mappend`:
$$\lb\cat C\rb = *$$
$$\lb - \otimes - \rb = (- , -)$$
$$\lb I \rb = ()$$
$$\lb \mu \rb = mappend : (m, m) \to m$$
$$\lb \eta \rb = mempty : m$$

### Example: Monads

If you take a trip to nlab you'll find [a bunch of equivalent definitions of monads](https://ncatlab.org/nlab/show/monad) (including my favorite one in string diagrams!) The one that interests us here is the definition that hints to a similarity of names of *monad* with *monoid*. One definition nlab gives:

> Indeed, one can define a monad on an object $a$ of a bicategory $K$ as just a monoid in the endomorphism category $K(a,a)$. 

The nlab entry generalizes monads to arbitrary [bicategories](https://ncatlab.org/nlab/show/bicategory), but for our purposes we'll only consider monads in the bicategory $Cat$. So the above quote de-generalizes to:

> Indeed, one can define a monad on a category $C$ as just a monoid in the endofunctor category $[C, C]$. 

This gives us the following definition of a monad:

- an endofunctor $M :: [\cat C,  \cat C]$
- a natural transformation $\mu : M \circ M \Rightarrow M$
- a natural transformation $\eta : id_{\cat C} \Rightarrow M$
- [satisfaction of coherence conditions](https://en.wikipedia.org/wiki/Monad_(category_theory)#Formal_definition)


#### `Prelude.Monad`
The `monad` typeclass in Haskell defines monoid objects in the monoidal category of endofunctors of Hask, with endofunctor composition as tensor:
$$\lb\cat C\rb = [*, *]$$
$$\lb - \otimes - \rb = - \circ- $$
$$\lb I \rb = id_*$$
$$\lb \mu \rb = join : m \circ m \Rightarrow m $$ 
$$\lb \eta \rb = pure : id_* \Rightarrow m$$

The following snippet contains a translation from a spiffier, category-theoretic interpretation of a monad to `Prelude.Monad`:

```haskell
newtype I a = I {unI :: a}
newtype (∘) f g a = Compose {unCompose :: f (g a)}
type f ~> g = ∀a. f a -> g a

-- | A spiffier monad definition.
class (Functor m) => SpiffyMonad m where
  mu :: m ∘ m ~> m
  eta :: I ~> m
  
-- | Your good ol' Prelude.Monad.
class (Functor m) => Monad m where
  join :: m (m a) -> m a
  pure :: a -> m a

  (>>=) :: (a -> m b) -> m a -> m b
  (>>=) f a = join (fmap f a)
  
-- We can derive Prelude.Monads from SpiffyMonads...
instance (Functor m, SpiffyMonad m) => Monad m where
  join = mu . Compose
  pure = eta . I

-- ... and SpiffyMonads from Prelude.Monads
instance (Functor m, Monad m) => SpiffyMonad m where
  mu = join . unCompose
  eta = pure . unI
```

## Categories are Generalized monoids


