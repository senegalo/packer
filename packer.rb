out = File.new "packed.nzp", "w"
home_dir = "images"

Dir.foreach( home_dir ) do |dir|
  next if dir == "." || dir == ".." || dir.split(".").last != "jpg"  
  p dir
  out.write [File.size("images/#{dir}")].pack("N")
  p [File.size("images/#{dir}")].pack("L")
  p [File.size("images/#{dir}")]
  out.write File.read "images/#{dir}"
end
out.close
