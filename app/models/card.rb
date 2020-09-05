class Card < ApplicationRecord
  include Identifiable
  include Assignable

  belongs_to :column
  has_many :boards, as: 'component'

  def user_is_assigned?(user)
    assignee_id == user.id
  end
end
