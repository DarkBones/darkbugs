json.name(@board.name)
json.slug(@board.slug)
json.path(project_board_path(project_key: @board.root_project.key, slug: @board.slug))
