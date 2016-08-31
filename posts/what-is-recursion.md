---
title: "What is recursion?"
date: 2016-08-28
draft: True
---

### joke?

> Recursion is using recursive functions.

### nonjoke
> A recursive function is the least *fixed point* of a functional.


The issue in self-definition, self reference, is that definition is a process.

i.e.

- f = F (f)

Let's unpack that.

### Fixed points:

What's a fixed point? Let's ask [nlab](http://mathworld.wolfram.com/DottieNumber.html):

> A fixed point of an endofunction f: X → X is an element x ∈ X such that f (x) = x

In informal terms:

> x is a fixed point of f if it is a point that won't budge under f.

So if x is a fixed point:

- `x = f x = f (f x) = f (f (f x)) = f (f (f (f x))) = ...`


<br/>

Some basic fixed points:

```
x = sin x = 0
```

```
x = cos x = 0.739085…
```

```
x = x² = 0
```

```
x = x² = 1
```

### Least fixed point

Notice how in the last two examples, we have *two* fixed points for function λx.x²

in general there can be multiple fixed points of functions


### fixed points of kliesli arrows
We needed an endofunction, right? How do we get fixed points of klieslis???

> fix :: (a -> a) -> a

> fixKliesli :: (a -> m a) -> m a


### references/links/further reading
- [matt might](http://matt.might.net/articles/implementation-of-recursive-fixed-point-y-combinator-in-javascript-for-memoization/)

- [ezyang](http://blog.ezyang.com/2010/12/getting-a-fix-on-fixpoints/)
