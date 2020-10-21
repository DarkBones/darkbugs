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

  DEFAULT_PROFILE_PICTURE = 'default_profile_picture.png'.freeze
  DEMO_AVATARS_PATH = "#{Rails.root}/app/assets/images/demo_avatars/*".freeze

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

  # -- Scopes ------------------------------------------------------------------
  scope :real, -> {
    where(demo_user: false)
  }

  scope :demo, -> {
    where(demo_user: true)
  }

  scope :demo_expired, -> {
    where('demo_user = true AND created_at < ?', 7.days.ago)
  }

  # -- Class Methods -----------------------------------------------------------
  def self.create_demo_user
    Users::CreateDemoUserService.new.execute
  end

  # -- Instance Methods --------------------------------------------------------
  def name
    user_profile.username
  end

  def avatar
    return user_profile.avatar if user_profile.avatar && user_profile.avatar.attached?

    return DEFAULT_PROFILE_PICTURE unless demo_user

    demo_avatar_path
  end

  def avatar_path
    if user_profile.avatar.attached?
      rails_blob_path(user_profile.avatar, disposition: 'attachment', only_path: true)
    else
      avatar_placeholder_path
    end
  end

  def avatar_placeholder_path
    path = DEFAULT_PROFILE_PICTURE

    if demo_user
      path = demo_avatar_path
    end

    ActionController::Base.helpers.asset_path(path)
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

  private def demo_avatar_path
    avatars = Dir.glob(DEMO_AVATARS_PATH)

    idx = id % avatars.count

    path = avatars[idx].split('/')
    path[(path.length - 2)..(path.length - 1)].join('/')
  end
end
