# Packer
small script that packs images into a binary blob that gets unpacked on the client

How To Use
==========

Run the packer.rb ruby script. This will open the images folder and pack everything in it into a file called packed.nz
run the index.html file which will load the packed.nz file and extract the images in it.

Frame Description
=================
```
--------------------------------------------------------------------------------------
| A - 32-bits Data Size | B - 32-bits Mime-Type bytes | C - * Mime-Type | D - * Data |
--------------------------------------------------------------------------------------
```
```
A - First 32 bits contain the number of data bytes in this frame
B - Contains the number of bytes in the Mime Type 
C - Contains the Mime type itself
D - The actual data
```
