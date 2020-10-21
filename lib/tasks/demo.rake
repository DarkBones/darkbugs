namespace :demo do
  desc 'Purge demo schemas'
  task purge: [:environment] do
    User.demo_expired.each do |user|
      user.destroy!
    end
  end
end