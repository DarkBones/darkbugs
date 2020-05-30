class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :set_user

  private def set_user
    @user = current_user
  end
end
