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

        if user.nil?
          r[:status] = USER_NOT_FOUND
          next
        end

        if organization.users.include? user
          r[:status] = ALREADY_PRESENT
          next
        end

        user_organization = UserOrganization.create(
          user: user,
          organization: organization,
          role: UserOrganization::ROLES[:MEMBER]
        )

        if user_organization.nil?
          r[:status] = FAILED
        else
          r[:status] = SUCCESS
        end
      end

      results
    end

    private def initialize_results
      usernames.map do |un|
        {
          username: un,
          status: NOT_STARTED
        }
      end
    end
  end
end
