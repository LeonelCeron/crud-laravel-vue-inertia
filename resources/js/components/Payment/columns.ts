import { ArrowUpDown } from '@lucide/vue';
import { createColumnHelper } from '@tanstack/vue-table';
import { createReusableTemplate } from '@vueuse/core';
import { h } from 'vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { DataTableFeatures } from './features';

export interface Payment {
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'success' | 'failed';
    email: string;
}

const columnHelper = createColumnHelper<DataTableFeatures, Payment>();

export const columns = columnHelper.columns([
    columnHelper.display({
        id: 'select',
        header: ({ table }) =>
            h(Checkbox, {
                modelValue:
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate'),
                'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
                    table.toggleAllPageRowsSelected(!!value),
                ariaLabel: 'Select all',
            }),
        cell: ({ row }) =>
            h(Checkbox, {
                modelValue: row.getIsSelected(),
                'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
                    row.toggleSelected(!!value),
                ariaLabel: 'Select row',
            }),
        enableSorting: false,
        enableHiding: false,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) =>
            h('div', { class: 'capitalize' }, row.getValue('status')),
    }),
    columnHelper.accessor('email', {
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () =>
                        column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Email', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
            );
        },
        cell: ({ row }) =>
            h('div', { class: 'lowercase' }, row.getValue('email')),
    }),
    columnHelper.accessor('amount', {
        header: () => h('div', { class: 'text-right' }, 'Amount'),
        cell: ({ row }) => {
            const amount = Number.parseFloat(row.getValue('amount'));

            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(amount);

            return h('div', { class: 'text-right font-medium' }, formatted);
        },
    }),
    columnHelper.display({
        id: 'actions',
        header: () => h('div', { class: 'text-center' }, 'Actions'),
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original;
            const dataExample = row.original;

            return h('div', { class: 'text-center' }, [
                h(ReuseTemplate, {
                    payment,
                    dataExample,
                    onExpand: () => row.toggleExpanded(),
                }),
            ]);
        },
    }),
]);

export const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
    dataExample: Payment,
    payment: {
        id: string;
    };
    onExpand: () => void;
}>();
