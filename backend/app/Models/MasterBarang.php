<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MasterBarang extends Model
{
    use HasFactory;
    protected $table = 'master_barang';
    protected $primaryKey = 'master_barang_id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'master_barang_id',
        'seri',
        'gambar',
        'barang',
        'pengadaan',
        'pemeliharaan',
        'harga',
        'kategori',
        'status'
    ];

    protected $casts = [
        'pengadaan' => 'date',
        'pemeliharaan' => 'date',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (!$model->master_barang_id) {
                $model->master_barang_id = (string) Str::uuid();
            }
        });
    }

}