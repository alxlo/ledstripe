var fs = require('fs');
var path = require("path");
var pngparse = require("pngparse");

var myLedStripe = require('./ledstripe');

var imgDir = __dirname + '/img';


var blackBuffer = new Buffer(myLedStripe.numLEDs*myLedStripe.bytePerPixel);
for (var i=0; i<blackBuffer.length; i++){
  blackBuffer[i]=0;
};


//myLedStripe.doOutput();

//PARSE DIRECTLY FROM resized and aligned png file





function displayPNG(){
	//pngparse.parseFile(path.join(imgDir, "rainbowsparkle.png"), function(err, data) {
		pngparse.parseFile(path.join(imgDir, "terminate.png"), function(err, data) {
 	 	if(err)
    		throw err
  		console.log(data); 
  		console.log('writing to device');
  		var imgBuffer = Buffer.concat([data.data, blackBuffer]);
  //append 1 black row
  		myLedStripe.writeFrame(imgBuffer,'10m');
	});
	return;
}



//connect to the server
console.log("Fooooo");
myLedStripe.connect( function(){
	console.log("Baaaaaz");
  //callback when connected
  displayPNG();

})






