module Api
  module Internal
    class UserAvatarsController < Api::Internal::BaseApiInternalController
      def create
        @current_user.user_profile.avatar.attach(params[:file])
      end

      def destroy
        @current_user.user_profile.avatar.purge
      end
    end
  end
end