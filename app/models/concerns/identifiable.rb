module Identifiable
  extend ActiveSupport::Concern

  included do
    def self.identify(uuid)
      self.find_by!(uuid: uuid)
    end
  end
end
