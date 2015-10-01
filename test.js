'use strict';
var traverser = require('./traverser');
var expect = require('chai').expect;
var sinon = require('sinon');
var Q = require('q');

describe('traverser', function() {
    var arr, tree, t, t2, current, next;

    beforeEach(function() {
        current = null;
        next = null;
        arr = [];

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

        t = traverser(function(node, _next) {
            current = node;
            next = _next;
        });

        t2 = traverser(function(node, next) {
            arr.push(node.id);
            if ( node.children ) { next(node.children); } else { next(); }
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
        return t2(tree).then(function() {
            expect(arr).to.deep.equal([1, 2, 3, 4, 5, 6]);
        })
    });

    describe('next() function', function() {
        it('should return a promise', function() {
            t(tree);

            var p = next(current.children);
            expect(Q.isPromise(p)).to.equal(true);
        });

        it('should resolve when a dataset is complete', function() {
            var spy = sinon.spy();

            setTimeout(function() {
                next();
                next();
                next();
            }, 0);

            //Return promise for async
            return t(tree).then(function() {
                spy();
            }).finally(function() {
                sinon.assert.called(spy);
            });

        });
    });

    describe('asynchronously', function() {
        it('should be given each object as next is called', function() {
            t(tree);

            expect(current).to.equal(tree[0]);
            expect(next).to.be.a('function');

            next();

            expect(current).to.equal(tree[1]);
        });

        // it('should resolve a promise after next is done', function(done) {
        //     return t(tree);
        // });
    });
});
