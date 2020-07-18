class ApplicationController < ActionController::Base
  before_action :authenticate_user!
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
      puts request.subdomain
      puts request.subdomain
      puts request.subdomain
      puts request.subdomain
      Apartment::Tenant.switch!(request.subdomain)
    else
      Apartment::Tenant.switch!
    end
  end
end
