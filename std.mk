CONFIG_DIR = vendor/minond/scaffold/config

.PHONY: clean

clean:
	if [ -d build ]; then rm -r build; fi
