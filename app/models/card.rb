class Card < ApplicationRecord
  include Identifiable
  include Assignable
  resort!

  belongs_to :column
  has_many :boards, as: 'component'

  def user_is_assigned?(user)
    assignee_id == user.id
  end

  def siblings
    self.column.board.cards
  end
end
