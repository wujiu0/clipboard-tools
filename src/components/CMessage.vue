<script setup>
import { reactive } from 'vue';

const messageState = reactive({
  visible: true,
  opacity: 'opacity: 100%',
  text: 'default message',
})
setTimeout(() => {
  messageState.opacity = 'opacity: 0';
}, 2000);
setTimeout(() => {
  messageState.visible = false;
}, 3000);

function info(text, duration = 3000) {
  messageState.text = text;
  display(duration);

}

function display(duration) {
  messageState.visible = true;
  setTimeout(() => {
    messageState.opacity = 'opacity: 0';
    setTimeout(() => {
      close();
    }, 1000);
  }, duration);
}

function close() {
  messageState.visible = false;
  messageState.text = '';
}

</script>

<template>
  <Teleport to="body">
    <div v-if="messageState.visible" class="absolute top-0 right-0 z-[9999] duration-1000"
         :style="messageState.opacity">
      <slot name="icon"></slot>
      <slot>{{ messageState.text }}</slot>
    </div>
  </Teleport>

</template>

<style scoped>

</style>
