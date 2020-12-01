class BoardsController < ApplicationController
  before_action :load_project!
  before_action :load_board!
  before_action :load_props
  before_action :no_footer

  def index; end

  def show
    render :index
  end

  private def load_props
    @props = {
        board_slug: @board.slug,
        project_key: @board.root_project.key
    }
  end

  private def load_board!
    if params[:slug].nil?
      @board = @project.boards.first
    else
      @board = Board.find_by!(root_project_id: @project.id, slug: params[:slug])
    end
  end

  private def load_project!
    @project = @tenant.projects.find_by!(key: params[:project_key].upcase)
  end
end
