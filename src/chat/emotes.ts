import { Channel } from '.';

export interface MessagePart {
	type: 'emote' | 'text';

	emote?: Emote;
	text?: string;
}

export interface Emote {
	name: string;
	description: string;
	url: string;
}

const globalEmotes = new Map<string, Emote>();
const channelEmotes = new Map<string, Map<string, Emote>>();

fetch('https://api.betterttv.net/3/cached/emotes/global')
	.then((res) => res.json())
	.then((res) => {
		for (const emote of res) {
			globalEmotes.set(emote.code, {
				name: emote.code,
				description: 'BetterTTV Emote - Global',
				url: `https://cdn.betterttv.net/emote/${emote.id}/3x`
			});
		}
	});

fetch('https://api.frankerfacez.com/v1/set/global')
	.then((res) => res.json())
	.then((res) => {
		for (const set of Object.values(res['sets'] || {}) || []) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			for (const emote of set.emoticons || []) {
				globalEmotes.set(emote.name, {
					name: emote.name,
					description: 'FrankerFaceZ Emote - Global',
					url: `https://cdn.frankerfacez.com/emote/${emote.id}/2`
				});
			}
		}
	});

export async function preload(channel: Channel): Promise<void> {
	const emotes = new Map<string, Emote>();
	channelEmotes.set(channel.internal(), emotes);

	await fetch(`https://api.betterttv.net/3/cached/users/twitch/${channel.id}`)
		.then((res) => {
			if (!res.ok) {
				throw new Error();
			}

			return res;
		})
		.then((res) => res.json())
		.then((res) => {
			for (const emote of res['channelEmotes'] || []) {
				emotes.set(emote.code, {
					name: emote.code,
					description: 'BetterTTV Emote - Channel',
					url: `https://cdn.betterttv.net/emote/${emote.id}/3x`
				});
			}

			for (const emote of res['sharedEmotes'] || []) {
				emotes.set(emote.code, {
					name: emote.code,
					description: `BetterTTV Emote - by ${emote.user.displayName}`,
					url: `https://cdn.betterttv.net/emote/${emote.id}/3x`
				});
			}
		})
		.catch(() => console.log(`Could not fetch BTTV emotes for ${channel.name}, ignoring.`));

	await fetch(`https://api.frankerfacez.com/v1/room/${channel.internal()}`)
		.then((res) => {
			if (!res.ok) {
				throw new Error();
			}

			return res;
		})
		.then((res) => res.json())
		.then((res) => {
			for (const set of Object.values(res['sets'] || {}) || []) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				for (const emote of set.emoticons || []) {
					emotes.set(emote.name, {
						name: emote.name,
						description: `FrankerFaceZ Emote - by ${emote.owner.display_name}`,
						url: `https://cdn.frankerfacez.com/emote/${emote.id}/2`
					});
				}
			}
		})
		.catch(() => console.log(`Could not fetch FFZ emotes for ${channel.name}, ignoring.`));
}

export function parseEmotes(
	message: string,
	channel: string,
	emotes?: { [id: string]: string[] }
): MessagePart[] {
	const twitchEmotes = Object.entries(emotes || []).flatMap(([id, occurrences]) =>
		occurrences.map((range) => {
			const parts = range.split('-');
			const start = parseInt(parts[0]);
			const end = parseInt(parts[1]);
			return { id, start, end };
		})
	);

	twitchEmotes.sort((a, b) => a.start - b.start);

	let parts = [] as MessagePart[];

	let last = 0;
	for (const emote of twitchEmotes) {
		if (emote.start !== last) {
			parts.push({
				type: 'text',
				text: message.substring(last, emote.start)
			});
		}

		parts.push({
			type: 'emote',
			emote: {
				name: message.substring(emote.start, emote.end + 1),
				description: 'Twitch Emote',
				url: `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/light/3.0`
			}
		});

		last = emote.end + 1;
	}

	if (last !== message.length) {
		parts.push({
			type: 'text',
			text: message.substring(last)
		});
	}

	const previousParts = parts;
	parts = [];
	for (const part of previousParts) {
		if (part.type !== 'text') {
			parts.push(part);
			continue;
		}

		const words = (part.text || '').split(' ');
		last = 0;
		words.forEach((word, i) => {
			const emote = globalEmotes.get(word) || channelEmotes.get(channel)?.get(word);

			if (emote !== undefined) {
				if (last !== i) {
					parts.push({
						type: 'text',
						text: (last !== 0 ? ' ' : '') + words.slice(last, i).join(' ') + ' '
					});
				} else if (last !== 0) {
					parts.push({
						type: 'text',
						text: ' '
					});
				}

				parts.push({
					type: 'emote',
					emote
				});

				last = i + 1;
			}
		});

		if (last !== words.length) {
			parts.push({
				type: 'text',
				text: (last !== 0 ? ' ' : '') + words.slice(last).join(' ')
			});
		}
	}

	return parts;
}
