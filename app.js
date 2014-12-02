var dataPlotter = require('./dataPlotter');

var serialPort = require("serialport");
var SerialPort = serialPort.SerialPort;

function onSerialData(data){
    console.log(data);
    dataPlotter.sendData(JSON.parse(data));
}


var port = process.argv[2] || '';  

serialPort.list(function (err, ports) {
    if (ports.length == 1 || port != ''){
		port = ports.length == 1 ? ports[0].comName : port;
	
        var serial = new SerialPort(port, {
            baudrate: 9600,
            parser: serialPort.parsers.readline("\n")
        });

        serial.on("open", function () {
            console.log('Connected to Arduino on '+port);
            dataPlotter.init(function(){
                serial.on('data', onSerialData);
            });
        });
    }
    else{
	    console.log('use: node app.js [port]');
        console.log('All available ports:');

        ports.forEach(function(port) {
            console.log(port.comName);
            console.log(port.pnpId);
        });
    }
});
