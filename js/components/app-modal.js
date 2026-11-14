/**
 * js/components/app-modal.js
 * Custom element: <app-modal>
 */
Vue.component('app-modal', {
  template: '#tpl-modal',
  data() {
    return {
      isOpen: false,
      title: 'Konfirmasi',
      message: '',
      confirmText: 'Ya, Lanjutkan',
      cancelText: 'Batal',
      confirmBtnClass: 'btn-danger',
      onConfirmCallback: null
    };
  },
  methods: {
    open({ title, message, confirmText, cancelText, confirmBtnClass, onConfirm }) {
      this.title = title || 'Konfirmasi Tindakan';
      this.message = message || '';
      this.confirmText = confirmText || 'Ya, Lanjutkan';
      this.cancelText = cancelText || 'Batal';
      this.confirmBtnClass = confirmBtnClass || 'btn-danger';
      this.onConfirmCallback = onConfirm;
      this.isOpen = true;
    },
    confirm() {
      if (typeof this.onConfirmCallback === 'function') {
        this.onConfirmCallback();
      }
      this.isOpen = false;
    },
    cancel() {
      this.isOpen = false;
    }
  }
});