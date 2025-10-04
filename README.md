> This project is deprecated.
> I recommend using [Logtape](https://logtape.org) instead

# 🪵  Logthing (DEPRECATED)

Simple logging with log channels configurable on the fly

> Organize your logs without losing your sanity.

Logthing is a versatile and customizable logging library for JavaScript and TypeScript. It provides an effortless approach to produce informative and visually distinct logs, with flexible output methods and extensive customization options.

## Table of Contents

- [Installation](#installation)
- [Importing Logthing](#importing-logthing)
- [Basic Usage](#basic-usage)
- [Customization](#customization)
- [Customize Delivery](#customize-delivery)

## Installation

Logthing can be installed directly from npm. Use the following command to add it to your project:

```shell
npm install logthing
```

## Importing Logthing

You can import `logthing` from the package like this:

```javascript
import { logthing } from 'logthing';
```

## Basic Usage

Let's get started with a simple usage of `logthing`. Here's how you can create a log channel and print some messages:

```javascript
const simple = logthing('Simple');
simple.log("Welcome to logthing!");
simple.log("By default, you have access to the following methods:", Object.keys(simple));
```

This will output:

```
Simple ❯    log: Welcome to logthing!
Simple ❯    log: By default, you have access to the following methods:
                 [
                   'mute',
                   'unmute',
                   'mute_all',
                   'unmute_all',
                   'debug',
                   'log',
                   'warn',
                   'error'
                 ]
```

And did you know? You can chain methods in `logthing`:

```javascript
simple.log("Here's what they look like:\n")
	.log("Informational message")
	.debug("Debug message")
	.warn("Warning message")
	.error("Error message");
```

Your console will now show:

```
Simple ❯    log: Informational message
Simple ❯  ◌ debug: Debug message
Simple ❯  ▲ warn: Warning message
Simple ❯  ✖ error: Error message
```

## Customization

`logthing` allows you to customize your logs to your heart's content. You can tailor the output of logs, define multiple types of messages (we call them "channels"), customize the flag, symbol, and color of the channel, or even define a completely custom template.

```javascript
const custom = logthing('Customization', [
	{
		name: "templates",
		template: "warn",
	}),
	// Basic customization
	{
		name: "about",
		symbol: "✪",
		color: 'cyan',
	},
	// Custom template
	{
		name: "all_in",
		color: 'magenta',
		symbol: "[Symbol]",
		flag: "[Flag]",
		prefix: "[Prefix]",
	},
]);
```

### Customize Delivery

Want to send your logs somewhere other than the console? `logthing` gives you the power to define your own delivery methods. This is especially useful if you want to send your logs to a file system or a remote server.

```typescript
import { Console, logthing } from 'logthing';
class FSLog<T extends string> {
	constructor (public readonly name: T) { }
	deliver(...args: unknown[]) {
		console.log("*Pretend* writing to FileSystem:", ...args, "\n");
	}
}

const custom_console = logthing('Custom Console', [
	[
		// Console is the default delivery method.
		new Console("Custom Console", "info"),
		new FSLog("

`Logthing` is a versatile and customizable logging library for JavaScript and TypeScript. It provides an organized and configurable way to handle console.log calls. You can install it via npm using the command `npm install logthing`.

Here is a simple example of how to use `logthing`:

```javascript
import { logthing } from 'logthing';

const simple = logthing('Simple');
simple.log("Welcome to logthing!");
simple.log("By default, you have access to the following methods:", Object.keys(simple));
```

By default, you have access to the following methods: 'mute', 'unmute', 'mute_all', 'unmute_all', 'debug', 'log', 'warn', 'error'. You can also chain these methods:

```javascript
simple.log("Here's what they look like:\n")
	.log("Informational message")
	.debug("Debug message")
	.warn("Warning message")
	.error("Error message");
```

`logthing` offers extensive customization options. You can customize the output of logs, define multiple types of messages (called "channels"), customize the flag, symbol, and color of the channel, or even define a completely custom template. Here's an example:

```javascript
const custom = logthing('Customization', [
	{
		name: "templates",
		template: "warn",
	}),
	{
		name: "about",
		symbol: "✪",
		color: 'cyan',
	},
	{
		name: "all_in",
		color: 'magenta',
		symbol: "[Symbol]",
		flag: "[Flag]",
		prefix: "[Prefix]",
	},
]);
```

`logthing` also allows you to define your own delivery methods, which is useful if you want to send your logs somewhere other than the console, such as a file system or a remote server.

```typescript
import { Console, logthing } from 'logthing';

class FSLog<T extends string> {
	constructor (public readonly channel: T) { }
	deliver(...args: unknown[]) {
		console.log("*Pretend* writing to FileSystem:", ...args, "\n");
	}
}

const custom_console = logthing('Custom Console', [
	[
		new Console("Custom Console", "info"),
		new FSLog("info")
	],
	[
		new Console("Custom Console", "warn"),
		new FSLog("warn")
	],
]);

custom_console.info("This is an info message that's written to the console and to a custom delivery method.");
custom_console.warn("This is a warning message that's written to the console and to a custom delivery method.");
```


## Environment Variables

Use `LOGTHING_MUTE` and `LOGTHING_UNMUTE` to mute channels and logthings by either channel or logthing name.

Examples:

Mute logthings named `Simple` and `Customization`:

```shell
LOGTHING_MUTE=Simple,Customization
```

Unmute all info channels:

```shell
LOGTHING_MUTE=info
```
Mute Simple logthing and info channels:

```shell
LOGTHING_MUTE=Simple,info
```

Mute everything

```shell
LOGTHING_MUTE=
```

Both `LOGTHING_MUTE` and `LOGTHING_UNMUTE` work the same way, and can even be used together, for example, this will mute everything except info channels:

```shell
LOGTHING_MUTE=
LOGTHING_UNMUTE=info
```
