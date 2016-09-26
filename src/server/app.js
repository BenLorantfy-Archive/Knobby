var net = require('net');
var five = require('johnny-five');

var HOST = '127.0.0.1';
var PORT = 6969;

// [ Array of connected sockets ]
var sockets = [];

// [ Create broadcast util ]
sockets.broadcast = function(data){
    var json = JSON.stringify(data);

    for(var i = 0; i < sockets.length; i++){
        json = json.replace(/MSG_DELIM/g,"");
        sockets[i].write(json + "MSG_DELIM");
    }
}

// [ Listen for CC apps to connect ]
net.createServer(function(sock) {

    // [ Add socket to array of connected sockets ]
    sockets.push(sock);
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {      
        // console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // Write the data back to the socket, the client will receive it as data from the server
        // sock.write('You said "' + data + '"');     
    });
    
    sock.on('close', function(data) {

        // [ Remove the sockets from array of connected sockets]
        var index = sockets.indexOf(sock);
        sockets.splice(index, 1);

        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });
    
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);



// [ Send message to CC apps whenever levels change ]
var board = five.Board();
board.on("ready",function(){
    var sensor = new five.Sensor("A0");
    sensor.on("change", function(){
        var level = this.scaleTo(0,1000);
        console.log(level);
        sockets.broadcast({
             knob: 0
            ,level: level
        })
    });    
})
