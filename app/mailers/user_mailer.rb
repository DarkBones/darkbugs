class UserMailer < PostageApp::Mailer
  SENDERS = [
    SENDER_NO_REPLY = "#{ENV['APP_NAME']} <noreply@#{ENV['APP_NAME'].downcase}.com>".freeze,
    SENDER_INFO = "#{ENV['APP_NAME']} <info@#{ENV['APP_NAME'].downcase}.com>".freeze
  ].freeze

  default from: SENDER_NO_REPLY
  include Devise::Mailers::Helpers

  def confirmation_instructions(record, _token, _opts={})
    postageapp_template 'user_confirmation'
    postageapp_variables :name => record.email,
                         :confirmation_link => user_confirmation_url(confirmation_token: record.confirmation_token)
    mail(to: "donkerbc@gmail.com")
  end

  def reset_password_instructions(record, token, opts = {})
    # PostageApp specific elements (example):
    # postageapp_template 'my-password-reset'
    # postageapp_variables :name => record.class.name ||= record.email,
    #                      :link => "password_url(:reset_password_token => record.reset_password_token)"
    #
    # devise_mail(record, :reset_password_instructions)
    postageapp_template 'user_confirmation'
    postageapp_variables  :name => record.email,
                          :confirmation_link => edit_user_password_url(reset_password_token: record.reset_password_token)
    mail(to: "donkerbc@gmail.com")
    # super
  end

  def unlock_instructions(record)
    # PostageApp specific elements (example):
    postageapp_template 'my-unlock-instructions'
    postageapp_variables :name => record.name ||= record.email,
                         :link => unlock_url(:unlock_token => record.unlock_token)
    devise_mail(record, :unlock_instructions)
  end

  protected

  # Ensures template subject is used instead of the default devise mailer subject.
  # def headers_for(action)
  #   headers = super
  #   headers[:subject] = ''
  #   headers
  # end
end
