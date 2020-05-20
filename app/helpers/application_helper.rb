module ApplicationHelper
  def app_info
    data = {
      hostname: 'unknown',
      source: VERSION_NAME,
      sha: VERSION_SHA
    }

    if Socket.gethostname.present?
      data[:hostname] = Socket.gethostname
    end

    if defined?(VERSION_LINK)
      data[:sha] = link_to(VERSION_SHA, VERSION_LINK)
    end

    data
  end

  def css_page_class
    controller_name = 'controller-' + params[:controller].tr('/', '-').tr('_', '-')
    page_name = 'page-' + params[:action].tr('/', '-').tr('_', '-')

    class_names = []
    class_names << controller_name
    class_names << page_name

    class_names.join(' ')
  end

  def t(path)
    I18n.t "#{i18n_path_prefix}.#{path}"
  end

  private def i18n_path_prefix
    url = request.path.gsub '/', '.'
    "views#{url}"
  end
end
