import { Console } from './delivery.console';
import { AvailableTemplateNames, Channel, LogthingInterface } from './types';
import { Templates, default_flag } from './templates';

type LogthingConfig<Name = string> = Name | {
	name: Name;
	prefix?: string;
	flag?: string;
	template?: AvailableTemplateNames;
};

export class Logthing<Name extends string> {

	private active_channels = new Set<Name>();
	public channels: Record<Name, Channel> = {} as any;

	constructor (name: string, channels: LogthingConfig<Name>[]) {

		for (const channel of channels) {
			let channel_name: Name;
			let prefix: string = '';
			let flag: string = '';

			if (typeof channel === "string") {
				channel_name = channel;
				const template = (channel_name in Templates) ? Templates[channel_name as AvailableTemplateNames] : Templates['plain'];
				({ flag, prefix } = template(name, channel_name));
			} else {
				channel_name = channel.name;
				if (channel.template && (channel.template in Templates)) {
					const template = Templates[channel.template as AvailableTemplateNames];
					({ flag, prefix } = template(name, channel_name));
				} else {
					prefix = channel.prefix || '';
					flag = channel.flag ? channel.flag : default_flag(name);
				}
			}

			const plain_prefix = prefix.replace(/\x1b\[\d+m/gm, '');
			const padding = ' '.repeat(plain_prefix.length + 1);

			this.active_channels.add(channel_name);
			this.channels[channel_name] = {
				name: channel_name,
				prefix,
				plain_prefix,
				flag,
				padding,
			}
		}

	}

	public get_interface() {
		const delivery = new Console();

		const methods = {
			mute: this.mute.bind(this),
			unmute: this.unmute.bind(this),
			mute_all: this.mute_all.bind(this),
			unmute_all: this.unmute_all.bind(this),
			section: () => {
				delivery.buffer_start();
				return methods;
			},
			write: () => {
				delivery.buffer_end();
				return methods;
			}
		} as any;

		for (const [name, channel] of Object.entries<Channel>(this.channels)) {

			if (name in methods) {
				throw new Error(`Channel name "${name}" is reserved`);
			}

			methods[name] = (...args: unknown[]) => {
				if (this.active_channels.has(name as Name)) {
					delivery.deliver(channel, ...args);
				}
				return methods;
			}

		}

		return methods as LogthingInterface<Name>;
	}

	private mute(name: Name | Name[]) {
		const channels = Array.isArray(name) ? name : [name];
		this.active_channels = new Set([...this.active_channels].filter(c => !channels.includes(c)));
	}

	private unmute(name: Name | Name[]) {
		const channels = Array.isArray(name) ? name : [name];
		this.active_channels = new Set([...this.active_channels, ...channels]);
	}

	private mute_all() {
		this.active_channels = new Set();
	}

	private unmute_all() {
		this.active_channels = new Set(Object.keys(this.channels) as Name[]);
	}
}