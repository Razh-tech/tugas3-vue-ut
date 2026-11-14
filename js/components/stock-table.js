/**
 * js/components/stock-table.js
 * Custom element: <ba-stock-table>
 */
Vue.component('ba-stock-table', {
  template: '#tpl-stock',
  props: {
    items: {
      type: Array,
      required: true
    },
    upbjjList: {
      type: Array,
      default: () => []
    },
    kategoriList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filterUpbjj: '',
      filterKategori: '',
      filterReorderOnly: false,
      sortBy: 'judul',
      sortOrder: 'asc',
      showFormModal: false,
      isEditMode: false,
      formItem: {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: ''
      },
      errors: {}
    };
  },
  watch: {
    // Watcher 1: Memantau perubahan filter UT-Daerah (Dependent Option)
    filterUpbjj(newVal, oldVal) {
      console.log(`[Watcher] filterUpbjj berubah dari "${oldVal}" menjadi "${newVal}"`);
      // Reset filter kategori saat UT-Daerah berganti
      this.filterKategori = '';
    },
    // Watcher 2: Memantau opsi reorder untuk memberi log/peringatan
    filterReorderOnly(newVal) {
      if (newVal) {
        console.log('[Watcher] Filter re-order aktif: menyaring bahan ajar dengan stok < safety');
      }
    }
  },
  computed: {
    // Dependent options untuk kategori yang tersedia berdasarkan UPBJJ yang dipilih
    availableCategories() {
      if (!this.filterUpbjj) {
        return this.kategoriList;
      }
      const cats = this.items
        .filter(item => item.upbjj === this.filterUpbjj)
        .map(item => item.kategori);
      return Array.from(new Set(cats));
    },
    // Computed property cached: menyaring dan mengurutkan stok tanpa komputasi ulang yang tidak perlu
    filteredAndSortedStock() {
      let result = [...this.items];

      // 1. Filter berdasarkan UT-Daerah
      if (this.filterUpbjj) {
        result = result.filter(item => item.upbjj === this.filterUpbjj);
      }

      // 2. Filter berdasarkan Kategori
      if (this.filterKategori) {
        result = result.filter(item => item.kategori === this.filterKategori);
      }

      // 3. Filter Re-order (qty < safety atau qty == 0)
      if (this.filterReorderOnly) {
        result = result.filter(item => item.qty < item.safety || item.qty === 0);
      }

      // 4. Sorting berdasarkan judul, stok (qty), atau harga
      result.sort((a, b) => {
        let modifier = this.sortOrder === 'desc' ? -1 : 1;
        if (this.sortBy === 'judul') {
          return a.judul.localeCompare(b.judul) * modifier;
        } else if (this.sortBy === 'qty') {
          return (a.qty - b.qty) * modifier;
        } else if (this.sortBy === 'harga') {
          return (a.harga - b.harga) * modifier;
        }
        return 0;
      });

      return result;
    }
  },
  methods: {
    resetFilter() {
      this.filterUpbjj = '';
      this.filterKategori = '';
      this.filterReorderOnly = false;
      this.sortBy = 'judul';
      this.sortOrder = 'asc';
    },
    openModalAdd() {
      this.isEditMode = false;
      this.errors = {};
      this.formItem = {
        kode: '',
        judul: '',
        kategori: this.kategoriList[0] || '',
        upbjj: this.upbjjList[0] || '',
        lokasiRak: '',
        harga: 50000,
        qty: 10,
        safety: 10,
        catatanHTML: ''
      };
      this.showFormModal = true;
    },
    openModalEdit(item) {
      this.isEditMode = true;
      this.errors = {};
      this.formItem = { ...item };
      this.showFormModal = true;
    },
    closeFormModal() {
      this.showFormModal = false;
    },
    validate() {
      const err = {};
      if (!this.formItem.kode) err.kode = 'Kode mata kuliah wajib diisi';
      if (!this.formItem.judul) err.judul = 'Nama mata kuliah wajib diisi';
      if (!this.formItem.kategori) err.kategori = 'Pilih kategori mata kuliah';
      if (!this.formItem.upbjj) err.upbjj = 'Pilih UT-Daerah';
      if (!this.formItem.lokasiRak) err.lokasiRak = 'Lokasi rak wajib diisi';
      if (this.formItem.harga === '' || this.formItem.harga < 0) err.harga = 'Harga tidak valid';
      if (this.formItem.qty === '' || this.formItem.qty < 0) err.qty = 'Jumlah stok minimal 0';
      if (this.formItem.safety === '' || this.formItem.safety < 0) err.safety = 'Safety stock minimal 0';
      
      // Validasi kode duplikat saat mode Create
      if (!this.isEditMode) {
        const exist = this.items.some(i => i.kode.toUpperCase() === this.formItem.kode.toUpperCase());
        if (exist) err.kode = 'Kode mata kuliah sudah terdaftar!';
      }
      this.errors = err;
      return Object.keys(err).length === 0;
    },
    saveStock() {
      if (!this.validate()) return;

      if (this.isEditMode) {
        // Update data eksisting
        const index = this.items.findIndex(i => i.kode === this.formItem.kode);
        if (index !== -1) {
          Vue.set(this.items, index, { ...this.formItem });
        }
      } else {
        // Tambah data baru ke depan list
        this.items.unshift({ ...this.formItem });
      }
      this.closeFormModal();
    },
    confirmDelete(item) {
      // Membuka modal konfirmasi hapus via $root modal ref
      this.$root.$refs.modal.open({
        title: 'Konfirmasi Penghapusan',
        message: `Apakah Anda yakin ingin menghapus data bahan ajar "${item.judul}" (${item.kode})?`,
        confirmText: 'Hapus Data',
        confirmBtnClass: 'btn-danger',
        onConfirm: () => {
          const index = this.items.findIndex(i => i.kode === item.kode);
          if (index !== -1) {
            this.items.splice(index, 1);
          }
        }
      });
    }
  }
});