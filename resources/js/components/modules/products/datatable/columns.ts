import { ArrowUpDown } from '@lucide/vue';
import { createColumnHelper } from '@tanstack/vue-table';
import { createReusableTemplate } from '@vueuse/core';
import { h } from 'vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { DataTableFeatures } from './features';

export interface Product {
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
    status: number;
    created_at: string;
    updated_at: string;
}

const columnHelper = createColumnHelper<DataTableFeatures, Product>();

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
    columnHelper.accessor('name', {
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () =>
                        column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Name', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
            );
        },
        cell: ({ row }) =>
            h('div', { class: 'lowercase' }, row.getValue('name')),
    }),
    columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) =>
            h('div', { class: 'lowercase' }, row.getValue('description')),
    }),
    columnHelper.accessor('quantity', {
        header: 'Quantity',
    }),
    columnHelper.accessor('price', {
        header: 'Price',
        cell: ({ row }) => {
            const price = Number.parseFloat(row.getValue('price'));

            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(price);

            return h('div', {}, formatted);
        },
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) =>
            h('div', { class: 'capitalize' }, row.getValue('status')),
    }),
    columnHelper.accessor('created_at', {
        header: 'Created At',
    }),
    columnHelper.accessor('updated_at', {
        header: 'Updated At',
    }),
    columnHelper.display({
        id: 'actions',
        header: () => h('div', { class: 'text-center' }, 'Actions'),
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;
            const product = row.original;

            return h('div', { class: 'text-center' }, [
                h(ReuseTemplate, {
                    data,
                    product,
                    onExpand: () => row.toggleExpanded(),
                }),
            ]);
        },
    }),
]);

export const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
    data: Product;
    product: {
        id: number;
    };
    onExpand: () => void;
}>();
