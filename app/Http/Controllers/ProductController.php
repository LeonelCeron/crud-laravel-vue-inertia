<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Products::visible()->get();

        return Inertia::render('Products/Index', [
            'data' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'quantity' => ['nullable', 'integer', 'min:0'],
            'price' => ['nullable', 'numeric', 'min:0'],
        ]);

        Products::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'quantity' => $validated['quantity'] ?? 0,
            'price' => $validated['price'] ?? 0,
            'status' => Products::STATUS_ACTIVE,
        ]);

        return redirect()->route('product')->with('success', 'Product created successfully.');
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $product = $this->findProductOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'quantity' => ['nullable', 'integer', 'min:0'],
            'price' => ['nullable', 'numeric', 'min:0'],
        ]);
        $product->fill([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'quantity' => $validated['quantity'] ?? $product->quantity,
            'price' => $validated['price'] ?? $product->price,
        ]);
        $product->save();

        return redirect()->route('product')->with('success', 'Product updated successfully.');
    }

    public function updateStatus(Request $request, string $id): RedirectResponse
    {
        $product = $this->findProductOrFail($id);

        $validated = $request->validate([
            'status' => ['required', Rule::in(Products::STATUSES)],
        ]);

        $status = $validated['status'] === Products::STATUS_DELETED
            ? Products::STATUS_INACTIVE
            : $validated['status'];

        $product->updateStatus($status);

        return redirect()->route('product')->with('success', 'Product status updated successfully.');
    }

    private function findProductOrFail(string $id): Products
    {
        return Products::findOrFail($id);
    }
}
