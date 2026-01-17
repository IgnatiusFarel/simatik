<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\MasterBarang;

class MasterBarangSeeder extends Seeder
{
    public function run(): void
    {
        // MasterBarang::truncate();

        // $data = [];
        // for ($i = 1; $i <= 10; $i++) {
        //     $data[] = [
        //         'master_barang_id' => (string) Str::uuid(),
        //         'seri'            => 'SR-' . str_pad($i, 3, '0', STR_PAD_LEFT),
        //         'gambar'          => 'default.png',
        //         'barang'          => 'Barang Dummy ' . $i,
        //         'pengadaan'       => now()->subYears(rand(0, 3))->toDateString(),
        //         'pemeliharaan'    => rand(0, 1) ? now()->subMonths(rand(1, 6))->toDateString() : null,
        //         'harga'           => rand(1000000, 5000000),
        //         'kategori'        => 'Kategori ' . rand(1, 3),
        //         'status'          => ['Baik', 'Pemeliharaan', 'Rusak'][array_rand(['Baik', 'Pemeliharaan', 'Rusak'])],
        //         'created_at'      => now(),
        //         'updated_at'      => now(),
        //     ];
        // }

        // MasterBarang::insert($data);
        MasterBarang::factory()->count(50)->create();
    }
}
