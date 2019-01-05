exports = module.exports = function (io) {
    //Set Listeners
    let user = [];
    let addedUser;
    io.on('connection', (socket) => {
     //Map: id -> name of the user
        console.log('aaaaaa user has connected');
        socket.on('enter channel', (username) => {
            
            socket.join(username);
            
            console.log('user issssss',username);
            
        }); 
        
        socket.on('new privateMessage', function (socketMsg) {
            console.log('message: ' , socketMsg);
            socketMsg.to.forEach(function (element) {
                io.sockets.in(element.first_name).emit('refresh privateMessages', { mail_type: socketMsg.mail_type });
                console.log(socketMsg.mail_type);
            });
        });
        
        socket.on('disconnect', () => {
            console.log('user disconnected')
        });
    });
}