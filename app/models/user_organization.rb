class UserOrganization < ApplicationRecord
  # -- Relationships --------------------------------------------------------
  belongs_to :user, dependent: :destroy
  belongs_to :organization, dependent: :destroy
end
