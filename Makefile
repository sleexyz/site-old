build:
	stack build
	stack exec -- site build

clean:
	stack exec -- site clean

superclean: clean
	rm -rf test/*Spec.lhs

test: posts/*.hs.md
	(cd posts ; find . -depth -name "*.hs.md" -exec sh -c 'ln "$$1" "../test/$${1%.hs.md}Spec.lhs"' _ {} \;)
	stack test
