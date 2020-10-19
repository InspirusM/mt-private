const parseMs = require('parse-ms');

const map = {
	days: 'd',
	hours: 'h',
	minutes: 'm',
	seconds: 's',
};

/**
 * Formats milliseconds to a time (1337 > 1.3 seconds)
 * @param {number} ms The milliseconds
 * @param {Object} opts options
 * @param {boolean} [opts.verbose=true] If false, output will be short (e.g, 1337 > 1.3s), if true output will be verbose (1337 > 1.3 seconds) :^)
 * @returns {string}
 */
function prettyMs (ms, {
	verbose = true,
} = {}) {
	if (ms === 0) {
		return 'now';
	}

	if (isNaN(ms) || !isFinite(ms)) {
		throw new TypeError('Expected a finite number');
	}

	const chunks = [];

	const add = (val, key) => {
		if (val !== 0) {
			const short = map[key];

			if (short) {
				if (verbose) {
					const text = `${val} ${key.substring(0, key.length - 1)}`;

					return chunks.push(val !== 1 ? `${text}s` : text);
				}

				return chunks.push(val + short);
			}
		}
	};

	const parsed = parseMs(ms);

	for (const key of Object.keys(parsed)) {
		add(parsed[key], key);
	}

	return chunks[0] && chunks.join(' ');
};

const numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

/**
 * Parses a number from a string
 * @param {string} str The string to get hte number from
 * @param {number} [def=NaN] the default number to return if none is found
 * @param {string} [strategy='lax'] The strategy to use, "lax" or "strict"
 * @returns {number|void}
 */
function parseNumber (str, def = NaN, strategy = 'lax') {
	const ret = (val) => {
		if (isNaN(val) || val < 0) {
			return def;
		}

		return val;
	};

	if (!str || typeof str !== 'string') {
		return ret();
	}

	if (!/[0-9]/.test(str)) {
		const index = numbers.findIndex(n => n === str.trim().toLowerCase());

		if (index !== -1) {
			return index;
		}
	} else {
		if (strategy === 'strict') {
			return ret(Number(str));
		}

		const text = str.trim().replace(/[^0-9-.]/g, '');

		return ret(Number(text));
	}

	return ret();
};

const timeParser = require('time-parser');

const shorthandRX = /([0-9]+) *(s|m|h|d|w) *$/i;
// const shorthandRX = /^ *([0-9]+) *(s|m|h|d|w) *$/i;

const shorthandTimes = {
	s: 1000,
	m: 60000,
	h: 3600000,
	d: 86400000,
	w: 604800000,
};

const timeRXes = {
	next: 'one',
	'a ': 'one ',
	'an ': 'one ',
	'sec ': 'second ',
	'min ': 'minute ',
	'mins ': 'minutes ',
};

function parseTime(input, defaultMs) {
	const shorthand = input.match(shorthandRX);

	if (shorthand) {
		const relative = Number(shorthand[1]) * shorthandTimes[shorthand[2]];

		return {
			absolute: Date.now() + relative,
			relative,
		};
	}

	Object.keys(timeRXes)
		.map((regexKey) => {
			if (input.includes(regexKey)) {
				input = input.replace(new RegExp(regexKey, 'gi'), timeRXes[regexKey]);
			}

			return input;
		});

	if (input.startsWith('every')) {
		if ((/every *[0-9]/).test(input)) {
			input = input.replace('every', '');
		} else {
			input = input.replace('every', '1 ');
		}
	}

	const parsedTime = timeParser(input.trim());

	if (parsedTime.mode === 'error' || Number(input)) {
		if (defaultMs) {
			return {
				mode: 'relative',
				absolute: (new Date((new Date()).getTime() + defaultMs)),
				relative: defaultMs,
			};
		}

		return 'INVALID';
	}

	if (parsedTime.relative < 0) {
		const currentYear = new Date().getFullYear();
		if (parsedTime.mode === 'relative') {
			return 'SET_FOR_PAST';
		}

		return parseTime(`${input} ${currentYear + 1}`);
	}

	return parsedTime;
}

const YOUTUBE_TRACK_FILTERS = [
	// Trim whitespaces
	{ source: /^\s+|\s+$/g, target: '' },
	// **NEW**
	{ source: /\s*\*+\s?\S+\s?\*+$/, target: '' },
	// [whatever]
	{ source: /\s*\[[^\]]+\]$/, target: '' },
	// (whatever version)
	{ source: /\s*\([^)]*version\)$/i, target: '' },
	// video extensions
	{ source: /\s*\.(avi|wmv|mpg|mpeg|flv)$/i, target: '' },
	// (LYRICs VIDEO)
	{ source: /\s*((with)?\s*lyrics?( video)?\s*)/i, target: '' },
	// (Official Track Stream)
	{ source: /\s*(Official Track Stream*)/i, target: '' },
	// (official)? (music)? video
	{ source: /\s*(of+icial\s*)?(music\s*)?video/i, target: '' },
	// (official)? (music)? audio
	{ source: /\s*(of+icial\s*)?(music\s*)?audio/i, target: '' },
	// (ALBUM TRACK)
	{ source: /\s*(ALBUM TRACK\s*)?(album track\s*)/i, target: '' },
	// (Cover Art)
	{ source: /\s*(COVER ART\s*)?(Cover Art\s*)/i, target: '' },
	// (official)
	{ source: /\s*\(\s*of+icial\s*\)/i, target: '' },
	// (1999)
	{ source: /\s*\(\s*[0-9]{4}\s*\)/i, target: '' },
	// HD (HQ)
	{ source: /\s+\(\s*(HD|HQ)\s*\)$/, target: '' },
	// HD (HQ)
	{ source: /\s+(HD|HQ)\s*$/, target: '' },
	// video clip officiel
	{ source: /\s*(vid[\u00E9e]o)?\s*clip officiel/i, target: '' },
	// offizielles
	{ source: /\s*of+iziel+es\s*/i, target: '' },
	// video clip
	{ source: /\s*(vid[\u00E9e]o)?\s*clip/i, target: '' },
	// Full Album
	{ source: /\s*full\s*album/i, target: '' },
	// live
	{ source: /\s+\(?live\)?$/i, target: '' },
	// Leftovers after e.g. (official video)
	{ source: /\(+\s*\)+/, target: '' },
	// Artist - The new "Track title" featuring someone
	{ source: /^(|.*\s)"(.{5,})"(\s.*|)$/, target: '$2' },
	// 'Track title'
	{ source: /^(|.*\s)'(.{5,})'(\s.*|)$/, target: '$2' },
	// (*01/01/1999*)
	{ source: /\s*\(.*[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}.*\)/i, target: '' },


	// labels
	{ source: /\|\sNapalm\sRecords$/, target: '' },

	// trim starting white chars and dash
	{ source: /^[/,:;~-\s"]+/, target: '' },
	// trim trailing white chars and dash
	{ source: /[/,:;~-\s"!]+$/, target: '' },
];

function filterTrackName(text) {
  	for (const data of YOUTUBE_TRACK_FILTERS) {
		text = text.replace(data.source, data.target);
	}

	return text;
}


module.exports.parseNumber = parseNumber;
module.exports.prettyMs = prettyMs;
module.exports.parseTime = parseTime;
module.exports.filterTrackName = filterTrackName;