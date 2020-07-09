<template>
  <div v-if="isVisible" class="loader-overlay">
    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    isVisible: { type: Boolean, required: true },
    text: { type: String, required: false, default: '' },
  },
}
</script>

<style lang="scss">
  .loader-overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(133, 133, 133, 0.63);
    z-index: 999;
    cursor: pointer;
    span.text {
      display: inline-block;
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      color: #fff;
    }
    .lds-ellipsis {
      display: inline-block;
      position: absolute;
      left: calc(50% - 40px);
      top: calc(50% - 40px);
      width: 80px;
      height: 80px;
    }
    .lds-ellipsis div {
      position: absolute;
      top: 33px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #fff;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    .lds-ellipsis div:nth-child(1) {
      left: 8px;
      animation: lds-ellipsis1 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(2) {
      left: 8px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(3) {
      left: 32px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(4) {
      left: 56px;
      animation: lds-ellipsis3 0.6s infinite;
    }
    @keyframes lds-ellipsis1 {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes lds-ellipsis3 {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
    @keyframes lds-ellipsis2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(24px, 0);
      }
    }
  
  }
</style>
