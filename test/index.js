var assert = require('assert');
var Hdfs = require('../index.js');
var path = require('path');
var localpath = path.resolve('./test/test.txt');
var remotepath = '/user/apps/filetest.txt';
var ctest = new Hdfs({
  protocol: 'http',
  hostname: '192.168.1.225',
  port: 50070
});

describe('Post', function() {
  describe('#Upload file to HDFS', function() {
    it('upload file to HDFS', function(done) {
      ctest.upload({
        'user.name': 'apps',
        overwrite: true,
        localpath: localpath,
        path: remotepath
      }, function(e, r, b) {
        console.log(e, r, b);
        console.log(r.statusCode);
        assert.equal(200, r.statusCode);
        done();
      });
    });
  });
});

describe('Get', function() {
  describe('#Get home directory', function() {
    it('get home directory of user', function(done) {
      // done();
      ctest.gethomedirectory({
        'user.name': 'apps'
      }, function(e, r, b) {
        console.log(JSON.parse(b));
        assert.equal('/user/apps', JSON.parse(b).Path);
        done();
      });
    });
  });

  describe('#Get file status', function() {
    it('get status of file', function(done) {
      ctest.getfilestatus({
        'user.name': 'apps',
        path: remotepath
      }, function(e, r, b) {
        var out;
        try {
          out = JSON.parse(b);
          console.log(out);
        } catch (err) {
          console.log(err);
          done();
        }
        assert.equal('FILE', out.FileStatus.type);
        done();
      });
    });
  });

  // describe('#Open', function() {
  //   it('Open file from hdfs', function(done) {
  //     ctest.open({
  //       'user.name': 'apps',
  //       path: remotepath
  //     }, function(e, r, b) {
  //       var out;
  //       try {
  //         out = JSON.parse(b);
  //         console.log(out);
  //       } catch (err) {
  //         console.log(err);
  //         done();
  //       }
  //       assert.equal('FILE', out.FileStatus.type);
  //       done();
  //     });
  //   });
  // });

});
