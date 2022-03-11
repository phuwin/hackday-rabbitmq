## Rabbit MQ Nodejs 
`docker-compose run`

## How to test
Run `curl -H "Content-Type: application/json" -d '{"order":0, "sandwichId":0, "status":"ordered"}' http://localhost:8080/v1/order`
Results:
```
rabbitmq-nodejs-servera-1   | [SERVER A] Waiting for orders done
rabbitmq-nodejs-servera-1   | [SERVER A] Sent '{ order: 0, sandwichId: 0, status: 'ordered' }'
rabbitmq-nodejs-serverb-1   | [SERVER B] Received '{"order":0,"sandwichId":0,"status":"ordered"}'
rabbitmq-nodejs-serverb-1   | [SERVER B] Cooking order
rabbitmq-nodejs-serverb-1   | [SERVER B] Sent '{ order: 0, sandwichId: 0, status: 'ready' }'
rabbitmq-nodejs-servera-1   | [SERVER A] Received '{"order":0,"sandwichId":0,"status":"ready"}'
```

## Lowdb
Low db is integrated for a quick and dirty db management

## Frontend
Frontend is built with React, Styled Components and Axios for HTTP requests.
Once we have the rabbitmq nodejs docker stack running, the frontend can be brough up with `npm run dev`.

- List of orders are fetched on app startup with useEffect hook from the GET request from `servera/v1/order`.
- Adding an order will send a POST request to `servera/v1/order` and add the order data to the local state for rendering it to the view.
- There is a refresh button to fetch the list of orders again from the GET request from `servera/v1/order`.
- Clicking an item in the list of orders will fetch the order detail by a GET request to `servera/v1/order/:orderId`

Example video:

![example](example.mov)
