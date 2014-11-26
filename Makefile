-include vendor/minond/scaffold/plugins/js.mk

install: dependencies
	npm install

dependencies:
	git submodule update --init

lint: js-lint
test-coverage: js-test-coverage
test: js-test
travis: lint test-coverage
