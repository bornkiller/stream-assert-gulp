/**
 * Expose object for assert gulp plugin file
 * @modules stream-assert-gulp
 * @version v0.4.8
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
      switch (flag) {
        case 'nth':
          additional = additional === 'last' ? assetStorage.length - 1 : additional - 1;
          mark = streamAssert._assertSingleFile(assertion, assetStorage[additional]);
          break;
        case 'length':
          mark = streamAssert._assertLength(additional, assetStorage);
          break;
        case 'all':
          mark = streamAssert._assertAllArray(assertion, assetStorage);
          break;
        case 'any':
          mark = streamAssert._assertAnyArray(assertion, assetStorage);
          break;
      }

    if (mark instanceof Error) this.push(mark);
    this.emit('end', mark);
    callback();
  });

  return stream;
};


/**
 * assert single file
 * @param {assertion} assertion
 * @param {object} file - gulp(vinyl) file object
 * @returns {undefined|error} - error means fail while undefined means pass
 * @private
 */
streamAssert._assertSingleFile = function(assertion, file) {
  var mark;
  try {
    assertion(file);
  } catch (error) {
    mark = error;
  }
  return mark;
};


/**
 * assert single file
 * @param {number} length - expected length
 * @param {Array} file - array filled with gulp(vinyl) file object
 * @returns {undefined|error} - error means fail while undefined means pass
 * @private
 */
streamAssert._assertLength = function(length, file) {
  var mark;
  try {
    assert.equal(file.length, length);
  } catch (error) {
    mark = error;
  }
  return mark;
};


/**
 * assert single file
 * @param {assertion} assertion
 * @param {Array} file - array filled with gulp(vinyl) file object
 * @returns {undefined|error} - error means fail while undefined means pass
 * @private
 */
streamAssert._assertAllArray = function(assertion, file) {
  var mark;
  try {
    for (var i = 0; i < file.length; i++) {
      assertion(file[i])
    }
  } catch (error) {
    mark = error;
  }
  return mark;
};


/**
 * assert single file
 * @param {assertion} assertion
 * @param {object} file - array filled with gulp(vinyl) file object
 * @returns {undefined|error} - error means fail while undefined means pass
 * @private
 */
streamAssert._assertAnyArray = function(assertion, file) {
  var mark;
  for (var i = 0; i < file.length; i++) {
    try {
      assertion(file[i]);
      mark = undefined;
    } catch (error) {
      mark = error;
    }
  }
  return mark;
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
