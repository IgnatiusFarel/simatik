<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Laporan Aset Barang</title>
    <style>
        @page {
            margin: 20mm;
            size: A4;
        }

        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }

        .header h2 {
            margin: 0 0 10px 0;
            font-size: 16px;
            font-weight: bold;
        }

        .header p {
            margin: 0;
            font-size: 12px;
            color: #666;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            margin-top: 10px;
        }

        th,
        td {
            border: 1px solid #333;
            padding: 8px 4px;
            text-align: left;
            vertical-align: middle;
            word-wrap: break-word;
        }

        th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
            font-size: 10px;
        }

        td {
            font-size: 9px;
        }

        .col-no {
            width: 5%;
        }

        .col-gambar {
            width: 10%;
        }

        .col-seri {
            width: 12%;
        }

        .col-barang {
            width: 17%;
        }

        .col-pengadaan {
            width: 13%;
        }

        .col-pemeliharaan {
            width: 15%;
        }

        .col-harga {
            width: 13%;
        }

        .col-kategori {
            width: 11%;
        }

        .col-status {
            width: 14%;
        }

        .img-container {
            text-align: center;
            padding: 2px;
        }

        .asset-image {
            max-width: 50px;
            max-height: 50px;
            width: auto;
            height: auto;
            object-fit: cover;
            border: 1px solid #ddd;
            display: block;
            margin: 0 auto;
        }

        .no-image {
            color: #999;
            font-style: italic;
            text-align: center;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .status-baik {
            color: #28a745;
            font-weight: bold;
        }

        .status-rusak {
            color: #dc3545;
            font-weight: bold;
        }

        .status-pemeliharaan {
            color: #ffc107;
            font-weight: bold;
        }

        .no-data {
            text-align: center;
            font-style: italic;
            color: #666;
            padding: 20px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h2>LAPORAN ASET BARANG</h2>
        <p><strong>Total Data:</strong> {{ $data->count() }} Barang</p>
        <p><strong>Tanggal Cetak:</strong> {{ \Carbon\Carbon::now()->format('d F Y, H:i:s') }} WIB</p>
    </div>

    <table>
        <thead>
            <tr>
                <th class="col-no">No.</th>
                <th class="col-seri">Nomor Seri Barang</th>
                <th class="col-gambar">Gambar Barang</th>
                <th class="col-barang">Nama Barang</th>
                <th class="col-pengadaan">Tanggal Pengadaan Barang</th>
                <th class="col-pemeliharaan">Tanggal Pemeliharaan Barang</th>
                <th class="col-harga">Harga Barang</th>
                <th class="col-kategori">Kategori Barang</th>
                <th class="col-status">Status Barang</th>
            </tr>
        </thead>
        <tbody>
            @forelse($data as $item)
                <tr>
                    <td class="text-center">{{ $loop->iteration }}</td>
                    <td>{{ $item->seri ?? '-' }}</td>
                    <td class="img-container">
                        @if(!empty($item->gambar) && file_exists(storage_path('app/public/' . $item->gambar)))
                            <img src="{{ storage_path('app/public/' . $item->gambar) }}" width="50">
                        @else
                            <span class="no-image">Tidak ada gambar barang</span>
                        @endif
                    </td>
                    <td>{{ $item->barang ?? '-' }}</td>
                    <td class="text-center">
                        {{ !empty($item->pengadaan) ? \Carbon\Carbon::parse($item->pengadaan)->format('d/m/Y') : '-' }}
                    </td>
                    <td class="text-center">
                        {{ !empty($item->pemeliharaan) ? \Carbon\Carbon::parse($item->pemeliharaan)->format('d/m/Y') : '-' }}
                    </td>
                    <td class="text-right">
                        {{ !empty($item->harga) ? 'Rp ' . number_format($item->harga, 0, ',', '.') : '-' }}
                    </td>
                    <td>{{ $item->kategori ?? '-' }}</td>
                    <td class="text-center">
                        @php
                            $status = $item->status ?? '';
                            if ($status === 'Baik') {
                                $statusClass = 'status-baik';
                            } elseif ($status === 'Rusak') {
                                $statusClass = 'status-rusak';
                            } elseif ($status === 'Pemeliharaan') {
                                $statusClass = 'status-pemeliharaan';
                            }

                        @endphp
                        <span class="{{ $statusClass }}">{{ ucfirst($item->status ?? '-') }}</span>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" class="no-data">Tidak ada data barang untuk ditampilkan</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>

</html>