-include .scaffold/plugins/js.mk

all:: lint test

dependencies:
	git submodule update --init

install: dependencies npm-install
lint: install js-lint
test: install js-test
