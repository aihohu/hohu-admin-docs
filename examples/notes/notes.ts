import { request } from '@/service/request';

export function fetchNotes(current = 1, size = 10) {
  return request<Api.Notes.Page>({
    url: '/business/notes',
    method: 'get',
    params: { current, size }
  });
}

export function createNote(title: string) {
  return request<Api.Notes.Note>({ url: '/business/notes', method: 'post', data: { title } });
}
