<script setup lang="ts">
import { decode } from "blurhash";
import { nextTick, onMounted, ref, watch } from "vue";

const PLACEHOLDER_SIDE = 32;

const props = withDefaults(
  defineProps<{
    src: string
    avifUrl?: string | null
    webpUrl?: string | null
    blurHash?: string | null
    alt: string
  }>(),
  { avifUrl: null, webpUrl: null, blurHash: null }
);

const loaded = ref(false);
const phCanvas = ref<HTMLCanvasElement | null>(null);

function drawPlaceholder() {
  const h = props.blurHash;
  const el = phCanvas.value;
  if (!h || !el) {
    return;
  }
  const pixels = decode(h, PLACEHOLDER_SIDE, PLACEHOLDER_SIDE);
  el.width = PLACEHOLDER_SIDE;
  el.height = PLACEHOLDER_SIDE;
  const ctx = el.getContext("2d");
  if (!ctx) {
    return;
  }
  const data = new ImageData(PLACEHOLDER_SIDE, PLACEHOLDER_SIDE);
  data.data.set(pixels);
  ctx.putImageData(data, 0, 0);
}

onMounted(() => {
  void nextTick(() => drawPlaceholder());
});
watch(
  () => props.blurHash,
  () => {
    void nextTick(() => drawPlaceholder());
  }
);

const hasDerived = () => Boolean(props.webpUrl || props.avifUrl);
</script>

<template>
  <div class="app-image" :class="{ 'app-image--ready': loaded }">
    <canvas
      v-if="blurHash"
      ref="phCanvas"
      v-show="!loaded"
      class="app-image__blur"
      aria-hidden="true"
    />
    <picture v-if="hasDerived()">
      <source
        v-if="avifUrl"
        :srcset="(avifUrl as string)"
        type="image/avif"
      />
      <source
        v-if="webpUrl"
        :srcset="(webpUrl as string)"
        type="image/webp"
      />
      <img
        :src="src"
        :alt="alt"
        class="app-image__img"
        loading="lazy"
        @load="loaded = true"
        @error="loaded = true"
      />
    </picture>
    <img
      v-else
      :src="src"
      :alt="alt"
      class="app-image__img"
      loading="lazy"
      @load="loaded = true"
      @error="loaded = true"
    />
  </div>
</template>

<style scoped>
.app-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--color-surface, #f5fdf9);
}

.app-image__blur {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(20px);
  transform: scale(1.12);
  pointer-events: none;
}

.app-image__img {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.app-image--ready .app-image__img {
  opacity: 1;
}
</style>
