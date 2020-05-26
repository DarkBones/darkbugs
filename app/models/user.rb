class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, stretches: 13

  # -- Relationships --------------------------------------------------------

  has_one :user_profile, dependent: :destroy
  accepts_nested_attributes_for :user_profile

  # -- Validations --------------------------------------------------------

  validates_presence_of :email
  validates_presence_of :password
  validates_presence_of :password_confirmation
end
