#!/usr/bin/env zsh
stack build
# (find **/*.hs | entr stack build)&
find **/*.(html|css|md)  | entr stack exec site build
