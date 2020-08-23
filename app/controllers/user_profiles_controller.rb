class UserProfilesController < ApplicationController
  skip_before_action :authenticate_user!

  def show
    @user = User.find_by_username(params[:username])
  end
end
