if File.file? (f = File.join(Rails.root, 'REVISION'))
  VERSION_NAME = 'github'
  VERSION_SHA = File.read(f).strip
  VERSION_LINK = "https://github.com/darkbones/darkbugs/commit/#{VERSION_SHA}"
else
  VERSION_NAME = 'local'
  VERSION_SHA = `cd #{Rails.root} && git rev-parse head`
  VERSION_BRANCH = `git status -b --porcelain | head -n1`
end
