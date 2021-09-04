<template>
	<Tippy>
		<img
			v-if="badge.image"
			:src="badge.image"
			class="inline-block w-5 h-5 object-cover align-text-bottom"
		/>
		<span v-else class="inline-block w-5 h-5 bg-gray-200 align-text-bottom" />

		<template #content>
			<b>{{ badge.name }}</b>
			<p v-if="badge.description !== badge.name">{{ badge.description }}</p>
		</template>
	</Tippy>
</template>

<script setup lang="ts">
import { Tippy } from 'vue-tippy';

import { defineProps, toRefs } from 'vue';
import type { Badge } from '@/chat';

const props = defineProps<{ badge: Badge }>();
const { badge } = toRefs(props);
</script>
