import Logger from 'leekslazylogger';
import DTF from '@eartharoid/dtf';
import { short } from 'leeks.js';

const dtf = new DTF();
const colours = {
	critical: ['&!4&f', '&!4&f'],
	debug: ['&1', '&9'],
	error: ['&4', '&c'],
	info: ['&3', '&b'],
	notice: ['&!6&0', '&!6&0'],
	success: ['&2', '&a'],
	warn: ['&6', '&e'],
};

export default config => {
	const transports = [
		new Logger.transports.ConsoleTransport({
			format: log => {
				const timestamp = dtf.fill('DD/MM/YY HH:mm:ss', log.timestamp);
				const colour = colours[log.level.name];
				return short(`&f&!7${timestamp}&r ${colour[0]}[${log.level.name.toUpperCase()}]&r ${log.namespace ? `&d(${log.namespace.toUpperCase()})&r ` : ''}${colour[1]}${log.content}`);
			},
			level: config.logs.level,
		})
	];

	if (config.logs.files.enabled) {
		transports.push(
			new Logger.transports.FileTransport({
				clean_directory: config.logs.files.keepFor,
				directory: config.logs.files.directory,
				level: config.logs.level,
				name: 'Discord Tickets by eartharoid',
			})
		);
	}

	return new Logger({
		namespaces: ['commands', 'http', 'listeners'],
		transports,
	});
};

