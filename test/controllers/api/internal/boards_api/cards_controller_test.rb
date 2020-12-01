require 'test_helper'

module Api
  module Internal
    module BoardsApi
      class CardsControllerTest < ActionController::TestCase
        include Devise::Test::ControllerHelpers

        def setup
          @user = users(:default)
          @board = boards(:default)
          @column = @board.columns.order(:position).first
          login_user(@user)
        end

        def test_create
          post :create, params: {
              api_version: Api::VERSION,
              column_uuid: @column.uuid,
              column_index: 0,
              card: {
                  name: 'New Card'
              }
          }

          card = Card.last

          assert_equal 'New Card', card.name
          assert_not_nil card.uuid
          assert_equal @column, card.column
        end

        def test_read_boards
          card = cards(:default)

          get :show, params: {
              api_version: Api::VERSION,
              uuid: card.uuid
          }

          expected = {
              'card-board' => {
                  'name' => 'card board',
                  'path' => '/projects/DFLT/boards/card-board'
              },
              'card-board-two' => {
                  'name' => 'card board two',
                  'path' => '/projects/DFLT/boards/card-board-two'
              }
          }

          data = JSON.parse(response.body)
          assert_equal expected, data['data']['boards']
        end

        def test_create_board
          card = cards(:default)

          post :create_board, params: {
              api_version: Api::VERSION,
              card_uuid: card.uuid,
              board: {
                  name: 'Test Create Board'
              }
          }

          assert_equal '{"name":"Test Create Board","slug":"dflt-1-test-create-board"}', response.body
        end
      end
    end
  end
end
