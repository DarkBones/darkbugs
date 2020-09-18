module Assignable
  extend ActiveSupport::Concern
  class NotImplementedError < StandardError; end

  included do
    def user_is_assigned?(user)
      raise NotImplementedError
    end
  end
end
