-include vendor/minond/scaffold/plugins/js.mk

install: dependencies
	npm install

dependencies:
	git submodule update --init

lint: js-lint
test: js-test
