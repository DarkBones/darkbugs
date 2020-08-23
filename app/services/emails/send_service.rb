module Emails
  SENDERS = [
    SENDER_NO_REPLY = "#{ENV['APP_NAME']} <noreply@#{ENV['APP_NAME'].downcase}.com>".freeze,
    SENDER_INFO = "#{ENV['APP_NAME']} <info@#{ENV['APP_NAME'].downcase}.com>".freeze
  ].freeze

  class SendService < BaseService
    class InvalidRequestError < Error; end

    def execute
      handle_errors do
        request = PostageApp::Request.new(
          :send_message,
          message_params
        )

        @response = request.send
        raise InvalidRequestError unless @response.status == 'ok'

        success
      end
    end

    private def handle_errors
      yield
    rescue InvalidRequestError
      error(@response, :bad_request)
    end

    private def message_params
      {
        headers: {
          from: @params['sender'],
          subject: @params['subject']
        },
        recipients: @params['recipients'],
        content: {
          'text/plain' => @params['content_text'],
          'text/html' => @params['content_html']
        }
      }
    end
  end
end
