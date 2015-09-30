'use strict';
var traverser = require('./traverser');
var expect = require('chai').expect;
var Q = require('q');

describe('traverser', function() {
    var tree, arr, t;

    beforeEach(function() {
        tree = [{
            id: 1,
            children: [{
                id: 2,
                children: [{
                    id: 3
                }]
            }]
        },{
            id: 4,
            children: [{
                id: 5,
                children: [{
                    id: 6
                }]
            }]
        }];

        arr = [];

        t = traverser(function(node, next) {
            arr.push(node.id);
            if(node.children) { next(node.children); } else { next(); }

            expect(t).to.be.a('function');
        });
    });

    it('should return a function', function() {
        expect(t).to.be.a('function');
    });

    it('should return a promise', function() {
        var done = t(tree);
        expect(Q.isPromise(done)).to.equal(true);
    });

    it('should recurse down when next() is passed an array', function() {
        t(tree);
        expect(arr).to.deep.equal([1, 2, 3, 4, 5, 6]);
    });

    describe('asynchronously', function() {
        var current, next;

        beforeEach(function() {
            current = undefined, next = undefined;

            t = traverser(function(node, _next) {
                current = node;
                next = _next;
            });
        });

        it('should be given each object as next is called', function() {
            t(tree);

            expect(current).to.equal(tree[0]);
            expect(next).to.be.a('function');

            next();

            expect(current).to.equal(tree[1]);
        });

        it('should resolve a promise after next is done', function(done) {
            t(tree).then(function(e) {
                expect(e).to.equal(tree);

                done();
            });

            next();
            next();
        });
    });


    // var arr2 = [];

    // var u = traverser(function(node, next) {
    //     if(node.children) { next(node.children); } else { next(); }
    //     arr2.push(node.id);
    // });

    // u(tree).then(function(e) {
    //     if (arr2.join('') !== '654321') { throw 'Unexpected error'; }
    // });

    // var arr3 = [];
    // var v = traverser(function(node, next) {
    //     if(!node.children) {
    //         next();
    //     }
    //     arr3.push(node.id);
    //     if(node.children) {
    //         next(node.children);
    //     }
    // });

    // var next

    // var i = setInterval(function() {next();}, 1000);

    // var w = traverser(function(node, n) {
    //     console.log(node);
    //     next = n;
    // });

    // w(tree).then(function() {
    //     clearInterval(i);
    // });

});
