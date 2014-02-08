'use strict';

/* Services */


angular.module('myApp.services', [])
    .service('eventService', ['dataStore', function(dataStore) {

        var service = function() {


            return {
                create: function(name, date) {
                    return dataStore.insert('events', { name: name, date: date });
                }
            };
        }();

        return service;
    }]);

