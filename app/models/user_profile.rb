class UserProfile < ApplicationRecord
  # -- Relationships --------------------------------------------------------
  belongs_to :user

  # -- Validations --------------------------------------------------------
  validates_presence_of :username
  validates_format_of :username, :with => /\A[a-z0-9-_]+\z/i
  validates_uniqueness_of :username, :case_sensitive => false
end
