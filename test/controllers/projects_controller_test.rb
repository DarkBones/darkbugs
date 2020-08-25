require 'test_helper'

class ProjectsControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  def setup
    @user = users(:default)
    sign_in @user
  end

  def test_index
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

  def test_new
    get :new

    assert_response :success
    assert_template :new
  end

  def test_create
    post :create, params: {
      project: {
        name: 'Test Name',
        key: 'TST'
      }
    }

    project = Project.last
    assert_equal 'Test Name', project.name
    assert_equal 'TST', project.key
  end

  def test_create_fail_duplicate_name
    post :create, params: {
      project: {
        name: 'Duplicate Name',
        key: 'TST'
      }
    }

    project = Project.last

    post :create, params: {
      project: {
        name: 'duplicate name',
        key: 'tst'
      }
    }

    assert_equal project, Project.last
    assert_match 'Name has already been taken', flash[:error]
    assert_match 'Key has already been taken', flash[:error]
  end

  def test_create_fail_blank_name
    post :create, params: {
      project: {
        name: '',
        key: ''
      }
    }

    assert_match "Name can't be blank", flash[:error]
    assert_match "Key can't be blank", flash[:error]
  end

  def test_capitalize_key
    post :create, params: {
      project: {
        name: 'Test capitalization',
        key: 'tst'
      }
    }

    project = Project.last

    assert_match 'TST', project.key
  end
end
