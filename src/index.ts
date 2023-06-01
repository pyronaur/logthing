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


/**
 * Handle environment variables.
 * This is an asynchronous function because we want the to execute this after potential `.mute()` and `.unmute()` 
 * calls that may happen right after logthing is initialized.
 * 
 * Examples:
 * Unmute all channels: LOGTHING_UNMUTE
 * Unmute specific channels: LOGTHING_UNMUTE=debug,log
 * Unmute specific logthings: LOGTHING_UNMUTE=debug,log,My App
 * Mute all channels: LOGTHING_MUTE
 * Mute specific channels: LOGTHING_MUTE=debug,log
 * Mute specific logthings: LOGTHING_MUTE=debug,log,My App 
 */
function handle_environment(thing: LogthingInterface<string>) {
	// Mute channels based on LOGTHING_MUTE env var
	if (process.env.LOGTHING_MUTE !== undefined) {
		if (process.env.LOGTHING_MUTE === 'all' || process.env.LOGTHING_MUTE === '*') {
			thing.mute_all();
		}
		const names = process.env.LOGTHING_MUTE.split(',').map(name => name.trim()).filter(name => name.length > 0);
		if (names.length === 0) {
			thing.mute_all();
		}
		else {
			if (names.length > 0) {
				// If the name is the same as the logthing name, mute all channels
				console.log(names, thing.name);
				if (names.includes(thing.name)) {
					thing.mute_all();
				} else {
					thing.mute(names);
				}
			}

		}
	}

	if (process.env.LOGTHING_UNMUTE !== undefined) {
		if (process.env.LOGTHING_UNMUTE === 'all' || process.env.LOGTHING_UNMUTE === '*') {
			thing.unmute_all();
		}
		const names = process.env.LOGTHING_UNMUTE.split(',').map(name => name.trim()).filter(name => name.length > 0);
		if (names.length === 0) {
			thing.unmute_all();
		}
		else {
			if (names.includes(thing.name)) {
				thing.unmute_all();
			}
			else {
				thing.unmute(names);
			}
		}
	}
}

export function logthing<T extends string = 'debug' | 'info' | 'log' | 'warn' | 'error'>(
	name: string,
	config: LogthingChannelConfig<T>[] = ['debug', "info", 'log', 'warn', 'error'] as LogthingChannelConfig<T>[]
): LogthingInterface<T> {
	const channels = new Channels<T>(name, config);

	// Methods that are not channel names
	const methods = {
		name,
		mute: channels.mute,
		unmute: channels.unmute,
		mute_all: channels.mute_all,
		unmute_all: channels.unmute_all,
		env_ready: () => handle_environment(methods)
	} as any;

	// Register channel names as methods
	for (const [name, channel] of Object.entries<Channels<T>['channels'][T]>(channels.all())) {
		if (name in methods) {
			throw new Error(`Channel name "${name}" is reserved`);
		}

		methods[name] = (...args: unknown[]) => channels.send(channel.channel, ...args)

	}

	handle_environment(methods);

	// Return a chainable object
	return make_chainable(methods) as LogthingInterface<T>;
}



export { Console } from './delivery.console';