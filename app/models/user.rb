class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, stretches: 13

  # -- Relationships --------------------------------------------------------

  has_one :user_profile, dependent: :destroy
end
