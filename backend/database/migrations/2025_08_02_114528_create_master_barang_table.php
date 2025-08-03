<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMasterBarangTable extends Migration
{
    public function up(): void
    {
        Schema::create('master_barang', function (Blueprint $table) {
            $table->uuid( 'master_barang_id')->primary(); ;
            $table->string('seri');
            $table->string('gambar');
            $table->string('barang');
            $table->date('pengadaan');
            $table->date('pemeliharaan')->nullable();
            $table->decimal('harga', 15, 2)->default(0);
            $table->string('kategori');
            $table->enum('status', ['Baik', 'Pemeliharaan', 'Rusak']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_barang');
    }
};
