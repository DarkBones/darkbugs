class UserMailerLocal < Devise::Mailer
  include Devise::Mailers::Helpers
  include Rails.application.routes.url_helpers
  layout 'mailer'

  default template_path: 'user_mailer/'
  default from: UserMailer::SENDER_NO_REPLY

  def confirmation_instructions(record, token, _opts = {})
    @title = I18n.t('mailers.user_mailer.confirmation_instructions.title')
    @name = record.name
    @link = user_confirmation_url(confirmation_token: token)
    mail(to: record.email,
         subject: @title)
  end

  def reset_password_instructions(record, token, _opts = {})
    @title = I18n.t('mailers.user_mailer.reset_password_instructions.title')
    @name = record.name
    @link = edit_user_password_url(record, reset_password_token: token)
    mail(to: record.email,
         subject: @title)
  end

  def unlock_instructions(record, token, _opts = {})
    @title = I18n.t('mailers.user_mailer.unlock_instructions.title')
    @name = record.name
    @link = user_unlock_url(:unlock_token => token)
    mail(to: record.email,
         subject: @title)
  end

  def added_to_organization(added_user, added_by, organization, _opts = {})
    @title = I18n.t('mailers.user_mailer.added_to_organization.title', organization: organization.name)
    @added_by = added_by.name
    @name = added_user.name
    @organization = organization.name
    @link = organizations_path
    mail(to: added_user.email,
         subject: I18n.t('mailers.user_mailer.added_to_organization.subject'))
  end
end
