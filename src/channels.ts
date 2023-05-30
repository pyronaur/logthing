import { Console } from './delivery.console';
import { Channel, DeliveryInterface, LogthingChannelConfig } from './types';

export class Channels<Name extends string> {

	private active = new Set<Name>();
	public channels: Record<Name, Channel<Name>> = {} as any;

	constructor (app_name: string, channels: (LogthingChannelConfig<Name>)[]) {

		for (const channel of channels) {

			let channel_name: Name;

			// Plain channel names become "default" console.logs
			if (typeof channel === "string") {
				channel_name = channel;
			}
			// Accept a Delivery Interface directly as a channel
			else if (typeof channel === "object" && !Array.isArray(channel)) {
				channel_name = channel.name;
			}
			// Accept an array of Delivery Interfaces as a channel
			else if (Array.isArray(channel) && channel.length > 0) {
				channel_name = channel[0].name as Name;
			}
			// Otherwise, throw an error
			else {
				throw new Error("Invalid channel");
			}

			this.active.add(channel_name);

			// If channel is a DeliveryInterface
			const drivers: DeliveryInterface<Name>[] = [];
			if (typeof channel === "string") {
				drivers.push(new Console(app_name, channel_name));
			} else {
				if (Array.isArray(channel)) {
					drivers.push(...channel as DeliveryInterface<Name>[]);
				} else {
					drivers.push(channel);
				}
			}

			this.channels[channel_name] = {
				name: app_name,
				channel: channel_name,
				drivers,
			}
		}
	}

	public all() {
		return this.channels;
	}

	public send(channel: Name, ...args: unknown[]) {
		if (this.active.has(channel)) {
			this.channels[channel].drivers.forEach(d => d.deliver(...args));
		}
	}

	public active_drivers = () => {
		return Array.from(this.active).flatMap((channel: Name) => this.channels[channel].drivers);
	}

	public mute = (name: Name | Name[]) => {
		const channels = Array.isArray(name) ? name : [name];
		// Maybe flush buffers?
		// If we don't clear the buffers, then the next time we unmute, we'll get a bunch of old messages
		// channels.forEach(channel => this.channels[channel].drivers.forEach(d => d.buffer_end()));
		this.active = new Set([...this.active].filter(c => !channels.includes(c)));
	}

	public unmute = (name: Name | Name[]) => {
		const channels = Array.isArray(name) ? name : [name];
		channels.forEach(channel => this.active.add(channel));
	}

	public mute_all = () => {
		this.active = new Set();
	}

	public unmute_all = () => {
		this.active = new Set(Object.keys(this.channels) as Name[]);
	}
}