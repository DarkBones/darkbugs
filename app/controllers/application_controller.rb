class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  protect_from_forgery prepend: true
  before_action :set_user
  after_action :clear_flash
  before_action :set_tenant
  before_action :set_projects
  before_action :set_organizations
  before_action :set_raven_context
  before_action :switch_to_public

  private def set_user
    @current_user = current_user
  end

  private def clear_flash
    flash.discard if request.xhr?
  end

  private def set_tenant
    Apartment::Tenant.switch!

    @tenant = @current_user

    if valid_subdomain?(request.subdomain)
      @current_organization = Organization
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
    return unless Rails.env.production?
    return unless defined? Raven

    Raven.user_context(id: @current_user&.id)
    Raven.extra_context(params: params.to_unsafe_h, url: request.url)
  end

  private def switch_to_public
    # TODO: Unhack this
    Apartment::Tenant.switch! if Rails.env.test?
  end

  private def valid_subdomain?(subdomain)
    subdomain.present? && Organization::RESERVED_NAMES.exclude?(subdomain.downcase)
  end

  private def set_projects
    @projects = nil
    return if @tenant.nil?

    @projects = @tenant.projects.where.not(id: nil)
  end

  private def set_organizations
    @organizations = nil
    return if @current_user.nil?

    @organizations = @current_user.organizations
                       .accepted_by_user(@current_user)
                       .order(:slug)
  end
end
