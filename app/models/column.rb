class Column < ApplicationRecord
  include Identifiable

  belongs_to :board

  validates :name, presence: true
  validates :position, presence: true, on: :create
end
