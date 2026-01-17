<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\MasterUser;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class MasterUserSeeder extends Seeder
{
    public function run(): void
    {
        // for ($i = 1; $i <= 5; $i++) {
        //     $user = User::firstOrCreate(
        //         ['username' => 'user'.$i],
        //         [
        //             'user_id'  => (string) Str::uuid(),
        //             'email'    => 'user'.$i.'@example.com',
        //             'password' => Hash::make('password123'),
        //             'role'     => 'user',
        //         ]
        //     );

        //     MasterUser::firstOrCreate(
        //         ['id' => '#USR-0'.$i],
        //         [
        //             'master_user_id' => (string) Str::uuid(),
        //             'user_id'        => $user->user_id,
        //             'foto'           => 'default.png',
        //             'nama'           => 'User '.$i,
        //             'skpd'           => 'Unit '.$i,
        //             'status'         => 'Aktif',
        //         ]
        //     );
        // }
         MasterUser::factory()->count(10)->create();
    }
}
