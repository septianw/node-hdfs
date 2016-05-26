var Api = require('apiclient');
var async = require('async');
var seed = require('./seed.json');
var common = require('bcommon');
var exec = require('child_process').exec;

/**
 * Check the parameter, return path if there is path in parameter,
 * and return / if no path in parameter.
 * @param  {Object} param Parameter from user
 * @return {Object}       Object with only path in it.
 */
function cekpath(param) {
  if (param.path) {
    return { path: param.path };
  } else {
    return { path: '/' };
  }
}

/**
 * Prepare parameter, separate request option and request parameter,
 * set default option, and explicitly set path.
 * @param  {Object} param Mixed request parameter.
 * @return {Object}       Clean ready to use request parameter.
 */
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

/**
 * Hdfs class constructor
 * @param {Object} data Object data seed.
 */
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

/**
 * **Get file status from HDFS**
 * Possible properties of param is :
 *
 * | name | presence | type | default | description |
 * | --- | --- | --- | --- | --- |
 * | path | optional | String | / | Path status that will be taken |
 *
 * @param  {Object}   param    Request parameter for get file status endpoint
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.getfilestatus = function (param, callback) {
  var self = this; self._send('get', 'filestatus', param, callback);
};

/**
 * List status of file and directory under specified directory
 *
 * | name | presence | type | default | description |
 * | ---- | -------- | ---- | ------- | ----------- |
 * | path | optional | String | / | Path status that will be taken |
 *
 * @param  {Object}   param    Request parameter for get list of status file
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.liststatus = function (param, callback) {
  var self = this; self._send('get', 'liststatus', param, callback);
};

/**
 * Download file from HDFS with without buffering.
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Open_and_Read_a_File
 *
 * Param properties :
 *
 * |    name    | presence |  type  | default   |   valid value  | description |
 * | ---------- | -------- | ------ | --------- | -------------- | ----------- |
 * | path       | optional | String | /         | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
 * | offset     | optional | Long   | 0         | >=0            | The starting byte position |
 * | length     | optional | Long   | null      | >=0 or null    | The number of bytes to be processed. null means the entire file |
 * | buffersize | optional | Int    | Specified in hadoop configuration | >0 | The size of the buffer used in transferring data. |
 *
 * @param  {Object}   param    Request parameter for download file from HDFS
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.download = function (param, callback) {
  var self = this; self._send('download', 'openreadfile', param, callback);
};

/**
 * Upload file to HDFS without buffering.
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Create_and_Write_to_a_File
 *
 * Param properties :
 *
 * |    name     | presence |  type   | default | valid value | description |
 * | ----------- | -------- | ------- | ------- | --- | ----------- |
 * | path        | optional | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
 * | overwrite   | optional | Boolean | false   | true or false | If a file already exists, should it be overwritten? |
 * | blocksize   | optional | Long    | Specified in hadoop configuration | >0 | The block size of a file. |
 * | replication | optional | Short   | Specified in hadoop configuration | >0 | The number of replications of a file. |
 * | permission  | optional | octal   | 755     | 0 - 1777 | The permission of a file/directory. |
 * | buffersize  | optional | Int     | Specified in hadoop configuration | >0 | The size of the buffer used in transferring data. |
 *
 *
 * @param  {Object}   param    Request parameter for upload file from HDFS
 * @param  {Function} callback Callback function to return the result
 */
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

/**
 * Open file from HDFS, this function will buffer content file in memory
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Open_and_Read_a_File
 *
 * Param properties :
 *
 * |    name     | presence |  type   | default |  valid value   | description |
 * | ----------- | -------- | ------- | ------- | -------------- | ----------- |
 * | path        | optional | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
 * | offset      | optional | Long    | 0       | >=0            | The starting byte position |
 * | length      | optional | Long    | null    | >=0 or null    | The number of bytes to be processed. null means the entire file |
 * | buffersize  | optional | Int     | Specified in hadoop configuration | >0 | The size of the buffer used in transferring data. |
 *
 *
 * @param  {Object}   param    Request parameter for open file from HDFS
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.open = function (param, callback) {
  var self = this; self._send('get', 'openreadfile', param, callback);
};

/**
 * Get home directory of current accessing user.
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Get_Home_Directory
 *
 * @param  {Object}   param    Request parameter for getting home directory.
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.gethomedirectory = function (callback) {
  var param = {};
  var self = this; self._send('get', 'gethomedir', param, callback);
};

/**
 * Get summary of content
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Get_Content_Summary_of_a_Directory
 *
 * |    name     | presence |  type   | default |  valid value   | description |
 * | ----------- | -------- | ------- | ------- | -------------- | ----------- |
 * | path        | optional | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
 *
 *
 * @param  {Object}   param    Request parameter for getting home directory.
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.getcontentsummary = function (param, callback) {
  var self = this; self._send('get', 'getcontentsum', param, callback);
};

/**
 * Get checksum of file
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Get_File_Checksum
 *
 * |    name     | presence |  type   | default |  valid value   | description |
 * | ----------- | -------- | ------- | ------- | -------------- | ----------- |
 * | path        | optional | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
 *
 *
 * @param  {Object}   param    Request parameter for get checksum of file.
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.getfilechecksum = function (param, callback) {
  var self = this; self._send('get', 'getfilechecksum', param, callback);
};
//skipped

/**
 * Concatenating file to another one.
 * **Warning** : It's still experimental. We warn you.
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Concat_Files
 *
 * |    name     | presence  |  type   | default |  valid value   | description |
 * | ----------- | --------  | ------- | ------- | -------------- | ----------- |
 * | path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
 * | sources     | Mandatory | String  | <empty> | A list of comma seperated absolute FileSystem paths without scheme and authority. | A list of source paths. |
 *
 * @param  {Object}   param    Request parameter for concatenating file.
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.concat = function (param, callback) {
  var self = this; self._send('post', 'concat', param, callback);
};

/**
 * Append data to another file in HDFS
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Append_to_a_File
 *
 * Param properties :
 *
 * |     name    | presence  |  type   | default | valid value | description |
 * | ----------- | --------- | ------- | ------- | ----------- | ----------- |
 * | path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
 * | buffersize  | optional  | Int     | Specified in hadoop configuration | >0 | The size of the buffer used in transferring data. |
 *
 * @param  {Object}   param    Request parameter for upload file from HDFS
 * @param  {Function} callback Callback function to return the result
 */
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

/**
 * Create file in HDFS.
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Create_and_Write_to_a_File
 *
 * Param properties :
 *
 * |     name    | presence  |  type   | default | valid value | description |
 * | ----------- | --------- | ------- | ------- | --- | ----------- |
 * | path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
 * | overwrite   | optional  | Boolean | false   | true or false | If a file already exists, should it be overwritten? |
 * | blocksize   | optional  | Long    | Specified in hadoop configuration | >0 | The block size of a file. |
 * | replication | optional  | Short   | Specified in hadoop configuration | >0 | The number of replications of a file. |
 * | permission  | optional  | octal   | 755     | 0 - 1777 | The permission of a file/directory. |
 * | buffersize  | optional  | Int     | Specified in hadoop configuration | >0 | The size of the buffer used in transferring data. |
 *
 *
 * @param  {Object}   param    Request parameter for upload file from HDFS
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.create = function (param, callback) {
  var self = this;
  param.followAllRedirects = true;
  self._send('put', 'create', param, callback);
};

/**
 * Rename file or directory in HDFS
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Rename_a_FileDirectory
 *
 * Param properties :
 *
 * |     name    | presence  |  type   | default | valid value | description |
 * | ----------- | --------- | ------- | ------- | --- | ----------- |
 * | path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
 * | destination | Mandatory | String  | <empty> (an invalid path) | An absolute FileSystem path without scheme and authority. | The destination path. |
 *
 *
 * @param  {Object}   param    Request parameter for rename file or directory.
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.rename = function (param, callback) {
  var self = this; self._send('put', 'rename', param, callback);
};

/**
 * Make directory in Hdfs
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Make_a_Directory
 *
 * Param properties :
 *
 * |    name     | presence |  type   | default | valid value | description |
 * | ----------- | -------- | ------- | ------- | --- | ----------- |
 * | path        | optional | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
 * | permission  | optional | octal   | 755     | 0 - 1777 | The permission of a file/directory. |
 *
 * @param  {Object}   param    Request parameter for make directory in HDFS
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.mkdirs = function (param, callback) {
  var self = this; self._send('put', 'makedir', param, callback);
};

/**
 * Set permission of file in HDFS
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Set_Permission
 *
 * Param properties :
 *
 * |    name     | presence  |  type   | default | valid value | description |
 * | ----------- | --------- | ------- | ------- | --- | ----------- |
 * | path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
 * | permission  | Mandatory | octal   | 755     | 0 - 1777 | The permission of a file/directory. |
 *
 * @param  {Object}   param    Request parameter for set permission of file and directory in HDFS
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.setpermission = function (param, callback) {
  var self = this; self._send('put', 'setpermission', param, callback);
};

/**
 * Set owner of file or directory
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Set_Owner
 *
 * Param properties :
 *
 * |    name     | presence  |  type   | default | valid value | description |
 * | ----------- | --------- | ------- | ------- | --- | ----------- |
 * | path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
 * | owner       | Optional  | String  | <empty> (means keeping it unchanged) | Any valid username. | The username who is the owner of a file/directory. |
 * | group       | Optional  | String  | <empty> (means keeping it unchanged) | Any valid group name. | The name of a group. |
 *
 * @param  {Object}   param    Request parameter for set owner in HDFS
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.setowner = function (param, callback) {
  var self = this; self._send('put', 'setowner', param, callback);
};

/**
 * Set replication factor of file.
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Set_Replication_Factor
 *
 * Param properties :
 *
 * |    name     | presence  |  type   | default | valid value | description |
 * | ----------- | --------- | ------- | ------- | --- | ----------- |
 * | path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
 * | replication | Optional  | Short   | Specified in the configuration. | >0 | The number of replications of a file. |
 *
 * @param  {Object}   param    Request parameter for set replication file.
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.setreplication = function (param, callback) {
  var self = this; self._send('put', 'setreplication', param, callback);
};

/**
 * Set time and date of file in HDFS
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Set_Access_or_Modification_Time
 *
 * Param properties :
 *
 * |    name     | presence  |  type   | default | valid value | description |
 * | ----------- | --------- | ------- | ------- | --- | ----------- |
 * | path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
 * | modificationtime | Optional | Long | -1 (means keeping it unchanged) | -1 or a timestamp | The modification time of a file/directory. |
 * | accesstime | Optional | Long | -1 (means keeping it unchanged) | -1 or a timestamp | The access time of a file/directory. |
 *
 * @param  {Object}   param    Request parameter for setting time and date of file.
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.settimes = function (param, callback) {
  var self = this; self._send('put', 'settimes', param, callback);
};

/**
 * Delete file or directory in HDFS
 * @see https://hadoop.apache.org/docs/r2.7.0/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Delete_a_FileDirectory
 *
 * Param properties :
 * 
 * |    name     | presence  |  type   | default | valid value | description |
 * | ----------- | --------- | ------- | ------- | --- | ----------- |
 * | path        | Mandatory | String  | /       | An absolute FileSystem path without scheme and authority. | Path status that will be taken |
 * | recursive   | Optional  | Boolean | false   | true or false | Should the operation act on the content in the subdirectories? |
 *
 * @param  {Object}   param    Request parameter for deleting file and or directory.
 * @param  {Function} callback Callback function to return the result
 */
Hdfs.prototype.delete = function (param, callback) {
  var self = this; self._send('delete', 'delete', param, callback);
};

module.exports = Hdfs;
