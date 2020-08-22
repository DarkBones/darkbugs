class UserProfile < ApplicationRecord
  # -- Relationships --------------------------------------------------------
  belongs_to :user
  has_one_attached :avatar

  # -- Validations --------------------------------------------------------
  validates :username, presence: true
  validates :username, format: /\A[a-z0-9\-_]+\z/i, allow_blank: true
  validates :username, uniqueness: { case_sensitive: false }
end
