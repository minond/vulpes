-include .scaffold/plugins/js.mk

all:: lint test

dependencies:
	git submodule update --init

install: dependencies npm-install
lint: js-lint
test: js-test
test-coverage: js-mocha-coverage
