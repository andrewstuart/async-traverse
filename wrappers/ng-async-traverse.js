angular.module('asyncTraverse', [])
    .provider('asyncTraverse', ['$q', function($q) {
        var Q = $q;
        <%= body %>
        return traverser;
    }]);
