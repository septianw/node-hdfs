var Api = require('apiclient');
var async = require('async');
var seed = require('./seed.json');

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

  return {
    opt: opt,
    par: par
  }
}

function Hdfs(data) {
  seed.base.protocol = data.protocol;
  seed.base.hostname = data.hostname;
  seed.base.port = data.port;

  var rest = new Api(seed);
  this.send = function (method, endpoint, param, callback) {
    var p = prepvar(param);
    p.opt.followAllRedirects = true;
    rest[method](endpoint, p.par, p.opt, callback);
  };
  // this.send = {
  //   get: function (endpoint, param, callback) {
  //     var p = prepvar(param);
  //     rest.get(endpoint, p.par, p.opt, callback);
  //   }
  //   post:
  //   put:
  //   del:
  // }
}


Hdfs.prototype.getfilestatus = function (param, callback) {
  this.send('get', 'filestatus', param, callback);
  // async.waterfall([
  //   function get(cb) {
  //     self.rest.get('filestatus', par, opt, cb);
  //   }
  // ], function done(err, res, body) {
  //   return
  // });
};

Hdfs.prototype.liststatus = function (param, callback) {
  this.send('get', 'filestatus', param, callback);
};

Hdfs.prototype.download = function (param, callback) {
  this.send('download', 'openreadfile', param, callback);
};

Hdfs.prototype.upload = function (param, callback) {
  var self = this;
  var pb = JSON.parse(JSON.stringify(param));
  delete param.localpath;
  console.log(param);
  self.send('put', 'create', param, function(e, r, b) {
    if (e) {
      callback(e, r, b);
    } else {
      if (r.statusCode == 201) {
        self.send('postUpload', 'append', pb, callback);
      } else {
        callback(e, r, b);
      }
    }
  });
};

Hdfs.prototype.open = function (param, callback) {
  this.send('get', 'openreadfile', param, callback);
};

Hdfs.prototype.gethomedirectory = function (param, callback) {
  this.send('get', 'gethomedir', param, callback);
};

Hdfs.prototype.getcontentsummary = function (path) {
  this.send('get', 'getcontentsum', param, callback);

};

Hdfs.prototype.getfilechecksum = function (path) {
  this.send('get', 'getfilechecksum', param, callback);

};

Hdfs.prototype.concat = function (path) {
  this.send('post', 'concat', param, callback);
};

Hdfs.prototype.append = function (path) {
  this.send('post', 'append', param, callback);
};

Hdfs.prototype.create = function (path) {
  this.send('put', 'create', param, callback);
};

Hdfs.prototype.rename = function (path) {
  this.send('put', 'rename', param, callback);
};

Hdfs.prototype.mkdirs = function (path) {
  this.send('put', 'makedir', param, callback);
};

Hdfs.prototype.setpermission = function (path) {
  this.send('put', 'setpermission', param, callback);
};

Hdfs.prototype.setowner = function (path) {
  this.send('put', 'setowner', param, callback);
};

Hdfs.prototype.setreplication = function (path) {
  this.send('put', 'setreplication', param, callback);
};

Hdfs.prototype.settimes = function (path) {
  this.send('put', 'settimes', param, callback);
};

Hdfs.prototype.delete = function (path) {
  this.send('delete', 'delete', param, callback);
};

module.exports = Hdfs;
