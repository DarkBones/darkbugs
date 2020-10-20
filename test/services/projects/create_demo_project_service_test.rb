require 'test_helper'

module Projects
  class CreateDemoProjectServiceTest < ActiveSupport::TestCase
    def test_one
      user = Users::CreateDemoUserService.new.execute

      Apartment::Tenant.create(user.tenant_key)
      Apartment::Tenant.create('bas')
      Apartment::Tenant.switch!('bas')

      Project.create!({
                          name: 'DarkBugs',
                          key: 'DRK',
                          owner: user
                      })

      demo_project = Projects::CreateDemoProjectService.new(user).execute
    end
  end
end