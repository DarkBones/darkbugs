require 'test_helper'

module Api
  module Internal
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
          card: {
            name: 'New Card'
          }
        }

        card = Card.last

        assert_equal 'New Card', card.name
        assert_not_nil card.uuid
        assert_equal @column, card.column

        puts response.body
      end
    end
  end
end
