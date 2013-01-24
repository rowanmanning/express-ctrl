
all: deps lint test

deps:
	@echo "Installing dependencies..."
	@npm install

lint:
	@echo "Linting JavaScript..."
	@./node_modules/.bin/jshint \
		--config ./test/config/jshint.json \
		index.js \
		./test/*

test: test-unit test-feature

test-unit:
	@echo "Running unit tests..."
	@./node_modules/.bin/mocha \
		--reporter spec \
		--colors \
		--recursive \
		./test/unit

test-feature:
	@echo "Running features..."
	@./node_modules/.bin/cucumber-js \
		--format pretty \
		./test/feature
