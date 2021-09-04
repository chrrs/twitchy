import { Badge, fetchChannelBadges } from './badge';
import { preload } from './emotes';
import { ChatEvent, emitter, join, leave } from './tmi';

export { getBadge } from './badge';

export type { Badge } from './badge';
export type { User, ChatEvent as Message, Chat } from './tmi';

const channels = new Map<string, Channel>();

export class Channel {
	refs = 1;

	id: string;
	name: string;
	color: string;
	badges: Badge[];

	constructor(id: string, name: string, color: string, badges: Badge[]) {
		this.id = id;
		this.name = name;
		this.color = color;
		this.badges = badges;

		join(this.internal());
	}

	internal(): string {
		return this.name.toLowerCase();
	}
}

export class ChannelRef {
	private callback: ((m: ChatEvent) => void) | undefined;
	value: Channel;

	constructor(channel: Channel) {
		this.value = channel;
	}

	on(event: 'chat', callback: (m: ChatEvent) => void): void {
		this.callback = callback;
		emitter.on(`chat:${this.value.internal()}`, callback);
	}

	discard(): void {
		if (this.callback !== undefined) {
			emitter.off(`chat:${this.value.internal()}`, this.callback);
		}

		this.value.refs--;
		if (this.value.refs <= 0) {
			channels.delete(this.value.internal());
			leave(this.value.internal());
		}
	}
}

export async function fetchChannel(name: string): Promise<ChannelRef> {
	name = name.toLowerCase();

	let channel = channels.get(name);
	if (channel !== undefined) {
		channel.refs++;
	} else {
		const result = await fetch(`https://api.ivr.fi/twitch/resolve/${name}`);
		const json = await result.json();

		channel = new Channel(json['id'], json['displayName'], json['chatColor'], []);
		channels.set(name, channel);

		await fetchChannelBadges(channel);
		await preload(channel);
	}

	return new ChannelRef(channel);
}
