---
title: "Indexed Types for Fun and Subtyping"
date: 2016-10-30
draft: true
---
$$ \def\lb{⟦} \def\rb{⟧} \def\cat#1{\mathbf #1}$$
<div hidden>
~~~ {.haskell}
module ExplicitIndexingSpec where

import Test.Hspec
import Prelude hiding (Monad (..), pure)

spec = it "really works!" pending
~~~
</div>

Subtyping is a notoriously tricky feature to support natively in a language. In general, the notion of a "subtype relation" is a powerful tool for modeling things, as we've seen historically with the proliferation of Object Oriented Programming. 

Fortunately, we can take advantage of subtyping without actually having to use a language with native support for subtyping! Here, we show how to create a lightweight, bespoke subtyping system for your modeling needs :)


## 1. Place pot over high heat and bring to a boil:

We reduce subtyping down to its bare minimum:

* a set of types - $\cat C = \{a, b, c ...\}$
* a *relation* on the types, $\leq$, which is
    * *reflexive* -  $a \leq a$
    * *transitive* -  if $a \leq b$ and $b \leq c$, then $a \leq c$
* the *rule of subsumption*, which says that if $x : a$ and $a \leq b$, then $x : b$

This rule of subsumption is problematic when we try to phrase it from a category-theoretic perspective. A morphism has just one source object and one target object, and a naive interpretation of the rule of subsumption tells us that our morphism can be in multiple objects!

## 2. Add proof relevance.

To remedy this, we loosen the interpretation of the rule of subsumption by "materializing" subsumptions judgments as certain well-behaved functions:

These subsumptions are materialized as explicit coercions. i.e. proof relevant identity functions:

* if $a \leq b$, we have a coercion $id_{a\leq b} : a \to b$

In other words, we have:

* a [*preorder*](https://en.wikipedia.org/wiki/Preorder) $\cat C_\leq$. This is nothing than a reflexive, transitive relation.
* a [presheaf](https://en.wikipedia.org/wiki/Preorder) from $\cat C_ \leq$ to $\cat C$, the underlying category of the language. This is a nothing more than a *contravariant* functor $el: \cat C_\leq^{op} \to \cat C$

---

If you like hierarhcy, you can strengthen your preorder to also be a [poset](https://en.wikipedia.org/wiki/Partially_ordered_set), which adds the additional constraint of

* *antisymmetry* -  if $a \leq b$ and $b \leq c$, then $a \leq c$

If you *really* like hierarchy, you can strengthen your poset to be a [join-semilattice](https://en.wikipedia.org/wiki/Semilattice), which adds the additional constraint of

* *Least upper bounds for all nonempty finite subsets* 



<div align=center>$preorder \leq poset \leq semilattice$</div>


In Java, the global maximum is `Object`. In Scala, the global maximum is `Any`.

---




