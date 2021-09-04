import { Client } from 'tmi.js';
import { Badge, getBadge } from './badge';
import mitt from 'mitt';
import { MessagePart, parseEmotes } from './emotes';

export interface User {
	badges: Badge[];
	name: string;
	color: string;
}

export interface Chat {
	user: User;
	message: string;
	messageParts: MessagePart[];
}

// export interface Subscription {}

export interface ChatEvent {
	id: string;
	time: Date;
	chat?: Chat;
	// subscription?: Subscription;
}

function ensureConnected(callback: () => void) {
	if (client.readyState() !== 'OPEN') {
		client.once('connected', callback);
	} else {
		callback();
	}
}

const client = new Client({});
export const emitter = mitt<{ [key: string]: ChatEvent }>();

client.connect();
client.on('message', (channel, tags, message) => {
	channel = channel.replace('#', '').toLowerCase();

	const event = {
		id: tags.id || '',
		time: new Date(),
		chat: {
			user: {
				badges: Object.entries(tags.badges || {}).map((entry) => {
					const badge = getBadge(entry[0], entry[1], channel);

					if (entry[0] === 'subscriber') {
						const months = tags['badge-info']?.subscriber;
						if (months !== undefined) {
							badge.description = `Subscribed for ${months} months`;
						}
					}

					return badge;
				}),
				name: tags['display-name'] || 'ghost',
				color: tags.color || 'red'
			},
			message,
			messageParts: parseEmotes(message, channel, tags['emotes'])
		}
	};

	emitter.emit(`chat:${channel}`, event);
});

export function join(channel: string): void {
	ensureConnected(() => {
		client.join(channel);
	});
}

export function leave(channel: string): void {
	ensureConnected(() => {
		client.part(channel);
	});
}
