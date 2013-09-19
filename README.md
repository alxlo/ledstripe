ledstripeJS
===========

Node JS code for LED stripes


Background Information
----------------------

* Overview on LED strips http://nut-bolt.nl/2012/rgb-led-strips/
* the LPD8806 protocol https://github.com/adafruit/LPD8806/blob/master/LPD8806.cpp
* WS2801 datasheet http://www.adafruit.com/datasheets/WS2801.pdf

Can't access your SPI device?
-----------------------------

* Make sure your SPI kernel module is loaded. On the Raspberry Pi add a line
´´´
spi-bcm2708
´´´
to /etc/modules

* Make your SPI device accessible for the user running the node script
