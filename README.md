# SITTA UT - Pemesanan dan Distribusi Bahan Ajar

Aplikasi web sederhana untuk mengelola bahan ajar Universitas Terbuka (UT). Aplikasi ini dibuat menggunakan HTML, CSS, JavaScript, dan Vue 2, dengan data awal dari file JSON lokal.

## Fitur

- Melihat dan mengelola stok bahan ajar, termasuk filter, pengurutan, dan status stok.
- Mencari serta memperbarui riwayat pelacakan Delivery Order (DO).
- Membuat DO baru berdasarkan paket bahan ajar dan pilihan ekspedisi.

## Persyaratan

- Browser modern dengan koneksi internet untuk memuat Vue 2 dari CDN.
- Python 3 untuk menjalankan server lokal (atau server web statis lain).

## Instalasi dan Menjalankan

1. Unduh atau clone repositori ini, lalu buka terminal di direktori proyek.
2. Jalankan server HTTP lokal:

   ```bash
   python -m http.server 8000
   ```

   Jika perintah `python` tidak tersedia, coba `py -m http.server 8000` di Windows atau `python3 -m http.server 8000` di macOS/Linux.

3. Buka [http://localhost:8000](http://localhost:8000) di browser.
4. Untuk berhenti, tekan `Ctrl+C` pada terminal yang menjalankan server.

Tidak ada proses build atau instalasi dependency tambahan. Jalankan melalui server lokal agar browser dapat mengambil `data/dataBahanAjar.json`; jika `index.html` dibuka langsung sebagai file, browser mungkin memblokir pengambilan data tersebut.

## Struktur Proyek

```text
.
├── index.html
├── assets/
│   └── css/
│       └── style.css
├── data/
│   └── dataBahanAjar.json
├── js/
│   ├── app.js
│   ├── services/
│   │   └── api.js
│   └── components/
│       ├── app-modal.js
│       ├── do-tracking.js
│       ├── order-form.js
│       ├── status-badge.js
│       └── stock-table.js
└── templates/
    ├── app-modal.html
    ├── do-tracking.html
    ├── order-form.html
    ├── status-badge.html
    └── stock-table.html
```

### Deskripsi

- `index.html` - halaman utama, navigasi, dan template Vue yang digunakan aplikasi.
- `assets/css/style.css` - aturan gaya dan tata letak halaman.
- `data/dataBahanAjar.json` - data awal untuk stok, kategori, paket, ekspedisi, dan tracking DO.
- `js/app.js` - membuat instance Vue, memformat data, memuat data awal, dan menghubungkan tab aplikasi.
- `js/services/api.js` - mengambil data JSON dan menyediakan data mock jika pengambilan gagal.
- `js/components/` - logika komponen Vue untuk modal konfirmasi, tracking DO, form pemesanan, badge status stok, dan tabel stok.
- `templates/` - fragmen HTML template komponen yang disimpan terpisah.


**Creator:** Radendy Bahtiar