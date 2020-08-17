class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  protect_from_forgery prepend: true
  skip_before_action :verify_authenticity_token
  before_action :set_user
  after_action :clear_flash
  before_action :set_tenant

  private def set_user
    @current_user = current_user
  end

  private def clear_flash
    flash.discard if request.xhr?
  end

  private def set_tenant
    if request.subdomain.present?
      Apartment::Tenant.switch!(request.subdomain)
    else
      Apartment::Tenant.switch!
    end
  end
end
