class Note < ApplicationRecord
  # -- Relationships --------------------------------------------------------
  belongs_to :card_item
end
