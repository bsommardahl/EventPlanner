'use strict';
angular.module('myApp.services')
    .service('eventItemService', ['dataStore', function (dataStore) {

        var service = function () {

            return {
                create: function (name, content) {
                    return dataStore.insert('eventItems', { name: name, content: content });
                },
                getAll: function () {
                    return dataStore.getAll('eventItems');
                },
                get: function (id) {
                    return dataStore.get('eventItems', id);
                },
                getForEvent: function (eventId) {
                    return dataStore.getAll('event_eventItem', { eventId: eventId }).then(function (connections) {
                        var eventItemIds = _.map(connections, function (c) { return c.eventItemId });
                        return dataStore.getMany('eventItems', eventItemIds);
                    });
                },
                addToEvent: function(eventId, eventItemId) {
                    return dataStore.insert("event_eventItem", { eventId: eventId, eventItemId: eventItemId });
                }
            };
        }();

        return service;
    }]);

