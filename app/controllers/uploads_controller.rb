class UploadsController < ApplicationController
  def create_user_avatar
    current_user.user_profile.avatar.attach(params[:file])
  end
end
