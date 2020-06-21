class UploadsController < ApplicationController
  def create
    puts '-------------------------------------------'
    puts '-------------------------------------------'
    puts params
    puts params.class.name
    puts params.to_yaml
    puts '==========================================='
    puts '==========================================='
    puts Rails.application.credentials.azure_storage.dig(:access_key)
    puts Rails.application.credentials.dig(:azure_storage, :access_key)

    current_user.user_profile.avatar.attach(params[:file])

    # blob_client = Azure::Storage::Blob::BlobService.create(
    #   storage_account_name: Rails.application.credentials.dig(:azure_storage, :account_name),
    #   storage_access_key: Rails.application.credentials.dig(:azure_storage, :access_key)
    # )
    #
    # container_name = 'quickstartblobs' + SecureRandom.uuid
    # container = blob_client.create_container(container_name)
    #
    # # Set the permission so the blobs are public.
    # blob_client.set_container_acl(container_name, "container")
    #
    # blob_client.create_block_blob(container.name, 'local_file_name', params[:file])
  end
end
