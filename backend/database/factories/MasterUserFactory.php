<?php

namespace Database\Factories;

use App\Models\MasterUser;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<MasterUser>
 */

class MasterUserFactory extends Factory
{
    protected $model = MasterUser::class;

    public function definition(): array
    {
        return [
            'master_user_id' => (string) Str::uuid(),
            'user_id' => User::factory(), 
            'id' => $this->faker->numerify('USR###'),
            'foto' => null,
            'nama' => $this->faker->name(),
            'skpd' => $this->faker->company(),
            'status' => 'aktif',
        ];
    }
}
