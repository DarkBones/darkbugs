class Project < ApplicationRecord
  include Identifiable

  # -- Relationships ------------------------------------------------------------
  belongs_to :owner, polymorphic: true
  has_many :boards, as: 'component'

  # -- Callbacks ------------------------------------------------------------
  before_validation :capitalize_key

  # -- Validations ------------------------------------------------------------
  validates :name, presence: true
  validates :key, presence: true
  validates :name, uniqueness: { case_sensitive: false }
  validates :key, uniqueness: { case_sensitive: false }
  validates :key, format: /\A[A-Z0-9\-_]+\z/i, allow_blank: false

  private def capitalize_key
    self.key = key&.upcase
  end
end
