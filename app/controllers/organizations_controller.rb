class OrganizationsController < ApplicationController
  before_action :build_organization, only: %i[new create]
  before_action :load_organization, only: :show

  def index
    @organizations = @user.organizations.order(:slug)
  end

  def create
    Organization.create!(create_params)
    redirect_to action: :index
  rescue ActiveRecord::RecordInvalid => e
    flash.now[:error] = e.message
    render action: :new
  end

  def new; end

  def show; end

  private def build_organization
    @organization = Organization.new(create_params)
    @organization.validate if params[:organization].present?
  end

  private def load_organization
    @organization = @user.organizations.find_by!(slug: params[:slug])
  end

  private def create_params
    params.fetch(:organization, {}).permit(
      :name
    ).merge(user_organizations_attributes: [{
                                              role: UserOrganization::ROLES[:CREATOR],
                                              user: @user
                                            }])
  end
end
