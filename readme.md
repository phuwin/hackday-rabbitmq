## Rabbit MQ Nodejs 
`docker-compose run`

## How to test
Run `curl -H "Content-Type: application/json" -d '{"order":0, "sandwichId":0, "status":"ordered"}' http://localhost:8080/v1/order`
Results:
```
rabbitmq-nodejs-servera-1   |  [SERVER A] Waiting for orders done
rabbitmq-nodejs-servera-1   | { order: 0, sandwichId: 0, status: 'ordered' }
rabbitmq-nodejs-servera-1   |  [SERVER A] Sent '{ order: 0, sandwichId: 0, status: 'ordered' }'
rabbitmq-nodejs-serverb-1   |  [SERVER B] Received '{"order":0,"sandwichId":0,"status":"ordered"}'
rabbitmq-nodejs-serverb-1   | [SERVER B] Cooking order
rabbitmq-nodejs-serverb-1   |  [SERVER B] Sent '{ order: 0, sandwichId: 0, status: 'ready' }'
rabbitmq-nodejs-servera-1   |  [SERVER A] Received '{"order":0,"sandwichId":0,"status":"ready"}'
rabbitmq-nodejs-servera-1   | {"order":0,"sandwichId":0,"status":"ready"}
```

## Lowdb
Low db is integrated for a quick and dirty db management

