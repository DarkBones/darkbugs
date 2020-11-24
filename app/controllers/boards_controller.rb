class BoardsController < ApplicationController
  before_action :load_project!
  before_action :load_board!
  before_action :no_footer

  def show
    @props = Boards::BoardPresenter.new(@board, @current_user).to_h
  end

  private def load_board!
    @board = Board.find_by!(root_project_id: @project.id, slug: params[:slug])
  end

  private def load_project!
    @project = @tenant.projects.find_by!(key: params[:project_key].upcase)
  end
end
