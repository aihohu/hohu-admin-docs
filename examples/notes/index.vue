<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { NButton, NCard, NDataTable, NForm, NFormItem, NInput, NPagination, NSpace, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';
import { createNote, fetchNotes } from '@/service/api/notes';

const { hasAuth } = useAuth();
const message = useMessage();
const title = ref('');
const records = ref<Api.Notes.Note[]>([]);
const total = ref(0);
const current = ref(1);
const size = ref(10);
const loading = ref(false);
const saving = ref(false);
let requestVersion = 0;
const columns = computed<DataTableColumns<Api.Notes.Note>>(() => [
  { title: $t('notes.title'), key: 'title', minWidth: 180 },
  { title: $t('notes.id'), key: 'noteId', width: 200 }
]);

async function loadNotes() {
  const version = ++requestVersion;
  loading.value = true;
  try {
    const { data, error } = await fetchNotes(current.value, size.value);
    if (version !== requestVersion) return;
    if (error || !data) {
      records.value = [];
      total.value = 0;
      return;
    }
    records.value = data.records;
    total.value = data.total;
  } finally {
    if (version === requestVersion) loading.value = false;
  }
}

function changePage(page: number) {
  current.value = page;
  void loadNotes();
}

function changeSize(value: number) {
  size.value = value;
  changePage(1);
}

async function saveNote() {
  if (saving.value || !hasAuth('business:note:add')) return;
  const value = title.value.trim();
  if (!value || [...value].length > 120) {
    message.warning($t('notes.titleRequired'));
    return;
  }
  saving.value = true;
  try {
    const { error } = await createNote(value);
    if (error) return;
    title.value = '';
    message.success($t('notes.created'));
    current.value = 1;
    await loadNotes();
  } finally {
    saving.value = false;
  }
}

onMounted(() => void loadNotes());
</script>

<template>
  <NSpace vertical :size="16">
    <NCard v-if="hasAuth('business:note:add')" :title="$t('notes.create')">
      <NForm @submit.prevent="saveNote">
        <NFormItem :label="$t('notes.title')">
          <NInput v-model:value="title" :disabled="saving" :placeholder="$t('notes.placeholder')" />
        </NFormItem>
        <NButton type="primary" attr-type="submit" :loading="saving" :disabled="saving">
          {{ $t('notes.create') }}
        </NButton>
      </NForm>
    </NCard>
    <NCard :title="$t('notes.list')">
      <NSpace vertical :size="16">
        <NButton :loading="loading" @click="loadNotes">{{ $t('notes.refresh') }}</NButton>
        <NDataTable
          :columns="columns"
          :data="records"
          :row-key="(row: Api.Notes.Note) => row.noteId"
          :loading="loading"
          :scroll-x="380"
        />
        <NPagination
          :page="current"
          :page-size="size"
          :item-count="total"
          :page-sizes="[10, 20, 50]"
          :page-slot="3"
          show-size-picker
          @update:page="changePage"
          @update:page-size="changeSize"
        />
      </NSpace>
    </NCard>
  </NSpace>
</template>
