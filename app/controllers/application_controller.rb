class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  protect_from_forgery prepend: true
  before_action :set_user
  after_action :clear_flash
  before_action :set_tenant
  before_action :set_projects
  before_action :set_raven_context if Rails.env.production?

  private def set_user
    @current_user = current_user
  end

  private def clear_flash
    flash.discard if request.xhr?
  end

  private def set_tenant
    Apartment::Tenant.switch!
    return if @current_user.nil?

    @tenant = @current_user

    if valid_subdomain?(request.subdomain) && @current_user.present?
      @current_organization = @current_user
                                .organizations
                                .accepted_by_user(@current_user)
                                .find_by!(slug: request.subdomain)
      @tenant = @current_organization
    else
      redirect_to root_url(subdomain: '') if request.subdomain.present?
      @current_organization = nil
    end

    Apartment::Tenant.switch!(@tenant.tenant_key)
  end

  def set_raven_context
    return unless defined? Raven

    Raven.user_context(id: @current_user&.id)
    Raven.extra_context(params: params.to_unsafe_h, url: request.url)
  end

  private def valid_subdomain?(subdomain)
    subdomain.present? && Organization::RESERVED_NAMES.exclude?(subdomain.downcase)
  end

  private def set_projects
    @projects = @tenant&.projects&.where.not(id: nil)
  end
end
