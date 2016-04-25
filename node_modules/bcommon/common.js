/*
    filename    common.js
    purpose     contain common function
*/

/**
 * Fungsi chmod
 * Fungsi ini bertindak sebagai penyederhana fungsi fs.chmod
 * @param  {string} file    file yang akan dirubah modenya
 * @param  {octal}  mode    mode perubahan
 * @param  {string} message pesan yang akan tampil ketika berhasil
 */
function chmod (file, mode, message) {
    var fs = require('fs');
    fs.chmod(file, mode, function(err) {
        if (err) { console.log(err) }
        else if (typeof message !== 'undefined') {
            console.log(message);
        }
    });
};
exports = module.exports.chmod = chmod;

/**
 * Fungsi generate random string
 *
 * Fungsi ini akan generate string acak, secara default
 * fungsi ini akan membuat string sepanjang 48 byte.
 *
 * @param  {integer} length integer length of string in byte
 * @return {string}         random string in specified length
 */
function genrandkey (length) {
  var crypto = require('crypto');
  if ( typeof(length) == "undefined" ) { length = 63; }
  return crypto.randomBytes(length).toString('hex');
}
exports = module.exports.genrandkey = genrandkey;

/**
 * showStatus
 *
 * show status of transaction
 *
 * @param   {integer}   code    kode status
 * @param   {string}    message Pesan yang akan ditampilkan ke status
 *
 * @return  {object}    object  json object of status
 */

 function showStatus (code, message) {
  var status = {};
  switch (code) {
      case 1:
        status.code = code;
        status.status = 'success';
      break;

      case 2:
        status.code = code;
        status.status = 'sent';
      break;

      case 3:
        status.code = code;
        status.status = 'corrupt';
      break;

      case 4:
        status.code = code;
        status.status = 'queueing';
      break;

      case 5:
        status.code = code;
        status.status = 'fail';
      break;

      case 6:
        status.code = code;
        status.status = 'created';
      break;

      case 7:
        status.code = code;
        status.status = 'Forbidden';
      break;

      default:
        status.code = 9;
        status.status = 'Unknown error';
  }
  status.message = message;

  // console.log(status);
  return status;
}
exports = module.exports.showStatus = showStatus;

/**
 * Fungsi ini akan menguji object, apakah object tersebut kosong atau tidak.
 *
 * @param   {Object}  obj Object yang akan diuji
 * @returns {Boolean} Nilai balik berupa boolean, true bila kosong, atau false bila tidak.
 */
function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}
exports = module.exports.isEmptyObject = isEmptyObject;

/**
 * Find unique content of object
 *
 * @param   {Object} a Asserted object
 * @returns {Object} Unique result object
 */
function uniq(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}
exports = module.exports.uniq = uniq;

/**
 * Change string to namespace
 *
 * @param   {String} name      Separated string
 * @param   {String} separator Separator of string
 * @param   {Object} container Target object
 * @param   {Mixed}  val       Content of target object
 * @returns {Object} Nested object result
 */
function namespace (name, separator, container, val){
  var ns = name.split(separator || '.'),
      o = container || container, i, len;
  for(i = 0, len = ns.length; i < len; i++){
    var v = (i==len-1 && val) ? val : {};
        o = o[ns[i]] = o[ns[i]] || v;
  }
  return o;
};
exports = module.exports.namespace = namespace;

/**
 * Function to check if input object is json or not
 * @param  {string} obj String object to check.
 * @return {Boolean}    Return True if input is json, or False otherwise.
 */
function isjson (obj) {
  try {
    JSON.parse(obj);
  } catch (e) {
    return false;
  }
  return true;
}
exports = module.exports.isjson = isjson;

/**
 * Show log to console depend on config level.
 * @param  String   type Type of log, it can be info, error, or debug.
 * @param  String   msg  Message that want to shown on console.
 * @return String        String shown to console.
 */
function showLog (type, msg){
  var color = require('bash-color');
  require('date-format-lite');
  Date.masks.default = 'YYYY-MM-DD hh:mm:ss.SS Z'
  var d = new Date;

  Object.defineProperty(global, '__stack', {
    configurable: true,
    get: function(){
      var orig = Error.prepareStackTrace;
      Error.prepareStackTrace = function(_, stack){ return stack; };
      var err = new Error;
      Error.captureStackTrace(err, arguments.callee);
      var stack = err.stack;
      Error.prepareStackTrace = orig;
      return stack;
    }
  });

  var file = __stack[1].getFileName();
  var func = __stack[1].getFunctionName();
  var line = __stack[1].getLineNumber();

  switch (type) {
    case 'info':
      if ((process.env.NODE_ENV == 'production') ||
        (process.env.NODE_ENV == 'development') ||
        (process.env.NODE_ENV == 'test')) {
          console.info(color.green(d.format() + ' ' + msg));
        }
    break;
    case 'debug':
      if ((process.env.NODE_ENV == 'development') ||
        (process.env.NODE_ENV == 'test')) {
          console.log(color.blue(d.format() + ' ' + file + ' ' + func + ':' + line + ' ' + msg));
        }
    break;
    case 'error':
      if ((process.env.NODE_ENV == 'production') ||
        (process.env.NODE_ENV == 'development') ||
        (process.env.NODE_ENV == 'test')) {
          console.error(color.red(d.format() + ' ' + file + ' ' + func + ':' + line + ' ' + msg));
        }
    break;
    case 'trace':
      if ((process.env.NODE_ENV == 'development') ||
        (process.env.NODE_ENV == 'test')) {
          console.trace(color.red(d.format() + ' ' + file + ' ' + func + ':' + line + ' ' + msg));
        }
    break;
    default:
      console.log(color.blue(d.format() + ' ' + file + ' ' + func + ':' + line + ' ' + msg));
  }
}
module.exports.showLog = showLog;
