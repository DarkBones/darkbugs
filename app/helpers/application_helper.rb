module ApplicationHelper
  def app_info
    data = {
      source: VERSION_SOURCE,
      hostname: 'unknown',
      sha: VERSION_SHA,
      branch: VERSION_BRANCH.gsub('## ', '')
    }

    data[:hostname] = Socket.gethostname if Socket.gethostname.present?

    data[:sha] = link_to(VERSION_SHA, VERSION_LINK) if defined?(VERSION_LINK)

    data
  end

  def css_page_class
    controller_name = "controller-#{params[:controller].tr('/', '-').tr('_', '-')}"
    page_name = "page-#{params[:action].tr('/', '-').tr('_', '-')}"

    class_names = []
    class_names << controller_name
    class_names << page_name

    class_names.join(' ')
  end

  def page_title
    if content_for?(:page_title)
      "#{content_for(:page_title)} - #{default_page_title}"
    else
      default_page_title
    end
  end

  def i18n(path, *options)
    I18n.t "#{i18n_path_prefix}.#{path}", options[0]
  end

  private def i18n_path_prefix
    action_mapping = {
      create: 'new',
      update: 'edit'
    }

    controller = params[:controller].gsub '/', '.'

    action = action_mapping[params[:action].to_sym]
    action ||= params[:action]

    "views.#{controller}.#{action}"
  end

  private def default_page_title
    if @current_organization.present?
      @current_organization.name
    else
      ENV['APP_NAME']
    end
  end
end
