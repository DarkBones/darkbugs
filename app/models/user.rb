class User < ApplicationRecord
  attr_writer :login

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
  before_create :create_user_profile

  # -- Validations --------------------------------------------------------
  validates :email,                 presence: true
  validates :password,              presence: true, on: :create
  validates :password_confirmation, presence: true, on: :create
  validates :username,              presence: true
  validates :username,              format: /\A[a-z0-9\-_]+\z/i, allow_blank: true
  validates_uniqueness_of :username, case_sensitive: false

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
  def login
    @login || self.username || self.email
  end

  def name
    username
  end

  def full_name
    "#{user_profile.first_name} #{user_profile.last_name}"
  end

  def role_name
    return 'Demo' if demo_user

    role == ADMIN_ROLE ? 'Admin' : 'User'
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
  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    if login = conditions.delete(:login)
      where(conditions.to_h).where(['lower(username) = :value OR lower(email) = :value', { :value => login.downcase }]).first
    elsif conditions.has_key?(:username) || conditions.has_key?(:email)
      where(conditions.to_h).first
    end
  end

  private def demo_avatar_path
    avatars = Dir.glob(DEMO_AVATARS_PATH)

    idx = id % avatars.count

    path = avatars[idx].split('/')
    path[(path.length - 2)..(path.length - 1)].join('/')
  end

  private def create_user_profile
    build_user_profile if user_profile.nil?
  end
end
