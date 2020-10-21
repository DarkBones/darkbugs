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
                       content: 'test note'
                   })

      demo_project = Projects::CreateDemoProjectService.new(user).execute

      assert_equal ['TEST CARD'], demo_project.boards.first.columns.first.cards.pluck(:name)
      assert_equal 'test note', demo_project.boards.first.columns.first.cards.first.card_items.first.item.content
    end

    def test_column_changes
      models = %w[
        project
        board
        column
        card
        card_item
      ] + CardItem::ITEM_TYPES

      expected_hashes = %w[
        8598d6b03b501dde0e1e272882a310ca
        1320b486b717b37b4711c7f49ece6ade
        5c0f4b8613316f3a22fb13d9a19eb007
        5b0f7a86d3addb7395958cf0f58bf78b
        9deacf6a187dfec618af717bf29bde28
        ad468ddda883419a9edbde9cbd733222
      ]

      assert_equal models.count, expected_hashes.count

      models.each_with_index do |model, idx|
        expected = expected_hashes[idx]

        assert_columns(model.classify.constantize, expected)
      end
    end

    private def assert_columns(model, expected_hash)
      hash = Digest::MD5.hexdigest model.column_names.to_s

      message = "Column changes detected in model '#{model}' that may need to be supported in create_demo_project_service"
      message += "\nexpected hash:\t#{expected_hash}"
      message += "\nactual hash:\t#{hash}"


      assert(expected_hash == hash, msg = message)
    end
  end
end