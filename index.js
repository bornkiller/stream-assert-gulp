/**
 * Expose object for assert gulp plugin file
 * @modules stream-assert-gulp
 * @version v0.4.7
 */

/**
 * Just like normal function with gulp file argument
 * @typedef {function} assertion
 * @example assertion description
 * function(file) {
 *   (file.isBuffer()).should.be.true;
 *   (file.isStream()).should.be.false;
 * })
 */

/**
 * Node transform stream object which pipable
 * @typedef {object} stream
 */

/**
 * Module dependency
 */
var assert = require('assert');
var through = require('through-gulp');

var streamAssert = {};

/**
 * Conform the transform stream assert
 * @param {string} flag - generate type, accepted values 'nth', 'all', 'any'
 * @param {assertion} assertion
 * @param {*} additional - argument for additional action
 * @returns {stream}
 * @private
 */
streamAssert._origin = function(flag, assertion, additional) {
  var assetStorage = []
    , stream
    , error
    , mark;

  stream = through(function (file, encoding, callback) {
    // just resolve files transfer
    if (file instanceof Error) {
      error = file;
    } else {
      this.push(file);
      assetStorage.push(file);
    }
      callback();
    }, function (callback) {
      // End the stream if error had been caught
      if (error instanceof Error) {
        this.push(error);
        this.emit('end', error);
        return callback();
      }

      // conform the assertion
      try {
        switch (flag) {
          case 'nth':
            additional = additional === 'last' ? assetStorage.length - 1 : additional - 1;
            assertion(assetStorage[additional]);
            this.emit('end');
            break;
          case 'length':
            assert.equal(assetStorage.length, additional);
            this.emit('end');
            break;
          case 'all':
            for (var i = 0; i < assetStorage.length; i++) {
              assertion(assetStorage[i]);
            }
            this.emit('end');
            break;
          case 'any':
            mark = assetStorage.some(function(file) {
              try {
                assertion(file);
                return true;
              } catch (err) {
                error = err;
                return false;
              }
            });
            if (!mark) throw error;
            this.emit('end');
            break;
        }
      } catch(err) {
        this.push(err);
        this.emit('end', err);
      }

    callback();
  });

  return stream;
};

/**
 * assert the index file in the transformed files
 * @param {number} index - the number of files
 * @param {assertion} assertion
 * @returns {stream}
 */
streamAssert.nth = function(index, assertion) {
  return streamAssert._origin('nth', assertion, index);
};

/**
 * assert the first file in the transformed files
 * @param {assertion} assertion
 * @returns {stream}
 */
streamAssert.first = function(assertion) {
  return streamAssert.nth(1, assertion);
};

/**
 * assert the second file in the transformed files
 * @param {assertion} assertion
 * @returns {stream}
 */
streamAssert.second = function(assertion) {
  return streamAssert.nth(2, assertion);
};

/**
 * assert the last file in the transformed files
 * @param {assertion} assertion
 * @returns {stream}
 */
streamAssert.last = function(assertion) {
    return streamAssert.nth('last', assertion);
};

/**
 * assert all the files, assert failed if any mismatch
 * @param {assertion} assertion
 * @returns {stream}
 */
streamAssert.all = function(assertion) {
  return streamAssert._origin('all', assertion);
};

/**
 * assert all the files, assert success if any match
 * @param {assertion} assertion
 * @returns {stream}
 */
streamAssert.any = function(assertion) {
  return streamAssert._origin('any', assertion);
};

/**
 * assert length of the transformed files
 * @param {length} length - expected length
 * @returns {stream}
 */
streamAssert.length = function(length) {
  return streamAssert._origin('length', null, length);
};

module.exports = streamAssert;
