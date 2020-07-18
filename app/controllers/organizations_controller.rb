class OrganizationsController < ApplicationController
  before_action :switch_to_public
  before_action :build_organization, only: %i[new create]
  before_action :load_organization, only: %i[show add_members create_members grant_admin revoke_admin]
  before_action :load_user, only: %i[grant_admin revoke_admin]
  before_action :load_user_organization, only: %i[grant_admin revoke_admin]

  def index
    @organizations = @current_user.organizations.order(:slug)
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
    raise ActionController::BadRequest, I18n.t('controllers.organizations.create_members.unauthorized') unless @organization.user_is_admin?(@current_user)
    raise ArgumentError, I18n.t('controllers.organizations.create_members.no_usernames') unless add_members_params[:usernames].present?

    @results = Organizations::AddUsersService.new(@organization, add_members_params[:usernames]).execute

    successful_users = @results[:results]
                             .reject { |v| v[:status] != Organizations::AddUsersService::SUCCESS }
                             .map { |v| v[:user] }

    email_new_members(successful_users, @organization)

    render action: :add_members_results
  rescue ArgumentError, ActionController::BadRequest => e
    flash.now[:error] = e.message
    render action: :add_members, status: :bad_request
  end

  def grant_admin
    raise ActionController::BadRequest, I18n.t('controllers.organizations.grant_admin.unauthorized') unless @organization.user_is_admin?(@current_user)

    @user_organization.update!(role: UserOrganization::ROLES[:ADMIN])
    redirect_back(fallback_location: root_path)
  rescue ArgumentError, ActionController::BadRequest => e
    flash.now[:error] = e.message
    render action: :show, status: :bad_request
  end

  def revoke_admin
    raise ActionController::BadRequest, I18n.t('controllers.organizations.revoke_admin.unauthorized') unless @organization.user_is_admin?(@current_user)

    @user_organization.update!(role: UserOrganization::ROLES[:MEMBER])
    redirect_back(fallback_location: root_path)
  rescue ArgumentError, ActionController::BadRequest => e
    flash.now[:error] = e.message
    render action: :show, status: :bad_request
  end

  private def switch_to_public
    Apartment::Tenant.switch!
  end

  private def email_new_members(users, organization)
    users.each do |user|
      Devise.mailer.added_to_organization(user, @current_user, @organization).deliver_now
    end
  end

  private def build_organization
    @organization = Organization.new(create_params)
    @organization.validate if params[:organization].present?
  end

  private def load_user
    @user = User.identify(params[:user_uuid])
  end

  private def load_organization
    slug = params[:slug] || params[:organization_slug]
    @organization = @current_user.organizations.find_by!(slug: slug)
  end

  private def load_user_organization
    @user_organization = @user.user_organizations.find_by!(organization: @organization)
  end

  private def create_params
    params.fetch(:organization, {}).permit(
      :name
    ).merge(user_organizations_attributes: [{
                                              role: UserOrganization::ROLES[:CREATOR],
                                              user: @current_user
                                            }])
  end

  private def add_members_params
    params.fetch(:organization, {}).permit(:usernames)
  end
end
