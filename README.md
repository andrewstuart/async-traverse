# Async-traverse

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
