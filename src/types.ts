import { ConsoleConfig } from './delivery.console';
import { Templates } from './templates';

type NonEmptyArray<T> = [T, ...T[]];
type DeliveryInterfaces<T extends string> = T extends DeliveryInterface<T>['name'] ? NonEmptyArray<DeliveryInterface<T>> : never
export type LogthingChannelConfig<T extends string> = T | {
	name: T;
} & ConsoleConfig | DeliveryInterface<T> | DeliveryInterfaces<T>;
export interface DeliveryInterface<T extends string = string> {
	name: T;
	deliver(...args: unknown[]): void;
}

export type LogthingInterface<T extends string> = {
	[K in T]: (...args: unknown[]) => LogthingInterface<T>;
} & {
	name: string;
	mute: (name: T | T[]) => LogthingInterface<T>;
	unmute: (name: T | T[]) => LogthingInterface<T>;
	mute_all: () => LogthingInterface<T>;
	unmute_all: () => LogthingInterface<T>;
	/** This is going to process the environment variables and mute/unmute channels accordingly */
	env_ready: () => void;
}

export type Channel<T> = {
	name: string;
	channel: T;
	drivers: DeliveryInterface[];
}

export type Template<T extends string> = {
	name: T;
	prefix: string;
	flag: string;
	config: Channel<string>;
}

export type AvailableTemplateNames = keyof typeof Templates;