require 'test_helper'

class ProjectsControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  def setup
    @user = users(:default)
    sign_in @user
  end

  def test_index_user
    get :index

    names = ['default', 'user', 'user_second']

    assert_select "ul#project_list" do |elements|
      elements.each do |element|
        assert_select element, "li" do |lis|
          lis.each_with_index do |li, idx|
            assert_includes li.text, names[idx]
          end
        end
      end
    end
  end
end
