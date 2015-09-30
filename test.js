var traverser = require('./traverser');

var list = [{
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
}]

var arr = [];

var t = traverser(function(node, next) {
    arr.push(node.id);
    if(node.children) { next(node.children); } else { next(); }
});

var done = t(list).then(function(e) {
    if ( arr.join('') !== '123456' ) {
        throw 'Unexpected result';
    }
});

var arr2 = [];

var u = traverser(function(node, next) {
    if(node.children) { next(node.children); } else { next(); }
    arr2.push(node.id);
});

u(list).then(function(e) {
    if (arr2.join('') !== '654321') { throw 'Unexpected error'; }
});

var arr3 = [];
var v = traverser(function(node, next) {
    if(!node.children) {
        next();
    }
    arr3.push(node.id);
    if(node.children) {
        next(node.children);
    }
});

// v(list).then(function(e) { 
//     console.log(arr3);
// });


var next

var i = setInterval(function() {next();}, 1000);

var w = traverser(function(node, n) {
    console.log(node);
    next = n;
});

w(list).then(function() {
    clearInterval(i);
});
