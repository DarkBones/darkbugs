module Slugable
  extend ActiveSupport::Concern

  included do
    before_validation :create_slug, on: :create

    private def slug_key
      name
    end

    private def create_slug
      slug = slug_key&.parameterize
      full_slug = slug

      while self.class.exists?(slug: full_slug)
        rand = SecureRandom.urlsafe_base64(8, false)
        full_slug = "#{slug}-#{rand}"
      end

      self.slug = full_slug
    end
  end
end
