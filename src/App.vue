<script setup>
import { ref, toRaw } from 'vue';
import PhaserGame from './PhaserGame.vue';

const phaserRef = ref();
const showBackBtn = ref(false);

const currentScene = (scene) => {
    showBackBtn.value = scene && scene.scene && scene.scene.key === 'Tavern';
};

const backToMenu = () => {
    const scene = toRaw(phaserRef.value?.scene);
    if (scene && scene.scene) scene.scene.start('MainMenu');
};
</script>

<template>
    <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
    <div class="hud-overlay">
        <button v-if="showBackBtn" class="button back-btn" @click="backToMenu">Back to Menu</button>
    </div>
</template>
