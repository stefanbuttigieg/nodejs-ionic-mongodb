angular.module('ionic-chat-app-services', [])

    .service('ChatService', function ChatService($rootScope) {

        // Init the Websocket connection
        var socket = io.connect('http://localhost:8080');

        // Bridge events from the Websocket connection to the rootScope
        socket.on('UserConnectedEvent', function(user) {
           $rootScope.emit('UserConnectedEvent', user);
        });

        /**
         * Send a message to the server.
         * @param message
         */
        socket.on('MessageReceivedEvent', function(message) {
            $rootScope.emit('MessageReceivedEvent', message);
        });
        this.emit = function (message) {
            socket.emit('MessageSentEvent', message);
        };

        this.on = {
            userConnected: function (callback) {
                $rootScope.$on('UserConnectedEvent', function (event, user) {
                    callback(user);
                })
            },
            messageReceived: function (callback) {
                $rootScope.$on('MessageReceivedEvent', function (event, message) {
                    callback(message);
                })
            }
        }
    });
