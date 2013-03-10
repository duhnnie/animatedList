require 'rubygems'

desc "check all the depnedencies to build the project"
task :required do 
	isOK = true
	puts "checking all the dependencies..."
	begin
		require "closure-compiler"
	rescue LoadError
		isOK = false
		puts "Closure-Compiler GEM not found.\nInstall it by running 'gem install closure.compiler'"
	end
	begin
		require "sass"
	rescue LoadError
		isOK = false
		puts "Sass GEM not found.\nInstall it by running 'gem install sass'"
	end
	begin
		require "zip/zip"
		require "zip/zipfilesystem"
	rescue LoadError
		isOK = false
		puts "Zip GEM not found.\nInstall it by running 'gem install rubyzip'"
	end
	if !isOK
		exit
	end
	puts "DONE"
end

task :files => :required do
	puts "minifying javascript..."
	src_file = File.read 'src/animatedList.jquery.js'
	File.open('release/animatedList.jquery.min.js', 'w+') do |file_handler|
		file_handler.write Closure::Compiler.new.compress(src_file)
	end

	puts "DONE"

	puts "generating stylesheets..."
	system 'sass --style expanded src/sass/animatedList.scss release/animatedList.jquery.css'
	system 'sass --style compressed src/sass/animatedList.scss release/animatedList.jquery.min.css'
	system "cp -r src/* release/"
	puts "DONE"
end

task :package => [:required, :files] do
	puts "packing..."
	FileUtils.rm 'animatedList.jquery.zip', :force => true
	Zip::ZipFile.open('animatedList.jquery.zip', 'w') do |zipfile|
		files = FileList.new('release/*')
		files.each do |file|
			zipfile.add(file, file)
		end
	end
	puts "DONE"
end

task :build do
	puts "building project..."
	Rake::Task['required'].execute
	Rake::Task['files'].execute
	Rake::Task['package'].execute
	puts "project built sucessfully!"
end

task :default do
	Rake::Task['build'].execute
end