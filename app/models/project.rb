class Project < ApplicationRecord
  include Identifiable

  # -- Relationships ------------------------------------------------------------
  belongs_to :owner, polymorphic: true
  has_many :boards, as: 'component'

  # -- Callbacks ------------------------------------------------------------
  before_validation :capitalize_key
  after_create :create_default_board

  # -- Validations ------------------------------------------------------------
  validates :name, presence: true
  validates :key, presence: true
  validates :name, uniqueness: { case_sensitive: false }
  validates :key, uniqueness: { case_sensitive: false }
  validates :key, format: /\A[A-Z0-9\-_]+\z/i, allow_blank: false

  private def capitalize_key
    self.key = key&.upcase
  end

  private def create_default_board
    board = boards.create!(name: I18n.t('models.project.default_board.title'))

    columns = []
    columns.push(I18n.t('models.project.default_board.columns.open'))
    columns.push(I18n.t('models.project.default_board.columns.in_progress'))
    columns.push(I18n.t('models.project.default_board.columns.done'))
    columns.push(I18n.t('models.project.default_board.columns.released'))
    columns.push(I18n.t('models.project.default_board.columns.archived'))

    columns.each_with_index do |name, idx|
      board.columns.create!(name: name, position: idx)
    end
  end
end
