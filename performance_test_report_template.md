# Panduan Dokumentasi Hasil Performance Test JMeter (Spreadsheet Template)

Dokumen ini merancang struktur tabel spreadsheet yang komprehensif dan detail untuk mencatat serta menganalisis hasil eksekusi uji performa JMeter pada CV Abba Barokah.

---

## 1. Struktur Kolom Tabel (Spreadsheet Columns)

Tabel berikut merinci seluruh kolom yang wajib ada dalam spreadsheet pelaporan hasil eksekusi pengujian:

| No | Nama Kolom | Tipe Data | Deskripsi Singkat |
|---|---|---|---|
| 1 | **Test Run ID** | Text / Code | ID unik untuk mengidentifikasi iterasi run pengujian (Format: `RUN-XXX`). |
| 2 | **Tanggal & Waktu Eksekusi** | DateTime | Kapan pengujian dijalankan (Format: `YYYY-MM-DD HH:mm`). |
| 3 | **Modul / Fitur** | Text (Dropdown) | Nama modul atau fitur yang diuji (misal: Dashboard, Kategori, Produk, dll.). |
| 4 | **Nama Endpoint/Sampler** | Text (Dropdown) | Nama request sampler JMeter yang dieksekusi. |
| 5 | **Method HTTP** | Text (Dropdown) | Metode HTTP request yang dikirimkan (GET, POST, dll.). |
| 6 | **Virtual Users (Threads)** | Integer | Jumlah pengguna virtual concurrent yang disimulasikan. |
| 7 | **Ramp-up Time (Detik)** | Integer | Durasi waktu yang dibutuhkan untuk mengaktifkan seluruh Virtual Users. |
| 8 | **Loop Count** | Integer / Text | Berapa kali setiap thread mengulangi skenario pengujian. |
| 9 | **Total Request** | Integer | Total request yang berhasil dikirim selama siklus run (`Threads * Loops`). |
| 10 | **Throughput (req/sec)** | Decimal | Jumlah request rata-rata yang dapat diproses server per detik. |
| 11 | **Avg Response Time (ms)** | Decimal | Waktu respons rata-rata (dalam milidetik) yang dibutuhkan untuk menyelesaikan request. |
| 12 | **Min Response Time (ms)** | Decimal | Waktu respons tercepat yang dicatat selama pengujian. |
| 13 | **Max Response Time (ms)** | Decimal | Waktu respons terlama yang dicatat selama pengujian. |
| 14 | **90th Percentile (ms)** | Decimal | Batas waktu respons di mana 90% dari total request selesai lebih cepat dari nilai ini. |
| 15 | **Error Rate (%)** | Percentage | Persentase request yang gagal atau menghasilkan assertion error (`Total Gagal / Total Request`). |
| 16 | **Status Kelulusan (Status)** | Text (Dropdown) | Status hasil run pengujian berdasarkan threshold SLA (Pass / Fail / Warn). |
| 17 | **Catatan / Catatan Error** | Text | Deskripsi error yang terjadi atau catatan analisis infrastruktur (misalnya: CPU spike 98%, Database locks). |

---

## 2. Penjelasan Deskriptif & Contoh Cara Pengisian

### A. Penjelasan Teknis Kolom & Formula Pengisian
- **Total Request**: Diisi otomatis menggunakan formula spreadsheet jika memungkinkan, atau diambil dari Summary Report JMeter.
- **Throughput**: Diambil langsung dari kolom "Throughput" pada Summary Report JMeter. Diukur dalam `requests/sec` atau `requests/min`.
- **90th Percentile**: Metrik paling representatif untuk kenyamanan pengguna nyata. Diambil dari kolom "90% Line" pada Summary Report JMeter.
- **Error Rate (%)**: Diisi dengan persentase error. Di spreadsheet, format sel sebagai `Percentage` dan gunakan rumus: 
  `=Jumlah_Gagal / Total_Request` atau masukkan angka desimal (misal `0.02` untuk 2.00%).
- **Status Kelulusan**: Status kelayakan performa berdasarkan SLA berikut:
  - **Pass**: Response Time 90th Percentile &lt; 2000ms dan Error Rate = 0%.
  - **Warning**: Response Time 90th Percentile antara 2000ms - 5000ms ATAU Error Rate antara 0.1% - 2%.
  - **Fail**: Response Time 90th Percentile &gt; 5000ms ATAU Error Rate &gt; 2%.

### B. Contoh Baris Pengisian (Mock Data)

| Test Run ID | Tanggal & Waktu Eksekusi | Modul / Fitur | Nama Endpoint/Sampler | Method HTTP | Virtual Users (Threads) | Ramp-up Time (Detik) | Loop Count | Total Request | Throughput (req/sec) | Avg Response Time (ms) | Min Response Time (ms) | Max Response Time (ms) | 90th Percentile (ms) | Error Rate (%) | Status | Catatan / Catatan Error |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `RUN-001` | `2026-06-14 10:00` | `Dashboard` | `GET Dashboard Page` | `GET` | 50 | 10 | 5 | 250 | 22.5 | 450.2 | 120 | 1200 | 780.0 | 0.00% | `Pass` | Server stabil, query agregat aman. |
| `RUN-002` | `2026-06-14 10:15` | `Product Search` | `POST Livewire Product Search` | `POST` | 30 | 5 | 1 | 30 | 5.8 | 1850.4 | 300 | 4500 | 2900.0 | 0.00% | `Warning` | Kecepatan respons menurun di 90th percentile, butuh indeks di kolom pencarian. |
| `RUN-003` | `2026-06-14 10:30` | `Order Management` | `GET Orders Page` | `GET` | 40 | 10 | 1 | 40 | 3.2 | 5200.0 | 800 | 9500 | 8200.0 | 5.00% | `Fail` | Terjadi timeout database, terdeteksi N+1 query pada relasi table. |
| `RUN-004` | `2026-06-14 10:45` | `Category Creation` | `POST Livewire Create Category` | `POST` | 20 | 5 | 1 | 20 | 4.0 | 320.5 | 150 | 800 | 450.0 | 0.00% | `Pass` | Write performance stabil, lock database aman. |

---

## 3. Rekomendasi Validasi Data Dropdown (Data Validation)

Untuk meminimalkan kesalahan input data (human error) dan memastikan konsistensi laporan, beberapa kolom wajib dikonfigurasi menggunakan fitur **Data Validation (Dropdown List)** pada Google Sheets atau Microsoft Excel:

### A. Dropdown 1: Modul / Fitur (`Modul / Fitur`)
Membatasi area fitur sistem Filament yang sedang diuji.
- **Opsi Pilihan**:
  1. `Dashboard`
  2. `Product Search`
  3. `Order Management`
  4. `Category Creation`
  5. `Authentication Setup`

### B. Dropdown 2: Nama Endpoint/Sampler (`Nama Endpoint/Sampler`)
Konsistensi penamaan endpoint yang diuji agar mudah dikelompokkan (grouping).
- **Opsi Pilihan**:
  1. `M1: GET Login Page`
  2. `M1: POST Livewire Login`
  3. `GET Dashboard Page`
  4. `GET Product List Page`
  5. `POST Livewire Product Search`
  6. `GET Orders Page`
  7. `GET Create Category Page`
  8. `POST Livewire Create Category`

### C. Dropdown 3: Method HTTP (`Method HTTP`)
Membatasi metode protokol HTTP.
- **Opsi Pilihan**:
  1. `GET`
  2. `POST`
  3. `PUT`
  4. `DELETE`
  5. `PATCH`

### D. Dropdown 4: Status Kelulusan (`Status`)
Menentukan kelayakan performa berdasarkan SLA target.
- **Opsi Pilihan**:
  1. `Pass` (Berwarna hijau)
  2. `Warning` (Berwarna kuning)
  3. `Fail` (Berwarna merah)
  *(Saran: Gunakan Conditional Formatting di spreadsheet untuk otomatis mewarnai sel sesuai status).*
