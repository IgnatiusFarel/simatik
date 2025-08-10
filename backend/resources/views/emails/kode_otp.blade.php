<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode OTP Verifikasi</title>
    <style>
        body {
            background-color: #f0f2f5;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .email-wrapper {
            max-width: 520px;
            margin: auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
        }
        .email-header {
            background: linear-gradient(135deg, #4f46e5, #3b82f6);
            color: #ffffff;
            text-align: center;
            padding: 25px 20px 15px;
        }
        .email-header img {
            width: 60px;
            margin-bottom: 10px;
        }
        .email-header h1 {
            font-size: 20px;
            margin: 0;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .email-body {
            padding: 25px;
            color: #333333;
            line-height: 1.6;
        }
        .otp-box {
            background-color: #f9fafb;
            border: 2px dashed #3b82f6;
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
        }
        .otp-code {
            font-size: 38px;
            font-weight: bold;
            color: #3b82f6;
            letter-spacing: 6px;
        }
        .note {
            font-size: 14px;
            color: #6b7280;
            margin-top: 10px;
        }
        .email-footer {
            background-color: #f9fafb;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- Header -->
        <div class="email-header">
            <!-- Icon Modern (Base64 SVG) -->
            <img src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSJ3aGl0ZSIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTEyIDIyYy01LjUxMiAwLTEwLTQuNDg4LTEwLTEwcyA0LjQ4OC0xMCAxMC0xMCAxMCA0LjQ4OCAxMCAxMC00LjQ4OCAxMC0xMCAxMHptMC0xOGMtNC40MTQgMC04IDMuNTg2LTggOHMzLjU4NiA4IDggOCA4LTMuNTg2IDgtOC0zLjU4Ni04LTgtOHptMCAxNC42Yy0zLjY5NiAwLTYuNi0yLjkwNC02LjYtNi42UzguMzA0IDYuNCAxMiA2LjRjMy42OTYgMCA2LjYgMi45MDQgNi42IDYuNnMtMi45MDQgNi42LTYuNiA2LjZ6Ii8+CiAgPHBhdGggZD0iTTEyIDcuNmMtMS4zMjggMC0yLjQtMS4wNzItMi40LTIuNFMxMC42NzIgMy44IDEyIDMuOHMyLjQgMS4wNzIgMi40IDIuNC0xLjA3MiAyLjQtMi40IDIuNHptMCAxLjJjMS44ODQgMCAzLjYgMC45NjggNC42IDEuNzIgMC42NzIgMC41MDQgMS4wNCAxLjMxMiAxLjA0IDIuMTI4di41NmMwIC4zMi0uMjYgLjU4LS41OC41OEg2Ljk0Yy0uMzIgMC0uNTgtLjI2LS41OC0uNTh2LS41NmMwLS44MTYuMzY4LTEuNjI0IDEuMDQtMi4xMjggMS0uNzUyIDIuNzE2LTEuNzIgNC42LTEuNzJ6Ii8+Cjwvc3ZnPg==" alt="OTP Icon" />

            <h1>Verifikasi Kode OTP</h1>
        </div>

        <!-- Body -->
        <div class="email-body">
            <p>Halo <strong>{{ $name }}</strong>,</p>
            <p>Kami menerima permintaan untuk verifikasi akun Anda. Silakan masukkan kode OTP berikut untuk melanjutkan:</p>

            <div class="otp-box">
                <div class="otp-code">{{ $otp }}</div>
            </div>

            <p class="note">
                Kode ini berlaku selama <strong>5 menit</strong>.  
                Demi keamanan akun Anda, jangan pernah membagikan kode ini kepada siapapun, termasuk pihak yang mengaku dari kami.
            </p>

            <p>Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini.</p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            &copy; {{ date('Y') }} Sistem Autentikasi. Semua hak dilindungi.
        </div>
    </div>
</body>
</html>
