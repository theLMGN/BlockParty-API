const userName = "thelmgn" //Recommend making sure it's lowercase.





const request = require("request")
const WebSocket = require("ws")
var userServer = "NONE"
var time = new Date()
function sendMessageRaw(ws,data, type) {
    console.log("Sending with type " + type + ": ")
    console.log("    " + data)
    ws.send(type + ":::" + data)
    console.log((type + ":::" + data))
}
function sendData(ws,data) {
    sendMessageRaw(ws,JSON.stringify(data), "5")
}
console.log("Grabbing SocketID...")
request('https://api.hivemc.com:8443/socket.io/1/', function(e,r,b) {
    console.log("SocketID is " + b.split(":")[0])
    var ws = new WebSocket('wss://api.hivemc.com:8443/socket.io/1/websocket/' + b.split(":")[0]);
    ws.onopen = function () {
        console.log('socket connection opened properly');
    };
   
    ws.onmessage = function (evt) {
        var message = evt.data.split("::")
        //console.log("Message received " + message[1] + ", with type " + message[0]);
        try {
            request('https://hivemc.com/ajax/getblockpartyserver/' + userName, function(e,r,b) {
                var newServer = JSON.parse(b).server
                if (userServer !== newServer) {
                    console.log("User moved from server " + newServer + " from " + userServer);
                    if (userServer !== "NONE") {
                        sendData(ws,{
                            name: "leaveserver",
                            args: [
                                {
                                    server:userServer
                                }
                            ]
                            })

                    } 
                    if (newServer !== "NONE") {
                        sendData(ws,{
                            name: "joinserver",
                            args: [
                                {
                                    server:newServer
                                }
                            ]
                            })
                    }
                    userServer = newServer
                }
            })
        } catch(e) {
            console.log("Failed to refresh server: " + e)
        }
        if (message[0] == "2") {
            console.log("T'was a ping. Will send a message back.")
            sendMessageRaw(ws,"","2")
        } else if (message[0] == "5") {
            var data = message[1]
            if (data.charAt(0) == ":") {
                data = data.slice(1);
            }
            console.log(JSON.parse(data))

            // Your code here. https://github.com/theLMGN/BlockParty-API/blob/master/API.md#incoming-frames





        }
    };
   
    ws.onclose = function () {
        console.log("Connection closed...");
    };
})

