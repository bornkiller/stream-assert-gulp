var through = require('through-gulp');
require('should');
var assert = {};
assert.nth = function(index, assertion) {
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

assert.first = function(assertion) {
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

assert.second = function(assertion) {
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

assert.last = function(assertion) {
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

assert.all = function(assertion) {
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

assert.any = function(assertion) {
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

assert.length = function(count) {
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
                (assetStorage.length).should.equal(count);
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

module.exports = assert;
