<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // ==================== LOGIN ====================
    public function login(Request $request)
    {
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
                'username' => ['Username atau password salah.'],
            ]);
        }

        // ROLE WAJIB SUPERADMIN
        if (strtolower(str_replace(' ', '', $user->role)) !== 'superadmin') {
            return response()->json([
                'status' => false,
                'message' => 'Hanya Superadmin yang dapat login'
            ], 403);
        }

        $tokenName = 'auth_token';
        $expire = $request->boolean('remember') ? now()->addDays(3) : now()->addHours(2);
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
    }

    // ==================== LOGOUT ====================
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Logout berhasil'
        ], 200);
    }

    // ==================== FORGOT PASSWORD ====================
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        if ($status == Password::RESET_LINK_SENT) {
            return response()->json([
                'status' => true,
                'message' => 'Link reset password telah dikirim ke email'
            ], 200);
        }

        return response()->json([
            'status' => false,
            'message' => 'Email tidak ditemukan'
        ], 404);
    }

    // ==================== RESET PASSWORD ====================
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->setRememberToken(Str::random(60));
                $user->save();
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json([
                'status' => true,
                'message' => 'Password berhasil direset'
            ], 200);
        }

        return response()->json([
            'status' => false,
            'message' => 'Token reset password tidak valid atau sudah kedaluwarsa'
        ], 400);
    }
}
