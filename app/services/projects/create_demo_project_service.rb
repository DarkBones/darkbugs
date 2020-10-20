module Projects
  class CreateDemoProjectService < BaseService
    attr_reader :user, :original_project

    def initialize(user)
      @user = user

      Apartment::Tenant.switch!('bas')
      @original_project = Project.find_by!(key: 'DRK')
    end

    def execute
      
    end
  end
end