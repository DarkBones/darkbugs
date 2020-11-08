# frozen_string_literal: true

module Users
  class SessionsController < Devise::SessionsController
    layout 'unauthenticated_blank'
    before_action :configure_sign_in_params, only: [:create]

    # GET /resource/sign_in
    # def new
    #   super
    # end

    # POST /resource/sign_in
    # def create
    #   super
    # end

    # DELETE /resource/sign_out
    # def destroy
    #   super
    # end

    # protected

    protected def configure_sign_in_params
      devise_parameter_sanitizer.permit(:sign_in, keys: [:login, :password, :remember_me])
    end
  end
end
