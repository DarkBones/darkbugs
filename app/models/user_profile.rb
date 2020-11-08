class UserProfile < ApplicationRecord
  # -- Relationships --------------------------------------------------------
  belongs_to :user
  has_one_attached :avatar
end
