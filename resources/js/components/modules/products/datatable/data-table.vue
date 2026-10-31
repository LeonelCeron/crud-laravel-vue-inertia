<script setup lang="ts">
// Keep row selection outside the table so the rest of the app can read or update it.
import { ChevronDown } from '@lucide/vue';
import type { ColumnDef, RowSelectionState } from '@tanstack/vue-table';
import { FlexRender } from '@tanstack/vue-table';
import { useTable } from '@tanstack/vue-table';
import { ref } from 'vue';
import { features } from '@/components/modules/Payment/features';
import type { DataTableFeatures } from '@/components/modules/Payment/features';
import Create from '@/components/modules/products/Create.vue';
import type { Product } from '@/components/modules/products/datatable/columns';
import { DefineTemplate } from '@/components/modules/products/datatable/columns';
import Delete from '@/components/modules/products/Delete.vue';
import Edit from '@/components/modules/products/Edit.vue';
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
    columns: ColumnDef<DataTableFeatures, Product>[];
    data: Product[];
}>();

const table = useTable({
    features,
    get data() {
        return props.data;
    },
    get columns() {
        return props.columns;
    },
    initialState: {
        columnVisibility: {
            created_at: false,
            updated_at: false,
        },
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
    <DefineTemplate v-slot="{ data }">
        <Edit :key="data.id" :products="data" />
        <Delete :key="data.id" :products="data" />
    </DefineTemplate>

    <div class="mr-1 ml-1 w-full">
        <div class="flex items-center py-4">
            <Input
                class="max-w-sm"
                placeholder="Filter products..."
                :model-value="
                    table.getColumn('name')?.getFilterValue() as string
                "
                @update:model-value="
                    table.getColumn('name')?.setFilterValue($event)
                "
            />
            <div class="ml-auto flex items-center gap-2">
                <Create />
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="outline" class="h-8">
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
