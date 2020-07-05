class OrganizationsController < ApplicationController
  respond_to :html
  before_action :build_organization, only: %i[new create]

  def index; end

  def create
    @user.organizations.create!(create_or_update_params)
  rescue ActiveRecord::RecordInvalid => e
    flash.now[:error] = e.message
    render action: :new
  end

  def new; end

  private def build_organization
    @organization = Organization.new(create_or_update_params)
    @organization.validate if params[:organization].present?
  end

  private def create_or_update_params
    params.fetch(:organization, {}).permit(
      :name
    )
  end
end
