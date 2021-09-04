<template>
	<div
		class="relative rounded p-1 w-6 h-6 transition-colors select-none"
		:class="
			checked
				? 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700'
				: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:(bg-dark-500 hover:bg-dark-300 active:bg-dark-400)'
		"
	>
		<img v-if="checked" class="filter invert" src="@/assets/icons/check.svg" />
		<input
			type="checkbox"
			class="absolute top-0 left-0 w-full h-full opacity-0"
			v-model="checked"
		/>
	</div>
</template>

<script setup="{ emit }" lang="ts">
import { ref, defineEmits, defineProps, toRefs, watchEffect } from 'vue';

const emit = defineEmits<{ (event: 'update:modelValue', value: boolean): void }>();
const props = defineProps<{ modelValue?: boolean }>();
const { modelValue } = toRefs(props);

let checked = ref(modelValue?.value || false);

watchEffect(() => {
	checked.value = modelValue?.value || false;
});

watchEffect(() => {
	emit('update:modelValue', checked.value);
});
</script>
