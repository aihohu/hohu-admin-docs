declare namespace Api {
  namespace Notes {
    interface Note {
      noteId: string;
      title: string;
    }

    interface Page {
      records: Note[];
      total: number;
      current: number;
      size: number;
    }
  }
}
