class ProjectsController < ApplicationController
  before_action :load_owner
  before_action :set_project, only: %i[new]

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
end
