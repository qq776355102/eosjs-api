'use strict';

require('isomorphic-fetch');
var camelCase = require('camel-case');
var helpers = require('./exported-helpers');
var processArgs = require('./process-args');
var request = require('sync-request');

module.exports = apiGen;

function apiGen(version, definitions) {
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var configDefaults = {
    httpEndpoint: 'http://127.0.0.1:8888',
    verbose: false,
    logger: {
      log: function log() {
        var _console;

        return config.verbose ? (_console = console).log.apply(_console, arguments) : null;
      },
      error: function error() {
        var _console2;

        return config.verbose ? (_console2 = console).error.apply(_console2, arguments) : null;
      }
    }
  };

  function applyDefaults(target, defaults) {
    Object.keys(defaults).forEach(function (key) {
      if (target[key] === undefined) {
        target[key] = defaults[key];
      }
    });
  }

  applyDefaults(config, configDefaults);
  applyDefaults(config.logger, configDefaults.logger);

  var api = {};
  var httpEndpoint = config.httpEndpoint;


  for (var apiGroup in definitions) {
    for (var apiMethod in definitions[apiGroup]) {
      var methodName = camelCase(apiMethod);
      var url = httpEndpoint + '/' + version + '/' + apiGroup + '/' + apiMethod;
      api[methodName] = fetchMethod(methodName, url, definitions[apiGroup][apiMethod], config);
    }
  }

  var _loop = function _loop(helper) {
    // Insert `api` as the first parameter to all API helpers
    api[helper] = function () {
      var _helpers$api;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_helpers$api = helpers.api)[helper].apply(_helpers$api, [api].concat(args));
    };
  };

  for (var helper in helpers.api) {
    _loop(helper);
  }
  return api;
}




function fetchMethod(methodName, url, definition, config) {
  var logger = config.logger;


  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (args.length === 0) {
      console.log(usage(methodName, definition));
      return;
    }

    var optionsFormatter = function optionsFormatter(option) {
      if (typeof option === 'boolean') {
        return { broadcast: option };
      }
    };

    var processedArgs = processArgs(args, Object.keys(definition.params || []), methodName, optionsFormatter);

    var params = processedArgs.params,
        options = processedArgs.options,
        returnPromise = processedArgs.returnPromise;
    var callback = processedArgs.callback;


    var body = JSON.stringify(params);
    if (logger.log) {
      logger.log('api >', 'post', '\t', url, body);
    }
    // qq_776355102
    var fetchConfiguration = { body: body, method: 'POST',url: url};
    Object.assign(fetchConfiguration, config.fetchConfiguration);

    console.log(url);
    console.log(fetchConfiguration);
    return post(fetchConfiguration);
  };
}
function post(options){
  var param = {
		header: {
            "content-type": "application/json"},
		body: options.body
        };
  return request(options.method,options.url,param).getBody();
}

function usage(methodName, definition) {
  var usage = '';
  var out = function out(str) {
    usage += str + '\n';
  };

  out('USAGE');
  out(methodName + ' - ' + definition.brief);

  out('\nPARAMETERS');
  if (definition.params) {
    out(JSON.stringify(definition.params, null, 2));
  } else {
    out('none');
  }

  out('\nRETURNS');
  if (definition.results) {
    out('' + JSON.stringify(definition.results, null, 2));
  } else {
    out('no data');
  }

  out('\nERRORS');
  if (definition.errors) {
    for (var error in definition.errors) {
      var errorDesc = definition.errors[error];
      out('' + error + (errorDesc ? ' - ' + errorDesc : ''));
    }
  } else {
    out('nothing special');
  }

  return usage;
}