var fs = require('fs');
var path = require("path");
var pngparse = require("pngparse");

var myLedStripe = require('./ledstripe');

var imgDir = __dirname + '/img';

var numLEDs = 30;

var blackBuffer = new Buffer(numLEDs*3);
for (var i=0; i<blackBuffer.length; i++){
  blackBuffer[i]=0;
};



function displayPNG(filename, onFinish){
			pngparse.parseFile(path.join(imgDir, filename), function(err, data) {
 	 	    if(err)
    		  throw err
  		console.log(data); 
  		console.log('writing to device');
      //append 1 black row
  		var imgBuffer = Buffer.concat([data.data, blackBuffer]);
   		myLedStripe.animate(imgBuffer,'10m', onFinish);
	});
	return;
}

process.on( 'SIGINT', function() {
  console.log( "\ngracefully shutting down from  SIGINT (Crtl-C)" )
  // close conection to SPI
  myLedStripe.disconnect();
  process.exit( )
})



function fillRed(){
  myLedStripe.fill(0x80,0x00,0x00);
  //displayPNG("terminate.png");
  setTimeout(fillBlack1, 2);
}

function fillBlack1(){
  myLedStripe.fill(0x00,0x00,0x00);
  //displayPNG("terminate.png");
  setTimeout(fillBlue, 80);
}

function fillBlack2(){
  myLedStripe.fill(0x00,0x00,0x00);
  //displayPNG("terminate.png");
  setTimeout(fillRed, 80);
}


function fillBlue(){
  //displayPNG("rainbowsparkle.png");
  myLedStripe.fill(0x00,0x00,0xFF);
  setTimeout(fillBlack2, 2);
}

myLedStripe.connect(64,'WS2801','/dev/spidev0.0');
//myLedStripe.connect( function(){

  //callback when connected
  // displayPNG("rainbowsparkle.png",function(){
  //   displayPNG("johnsbild.png",function(){
  //     displayPNG("terminate.png")
  //   });
  // });

  //displayPNG("farben.png")
  //myLedStripe.fill(0x00,0xFF,0x00);
  //fillBlue();
  myLedStripe.fill(0x00,0x80,0x80);
//})






