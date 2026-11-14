/**
 * js/app.js
 * Inisialisasi Root Vue App SITTA UT
 */

// 1. Registrasi Filter Teks Global
// Formatting mata uang Rupiah (contoh: Rp 65.000)
Vue.filter('rupiah', function (value) {
  if (value === null || value === undefined || isNaN(value)) return 'Rp 0';
  return 'Rp ' + Number(value).toLocaleString('id-ID');
});

// Formatting satuan buah (contoh: 28 buah)
Vue.filter('buah', function (value) {
  if (value === null || value === undefined || isNaN(value)) return '0 buah';
  return value + ' buah';
});

// Formatting tanggal lokal (contoh: 25 Agustus 2025)
Vue.filter('formatTanggal', function (value) {
  if (!value) return '-';
  const parts = value.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(year, month, day);
    const bulanIndo = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${dateObj.getDate()} ${bulanIndo[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  }
  return value;
});

// 2. Instance Vue Root
new Vue({
  el: '#app',
  data: {
    tab: 'stok', // State aktif: 'stok' | 'tracking' | 'order'
    state: {
      upbjjList: [],
      kategoriList: [],
      pengirimanList: [],
      paket: [],
      stok: [],
      tracking: []
    },
    isLoading: true
  },
  async created() {
    try {
      const data = await ApiService.getBahanAjarData();
      this.state.upbjjList = data.upbjjList || [];
      this.state.kategoriList = data.kategoriList || [];
      this.state.pengirimanList = data.pengirimanList || [];
      this.state.paket = data.paket || [];
      this.state.stok = data.stok || [];
      this.state.tracking = data.tracking || [];
    } catch (e) {
      console.error('Kesalahan saat menginisialisasi data aplikasi:', e);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    handleNewDO(newDO) {
      this.state.tracking.unshift(newDO);
    }
  }
});