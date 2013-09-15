var fs = require('fs');
var path = require("path");
var microtime = require('microtime');
var nanotimer = require('nanotimer');

function LedStripe(){
    this.spiDevice = '/dev/spidev0.0';
	this.numLEDs = 30;
	this.spiFd = null; //filedescriptor for spidevice
	this.bytePerPixel = 3; //RGB
	this.rowResetTime = 1000; // number of us CLK has to be pulled low (=no writes) for frame reset
    						  // manual of WS2801 says 500 is enough, however we need at least 1000

}

LedStripe.prototype = {

	/*
	 * connect to SPI port
	 */
    connect: function(callback){
		if (callback){
			//connect asynchronously
			console.log("sync open " + this.spiDevice);
			fs.open(this.spiDevice, 'w', function(err,fd){
				if (err){
					console.error("error opening SPI device "+this.spiDevice, err);	
				} else {
					console.log("got filedescriptor for SPI: " +  fd);
					this.spiFd = fd;
				}

			}.bind(this)); //end open
			callback();	
		} else {
			//connect synchronously
			try{
				this.spiFd = fs.openSync(this.spiDevice, 'w');
			} catch (err) {
				console.error("error opening SPI device "+this.spiDevice, err);
			}
		} 
    },

    /*
     * disconnect from SPI port
     */
    disconnect : function(){
    	if (this.spiFd) fs.closeSync(this.spiFd);
    },

    sendRgbBuf : function(buffer){
    	var bufSize = this.numLEDs * this.bytePerPixel;
    	if (buffer.length != bufSize) {
    		console.log ("buffer length (" + buffer.lenght +" byte) does not match LED stripe size ("+
    			         this.numLEDs + " LEDs x " + this.bytePerPixel + " colors)");
    		return;
    	} // end if (buffer.length != bufSize)
    	if (this.spiFd) {
    		var numLeadingZeros = Math.ceil(this.numLEDs / 32); //number of zeros to "reset" LPD8806 stripe
    		// mind the last zero byte for latching the last blue LED
    		var aBuf = new Buffer (numLeadingZeros + bufSize + 1);
    		// prime the stripe with zeros
    		for (var i=0; i<numLeadingZeros; i++){
    			aBuf[i] =0x00;
    		};
    		// transform color values
    		for (var i=0; i<(bufSize); i+=3){
		     	var r = (buffer[i+0]>>1)+0x80;
		     	var g = (buffer[i+1]>>1)+0x80;
		     	var b = (buffer[i+2]>>1)+0x80;
			 	aBuf[i+numLeadingZeros+0]=g;
			 	aBuf[i+numLeadingZeros+1]=r;
			 	aBuf[i+numLeadingZeros+2]=b;
			};
			// trailing zero
			aBuf[bufSize+numLeadingZeros] = 0x00;
			fs.writeSync(this.spiFd, aBuf, 0, aBuf.length, null);
    	} //end if (this.spiFd)
    }, // end sendRgbBuf

    fill : function(r,g,b){
    	if (this.spiFd) {
	    	var bufSize = this.numLEDs * this.bytePerPixel;
	    	var aBuf = new Buffer(bufSize);
	    	for (var i=0; i<(bufSize); i+=3){
				aBuf[i+0]=r;
			 	aBuf[i+1]=g;
			 	aBuf[i+2]=b;
			}
			this.sendRgbBuf(aBuf);
		}    	
    }, //end fill

	animate : function(buffer,frameDelay, callback){
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
	    	this.sendRgbBuf(buffer.slice(row * this.numLEDs * this.bytePerPixel, (row + 1) * this.numLEDs * this.bytePerPixel));	
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
