require 'rubygems'

desc "check all the depnedencies to build the project"
task :required do 
	isOK = true
	puts "checking all the dependencies..."
	begin
		require "closure-compiler"
	rescue LoadError
		isOK = false
		puts "Closure-Compiler GEM not found, please install it by running 'gem install closure.compiler'"
	end
	if !isOK
		exit
	end
	puts "DONE"
end

task :compile do
	
end

task :default do
	puts "building project..."
	Rake::Task['required'].execute
	puts "project built sucessfully!"
end