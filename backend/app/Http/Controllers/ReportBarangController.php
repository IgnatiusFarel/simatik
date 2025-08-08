<?php 

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Models\MasterBarang;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportBarangController extends Controller 
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
 public function print(Request $request) 
{
    try {
        $query = MasterBarang::query();

        if ($request->filled('from') && $request->filled('to')) {
            $query->whereBetween('pengadaan', [$request->from, $request->to]);
        }

        $barang = $query->orderBy('barang')->get(); 

        if ($barang->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Tidak ada data pada rentang tanggal tersebut!'
            ], 200);
        }

        Log::info('Jumlah barang: ' . $barang->count());

        $pdf = PDF::loadView('pdf.report_barang', ['data' => $barang])
                  ->setPaper('A4', 'portrait')
                  ->setOptions(['isRemoteEnabled' => true]);

        $pdf->getDomPDF()->getOptions()->setChroot(public_path());
        
        // return $pdf->download('report-barang.pdf');
        return $pdf->stream('report-barang.pdf');

    } catch (\Throwable $th) {
        Log::error('Error generating report barang: ' . $th->getMessage());

        return response()->json([
            'status'  => false,
            'message' => 'Data report barang gagal diprint!'
        ], 500);
    }
}


}