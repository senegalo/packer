require 'mime/types'
out = File.new "packed.nzp", "w"
home_dir = "images"

Dir.foreach( home_dir ) do |dir|
  next if dir == "." || dir == ".."  
  p dir
  mime_type = MIME::Types.type_for("images/#{dir}")
  p mime_type[0].to_s.length
  out.write [File.size("images/#{dir}")].pack("N")
  out.write [mime_type[0].to_s.length].pack("N")
  out.write mime_type.pack("A*")
  p MIME::Types.type_for("images/#{dir}").pack("A*")
  p [File.size("images/#{dir}")].pack("L")
  p [File.size("images/#{dir}")]
  out.write File.read "images/#{dir}"
end
out.close
