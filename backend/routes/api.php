<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MasterUserController;
use App\Http\Controllers\MasterBarangController;
use App\Http\Controllers\ReportBarangController;

// 📁 Login & Forgot Password
Route::post('/login', [AuthController::class, 'login']); 
Route::post('/send-otp', [AuthController::class, 'sendOtp']);       
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);   
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // 📁 Dashboard 
    Route::prefix('dashboard')->controller(DashboardController::class)->group(function() {
        Route::get('/', 'index');
        Route::get('/asset', 'getAssetSummary');
    });
    
    // 📁 Master User 
    Route::prefix('master-user')->controller(MasterUserController::class)->group(function() {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::match(['put', 'post'], '/{id}', 'update'); 
        Route::delete('/{id}', 'destroy');
    });

    // 📁 Master Barang
    Route::prefix('master-barang')->controller(MasterBarangController::class)->group(function() {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::match(['put', 'post'], '/{id}', 'update'); 
        Route::delete('/{id}', 'destroy');
    });

    // 📁 Report Barang
    Route::prefix('report-barang')->controller(ReportBarangController::class)->group(function() {
        Route::get('/', 'index');
        Route::get('/print', 'print');
    });    
});
