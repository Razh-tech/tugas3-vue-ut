/**
 * js/components/do-tracking.js
 * Custom element: <do-tracking>
 */
Vue.component('do-tracking', {
  template: '#tpl-tracking',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      searchKeyword: '',
      appliedKeyword: '',
      newStatusInputs: {}
    };
  },
  computed: {
    // Computed property untuk memfilter daftar tracking DO
    filteredTrackingList() {
      if (!this.appliedKeyword) {
        return this.data;
      }
      const kw = this.appliedKeyword.toLowerCase();
      return this.data.filter(entry => {
        // Name-based index: ambil key DO number
        const doNumber = Object.keys(entry)[0];
        const detail = entry[doNumber];
        return (
          doNumber.toLowerCase().includes(kw) ||
          detail.nim.toLowerCase().includes(kw) ||
          detail.nama.toLowerCase().includes(kw)
        );
      });
    }
  },
  methods: {
    handleSearch() {
      this.appliedKeyword = this.searchKeyword;
    },
    handleResetSearch() {
      this.searchKeyword = '';
      this.appliedKeyword = '';
    },
    addProgress(detail, doNumber) {
      const keterangan = this.newStatusInputs[doNumber];
      if (!keterangan) {
        alert('Keterangan status pengiriman tidak boleh kosong!');
        return;
      }

      // Ambil local time menggunakan objek Date
      const now = new Date();
      const YYYY = now.getFullYear();
      const MM = String(now.getMonth() + 1).padStart(2, '0');
      const DD = String(now.getDate()).padStart(2, '0');
      const HH = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      const waktuFormatted = `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`;

      detail.perjalanan.push({
        waktu: waktuFormatted,
        keterangan: keterangan
      });

      // Reset input form
      Vue.set(this.newStatusInputs, doNumber, '');
    }
  }
});