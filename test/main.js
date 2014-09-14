/* global describe, it */
var gulp = require('gulp');
var assert = require('../index.js');
require('mocha');
require('should');

describe('assert nth-child', function () {
    it('should assert any child', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/love.js', './test/fixtures/destiny.js'])
            .pipe(assert.nth(2, function(file) {
                (file.contents.toString()).should.equal("define('love',[],function(){});");
            }))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            });
    });

    it('should assert first child', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/love.js', './test/fixtures/destiny.js'])
            .pipe(assert.first(function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            });
    });

    it('should assert last child', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/love.js', './test/fixtures/destiny.js'])
            .pipe(assert.last(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            });
    });
});

describe('assert length', function () {
    it('should check source length when match', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.length(2))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            })
    });

    it('should check source length when mismatch', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.length(1))
            .on('end', function(err) {
                err.should.be.a.Error;
                done();
            })
    });
});

describe('assert array', function () {
    it('should assert all source', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.all(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                done();
            })
    });

    it('should assert any source', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.any(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            });
    });
});
