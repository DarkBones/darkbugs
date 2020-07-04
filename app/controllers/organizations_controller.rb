class OrganizationsController < ApplicationController
  def create
    Organization.create!(create_or_update_params)
  end

  private def create_or_update_params
    params.fetch(:organization).permit(
      :name
    )
  end
end
