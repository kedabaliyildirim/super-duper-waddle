app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {
    const connectionOptions = {
        reconnectionAttempts: 2,
        reconnectionDelay: 300
    }
    indexFactory.connectSocket('http://localhost:3000', connectionOptions)
    .then((socket) =>{
        console.log('CONNECTED', socket);
    }).catch((err) =>{
        console.log();
    })
    
}])