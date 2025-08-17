# Rizquna Bakery 🍞

**Rizquna Bakery** adalah toko roti online yang ditujukan untuk para pencinta roti maupun masyarakat umum. Aplikasi ini memungkinkan pengguna untuk melihat katalog produk, melakukan pemesanan, serta melacak status pesanan secara online. Admin dapat mengelola produk melalui dashboard yang lengkap dan aman, Dan responsive secara mobile dan desktop

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
git clone https://github.com/EvandriRidho/Rizquna-Bakery.git
cd Rizquna-Bakery
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

Buka terminal baru:

```bash
cd server
npm install
```

### 3. **Konfigurasi environment variable**

Buat file `.env` di folder `server/` dan isi dengan konfigurasi berikut:

```env
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV="development"
SELLER_EMAIL=your_admin_email
SELLER_PASSWORD=your_admin_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_SERVER_KEY=your_midtrans_Server_key
```

Buat file `.env` di folder `client/` dan isi dengan konfigurasi berikut:

```env
VITE_BACKEND_URL="http://localhost:3000"
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

(Sesuaikan dengan environment kamu.)

### 4. **Jalankan development server**

#### 🔹 Jalankan backend

```bash
cd server
npm run server
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