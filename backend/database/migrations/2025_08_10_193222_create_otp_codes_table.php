<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOtpCodesTable extends Migration
{    
    public function up(): void
    {
        Schema::create('otp_codes', function (Blueprint $table) {
            $table->uuid('otp_codes_id')->primary();
            $table->string('email')->index();
            $table->string('otp', 4);
            $table->timestamp('expires_at');
            $table->timestamps();

            $table->index(['email', 'otp']);
        });
    }
 
    public function down(): void
    {
        Schema::dropIfExists('otp_codes');
    }
};
