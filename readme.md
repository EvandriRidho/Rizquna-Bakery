# Rizquna Bakery 🍞

**Rizquna Bakery** adalah toko roti online yang ditujukan untuk para pencinta roti maupun masyarakat umum. Aplikasi ini memungkinkan pengguna untuk melihat katalog produk, melakukan pemesanan, serta melacak status pesanan secara online. Admin dapat mengelola produk melalui dashboard yang lengkap dan aman.

## ✨ Fitur Utama

* 🥐 Katalog produk
* 🔐 Autentikasi (Login & Sign Up)
* 🚞️ CRUD produk untuk admin
* 💳 Sistem pembayaran
* 🚚 Tracking status pesanan
* 📊 Dashboard admin
* 🛠️ Dan masih banyak lagi...

## 🧱 Tech Stack

* **Frontend**: React.js + Tailwind CSS
* **Backend**: Node.js + Express
* **Database**: MongoDB

## 🛠️ Cara Install

### 1. **Clone repository**

```bash
git clone https://github.com/username/rizquna-bakery.git
cd rizquna-bakery
```

### 2. **Setup frontend dan backend**

struktur project seperti ini:

```
rizquna-bakery/
├── client/     ← Frontend (React.js + Tailwind CSS)
└── server/     ← Backend (Express.js)
```

#### 🔹 Install dependencies frontend

```bash
cd client
npm install
```

#### 🔹 Install dependencies backend

```bash
cd server
npm install
```

### 3. **Konfigurasi environment variable**

Buat file `.env` di folder `server/` dan isi dengan konfigurasi berikut:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

(Sesuaikan dengan environment kamu.)

### 4. **Jalankan development server**

#### 🔹 Jalankan backend

```bash
cd server
npm run dev
```

#### 🔹 Jalankan frontend

Buka terminal baru:

```bash
cd client
npm run dev
```

### 5. **Akses aplikasi**

Frontend: [http://localhost:5173](http://localhost:5173)
Backend API: [http://localhost:3000](http://localhost:3000)