'use strict';
angular.module('myApp.controllers')
    .controller('eventItemsController', ['$scope', '$routeParams', 'eventItemService', function($scope, $routeParams, eventItems) {

        $scope.eventItem = { };

        $scope.createEventItem = function() {
            eventItems.create($scope.eventItem.name, $scope.eventItem.content).then(function() {
                $scope.status = $scope.eventItem.name + " Created";
                $scope.eventItem = { };
            });
        };

        if ($routeParams.id) {
            eventItems.get($routeParams.id).then(function (eventItemsFromStore) {
                $scope.eventItem = eventItemsFromStore[0];
            });
        } else {
            eventItems.getAll().then(function(eventItemsFromStore) {
                $scope.eventItems = eventItemsFromStore;
            });
        }

    }]);