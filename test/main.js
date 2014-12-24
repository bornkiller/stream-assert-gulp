/* global describe, it */
var gulp = require('gulp');
var assert = require('../index.js');
require('mocha');
require('should');

describe('assert nth-child', function () {
    it('should assert any child when pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/love.js', './test/fixtures/destiny.js'])
            .pipe(assert.nth(2, function(file) {
                (file.contents.toString()).should.equal("define('love',[],function(){});");
            }))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            });
    });

    it('should assert any child when fail', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/love.js', './test/fixtures/destiny.js'])
            .pipe(assert.nth(2, function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                done();
            });
    });

    it('should assert first child when pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/love.js', './test/fixtures/destiny.js'])
            .pipe(assert.first(function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            });
    });

    it('should assert first child when fail', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/love.js', './test/fixtures/destiny.js'])
            .pipe(assert.first(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                done();
            });
    });

    it('should assert second child when pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/love.js', './test/fixtures/destiny.js'])
            .pipe(assert.second(function(file) {
                (file.contents.toString()).should.equal("define('love',[],function(){});");
            }))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            });
    });

    it('should assert second child when fail', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/love.js', './test/fixtures/destiny.js'])
            .pipe(assert.second(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                done();
            });
    });

    it('should assert last child when pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/love.js', './test/fixtures/destiny.js'])
            .pipe(assert.last(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            });
    });

    it('should assert last child when pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/love.js', './test/fixtures/destiny.js'])
            .pipe(assert.last(function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                done();
            });
    });
});

describe('assert length', function () {
    it('should work with many files', function (done) {
        gulp.src(['./test/fixtures/many-files/*.js'])
            .pipe(assert.length(20))
            .on('end', function(err) {
                (typeof err === 'undefined').should.be.true;
                done();
            });
    });

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
    it('should assert all source when pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.all(function(file) {
                (file.isBuffer()).should.be.true;
            }))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            })
    });

    it('should assert all source when fail', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.all(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                done();
            })
    });

    it('should assert any source when pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.any(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            });
    });

    it('should assert any source when fail', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.any(function(file) {
                (file.isStream()).should.be.true;
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                done();
            });
    });
});


describe('assert chain', function () {
    it('should transfer nothing in length chain when none error', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.length(2))
            .pipe(assert.length(2))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            });
    });

    it('should transfer error in length assert chain when error pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.length(3))
            .pipe(assert.length(2))
            .pipe(assert.length(1))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.message).should.equal('expected 2 to be 3');
                done();
            })
    });

    it('should transfer error in length assert chain when error not pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.length(2))
            .pipe(assert.length(1))
            .on('end', function(err) {
                (err.message).should.equal('expected 2 to be 1');
                done();
            })
    });

    it('should transfer nothing in nth assert chain when error pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js', './test/fixtures/love.js'])
            .pipe(assert.nth(1, function(file) {
                (file.contents.toString()).should.equal("define('love',[],function(){});");
            }))
            .pipe(assert.nth(1, function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.actual).should.equal("define('template',[],function(){});");
                (err.expected).should.equal("define('love',[],function(){});");
                done();
            });
    });

    it('should transfer nothing in first assert chain when error pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js', './test/fixtures/love.js'])
            .pipe(assert.first(function(file) {
                (file.contents.toString()).should.equal("define('love',[],function(){});");
            }))
            .pipe(assert.first(function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.actual).should.equal("define('template',[],function(){});");
                (err.expected).should.equal("define('love',[],function(){});");
                done();
            });
    });

    it('should transfer nothing in second assert chain when error pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js', './test/fixtures/love.js'])
            .pipe(assert.second(function(file) {
                (file.contents.toString()).should.equal("define('love',[],function(){});");
            }))
            .pipe(assert.second(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.actual).should.equal("define('destiny',[],function(){});");
                (err.expected).should.equal("define('love',[],function(){});");
                done();
            });
    });

    it('should transfer nothing in last assert chain when error pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js', './test/fixtures/love.js'])
            .pipe(assert.last(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .pipe(assert.last(function(file) {
                (file.contents.toString()).should.equal("define('love',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.actual).should.equal("define('love',[],function(){});");
                (err.expected).should.equal("define('destiny',[],function(){});");
                done();
            });
    });

    it('should transfer nothing in sequence assert chain when none error', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js', './test/fixtures/love.js'])
            .pipe(assert.first(function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .pipe(assert.second(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .pipe(assert.last(function(file) {
                (file.contents.toString()).should.equal("define('love',[],function(){});");
            }))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            });
    });

    it('should transfer error in sequence assert chain when error pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.first(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .pipe(assert.last(function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .pipe(assert.last(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.actual).should.equal("define('template',[],function(){});");
                (err.expected).should.equal("define('destiny',[],function(){});");
                done();
            });
    });

    it('should transfer error in sequence assert chain when error not pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js', './test/fixtures/love.js'])
            .pipe(assert.first(function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .pipe(assert.second(function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .pipe(assert.last(function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.actual).should.equal("define('love',[],function(){});");
                (err.expected).should.equal("define('template',[],function(){});");
                done();
            });
    });

    it('should transfer nothing in nth assert chain when none error', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.nth(1, function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .pipe(assert.nth(2, function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            });
    });

    it('should transfer error in nth assert chain when error pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js', './test/fixtures/love.js'])
            .pipe(assert.nth(1, function(file) {
                (file.contents.toString()).should.equal("define('destiny',[],function(){});");
            }))
            .pipe(assert.nth(2, function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .pipe(assert.nth(3, function(file) {
                (file.contents.toString()).should.equal("define('love',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.actual).should.equal("define('template',[],function(){});");
                (err.expected).should.equal("define('destiny',[],function(){});");
                done();
            });
    });

    it('should transfer error in nth assert chain when error not pass', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js', './test/fixtures/love.js'])
            .pipe(assert.nth(1, function(file) {
                (file.contents.toString()).should.equal("define('template',[],function(){});");
            }))
            .pipe(assert.nth(2, function(file) {
                (file.contents.toString()).should.equal("define('love',[],function(){});");
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.actual).should.equal("define('destiny',[],function(){});");
                (err.expected).should.equal("define('love',[],function(){});");
                done();
            });
    });

    it('should transfer nothing in array assert chain when none error about both', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.all(function(file) {
                (file.isBuffer()).should.be.true;
            }))
            .pipe(assert.any(function(file) {
                (file.isStream()).should.be.false;
            }))
            .on('end', function(err) {
                (typeof  err === 'undefined').should.be.true;
                done();
            });
    });

    it('should transfer error in array assert chain when error pass about all', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.all(function(file) {
                (file.isStream()).should.be.true;
            }))
            .pipe(assert.all(function(file) {
                (file.isStream()).should.be.true;
            }))
            .pipe(assert.all(function(file) {
                (file.isBuffer()).should.be.true;
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                done();
            });
    });

    it('should transfer error in array assert chain when error not pass about all', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.all(function(file) {
                (file.isStream()).should.be.false;
            }))
            .pipe(assert.all(function(file) {
                (file.isBuffer()).should.be.false;
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                done();
            });
    });

    it('should transfer error in array assert chain when error pass about any', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.any(function(file) {
                (file.isStream()).should.be.true;
            }))
            .pipe(assert.any(function(file) {
                (file.isStream()).should.be.true;
            }))
            .pipe(assert.any(function(file) {
                (file.isBuffer()).should.be.true;
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                done();
            });
    });

    it('should transfer error in array assert chain when error pass about any', function (done) {
        gulp.src(['./test/fixtures/template.js', './test/fixtures/destiny.js'])
            .pipe(assert.any(function(file) {
                (file.isStream()).should.be.false;
            }))
            .pipe(assert.any(function(file) {
                (file.isBuffer()).should.be.false;
            }))
            .on('end', function(err) {
                err.should.be.a.Error;
                done();
            });
    });

    it('should transfer nothing in mixed assert chain when none error', function (done) {
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
            .on('end', function(err) {
                err.should.be.a.Error;
                (err.actual).should.equal(2);
                done();
            });
    });
});
