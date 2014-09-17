# stream-assert-gulp
![Build Status](https://img.shields.io/travis/bornkiller/stream-assert-gulp/master.svg?style=flat)
![Coverage Report](http://img.shields.io/coveralls/bornkiller/stream-assert-gulp.svg?style=flat)
![Package Dependency](https://david-dm.org/bornkiller/stream-assert-gulp.svg?style=flat)
![Package DevDependency](https://david-dm.org/bornkiller/stream-assert-gulp/dev-status.svg?style=flat)

Assert gulp streams, make gulp plugin test easier, based on `through-gulp`, inspired by
`stream-assert` (https://github.com/floatdrop/stream-assert.git).

## Install
```js
npm install stream-assert-gulp --save-dev
```

## Usage
```js
var gulp = require('gulp');
var assert = require('stream-assert-gulp');
var should = require('should');

it('should pass data to next when undeclared', function (done) {
    gulp.src('./test/fixtures/template.js')
        // assert the file 
        .pipe(assert.first(function(file) {
            (file.isBuffer()).should.be.true;
            (file.isStream()).should.be.false;
        }))
        // indicate the assert result
        .on('end', done);
});
```

## API

Builder for asserting gulp stream. Constructed stream will emit `end` after stream assert, without any augument for success, with assertion error as first argument for fail. 

### Assertion
Assertion is a funtion with each file as the first argument, just assert the file. For example:
```js
assertion = function(file) {
    (file.isBuffer()).should.be.true;
    (file.isStream()).should.be.false;
})
```

#### nth(n, assertion)

Calls `assertion` function on nth-child element in stream.

#### first(assertion)

Calls `assertion` function on first-child element in stream.

#### second(assertion)

Calls `assertion` function on first-child element in stream.
#### last(assertion)

Calls `assertion` function on last-child element in stream.

#### length(len)

Asserting, that length of stream is equal `len` at the end of the stream.

#### all(assertion)

Calls `assertion` function on every-child element in stream. Only if all the elements
match the assertion then pass success.

#### any(assertion)

Calls `assertion` function on every-child element in stream. Only if any of the elements
match the assertion, then pass success.

## Assert chain
As promised, now it does support chain assert after v0.2.x, better than `stream-assert`.  
Pay attention when you need chain assert, assert below just work right, when all the 
assertion passed, the `done` callback has no argument. when any assertion failed, it 
will jump to the end, and `done` callback has error(this assertion throwed) as first 
argument.

Till now, `length`, `nth`, `first`, `last` support chained asssertion, also, `all` and `any`
works for chained assertion since v0.4.0.

```js
gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
    .pipe(assert.length(1))
    .pipe(assert.first(function(file) {
        (file.contents.toString()).should.equal("define('destiny',[],function(){});");
    }))
    .pipe(assert.nth(2, function(file) {
        (file.contents.toString()).should.equal("define('template',[],function(){});");
    }))
    .pipe(assert.any(function(file) {
        (file.isBuffer()).should.be.true;
    }))
    .pipe(assert.all(function(file) {
        (file.isStream()).should.be.false;
    }))
    .on('end', done);
```

## Contact

*Email: hjj491229492@hotmail.com*

## License

MIT (c) 2014 
