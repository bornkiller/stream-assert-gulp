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
    it('should assert source length when match', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.length(2))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            })
    });

    it('should assert source length when mismatch', function (done) {
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


describe('assert chain', function () {
    it('should support assert chain when none error', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.first(function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .pipe(assert.length(2))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            });
    });

    it('should support assert chain when single error on length', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.length(2))
            .pipe(assert.length(3))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.message).should.equal('expected 2 to be 3');
                done();
            })
    });

    it('should support assert chain when multi error on length', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.length(1))
            .pipe(assert.length(3))
            .on('end', function(err) {
                (err.message).should.equal('expected 2 to be 1');
                done();
            })
    });

    it('should support assert chain when single error on file', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.first(function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .pipe(assert.last(function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.actual).should.equal("define('destiny',[],function(){});");
                done();
            });
    });

    it('should support assert chain when multi error on file', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.first(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .pipe(assert.last(function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.actual).should.equal("define('template',[],function(){});");
                done();
            });
    });

    it('should support assert chain when single error on nth-child', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.nth(1, function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .pipe(assert.nth(2, function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.actual).should.equal("define('destiny',[],function(){});");
                done();
            });
    });

    it('should support assert chain when multi error on nth-child', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.nth(1, function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .pipe(assert.nth(2, function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.actual).should.equal("define('template',[],function(){});");
                done();
            });
    });

    it('should support assert chain when single error on mixed assertion', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.length(2))
            .pipe(assert.first(function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .pipe(assert.nth(2, function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.actual).should.equal("define('destiny',[],function(){});");
                done();
            });
    });

    it('should support assert chain when multi error on mixed', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.length(1))
            .pipe(assert.first(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .pipe(assert.nth(2, function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.actual).should.equal(2);
                done();
            });
    });
});