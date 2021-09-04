<template>
	<div class="flex items-center justify-center h-full" v-if="!channelRef">
		<svg
			class="animate-spin dark:(filter invert)"
			width="38"
			height="38"
			viewBox="0 0 38 38"
			xmlns="http://www.w3.org/2000/svg"
			stroke="#000"
		>
			<g fill="none" fill-rule="evenodd">
				<g transform="translate(1 1)" stroke-width="2">
					<circle stroke-opacity=".1" cx="18" cy="18" r="18" />
					<path stroke-opacity=".5" d="M36 18c0-9.94-8.06-18-18-18" />
				</g>
			</g>
		</svg>
	</div>
	<div v-else class="flex flex-col w-full h-full p-2 gap-2">
		<div class="flex">
			<h1 class="text-xl font-semibold">{{ channelRef.value.name }}'s Chat</h1>
		</div>
		<div class="flex-grow flex flex-col-reverse overflow-x-auto overflow-y-auto gap-1">
			<ChatMessage v-for="message in messages" :key="message.id" :message="message" />
		</div>
		<!-- <hr />
		<div class="flex-grow flex flex-col-reverse overflow-x-auto overflow-y-auto gap-1">
			<DynamicScroller ref="scroller" :items="messages" :min-item-size="54">
				<template v-slot="{ item, index, active }">
					<DynamicScrollerItem
						:item="item"
						:active="active"
						:size-dependencies="[item.chat]"
						:data-index="index"
					>
						<ChatMessage class="mt-1" :message="item" />
					</DynamicScrollerItem>
				</template>
			</DynamicScroller>
		</div> -->
		<div class="flex gap-2">
			<Input :placeholder="`Chat in ${channelRef.value.name}'s channel...`"></Input>
			<Tippy>
				<Button disabled>Send</Button>
				<template #content>You are not logged in</template>
			</Tippy>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, onUnmounted, ref, toRefs } from 'vue';

import { Tippy } from 'vue-tippy';
// @ts-ignore
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import Button from '@/components/toolkit/Button.vue';
import Input from '@/components/toolkit/Input.vue';
import ChatMessage from '@/components/chat/ChatMessage.vue';

import { ChannelRef, fetchChannel, Message } from '@/chat';

const props = defineProps<{ channel: string }>();
const { channel } = toRefs(props);

let messages = ref([] as Message[]);

let channelRef = ref(undefined as ChannelRef | undefined);
onMounted(async () => {
	channelRef.value = await fetchChannel(channel.value);
	channelRef.value.on('chat', (message) => {
		const length = messages.value.unshift(message);
		messages.value.length = Math.min(length, 500);
	});
});

onUnmounted(() => {
	channelRef.value?.discard();
});
</script>
