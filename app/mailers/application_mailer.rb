class ApplicationMailer < PostageApp::Mailer
  default from: Emails::SENDER_NO_REPLY
  layout 'mailer'
end
