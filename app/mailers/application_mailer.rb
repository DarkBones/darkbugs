class ApplicationMailer < PostageApp::Mailer
  default from: UserMailer::SENDER_NO_REPLY
  layout 'mailer'
end
