import { Logger } from './logger';
import { Templates } from './templates';

export interface DeliveryInterface {
	deliver(channel: LogConfig, data: string): void;
}

export type LogthingInterface<T extends string> = {
	[K in T]: (...args: unknown[]) => LogthingInterface<T>;
} & {
	mute: (name: T | T[]) => void;
	unmute: (name: T | T[]) => void;
	mute_all: () => void;
	unmute_all: () => void;
	section: (name: string) => LogthingInterface<T>;
	write: () => LogthingInterface<T>;
}

export type LogConfig = {
	name: string;
	prefix: string;
	plain_prefix: string;
	flag: string;
	padding: string;
}

export type Template<T extends string> = {
	name: T;
	prefix: string;
	flag: string;
	config: LogConfig;
}

export type Channel = {
	active: boolean;
	config: LogConfig;
	callback: Logger;
}


export type AvailableTemplateNames = keyof typeof Templates;