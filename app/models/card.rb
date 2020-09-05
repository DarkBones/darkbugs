class Card < ApplicationRecord
  include Identifiable

  belongs_to :column
  has_many :boards, as: 'component'

  def owner
    assignee
  end
end
