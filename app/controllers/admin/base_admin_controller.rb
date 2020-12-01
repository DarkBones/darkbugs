module Admin
  class BaseAdminController < ApplicationController
    before_action :check_user_is_admin!

    private def check_user_is_admin!
      return if @current_user.admin?

      raise ActionController::BadRequest, I18n.t('controllers.admin.errors.unauthorized')
    rescue ActionController::BadRequest => e
      flash[:error] = e.message
      redirect_back(fallback_location: root_path)
    end
  end
end
