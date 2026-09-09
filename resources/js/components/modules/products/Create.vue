<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { SquarePlus } from '@lucide/vue';
import { toTypedSchema } from '@vee-validate/zod';
import { Field as VeeField, useForm as VeeUseForm } from 'vee-validate';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { z } from 'zod';
import { store } from '@/actions/App/Http/Controllers/ProductController';
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

defineOptions({
    inheritAttrs: false,
});

const initialValues = {
    name: '',
    description: '',
    quantity: 0,
    price: 0,
};

const isOpen = ref(false);

const form = useForm({ ...initialValues });

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
    initialValues,
});

const resetProductForm = () => {
    Object.assign(form, { ...initialValues });
    setValues(initialValues);
    resetForm({ values: { ...initialValues } });
};

const onOpenDialog = (nextOpen: boolean) => {
    isOpen.value = nextOpen;

    if (nextOpen) {
        resetProductForm();
    }
};

const onSubmit = handleSubmit(() => {
    form.post(store().url, {
        onSuccess: () => {
            toast.success('Product created successfully');
            isOpen.value = false;
            resetProductForm();
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
            <Button v-bind="$attrs" class="h-8 w-20">
                <SquarePlus />
                Create
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create product</DialogTitle>

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
                                        placeholder="Type the description of the product"
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
                                name="quantity"
                            >
                                <Field :data-invalid="!!errors.length">
                                    <FieldLabel for="quantity">
                                        Quantity
                                    </FieldLabel>
                                    <Input
                                        v-model.number="form.quantity"
                                        id="quantity"
                                        v-bind="componentField"
                                        type="number"
                                        min="0"
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
                                name="price"
                            >
                                <Field :data-invalid="!!errors.length">
                                    <FieldLabel for="price"> Price </FieldLabel>
                                    <Input
                                        v-model.number="form.price"
                                        id="price"
                                        v-bind="componentField"
                                        type="number"
                                        min="0"
                                        step="0.01"
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
