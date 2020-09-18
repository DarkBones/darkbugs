module Orderable
  extend ActiveSupport::Concern

  included do
    scope :ordered, -> { order(:position) }
  end
end
