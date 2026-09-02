<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Products::get();

        return Inertia::render('Products/Index', [
            'data' => $products,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'quantity' => 'nullable|integer|min:0',
            'price' => 'nullable|numeric|min:0',
        ]);

        $product = Products::find($id);
        if (! $product) {
            return redirect()->route('product')->with('error', 'Product not found.');
        }

        $product->name = $request->name;
        $product->description = $request->description;
        $product->quantity = $request->input('quantity', $product->quantity);
        $product->price = $request->input('price', $product->price);
        $product->save();

        return redirect()->route('product');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
