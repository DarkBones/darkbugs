class Card < ApplicationRecord
  belongs_to :column
  has_many :boards, as: 'component'
end
