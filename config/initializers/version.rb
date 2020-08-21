VERSION_BRANCH = `git status -b --porcelain | head -n1`

if ENV['RELEASE_TAG'].present?
  VERSION_SOURCE = 'github'
  VERSION_SHA = ENV['RELEASE_TAG']
  VERSION_LINK = "https://github.com/DarkBones/darkbugs/commit/#{ENV['RELEASE_HASH']}"
else
  VERSION_SOURCE = 'local'
  VERSION_SHA = `cd #{Rails.root} && git rev-parse head`
end
