-include vendor/minond/scaffold/plugins/std.mk
-include vendor/minond/scaffold/plugins/js.mk

install:
	git submodule update --init
	npm install

lint: js-complexity js-hint
test-coverage: js-test-coverage
test: js-test
travis: lint test-coverage
