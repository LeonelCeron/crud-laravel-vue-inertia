<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { SquarePen } from '@lucide/vue';
import { toTypedSchema } from '@vee-validate/zod';
import { Field as VeeField, useForm as VeeUseForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import { z } from 'zod';
import { update } from '@/actions/App/Http/Controllers/ProductController';
import type { Product } from '@/components/datatable/products/columns';

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
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const props = defineProps<{
    products: Product;
}>();

const isOpen = ref(false);

const form = useForm({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
});

const formSchema = toTypedSchema(
    z.object({
        name: z
            .string()
            .min(3, 'Product name must be at least 3 characters.')
            .max(50, 'Product name must be at most 50 characters.'),
        description: z
            .string()
            .min(10, 'Description must be at least 10 characters.')
            .max(200, 'Description must be at most 200 characters.'),
        quantity: z.number().min(0, 'Quantity cannot be negative.'),
        price: z.number().min(0, 'Price cannot be negative.'),
    }),
);

const { handleSubmit, resetForm, setValues } = VeeUseForm({
    validationSchema: formSchema,
    initialValues: {
        name: '',
        description: '',
        quantity: 0,
        price: 0,
    },
});

const syncProductValues = (product: Product) => {
    const nextValues = {
        name: product.name ?? '',
        description: product.description ?? '',
        quantity: Number(product.quantity) || 0,
        price: Number(product.price) || 0,
    };

    Object.assign(form, nextValues);
    setValues(nextValues);
};

watch(
    () => props.products,
    (product) => {
        syncProductValues(product);
    },
    { immediate: true, deep: true },
);

const resetProductForm = () => {
    syncProductValues(props.products);
    resetForm({ values: { ...form } });
};

const onOpenDialog = (nextOpen: boolean) => {
    isOpen.value = nextOpen;

    if (nextOpen) {
        syncProductValues(props.products);
    }
};

const onSubmit = handleSubmit(() => {
    form.put(update(props.products.id).url, {
        onSuccess: () => {
            toast.success('Product with ID ' + props.products.id + ' updated');
            isOpen.value = false;
        },
        onError: () => {
            toast.error('Validation failed');
        },
    });
});
</script>

<template>
    <Dialog :open="isOpen" @update:open="onOpenDialog">
        <DialogTrigger as-child>
            <Button class="ml-2 h-8 w-20">
                <SquarePen />
                Edit
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit product</DialogTitle>

                <DialogDescription>
                    <form id="form-vee-demo" @submit="onSubmit">
                        <FieldGroup>
                            <VeeField
                                v-slot="{ componentField, errors }"
                                name="name"
                            >
                                <Field :data-invalid="!!errors.length">
                                    <FieldLabel for="form-vee-demo-name">
                                        Product name
                                    </FieldLabel>
                                    <Input
                                        v-model="form.name"
                                        id="name"
                                        v-bind="componentField"
                                        placeholder="Login button not working on mobile"
                                        autocomplete="off"
                                        :aria-invalid="!!errors.length"
                                    />
                                    <FieldError
                                        v-if="errors.length"
                                        :errors="errors"
                                    />
                                </Field>
                            </VeeField>
                            <VeeField
                                v-slot="{ componentField, errors }"
                                name="description"
                            >
                                <Field :data-invalid="!!errors.length">
                                    <FieldLabel for="form-vee-demo-description">
                                        Description
                                    </FieldLabel>
                                    <Input
                                        v-model="form.description"
                                        id="description"
                                        v-bind="componentField"
                                        placeholder="I'm having an issue with the login button on mobile."
                                        :rows="6"
                                        :aria-invalid="!!errors.length"
                                    />
                                    <FieldError
                                        v-if="errors.length"
                                        :errors="errors"
                                    />
                                </Field>
                            </VeeField>
                        </FieldGroup>
                    </form>
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose as-child>
                    <Button
                        type="button"
                        variant="outline"
                        @click="resetProductForm"
                    >
                        Reset
                    </Button>
                </DialogClose>
                <Button
                    type="submit"
                    size="sm"
                    form="form-vee-demo"
                    :disabled="form.processing"
                >
                    <span v-if="form.processing" class="spinner">
                        Loading
                    </span>
                    <span v-else>Submit</span>
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<style scoped></style>
