class UploadsController < ApplicationController
  def create
    puts '-------------------------------------------'
    puts '-------------------------------------------'
    puts params
    puts params.class.name
    puts params.to_yaml
    puts '==========================================='
    puts '==========================================='
  end
end
