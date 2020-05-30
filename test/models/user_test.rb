require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def test_create
    user = User.create({
      user_profile_attributes: {
        username: 'testusername'
      },
        email: 'test@test.test',
        password: '@&h8jTJ9DbGLg,X_',
        password_confirmation: '@&h8jTJ9DbGLg,X_'
      })

    assert user.persisted?
    assert user.user_profile.persisted?
  end

  def test_create_invalid_missing_profile
    user = User.create({
        email: 'test@test.test',
        password: '@&h8jTJ9DbGLg,X_',
        password_confirmation: '@&h8jTJ9DbGLg,X_'
      })

    assert_not user.persisted?
    assert user.user_profile.nil?
  end

  def test_create_username_blank
    user = User.create({
      user_profile_attributes: {
        username: ''
      },
        email: 'test@test.test',
        password: '@&h8jTJ9DbGLg,X_',
        password_confirmation: '@&h8jTJ9DbGLg,X_'
      })

    assert_not user.persisted?
    assert_not user.user_profile.persisted?
    assert_equal 1, user.errors.full_messages.count
    assert_not_includes user.errors.full_messages, "Username #{I18n.t('activerecord.errors.models.user_profile.attributes.username.invalid')}"
    assert_includes user.errors.full_messages, "Username #{I18n.t('activerecord.errors.models.user_profile.attributes.username.blank')}"
  end

  def test_create_username_valid
    usernames = ['username', 'user-name', 'user_name', 'UserName1', '__-U5er-_-N4mE--', '--_-_-_---']
    usernames.each_with_index do |username, i|
      user = User.create({
        user_profile_attributes: {
          username: username
        },
          email: "#{username}@test#{i}.test",
          password: '@&h8jTJ9DbGLg,X_',
          password_confirmation: '@&h8jTJ9DbGLg,X_'
        })

      assert user.persisted?
      assert user.user_profile.persisted?
    end
  end

  def test_create_username_invalid
    usernames = ['user name', 'u*ername', 'us/ername', '(#*#$']
    usernames.each_with_index do |username, i|
      user = User.create({
        user_profile_attributes: {
          username: username
        },
          email: "#{username}@test#{i}.test",
          password: '@&h8jTJ9DbGLg,X_',
          password_confirmation: '@&h8jTJ9DbGLg,X_'
        })

      assert_not user.persisted?
      assert_not user.user_profile.persisted?
      assert_includes user.errors.full_messages, "Username #{I18n.t('activerecord.errors.models.user_profile.attributes.username.invalid')}"
    end
  end
end
