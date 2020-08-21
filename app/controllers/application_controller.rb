class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  protect_from_forgery prepend: true
  before_action :set_user
  after_action :clear_flash
  before_action :set_organization

  private def set_user
    @current_user = current_user
  end

  private def clear_flash
    flash.discard if request.xhr?
  end

  private def set_organization
    if request.subdomain.present?
      Apartment::Tenant.switch!(request.subdomain)
      @current_organization = Organization.find_by!(slug: request.subdomain)
    else
      Apartment::Tenant.switch!
      @current_organization = nil
    end
  end
end
