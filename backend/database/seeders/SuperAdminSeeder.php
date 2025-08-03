<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\MasterUser;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        // Generate UUID untuk user
        $userId = (string) Str::uuid();

        // Insert ke table users
        $user = User::create([
            'user_id'  => $userId,
            'id'       => 'SA-001',
            'username' => 'superadmin',
            'email'    => 'superadmin@example.com',
            'password' => Hash::make('password123'),
            'role'     => 'superadmin'
        ]);

        // Insert ke master_users
        MasterUser::create([
            'master_user_id' => (string) Str::uuid(),
            'user_id'        => $user->user_id,
            'foto'           => 'default.png',
            'nama'           => 'Super Admin',
            'skpd'           => 'Pusat',
            'status'         => 'Aktif'
        ]);
    }
}
