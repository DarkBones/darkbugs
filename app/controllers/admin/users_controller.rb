module Admin
  class UsersController < Admin::BaseAdminController
    def index
      @users = User.all.order(:created_at).reverse
    end
  end
end