var assert = require('assert');
var through = require('through-gulp');

var streamAssert = {};
streamAssert.nth = function(index, assertion) {
  var assetStorage = []
    , stream
    , error;

  stream = through(function (file, encoding, callback) {
      if (file instanceof Error) {
        error = file;
      } else {
        this.push(file);
        assetStorage.push(file);
      }
      callback();
    }, function (callback) {
      if (error instanceof Error) {
        this.push(error);
        this.emit('end', error);
        callback();
      } else {
        try {
          assertion(assetStorage[index-1]);
          this.emit('end');
          callback();
        } catch (err) {
          this.push(err);
          this.emit('end', err);
          callback();
        }
      }
  });

  return stream;
};

streamAssert.first = function(assertion) {
  var assetStorage = []
    , stream
    , error;
  stream = through(function (file, encoding, callback) {
      if (file instanceof Error) {
        error = file;
      } else {
        this.push(file);
        assetStorage.push(file);
      }
      callback();
    }, function (callback) {
      if (error instanceof Error) {
        this.push(error);
        this.emit('end', error);
        callback();
      } else {
        try {
          assertion(assetStorage[0]);
          this.emit('end');
          callback();
        } catch (err) {
          this.push(err);
          this.emit('end', err);
          callback();
        }
      }
  });

  return stream;
};

streamAssert.second = function(assertion) {
  var assetStorage = []
    , stream
    , error;
  stream = through(function (file, encoding, callback) {
    if (file instanceof Error) {
            error = file;
        } else {
            this.push(file);
            assetStorage.push(file);
        }
        callback();
    }, function (callback) {
        if (error instanceof Error) {
            this.push(error);
            this.emit('end', error);
            callback();
        } else {
            try {
                assertion(assetStorage[1]);
                this.emit('end');
                callback();
            } catch (err) {
                this.push(err);
                this.emit('end', err);
                callback();
            }
        }
    });

    return stream;
};

streamAssert.last = function(assertion) {
    var assetStorage = [];
    var stream;
    var error;
    stream = through(function (file, encoding, callback) {
        if (file instanceof Error) {
            error = file;
        } else {
            this.push(file);
            assetStorage.push(file);
        }
        callback();
    }, function (callback) {
        if (error instanceof Error) {
            this.push(error);
            this.emit('end', error);
            callback();
        } else {
            try {
                var length = assetStorage.length;
                assertion(assetStorage[length-1]);
                this.emit('end');
                callback();
            } catch (err) {
                this.push(err);
                this.emit('end', err);
                callback();
            }
        }
    });

    return stream;
};

streamAssert.all = function(assertion) {
    var assetStorage = [];
    var stream;
    var flag;
    var error;
    stream = through(function (file, encoding, callback) {
        if (file instanceof Error) {
            error = file;
        } else {
            this.push(file);
            assetStorage.push(file);
        }
        callback();
    }, function (callback) {
        if (error instanceof Error) {
            this.push(error);
            this.emit('end', error);
            callback();
        } else {
            flag = assetStorage.every(function(file) {
                try {
                    assertion(file);
                    return true;
                } catch (err) {
                    error = err;
                    return false;
                }
            });

            if (flag) {
                this.emit('end');
                callback();
            } else {
                this.push(error);
                this.emit('end', error);
                callback();
            }
        }
     });

    return stream;
};

streamAssert.any = function(assertion) {
    var assetStorage = [];
    var stream;
    var flag;
    var error;
    stream = through(function (file, encoding, callback) {
        if (file instanceof Error) {
            error = file;
        } else {
            this.push(file);
            assetStorage.push(file);
        }
        callback();
    }, function (callback) {
        if (error instanceof Error) {
            this.push(error);
            this.emit('end', error);
            callback();
        } else {
            flag = assetStorage.some(function(file) {
                try {
                    assertion(file);
                    return true;
                } catch (err) {
                    error = err;
                    return false;
                }
            });

            if (flag) {
                this.emit('end');
                callback();
            } else {
                this.push(error);
                this.emit('end', error);
                callback();
            }
        }
    });

    return stream;
};

streamAssert.length = function(count) {
    var assetStorage = [];
    var stream;
    var error;
    stream = through(function (file, encoding, callback) {
        if (file instanceof Error) {
            error = file;
        } else {
            this.push(file);
            assetStorage.push(file);
        }
        callback();
    }, function (callback) {
        if (error instanceof Error) {
            this.push(error);
            this.emit('end', error);
            callback();
        } else {
            try {
                assert.equal(assetStorage.length, count);
                this.emit('end');
                callback();
            } catch (err) {
                this.push(err);
                this.emit('end', err);
                callback();
            }
        }
    });

    return stream;
};

module.exports = streamAssert;
