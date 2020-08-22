class Organization < ApplicationRecord
  # -- Relationships --------------------------------------------------------
  has_many :user_organizations
  has_many :users, through: :user_organizations
  accepts_nested_attributes_for :user_organizations

  attr_reader :usernames

  # -- Validations ------------------------------------------------------------
  validates_presence_of :name
  validates_uniqueness_of :name, :case_sensitive => false

  # -- Callbacks ------------------------------------------------------------
  before_validation :create_slug, on: :create
  after_create :create_tenant

  # -- Scopes --------------------------------------------------------
  scope :accepted_by_user, -> (user) {
    where(
        id: user
              .user_organizations
              .where.not(accepted_at: nil)
              .pluck(:organization_id)
      )
  }

  scope :pending_for_user, -> (user) {
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

  def ordered_users
    users.includes(:user_organizations).order('user_organizations.role')
  end

  private def create_slug
    slug = name&.parameterize
    full_slug = slug

    while Organization.where(slug: full_slug).exists?
      rand = SecureRandom.urlsafe_base64(8, false)
      full_slug = "#{slug}-#{rand}"
    end

    self.slug = full_slug
  end

  private def create_tenant
    Apartment::Tenant.create(slug)
  end
end
