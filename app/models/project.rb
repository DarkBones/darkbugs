class Project < ApplicationRecord
  include Identifiable
  include Assignable

  # -- Relationships --------------------------------------------------------
  belongs_to :owner, polymorphic: true
  has_many :boards, as: 'component', dependent: :destroy
  has_many :cards, through: :boards, dependent: :destroy

  # -- Callbacks ------------------------------------------------------------
  before_validation :capitalize_key
  after_create :create_default_board

  # -- Validations ----------------------------------------------------------
  validates :name, presence: true
  validates :key, presence: true
  validates :name, uniqueness: { case_sensitive: false }
  validates :key, uniqueness: { case_sensitive: false }
  validates :key, format: /\A[A-Z0-9\-_]+\z/i, allow_blank: false

  # -- Instance Methods -----------------------------------------------------
  def user_is_assigned?(user)
    return owner == user if owner.is_a? User

    owner.user_is_admin?(user)
  end

  # -- Private Methods ------------------------------------------------------
  private def capitalize_key
    self.key = key&.upcase
  end

  private def create_default_board
    Boards::CreateService.new(self).execute
  end
end
