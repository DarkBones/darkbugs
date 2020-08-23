module Identifiable
  extend ActiveSupport::Concern

  included do
    def self.identify(uuid)
      find_by!(uuid: uuid)
    end
  end
end
