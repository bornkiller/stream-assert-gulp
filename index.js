var through = require('through-gulp');
require('should');
var assert = {};
assert.nth = function(index, assertion) {
    var assetStorage = [];
    var stream;
    stream = through(function (file, encoding, callback) {
        this.push(file);
        assetStorage.push(file);
        callback();
    }, function (callback) {
        try {
            assertion(assetStorage[index-1]);
            this.emit('end');
            callback();
        } catch (err) {
            this.emit('end', err);
            callback();
        }
    });

    return stream;
};

assert.first = function(assertion) {
    var assetStorage = [];
    var stream;
    stream = through(function (file, encoding, callback) {
        this.push(file);
        assetStorage.push(file);
        callback();
    }, function (callback) {
        try {
            assertion(assetStorage[0]);
            this.emit('end');
            callback();
        } catch (err) {
            this.emit('end', err);
            callback();
        }
    });

    return stream;
};

assert.last = function(assertion) {
    var assetStorage = [];
    var stream;
    stream = through(function (file, encoding, callback) {
        this.push(file);
        assetStorage.push(file);
        callback();
    }, function (callback) {
        try {
            var length = assetStorage.length;
            assertion(assetStorage[length-1]);
            this.emit('end');
            callback();
        } catch (err) {
            this.emit('end', err);
            callback();
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
        this.push(file);
        assetStorage.push(file);
        callback();
    }, function (callback) {
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
            this.emit('end', error);
            callback();
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
        this.push(file);
        assetStorage.push(file);
        callback();
    }, function (callback) {
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
            this.emit('end', error);
            callback();
        }

    });

    return stream;
};
assert.length = function(count) {
    var assetStorage = [];
    var stream;
    stream = through(function (file, encoding, callback) {
        this.push(file);
        assetStorage.push(file);
        callback();
    }, function (callback) {
        try {
            (assetStorage.length).should.equal(count);
            this.emit('end');
            callback();
        } catch (err) {
            this.emit('end', err);
            callback();
        }
    });

    return stream;
};

module.exports = assert;
