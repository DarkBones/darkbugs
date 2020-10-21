namespace :demo do
  desc 'Purge demo schemas'
  task purge: [:environment] do
    User.demo.each do |user|
      user.destroy!
    end
  end
end