<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MasterUser extends Model
{
    use HasFactory;
    protected $table = 'master_users';
    protected $primaryKey = 'master_user_id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['user_id', 'id', 'foto', 'nama', 'skpd', 'status'];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (!$model->master_user_id) {
                $model->master_user_id = (string) Str::uuid();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
