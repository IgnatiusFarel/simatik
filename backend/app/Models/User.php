<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'username',
        'email',
        'password',
        'role',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (!$model->getKey()) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    // public function setPasswordAttribute($value)
    // {
    //     if (!empty($value)) {
    //         $this->attributes['password'] = bcrypt($value);
    //     }
    // }

    public function masterUser()
    {
        return $this->hasOne(MasterUser::class, 'user_id', 'user_id');
    }
}
