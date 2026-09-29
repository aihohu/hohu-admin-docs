import { request } from '@/service/request';

export interface Note {
  noteId: string;
  title: string;
}

export function fetchNotes(current = 1, size = 10) {
  return request<{ records: Note[]; total: number; current: number; size: number }>({
    url: '/business/notes',
    method: 'get',
    params: { current, size }
  });
}

export function createNote(title: string) {
  return request<Note>({ url: '/business/notes', method: 'post', data: { title } });
}
