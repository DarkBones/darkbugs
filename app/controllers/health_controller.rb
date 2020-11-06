class HealthController < ActionController::Base
  def index
    render json: {message: 'success'}, status: :ok
  end
end
