-include .scaffold/plugins/js.mk

all:: lint test

install: dependencies
	npm install

dependencies:
	git submodule update --init

lint: install js-lint
test: install js-test
