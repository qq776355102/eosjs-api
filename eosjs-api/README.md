
# Eos API

Application programming interface to EOS blockchain nodes.  This is for
read-only API calls.  If you need to sign transactions use
[eosjs](https://github.com/eosio/eosjs) instead.

# Include

* Install with: qq_776355102


```html
<html>
<head>
  <meta charset="utf-8">
  <script src="./dist/eos-api.js"></script>
</head>
<body>
  See console object: EosApi
</body>
</html>
```

## EosApi

Run [nodeos](https://github.com/eosio/eos)

* [API](./docs/api.md)
* [Helper Functions](./docs/index.md)

## Usage

```javascript
EosApi = require('eosjs-api') // Or EosApi = require('./src')

eos = EosApi() // // 127.0.0.1:8888

// All apis don't have this callback function
// parameters, return value, and possible errors.  All methods and documentation
// are created from JSON files in eosjs/json/api/v1..
eos.getInfo()

// A String is returned 
var result = eos.getInfo({});
var result = eos.getBlock(1);



// Parameters
eos.getBlock(1)

// Parameters can be an object
eos.getBlock({block_num_or_id: 1)
var result = eos.getBlock({block_num_or_id: 1})
console.log(result)
```

## Configuration

```js
EosApi = require('eosjs-api') // Or EosApi = require('./src')

// everything is optional
options = {
  httpEndpoint: 'http://127.0.0.1:8888', // default, null for cold-storage
  verbose: false, // API logging
  logger: { // Default logging functions
    log: config.verbose ? console.log : null,
    error: config.verbose ? console.error : null
  },
  fetchConfiguration: {}
}

eos = EosApi(options)
```
### options.logger example

During testing, an error may be expected and checked as follows:

```js
options.logger = {
  error: err => {
    assert.equal(err, 'expected error')
    done()
  }
}
```

### options.fetchConfiguration example

```js
options.fetchConfiguration = {
  credentials: 'same-origin'
}
```

```

## Environment

Node and browser (es2015)
