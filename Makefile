-include std.mk
-include js.mk

install:
	git submodule update --init
	npm install

lint: js-complexity js-hint
test-coverage: js-test-coverage
test: js-test
travis: lint test-coverage
