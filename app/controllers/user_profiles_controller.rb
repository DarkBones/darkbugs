class UserProfilesController < ApplicationController
  skip_before_action :authenticate!

  def show
    @user = User.find_by(username: params[:username])
  end
end
