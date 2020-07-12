class UserOrganization < ApplicationRecord
  # -- Constants --------------------------------------------------------
  ROLES = {
    CREATOR: 0,
    ADMIN: 1,
    MEMBER: 2
  }.freeze

  # -- Relationships --------------------------------------------------------
  belongs_to :user, dependent: :destroy
  belongs_to :organization, dependent: :destroy
end
