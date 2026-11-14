/**
 * js/components/order-form.js
 * Custom element: <order-form>
 */
Vue.component('order-form', {
  template: '#tpl-order',
  props: {
    paket: {
      type: Array,
      required: true
    },
    ekspedisi: {
      type: Array,
      required: true
    },
    trackingData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    // Ambil default tanggal hari ini format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    return {
      selectedPaketKode: '',
      form: {
        nim: '',
        nama: '',
        ekspedisi: '',
        tanggalKirim: today,
        totalHarga: 0
      },
      errors: {}
    };
  },
  watch: {
    // Watcher: Memantau pemilihan paket untuk update detail isi dan harga otomatis
    selectedPaketKode(newKode) {
      console.log(`[Watcher] Paket dipilih: ${newKode}`);
      const found = this.paket.find(p => p.kode === newKode);
      if (found) {
        this.form.totalHarga = found.harga;
      } else {
        this.form.totalHarga = 0;
      }
    }
  },
  computed: {
    selectedPaketDetail() {
      return this.paket.find(p => p.kode === this.selectedPaketKode) || null;
    },
    // Auto-generate Nomor DO: DO + Tahun Berjalan + Sequence Number
    generatedDONumber() {
      const year = new Date().getFullYear();
      const prefix = `DO${year}-`;
      const count = this.trackingData.length + 1;
      const sequence = String(count).padStart(3, '0');
      return `${prefix}${sequence}`;
    }
  },
  methods: {
    validate() {
      const err = {};
      if (!this.form.nim) err.nim = 'NIM Mahasiswa wajib diisi';
      if (!this.form.nama) err.nama = 'Nama Mahasiswa wajib diisi';
      if (!this.form.ekspedisi) err.ekspedisi = 'Pilih layanan ekspedisi';
      if (!this.selectedPaketKode) err.paket = 'Pilih paket bahan ajar';
      this.errors = err;
      return Object.keys(err).length === 0;
    },
    submitOrder() {
      if (!this.validate()) return;

      const newDONumber = this.generatedDONumber;
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

      // Susun objek tracking baru
      const newDOEntry = {
        [newDONumber]: {
          nim: this.form.nim,
          nama: this.form.nama,
          status: 'Dalam Perjalanan',
          ekspedisi: this.form.ekspedisi,
          tanggalKirim: this.form.tanggalKirim,
          paket: this.selectedPaketKode,
          total: this.form.totalHarga,
          perjalanan: [
            {
              waktu: timeStr,
              keterangan: 'Pemesanan dibuat di sistem SITTA UT'
            }
          ]
        }
      };

      // Emit event ke komponen root
      this.$emit('created', newDOEntry);

      // Konfirmasi dialog modal via root ref
      this.$root.$refs.modal.open({
        title: 'Pemesanan Berhasil Disimpan',
        message: `Delivery Order nomor ${newDONumber} atas nama ${this.form.nama} berhasil dibuat!`,
        confirmText: 'Lihat Tracking',
        confirmBtnClass: 'btn-primary',
        cancelText: 'Tutup',
        onConfirm: () => {
          this.$root.tab = 'tracking';
        }
      });

      // Reset form
      this.form.nim = '';
      this.form.nama = '';
      this.form.ekspedisi = '';
      this.selectedPaketKode = '';
      this.errors = {};
    }
  }
});