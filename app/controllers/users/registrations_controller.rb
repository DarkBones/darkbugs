# frozen_string_literal: true

module Users
  class RegistrationsController < Devise::RegistrationsController
    layout 'unauthenticated_blank', only: [:new, :create]
    before_action :configure_sign_up_params

    UPDATE_PASSWORD_COMMIT = 'update-password'.freeze

    # GET /resource/sign_up
    # def new
    #   super
    # end

    # POST /resource
    # def create
    #   super
    # end

    # GET /resource/edit
    # def edit
    #   super
    # end

    # PUT /resource
    # def update
    #   super
    # end

    # DELETE /resource
    # def destroy
    #   super
    # end

    # GET /resource/cancel
    # Forces the session data which is usually expired after sign
    # in to be expired now. This is useful if the user wants to
    # cancel oauth signing in/up in the middle of the process,
    # removing all OAuth session data.
    # def cancel
    #   super
    # end

    # protected

    private def update_resource(resource, resource_params)
      if params[UPDATE_PASSWORD_COMMIT].present?
        super
      else
        resource.update_attributes!(resource_params)
      end
    rescue ActiveRecord::RecordInvalid => e
      flash.now.alert = e.message
    end

    # If you have extra params to permit, append them to the sanitizer.
    private def configure_sign_up_params
      devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :password_confirmation, user_profile_attributes: [:username]])
      devise_parameter_sanitizer.permit(:account_update, keys: [:email, :password, :password_confirmation, user_profile_attributes: [:username, :first_name, :last_name, :bio, :id]])
    end

    # If you have extra params to permit, append them to the sanitizer.
    # def configure_account_update_params
    #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
    # end

    # The path used after sign up.
    # def after_sign_up_path_for(resource)
    #   super(resource)
    # end

    # The path used after sign up for inactive accounts.
    # def after_inactive_sign_up_path_for(resource)
    #   super(resource)
    # end
  end
end
