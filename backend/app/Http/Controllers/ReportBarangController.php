<?php 

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Models\MasterBarang;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportBarangController extends Controller 
{
    public function print(Request $request) 
    {
        try {
            $query = MasterBarang::query();

            if ($request->filled('kategori')) {
                $query->where('kategori', $request->kategori);
            }

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            if ($request->filled('from') && $request->filled('to')) {
                $query->whereBetween('pengadaan', [$request->from, $request->to]);
            }

            $barang = $query->orderBy('barang')->get(); 
            $pdf = PDF::loadView('reports.barang', ['barang' => $barang]);

            return $pdf->download('report-barang.pdf');
        } catch (\Throwable $th) {
            Log::error('Error generating report barang: ' . $th->getMessage());
            return response()->json([
                'status'  => false,
                'message' => 'Data report barang gagal diprint!'
            ], 500);
        }
    }
}