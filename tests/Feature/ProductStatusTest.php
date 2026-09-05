<?php

use App\Models\Products;
use App\Models\User;

test('authenticated users can update only the product status', function () {
    $user = User::factory()->create();

    $product = Products::create([
        'name' => 'Laptop',
        'description' => 'Gaming laptop',
        'quantity' => 5,
        'price' => 1200.00,
        'status' => Products::STATUS_DELETED,
    ]);

    $this->actingAs($user)
        ->patch(route('products.update.status', ['id' => $product->id]), [
            'status' => Products::STATUS_DELETED,
        ])
        ->assertRedirect(route('product'));

    $product->refresh();

    expect($product->status)->toBe(Products::STATUS_INACTIVE);
    expect($product->name)->toBe('Laptop');
});
