import { Templates } from './templates';

export interface DeliveryInterface<T extends string = string> {
	name: T;
	deliver(...args: unknown[]): void;
	buffer_start(): void;
	buffer_end(): void;
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

export type Channel = {
	name: string;
	channel: string;
	drivers: DeliveryInterface[];
}

export type Template<T extends string> = {
	name: T;
	prefix: string;
	flag: string;
	config: Channel;
}

export type AvailableTemplateNames = keyof typeof Templates;