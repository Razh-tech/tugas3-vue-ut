/**
 * js/components/status-badge.js
 * Custom element: <status-badge>
 */
Vue.component('status-badge', {
  template: '#tpl-badge',
  props: {
    qty: {
      type: Number,
      required: true
    },
    safety: {
      type: Number,
      required: true
    },
    catatan: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showTooltip: false
    };
  }
});