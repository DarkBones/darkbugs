class Card < ApplicationRecord
  include Identifiable
  include Assignable
  resort!

  belongs_to :column
  has_many :boards, as: 'component'
  has_one :reporter, class_name: :User, foreign_key: :reporter_id
  has_one :assignee, class_name: :User, foreign_key: :assignee_id

  def user_is_assigned?(user)
    assignee_id == user.id
  end

  def siblings
    self.column.board.cards
  end
end
