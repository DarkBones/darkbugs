class Tenant < ApplicationRecord
  belongs_to :model, polymorphic: true, optional: true
end
