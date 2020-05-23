class UserMailer < PostageApp::Mailer
  SENDERS = [
    SENDER_NO_REPLY = "#{ENV['APP_NAME']} <noreply@#{ENV['APP_NAME'].downcase}.com>".freeze,
    SENDER_INFO = "#{ENV['APP_NAME']} <info@#{ENV['APP_NAME'].downcase}.com>".freeze
  ].freeze

  default from: SENDER_NO_REPLY
  include Devise::Mailers::Helpers

  def confirmation_instructions(record, _token, _opts={})
    postageapp_template 'user_confirmation'
    postageapp_variables :title => 'Confirm Your Account',
                         :name => record.email ||= record.email,
                         :link => user_confirmation_url(confirmation_token: record.confirmation_token)
    mail(to: record.email)
  end

  def reset_password_instructions(record, _token, _opts = {})
    @title = 'this is a test title'
    @test = 'this is a test test'
    mail(to: record.email)
  end

  def unlock_instructions(record)
    postageapp_template 'unlock_instructions'
    postageapp_variables :title => 'Unlock Your Account',
                         :name => record.name ||= record.email,
                         :link => unlock_url(:unlock_token => record.unlock_token)
    mail(to: record.email)
  end
end
