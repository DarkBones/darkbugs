class Board < ApplicationRecord
  include Slugable

  has_many :columns
  belongs_to :component, polymorphic: true

end
