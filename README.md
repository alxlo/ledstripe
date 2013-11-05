# ledstripe

Control WS2801 and LPD8806 LED stripes with Node.js via SPI.

[![NPM](https://nodei.co/npm/ledstripe.png)](https://nodei.co/npm/ledstripe/)


Background Information
----------------------

* Overview on LED stripes http://nut-bolt.nl/2012/rgb-led-strips/
* The LPD8806 protocol explained https://github.com/adafruit/LPD8806/blob/master/LPD8806.cpp
* WS2801 datasheet http://www.adafruit.com/datasheets/WS2801.pdf

Can't access your SPI device?
-----------------------------

* Find out if your kernel has SPI support at all. Debian Wheezy should provide this as an out-of-the box feature. So with running Wheezy on a Raspberry Pi you should be fine. However, most of the very few distros for the Cubieboard might leave you out in the cold to bake your own kernel.
* Make sure your SPI kernel module is loaded. On the Raspberry Pi add a line
```
spi-bcm2708
```
to `/etc/modules` to load it permanently on boot. If you dont want to load the module on every time you boot the system, load it temporarily with `sudo modprobe spi-bcm2708`.
* Finally there should exist something not entirely unlike `/dev/spidev0.0`.
* Make your SPI device accessible for the user running the node script. This will save you the trouble of running your node script as root. If you want the user `pi` to be able to use the device, setup groups and permissions:
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
