'use strict';
angular.module('myApp.controllers')
    .controller('eventsController', ['$scope', '$routeParams', 'eventService', 'eventItemService', function ($scope, $routeParams, events, eventItems) {

        $scope.event = { };

        $scope.createEvent = function() {
            events.create($scope.event.name, $scope.event.date).then(function() {
                $scope.status = $scope.event.name + " Created";
                $scope.event = {};
            });
        };

        if ($routeParams.id) {
            events.get($routeParams.id).then(function(eventsFromStore) {
                $scope.event = eventsFromStore[0];

                eventItems.getForEvent($scope.event.ID).then(function(eventItemsFromStore) {
                    $scope.eventItems = eventItemsFromStore;
                });
            });
            
            $scope.addEventItem = function () {
                eventItems.addToEvent($scope.event.ID, $scope.eventItemToAdd.ID).then(function () {
                    $scope.eventItems.push($scope.eventItemToAdd);
                });
            };
            
            $scope.sortableOptions = {
                stop: function(e, ui) {
                    var newOrder = _.map($scope.eventItems, function(i) {
                        return i.ID;
                    });
                    eventItems.changeOrder($scope.event.ID, newOrder);
                }
            };

            eventItems.getAll().then(function(allEvetItems) {
                $scope.allEventItems = allEvetItems;
            });            
        }
        else {
            events.getAll().then(function (eventsFromStore) {
                $scope.events = eventsFromStore;
            });
        }        

    }]);