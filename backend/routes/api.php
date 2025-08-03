<?php

use App\Http\Controllers\MasterUserController;
use App\Http\Controllers\MasterBarangController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReportBarangController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']); 
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // 📁 Master User 
    Route::prefix('master-user')->controller(MasterUserController::class)->group(function() {
       Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

    // 📁 Master Barang
    Route::prefix('master-barang')->controller(MasterBarangController::class)->group(function() {
       Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

    Route::get('/report-barang', [ReportBarangController::class, 'print']);
});
