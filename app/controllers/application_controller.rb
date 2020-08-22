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
    Apartment::Tenant.switch!
    if request.subdomain.present? && @current_user.present?
      @current_organization = @current_user
                                .organizations
                                .accepted_by_user(@current_user)
                                .find_by!(slug: request.subdomain)
      Apartment::Tenant.switch!(@current_organization.slug)
    else
      redirect_to root_url(subdomain: '') if request.subdomain.present?
      @current_organization = nil
    end
  end
end
