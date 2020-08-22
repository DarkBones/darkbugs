class BaseService
  class Error < StandardError; end

  attr_reader :params

  def initialize(params = {})
    @params = params ? params.dup.to_h.with_indifferent_access : {}.with_indifferent_access
  end

  def execute
    raise NotImplementedError, '"execute" method missing'
  end

  protected def error(message, http_status = nil)
    result = {
      message: message,
      status: :error
    }

    result[:http_status] = http_status if http_status
    result
  end

  protected def success(pass_back = {})
    pass_back[:status] = :success

    pass_back
  end
end
