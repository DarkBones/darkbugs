require 'test_helper'

class ProjectControllerTest < ActionController::TestCase
  def setup
    @user = users(:default)
    sign_in @user
  end

  def test_index
    get :index

    puts response.body.to_yaml
  end
end
