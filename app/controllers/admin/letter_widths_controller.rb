module Admin
  class LetterWidthsController < Admin::BaseAdminController
    def show
      @users = User.all.order(:created_at).reverse
    end
  end
end
