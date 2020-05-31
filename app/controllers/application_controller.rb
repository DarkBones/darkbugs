class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :set_user

  private def set_user
    @user = current_user
  end

  private def clear_flash
    flash.discard if request.xhr?
  end
end
