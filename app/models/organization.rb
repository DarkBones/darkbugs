class Organization < ApplicationRecord
  # -- Validations ------------------------------------------------------------
  validates_presence_of :name
  validates_uniqueness_of :name

  # -- Callbacks ------------------------------------------------------------
  before_validation :create_slug

  def create_slug
    self.slug = name&.parameterize
  end
end
