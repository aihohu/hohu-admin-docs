// Copy to src/locales/notes.ts. Merge into the existing global messages.
export const notesZh = {
  notes: {
    title: '标题',
    id: '编号',
    create: '创建便签',
    list: '业务便签',
    refresh: '刷新',
    placeholder: '输入 1–120 个字符的标题',
    titleRequired: '请输入 1–120 个字符的标题',
    created: '便签已创建'
  },
  route: { notes: '业务便签' },
  permission: { business_note_list: '查看便签', business_note_add: '创建便签' },
  agent: { notes: { name: '业务便签助手', description: '查询业务便签，并在确认后创建便签' } },
  tool: { note: { field: { title: '标题' }, create: { confirm: '创建便签：{title}' } } },
  chat: { confirmNoteCreate: '创建便签：{title}' },
  errorCode: {
    NOTE_TITLE_INVALID: '请输入 1–120 个字符的标题',
    NOTE_APPROVAL_REQUIRED: '需要匹配的操作确认，请重新发起创建'
  }
};

export const notesEn = {
  notes: {
    title: 'Title',
    id: 'ID',
    create: 'Create note',
    list: 'Business notes',
    refresh: 'Refresh',
    placeholder: 'Enter a title of 1–120 characters',
    titleRequired: 'Enter a title of 1–120 characters',
    created: 'Note created'
  },
  route: { notes: 'Business notes' },
  permission: { business_note_list: 'View notes', business_note_add: 'Create notes' },
  agent: {
    notes: { name: 'Business notes assistant', description: 'Query business notes and create them after confirmation' }
  },
  tool: { note: { field: { title: 'Title' }, create: { confirm: 'Create note: {title}' } } },
  chat: { confirmNoteCreate: 'Create note: {title}' },
  errorCode: {
    NOTE_TITLE_INVALID: 'Enter a title of 1–120 characters',
    NOTE_APPROVAL_REQUIRED: 'A matching approval is required. Start a new creation request.'
  }
};
