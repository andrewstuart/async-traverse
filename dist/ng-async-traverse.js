angular.module('asyncTraverse', [])
    .provider('asyncTraverse', ['$q', function($q) {
        var Q = $q;
        function traverser(cb) {

    function traverse (list) {
        var items = list.concat();
        var resolvers = [];

        var current = items.shift();
        var deferred = Q.defer();

        function next (sub) {
            var d2 = Q.defer();
            if ( sub && sub.length ) {
                items = sub.concat(items);

                resolvers = new Array(sub.length).concat(resolvers);
                resolvers[sub.length] = resolvers[sub.length] || [];
                resolvers[sub.length].push(function() {
                    d2.resolve(sub);
                });
            }
            current = items.shift();
            currResolvers = resolvers.shift();

            //If any resolvers need to run, call them.
            if ( currResolvers && currResolvers.length ) {
                currResolvers.forEach(function(r) { r(); });
            }

            if(current) { cb(current, next); }
            else { deferred.resolve(); }

            return d2.promise;
        }

        cb(current, next);

        resolvers[items.length] = [function() { deferred.resolve(list); }];

        return deferred.promise;
    }

    return traverse;
}

        return traverser;
    }]);
