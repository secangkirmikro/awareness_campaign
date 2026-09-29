# Microsite Mikro Berintegritas — Beranda & Katalog

Beranda menampilkan pembuka dan tepat satu campaign harian. Halaman katalog menampilkan seluruh materi dengan filter Semua materi / Poster / Video. Perpindahan halaman memakai dua tab sederhana tanpa header logo. Warna mengikuti navy #003D79, off-white, dan yellow #FFB700.

Sumber: Katalog_Mikro_Berintegritas.xlsx yang diberikan pengguna. Caption dan urutan diambil dari sheet Katalog Konten. Setiap Sorotan = Ya diberi label Pilihan, tanpa mengubah urutan.

## Buka
Buka index.html untuk preview lokal. Untuk menjalankan lewat server dengan Python 3: `python -m http.server 8081`, kemudian buka http://localhost:8081.

## Update lewat Excel
1. Edit Katalog_Mikro_Berintegritas.xlsx, tambahkan baris ke tabel di sheet Katalog Konten.
2. Pertahankan urutan kolom A–I. ID dimulai MB- dan harus unik. Jenis Media: Gambar atau Video.
3. Simpan dan jalankan `python tools/update-content.py` (Python 3, tanpa library tambahan).
4. Upload content.js yang dihasilkan ke GitHub. File Excel sendiri tidak dibaca otomatis oleh browser.
5. Refresh situs setelah deployment selesai.

Bisa juga memakai file Excel di lokasi lain: `python tools/update-content.py "D:/2026/SOR/Katalog_Mikro_Berintegritas.xlsx"`.

## GitHub Pages
Upload isi folder ini ke repository. Pada Settings → Pages pilih Deploy from a branch, branch main, /(root), lalu Save. URL situs ditampilkan oleh GitHub setelah deployment. Panduan resmi: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Media Drive
Thumbnail dimuat dari Google Drive dan modal memakai preview Drive untuk gambar/video. Izin akses Drive tetap berlaku. Jika thumbnail tidak dapat dimuat, kartu tetap menampilkan judul dan tombol buka. Tautan Buka di Google Drive tersedia pada modal. Tidak ada perubahan izin berbagi yang dilakukan.

Poster Ditambal Terus menggunakan salinan lokal yang sudah diberikan sebelumnya sebagai thumbnail. Poster lain dan video memerlukan internet. Preview Drive belum dapat diverifikasi dari lingkungan pengerjaan. Pastikan akun pengunjung memiliki akses ke media. GitHub Pages biasa tidak memberikan pembatasan akses internal.

## Berkas
- index.html: beranda dengan satu campaign harian.
- content.js: data hasil ekspor Excel.
- app.js: filter, kartu, modal, fallback media.
- styles.css dan catalog.css: tampilan responsif.
- tools/update-content.py: konversi Excel tanpa library tambahan.
- Katalog_Mikro_Berintegritas.xlsx: salinan katalog sumber, tidak diubah.

Pemeriksaan lokal: 15 kartu ter-render (10 poster, 5 video), filter video dan modal caption bekerja, halaman tidak melebar pada viewport 390 px. Thumbnail poster pertama dan kedua berhasil terlihat. Pemutaran semua video belum diverifikasi. Nomor MB-007 memiliki Jenis Media kosong pada sumber; sementara diperlakukan sebagai gambar. Isi kolom tersebut di Excel saat pembaruan berikutnya.


## Rotasi campaign harian
- Urutan mengikuti angka kolom A (No.) dari Excel, bukan urutan baris atau status Sorotan. Setelah nomor terakhir, kembali ke materi pertama.
- Hari pertama ditetapkan 29 September 2026, pukul 00.00 WIB, pada `settings.js` (startDate).
- Untuk peluncuran pada tanggal lain, ganti startDate menggunakan YYYY-MM-DD. Sebelum tanggal mulai, beranda menampilkan materi pertama.
- Pergantian dihitung dari tanggal WIB dan jam perangkat pengunjung; tidak membutuhkan server atau pekerjaan terjadwal. Pengunjung pada tanggal WIB yang sama melihat materi yang sama selama jam perangkat benar.
- Halaman yang masih terbuka memperbarui materi pada tengah malam. Tab yang ditidurkan browser memperbarui saat aktif kembali. Modal yang sedang dibuka tidak ditutup paksa; campaign baru tampil di belakangnya.
- Dengan 15 materi: 29 September = nomor 1, 13 Oktober = nomor 15, 14 Oktober = nomor 1 lagi.
- Penambahan/penghapusan materi mengubah panjang siklus sehingga materi terpilih dapat berubah setelah pembaruan. Mengedit caption atau urutan baris saja tidak mereset tanggal mulai.
- Jalankan kembali tools/update-content.py setelah mengedit Excel, lalu unggah content.js hasilnya. settings.js tidak ditimpa oleh konversi Excel.
- katalog.html: seluruh koleksi. rotation.js: perhitungan nomor harian. settings.js: tanggal awal siklus.

Pemeriksaan rotasi: hari pertama, batas tengah malam WIB, hari terakhir, pengulangan, katalog kosong/satu materi, dan perubahan urutan baris lulus. Navigasi beranda → katalog menampilkan 15 kartu.
`n## Unduh materi`nTautan Bisa unduh di sini tersedia di beranda, setiap kartu katalog, dan modal. Poster Ditambal Terus diunduh dari aset lokal. Materi lain menggunakan tautan unduh Google Drive; login, konfirmasi file besar, dan izin unduh pemilik tetap berlaku. Tidak ada izin Drive yang diubah. Footer ditambahkan sesuai teks pengguna.
