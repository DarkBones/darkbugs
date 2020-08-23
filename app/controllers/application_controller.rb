class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  protect_from_forgery prepend: true
  before_action :set_user
  after_action :clear_flash
  before_action :set_organization
  before_action :set_raven_context if Rails.env.production?

  private def set_user
    @current_user = current_user
  end

  private def clear_flash
    flash.discard if request.xhr?
  end

  private def set_organization
    if request.subdomain.present?
      Apartment::Tenant.switch!
      @current_organization = @current_user
                                .organizations
                                .accepted_by_user(@current_user)
                                .find_by!(slug: request.subdomain)
      Apartment::Tenant.switch!(@current_organization.slug)
    else
      Apartment::Tenant.switch!
      @current_organization = nil
    end
  end

  def set_raven_context
    Raven.user_context(id: @current_user&.id)
    Raven.extra_context(params: params.to_unsafe_h, url: request.url)
  end
end
