<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\MasterUser;
use App\Models\User;

class MasterUserController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->query('page_size', 10);

            if (!in_array($perPage, [10, 25, 50, 100])) {
                $perPage = 10;
            }

            $users = MasterUser::with('user')->orderByDesc('updated_at')->orderByDesc('created_at')->paginate($perPage);
            return response()->json([
                'status' => true,
                'message' => 'Data user berhasil diambil!',
                'data' => $users,
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error fetching user data: ' . $th->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Data user gagal diambil!'
            ], 500);
        }
    }

   public function store(Request $request)
    {
         $validator = Validator::make($request->all(), [
            'id'       => 'required|string|unique:master_users,id',
            'foto'     => 'required|image|mimes:jpeg,jpg,png|max:5120',
            'nama'     => 'required|string',
            'username' => 'required|string|unique:users,username',
            'email'    => 'required|email|unique:users,email',
            'password' => 'nullable|string|min:8',
            'role'     => 'required|string',
            'skpd'     => 'required|string',
            'status'   => 'required|in:Aktif,Suspend,Tidak Aktif',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => 'Data user tidak valid!',
                'errors'  => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $path = $request->hasFile('foto')
                ? $request->file('foto')->store('user', 'public')
                : null;          

            $user = User::create([
                'username' => $request->username,
                'email'    => $request->email,
                'password' => $request->password ? Hash::make($request->password) : null,
                'role'     => $request->role,
            ]);

           $masterUser = MasterUser::create([
                'user_id' => $user->user_id,
                'id'      => $request->id,  
                'foto'    => $path,
                'nama'    => $request->nama,
                'skpd'    => $request->skpd,
                'status'  => $request->status,
            ]);

            DB::commit();

            return response()->json([
                'status'  => true,
                'message' => 'Data user berhasil dibuat!',
                'data'    => $masterUser->load('user')
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Error creating user data: ' . $th->getMessage());
            return response()->json([
                'status'  => false,
                'message' => 'Data user gagal dibuat!',
                'error'   => $th->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = MasterUser::with('user')->find($id);

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Data user tidak ditemukan!'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $user,
                'message' => 'Data user berhasil diambil!'
            ], 200);
        } catch (\Throwable $th) {
            \Log::error('Error fetching user detail data: ' . $th->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Data user gagal diambil!'
            ], 500);
        }
    }

      public function update(Request $request, $id)
    {
        $masterUser = MasterUser::with('user')->find($id);
        if (!$masterUser) {
            return response()->json([
                'status'  => false,
                'message' => 'Data user tidak ditemukan!'
            ], 404);
        }

       $validator = Validator::make($request->all(), [
            'username' => 'required|string|unique:users,username,' . $masterUser->user->user_id . ',user_id',
            'email'    => 'required|email|unique:users,email,' . $masterUser->user->user_id . ',user_id',
            'password' => 'nullable|string|min:6',
            'role'     => 'required|string',
            'foto'     => 'nullable|image|mimes:jpeg,jpg,png|max:5120',
            'nama'     => 'required|string',
            'skpd'     => 'required|string',
            'status'   => 'required|in:Aktif,Suspend,Tidak Aktif',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => 'Data user tidak valid!',
                'errors'  => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $path = $request->hasFile('foto')
                ? $request->file('foto')->store('user', 'public')
                : $masterUser->foto;

          $masterUser->user()->update([
                'username' => $request->username,
                'email'    => $request->email,
                'password' => $request->password ? Hash::make($request->password) : $masterUser->user->password,
                'role'     => $request->role,
            ]);

             $masterUser->update([
                'foto'   => $path,
                'nama'   => $request->nama,
                'skpd'   => $request->skpd,
                'status' => $request->status,
            ]);


            DB::commit();
            return response()->json([
                'status'  => true,
                'message' => 'Data user berhasil diperbarui!',
                'data'    => $masterUser->refresh()->load('user')
            ], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Error updating user data: ' . $th->getMessage());
            return response()->json([
                'status'  => false,
                'message' => 'Data user gagal diperbarui!',
                'error'   => $th->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = MasterUser::find($id);

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Data user tidak ditemukan!'
                ], 404);
            }

            $user->user()->delete();
            $user->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Data user berhasil dihapus!'
            ], 200);
        } catch (\Throwable $th) {
            \Log::error('Error deleting user data: ' . $th->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Data user gagal dihapus!'
            ], 500);
        }
    }

}
