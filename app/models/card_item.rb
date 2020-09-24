class CardItem < ApplicationRecord
  include Identifiable
  include Orderable

  belongs_to :card
end
