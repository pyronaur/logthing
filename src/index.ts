import { logger } from './logger';
import { Console } from './delivery.console';
import { AvailableTemplateNames, Channel, LogConfig, LogthingInterface } from './types';
import { Templates, default_flag } from './templates';

type LogthingConfig<Name = string> = Name | {
	name: Name;
	prefix?: string;
	flag?: string;
	template?: AvailableTemplateNames;
};

export class Logthing<Name extends string> {
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

			const config: LogConfig = {
				name: channel_name,
				prefix,
				plain_prefix,
				flag,
				padding,
			}

			this.channels[channel_name] = {
				active: true,
				config,
			};
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
				if (channel.active) {
					delivery.deliver(channel.config, ...args);
				}
				return methods;
			}

		}

		return methods as LogthingInterface<Name>;
	}

	private mute(name: Name | Name[]) {

		const channels = Array.isArray(name) ? name : [name];
		for (const channel of channels) {
			if (this.channels[channel]) {
				this.channels[channel]!.active = false;
			}
		}
	}

	private unmute(name: Name | Name[]) {
		const channels = Array.isArray(name) ? name : [name];
		for (const channel of channels) {
			if (this.channels[channel]) {
				this.channels[channel]!.active = true;
			}
		}
	}

	private mute_all() {
		this.mute(Object.keys(this.channels) as Name[]);
	}

	private unmute_all() {
		this.unmute(Object.keys(this.channels) as Name[]);
	}
}