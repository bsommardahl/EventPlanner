'use strict';
angular.module('myApp.controllers')
    .controller('eventsController', ['$scope', 'eventService', function($scope, events) {

        $scope.event = { };

        $scope.createEvent = function() {
            events.create($scope.event.name, $scope.event.date).then(function() {
                $scope.event = { };
                $scope.status = $scope.event.name + " Created";
            });
        };

    }]);