require 'mime/types'

class ResourcePacker

  def initialize
    @out = ""
  end

  def add_file filename
    mime_type = MIME::Types.type_for(filename)
    name = filename.split("/").last
    @out += encode [mime_type.last.to_s.length].pack("N")
    @out += encode [mime_type.last].pack("A*")
    @out += encode [name.length].pack("N")
    @out += encode [name].pack("A*")
    @out += encode [File.size(filename)].pack("N")
    @out += encode File.read(filename)
  end

  def encode data
    data.force_encoding("ASCII-8BIT")
  end

  def add_files files
    files.each do filename
    add_file filename 
    end
  end

  def add_dir home_dir
    Dir.foreach( home_dir ) do |dir|
      next if dir == "." || dir == ".."  
      add_file "#{home_dir}/#{dir}"
    end
  end

  def pack
    @out
  end

end
