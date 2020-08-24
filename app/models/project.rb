class Project < ApplicationRecord
  belongs_to :owner, polymorphic: true
end
