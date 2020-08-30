class Card < ApplicationRecord
  include Identifiable

  belongs_to :column
  has_many :boards, as: 'component'
end
