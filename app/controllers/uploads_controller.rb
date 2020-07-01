class UploadsController < ApplicationController
  def create_user_avatar
    current_user.user_profile.avatar.attach(params[:file])
  end

  def delete_user_avatar
    current_user.user_profile.avatar.purge
  end
end
