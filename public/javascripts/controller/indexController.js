app.controller('indexController', ['$scope', 'indexFactory', 'configFactory', ($scope, indexFactory, configFactory) => {
    $scope.messages = []
    $scope.players = {}

    $scope.init = () => {
        const userName =prompt('Enter your username');
        if (userName) {
            initSocket(userName);
        }
        else {
            return false;
        };
    }
    function scrollTop() {
        setTimeout(() => {
            const element = document.getElementById('chat-area');
            element.scrollTop = element.scrollHeight;
            
        });
    }
    function bubleChat(id, message) {
        $('#' + id).find('.message').show().html(message);
        setTimeout(() => {
            $('#' + id).find('.message').hide();
        }, 2000);
    }
    async function initSocket(userName) {
        const connectionOptions = {
            reconnectionAttempts: 2,
            reconnectionDelay: 300
        }
        try {
            const socketUrl= await configFactory.getConfig();
            const socket = await indexFactory.connectSocket
                (socketUrl.data.socketUrl
                , connectionOptions);
        
            socket.emit('newUser', {userName})
            //players at initial log in
            socket.on('initPlayers', (players) => {
                $scope.players= players;
                $scope.$apply();

            })

            //when a user joins
            socket.on('newUser', (data)=> {
                const messageData = {
                    type: {
                        code: 0, //code 0 = [SERVER] message
                        message: 1 //connection status 1 = logged in
                    },
                    userName:data.userName
                }
                //pushing the messages
                $scope.messages.push(messageData)
                $scope.players[data.id] = data;
                scrollTop();
                $scope.$apply();
            })
            //When a user disconnects
            socket.on('disUser', (data) => {
                const messageData = {
                    type: {
                        code: 0, //code 0 = [SERVER] message
                        message: 0 //connection status 0 = logged out
                    },
                    
                    userName:data.userName
                };
                //pushing the messages
                $scope.messages.push(messageData);
                delete $scope.players[data.id];
                scrollTop();
                $scope.$apply();
            })
            
            socket.on('moveIt', (data) =>{
                console.log(data);
                $('#' + data.socketId).animate({'left': data.x, 'top': data.y }, () => {
                    animate =false
                });
                
            })
            socket.on('newMessage', (message) => {
                $scope.messages.push(message);
                $scope.$apply();
                bubleChat(message.socketId, message.text);
                scrollTop();
            })


            let animate = false
            $scope.onClickPlayer =($event) => {
                
                if(!animate) {
                    let x = $event.offsetX;
                    let y = $event.offsetY;
                    socket.emit('animate', {x, y})
            
                    animate= true;
                    $('#' + socket.id).animate({'left': x, 'top': y }, () => {
                        animate =false
                    });
            
                }
            };
            $scope.newMessage = () => {
                let message = $scope.message;
                const messageData = {
                    type: {
                        code: 1, //code 1 = [USER] message
                    },
                    userName : userName,
                    text : message
                };
                //pushing the messages
                $scope.messages.push(messageData);
                $scope.message = "";

                socket.emit('newMessage', messageData)
                bubleChat(socket.id, message);
                scrollTop();

            };
        
    }
    catch(err) {
        console.log(err);
    }
    }


}])