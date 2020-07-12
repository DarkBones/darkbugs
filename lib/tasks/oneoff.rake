namespace :oneoff do
  desc 'Add uuid values for users'
  task add_uuid_to_users: [:environment] do
    User.where(uuid: nil).each do |user|
      uuid = SecureRandom.urlsafe_base64(8, false)

      while User.where(uuid: uuid).exists?
        uuid = SecureRandom.urlsafe_base64(8, false)
      end

      user.uuid = uuid
      user.save!
    end
  end
end
