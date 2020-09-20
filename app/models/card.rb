class Card < ApplicationRecord
  include Assignable
  include Identifiable
  include Orderable

  belongs_to :column
  belongs_to :board
  acts_as_list scope: :board
  has_many :boards, as: 'component'
  has_one :reporter, class_name: :User, foreign_key: :reporter_id
  has_one :assignee, class_name: :User, foreign_key: :assignee_id

  before_create :set_card_id

  def user_is_assigned?(user)
    assignee_id == user.id
  end

  def siblings
    self.column.board.cards
  end

  def card_number
    "#{board.root_project.key}-#{card_id}"
  end

  private def set_card_id
    project = board.root_project
    card_id = project.card_count + 1
    self.card_id = card_id

    Project.transaction do
      project.update!(card_count: card_id)
    end
  end
end
