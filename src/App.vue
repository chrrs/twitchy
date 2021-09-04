<script setup lang="ts">
import { ref, watchEffect } from 'vue';

import Splitter from 'primevue/splitter';
import Splitterpanel from 'primevue/splitterpanel';

import Chat from '@/components/chat/Chat.vue';

import { setDefaultProps } from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away-subtle.css';
import SettingsModal from './components/settings/SettingsModal.vue';

import { settings } from '@/settings';
import Input from './components/toolkit/Input.vue';
import IconButton from './components/toolkit/IconButton.vue';

let showSettings = ref(false);

setDefaultProps({
	arrow: true,
	animation: 'shift-away-subtle'
});

watchEffect(() => {
	if (settings.darkMode) {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
});
</script>

<template>
	<SettingsModal v-model="showSettings" />
	<div class="flex flex-col h-screen dark:(bg-dark-900 text-white)">
		<div class="flex items-center justify-between p-2">
			<h1 class="pl-1 text-xl font-bold">Twitchy</h1>
			<Input class="max-w-1/2" placeholder="Search..." />
			<IconButton @click="showSettings = true">
				<img class="w-4 h-4 dark:(filter invert)" src="@/assets/icons/settings.svg" />
			</IconButton>
		</div>
		<Splitter class="flex-auto min-h-0">
			<Splitterpanel><Chat channel="esl_csgo" /></Splitterpanel>
			<Splitterpanel><Chat channel="gaules" /></Splitterpanel>
		</Splitter>
	</div>
</template>

<style>
.p-splitter-gutter {
	@apply bg-gray-50 transition-colors;
	@apply dark:bg-dark-800;
}

.p-splitter-gutter:active {
	@apply bg-gray-200;
	@apply dark:bg-dark-200;
}

.p-splitter-gutter-handle {
	@apply bg-gray-200;
	@apply dark:bg-dark-200;
}

::-webkit-scrollbar {
	@apply w-4 h-4;
}

::-webkit-scrollbar-corner {
	@apply bg-transparent;
}

::-webkit-scrollbar-thumb {
	@apply border-solid border-4 border-transparent bg-clip-content min-w-8 min-h-8;
	@apply rounded-xl bg-gray-200 transition-colors;
	@apply dark:bg-dark-200;
}

::-webkit-scrollbar-thumb:hover {
	@apply bg-gray-300;
	@apply dark:bg-dark-100;
}

::-webkit-scrollbar-thumb:active {
	@apply bg-gray-400;
	@apply dark:bg-dark-50;
}

::-webkit-scrollbar-track {
	@apply bg-transparent;
}
</style>
