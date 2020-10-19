const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const Command = require('../base/Command.js');
const Event = require('../base/Event.js');
const moment = require("moment-timezone");
require("moment");

module.exports = class Util {

	constructor(client) {
		this.client = client;
	}

	get hexColor() {
     let color = Math.floor(Math.random()*16777215).toString(16);
     return `#${color}`;
    }

    get intColor() {
     let color = Math.floor(Math.random()*16777215).toString(16);
     return `${parseInt(color, 16)}`;
    }

    get getTime() {
     return moment(new Date()).tz('Asia/Kolkata').format('dddd MMMM Do h:mm A');
    }

    truncate(str, maxLen, maxLines) {
     let finalStr = str.length > maxLen ? str.substr(0, maxLen) + "..." : str;
     finalStr = finalStr.split("\n").length > maxLines ? finalStr.split("\n").slice(0, maxLines).join("\n") + "..." : finalStr;
     return finalStr;
    }

	isClass(input) {
		return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class';
	}

	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	trimArray(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}

	formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes';
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
	}

	removeDuplicates(arr) {
		return [...new Set(arr)];
	}

	toProperCase(string) {
		return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
	}
	
	checkOwner(target) {
		return this.client.owners.includes(target);
	}

	comparePerms(member, target) {
		return member.roles.highest.position < target.roles.highest.position;
	}

	formatPerms(perm) {
		return perm
				.toLowerCase()
				.replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
				.replace(/_/g, ' ')
				.replace(/Guild/g, 'Server')
				.replace(/Use Vad/g, 'Use Voice Acitvity');
	}

	formatArray(array, type = 'conjunction') {
		return new Intl.ListFormat('en-GB', { style: 'short', type: type }).format(array);
	}

	validateURL(str) {
        const pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
        return !!pattern.test(str);
    }

    clean(text) {
        if (typeof text === "string")
            return text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
    }
  
    codeBlock(string, code) {
        if(code) return `\`\`\`${code}\n${string}\`\`\``;
        return `\`\`\`${string}\`\`\``;
    };
  
    formatSeconds (time, yt = false) {
        let days = Math.floor(time % 31536000 / 86400);
        let hours = Math.floor(time % 31536000 % 86400 / 3600);
        let minutes = Math.floor(time % 31536000 % 86400 % 3600 / 60);
        let seconds = Math.round(time % 31536000 % 86400 % 3600 % 60);
        days = days > 9  ? days : `0${  days}`;
        hours = hours > 9 ? hours : `0${  hours}`;
        minutes = minutes > 9 ? minutes : `0${  minutes}`;
        seconds = seconds > 9 ? seconds : `0${  seconds}`;
        if (yt === true && time > 3600000000) return 'Live';
        else return `${(parseInt(days) > 0 ? `${days  }:` : '') + (parseInt(hours) === 0 && parseInt(days) === 0 ? '' : `${hours  }:`) + minutes  }:${  seconds}`;
    }
    
	
    formatTime(milliseconds, minimal = false) {
        if (typeof milliseconds === "undefined" || isNaN(milliseconds)) {
            throw new RangeError("Utils#formatTime() Milliseconds must be a number");
        }

        if (typeof minimal !== "boolean") {
            throw new RangeError("Utils#formatTime() Minimal must be a boolean");
        }

        if (milliseconds === 0) return minimal ? "00:00" : "N/A";

        const times = {
            years: 0,
            months: 0,
            weeks: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };

        while (milliseconds > 0) {
            if (milliseconds - 31557600000 >= 0) {
                milliseconds -= 31557600000;
                times.years++;
            } else if (milliseconds - 2628000000 >= 0) {
                milliseconds -= 2628000000;
                times.months++;
            } else if (milliseconds - 604800000 >= 0) {
                milliseconds -= 604800000;
                times.weeks += 7;
            } else if (milliseconds - 86400000 >= 0) {
                milliseconds -= 86400000;
                times.days++;
            } else if (milliseconds - 3600000 >= 0) {
                milliseconds -= 3600000;
                times.hours++;
            } else if (milliseconds - 60000 >= 0) {
                milliseconds -= 60000;
                times.minutes++;
            } else {
                times.seconds = Math.round(milliseconds / 1000);
                milliseconds = 0;
            }
        }

        const finalTime = [];
        let first = false;

        for (const [k, v] of Object.entries(times)) {
            if (minimal) {
                if (v === 0 && !first) continue;
                finalTime.push(v < 10 ? `0${v}` : `${v}`);
                first = true;
                continue;
            }
            if (v > 0) finalTime.push(`${v} ${v > 1 ? k : k.slice(0, -1)}`);
        }

        if (minimal && finalTime.length === 1) finalTime.unshift("00");

        let time = finalTime.join(minimal ? ":" : ", ");

        if (time.includes(",")) {
            const pos = time.lastIndexOf(",");
            time = `${time.slice(0, pos)} and ${time.slice(pos + 1)}`;
        }

        return time;
    }

    formatDuration(duration) {
        if(isNaN(duration) || typeof duration === 'undefined') return '00:00';
        if(duration > 3600000000) return 'Live';
        return this.formatTime(duration, true);
    };

    removeBlocks(text) {
    if (typeof(text) === "string") {
      return text.replace(/`/g, "｀").replace(/@/g, "@\u200B");
    }
    else {
      return text;
     }
    } 

    decodeHtmlEntities (text){
    return text.replace(/&#(\d+);/g, (rep, code) => {
      return String.frrmCharCode(code)
     });
    }

    async paginate(msg, pages, emojiList, timeout) {
        if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
        if (!pages) throw new Error('Pages are not given.');
        if (emojiList.length < 3) throw new Error('Need two emojis.');
        let page = 0;
        const curPage = await msg.channel.send(pages[page].setFooter(`Page ${page + 1}/${pages.length}`));
        if(pages.length == 0) return;
    
        const permissions = msg.channel.permissionsFor(this.client.user);
        if (!permissions.has('ADD_REACTIONS')) return;
        if(pages.length === 1) {
            emojiList.splice(0, 1);
            emojiList.splice(1, 2);

            for (const emoji of emojiList) await curPage.react(emoji);
        }
        for (const emoji of emojiList) await curPage.react(emoji);
        const reactionCollector = curPage.createReactionCollector(
            (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot,
            { time: timeout },
        );
        reactionCollector.on('collect', (reaction, user) => {
            if(!user.bot && permissions.has('MANAGE_MESSAGES')) reaction.users.remove(user.id);

            if(pages.length === 1) {
                switch (reaction.emoji.name) {
                    case emojiList[0]:
                        reactionCollector.stop();
                    break;
                    default:
                        break;
                }
            } else {

            switch (reaction.emoji.name) {
                case emojiList[0]:
                    page = --page;
                    break;
                case emojiList[1]:
                    reactionCollector.stop('end');
                case emojiList[2]:
                    page = ++page;
                    break;
                default:
                    break;
            }
        }
            curPage.edit(pages[page].setFooter(`Page ${page + 1}/${pages.length}`));
        });
        reactionCollector.on('end', () => {
            curPage.reactions.removeAll();
            if(!curPage.deleted && curPage.deletable) curPage.delete();
        });
        //return curPage;
    }
  
    async haste(text) {
     const req = await this.client.snek.post("https://hastebin.com/documents", { text });
     return `https://hastebin.com/${req.data.key}`   
    };

    chunk(array, chunkSize) {
      const temp = [];
      for (let i = 0; i < array.length; i += chunkSize) {
      temp.push(array.slice(i, i + chunkSize));
       }
      return temp;
    }

    validateSoundcloud(link) {
        if (typeof link !== "string") return false;
        return /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/.test(link);
    }

    validateSaavn(link) {
        if (typeof link !== "string") return false;
        return /^https?:\/\/(www.?jiosaavn\.com)\/(.*)$/.test(link);
    }

    queueDuration(player) {
        if(!player.queue.length) return player.queue.current.duration;

        return player.queue.reduce((prev, curr) => prev + curr.duration, 0) + player.queue.current.duration - player.position;
    }

	async loadCommands() {
		return glob(`${this.directory}commands/**/*.js`).then(commands => {
			for (const commandFile of commands) {
				delete require.cache[commandFile];
				const { name } = path.parse(commandFile);
				const File = require(commandFile);
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command)) throw new TypeError(`Comamnd ${name} doesnt belong in Commands.`);
				this.client.commands.set(command.name, command);
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name);
					}
				}
			}
		});
	}

	async loadEvents() {
		return glob(`${this.directory}events/**/*.js`).then(events => {
			for (const eventFile of events) {
				delete require.cache[eventFile];
				const { name } = path.parse(eventFile);
				const File = require(eventFile);
				if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
				const event = new File(this.client, name);
				if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events`);
				this.client.events.set(event.name, event);
				event.emitter[event.type](name, (...args) => event.run(...args));
			}
		});
	}

};
