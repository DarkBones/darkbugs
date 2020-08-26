class ProjectsController < ApplicationController
  before_action :set_project, only: %i[new create]
  before_action :check_is_admin!, only: %i[new]

  def index; end

  def show; end

  def new; end

  def create
    @tenant.projects.create!(create_params)
    redirect_to action: :index
  rescue ActiveRecord::RecordInvalid => e
    flash.now[:error] = e.message
    render action: :new, status: :bad_request
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
