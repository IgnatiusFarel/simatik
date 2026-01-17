<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\MasterBarang;

/**
 * @extends Factory<MasterBarang>
 */
class MasterBarangFactory extends Factory
{
    protected $model = MasterBarang::class;

    public function definition(): array
    {
        return [
            'seri' => strtoupper($this->faker->bothify('SER-###??')),
            'gambar' => $this->faker->imageUrl(640, 480, 'technics', true),
            'barang' => $this->faker->words(3, true),
            'pengadaan' => $this->faker->dateTimeBetween('-3 years', '-1 year'),
            'pemeliharaan' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'harga' => $this->faker->numberBetween(100_000, 50_000_000),
            'kategori' => $this->faker->randomElement([
                'Elektronik',
                'Furniture',
                'ATK',
                'Kendaraan',
                'Peralatan',
            ]),
            'status' => $this->faker->randomElement([
                'Baik',
                'Rusak',
                'Pemeliharaan',                
            ]),
        ];
    }
}
