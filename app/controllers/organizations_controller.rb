class OrganizationsController < ApplicationController
  before_action :switch_to_public
  before_action :build_organization,      only:   %i[new create]
  before_action :load_organization,       only:   %i[show add_members create_members grant_admin revoke_admin remove_member delete]
  before_action :load_user_organization,  only:   %i[grant_admin revoke_admin remove_member]
  before_action :check_admin,             only:   %i[create_members grant_admin revoke_admin remove_member delete destroy]

  def index
    @organizations = @current_user
                       .organizations
                       .accepted_by_user(@current_user)
                       .order(:slug)

    @pending_organizations = @current_user
                               .organizations
                               .pending_for_user(@current_user)
                               .order(:slug)
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

    successful_users = @results[:results]
                             .reject { |v| v[:status] != Organizations::AddUsersService::SUCCESS }
                             .map { |v| { user: v[:user], token: v[:token] } }

    email_new_members(successful_users, @organization)

    render action: :add_members_results
  rescue ArgumentError, ActionController::BadRequest => e
    flash.now[:error] = e.message
    render action: :add_members, status: :bad_request
  end

  def accept_invitation
    slug = params[:slug] || params[:organization_slug]
    @organization = @current_user
                      .organizations
                      .pending_for_user(@current_user)
                      .find_by!(slug: slug)

    user_organization = @current_user
                          .user_organizations
                          .find_by!(confirmation_token: params[:confirmation_token])
    user_organization.update!(accepted_at: Time.now)

    redirect_to(organizations_path, {
      :flash => {
        :notice => I18n.t('controllers.organizations.accept_invitation.success', name: @organization.name)
      }
    })
  rescue ActiveRecord::RecordNotFound
    redirect_to(root_path, {
      :flash => {
        :error => I18n.t('controllers.organizations.accept_invitation.invalid_token')
      }
    })
  end

  def grant_admin
    raise ActionController::BadRequest, I18n.t('controllers.organizations.grant_admin.same_user') if @user == @current_user
    raise ActionController::BadRequest, I18n.t('controllers.organizations.grant_admin.already_admin') if @organization.user_is_admin?(@user)

    @user_organization.update!(role: UserOrganization::ROLES[:ADMIN])
    redirect_back(fallback_location: root_path)
  rescue ActionController::BadRequest => e
    flash.now[:error] = e.message
    render action: :show, status: :bad_request
  end

  def revoke_admin
    raise ActionController::BadRequest, I18n.t('controllers.organizations.revoke_admin.same_user') if @user == @current_user

    @user_organization.update!(role: UserOrganization::ROLES[:MEMBER])
    redirect_back(fallback_location: root_path)
  rescue ActionController::BadRequest => e
    flash.now[:error] = e.message
    render action: :show, status: :bad_request
  end

  def remove_member
    raise ActionController::BadRequest, I18n.t('controllers.organizations.remove_member.same_user') if @user == @current_user

    @user_organization.destroy!
    redirect_back(fallback_location: root_path)
  rescue ActionController::BadRequest => e
    flash.now[:error] = e.message
    render action: :show, status: :bad_request
  end

  def delete; end

  def destroy
    raise ActionController::BadRequest, I18n.t('controllers.organizations.errors.destroy.name_mismatch') if params.dig(:organization, :name) != @organization.name

    @organization.destroy!

    redirect_to(organizations_path, { :flash => { :notice => I18n.t('controllers.organizations.destroy.success', name: @organization.name) } })
  rescue ActionController::BadRequest => e
    flash[:error] = e.message
    redirect_back(fallback_location: organizations_path)
  end

  def leave
    slug = params[:slug] || params[:organization_slug]
    @organization = @current_user.organizations.find_by!(slug: slug)

    if @organization.user_is_admin?(@current_user) && @organization.admins.count <= 1
      raise ActionController::BadRequest, I18n.t('controllers.organizations.errors.leave.orphan', name: @organization.name)
    end

    user_organization = @current_user.user_organizations.find_by!(organization: @organization)
    user_organization.destroy!

    redirect_back(fallback_location: organizations_path)
  rescue ActionController::BadRequest => e
    flash[:error] = e.message
    redirect_back(fallback_location: organizations_path)
  end

  private def check_admin
    load_organization

    raise ActionController::BadRequest, I18n.t('controllers.organizations.errors.unauthorized') unless @organization.user_is_admin?(@current_user)
  rescue ActionController::BadRequest => e
    redirect_to(organizations_path, { :flash => { :error => e.message }, :status => :bad_request })
  end

  private def switch_to_public
    Apartment::Tenant.switch!
  end

  private def email_new_members(user_tokens, organization)
    user_tokens.each do |user_token|
      Devise.mailer.added_to_organization(user_token[:user], @current_user, organization, user_token[:token]).deliver_now
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
    @organization ||= @current_user.organizations.accepted_by_user(@current_user).find_by!(slug: slug)
  end

  private def load_user_organization
    load_organization
    load_user
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
