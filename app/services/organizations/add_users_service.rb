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

      success({ results: results })
    end

    private def process_results(results)
      results.each do |r|
        r[:user] = User.real.find_by_username(r[:username])

        r[:status] = status(r[:user])
        next if r[:status] != NOT_STARTED

        user_organization = create_user_organization(r[:user])

        if user_organization.nil?
          r[:status] = FAILED
          next
        end

        r[:status] = SUCCESS
        r[:token] = user_organization.confirmation_token
      end

      results
    end

    private def status(user)
      return USER_NOT_FOUND if user.nil?

      return ALREADY_PRESENT if organization.users.include? user

      NOT_STARTED
    end

    private def create_user_organization(user)
      UserOrganization.create(
        user: user,
        organization: organization,
        role: UserOrganization::ROLES[:MEMBER]
      )
    end

    private def initialize_results
      usernames.map do |un|
        {
          username: un,
          user: nil,
          status: NOT_STARTED,
          token: nil
        }
      end
    end
  end
end
