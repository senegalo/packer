require 'mime/types'
out = File.new "packed.nzp", "w"
home_dir = "images"

Dir.foreach( home_dir ) do |dir|
  next if dir == "." || dir == ".."  
  p dir
  out.write [File.size("images/#{dir}")].pack("N")
  out.write MIME::Types.type_for("images/#{dir}").pack("A32")
  p MIME::Types.type_for("images/#{dir}").pack("A32")
  p [File.size("images/#{dir}")].pack("L")
  p [File.size("images/#{dir}")]
  out.write File.read "images/#{dir}"
end
out.close
