class Tenant < ApplicationRecord
  belongs_to :model, polymorphic: true
end
