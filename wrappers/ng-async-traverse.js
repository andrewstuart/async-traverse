angular.module('asyncTraverse', [])
    .factory('asyncTraverse', ['$q', function($q) {
        var Q = $q;
        <%= body %>
        return traverser;
    }]);
