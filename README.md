# Logthing

✨ Logthing ✨   
Simple and configurable logging with channels. Keep your `console.log` calls organized and your sanity intact.

`logthing` is a customizable logging library for JavaScript and TypeScript. It provides an easy way to generate informative and visually distinct logs, with a flexible output mechanism and extensive customization options.

## Installation

To install `logthing`, use npm:

```
npm install logthing
```

## Importing Logthing

To start using `logthing`, import it from the package:

```javascript
import { logthing } from 'logthing';
```

## Basic Usage

Here's how you can get started with `logthing`:

```javascript
const simple = logthing('Simple');
simple.log("Welcome to logthing!");
simple.log("By default, you have access to the following methods:", Object.keys(simple));
```

And here's what the output looks like:

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

`logthing` allows chaining of methods for a more concise logging experience:

```javascript
simple.log("Here's what they look like:\n")
	.log("Informational message")
	.debug("Debug message")
	.warn("Warning message")
	.error("Error message");
```

The output:

```
Simple ❯    log: Informational message
Simple ❯  ◌ debug: Debug message
Simple ❯  ▲ warn: Warning message
Simple ❯  ✖ error: Error message
```

## Customization

`logthing` is all about customization. It allows you to modify log outputs, define multiple message types (aka "channels"), and change the flag, symbol, and color of the channel. You can even define a completely custom template.

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

### Custom Delivery

With `logthing`, you're not limited to the console. You can define your own delivery methods, useful for sending logs to places like the file system or a remote server.

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

Output:

```
Custom Console ❯  ✪ info: This is an info message that's written to the console and to a custom delivery method.


`logthing` is a versatile and customizable logging library for JavaScript and TypeScript. It provides a structured way to create informative and visually distinct logs, with flexible output methods and extensive customization options.

The basic usage of `logthing` involves importing the `logthing` function from the package, using it to create a logger, and then using the logger to generate logs. Here's a simple example:

```javascript
import { logthing } from 'logthing';

const simple = logthing('Simple');
simple.log("Welcome to logthing!");
simple.log("By default, you have access to the following methods:", Object.keys(simple));
```

You can also chain the logging methods like this:

```javascript
simple.log("Here's what they look like:\n")
	.log("Informational message")
	.debug("Debug message")
	.warn("Warning message")
	.error("Error message");
```

`logthing` offers extensive customization options. You can customize the output of logs, define multiple types of messages (called "channels"), customize the flag, symbol, and color of the channel, or even define a completely custom template.

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

`logthing` also allows you to define your own delivery methods. This is useful if you want to send your logs somewhere other than the console, such as a file system or a remote server.

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