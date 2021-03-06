class ProjectsController < ApplicationController
  skip_before_action :authenticate!, only: %i[show]
  before_action :set_project, only: %i[new create]
  before_action :load_project, only: %i[delete destroy show]
  before_action :check_is_admin!, only: %i[new delete destroy]

  def index; end

  def show
    redirect_to project_boards_path(project_key: @project.key)
  end

  def new; end

  def delete; end

  def destroy
    raise ActionController::BadRequest, I18n.t('controllers.projects.errors.destroy.name_mismatch') if params.dig(:project, :name) != @project.name

    @project.destroy!

    redirect_to(projects_path, { :flash => { :notice => I18n.t('controllers.projects.destroy.success', name: @project.name) } })
  rescue ActionController::BadRequest => e
    flash[:error] = e.message
    redirect_back(fallback_location: projects_path)
  end

  def create
    @tenant.projects.create!(create_params)
    redirect_to action: :index
  rescue ActiveRecord::RecordInvalid => e
    flash.now[:error] = e.message
    render action: :new, status: :bad_request
  end

  private def load_project
    key = params[:key] || params[:project_key]

    authenticate! unless @tenant.is_a? Organization

    @project = @tenant.projects.find_by!(key: key.upcase)
  end

  private def create_params
    params.fetch(:project, {}).permit(
      :name,
      :key
    )
  end

  private def set_project
    @project = @tenant.projects.new
  end

  private def check_is_admin!
    return if @tenant.is_a? User

    raise ActionController::BadRequest, I18n.t('controllers.projects.errors.unauthorized') unless @tenant.user_is_admin?(@current_user)
  rescue ActionController::BadRequest => e
    redirect_to(projects_path, { :flash => { :error => e.message } })
  end
end
