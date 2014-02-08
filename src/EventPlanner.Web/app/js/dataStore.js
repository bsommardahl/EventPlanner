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

            db.insert("events", { name: "Birthday Party", date: new Date(2014, 1, 1) });
            db.insert("events", { name: "Christmas Day", date: new Date(2013, 12, 25) });
            db.insert("events", { name: "Memorial Service", date: new Date(2014, 2, 12) });

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
            update: function (resource, condition, obj) {
                var deferred = $q.defer();
                db.update(resource, condition, obj);
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
            getAll: function (resource, query) {
                var deferred = $q.defer();
                deferred.resolve(db.query(resource, query));
                return deferred.promise;
            }
        };

    }]);