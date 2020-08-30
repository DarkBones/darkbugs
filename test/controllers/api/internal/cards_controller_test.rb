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
          column_uuid: @column.uuid,
          card: {
            name: 'New Card'
          }
        }

        card = Card.last

        assert_equal 'New Card', card.name

      end
    end
  end
end
