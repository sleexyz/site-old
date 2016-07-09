#!/usr/bin/env zsh
cd ~/projects/site
urxvt --hold -e zsh -c "find **/*.hs | entr stack build" &
urxvt --hold -e zsh -c "find **/*.(html|css|md)  | entr stack exec site build" &
urxvt --hold -e zsh -c 'http-server _site' &
