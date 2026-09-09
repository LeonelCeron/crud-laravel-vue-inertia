<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { Trash2 } from '@lucide/vue';
import { toast } from 'vue-sonner';
import type { Product } from '@/components/modules/products/datatable/columns';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const props = defineProps<{
    products: Product;
}>();

const handleDelete = () => {
    router.patch(
        `/products/${props.products.id}/status`,
        {
            status: 2,
        },
        {
            onSuccess: () => {
                toast.success(
                    'Product with ID ' +
                        props.products.id +
                        ' deleted successfully!',
                );
            },
            onError: () => {
                toast.error('Validation failed');
            },
        },
    );
};
</script>

<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button class="ml-2 h-8 w-20" variant="destructive">
                <Trash2 />
                Delete
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-106.25">
            <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the product
                    <span class="text-sm font-semibold">
                        {{ props.products.name }}
                    </span>
                    and remove your data from our servers.
                </DialogDescription>
            </DialogHeader>

            <DialogFooter>
                <DialogClose as-child>
                    <Button variant="outline"> Cancel </Button>
                </DialogClose>
                <Button @click="handleDelete"> Delete </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
