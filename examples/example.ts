import { Console } from '../src/delivery.console';
import { logthing } from '../src/index';


/**
 * Simple example
 */
const simple = logthing('Simple');
simple.mute_all();
simple.env_ready();

setTimeout(() => {
	// Welcome!
	simple.info("Welcome to logthing!");
	simple.log("By default, you have access to the following methods:", Object.keys(simple));
	// You can also chain methods:
	simple.log("Here's what they look like:\n")
		.log("Informational message")
		.debug("Debug message")
		.warn("Warning message")
		.error("Error message");
}, 0);

/**
 * How types look like
 */
simple.debug("Here's how types look like:")
	// Newlines
	.debug("Every comma separated value is placed in a new line", "just", "like", "this")
	// Primitives
	.debug("Primitives are displayed as-is:", 1, true, null, undefined)
	// Objects
	.debug("Objects are pretty-printed:", { a: 1, b: 2, c: 3 })
	.debug("Large objects will be split into multiple lines:", {
		long_long_key1: 1,
		long_long_key2: 2,
		long_long_key3: 3,
		long_long_key4: 4,
		long_long_key5: 5,
		long_long_key6: 6,
	})
	// Arrays
	.debug("The same goes for arrays:", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
	.debug("And length arrays like a list of months:", [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	])
	// Errors
	.debug("Errors are displayed with their stack trace:", new Error("This is an error"))


/**
 * Customization
 */
const custom = logthing('Customization', [
	"info",
	{
		name: "templates",
		template: "warn",
	},

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


custom.info(
	'One of the reasons for building logthing was to have a simple way to customize the output of logs.',
	`Not everything should be a error or a warning.`,
	`Sometimes you need to have multiple types of messages, in logthing, they're called "channels".`
);

custom.templates(
	`You can use one of the predefined templates:`,
	Object.keys(Console.templates),
	"This channel is configured to look like a warning template."
);

custom.about(
	`You can also customize the flag, symbol and color of the channel.`,
	`This channel is configured to have a cyan color, a custom symbol and a custom flag.`,
	`This is the configuration that was used for "about":`,
	{
		symbol: "✪",
		color: 'cyan',
	},
);

custom.all_in(
	`You can also define a completely custom template.`,
	`This "all_in" channel has the following options:`,
	{
		color: "magenta",
		symbol: "[Symbol]",
		flag: "[Flag]",
		prefix: "[Prefix]",
	},
);




custom.about("You can also define your own delivery methods, if you want to ship your logs elsewhere.");
class LogShipperX<T extends string> {
	constructor (public readonly name: T) { }
	deliver(...args: unknown[]) {
		console.log("*Pretend* writing to FileSystem:", ...args, "\n");
	}
}

const custom_console = logthing('Custom Console', [
	[
		new Console("Custom Console", "info"),
		new LogShipperX("info")
	],
	[
		new Console("Custom Console", "warn"),
		new LogShipperX("warn")
	],
]);

custom_console.info("This is an info message that's written to the console and to a custom delivery method.");
custom_console.warn("This is a warning message that's written to the console and to a custom delivery method.");