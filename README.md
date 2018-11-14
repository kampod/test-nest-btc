## Description

Test project. Don't use it.


## Install
npm install


## Run
npm run start


## Test
npx jest --watchAll
npx jest --coverage
npm run test


## Test curls
-------------------------------------------
curl -s -X GET "http://localhost:3000"
-------------------------------------------
curl -s -X GET "http://localhost:3000/btc/get_hello"
-------------------------------------------
curl -s -d '{"address":"1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY"}' -H "Content-Type: application/json" -X GET "http://localhost:3000/btc/get_utxo"
-------------------------------------------
// bad request
curl -s -d '{"address":"1Nh7uHdvY6fNwtQtM1G5EZAFPLC33B59r1"}' -H "Content-Type: application/json" -X GET "http://localhost:3000/btc/get_utxo"
curl -s -d '{}' -H "Content-Type: application/json" -X GET "http://localhost:3000/btc/get_utxo"
curl -s -d '{"address":""}' -H "Content-Type: application/json" -X GET "http://localhost:3000/btc/get_utxo"
-------------------------------------------
curl -s -d '{"address_from":"1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY", "address_to":"15aQe4XKmXr4kPtb9UMTKceem7mNnLKD25", "amount_btc": 0.001}' -H "Content-Type: application/json" -X POST "http://localhost:3000/btc/create_tx"
curl -s -d '{"address_from":"1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY", "address_to":"15aQe4XKmXr4kPtb9UMTKceem7mNnLKD25", "amount_btc": 0.01}' -H "Content-Type: application/json" -X POST "http://localhost:3000/btc/create_tx"
curl -s -d '{"address_from":"1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY", "address_to":"15aQe4XKmXr4kPtb9UMTKceem7mNnLKD25", "amount_btc": 0.02}' -H "Content-Type: application/json" -X POST "http://localhost:3000/btc/create_tx"
curl -s -d '{"address_from":"1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY", "address_to":"15aQe4XKmXr4kPtb9UMTKceem7mNnLKD25", "amount_btc": 0.04}' -H "Content-Type: application/json" -X POST "http://localhost:3000/btc/create_tx"
curl -s -d '{"address_from":"1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY", "address_to":"15aQe4XKmXr4kPtb9UMTKceem7mNnLKD25", "amount_btc": 0.06}' -H "Content-Type: application/json" -X POST "http://localhost:3000/btc/create_tx"
curl -s -d '{"address_from":"1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY", "address_to":"15aQe4XKmXr4kPtb9UMTKceem7mNnLKD25", "amount_btc": 0.08}' -H "Content-Type: application/json" -X POST "http://localhost:3000/btc/create_tx"
-------------------------------------------
// bad request
curl -s -d '{"address_from":"1Nh7uHdvY6fNwtQtM1G5EZAFPLC33B59rB", "address_to":"", "amount_btc": 0.001}' -H "Content-Type: application/json" -X POST "http://localhost:3000/btc/create_tx"
curl -s -d '{"address_from":"1Nh7uHdvY6fNwtQtM1G5EZAFPLC33B59rB", "address_to":"15aQe4XKmXr4kPtb9UMTKceem7mNnLKD25"}' -H "Content-Type: application/json" -X POST "http://localhost:3000/btc/create_tx"
curl -s -d '{}' -H "Content-Type: application/json" -X POST "http://localhost:3000/btc/create_tx"
curl -s -d '{"address_from":"", "address_to":"15aQe4XKmXr4kPtb9UMTKceem7mNnLKD25", "amount_btc": 0.001}' -H "Content-Type: application/json" -X POST "http://localhost:3000/btc/create_tx"
curl -s -d '{"address_from":"1Nh7uHdvY6fNwtQtM1G5EZAFPLC33B59r1", "address_to":"15aQe4XKmXr4kPtb9UMTKceem7mNnLKD25", "amount_btc": 0.001}' -H "Content-Type: application/json" -X POST "http://localhost:3000/btc/create_tx"
-------------------------------------------
