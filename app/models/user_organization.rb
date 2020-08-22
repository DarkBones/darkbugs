class UserOrganization < ApplicationRecord
  # -- Constants --------------------------------------------------------
  ROLES = {
    CREATOR: 0,
    ADMIN: 1,
    MEMBER: 2
  }.freeze

  # -- Relationships --------------------------------------------------------
  belongs_to :user
  belongs_to :organization

  # -- Callbacks ------------------------------------------------------------
  before_validation :create_confirmation_token, on: :create
  before_validation :set_invited_at, on: :create

  private def create_confirmation_token
    token = SecureRandom.urlsafe_base64(32, false)

    while UserOrganization.where(confirmation_token: token).exists?
      token = SecureRandom.urlsafe_base64(32, false)
    end

    self.confirmation_token = token
  end

  private def set_invited_at
    self.invited_at = Time.now
  end
end
