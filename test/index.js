var assert = require('assert');
var Hdfs = require('../index.js');
var path = require('path');
var localpath = path.resolve(__dirname, 'test.txt');
var localpath2 = path.resolve(__dirname, 'test2.txt');
var remotepath = '/user/apps/filetest.txt';
var remotepath2 = '/user/apps/dirtest';
var common = require('bcommon');
var ctest = new Hdfs({
  protocol: 'http',
  hostname: '192.168.1.225',
  port: 50070
});

describe('PUT', function() {
  describe('#Upload file to HDFS', function() {
    it('upload file to HDFS', function(done) {
      ctest.upload({
        'user.name': 'apps',
        overwrite: true,
        localpath: localpath,
        path: remotepath
      }, function(e, r, b) {
         console.log(b);
        assert.equal(200, r.statusCode);
        done();
      });
    });
  });


  describe('#Create file at HDFS', function() {
    it('Create file at HDFS', function(done) {
      ctest.create({
        'user.name': 'apps',
        overwrite: true,
        localpath: localpath,
        path: remotepath
      }, function(e, r, b) {
        console.log(b);
        assert.equal(201, r.statusCode);
        done();
      });
    });
  });

  describe('#Rename file at HDFS', function() {
    it('Rename file at HDFS', function(done) {
      ctest.rename({
        'user.name': 'apps',
        destination: remotepath,
        path: remotepath
      }, function(e, r, b) {
        console.log(r.headers);
        assert.equal(200, r.statusCode);
        done();
      });
    });
  });

  describe('#Make directory at HDFS', function() {
    it('Make directory at HDFS', function(done) {
      ctest.mkdirs({
        'user.name': 'apps',
        path: remotepath2
      }, function(e, r, b) {
        console.log(r.headers);
        assert.equal(200, r.statusCode);
        done();
      });
    });
  });

  describe('#Set permission', function() {
    it('Set permission HDFS', function(done) {
      ctest.setpermission({
        'user.name': 'apps',
        permission: 777,
        path: remotepath2
      }, function(e, r, b) {
        console.log(b);
        assert.equal(200, r.statusCode);
        done();
      });
    });
  });

  describe('#Set owner', function() {
    it('Set owner', function(done) {
      ctest.setowner({
        'user.name': 'apps',
        owner: 'bso',
        group: 'bso',
        path: remotepath2
      }, function(e, r, b) {
        console.log(b);
        assert.equal(200, r.statusCode);
        done();
      });
    });
  });

  describe('#Set replication factor', function() {
    it('Set replication factor', function(done) {
      ctest.setreplication({
        'user.name': 'apps',
        replication: 2,
        path: remotepath
      }, function(e, r, b) {
        console.log(b);
        assert.equal(200, r.statusCode);
        done();
      });
    });
  });

  describe('#Set times', function() {
    it('Set time of modification and access of file', function(done) {
      ctest.settimes({
        'user.name': 'apps',
        modificationtime: '-1',
        accesstime: '-1',
        path: remotepath
      }, function(e, r, b) {
        console.log(b);
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

  describe('#Get list status', function() {
    it('get list status of file', function(done) {
      ctest.liststatus({
        'user.name': 'apps',
        path: remotepath2
      }, function(e, r, b) {
        var out;
        try {
          out = JSON.parse(b);
          console.log(out);
        } catch (err) {
          console.log(err);
          done();
        }
        assert(out.FileStatuses);
        done();
      });
    });
  });

  describe('#Open', function() {
    it('Open file from hdfs', function(done) {
      ctest.open({
        'user.name': 'apps',
        path: remotepath
      }, function(e, r, b) {
        var out;
        try {
          out = JSON.parse(b);
          // console.log(out);
        } catch (err) {
          // console.log(err);
          done();
        }
        assert.equal('FILE', out.FileStatus.type);
        done();
      });
    });
  });

  describe('#Dowload', function() {
    it('Download file from hdfs', function(done) {
      ctest.open({
        'user.name': 'apps',
        path: remotepath
      }, function(e, r, b) {
        var out;
        try {
          out = JSON.parse(b);
          console.log(out);
        } catch (err) {
          // console.log(err);
          done();
        }
        assert.equal('FILE', out.FileStatus.type);
        done();
      });
    });
  });

describe('#Get Content Summary', function() {
    it('Get Content Summary of a HDFS Directory', function(done) {
      ctest.getcontentsummary({
        'user.name': 'apps',
        path: remotepath
      }, function(e, r, b) {
        common.showLog('debug', b);
        var out;
        try {
          out = JSON.parse(b);
          console.log(out);
        } catch (err) {
          console.log(err);
          done();
        }
        assert(out.ContentSummary);
        done();
      });
    });
  });

describe('#Get File Checksum', function() {
    it('Get File Checksum', function(done) {
      ctest.getfilechecksum({
        'user.name': 'apps',
        path: remotepath
      }, function(e, r, b) {
        common.showLog('debug', b);
        var out;
        try {
          out = JSON.parse(b);
          console.log(out);
        } catch (err) {
          console.log(err);
          done();
        }
        assert(out.FileChecksum);
        done();
      });
    });
  });



});

  describe('POST', function() {
    describe('#Append to a file', function() {
      it('Append to a file', function(done) {
        ctest.append({
          'user.name': 'apps',
          localpath: localpath,
          path: remotepath
        }, function(e, r, b) {
           console.log(r.headers);
          assert.equal(200, r.statusCode);
          done();
        });
      });
    });
  });


  describe('DELETE', function() {
    describe('#Delete a file or directory', function() {
      it('Delete a file or directory', function(done) {
        ctest.delete({
          'user.name': 'apps',
          recursive: true,
          path: remotepath2
        }, function(e, r, b) {
          console.log(r.headers);
          assert.equal(200, r.statusCode);
          done();
        });
      });
    });
  });
