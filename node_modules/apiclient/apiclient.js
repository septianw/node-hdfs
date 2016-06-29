/*
 * file     apiclient.js
 * path     /app/controller/
 * purpose  api client
 */

/**
 * ApiClient constructor
 * @param {Object} data Seed data.
 */
function ApiClient(data) {
  var util = require('util'),
      querystring = require('querystring'),
      url = require('url'),
      tmpfile = null,
      out = {},
      pathname = data.base.pathname;

  for (var method in data.path) {
    out[method] = {};
    for (var leaf in data.path[method]) {
      var uriproc = JSON.parse(JSON.stringify(data.base));    // clone object
      uriproc.pathname += data.path[method][leaf].location;

      uriproc.search = querystring.stringify(data.path[method][leaf].query);

      out[method][leaf] = url.format(uriproc);
    }
  }

  this.data = out;
}

/**
 * Check if is object empty
 * @param  {Object}  obj Object to be Check
 * @return {Boolean}     Return true if empty or false otherwise.
 */
function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

ApiClient.prototype._defaultAct = _defaultAct;
function _defaultAct (method, api, param, options, callback) {
  var querystring = require('querystring'),
      merge = require('merge'),
      opplain = {};
  var dops = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: options.body
  };

  delete options.body;

  opplain = merge(dops, options);

  this._minta(method, api, param, opplain, callback);
}

ApiClient.prototype._mktempdir = _mktempdir;
function _mktempdir (file, cb) {
  var tmp = require('tmp');
  if (file) {
    tmp.file({keep: true, template: '/tmp/tmp-XXXXXX'}, function __tmpFileCreated (err, path) {
      cb(err, path, '');
    });
  } else {
    tmp.dir({keep: true, template: '/tmp/tmp-XXXXXX'}, function __tmpDirCreated (err, path) {
      cb(err, path, '');
    });
  }
}

ApiClient.prototype._minta = function (method, api, param, options, callback) {
  var request = require('request'),
      merge = require('merge'),
      sprintf = require('sprintf-js').sprintf,
      cek = require('net').createConnection,
      url = require('url'),
      opt = {},
      self = this,
      defaultopt = {
        method: method,
        uri: self.data[method][api]
      };

  if (isEmptyObject(options)) {
    opt = defaultopt;
  } else {
    opt = merge(defaultopt, options);
  }

  opt.uri = sprintf(opt.uri, param);

  cek(url.parse(opt.uri).port, url.parse(opt.uri).hostname).on('connect', function(e){
    if (process.env.NODE_ENV == 'development') {
      require('request-debug')(request);
    }
    // TODO: cek dulu, kalau methodnya get, ambil header dulu.
    //       kalau ukurannya lebih dari 5k arahkan langsung ke disk,
    //       kalau ukurannya kurang dari 5k masukkan buffer.
    request(opt, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        callback(error, response, body);
      } else {
        callback(error, response, body);
      }
    });
  }).on('error', function(e){
    console.error(e);
    callback(e);
  });

};

ApiClient.prototype._dumpdisk = function (method, api, param, options, callback) {
  var request = require('request'),
      merge = require('merge'),
      sprintf = require('sprintf-js').sprintf,
      cek = require('net').createConnection,
      fs = require('fs.extra'),
      url = require('url'),
      self = this,
      opt = {},
      defaultopt = {
        method: method,
        uri: self.data[method][api]
      };

  if (isEmptyObject(options)) {
    opt = defaultopt;
  } else {
    opt = merge(defaultopt, options);
  }

  opt.uri = sprintf(opt.uri, param);

  cek(url.parse(opt.uri).port, url.parse(opt.uri).hostname).on('connect', function(e){

    self._mktempdir('file', function mktmpfile (e, o, se){

      if (e) {
        callback(e, se);
      } else {
        if (process.env.NODE_ENV == 'development') {
          require('request-debug')(request);
        }
        // TODO: cek dulu, kalau methodnya get, ambil header dulu.
        //       kalau ukurannya lebih dari 5k arahkan langsung ke disk,
        //       kalau ukurannya kurang dari 5k masukkan buffer.
        var fsws = fs.createWriteStream(o);
        var r = request(opt);
        r.on('response', function (response) {
          r.pipe(fsws);
          fsws.on('finish', function writeStream(){
            callback(null, response, o);
          });
        }).on('error', function (error){
          console.error(e);
          callback(error, null, o);
        });
      }
    });
  }).on('error', function(e){
    console.error(e);
    callback(e);
  });
};

ApiClient.prototype._sendBodyBin = function (method, api, param, options, callback) {
  var request = require('request'),
      merge = require('merge'),
      mime = require('mime'),
      sprintf = require('sprintf-js').sprintf,
      cek = require('net').createConnection,
      url = require('url'),
      fs = require('fs'),
      opt = {},
      self = this,
      localpath = options.qs.localpath,
      defaultopt = {
        method: method,
        uri: self.data[method][api],
        headers: {
          'Content-Type':mime.lookup(localpath)
        }
      };
  delete options.qs.localpath;

  if (isEmptyObject(options)) {
    opt = defaultopt;
  } else {
    opt = merge(defaultopt, options);
  }

  opt.uri = sprintf(opt.uri, param);

  cek(url.parse(opt.uri).port, url.parse(opt.uri).hostname).on('connect', function(e){
    if (process.env.NODE_ENV == 'development') {
      require('request-debug')(request);
    }
    var rf = fs.createReadStream(localpath);
    // var r = request(opt);

    rf.pipe(request(opt).on('response', function (res) {
      var data = '', ck = 0;
      // response body written on memory.
      res.on('data', function (chunk) {
        data += chunk;
        ck += chunk.length;
      });
      res.on('end', function () {
        return callback(null, res, data);
      });
      res.on('error', function (err) {
        return callback(err, res);
      });
    }));
    rf.on('error', callback);
    // rf.on('end', function () {
    //   r.on('response', function (res) {
    //   });
    // });

    // fs.createReadStream(localpath).pipe(request(opt, callback));

  }).on('error', function(e){
    console.error(e);
    callback(e);
  });
};

/**
 * Download file from server
 *
 * @param  {String}   api      Endpoint API.
 * @param  {Object}   param    Parameter url object.
 * @param  {Object}   options  Request option object.
 * @param  {Function} callback Callback function.
 * @return {Void}              Nothing to return.
 */
ApiClient.prototype.download = function (api, param, options, callback) {
  this._dumpdisk('GET', api, param, options, callback);
};

/**
 * Get thing from server using method HTTP GET
 *
 * @param  {String}   api      Endpoint API.
 * @param  {Object}   param    Parameter url object.
 * @param  {Object}   options  Request option object.
 * @param  {Function} callback Callback function.
 * @return {Void}              Nothing to return.
 */
ApiClient.prototype.get = function (api, param, options, callback) {
  this._minta('GET', api, param, options, callback);
};

/**
 * Upload file to server using POST method with attached file on body.
 *
 * @param  {String}   api      Endpoint API.
 * @param  {Object}   param    Parameter url object.
 * @param  {Object}   options  Request option object.
 * @param  {Function} callback Callback function.
 * @return {Void}              Nothing to return.
 */
ApiClient.prototype.postUpload = function (api, param, options, callback) {
  this._sendBodyBin('POST', api, param, options, callback);
};

/**
 * Upload file to server using POST method with attached file on body,
 * formatted as multipart form.
 *
 * @param  {String}   api      Endpoint API.
 * @param  {Object}   param    Parameter url object.
 * @param  {Object}   options  Request option object.
 * @param  {Function} callback Callback function.
 * @return {Void}              Nothing to return.
 */
ApiClient.prototype.postForm = function (api, param, options, callback) {
  this._defaultAct('POST', api, param, options, callback);
};

/**
 * Send string via POST method. This API will keep body on memory, attaching
 * big string more than 1MB is not recommended, as it will fill the memory so fast.
 *
 * @param  {String}   api      Endpoint API.
 * @param  {Object}   param    Parameter url object.
 * @param  {Object}   options  Request option object.
 * @param  {Function} callback Callback function.
 * @return {Void}              Nothing to return.
 */
ApiClient.prototype.post = function (api, param, options, callback) {
  this._minta('POST', api, param, options, callback);
};

/**
 * Send data using PUT method with multipart/form-data format body.
 *
 * @param  {String}   api      Endpoint API.
 * @param  {Object}   param    Parameter url object.
 * @param  {Object}   options  Request option object.
 * @param  {Function} callback Callback function.
 * @return {Void}              Nothing to return.
 */
ApiClient.prototype.putForm = function (api, param, options, callback) {
  this._defaultAct('PUT', api, param, options, callback);
};

/**
 * Send data using PUT method with raw string body.
 *
 * @param  {String}   api      Endpoint API.
 * @param  {Object}   param    Parameter url object.
 * @param  {Object}   options  Request option object.
 * @param  {Function} callback Callback function.
 * @return {Void}              Nothing to return.
 */
ApiClient.prototype.put = function (api, param, options, callback) {
  this._minta('PUT', api, param, options, callback);
};

/**
 * Send data using DELETE method with raw string body.
 *
 * @param  {String}   api      Endpoint API.
 * @param  {Object}   param    Parameter url object.
 * @param  {Object}   options  Request option object.
 * @param  {Function} callback Callback function.
 * @return {Void}              Nothing to return.
 */
ApiClient.prototype.delete = function (api, param, options, callback) {
  this._minta('DELETE', api, param, options, callback);
};

module.exports = ApiClient;
