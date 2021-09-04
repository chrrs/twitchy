<template>
	<VueFinalModal v-slot="{ close }" classes="flex justify-center items-center" name="test">
		<div class="flex flex-col gap-2 min-w-xl rounded bg-white dark:(bg-dark-900 text-white)">
			<div class="p-2 flex justify-between items-center">
				<h1 class="pl-1 text-xl font-bold">Settings</h1>
				<IconButton @click="close">
					<img class="dark:(filter invert)" src="@/assets/icons/close.svg" />
				</IconButton>
			</div>
			<div class="flex flex-col">
				<div class="px-3 pb-2 flex justify-between items-center">
					<div>
						<p class="leading-tight font-medium">Dark mode</p>
						<p class="leading-tight text-gray-700 dark:text-true-gray-400">
							Rest your eyes! Makes everything darker and more pleasant.
						</p>
					</div>
					<Checkbox v-model="settings.darkMode" />
				</div>
			</div>
		</div>
	</VueFinalModal>
</template>

<script setup lang="ts">
import Checkbox from '@/components/settings/Checkbox.vue';

// @ts-ignore
import { VueFinalModal } from 'vue-final-modal';

import { settings } from '@/settings';
import IconButton from '../toolkit/IconButton.vue';
</script>
