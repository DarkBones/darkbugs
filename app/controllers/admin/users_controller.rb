module Admin
  class UsersController < Admin::BaseAdminController
    before_action :load_user, only: %i[ show ]

    def index
      @users = User.all.order(:created_at).reverse
    end

    def show; end

    private def load_user
      @user = User.find_by!(uuid: params[:uuid])
    end
  end
end
