class Organization < ApplicationRecord
  # -- Relationships --------------------------------------------------------
  has_many :user_organizations
  has_many :users, through: :user_organizations

  # -- Validations ------------------------------------------------------------
  validates_presence_of :name
  validates_uniqueness_of :name

  # -- Callbacks ------------------------------------------------------------
  before_validation :create_slug, on: :create

  def create_slug
    self.slug = name&.parameterize
  end
end
