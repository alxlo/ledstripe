/*
 * display some .png files (without alpha channel!) as animation
 */
var fs = require('fs'),
    path = require("path"),
    pngparse = require("pngparse"),
    myLedStripe = require('./index')

var imgDir = __dirname + '/img',
    numLEDs = 30,
    //ledStripeType = 'LPD8806'
    ledStripeType = 'WS2801'

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

myLedStripe.connect(numLEDs,ledStripeType,'/dev/spidev0.0');
displayPNG("rainbowsparkle.png",function(){
  displayPNG("johnsbild.png",function(){
    displayPNG("terminate.png")
  });
});
