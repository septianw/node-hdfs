/*
 * file     apiclient.js
 * path     /app/controller/
 * purpose  api client
 */

function ApiClient(data) {
  var util = require('util'),
      querystring = require('querystring'),
      url = require('url'),
      tmpfile = null,
      out = {},
      pathname = data.base.pathname;

//  console.log(data.base);
  for (var method in data.path) {
    out[method] = {};
    for (var leaf in data.path[method]) {
      // debugger;
      var uriproc = JSON.parse(JSON.stringify(data.base));    // clone object
      uriproc.pathname += data.path[method][leaf].location;

      uriproc.search = querystring.stringify(data.path[method][leaf].query);

      out[method][leaf] = url.format(uriproc);
//      console.log(uriproc);
//      console.log(data.base);
    }
  }

//  console.log(data.base);
//  console.log(out);
  this.data = out;
}

function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

ApiClient.prototype._defaultAct = function (method, api, param, options, callback) {
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

ApiClient.prototype._mktempdir = function (file, cb) {
  var cmd = 'mktemp --tmpdir=' + config.tmp.dir;
  var exec = require('child_process').exec;
  if (file) {
    exec(cmd + ' bgtmpXXXXXXXXXX', function excb(err, stdout, stderr) {
      // console.log(stdout);
      cb(err, stdout, stderr);
    });
  } else {
    exec(cmd + ' -d bgtmpXXXXXXXXXX', function excb(err, stdout, stderr) {
      // console.log(stdout);
      cb(err, stdout, stderr);
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
      defaultopt = {
        method: method,
        uri: this.data[method][api]
      };

  if (isEmptyObject(options)) {
    opt = defaultopt;
  } else {
    opt = merge(defaultopt, options);
  }

  opt.uri = sprintf(opt.uri, param);
  // console.log(opt);
  // console.log(this.data);

  // console.log(url.parse(opt.uri));
  cek(url.parse(opt.uri).port, url.parse(opt.uri).hostname).on('connect', function(e){
    console.error(e);
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

}

ApiClient.prototype._dumpdisk = function (method, api, param, options, callback) {
  var request = require('request'),
      merge = require('merge'),
      sprintf = require('sprintf-js').sprintf,
      cek = require('net').createConnection,
      fs = require('fs.extra'),
      url = require('url'),
      opt = {},
      defaultopt = {
        method: method,
        uri: this.data[method][api]
      };

  if (isEmptyObject(options)) {
    opt = defaultopt;
  } else {
    opt = merge(defaultopt, options);
  }

  opt.uri = sprintf(opt.uri, param);
  // console.log(opt);
  // console.log(this.data);

  // console.log(url.parse(opt.uri));
  var self = this;
  cek(url.parse(opt.uri).port, url.parse(opt.uri).hostname).on('connect', function(e){
    console.error(e);

    self._mktempdir('file', function mktmpfile (e, o, se){
      debugger;
      o = o.substring(0, o.length - 1); // hapus \n
      debugger;

      if (e) {
        callback(e, se);
      } else {
        if (process.env.NODE_ENV == 'development') {
          require('request-debug')(request);
        }
        // TODO: cek dulu, kalau methodnya get, ambil header dulu.
        //       kalau ukurannya lebih dari 5k arahkan langsung ke disk,
        //       kalau ukurannya kurang dari 5k masukkan buffer.
        var fsws = fs.createWriteStream(o)
        var r = request(opt);
        r.on('response', function (response) {
          r.pipe(fsws);
          fsws.on('finish', function writeStream(){
            callback(null, response, o);
          });
        }).on('error', function (error){
          callback(error, null, o);
        });
        debugger;
      }
    });
  }).on('error', function(e){
    console.error(e);
    callback(e);
  });
}

ApiClient.prototype._sendBodyBin = function (method, api, param, options, callback) {
  var request = require('request'),
      merge = require('merge'),
      mime = require('mime'),
      sprintf = require('sprintf-js').sprintf,
      cek = require('net').createConnection,
      url = require('url'),
      fs = require('fs'),
      opt = {},
      localpath = options.localpath,
      defaultopt = {
        method: method,
        uri: this.data[method][api],
        headers: {
          'Content-Type':mime.lookup(localpath)
        }
      };
  delete options.localpath;

  if (isEmptyObject(options)) {
    opt = defaultopt;
  } else {
    opt = merge(defaultopt, options);
  }

  opt.uri = sprintf(opt.uri, param);

  cek(url.parse(opt.uri).port, url.parse(opt.uri).hostname).on('connect', function(e){
    console.error(e);
    if (process.env.NODE_ENV == 'development') {
      require('request-debug')(request);
    }

    fs.createReadStream(localpath).pipe(request(opt, callback));

  }).on('error', function(e){
    console.error(e);
    callback(e);
  });
};

ApiClient.prototype.download = function (api, param, options, callback) {
  this._dumpdisk('GET', api, param, options, callback);
};

ApiClient.prototype.get = function (api, param, options, callback) {
  this._minta('GET', api, param, options, callback);
}

ApiClient.prototype.postUpload = function (api, param, options, callback) {
  this._sendBodyBin('POST', api, param, options, callback);
};

ApiClient.prototype.postForm = function (api, param, options, callback) {
  this._defaultAct('POST', api, param, options, callback);
};

ApiClient.prototype.post = function (api, param, options, callback) {
  this._minta('POST', api, param, options, callback);
}

ApiClient.prototype.putForm = function (api, param, options, callback) {
  this._defaultAct('PUT', api, param, options, callback);
}

ApiClient.prototype.put = function (api, param, options, callback) {
  this._minta('PUT', api, param, options, callback);
}

ApiClient.prototype.delete = function (api, param, options, callback) {
  this._minta('DELETE', api, param, options, callback);
}

module.exports = ApiClient;
