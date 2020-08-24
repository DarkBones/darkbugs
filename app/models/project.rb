class Project < ApplicationRecord
  include Identifiable

  belongs_to :owner, polymorphic: true
end
