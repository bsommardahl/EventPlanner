angular.module('myApp.services')
    .service('dataStore', ['$q', function ($q) {


        function supports_html5_storage() {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        }

        if (!supports_html5_storage) {
            var message = "This browser doesn't support html5 localStorage. Please download a better browser.";
            alert(message);
            throw message;
        }

        var db = new localStorageDB("eventPlanner", window['localStorage']);


        if (db.isNew()) {

            db.createTable("events", ["name", "date"]);

            var event1Id = db.insert("events", { name: "Birthday Party", date: new Date(2014, 1, 1) });
            db.insert("events", { name: "Christmas Day", date: new Date(2013, 12, 25) });
            db.insert("events", { name: "Memorial Service", date: new Date(2014, 2, 12) });

            db.createTable("eventItems", ["name", "content"]);

            var clowns = db.insert("eventItems", { name: "Clowns", content: "Contact the clownmaster to get the team of clowns. They come in 2's and 5's and cost $200/hour." });
            var openGifts = db.insert("eventItems", { name: "Open Gifts", content: "Mary is in charge." });
            var cleanUp = db.insert("eventItems", { name: "Clean up", content: "" });

            db.createTable("event_eventItem", ["eventId", "eventItemId", "order"]);
            db.insert("event_eventItem", { eventId: event1Id, eventItemId: clowns, order: 1 });
            db.insert("event_eventItem", { eventId: event1Id, eventItemId: openGifts, order: 3 });
            db.insert("event_eventItem", { eventId: event1Id, eventItemId: cleanUp, order: 2 });

            db.commit();
        }

        return {
            insert: function (resource, obj) {
                var deferred = $q.defer();
                db.insert(resource, obj);
                db.commit();
                deferred.resolve(true);
                return deferred.promise;
            },
            update: function (resource, condition, updateFunction) {
                var deferred = $q.defer();
                db.update(resource, condition, updateFunction);
                db.commit();
                deferred.resolve(true);
                return deferred.promise;
            },
            'delete': function (resource, objId) {
                var deferred = $q.defer();
                db.deleteRows(resource, { ID: objId });
                db.commit();
                deferred.resolve(true);
                return deferred.promise;
            },
            get: function (resource, objId) {
                var deferred = $q.defer();
                deferred.resolve(db.query(resource, { ID: objId }));
                return deferred.promise;
            },
            getMany: function(resource, objIds) {
                var deferred = $q.defer();
                var many = _.map(objIds, function(id) {
                    return db.query(resource, { ID: id })[0];
                });
                deferred.resolve(many);
                return deferred.promise;
            },
            getAll: function (resource, query) {
                var deferred = $q.defer();
                deferred.resolve(db.query(resource, query));
                return deferred.promise;
            }
        };

    }]);