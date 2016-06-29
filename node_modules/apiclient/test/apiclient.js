var seed = require('./seed.json'),
  Apiclient = require('../apiclient.js'),
  assert = require('assert');
seed.base.protocol = 'http';
seed.base.hostname = 'www.mocky.io';
seed.base.port = '80';

var Api = new Apiclient(seed);

describe('Api client test', function () {
  this.timeout(5000);
  describe('Basic method', function () {
    it('Post basic request', function (done) {
      Api.post('root', {}, {}, function (e, r, b) {
        b = JSON.parse(b);
        assert(1, b.code);
        done();
      });
    });

    it('Get basic request', function (done) {
      Api.get('root', {}, {}, function (e, r, b) {
        b = JSON.parse(b);
        assert(1, b.code);
        done();
      });
    });

    it('Put basic request', function (done) {
      Api.put('root', {}, {}, function (e, r, b) {
        b = JSON.parse(b);
        assert(1, b.code);
        done();
      });
    });

    it('Delete basic request', function (done) {
      Api.delete('root', {}, {}, function (e, r, b) {
        b = JSON.parse(b);
        assert(1, b.code);
        done();
      });
    });
  });

  describe('Special method.', function () {
    it('Download file from remote', function (done) {
      var exec = require('child_process').exec,
        fs = require('fs');
      Api.download('root', {}, {}, function (e, r, b) {
        console.log(b);
        var cmd = 'cat ' + b;
        assert.equal(200, r.statusCode);
        assert.doesNotThrow(
          function () {
            fs.readFile(b, function (err, data) {
              if (!err) {
                var body;
                assert.doesNotThrow(
                  function () {
                    body = JSON.parse(data);
                  },
                  'Not valid JSON'
                );
                assert.equal(1, body.code);
                done();
              }
            });
          },
          'Fail to read file'
        );
      });
    });

    it('Upload file to remote', function (done) {
      var path = require('path');
      Api.postUpload('root', {}, { qs: {localpath: path.resolve('./test/seed.json')} }, function (e, r, b) {
        b = JSON.parse(b);
        assert(1, b.code);
        done();
      });
    });
    it('Post to remote with multipart', function (done) {
      Api.postForm('root', {}, {}, function (e, r, b) {
        b = JSON.parse(b);
        assert(1, b.code);
        done();
      });
    });
    it('Put to remote with multipart', function (done) {
      Api.putForm('root', {}, {}, function (e, r, b) {
        b = JSON.parse(b);
        assert(1, b.code);
        done();
      });
    });
  });
});
