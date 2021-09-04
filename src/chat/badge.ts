import { Channel } from '.';

export interface Badge {
	name: string;
	description?: string;
	version: string;
	image?: string;
}

type BadgeSet = Map<string, Badge>;

const globalBadges = new Map<string, BadgeSet>();
const channelBadges = new Map<string, Map<string, BadgeSet>>();

fetch('https://badges.twitch.tv/v1/badges/global/display')
	.then((res) => res.json())
	.then((res) => {
		const sets = res['badge_sets'];
		Object.keys(sets).map((name) => {
			globalBadges.set(name, parseBadgeSet(sets[name]));
		});
	});

function parseBadgeSet(json: any): BadgeSet {
	const versions = new Map<string, Badge>();
	const set = json['versions'];

	Object.keys(set).map((version) => {
		const badge = set[version];
		versions.set(version, {
			name: badge.title || name,
			version: version,
			description: badge.description,
			image: badge.image_url_4x || badge.image_url_2x || badge.image_url_1x
		});
	});

	return versions;
}

export function getBadge(name: string, version?: string, channel?: string): Badge {
	const set = globalBadges.get(name);

	let badge: Badge | undefined;
	if (channel !== undefined) {
		const channelSet = channelBadges.get(channel)?.get(name);
		badge = channelSet?.get(version || '0') || channelSet?.get('0');
	}

	return badge || set?.get(version || '0') || set?.get('0') || { name, version: version || '0' };
}

export async function fetchChannelBadges(channel: Channel): Promise<void> {
	const result = await fetch(`https://badges.twitch.tv/v1/badges/channels/${channel.id}/display`);
	const json = await result.json();

	const channelSets = new Map<string, BadgeSet>();
	channelBadges.set(channel.internal(), channelSets);

	const sets = json['badge_sets'];
	Object.keys(sets).map((name) => {
		channelSets.set(name, parseBadgeSet(sets[name]));
	});
}
