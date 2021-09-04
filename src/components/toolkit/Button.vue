<template>
	<button
		:class="[
			`px-2 py-1 rounded text-white focus:outline-none bg-purple-500`,
			disabled ? 'cursor-default opacity-50' : 'hover:bg-purple-600 active:bg-purple-700'
		]"
	>
		<slot />
	</button>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from 'vue';

const props = defineProps<{ disabled: boolean }>();
const { disabled } = toRefs(props);
</script>
