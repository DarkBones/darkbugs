module CardItems
  module Notes
    class NotePresenter < BasePresenter
      attr_reader :note

      def initialize(note)
        @note = note
      end

      def to_h
        {
          content: note.content
        }
      end
    end
  end
end