module Organizations
  class AddUsersService < BaseService
    attr_reader :organization, :usernames

    NOT_STARTED = 'not_started'.freeze
    USER_NOT_FOUND = 'user_not_found'.freeze
    ALREADY_PRESENT = 'already_in_organization'.freeze
    FAILED = 'failed'.freeze
    SUCCESS = 'success'.freeze

    def initialize(organization, usernames)
      @organization = organization
      @usernames = usernames.split("\r\n").uniq
    end

    def execute
      results = initialize_results
      results = process_results(results)

      success({results: results})
    end

    private def process_results(results)
      results.each do |r|
        user = User.find_by_username(r[:username])
        r[:user] = user

        if user.nil?
          r[:status] = USER_NOT_FOUND
          next
        end

        if organization.users.include? user
          r[:status] = ALREADY_PRESENT
          next
        end

        # user_organization = UserOrganization.create(
        #   user: user,
        #   organization: organization,
        #   role: UserOrganization::ROLES[:MEMBER]
        # )

        user_organization = nil

        unless user_organization.nil?
          r[:status] = FAILED
          next
        end

        r[:status] = SUCCESS
      end

      results
    end

    private def initialize_results
      usernames.map do |un|
        {
          username: un,
          user: nil,
          status: NOT_STARTED
        }
      end
    end
  end
end
