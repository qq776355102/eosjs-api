fetch(url, fetchConfiguration).then(function (response) {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      return response.text().then(function (bodyResp) {
        var error = new Error(bodyResp);
        error.status = response.status;
        error.statusText = response.statusText;
        throw error;
      });
    }
  }).then(function (objectResp) {
    if (logger.log) {
      logger.log('api <', 'response', '\t', url, JSON.stringify(objectResp));
    }
    try {
      callback(null, objectResp);
    } catch (callbackError) {
      if (logger.error) {
        logger.error('api <', 'result callback', ':', callbackError);
      }
    }
  }).catch(function (error) {
    var message = '';
    try {
      // nodeos format (fail safe)
      message = JSON.parse(error.message).error.details[0];
    } catch (e2) {}

    if (logger.error) {
      logger.error('api <', 'error', '\t', message, url, body);
      logger.error(error);
    }

    try {
      callback(error);
    } catch (callbackError) {
      if (logger.error) {
        logger.error('api <', 'error callback', ':', callbackError);
      }
    }
  });