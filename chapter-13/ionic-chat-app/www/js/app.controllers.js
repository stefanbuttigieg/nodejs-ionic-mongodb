angular.module('ionic-chat-app-controllers', [])

    .controller('ChatController', function ($scope, ChatService, chatRoom) {

        var connection = ChatService.connect(chatRoom);

        // The chat messages
        $scope.messages = [];

        // Notify whenever a new user connects
        connection.on.userConnected(function (user) {
            $scope.messages.push({
                name: 'Chat Bot',
                text: 'A new user has connected!'
            });
            $scope.$apply();
        });

        // Whenever a new message appears, append it
        connection.on.messageReceived(function (message) {
            message.external = true;
            $scope.messages.push(message);
            $scope.$apply();
        });

        $scope.inputMessage = '';
        $scope.onSend = function () {
            $scope.messages.push({
                name: 'Me',
                text: $scope.inputMessage
            });
            // Send the message to the server
            connection.emit({
                name: 'Anonymous',
                text: $scope.inputMessage
            });
            // Clear the chatbox
            $scope.inputMessage = '';
        }
    });
