# ledstripe

Control WS2801 and LPD8806 LED stripes with Node.js via SPI.

[![NPM](https://nodei.co/npm/ledstripe.png)](https://nodei.co/npm/ledstripe/)

Background Information
----------------------

* Overview on LED stripes http://nut-bolt.nl/2012/rgb-led-strips/
* The LPD8806 protocol explained https://github.com/adafruit/LPD8806/blob/master/LPD8806.cpp
* WS2801 datasheet http://www.adafruit.com/datasheets/WS2801.pdf

What works? What not?
---------------------

Currently, only WS2801 and LPD8806 stripes work. The more recent WS2811 and WS2812 are **not supported** as they use a different protocoll with timing constraints that will be tremendously difficult to fulfill with a high level language.

[![endorse](https://api.coderwall.com/alxlo/endorsecount.png)](https://coderwall.com/alxlo)

Wiring Stuff
------------

**Disclaimer:** Use at your own risk. Read everything. Try to understand.
Read again. Find out if your setup reflects the assumptions that lead to
the information given here. Cable colours can vary. Labels on PCBs and
Pin assignments on your devices may differ or may have been change over
time. I could have made a mistake. Be sceptical. Cross reference all information against
documentation available for your components and devices. Improper wiring
may terminally damage your device and blow up your cat.

You typical LPD8806/WS2801 LED stripe has 4 input wires that have to be
connected the following way.

<table rules="rows">
<tr>
<th>LED stripe (possible marking)</th>
<th>Function</th>
<th>RPi GPIO</th>
<th>Cubie</th>
</tr>
<tr>
<td>+5V, 5V, VCC</td>
<td>powers the LEDs from an external power supply</td>
<td>see below</td>
<td>see below</td>
</tr>
<tr>
<td>CK, CLK, CKI, CK-in, CI, DCLK</td>
<td>clock signal</td>
<td>pin 23 (GPIO 11, SCKL)</td>
<td></td>
</tr>
<tr>
<td>SD, SDI, SD-in, DIN, DI</td>
<td>data signal</td>
<td>pin 19 (GPIO 10, MOSI)</td>
<td></td>
</tr>
<tr>
<td>GND</td>
<td>ground connection</td>
<td>pin 6 (GROUND)</td>
<td></td>
</tr>
</table>

In general, **+5V is not connected** to your RPi/Cubie. For exceptions see
the section 'Power Supply' below. Just connect GND, CLK and SD.

Usual wire colors are red for +5V, black for GND, blue for CLK and green for SD. This is by no means standardized, so yours may differ. The pin headers for the Cubie are way smaller than the standard grid spacing of 2.54mm, as they use 2mm spacing. You might get the from Farnell or Mouser.



### Power Supply

In general, you can not and definitely should not power the LED stripe
from your cubieboard or Raspberry Pi. Don't even try. The required
current is much higher than your board will be able to sustain (unless
your LED stripe is really, really short) and you might damage things.

You will require an external +5V power source with a current rating that
is high enough for the number of LEDs you are going to connect. As a
rule of thumb, expect 20mA per pixel and colour, so 1 m LED stripe with
32 LEDs will require up to 1.9A. You might come by with less, as not all
pixel will always be lit, but that leaves you with a system that can
become unreliably or even damage and overheat your power supply - which
in turn can lead to some dangerous accidents, e. g. your house burning down.

Therefore, check the actual maximum power consumption with an ampere meter and
leave some margin in your design. This might be a bit difficult as high
current +5V supplies are not that common. You possibly might use
individual supplies for shorter segments of LED stripe. Keep in mind,
that the lenght of stripe you can supply from a single connection point
is limited, as the conductive leads on the stripe themselfes pose limits
on this. Having a power supply that can deliver a higher current than
required is o.k., just check that the output voltage is stabilized and
does not exceed +5V.

So, normally, +5V from the LED is not connected to your RPi or
Cubieboard. However, you _can_ power the Pi or Cubie from your +5V
source **if it is stable enough**. Just make sure there is **no other power source
connected.**

On the Pi, just connect +5V to pin 2 on the GPIO header.
The Cubieboard will require a minor modification to be powered from the extension pinheaders.
Here you will have to short out (or replace with a wire) the protection diode D2 (see top left area on page 7 of the
[[http://dl.cubieboard.org/software/ubuntuone/hw/cubieboard/a10_cubieboard_120808.pdf| schematics file]]). Do this at your own risk, voiding the sacred covenant you've entered into with the manufacturer.

![replacing D2 with a wire](https://github.com/alxlo/ledstripe/raw/master/docimg/replace_d2.jpg)

Troubleshooting
---------------

### Strange flickering?

I experienced some issues that led to some irregular flicker in the stripe. Most probably these issues were caused by reflections on the SPI bus.
Actually, I am just a tinkerer with electronics, so I can't be definite on this. What solved these issues was a resistor (some kilo ohms) between CLK and +5V directly at the start of the LED stripe. Maybe another resistor at the data line might be a good idea as well.

### First LED on the stripe went dead?

Seems to be a design problem, I encountered this with several stripes. As it looks, the GND connection to the resistors was br0ken. Maybe the flex PCB has a very thin trace that tends to break. You can fix this with an ohm meter, a soldering iron and a thin piece of wire. Just check how the ground connections of the resistors are supposed to be on a working segment of the LED stripe and reconnect the broken one. This might be a bit messy on a silicone sealed stripe, but it can be done.

### Can't access your SPI device?

* Find out if your kernel has SPI support at all. Debian Wheezy should provide this as an out-of-the box feature. So with running Wheezy on a Raspberry Pi you should be fine. However, most of the very few distros for the Cubieboard might leave you out in the cold to bake your own kernel.
* Make sure your SPI kernel module is loaded. On the Raspberry Pi add a line
```
spi-bcm2708
```
to `/etc/modules` to load it permanently on boot. If you dont want to load the module on every time you boot the system, load it temporarily with `sudo modprobe spi-bcm2708`.
* Finally there should exist something not entirely unlike `/dev/spidev0.0`.
* Make your SPI device accessible for the user running the node script. This will save you the trouble of running your node script as root. If you want the user `pi` to be able to use the device, setup groups and permissions:

        sudo groupadd -f --system spi
        sudo adduser pi spi
and create (or edit) an udev rule. The file `/etc/udev/rules.d/90-spi.rules` should contain the line

        SUBSYSTEM=="spidev", GROUP="spi"

Reboot for the changes to take effect.



