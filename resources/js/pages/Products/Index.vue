<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { columns } from '@/components/datatable/products/columns';
import DataTable from '@/components/datatable/products/data-table.vue';
import { product } from '@/routes';

defineProps({
    data: Array,
});

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Products',
                href: product(),
            },
        ],
    },
});
</script>

<template>
    <Head title="Products" />
    {{ data }}
    <div
        class="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4"
    >
        <DataTable :columns="columns as any" :data="data as any" />
    </div>
</template>
