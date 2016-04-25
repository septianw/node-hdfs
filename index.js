var Api = require('apiclient');
var async = require('async');
var seed = require('./seed.json');
var common = require('bcommon');
var exec = require('child_process').exec;

function cekpath(param) {
  if (param.path) {
    return { path: param.path };
  } else {
    return { path: '/' };
  }
}

function prepvar(param) {
  var par = cekpath(param);
  delete param.path;
  var opt = {
    qs: param
  };
  if (param.followAllRedirects) {
    opt.followAllRedirects = true;
  }
  return {
    opt: opt,
    par: par
  };
}


function Hdfs(data) {
  // console.log(data);
  seed.base.protocol = data.protocol;
  seed.base.hostname = data.hostname;
  seed.base.port = data.port;
  // console.log(seed);
  var rest = new Api(seed);
  var self = this; self._send = function (method, endpoint, param, callback) {
    var p = prepvar(param);
    // p.opt.followAllRedirects = true;
    rest[method](endpoint, p.par, p.opt, callback);
  };
  self._sendFile = function (method, url, filepath, callback) {
    var request = require('request'),
      fs = require('fs'),
      rf = fs.createReadStream(filepath),
      r = request[method](url);
    rf.pipe(r);
    rf.on('error', callback);
    rf.on('end', function () {
      r.on('response', function (res) {
        var data = '', ck = 0;
        res.on('data', function (chunk) {
          data += chunk;
          ck += chunk.length;
        });
        res.on('end', function () {
          callback(null, res, data);
        });
        res.on('error', function (err) {
          callback(err, res);
        });
      });
    });
  };
}


Hdfs.prototype.getfilestatus = function (param, callback) {
  var self = this; self._send('get', 'filestatus', param, callback);
  // async.waterfall([
  //   function get(cb) {
  //     self.rest.get('filestatus', par, opt, cb);
  //   }
  // ], function done(err, res, body) {
  //   return
  // });
};

Hdfs.prototype.liststatus = function (param, callback) {
  var self = this; self._send('get', 'liststatus', param, callback);
};

Hdfs.prototype.download = function (param, callback) {
  var self = this; self._send('download', 'openreadfile', param, callback);
};

Hdfs.prototype.upload = function (param, callback) {
  var self = this,
    pb = JSON.parse(JSON.stringify(param)),
    request = require('request');
  delete param.localpath;
  param.followAllRedirects = true;
  self._send('put', 'create', param, function(e, r, b) {
    if (e) {
      callback(e, r, b);
    } else {
      if (r.statusCode == 201) {
        self._send('post', 'append', pb, function (ee, rr, bb) {
          if (rr.statusCode == 307) {
            self._sendFile('post', rr.headers.location, pb.localpath, callback);
          }
        });
      } else {
        callback(e, r, b);
      }
    }
  });
};

Hdfs.prototype.open = function (param, callback) {
  var self = this; self._send('get', 'openreadfile', param, callback);
};

Hdfs.prototype.gethomedirectory = function (param, callback) {
  var self = this; self._send('get', 'gethomedir', param, callback);
};

Hdfs.prototype.getcontentsummary = function (param, callback) {
  var self = this; self._send('get', 'getcontentsum', param, callback);
};

Hdfs.prototype.getfilechecksum = function (param, callback) {
  var self = this; self._send('get', 'getfilechecksum', param, callback);
};
//skipped
Hdfs.prototype.concat = function (path) {
  var self = this; self._send('post', 'concat', param, callback);
};

Hdfs.prototype.append = function (param, callback) {
  var pb = JSON.parse(JSON.stringify(param));
  delete param.localpath;
  var self = this; self._send('post', 'append', param, function(e, r, b) {
    if (e) {
      callback(e, r, b);
    } else {
      console.log(r.statusCode);
      if (r.statusCode == 307) {
        self._sendFile('post', r.headers.location, pb.localpath, callback);
      } else {
        callback(e, r, b);
      }
    }
  });
};

Hdfs.prototype.create = function (param, callback) {
  var self = this;
  param.followAllRedirects = true;
  self._send('put', 'create', param, callback);
};

Hdfs.prototype.rename = function (param, callback) {
  var self = this; self._send('put', 'rename', param, callback);
};

Hdfs.prototype.mkdirs = function (param, callback) {
  var self = this; self._send('put', 'makedir', param, callback);
};

Hdfs.prototype.setpermission = function (param, callback) {
  var self = this; self._send('put', 'setpermission', param, callback);
};

Hdfs.prototype.setowner = function (param, callback) {
  var self = this; self._send('put', 'setowner', param, callback);
};

Hdfs.prototype.setreplication = function (param, callback) {
  var self = this; self._send('put', 'setreplication', param, callback);
};

Hdfs.prototype.settimes = function (param, callback) {
  var self = this; self._send('put', 'settimes', param, callback);
};

Hdfs.prototype.delete = function (param, callback) {
  var self = this; self._send('delete', 'delete', param, callback);
};

module.exports = Hdfs;
