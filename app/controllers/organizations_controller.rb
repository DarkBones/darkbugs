class OrganizationsController < ApplicationController
  before_action :build_organization, only: %i[new create]
  before_action :load_organization, only: %i[show add_members create_members]

  def index
    @organizations = @user.organizations.order(:slug)
  end

  def create
    Organization.create!(create_params)
    redirect_to action: :index
  rescue ActiveRecord::RecordInvalid => e
    flash.now[:error] = e.message
    render action: :new, status: :bad_request
  end

  def new; end

  def show; end

  def add_members; end

  def create_members
    raise ArgumentError, I18n.t('controllers.organizations.create_members.no_usernames') unless add_members_params[:usernames].present?

    @results = Organizations::AddUsersService.new(@organization, add_members_params[:usernames]).execute

    render action: :add_members_results
  rescue ArgumentError => e
    flash.now[:error] = e.message
    render action: :invite_members, status: :bad_request
  end

  private def build_organization
    @organization = Organization.new(create_params)
    @organization.validate if params[:organization].present?
  end

  private def load_organization
    slug = params[:slug] || params[:organization_slug]
    @organization = @user.organizations.find_by!(slug: slug)
  end

  private def create_params
    params.fetch(:organization, {}).permit(
      :name
    ).merge(user_organizations_attributes: [{
                                              role: UserOrganization::ROLES[:CREATOR],
                                              user: @user
                                            }])
  end

  private def add_members_params
    params.fetch(:organization, {}).permit(:usernames)
  end
end
