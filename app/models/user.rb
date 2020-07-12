class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, stretches: 13

  include Rails.application.routes.url_helpers
  include Identifiable

  # -- Relationships --------------------------------------------------------
  has_one :user_profile, dependent: :destroy
  has_many :user_organizations
  has_many  :organizations, through: :user_organizations
  accepts_nested_attributes_for :user_profile
  accepts_nested_attributes_for :organizations

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

  def local_date(time)
    # TODO: convert to user's timezone
    time.to_date
  end

  def local_datetime(time)
    # TODO: convert to user's timezone
    time
  end

  # -- Class Methods --------------------------------------------------------
  def self.find_by_username(username)
    UserProfile.find_by(username: username)&.user
  end
end
