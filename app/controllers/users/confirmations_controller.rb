# frozen_string_literal: true

module Users
  class ConfirmationsController < Devise::ConfirmationsController
    layout 'unauthenticated_blank'

    # GET /resource/confirmation/new
    # def new
    #   super
    # end

    # POST /resource/confirmation
    # def create
    #   super
    # end

    # GET /resource/confirmation?confirmation_token=abcdef
    # def show
    #   super
    # end

    # protected

    # The path used after resending confirmation instructions.
    def after_resending_confirmation_instructions_path_for(resource_name)
      flash.now.notice = I18n.t('controllers.users.confirmations.success')
      super(resource_name)
    end

    def after_confirmation_path_for(_resource_name, resource)
      sign_in(resource)

      # @TODO: flash[:notice] = 'Logged in successfully' (i18n)
      root_path
    end
  end
end
