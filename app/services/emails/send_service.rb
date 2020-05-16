module Emails
  class SendService < BaseService
    def execute
      request = PostageApp::Request.new(
        :send_message,
        {
          headers: {
            from: 'sender@example.com',
            subject: 'THIS IS A TEST EMAIL'
          },
          recipients: 'donkerbc@gmail.com',
          content: {
            'text/plain' => 'text email content',
            'text/html' -> 'html email content'
          }#,
          # attachments: {
          #   'document.pdf' => {
          #     content_type: 'application / pdf ',
          #     content: Base64.encode64(File.open(' / path / to / document.pdf ', ' rb ').read)
          #   }
          # }
        }

        response = request.send
      )
    end
  end
end
