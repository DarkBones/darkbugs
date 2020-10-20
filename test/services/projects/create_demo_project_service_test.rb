require 'test_helper'

module Projects
  class CreateDemoProjectServiceTest < ActiveSupport::TestCase
    def test_one
      user = Users::CreateDemoUserService.new.execute

      Apartment::Tenant.create('bas')
      Apartment::Tenant.switch!('bas')

      project = Project.create!({
                                    name: 'DarkBugs',
                                    key: 'DRK',
                                    owner: organizations(:bas)
                                })

      card = project.boards.first.cards.create!({
                                                                  column: project.boards.first.columns.first,
                                                                  name: 'TEST CARD'
                                                              })

      item = card.card_items.create!({
                                  item_type: 'note',
                                  author_id: user.id,
                                  position: 1
                              })

      Note.create!({
                       card_item: item,
                       content: 'test note...........................'
                   })

      demo_project = Projects::CreateDemoProjectService.new(user).execute
    end
  end
end