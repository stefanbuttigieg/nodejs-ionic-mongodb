angular.module('ionic-chat-app-services', [])

    .service('ChatService', function ChatService($rootScope) {

        function ChatConnection(chatName) {

            this.chatName = chatName;

            // Init the Websocket connection
            var socket = io.connect('http://localhost:8080/' + chatName);

            // Bridge events from the Websocket connection to the rootScope
            socket.on('UserConnectedEvent', function (user) {
                console.log('User connected:', user);
                $rootScope.$emit('UserConnectedEvent', user);
            });

            /**
             * Send a message to the server.
             * @param message
             */
            socket.on('MessageReceivedEvent', function (message) {
                console.log('Chat message received:', message);
                $rootScope.$emit('MessageReceivedEvent', message);
            });
            this.emit = function (message) {
                console.log('Sending chat message:', message);
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
        }

        /**
         * Establishes a new chat connection.
         *
         * @param chatName name of the chat room to connect to
         * @returns {ChatService.ChatConnection}
         */
        this.connect = function (chatName) {
            return new ChatConnection(chatName);
        }

    });
