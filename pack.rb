require 'resource_packer'

packer = ResourcePacker.new
packer.add_dir "resources"
out = File.open "packed.pk" , 'w'
out.write packer.pack
out.close
