class ApplicationController < ActionController::Base
  # before_action :authenticate_user!
  before_action :set_user
  after_action :clear_flash
  before_action :load_organization

  private def set_user
    @user = current_user
  end

  private def clear_flash
    flash.discard if request.xhr?
  end

  private def load_organization
    if request.subdomain.present?
      @org = Organization.find_by!(slug: request.subdomain)
    else
      @org = current_user
    end
  end
end
