import { Console } from './delivery.console';
import { Channel, DeliveryInterface, LogthingInterface } from './types';

export class Logthing<Name extends string> {

	private active_channels = new Set<Name>();
	public channels: Record<Name, Channel> = {} as any;

	constructor (name: string, channels: (Name | DeliveryInterface<Name>)[]) {

		for (const channel of channels) {

			const channel_name = typeof channel === "string" ? channel : channel.name;
			this.active_channels.add(channel_name);

			// If channel is a DeliveryInterface
			const drivers: DeliveryInterface<Name>[] = [];
			if (typeof channel === "string") {
				drivers.push(new Console(name, channel_name));
			} else {
				drivers.push(channel);
			}

			this.channels[channel_name] = {
				name: name,
				channel: channel_name,
				drivers,
			}
		}
	}

	private active_drivers() {
		return Array.from(this.active_channels).flatMap((channel: Name) => this.channels[channel].drivers);
	}

	public get_interface() {
		const methods = {
			mute: this.mute.bind(this),
			unmute: this.unmute.bind(this),
			mute_all: this.mute_all.bind(this),
			unmute_all: this.unmute_all.bind(this),
			section: () => {
				const active_drivers = this.active_drivers();
				active_drivers.forEach(d => d.buffer_start());
				return methods;
			},
			write: () => {
				const active_drivers = this.active_drivers();
				active_drivers.forEach(d => d.buffer_end());
				return methods;
			}
		} as any;

		for (const [name, channel] of Object.entries<Channel>(this.channels)) {

			if (name in methods) {
				throw new Error(`Channel name "${name}" is reserved`);
			}

			methods[name] = (...args: unknown[]) => {
				channel.drivers.forEach(d => d.deliver(...args));
				return methods;
			}

		}

		return methods as LogthingInterface<Name>;
	}

	private mute(name: Name | Name[]) {
		const channels = Array.isArray(name) ? name : [name];
		// Maybe flush buffers?
		// If we don't clear the buffers, then the next time we unmute, we'll get a bunch of old messages
		// channels.forEach(channel => this.channels[channel].drivers.forEach(d => d.buffer_end()));
		this.active_channels = new Set([...this.active_channels].filter(c => !channels.includes(c)));
	}

	private unmute(name: Name | Name[]) {
		const channels = Array.isArray(name) ? name : [name];
		channels.forEach(channel => this.active_channels.add(channel));
	}

	private mute_all() {
		this.active_channels = new Set();
	}

	private unmute_all() {
		this.active_channels = new Set(Object.keys(this.channels) as Name[]);
	}
}