'use strict';
angular.module('myApp.services')
    .service('eventItemService', ['$q', 'dataStore', function($q, dataStore) {

        var service = function() {

            return {
                create: function(name, content) {
                    return dataStore.insert('eventItems', { name: name, content: content });
                },
                getAll: function() {
                    return dataStore.getAll('eventItems');
                },
                get: function(id) {
                    return dataStore.get('eventItems', id);
                },
                getForEvent: function(eventId) {
                    return dataStore.getAll('event_eventItem', { eventId: eventId }).then(function(connections) {
                        var connectionsInOrder = _.sortBy(connections, function(c) { return c.order; });
                        var eventItemIds = _.map(connectionsInOrder, function(c) { return c.eventItemId; });
                        return dataStore.getMany('eventItems', eventItemIds);
                    });
                },
                addToEvent: function(eventId, eventItemId) {
                    return dataStore.insert("event_eventItem", { eventId: eventId, eventItemId: eventItemId });
                },
                changeOrder: function(eventId, newOrder) {
                    var connectionPromises = _.map(newOrder, function(eventItemId) {
                        return dataStore.getAll('event_eventItem', { eventId: eventId, eventItemId: eventItemId });
                    });

                    $q.all(connectionPromises).then(function(connectionArrays) {
                        var index = 0;
                        _.each(connectionArrays, function (connections) {
                            var connection = connections[0];
                            dataStore.update('event_eventItem', { ID: connection.ID }, function(row) {
                                row.order = index;
                                return row;
                            });
                            index++;
                        });
                    });
                }
            };
        }();

        return service;
    }]);