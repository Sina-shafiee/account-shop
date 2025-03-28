<?php

namespace App\Models;

use App\Traits\EnumTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    /** @use HasFactory<\Database\Factories\AccountFactory> */
    use HasFactory, EnumTrait;

    public const STATUS = [
        'pending' => 1,
        'active' => 2,
        'rejected'=>3,
        'canceled' => 4,
        'sold' => 5
    ];

    protected static $enums = [
        "STATUS"=> "status"
    ];

    protected $fillable = [
        "seller_id",
        "game_id",
        "description",
        "price",
        "status",
        "features",
    ];
}
