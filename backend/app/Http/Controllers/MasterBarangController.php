<?php

namespace App\Http\Controllers;

use App\Models\MasterBarang;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MasterBarangController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search = $request->query('search');
            $perPage = (int) $request->query('page_size', 10);
            if (!in_array($perPage, [10, 25, 50, 100])) {
                $perPage = 10;
            }

            $query = MasterBarang::query();

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('barang', 'like', '%' . $search . '%')
                        ->orWhere('seri', 'like', '%' . $search . '%');
                });
            }

            $data = $query->orderByDesc('updated_at')
                ->orderByDesc('created_at')
                ->paginate($perPage);

            return response()->json([
                'status' => true,
                'message' => 'Data barang berhasil diambil!',
                'data' => $data,
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error fetching master barang data: ' . $th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Data barang gagal diambil!'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $barang = MasterBarang::find($id);

            if (!$barang) {
                return response()->json([
                    'status' => false,
                    'message' => 'Data barang tidak ditemukan!'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Data barang berhasil diambil!',
                'data' => $barang
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error fetching master barang detail data: ' . $th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Data barang gagal diambil!',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'seri' => 'required|string|unique:master_barang,seri',
            'gambar' => 'required|image|mimes:jpeg,jpg,png|max:5120',
            'barang' => 'required|string',
            'pengadaan' => 'required|date',
            'pemeliharaan' => 'nullable|date',
            'harga' => 'required|numeric|min:0',
            'kategori' => 'required|string',
            'status' => 'required|in:Baik,Pemeliharaan,Rusak',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Data barang tidak valid!',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            if ($request->hasFile('gambar')) {
                $path = $request->file('gambar')->store('barang', 'public');
            } else {
                $path = null;
            }

            $barang = MasterBarang::create([
                'seri' => $request->seri,
                'gambar' => $path,
                'barang' => $request->barang,
                'pengadaan' => $request->pengadaan,
                'pemeliharaan' => $request->pemeliharaan,
                'harga' => $request->harga,
                'kategori' => $request->kategori,
                'status' => $request->status,
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Data barang berhasil dibuat!',
                'data' => $barang
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Error creating master barang data: ' . $th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Data barang gagal dibuat!',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $barang = MasterBarang::find($id);
        if (!$barang) {
            return response()->json([
                'status' => false,
                'message' => 'Data barang tidak ditemukan!'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'seri' => [
                'required',
                'string',
                Rule::unique('master_barang', 'seri')->ignore($id, 'master_barang_id'),
            ],
            'gambar' => [
                'sometimes',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120'
            ],
            'barang' => 'required|string',
            'pengadaan' => 'required|date',
            'pemeliharaan' => 'nullable|date',
            'harga' => 'required|numeric|min:0',
            'kategori' => 'required|string',
            'status' => 'required|in:Baik,Pemeliharaan,Rusak',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Data barang tidak valid!',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            if ($request->hasFile('gambar')) {
                $path = $request->file('gambar')->store('barang', 'public');
            } else {
                $path = $barang->gambar;
            }

            $barang->update([
                'seri' => $request->seri,
                'gambar' => $path,
                'barang' => $request->barang,
                'pengadaan' => $request->pengadaan,
                'pemeliharaan' => $request->pemeliharaan,
                'harga' => $request->harga,
                'kategori' => $request->kategori,
                'status' => $request->status,
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Data barang berhasil diperbarui!',
                'data' => $barang->refresh()
            ], 200);

        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Error updating master barang data: ' . $th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Data barang gagal diperbarui!',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $barang = MasterBarang::find($id);

        if (!$barang) {
            return response()->json([
                'status' => false,
                'message' => 'Data barang tidak ditemukan!'
            ], 404);
        }

        try {
            DB::transaction(function () use ($barang) {

                if ($barang->gambar && Storage::disk('public')->exists($barang->gambar)) {
                    Storage::disk('public')->delete($barang->gambar);
                }

                $barang->delete();
            });

            return response()->json([
                'status' => true,
                'message' => 'Data barang berhasil dihapus!'
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error deleting master barang data: ' . $th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Data barang gagal dihapus!',
                'error' => $th->getMessage()
            ], 500);
        }
    }
}
