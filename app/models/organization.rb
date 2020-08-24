class Organization < ApplicationRecord
  include Tenantable

  # -- Constants --------------------------------------------------------
  RESERVED_NAMES = ['www'].freeze

  # -- Callbacks ------------------------------------------------------------
  before_validation :create_slug, on: :create

  # -- Relationships --------------------------------------------------------
  has_many :user_organizations, dependent: :destroy
  has_many :users, through: :user_organizations
  has_many :projects
  accepts_nested_attributes_for :user_organizations

  attr_reader :usernames

  # -- Validations ------------------------------------------------------------
  validates :name, presence: true
  validates :name, uniqueness: { case_sensitive: false }
  validate :name_not_reserved

  # -- Scopes --------------------------------------------------------
  scope :accepted_by_user, ->(user) {
    where(
      id: user
        .user_organizations
        .where.not(accepted_at: nil)
        .pluck(:organization_id)
      )
  }

  scope :pending_for_user, ->(user) {
    where(
      id: user
        .user_organizations
        .where(accepted_at: nil)
        .pluck(:organization_id)
      )
  }

  # -- Instance Methods --------------------------------------------------------
  def user_role(user)
    UserOrganization::ROLES.key(user_organizations.find_by(user_id: user).role).downcase
  end

  def token_for_user(user)
    user_organizations.find_by(user: user).confirmation_token
  end

  def join_date(user)
    user_organizations.find_by(user: user).updated_at
  end

  def user_is_admin?(user)
    [UserOrganization::ROLES[:CREATOR], UserOrganization::ROLES[:ADMIN]]
      .include?(
        user_organizations.find_by(user_id: user).role
      )
  end

  def user_accepted?(user)
    user_organizations.find_by(user_id: user).accepted_at.present?
  end

  def admins
    users
      .includes(:user_organizations)
      .where('user_organizations.role in (?) and user_organizations.accepted_at is not null',
             [
               UserOrganization::ROLES[:CREATOR],
               UserOrganization::ROLES[:ADMIN]
             ]
      )
  end

  def accepted_users
    ordered_users(
      users
        .includes(:user_organizations)
        .where('user_organizations.accepted_at is not null'
        )
    )
  end

  def pending_users
    ordered_users(
      users
        .includes(:user_organizations)
        .where('user_organizations.accepted_at is null'
      )
    )
  end

  def tenant_key
    slug
  end

  def ordered_users(users)
    users.includes(:user_organizations).order('user_organizations.role')
  end

  private def create_slug
    slug = name&.parameterize
    full_slug = slug

    while Organization.exists?(slug: full_slug)
      rand = SecureRandom.urlsafe_base64(8, false)
      full_slug = "#{slug}-#{rand}"
    end

    self.slug = full_slug
  end

  private def name_not_reserved
    errors.add(:name, I18n.t('activerecord.errors.models.organization.attributes.name.reserved')) if RESERVED_NAMES.include? name&.downcase
  end
end
