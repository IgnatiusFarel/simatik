<?php

namespace Database\Seeders;

use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\MasterUser;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        // ===== Superadmin Utama =====
        $superadmin1 = User::updateOrCreate(
            ['username' => 'superadmin'],
            [
                'user_id'  => (string) Str::uuid(),
                'email'    => 'superadmin@gmail.com',
                'password' => Hash::make('12345678'),
                'role'     => 'superadmin',
            ]
        );

        MasterUser::updateOrCreate(
            ['id' => '#FRL-01-SUPER'],
            [
                'master_user_id' => (string) Str::uuid(),
                'user_id'        => $superadmin1->user_id,
                'foto'           => 'default.png',
                'nama'           => 'Super Admin',
                'skpd'           => 'Pusat',
                'status'         => 'Aktif',
            ]
        );

        // ===== Superadmin Kedua =====
        $superadmin2 = User::updateOrCreate(
            ['username' => 'superadmin2'],
            [
                'user_id'  => (string) Str::uuid(),
                'email'    => 'superadmin2@gmail.com',
               'password' => '12345678',
                'role'     => 'superadmin',
            ]
        );

        MasterUser::updateOrCreate(
            ['id' => '#FRL-02-SUPER'],
            [
                'master_user_id' => (string) Str::uuid(),
                'user_id'        => $superadmin2->user_id,
                'foto'           => 'default.png',
                'nama'           => 'Super Admin 2',
                'skpd'           => 'Pusat',
                'status'         => 'Aktif',
            ]
        );
    }
}
