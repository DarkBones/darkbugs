class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :validatable,
  :confirmable, :lockable, stretches: 13

  include Rails.application.routes.url_helpers

  # -- Relationships --------------------------------------------------------
  has_one :user_profile, dependent: :destroy
  accepts_nested_attributes_for :user_profile

  # -- Validations --------------------------------------------------------
  validates_presence_of :email
  validates_presence_of :password, on: create
  validates_presence_of :password_confirmation, on: create
  validates_presence_of :user_profile

  # -- Constants ---------------------------------------------------------------
  DEFAULT_PROFILE_PICTURE = 'default_profile_picture.png'.freeze

  # -- Instance Methods --------------------------------------------------------
  def name
    user_profile.username
  end

  def avatar
    return DEFAULT_PROFILE_PICTURE unless user_profile.avatar.attached?

    user_profile.avatar || DEFAULT_PROFILE_PICTURE
  end

  def avatar_path
    if user_profile.avatar.attached?
      rails_blob_path(user_profile.avatar, disposition: 'attachment', only_path: true)
    else
      avatar_placeholder_path
    end
  end

  def avatar_placeholder_path
    ActionController::Base.helpers.asset_path(DEFAULT_PROFILE_PICTURE)
  end
end
