angular.module('phonebook.services', [])
    .factory('contactsFactory', function contactsFactory($q, $cordovaContacts) {

        /**
         * Turns a raw contact into something more suitable for viewing.
         *
         * @param rawContact
         */
        function processContact(rawContact) {
            return {
                name: rawContact.name ? rawContact.name.formatted : "",
                number: rawContact.phoneNumbers ? rawContact.phonenumbers[0].value
            }
        }

        return {
            all: function () {
                // It may take some time to fetch all contacts, so we defer it.
                var deferred = $q.defer();
                $cordovaContacts.find({multiple: true}).then(function (contacts) {

                    var processedContacts = [];
                    contacts.forEach(function (contact) {
                        processedContacts.push(processContact(contact));
                    });

                    deferred.resolve(processedContacts);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        }
    });
