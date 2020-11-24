class BoardsController < ApplicationController
  before_action :load_project!
  before_action :load_component!
  before_action :load_board!
  before_action :no_footer

  def show
    @props = Boards::BoardPresenter.new(@board, @current_user).to_h
  end

  private def load_board!
    @board = @project.boards.find_by!(slug: params[:slug])
  end

  private def load_component
    
  end

  private def load_project!
    @project = @tenant.projects.find_by!(key: params[:project_key].upcase)
  end
end
