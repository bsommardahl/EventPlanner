MSBUILD_PATH = "C:/Windows/Microsoft.NET/Framework/v4.0.30319/msbuild.exe"
MSPEC_PATH = "lib/Machine.Specifications.0.5.16/tools/mspec-clr4.exe"
#MSTEST_PATH = "\"" + ENV['VS90COMNTOOLS'].gsub("Tools","IDE") + "mstest.exe\""
BUILD_PATH = File.expand_path('build')
DATABASE_DEPLOYMENT_PATH = File.expand_path('database_deployment')
DEPLOY_PATH = File.expand_path('deploy')
REPORTS_PATH = File.expand_path('testresults')
SOLUTION = "src/EventPlanner.sln"
DATABASE_DEPLOY_PROJECT = "src/DatabaseDeploymentTool/DatabaseDeploymentTool.csproj"
TRXFILE = File.join(REPORTS_PATH, SOLUTION + '.trx')
CONFIG = "Debug"

task :default => [:all]

task :all => [:removeArtifacts, :compile, :tests ]

task :deploy => [ :all, :copyWebFilesToDeploy ]

task :aat => [:removeArtifacts, :buildAcceptanceTests, :tests ]

task :removeArtifacts do
	require 'fileutils'
	FileUtils.rm_rf BUILD_PATH
	FileUtils.rm_rf REPORTS_PATH
	FileUtils.rm_rf DEPLOY_PATH
	FileUtils.rm_rf DATABASE_DEPLOYMENT_PATH
end
	
task :compile do
	puts 'Compiling solution...'
	sh "#{MSBUILD_PATH} /p:Configuration=#{CONFIG} /p:OutDir=\"#{BUILD_PATH}/\" /p:PostBuildEvent=\"\" #{SOLUTION}"	
end

task :copyWebFilesToDeploy do
	puts 'Copying published files...'
	sh "robocopy \"#{BUILD_PATH}/_PublishedWebsites/\" \"#{DEPLOY_PATH}\" /E"	
end

task :drop do
	puts 'Compiling database deployment application...'
	sh "#{MSBUILD_PATH} /p:Configuration=#{CONFIG} /p:OutDir=\"#{DATABASE_DEPLOYMENT_PATH}/\" /p:PostBuildEvent=\"\" #{DATABASE_DEPLOY_PROJECT}"
	Dir.chdir(DATABASE_DEPLOYMENT_PATH) do
		sh "DatabaseDeploymentTool.exe drop"	
	end	
end

task :seed do
	puts 'Compiling database deployment application...'
	sh "#{MSBUILD_PATH} /p:Configuration=#{CONFIG} /p:OutDir=\"#{DATABASE_DEPLOYMENT_PATH}/\" /p:PostBuildEvent=\"\" #{DATABASE_DEPLOY_PROJECT}"
	Dir.chdir(DATABASE_DEPLOYMENT_PATH) do
		sh "DatabaseDeploymentTool.exe seed"	
	end
end

task :migrate do
	puts 'Compiling database deployment application...'
	sh "#{MSBUILD_PATH} /p:Configuration=#{CONFIG} /p:OutDir=\"#{DATABASE_DEPLOYMENT_PATH}/\" /p:PostBuildEvent=\"\" #{DATABASE_DEPLOY_PROJECT}"
	Dir.chdir(DATABASE_DEPLOYMENT_PATH) do
		sh "DatabaseDeploymentTool.exe migrate"	
	end	
end

task :create do
	puts 'Compiling database deployment application...'
	sh "#{MSBUILD_PATH} /p:Configuration=#{CONFIG} /p:OutDir=\"#{DATABASE_DEPLOYMENT_PATH}/\" /p:PostBuildEvent=\"\" #{DATABASE_DEPLOY_PROJECT}"
	Dir.chdir(DATABASE_DEPLOYMENT_PATH) do
		sh "DatabaseDeploymentTool.exe create"	
	end
end

task :compileTeamCity do
	puts 'Compiling solution...'
	sh "#{MSBUILD_PATH} /p:Configuration=#{CONFIG} /p:OutDir=\"#{BUILD_PATH}/\" /p:PostBuildEvent=\"\" #{SOLUTION} /l:JetBrains.BuildServer.MSBuildLoggers.MSBuildLogger,c:/TeamCity/buildAgent/plugins/dotnetplugin/bin/JetBrains.BuildServer.MSBuildLoggers.dll"
end

task :tests do
    puts "Locating and running MSpec tests in #{BUILD_PATH}."
    puts 'This can take a while, please wait...'
    
    # Create output directory if necessary
    mkdir REPORTS_PATH unless File.exist?(REPORTS_PATH)
    
    # Clear out old reports, but don't talk about it.
    verbose(false) do
        FileList.new("#{REPORTS_PATH}/*").each { |file| rm file }
    end
    
    # Find all the specs DLLs
    testDlls = FileList.new("#{BUILD_PATH}/*.Specs.dll")
    
    # Join the file list into a single string with quotes surrounding the file paths
    TEST_DLL_LIST = '"' + testDlls.join('" "') + '"'
    
    # Specify our mspec command line parameters
    HTML_SWITCH = "--html \"#{REPORTS_PATH}\""
    XML_SWITCH = "--xml \"#{REPORTS_PATH}\\testresults.xml\""
    
    # Run the tests and give a message on failure
    # But we don't want to hear the chatter, so dump the console output to a file
    sh "#{MSPEC_PATH} #{HTML_SWITCH} #{XML_SWITCH} #{TEST_DLL_LIST}"
    result = $?.to_i
    
    raise "One or more tests failed.  Please see results in #{REPORTS_PATH}\\index.html" unless result == 0

    # If we get here, all's good
    puts "All tests passed"
end