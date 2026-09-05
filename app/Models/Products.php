<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    public const STATUS_ACTIVE = 1;

    public const STATUS_INACTIVE = 0;

    public const STATUS_DELETED = 2;

    public const STATUSES = [
        self::STATUS_ACTIVE,
        self::STATUS_INACTIVE,
        self::STATUS_DELETED,
    ];

    protected $fillable = ['name', 'description', 'quantity', 'price', 'status'];

    protected $casts = [
        'status' => 'integer',
    ];

    public function scopeVisible($query)
    {
        return $query->where('status', '!=', self::STATUS_DELETED);
    }

    public function updateStatus(int $status): self
    {
        $this->status = $status;
        $this->save();

        return $this;
    }
}
