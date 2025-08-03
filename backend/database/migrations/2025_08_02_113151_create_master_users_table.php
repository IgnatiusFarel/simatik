<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMasterUsersTable extends Migration
{
    public function up(): void
    {
        Schema::create('master_users', function (Blueprint $table) {
            $table->uuid('master_user_id')->primary(); ;
            $table->uuid('user_id');
            $table->string('foto');
            $table->string('nama');
            $table->string('skpd');
            $table->enum('status', ['Aktif', 'Suspend', 'Tidak Aktif'])->default('Aktif');            
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('master_users');
    }
};
