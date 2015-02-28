# Resource Packer

Resource Packer is a media packager that packs images, videos and audio files into a single file for easier transport between the server and the browser with a client javascript library to split the package back into it's original files types.

How To Use
==========

1) Install the ruby gem.

        gem install resource_packer

2) Then create a new instance of the resource packer and add a directory, files or a file to the package.

        require 'resource_packer'
        packer = ResourcePacker.new
        packer.add_dir "resources"
        packer.add_files ["file1.jpg", "file2.mp4", "file3.mp3"]
        packer.add_file "test.gif"

3) Call the pack method to return the package data and store it in a file.

        out = File.open "packed.pk" , 'w'
        out.write packer.pack
        out.close

4) From the client side require the resource_packer.js

        <script src="resource_packer.js" type="text/javascript"></script>

5) Create an instance of the ResourcePacker object with 2 parameters the first is a URL to the package and the second is a callback. when the package is loaded and parsed an object containing all the elements will be passed to your callback.
    
        new ResourcePacker("http://www.mywebsite.com/packed.pk", function (elements) { });


Frame Description
=================
```
-------------------------------------
| A - 32-bits filename bytes length |
-------------------------------------
| B - * filename                    |
-------------------------------------
| C - 32-bits Mime-Type bytes       | 
-------------------------------------
| D - * Mime-Type                   | 
-------------------------------------
| E - 32-bits Data Size             |
-------------------------------------
| F - * Data                        |
-------------------------------------
```
```
A - 32 bits containing the number of filename bytes.
B - The filename itself.
C - Contains the number of bytes in the Mime Type.
D - The Mime type itself.
E - 32 bits containing the number of data bytes.
F - The actual data.
```
