.PHONY: playground
playground:
	docker-compose -f docker-compose.play.yaml up --build

.PHONY: dev
dev:
	docker-compose up --build

.PHONY: test
test:
	docker-compose -f docker-compose.test.yaml up --build