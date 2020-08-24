class ProjectsController < ApplicationController
  before_action :load_owner
  before_action :set_project, only: %i[new]
  before_action :check_is_admin!, only: %i[new]

  def index
    @projects = @owner.projects
  end

  def new; end

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
