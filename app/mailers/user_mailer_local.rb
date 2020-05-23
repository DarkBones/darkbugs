class UserMailerLocal < Devise::Mailer
  include Devise::Mailers::Helpers
  default template_path: 'user_mailer/'
  default from: UserMailer::SENDER_NO_REPLY

  def reset_password_instructions(record, _token, _opts = {})
    @title = 'this is a test title local'
    @test = 'this is a test test local'
    mail(to: record.email)
  end
end
