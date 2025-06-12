<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Files extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'file_encrypted_name',
        'file_path',
        'file_size',
        'file_type',
        'file_extension',
        'context',
        'timestamp'
    ];
}
