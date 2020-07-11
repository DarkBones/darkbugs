class Organization < ApplicationRecord
  # -- Relationships --------------------------------------------------------
  has_many :user_organizations
  has_many :users, through: :user_organizations
  accepts_nested_attributes_for :user_organizations

  # -- Validations ------------------------------------------------------------
  validates_presence_of :name
  validates_uniqueness_of :name

  # -- Callbacks ------------------------------------------------------------
  before_validation :create_slug, on: :create

  # -- Instance Methods --------------------------------------------------------
  def user_role(user)
    UserOrganization::ROLES.key(user_organizations.find_by(user_id: user).role).downcase
  end

  def join_date(user)
    user_organizations.find_by(user: user).created_at
  end

  private def create_slug
    self.slug = name&.parameterize
  end
end
