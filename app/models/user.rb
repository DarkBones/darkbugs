class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, stretches: 13

  include Rails.application.routes.url_helpers
  include Identifiable
  include Tenantable

  # -- Constants --------------------------------------------------------
  ALL_ROLES = [
    USER_ROLE = 0,
    ADMIN_ROLE = 1
  ].freeze

  # -- Relationships --------------------------------------------------------
  has_one :user_profile, dependent: :destroy
  has_many :user_organizations, dependent: :destroy
  has_many :organizations, through: :user_organizations
  has_many :projects, as: 'owner'
  has_many :card_items, as: 'author'
  accepts_nested_attributes_for :user_profile
  accepts_nested_attributes_for :organizations

  # -- Callbacks ------------------------------------------------------------
  before_validation :create_uuid, on: :create

  # -- Validations --------------------------------------------------------
  validates :email,                 presence: true
  validates :password,              presence: true, on: :create
  validates :password_confirmation, presence: true, on: :create
  validates :user_profile,          presence: true

  # -- Constants ---------------------------------------------------------------
  DEFAULT_PROFILE_PICTURE = 'default_profile_picture.png'.freeze

  # -- Class Methods -----------------------------------------------------------
  def self.create_demo_user
    Users::CreateDemoUserService.new.execute
  end

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

  def admin?
    role == ADMIN_ROLE
  end

  # -- Class Methods --------------------------------------------------------
  def self.find_by_username(username)
    UserProfile.find_by(username: username)&.user
  end
end
