# JMeter Load Test Plan - CV Abba Barokah Admin Panel

Rencana pengujian beban (Load Testing) komprehensif ini dirancang khusus untuk menguji performa Sistem Administrasi E-Commerce berbasis Laravel 11 dan Filament 3.

## Prasyarat
- Apache JMeter 5.6+
- Java Runtime Environment (JRE) atau JDK 8+ terinstal di sistem
- Base URL aplikasi target (`http://localhost:8000`) harus berjalan dan dapat diakses

## Konfigurasi Variabel
Sebelum memulai pengujian, Anda dapat membuka file `cv-abba-barokah-loadtest.jmx` di JMeter GUI untuk mengonfigurasi **User Defined Variables** atau mengubahnya secara langsung di bagian atas file JMX menggunakan text editor:
- `PROTOCOL`: `http` atau `https`
- `HOST`: `localhost` atau IP/Domain server target
- `PORT`: `8000` (sesuaikan dengan port server Laravel)
- `ADMIN_EMAIL`: `admin@example.com` (kredensial admin untuk login)
- `ADMIN_PASSWORD`: `password`

---

## Eksekusi Pengujian via CLI (Non-GUI Mode)

Menjalankan pengujian dalam mode GUI sangat tidak disarankan karena mengonsumsi banyak resource (CPU & Memory) yang dapat memengaruhi keakuratan hasil pengujian. Selalu gunakan CLI (Non-GUI Mode) untuk pengujian yang sesungguhnya.

### Perintah Dasar Eksekusi
Buka terminal/command prompt pada direktori repositori ini, lalu jalankan perintah berikut:

```bash
jmeter -n -t cv-abba-barokah-loadtest.jmx -l results.jtl
```

### Perintah Eksekusi + Pembuatan HTML Dashboard Report
Untuk menghasilkan laporan visual interaktif (HTML Dashboard Report) secara langsung setelah pengujian selesai, gunakan perintah berikut:

```bash
jmeter -n -t cv-abba-barokah-loadtest.jmx -l results.jtl -e -o dashboard_report
```

### Penjelasan Parameter Command Line:
* `-n`: Menjalankan JMeter dalam mode **Non-GUI** (CLI).
* `-t <path_to_jmx>`: Menentukan lokasi file skenario JMeter (`.jmx`) yang akan dijalankan.
* `-l <path_to_jtl>`: Menyimpan data log metrik mentah hasil pengujian ke file `.jtl` (JMeter Text Log).
* `-e`: Menginstruksikan JMeter untuk men-generate HTML Dashboard Report setelah eksekusi selesai.
* `-o <path_to_folder>`: Menentukan folder output tempat HTML Dashboard Report akan disimpan (pastikan folder target kosong atau belum ada sebelum dijalankan).

---

## Detail Skenario Modul Pengujian

1. **Autentikasi Dinamis (Livewire & CSRF)**:
   Setiap thread dalam masing-masing Thread Group menggunakan `Once Only Controller` untuk melakukan autentikasi sekali di awal iterasi thread.
   - Melakukan request `GET /admin/login`.
   - Mengekstrak token `@csrf` Laravel dari DOM HTML.
   - Mengekstrak `wire:snapshot` dari form login Livewire.
   - Menggunakan JSR223 Groovy PostProcessor untuk membersihkan snapshot JSON (menghilangkan HTML entity `&quot;` dan meng-escape karakter backslash `\`).
   - Melakukan request `POST /livewire/update` dengan payload Livewire asli berisi kredensial dan snapshot ter-escape.
   - JMeter `HTTP Cookie Manager` akan mempertahankan session cookie `laravel_session` di sepanjang iterasi thread.

2. **Module 1: Dashboard Load (GET `/admin/dashboard`)**:
   - Beban: 50 Virtual Users, Ramp-up: 10 detik, Loop: 5 (Total 250 request dashboard).
   - Tujuan: Menguji keandalan server saat melayani query agregasi Eloquent secara konkuren (Stats, Latest Orders, Latest Products).

3. **Module 2: Product Livewire Search (POST `/livewire/update`)**:
   - Beban: 30 Virtual Users, Ramp-up: 5 detik, Loop: 1.
   - Alur: Mengambil snapshot tabel produk dari `GET /admin/products`, lalu mengirimkan request Livewire Search dengan parameter pencarian `tableSearch = "Sepatu"`.
   - Tujuan: Menguji waktu respons pencarian dinamis (like-queries) dan filter database di bawah tekanan.

4. **Module 3: Order Management (GET `/admin/orders`)**:
   - Beban: 40 Virtual Users, Ramp-up: 10 detik, Loop: 1.
   - Tujuan: Memverifikasi optimasi relasi database (eager loading `with(['user', 'items.product', 'payment'])`) saat merender data tabular kompleks di bawah tekanan untuk mendeteksi N+1 query issues.

5. **Module 4: Category Creation (POST `/livewire/update`)**:
   - Beban: 20 Virtual Users, Loop: 1.
   - Alur: Mengambil snapshot form category dari `GET /admin/categories/create`, lalu submit data kategori dengan nama dinamis menggunakan fungsi `${__RandomString(8,abcdefghijklmnopqrstuvwxyz)}`.
   - Tujuan: Menguji performa penulisan data (write performance) dan database locking.

---

## Assertions
Setiap sampler pengujian diikat secara global dengan assertions berikut:
- **Assert HTTP 200 OK or 302**: Memastikan status code yang dikembalikan adalah sukses (200) atau redirect (302).
- **Assert No Livewire Error**: Memeriksa konten respons untuk memastikan tidak mengandung string `"Livewire Error"` atau `"Error"` (mencegah error fungsionalitas Livewire yang lolos dengan HTTP status 200).
