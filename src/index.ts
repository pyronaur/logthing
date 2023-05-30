import { Channels } from './channels';
import { LogthingChannelConfig, LogthingInterface } from './types';

type Methods = {
	[key: string]: ((...args: any[]) => any) | any;
};

function make_chainable<T extends Methods>(obj: T): T {
	let keys = Object.keys(obj) as Array<keyof T>;

	keys.forEach(key => {
		let originalFn = obj[key];
		obj[key] = ((...args: any[]) => {
			originalFn.apply(obj, args);
			return obj;
		}) as T[typeof key];
	});

	return obj;
}

export function logthing<T extends string>(name: string, config: LogthingChannelConfig<T>[]) {
	const channels = new Channels<T>(name, config);

	// Methods that are not channel names
	const methods = {
		mute: channels.mute,
		unmute: channels.unmute,
		mute_all: channels.mute_all,
		unmute_all: channels.unmute_all,
		section: () => {
			const active_drivers = channels.active_drivers();
			active_drivers.forEach(d => d.buffer_start());
		},
		write: () => {
			const active_drivers = channels.active_drivers();
			active_drivers.forEach(d => d.buffer_end());
		}
	} as any;

	// Register channel names as methods
	for (const [name, channel] of Object.entries<Channels<T>['channels'][T]>(channels.all())) {
		if (name in methods) {
			throw new Error(`Channel name "${name}" is reserved`);
		}

		methods[name] = (...args: unknown[]) => channels.send(channel.channel, ...args)

	}

	// Return a chainable object
	return make_chainable(methods) as LogthingInterface<T>;
}


export { Console } from './delivery.console';