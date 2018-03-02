# WARNING!
This isn't very readable.
If you'd like to make improvements (readability or otherwise), pull requests are **welcome**.
------------
------------
------------

# 1st HTTP Request - Socket Details
`https://api.hivemc.com:8443/socket.io/1/`

**Responds with: `{SocketUUID}:60:60:websocket,flashsocket,xhr-polling`**


# HTTP Ping Request - What server is x on? 
`https://hivemc.com/ajax/getblockpartyserver/{Username}`

**Responds with: `{server: "{ServerName"}`**

*Server name if user is on a server, NONE if they're not in a server.*

------------

# Socket Connection 
`wss://api.hivemc.com:8443/socket.io/1/websocket/{SocketUUID from previous request}`
All frame start with an type code. (like `5:::{"name":"example"}` or `0:::`)

Type Number | Friendly name
--- | ---
0::: | Disconnecting (server to client only)
1::: | Hello there! (Connected, server to client only)
2::: | Ping! (You should send the message back to prove the server you're alive or else the connection will be closed.) (Can be sent to and from server)
--- | ---
5::: | JSON Message (Can be sent to and from server)
## Sending Frames:
### `{"name":"joinserver","args":[{"server":"{ServerName}"}]}`

*Tells Server to subscribe to this server. Don't know if you can subscribe to more than one server.*
### `{"name":"leaveserver","args":[{"server":"{ServerName}"}]}`

*Tells Server to unsubscribe to this server.*

## Incoming frames:

### `{"name":"narration","args":[{"type":"JSON","args":[],"data":{"server":"{ServerName}","type":"{type}","file":"{file}"},"ackRequested":false}]}`

*Tells client to play narration.*

Audio file location seems to be https://static.hivemc.com/bp/narration/{URLtype}Events/{file}.ogg

File Name | Socket Type
--- | ---
GameStartEvents | gamestart
RandomEvents | random
WinEvents | win
DeathEvents | death


### `{"name":"loadsong","args":[{"type":"JSON","args":[],"data":{"server":"{ServerName}","name":"{SongName}","file":"{Song Name}.ogg","soundcloud":"{Soundcloud song ID}"},"ackRequested":false}]}`

*Requests client to load up a song*

Note for Soundcloud song id: Songs are uploaded to the Soundcloud account "hidden_bp" with names like "Blockparty: P S R" for **P**ixl - **S**ugar **R**ush

### `{"name":"control","args":[{"type":"JSON","args":[],"data":{"server":"{ServerName}","play":{IntShouldPlay}},"ackRequested":false}]}`

*Tells client to play/pause music.*

### `{"name":"color","args":[{"type":"JSON","args":[],"data":{"server":"{ServerName}","colorid":{IntColorID}},"ackRequested":false}]}`

*Tells the client to choose a color.*

Color ID | Hex Code
--- | --- 
0 | #ffffff
1 | #f3bb12
2 | #ba2bd9
3 | #5fc2f6
4 | #f3ec30
5 | #80ea40
6 | #dd8cec
7 | #525252
8 | #c6c6c6
9 | #1da0b0
10 | #573b9f
11 | #2564cc
12 | #6e4d29
13 | #2d752b
14 | #c92e2a
15 | #000000

### There's also a `endgame` event which seems to reset everything back to nothing.
