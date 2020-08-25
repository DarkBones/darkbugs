module Identifiable
  extend ActiveSupport::Concern

  included do
    before_validation :create_uuid, on: :create

    def self.identify(uuid)
      find_by!(uuid: uuid)
    end

    private def create_uuid
      uuid = SecureRandom.urlsafe_base64(8, false)

      uuid = SecureRandom.urlsafe_base64(8, false) while self.class.exists?(uuid: uuid)

      self.uuid = uuid
    end
  end
end
