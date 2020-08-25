class ProjectsController < ApplicationController
  before_action :load_owner
  before_action :set_project, only: %i[new create]
  before_action :check_is_admin!, only: %i[new]

  def index
    @projects = @owner.projects
  end

  def new; end

  def create
    @owner.projects.create!(create_params)
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

  private def load_owner
    @owner = @current_user
    @owner = @current_organization if @current_organization.present?
  end

  private def set_project
    @project = @owner.projects.new
  end

  private def check_is_admin!
    return if @owner.is_a? User

    raise ActionController::BadRequest, I18n.t('controllers.projects.errors.unauthorized') unless @owner.user_is_admin?(@current_user)
  rescue ActionController::BadRequest => e
    redirect_to(projects_path, { :flash => { :error => e.message } })
  end
end
