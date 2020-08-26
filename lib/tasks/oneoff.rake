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

  desc 'Create tenant for users'
  task create_tenant_for_users: [:environment] do
    User.all.each do |user|
      Apartment::Tenant.create(user.uuid)
    end
  end
end
