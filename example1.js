/*
 * some example code for testing your led stripe
 */

var myLedStripe = require('./index');
var myArgs = process.argv.slice(2);

// sanity check for arguments
var numLEDs = ~~Number(myArgs[0]);
if ((myArgs.length == 3) &&
    (String(numLEDs) === myArgs[0] && numLEDs > 0) &&
    (myArgs[1]=='WS2801' || myArgs[1]=='LPD8806')){
  
    // everything possibly sane
    myStripeType = myArgs[1];
    mySpiDevice = myArgs[2]
    console.log('Testing ' + myStripeType + ' LED stripe with ' + numLEDs + ' LEDs on SPI ' + mySpiDevice);

    // connecting to SPI
    myLedStripe.connect(numLEDs, myStripeType, mySpiDevice);

    // disconnect on Ctrl-C (not necessary but we will play nice)
    process.on( 'SIGINT', function() {
      console.log( "\ngracefully shutting down from  SIGINT (Ctrl-C)" )
      // close conection to SPI
      myLedStripe.disconnect();
      process.exit( )
    })

    
    // do some fancy stuff
    myLedStripe.fill(0xFF, 0x00, 0x00);
    console.log("red");
    setTimeout(function(){
        myLedStripe.fill(0x00, 0xFF, 0x00);
        console.log("green")}, 1000);
    setTimeout(function(){
        myLedStripe.fill(0x00, 0x00, 0xFF);
        console.log("blue")}, 2000);
    setTimeout(function(){
        myLedStripe.fill(0xFF, 0xFF, 0xFF);
        console.log("white")}, 3000);
    setTimeout(doFancyColors, 4000);

 

    function doFancyColors(){
        // o.k., lets do some colorful animation
        console.log("all colors are beautiful \\o/")
        var myDisplayBuffer = new Buffer(numLEDs*3);
        var animationTick = 0.005;
        var angle = 0;
        var ledDistance = 0.3;
        setInterval(function(){
          angle = (angle < Math.PI * 2) ? angle : angle - Math.PI*2;
          for (var i=0; i<myDisplayBuffer.length; i+=3){
            //red
            myDisplayBuffer[i] = 128 + Math.sin(angle + (i/3)*ledDistance) * 128;
            //green
            myDisplayBuffer[i+1] = 128 + Math.sin(angle * -5 + (i/3)*ledDistance) * 128;
            //blue
            myDisplayBuffer[i+2] = 128 + Math.sin(angle * 7 + (i/3)*ledDistance) * 128;
          }
          myLedStripe.sendRgbBuf(myDisplayBuffer);
          angle+=animationTick;
        },5);
    }; // end doFancyColors

} else {
  console.log( "\nUsage:\tnode example1 <number of LEDs> <stripe type> <SPI device>\n\n"
              +"where \t<number of LEDs> is an integer > 0 and\n"
              +"\t<stripe type> is either WS2801 or LPD8806\n"
              +"\t<SPI device> is your SPI device\n\n"
              +"e.g. \t node example1 32 WS2801 /dev/spidev0.0\n\n"
              )
}