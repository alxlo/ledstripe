var fs = require('fs');
var path = require("path");
var microtime = require('microtime');
var nanotimer = require('nanotimer');
var net = require('net');


function LedStripe(){
	this.client = null;
	this.HOST = '172.22.99.206';
    this.PORT = 11177;
    this.spiDevice = '/dev/spidev0.0';
	this.numLEDs = 30;
	this.bytePerPixel = 3; //RGB
	this.rowResetTime = 1000; // number of us CLK has to be pulled low (=no writes) for frame reset
    						 // manual of WS2801 says 500 is enough, however we need at least 1000

}

LedStripe.prototype = {




    doOutput : function(row){
    	
    	// Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    	 this.client.write(new Buffer([0x00,0x00,0x00,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0xFF,0xFF,0xFF,0x80,0xFF,0x80,0xFF,0xFF,0xFF,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x00,0x00,0x00]));
    		//client.write('Helllooooooooo');
    	//	client.destroy();

		
		// Add a 'close' event handler for the client socket
		console.log("promt");
		return;
    },	// end doOutput		


    connect: function(callback){
		this.client = new net.Socket();
		console.log("trying to connect to "+this.HOST+":"+this.PORT);
		this.client.connect(this.PORT, this.HOST, function(){
			console.log("connected");
			if(callback) callback();
		});
		this.client.on('close', function() {
    		console.log('Connection closed');
		});
	   	//if (callback) callback();
    },

	writeRow : function(row, buffer){
		var readPos = row*this.numLEDs*this.bytePerPixel; //start position of corrent row in buffer
		var aBuf = new Buffer ((this.numLEDs +2) *this.bytePerPixel);
		//buffer.copy(aBuf,this.numLEDs, row*this.numLEDs*this.bytePerPixel, (row+1)*this.numLEDs*this.bytePerPixel);
		console.log("write row "+row+" for "+this.numLEDs+" LEDs");
		aBuf[0] = 0x00;
	    aBuf[1] = 0x00;
	    aBuf[2] = 0x00;
		
	    //swap red and green, shift 0ne bit up
	    for (var i=0; i<(this.numLEDs*this.bytePerPixel); i+=3){
	     	var r = (buffer[readPos+i+0]>>1)+0x80;
	     	var g = (buffer[readPos+i+1]>>1)+0x80;
	     	var b = (buffer[readPos+i+2]>>1)+0x80;
		 	aBuf[i+3]=g;
		 	aBuf[i+4]=r;
		 	aBuf[i+5]=b;
		 	// aBuf[i+3]=0xff;
		 	// aBuf[i+4]=0xff;
		 	// aBuf[i+5]=0xff;


		};
	    aBuf[this.numLEDs*this.bytePerPixel+3] = 0x00;
	    aBuf[this.numLEDs*this.bytePerPixel+4] = 0x00;
	    aBuf[this.numLEDs*this.bytePerPixel+5] = 0x00;
		//fs.writeSync(fd, buffer, row*numLEDs*bytePerPixel, numLEDs*bytePerPixel, null);
		console.log(aBuf);
		this.client.write(aBuf);

	    
	}, //end writeRow



	writeFrame : function(buffer,frameDelay, callback){
	  var row = 0;
	  var rows = buffer.length/(this.numLEDs*this.bytePerPixel);
	  var myTimer = new nanotimer();
	  console.log("Writing " + rows + "rows for "+this.numLEDs+" LEDs");
	  myTimer.setInterval(function(){
	    if (row>=rows){
	      myTimer.clearInterval();
	      if (callback)
		      callback();
	    } else {
	      this.writeRow(row,buffer);
	      row++;
	    }
	    }.bind(this), frameDelay, function(err) {
	      if(err) {
	         //error
	      }
	  });
	} //end writeFrame

















}


module.exports = new LedStripe();

/*

var client = new net.Socket();
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write('I am Chuck Norris!');

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
    
    console.log('DATA: ' + data);
    // Close the client socket completely
    client.destroy();
    
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});



*/