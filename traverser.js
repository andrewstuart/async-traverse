var Q = require('q');

function traverser(cb) {

    function traverse (list) {
        var items = list.concat();

        var current = items.shift();
        var deferred = Q.defer();

        function next (sub) {
            if ( sub && sub.length ) { items = sub.concat(items); }
            current = items.shift();

            if(current) {
                cb(current, next);
            } else {
                deferred.resolve(list);
            }
        }

        cb(current, next);

        return deferred.promise;
    }

    return traverse;
}

module.exports = traverser;
