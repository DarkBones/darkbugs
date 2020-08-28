class BasePresenter
  class Error < StandardError; end
  class NotImplementedError < StandardError; end

  attr_reader :params

  def initialize(params = {})
    @params = params
  end

  def to_h
    raise NotImplementedError
  end
end
