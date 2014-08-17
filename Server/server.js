var WebSocketServer = require('ws').Server,
    http = require('http'),
    express = require('express'),
    app = express();
var sys = require("sys");
var fs = require("fs");
var com = require("serialport");

app.use(express.compress());
app.use(express.static(__dirname + '/public'));
var stdin = process.openStdin();
var cin = "none";

//for testing
var data = {
    "machineStates": {
        "m0": "0",
        "m1": "0",
        "m2": "1"
    }
};
var userData;
var sensorData = 0;

fs.readFile('database.json', function (err, jsonData) {
	if (err) throw err;
	//console.log(jsonData);
	userData = JSON.parse(jsonData);
	userDataString = jsonData.toString();
	console.log(userData.Peter.pushoverKey);
});

function saveUserData(jsonString){
	fs.writeFile('database.json', jsonString.toString(), function (err) {
	  if (err) throw err;
	  console.log('Saved user data!');
	});
}

/*var serialPort = new com.SerialPort("/dev/ttyUSB0", {
    baudrate: 9600,
    parser: com.parsers.readline(',')
  });

serialPort.on('open',function() {
  console.log('Port open');
});

serialPort.on('data', function(srlData) {
  if(srlData != ""){
    console.log(srlData);
    sensorData = srlData;
}};*/

//console text interface to set state for machine 0
stdin.addListener("data", function(d) {
    cin = d.toString().substring(0, d.length-1)
	data.m0 = cin;
});

var server = http.createServer(app);
server.listen(8080);
var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
    var id = setInterval(function() {
        ws.send(JSON.stringify(data), function() { /* ignore errors */ });
    }, 1000);
    console.log('started client interval');
    ws.on('close', function() {
        console.log('stopping client interval');
        clearInterval(id);
    });
    ws.on('message', function(data, flags) {
        console.log("Recieved: " + data);
        if (data.match(/user/gi)) {
            var user = data.split(":")[1];
            console.log("User: " + user);
            if (userDataString.indexOf(user) > -1) {
                //send saved user settings to client
                ws.send(JSON.stringify(userData[user]), function() { /* ignore errors */ });
                console.log(userData[user]);
            }
        }
		//update user settings
        if (data.match(/update/gi)) {
            jsonUpdate = JSON.parse(data);
            var user = jsonUpdate.Update
            console.log("Update for user: " + user);
            if (jsonUpdate.action == "notify") {
                console.log("Notification update");
                console.log("New: " + jsonUpdate.notify);
                console.log("Old: " + userData[user].notify);
                userData[user].notify = jsonUpdate.notify;
                saveUserData(JSON.stringify(userData));
            }
            if (jsonUpdate.action == "pushoverKey") {
                console.log("Update pushoverKey");
                console.log("New: " + jsonUpdate.pushoverKey);
                userData[user].pushoverKey = jsonUpdate.pushoverKey;
                saveUserData(JSON.stringify(userData));
            }
        }
    });
});