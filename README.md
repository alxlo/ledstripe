ledstripe
===========

Node.js code for controllig WS2801 and LPD8806 LED stripes via SPI.


Background Information
----------------------

* Overview on LED strips http://nut-bolt.nl/2012/rgb-led-strips/
* The LPD8806 protocol explained https://github.com/adafruit/LPD8806/blob/master/LPD8806.cpp
* WS2801 datasheet http://www.adafruit.com/datasheets/WS2801.pdf

Can't access your SPI device?
-----------------------------

* Check if your kernel has SPI support at all.
* Make sure your SPI kernel module is loaded. On the Raspberry Pi add a line
```
spi-bcm2708
```
to `/etc/modules` to load it permanently on boot. If you dont want to load the module on every time you boot the system, load it temporarily with `sudo modprobe spi-bcm2708`.

* Make your SPI device accessible for the user running the node script. If you want the user `pi` to be able to use the device, setup groups and permissions:
```
sudo groupadd -f --system spi
sudo adduser pi spi
```
and create (or edit) an udev rule. The file `/etc/udev/rules.d/90-spi.rules` should contain the line
```
SUBSYSTEM=="spidev", GROUP="spi"
```
Reboot for the changes to take effect.


[![endorse](https://api.coderwall.com/alxlo/endorsecount.png)](https://coderwall.com/alxlo)
