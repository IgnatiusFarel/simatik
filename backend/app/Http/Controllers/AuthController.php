<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'login' => 'required|string',
                'password' => 'required|string|min:8',
                'remember' => 'nullable|boolean',
            ]);

            $user = User::where('username', $credentials['login'])
                ->orWhere('email', $credentials['login'])
                ->first();

            if (!$user || !Hash::check($credentials['password'], $user->password)) {
                throw ValidationException::withMessages([
                    'login' => ['Username atau password salah.'],
                ]);
            }

            if (strtolower(str_replace(' ', '', $user->role)) !== 'superadmin') {
                return response()->json([
                    'status' => false,
                    'message' => 'Hanya Superadmin yang dapat login'
                ], 403);
            }

            $tokenName = 'auth_token';
            $expire = $request->boolean('remember') ? now()->addDays(3) : now()->addDay();
            $token = $user->createToken($tokenName, ['*'], $expire)->plainTextToken;

            return response()->json([
                'status' => true,
                'message' => 'Login berhasil',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                    'expired_at' => $expire
                ]
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error login user: ' . $th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Login gagal!',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'status' => true,
                'message' => 'Logout berhasil'
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error logout user: ' . $th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Logout gagal!',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function sendOtp(Request $request)
    {
        try {

            $request->validate([
                'email' => 'required|email'
            ]);

            $user = User::where('email', $request->email)->first();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email tidak terdaftar, silahkan hubungi superadmin'
                ], 404);
            }

            $otp = rand(1000, 9999);

            DB::table('otp_codes')->where('email', $request->email)->delete();
            DB::table('otp_codes')->insert([
                'otp_codes_id' => Str::uuid(),
                'email' => $request->email,
                'otp' => $otp,
                'created_at' => now(),
                'expires_at' => now()->addMinutes(5)
            ]);

            Mail::send('emails.kode_otp', [
                'otp' => $otp,
                'name' => $user->name
            ], function ($message) use ($user) {
                $message->to($user->email);
                $message->subject('Kode OTP Reset Password');
            });

            return response()->json([
                'status' => true,
                'message' => 'Kode OTP telah berhasil dikirim ke email Anda'
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Kode OTP gagal dikirim!',
                'error' => $th->getMessage()
            ], 500);
        }
    }


    public function verifyOtp(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'otp' => 'required|digits:4'
            ]);

            $otpRecord = DB::table('otp_codes')->where('email', $request->email)->where('otp', $request->otp)->first();

            if (!$otpRecord) {
                return response()->json([
                    'status' => false,
                    'message' => 'Kode OTP salah!'
                ], 400);
            }

            if (now()->greaterThan($otpRecord->expires_at)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Kode OTP sudah kedaluwarsa!'
                ], 400);
            }

            return response()->json([
                'status' => true,
                'message' => 'Kode OTP valid!'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Kode OTP tidak valid!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'otp' => 'required|digits:4',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $otpRecord = DB::table('otp_codes')->where('email', $request->email)->where('otp', $request->otp)->first();

            if (!$otpRecord) {
                return response()->json([
                    'status' => false,
                    'message' => 'Kode OTP salah!'
                ], 400);
            }

            if (Carbon::now()->greaterThan(Carbon::parse($otpRecord->expires_at))) {
                return response()->json([
                    'status' => false,
                    'message' => 'Kode OTP sudah kedaluwarsa'
                ], 400);
            }

            $user = User::where('email', $request->email)->first();
            $user->password = Hash::make($request->password);
            $user->save();

            DB::table('otp_codes')->where('email', $request->email)->delete();

            return response()->json([
                'status' => true,
                'message' => 'Password berhasil diubah!'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Password gagal diubah!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
