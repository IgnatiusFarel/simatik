<?php 

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\MasterBarang;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller 
{
    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->query('page_size', 10);
            if (!in_array($perPage, [10, 25, 50, 100])) {
                $perPage = 10;
            }

            $data = MasterBarang::orderByDesc('updated_at')
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
    
     public function getAssetSummary(): JsonResponse
    {
        try {
            $total = MasterBarang::count();

            $baik = MasterBarang::where('status', 'Baik')->count();
            $rusak = MasterBarang::where('status', 'Rusak')->count();
            $pemeliharaan = MasterBarang::where('status', 'Pemeliharaan')->count();
           
            $percent = fn($jumlah) => $total > 0 ? round(($jumlah / $total) * 100, 2) : 0;

            return response()->json([
                'status' => true,
                'message' => 'Data ringkasan aset TIK berhasil diambil!',
                'data' => [
                    'total' => $total,
                    'baik' => [
                        'jumlah' => $baik,
                        'persen' => $percent($baik)
                    ],
                    'rusak' => [
                        'jumlah' => $rusak,
                        'persen' => $percent($rusak)
                    ],
                    'pemeliharaan' => [
                        'jumlah' => $pemeliharaan,
                        'persen' => $percent($pemeliharaan)
                    ],
                ]
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error fetching asset summary data: ' . $th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Data ringkasan aset TIK gagal diambil!'
            ], 500);
        }
    }
}