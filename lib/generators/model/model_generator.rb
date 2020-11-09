class ModelGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('templates', __dir__)

  def copy_initializer_file
    copy_file "model.rb", "app/models/#{file_name}.rb"
  end
end
