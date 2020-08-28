class Board < ApplicationRecord
  has_many :columns
  belongs_to :component, polymorphic: true
end
