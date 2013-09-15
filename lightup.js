var fs = require('fs');
var path = require("path");
var pngparse = require("pngparse");

var myLedStripe = require('./ledstripe');

var imgDir = __dirname + '/img';


var blackBuffer = new Buffer(myLedStripe.numLEDs*myLedStripe.bytePerPixel);
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
   		myLedStripe.animate(imgBuffer,'25m', onFinish);
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
  displayPNG("terminate.png");
  setTimeout(fillBlue, 100);
}

function fillBlue(){
  displayPNG("rainbowsparkle.png");
  //myLedStripe.fill(0x00,0x00,0x00);
  //setTimeout(fillRed, 20);
}

myLedStripe.connect();
//myLedStripe.connect( function(){
	console.log("Baaaaaz");
  //callback when connected
  // displayPNG("rainbowsparkle.png",function(){
  //   displayPNG("johnsbild.png",function(){
  //     displayPNG("terminate.png")
  //   });
  // });

  //displayPNG("farben.png")
  myLedStripe.fill(0xFF,0x00,0x00);
  fillRed();

//})






