'use strict';

/* Services */


angular.module('myApp.services', [])
    .service('eventService', ['dataStore', function(dataStore) {

        var service = function() {


            return {
                create: function(name, date) {
                    return dataStore.insert('events', { name: name, date: date });
                },
                getAll: function() {
                    return dataStore.getAll('events');
                },
                get :function(id) {
                    return dataStore.get('events', id);
                }                
            };
        }();

        return service;
    }]);

