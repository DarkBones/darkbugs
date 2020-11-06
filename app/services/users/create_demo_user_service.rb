module Users
  class CreateDemoUserService < BaseService
    attr_reader :name

    AVATARS_PATH = "#{Rails.root}/app/assets/images/demo_avatars/*".freeze

    def initialize
      @name = Faker::FunnyName.two_word_name
    end

    def execute
      create_user
    end

    private def create_user
      password = generate_password
      User.create!({
                       email: email,
                       password: password,
                       password_confirmation: password,
                       demo_user: true,
                       user_profile_attributes: {
                           username: username,
                           first_name: first_name,
                           last_name: last_name,
                           bio: bio
                       }
                   })
    end

    private def email
      email = "#{first_name}.#{last_name}@#{ENV['APP_NAME']}.com".downcase

      idx = 0
      while User.exists?(email: email)
        email = "#{first_name}.#{last_name}-#{idx}@#{ENV['APP_NAME']}.com".downcase
        idx += 1
      end

      email
    end

    private def bio
      Faker::Company.bs.titleize
    end

    private def generate_password
      SecureRandom.urlsafe_base64(20, false)
    end

    private def first_name
      @name.split[0]
    end

    private def last_name
      @name.split[1]
    end

    private def username
      username = generate_username
      username = generate_username while UserProfile.exists?(username: username) || username.downcase.include?('isis')

      username
    end

    private def generate_username
      username = Faker::Superhero.name
      arr = username.split
      arr.each_with_index do |word, idx|
        arr[idx] = word.titleize
      end

      arr.join.gsub ' ', ''
    end
  end
end