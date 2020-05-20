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
end
