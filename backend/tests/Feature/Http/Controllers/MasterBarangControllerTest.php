<?php

namespace Tests\Feature\Http\Controllers;

use Tests\TestCase;
use App\Models\MasterBarang;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MasterBarangControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_it_can_store_master_barang()
    {
        $payload = [
            'seri' => 'SER-001',
            'gambar' => UploadedFile::fake()->image('laptop.png'),
            'barang' => 'Laptop Lenovo',
            'kategori' => 'Elektronik',
            'harga' => 15000000,
            'status' => 'Baik',
            'pengadaan' => now()->toDateString(),
        ];

        $response = $this->withoutMiddleware()
            ->postJson('/api/master-barang', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('master_barang', ['seri' => 'SER-001']);

        $barang = MasterBarang::first();
        Storage::disk('public')->assertExists($barang->gambar);
    }

    public function test_it_fails_to_store_if_data_invalid()
    {
        $response = $this->withoutMiddleware()
            ->postJson('/api/master-barang', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['seri', 'barang', 'gambar', 'harga']);
    }

    public function test_it_can_show_master_barang_detail()
    {
        $barang = MasterBarang::factory()->create();

        $response = $this->withoutMiddleware()
            ->getJson("/api/master-barang/{$barang->getKey()}");

        $response->assertStatus(200)
            ->assertJsonPath('data.seri', $barang->seri);
    }

    public function test_it_can_update_master_barang()
    {
        $barang = MasterBarang::factory()->create(['barang' => 'Barang Lama']);

        $payload = [
            'seri' => $barang->seri,
            'barang' => 'Barang Diperbarui',
            'kategori' => 'Elektronik',
            'harga' => 20000000,
            'status' => 'Baik',
            'pengadaan' => now()->toDateString(),
            '_method' => 'PUT'
        ];

        $response = $this->withoutMiddleware()
            ->postJson("/api/master-barang/{$barang->getKey()}", $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('master_barang', [
            'master_barang_id' => $barang->getKey(),
            'barang' => 'Barang Diperbarui'
        ]);
    }

    public function test_it_can_delete_master_barang()
    {
        $barang = MasterBarang::factory()->create();

        $response = $this->withoutMiddleware()
            ->deleteJson("/api/master-barang/{$barang->getKey()}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('master_barang', [
            'master_barang_id' => $barang->getKey()
        ]);
    }

    public function test_it_returns_404_if_barang_not_found()
    {
        $response = $this->withoutMiddleware()
            ->getJson('/api/master-barang/99999');

        $response->assertStatus(404);
    }
}