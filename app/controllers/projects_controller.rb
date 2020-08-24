class ProjectsController < ApplicationController
  def index
    @owner = @current_user
    @owner = @current_organization if @current_organization.present?

    @projects = @owner.projects
  end
end
