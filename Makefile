-include .scaffold/plugins/js.mk
-include .scaffold/plugins/es6.mk

all:: lint test

dependencies:
	git submodule update --init

compile: es6-compile
install: dependencies npm-install
lint: es6-lint
test: compile js-test
test-coverage: compile js-mocha-coverage
