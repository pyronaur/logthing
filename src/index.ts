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

export function logthing<T extends string = 'debug' | 'log' | 'warn' | 'error'>(
	name: string,
	config: LogthingChannelConfig<T>[] = ['debug', 'log', 'warn', 'error'] as LogthingChannelConfig<T>[]
): LogthingInterface<T> {
	const channels = new Channels<T>(name, config);

	// Methods that are not channel names
	const methods = {
		mute: channels.mute,
		unmute: channels.unmute,
		mute_all: channels.mute_all,
		unmute_all: channels.unmute_all
	} as any;

	// Register channel names as methods
	for (const [name, channel] of Object.entries<Channels<T>['channels'][T]>(channels.all())) {
		if (name in methods) {
			throw new Error(`Channel name "${name}" is reserved`);
		}

		methods[name] = (...args: unknown[]) => channels.send(channel.channel, ...args)

	}

	// Mute channels based on LOGTHING_MUTE env var
	if (process.env.LOGTHING_MUTE) {
		const muted_channels = process.env.LOGTHING_MUTE.split(',')
			.filter(name => name in methods) as T[];
		if (muted_channels.length > 0) {
			channels.mute(muted_channels);
		}
	}

	// Only log to channels based on LOGTHING env var
	if (process.env.LOGTHING_ONLY) {
		const active_channels = process.env.LOGTHING_ONLY.split(',')
			.filter(name => name in methods) as T[];
		channels.mute_all();
		if (active_channels.length > 0) {
			channels.unmute(active_channels);
		}
	}

	// Return a chainable object
	return make_chainable(methods) as LogthingInterface<T>;
}



export { Console } from './delivery.console';