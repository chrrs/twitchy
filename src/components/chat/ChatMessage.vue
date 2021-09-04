<template>
	<p v-if="message.chat" class="break-words" style="word-break: break-word">
		<span class="text-gray-500 dark:text-true-gray-500 mr-1">{{
			format.format(message.time)
		}}</span>
		<span class="inline-flex items-start mr-1">
			<div v-if="message.chat.user.badges.length > 0" class="inline-flex gap-1 mr-1">
				<Badge v-for="badge in message.chat.user.badges" :key="badge.name" :badge="badge" />
			</div>
			<span class="font-semibold" :style="`color: ${message.chat.user.color}`">
				{{ message.chat.user.name }}:
			</span>
		</span>
		<span class="inline-block">
			<template v-for="(part, i) in message.chat.messageParts">
				<span :key="i" v-if="part.type === 'text'">{{ part.text }}</span>
				<Tippy :key="i" v-if="part.type === 'emote'">
					<img
						class="inline-block h-6 object-contain"
						:src="part.emote?.url"
						:alt="part.emote?.name"
					/>

					<template #content>
						<b>{{ part.emote?.name }}</b>
						<p>{{ part.emote?.description }}</p>
					</template>
				</Tippy>
			</template>
		</span>
	</p>
</template>

<script setup lang="ts">
import Badge from '@/components/chat/Badge.vue';

import { defineProps, toRefs } from 'vue';

import { Tippy } from 'vue-tippy';

import type { Message } from '@/chat';

const props = defineProps<{ message: Message }>();
const { message } = toRefs(props);

const format = new Intl.DateTimeFormat('en-GB', { timeStyle: 'short' });
</script>
