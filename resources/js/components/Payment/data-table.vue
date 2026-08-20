<script setup lang="ts">
// Keep row selection outside the table so the rest of the app can read or update it.
import { ChevronDown, SquarePen, Trash2 } from '@lucide/vue';
import type { ColumnDef, RowSelectionState } from '@tanstack/vue-table';
import { FlexRender } from '@tanstack/vue-table';
import { useTable } from '@tanstack/vue-table';
import { ref } from 'vue';
import type { Payment } from '@/components/Payment/columns';
import { DefineTemplate } from '@/components/Payment/columns';
import { features } from '@/components/Payment/features';
import type { DataTableFeatures } from '@/components/Payment/features';
import { Button } from '@/components/ui/button';

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { payment } from '@/routes';

const rowSelection = ref<RowSelectionState>({});
const props = defineProps<{
    columns: ColumnDef<DataTableFeatures, Payment>[];
    data: Payment[];
}>();

const table = useTable({
    features,
    get data() {
        return props.data;
    },
    get columns() {
        return props.columns;
    },
    state: {
        get rowSelection() {
            return rowSelection.value;
        },
    },
    onRowSelectionChange: (updater) => {
        rowSelection.value =
            typeof updater === 'function'
                ? updater(rowSelection.value)
                : updater;
    },
});

function copy(id: string) {
    navigator.clipboard.writeText(id);
}
function printIDSelected(pay: Payment) {
    console.log('This is a test from console', pay);
}

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
    <DefineTemplate v-slot="{ dataExample }">
        <Button class="ml-2 h-8 w-20" @click="printIDSelected(dataExample)">
            <SquarePen />
            Edit
        </Button>
        <Button
            class="ml-2 h-8 w-20"
            variant="destructive"
            @click="copy(dataExample.id)"
        >
            <Trash2 />
            Delete
        </Button>
    </DefineTemplate>

    <div class="mr-1 ml-1 w-full">
        <div class="flex items-center py-4">
            <Input
                class="max-w-sm"
                placeholder="Filter emails..."
                :model-value="
                    table.getColumn('email')?.getFilterValue() as string
                "
                @update:model-value="
                    table.getColumn('email')?.setFilterValue($event)
                "
            />
            <div class="ml-auto">
                <Button> Add </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="outline" class="ml-auto">
                            Columns <ChevronDown class="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuCheckboxItem
                            v-for="column in table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())"
                            :key="column.id"
                            class="capitalize"
                            :model-value="column.getIsVisible()"
                            @update:model-value="
                                (value) => {
                                    column.toggleVisibility(!!value);
                                }
                            "
                        >
                            {{ column.id }}
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow
                        v-for="headerGroup in table.getHeaderGroups()"
                        :key="headerGroup.id"
                    >
                        <TableHead
                            v-for="header in headerGroup.headers"
                            :key="header.id"
                        >
                            <FlexRender
                                v-if="!header.isPlaceholder"
                                :header="header"
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="table.getRowModel().rows?.length">
                        <template
                            v-for="row in table.getRowModel().rows"
                            :key="row.id"
                        >
                            <TableRow
                                :data-state="row.getIsSelected() && 'selected'"
                            >
                                <TableCell
                                    v-for="cell in row.getVisibleCells()"
                                    :key="cell.id"
                                >
                                    <FlexRender :cell="cell" />
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="row.getIsExpanded()">
                                <TableCell :colspan="row.getAllCells().length">
                                    {{ JSON.stringify(row.original) }}
                                </TableCell>
                            </TableRow>
                        </template>
                    </template>

                    <TableRow v-else>
                        <TableCell
                            :colspan="columns.length"
                            class="h-24 text-center"
                        >
                            No results.
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <div class="flex items-center justify-end space-x-2 py-4">
            <div class="flex-1 text-sm text-muted-foreground">
                {{ table.getFilteredSelectedRowModel().rows.length }} of
                {{ table.getFilteredRowModel().rows.length }} row(s) selected.
            </div>
            <div class="space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    :disabled="!table.getCanPreviousPage()"
                    @click="table.previousPage()"
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    :disabled="!table.getCanNextPage()"
                    @click="table.nextPage()"
                >
                    Next
                </Button>
            </div>
        </div>
    </div>
</template>
