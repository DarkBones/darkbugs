class Tenant < ApplicationRecord
  # -- Relationships --------------------------------------------------------
  belongs_to :model, polymorphic: true
end
