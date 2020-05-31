class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, stretches: 13

  # -- Relationships --------------------------------------------------------
  has_one :user_profile, dependent: :destroy
  accepts_nested_attributes_for :user_profile

  # -- Validations --------------------------------------------------------
  validates_presence_of :email
  validates_presence_of :password, on: create
  validates_presence_of :password_confirmation, on: create
  validates_presence_of :user_profile

  # -- Instance Methods --------------------------------------------------------
  def name
    user_profile.username
  end

  def avatar
    user_profile.avatar || 'default_profile_picture.png'
  end
end
