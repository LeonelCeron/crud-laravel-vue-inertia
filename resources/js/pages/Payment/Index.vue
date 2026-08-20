<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { onMounted, ref } from 'vue';
import type { Payment } from '@/components/Payment/columns';
import { columns } from '@/components/Payment/columns';
import DataTable from '@/components/Payment/data-table.vue';
import { payment } from '@/routes';

const data = ref<Payment[]>([]);

async function getData(): Promise<Payment[]> {
    return [
        {
            id: 'm5gr84i9',
            amount: 316,
            status: 'success',
            email: 'ken99@yahoo.com',
        },
        {
            id: '3u1reuv4',
            amount: 242,
            status: 'success',
            email: 'Abe45@gmail.com',
        },
        {
            id: 'derv1ws0',
            amount: 837,
            status: 'processing',
            email: 'Monserrat44@gmail.com',
        },
        {
            id: '5kma53ae',
            amount: 874,
            status: 'success',
            email: 'Silas22@gmail.com',
        },
        {
            id: 'bhqecj4p',
            amount: 721,
            status: 'failed',
            email: 'carmella@hotmail.com',
        },

        {
            id: 'm5gr84i1',
            amount: 316,
            status: 'success',
            email: 'ken99@yahoo.com',
        },
        {
            id: '3u1reuv2',
            amount: 242,
            status: 'success',
            email: 'Abe45@gmail.com',
        },
        {
            id: 'derv1ws3',
            amount: 837,
            status: 'processing',
            email: 'Monserrat44@gmail.com',
        },
        {
            id: '5kma53a4',
            amount: 874,
            status: 'success',
            email: 'Silas22@gmail.com',
        },
        {
            id: 'bhqecj45',
            amount: 721,
            status: 'failed',
            email: 'carmella@hotmail.com',
        },

        {
            id: 'm5gr84i11',
            amount: 316,
            status: 'success',
            email: 'ken99@yahoo.com',
        },
        {
            id: '3u1reuv12',
            amount: 242,
            status: 'success',
            email: 'Abe45@gmail.com',
        },
        {
            id: 'derv1ws13',
            amount: 837,
            status: 'processing',
            email: 'Monserrat44@gmail.com',
        },
        {
            id: '5kma53a14',
            amount: 874,
            status: 'success',
            email: 'Silas22@gmail.com',
        },
        {
            id: 'bhqecj415',
            amount: 721,
            status: 'failed',
            email: 'carmella@hotmail.com',
        },
    ];
}

onMounted(async () => {
    data.value = await getData();
    console.log('current data:', data.value);
});

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Payment',
                href: payment(),
            },
        ],
    },
});
</script>

<template>
    <Head title="Products" />
    <div
        class="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4"
    >
        <DataTable :columns="columns as any" :data="data as any" />
    </div>
</template>
