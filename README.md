# Async-traverse

A utility library for asynchronous traversal and delegated recursion.

- [Example](#example)

## API

The async-traverse package exports a factory function for custom traversal
implementations.

```javascript
var traverser = require('async-traverse');
```

Provide a callback function with signature `node, next`, and a traversal
function will be returned.

```javascript
var traverser = require('async-traverse');

var t = traverser(function(node, next) {
  console.log(node);
  next();
});

//t is your custom traverser.
```

Pass an array to the provided function, and it will begin to execute your
callback, passing it at each iteration the current node, and a `next` function.
Each time your code calls the next() function (and passes no parameters), your
callback will be called again with the next object.

If your code passes an array, `next(someArray)`, then the traverser will iterate
over each `someArray` item before returning to its previous items. This allows
you to make the decision asynchronously as to whether recursion needs to happen,
and control which items will be processed asynchronously.

- Recurse on any property
- Wait for user input before continuing
- Check with an asynchronous service before recursing

The initial call to your returned function, `t(someData)`, will return a
promise for the completed traversal of the tree. The promise is resolved when
there are no more items to process.

```javascript
var traverser = require('async-traverse');

var t = traverser(function(node, next) {
  console.log(node);
  next();
});

//t is your custom traverser.


```

## Example
```javascript
var traverser = require('async-traverse')

var tree = [{
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

var current, continue;

var t = traverser(function(node, next) {
    current = node;
    continue = next;
});

t(tree).then(function() {
  console.log('Done!');
});

console.log(current); // {id: 1, children: [...]}

//Call next to go to the next node.
next();

console.log(current); // {id: 4, children: [...]}

//Call next with an array of children to iterate over those children before
//continuing to the next node (or finishing if no nodes left);

next(current.children);

console.log(current); // {id: 5, children: [{id: 6}]}

next(current.children);

console.log(current); // {id: 6}

next(); //No nodes left at any level; promise will be resolved

// 'Done!' (logged by above promise);
```
