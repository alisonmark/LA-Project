require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],3:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory();
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define([], factory);
	}
	else {
		// Global (browser)
		root.CryptoJS = factory();
	}
}(this, function () {

	/**
	 * CryptoJS core components.
	 */
	var CryptoJS = CryptoJS || (function (Math, undefined) {
	    /*
	     * Local polyfil of Object.create
	     */
	    var create = Object.create || (function () {
	        function F() {};

	        return function (obj) {
	            var subtype;

	            F.prototype = obj;

	            subtype = new F();

	            F.prototype = null;

	            return subtype;
	        };
	    }())

	    /**
	     * CryptoJS namespace.
	     */
	    var C = {};

	    /**
	     * Library namespace.
	     */
	    var C_lib = C.lib = {};

	    /**
	     * Base object for prototypal inheritance.
	     */
	    var Base = C_lib.Base = (function () {


	        return {
	            /**
	             * Creates a new object that inherits from this object.
	             *
	             * @param {Object} overrides Properties to copy into the new object.
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         field: 'value',
	             *
	             *         method: function () {
	             *         }
	             *     });
	             */
	            extend: function (overrides) {
	                // Spawn
	                var subtype = create(this);

	                // Augment
	                if (overrides) {
	                    subtype.mixIn(overrides);
	                }

	                // Create default initializer
	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
	                    subtype.init = function () {
	                        subtype.$super.init.apply(this, arguments);
	                    };
	                }

	                // Initializer's prototype is the subtype object
	                subtype.init.prototype = subtype;

	                // Reference supertype
	                subtype.$super = this;

	                return subtype;
	            },

	            /**
	             * Extends this object and runs the init method.
	             * Arguments to create() will be passed to init().
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var instance = MyType.create();
	             */
	            create: function () {
	                var instance = this.extend();
	                instance.init.apply(instance, arguments);

	                return instance;
	            },

	            /**
	             * Initializes a newly created object.
	             * Override this method to add some logic when your objects are created.
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         init: function () {
	             *             // ...
	             *         }
	             *     });
	             */
	            init: function () {
	            },

	            /**
	             * Copies properties into this object.
	             *
	             * @param {Object} properties The properties to mix in.
	             *
	             * @example
	             *
	             *     MyType.mixIn({
	             *         field: 'value'
	             *     });
	             */
	            mixIn: function (properties) {
	                for (var propertyName in properties) {
	                    if (properties.hasOwnProperty(propertyName)) {
	                        this[propertyName] = properties[propertyName];
	                    }
	                }

	                // IE won't copy toString using the loop above
	                if (properties.hasOwnProperty('toString')) {
	                    this.toString = properties.toString;
	                }
	            },

	            /**
	             * Creates a copy of this object.
	             *
	             * @return {Object} The clone.
	             *
	             * @example
	             *
	             *     var clone = instance.clone();
	             */
	            clone: function () {
	                return this.init.prototype.extend(this);
	            }
	        };
	    }());

	    /**
	     * An array of 32-bit words.
	     *
	     * @property {Array} words The array of 32-bit words.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var WordArray = C_lib.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of 32-bit words.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.create();
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 4;
	            }
	        },

	        /**
	         * Converts this word array to a string.
	         *
	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	         *
	         * @return {string} The stringified word array.
	         *
	         * @example
	         *
	         *     var string = wordArray + '';
	         *     var string = wordArray.toString();
	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	         */
	        toString: function (encoder) {
	            return (encoder || Hex).stringify(this);
	        },

	        /**
	         * Concatenates a word array to this word array.
	         *
	         * @param {WordArray} wordArray The word array to append.
	         *
	         * @return {WordArray} This word array.
	         *
	         * @example
	         *
	         *     wordArray1.concat(wordArray2);
	         */
	        concat: function (wordArray) {
	            // Shortcuts
	            var thisWords = this.words;
	            var thatWords = wordArray.words;
	            var thisSigBytes = this.sigBytes;
	            var thatSigBytes = wordArray.sigBytes;

	            // Clamp excess bits
	            this.clamp();

	            // Concat
	            if (thisSigBytes % 4) {
	                // Copy one byte at a time
	                for (var i = 0; i < thatSigBytes; i++) {
	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
	                }
	            } else {
	                // Copy one word at a time
	                for (var i = 0; i < thatSigBytes; i += 4) {
	                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
	                }
	            }
	            this.sigBytes += thatSigBytes;

	            // Chainable
	            return this;
	        },

	        /**
	         * Removes insignificant bits.
	         *
	         * @example
	         *
	         *     wordArray.clamp();
	         */
	        clamp: function () {
	            // Shortcuts
	            var words = this.words;
	            var sigBytes = this.sigBytes;

	            // Clamp
	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
	            words.length = Math.ceil(sigBytes / 4);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = wordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone.words = this.words.slice(0);

	            return clone;
	        },

	        /**
	         * Creates a word array filled with random bytes.
	         *
	         * @param {number} nBytes The number of random bytes to generate.
	         *
	         * @return {WordArray} The random word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
	         */
	        random: function (nBytes) {
	            var words = [];

	            var r = (function (m_w) {
	                var m_w = m_w;
	                var m_z = 0x3ade68b1;
	                var mask = 0xffffffff;

	                return function () {
	                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
	                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
	                    var result = ((m_z << 0x10) + m_w) & mask;
	                    result /= 0x100000000;
	                    result += 0.5;
	                    return result * (Math.random() > .5 ? 1 : -1);
	                }
	            });

	            for (var i = 0, rcache; i < nBytes; i += 4) {
	                var _r = r((rcache || Math.random()) * 0x100000000);

	                rcache = _r() * 0x3ade67b7;
	                words.push((_r() * 0x100000000) | 0);
	            }

	            return new WordArray.init(words, nBytes);
	        }
	    });

	    /**
	     * Encoder namespace.
	     */
	    var C_enc = C.enc = {};

	    /**
	     * Hex encoding strategy.
	     */
	    var Hex = C_enc.Hex = {
	        /**
	         * Converts a word array to a hex string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The hex string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var hexChars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                hexChars.push((bite >>> 4).toString(16));
	                hexChars.push((bite & 0x0f).toString(16));
	            }

	            return hexChars.join('');
	        },

	        /**
	         * Converts a hex string to a word array.
	         *
	         * @param {string} hexStr The hex string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	         */
	        parse: function (hexStr) {
	            // Shortcut
	            var hexStrLength = hexStr.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < hexStrLength; i += 2) {
	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
	            }

	            return new WordArray.init(words, hexStrLength / 2);
	        }
	    };

	    /**
	     * Latin1 encoding strategy.
	     */
	    var Latin1 = C_enc.Latin1 = {
	        /**
	         * Converts a word array to a Latin1 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Latin1 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var latin1Chars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                latin1Chars.push(String.fromCharCode(bite));
	            }

	            return latin1Chars.join('');
	        },

	        /**
	         * Converts a Latin1 string to a word array.
	         *
	         * @param {string} latin1Str The Latin1 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	         */
	        parse: function (latin1Str) {
	            // Shortcut
	            var latin1StrLength = latin1Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < latin1StrLength; i++) {
	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
	            }

	            return new WordArray.init(words, latin1StrLength);
	        }
	    };

	    /**
	     * UTF-8 encoding strategy.
	     */
	    var Utf8 = C_enc.Utf8 = {
	        /**
	         * Converts a word array to a UTF-8 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-8 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            try {
	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
	            } catch (e) {
	                throw new Error('Malformed UTF-8 data');
	            }
	        },

	        /**
	         * Converts a UTF-8 string to a word array.
	         *
	         * @param {string} utf8Str The UTF-8 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	         */
	        parse: function (utf8Str) {
	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	        }
	    };

	    /**
	     * Abstract buffered block algorithm template.
	     *
	     * The property blockSize must be implemented in a concrete subtype.
	     *
	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
	     */
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
	        /**
	         * Resets this block algorithm's data buffer to its initial state.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm.reset();
	         */
	        reset: function () {
	            // Initial values
	            this._data = new WordArray.init();
	            this._nDataBytes = 0;
	        },

	        /**
	         * Adds new data to this block algorithm's buffer.
	         *
	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm._append('data');
	         *     bufferedBlockAlgorithm._append(wordArray);
	         */
	        _append: function (data) {
	            // Convert string to WordArray, else assume WordArray already
	            if (typeof data == 'string') {
	                data = Utf8.parse(data);
	            }

	            // Append
	            this._data.concat(data);
	            this._nDataBytes += data.sigBytes;
	        },

	        /**
	         * Processes available data blocks.
	         *
	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	         *
	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	         *
	         * @return {WordArray} The processed data.
	         *
	         * @example
	         *
	         *     var processedData = bufferedBlockAlgorithm._process();
	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	         */
	        _process: function (doFlush) {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var dataSigBytes = data.sigBytes;
	            var blockSize = this.blockSize;
	            var blockSizeBytes = blockSize * 4;

	            // Count blocks ready
	            var nBlocksReady = dataSigBytes / blockSizeBytes;
	            if (doFlush) {
	                // Round up to include partial blocks
	                nBlocksReady = Math.ceil(nBlocksReady);
	            } else {
	                // Round down to include only full blocks,
	                // less the number of blocks that must remain in the buffer
	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
	            }

	            // Count words ready
	            var nWordsReady = nBlocksReady * blockSize;

	            // Count bytes ready
	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

	            // Process blocks
	            if (nWordsReady) {
	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
	                    // Perform concrete-algorithm logic
	                    this._doProcessBlock(dataWords, offset);
	                }

	                // Remove processed words
	                var processedWords = dataWords.splice(0, nWordsReady);
	                data.sigBytes -= nBytesReady;
	            }

	            // Return processed words
	            return new WordArray.init(processedWords, nBytesReady);
	        },

	        /**
	         * Creates a copy of this object.
	         *
	         * @return {Object} The clone.
	         *
	         * @example
	         *
	         *     var clone = bufferedBlockAlgorithm.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone._data = this._data.clone();

	            return clone;
	        },

	        _minBufferSize: 0
	    });

	    /**
	     * Abstract hasher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
	     */
	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         */
	        cfg: Base.extend(),

	        /**
	         * Initializes a newly created hasher.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	         *
	         * @example
	         *
	         *     var hasher = CryptoJS.algo.SHA256.create();
	         */
	        init: function (cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this hasher to its initial state.
	         *
	         * @example
	         *
	         *     hasher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-hasher logic
	            this._doReset();
	        },

	        /**
	         * Updates this hasher with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {Hasher} This hasher.
	         *
	         * @example
	         *
	         *     hasher.update('message');
	         *     hasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            // Append
	            this._append(messageUpdate);

	            // Update the hash
	            this._process();

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the hash computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The hash.
	         *
	         * @example
	         *
	         *     var hash = hasher.finalize();
	         *     var hash = hasher.finalize('message');
	         *     var hash = hasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Final message update
	            if (messageUpdate) {
	                this._append(messageUpdate);
	            }

	            // Perform concrete-hasher logic
	            var hash = this._doFinalize();

	            return hash;
	        },

	        blockSize: 512/32,

	        /**
	         * Creates a shortcut function to a hasher's object interface.
	         *
	         * @param {Hasher} hasher The hasher to create a helper for.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	         */
	        _createHelper: function (hasher) {
	            return function (message, cfg) {
	                return new hasher.init(cfg).finalize(message);
	            };
	        },

	        /**
	         * Creates a shortcut function to the HMAC's object interface.
	         *
	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	         */
	        _createHmacHelper: function (hasher) {
	            return function (message, key) {
	                return new C_algo.HMAC.init(hasher, key).finalize(message);
	            };
	        }
	    });

	    /**
	     * Algorithm namespace.
	     */
	    var C_algo = C.algo = {};

	    return C;
	}(Math));


	return CryptoJS;

}));
},{}],4:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./sha1"), require("./hmac"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./sha1", "./hmac"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	return CryptoJS.HmacSHA1;

}));
},{"./core":3,"./hmac":6,"./sha1":7}],5:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./sha256"), require("./hmac"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./sha256", "./hmac"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	return CryptoJS.HmacSHA256;

}));
},{"./core":3,"./hmac":6,"./sha256":8}],6:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var C_enc = C.enc;
	    var Utf8 = C_enc.Utf8;
	    var C_algo = C.algo;

	    /**
	     * HMAC algorithm.
	     */
	    var HMAC = C_algo.HMAC = Base.extend({
	        /**
	         * Initializes a newly created HMAC.
	         *
	         * @param {Hasher} hasher The hash algorithm to use.
	         * @param {WordArray|string} key The secret key.
	         *
	         * @example
	         *
	         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
	         */
	        init: function (hasher, key) {
	            // Init hasher
	            hasher = this._hasher = new hasher.init();

	            // Convert string to WordArray, else assume WordArray already
	            if (typeof key == 'string') {
	                key = Utf8.parse(key);
	            }

	            // Shortcuts
	            var hasherBlockSize = hasher.blockSize;
	            var hasherBlockSizeBytes = hasherBlockSize * 4;

	            // Allow arbitrary length keys
	            if (key.sigBytes > hasherBlockSizeBytes) {
	                key = hasher.finalize(key);
	            }

	            // Clamp excess bits
	            key.clamp();

	            // Clone key for inner and outer pads
	            var oKey = this._oKey = key.clone();
	            var iKey = this._iKey = key.clone();

	            // Shortcuts
	            var oKeyWords = oKey.words;
	            var iKeyWords = iKey.words;

	            // XOR keys with pad constants
	            for (var i = 0; i < hasherBlockSize; i++) {
	                oKeyWords[i] ^= 0x5c5c5c5c;
	                iKeyWords[i] ^= 0x36363636;
	            }
	            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this HMAC to its initial state.
	         *
	         * @example
	         *
	         *     hmacHasher.reset();
	         */
	        reset: function () {
	            // Shortcut
	            var hasher = this._hasher;

	            // Reset
	            hasher.reset();
	            hasher.update(this._iKey);
	        },

	        /**
	         * Updates this HMAC with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {HMAC} This HMAC instance.
	         *
	         * @example
	         *
	         *     hmacHasher.update('message');
	         *     hmacHasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            this._hasher.update(messageUpdate);

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the HMAC computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The HMAC.
	         *
	         * @example
	         *
	         *     var hmac = hmacHasher.finalize();
	         *     var hmac = hmacHasher.finalize('message');
	         *     var hmac = hmacHasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Shortcut
	            var hasher = this._hasher;

	            // Compute HMAC
	            var innerHash = hasher.finalize(messageUpdate);
	            hasher.reset();
	            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

	            return hmac;
	        }
	    });
	}());


}));
},{"./core":3}],7:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Reusable object
	    var W = [];

	    /**
	     * SHA-1 hash algorithm.
	     */
	    var SHA1 = C_algo.SHA1 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0x67452301, 0xefcdab89,
	                0x98badcfe, 0x10325476,
	                0xc3d2e1f0
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var H = this._hash.words;

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];
	            var e = H[4];

	            // Computation
	            for (var i = 0; i < 80; i++) {
	                if (i < 16) {
	                    W[i] = M[offset + i] | 0;
	                } else {
	                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
	                    W[i] = (n << 1) | (n >>> 31);
	                }

	                var t = ((a << 5) | (a >>> 27)) + e + W[i];
	                if (i < 20) {
	                    t += ((b & c) | (~b & d)) + 0x5a827999;
	                } else if (i < 40) {
	                    t += (b ^ c ^ d) + 0x6ed9eba1;
	                } else if (i < 60) {
	                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
	                } else /* if (i < 80) */ {
	                    t += (b ^ c ^ d) - 0x359d3e2a;
	                }

	                e = d;
	                d = c;
	                c = (b << 30) | (b >>> 2);
	                b = a;
	                a = t;
	            }

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	            H[4] = (H[4] + e) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Return final computed hash
	            return this._hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA1('message');
	     *     var hash = CryptoJS.SHA1(wordArray);
	     */
	    C.SHA1 = Hasher._createHelper(SHA1);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA1(message, key);
	     */
	    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
	}());


	return CryptoJS.SHA1;

}));
},{"./core":3}],8:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Initialization and round constants tables
	    var H = [];
	    var K = [];

	    // Compute constants
	    (function () {
	        function isPrime(n) {
	            var sqrtN = Math.sqrt(n);
	            for (var factor = 2; factor <= sqrtN; factor++) {
	                if (!(n % factor)) {
	                    return false;
	                }
	            }

	            return true;
	        }

	        function getFractionalBits(n) {
	            return ((n - (n | 0)) * 0x100000000) | 0;
	        }

	        var n = 2;
	        var nPrime = 0;
	        while (nPrime < 64) {
	            if (isPrime(n)) {
	                if (nPrime < 8) {
	                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
	                }
	                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

	                nPrime++;
	            }

	            n++;
	        }
	    }());

	    // Reusable object
	    var W = [];

	    /**
	     * SHA-256 hash algorithm.
	     */
	    var SHA256 = C_algo.SHA256 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init(H.slice(0));
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var H = this._hash.words;

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];
	            var e = H[4];
	            var f = H[5];
	            var g = H[6];
	            var h = H[7];

	            // Computation
	            for (var i = 0; i < 64; i++) {
	                if (i < 16) {
	                    W[i] = M[offset + i] | 0;
	                } else {
	                    var gamma0x = W[i - 15];
	                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
	                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
	                                   (gamma0x >>> 3);

	                    var gamma1x = W[i - 2];
	                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
	                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
	                                   (gamma1x >>> 10);

	                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
	                }

	                var ch  = (e & f) ^ (~e & g);
	                var maj = (a & b) ^ (a & c) ^ (b & c);

	                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
	                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

	                var t1 = h + sigma1 + ch + K[i] + W[i];
	                var t2 = sigma0 + maj;

	                h = g;
	                g = f;
	                f = e;
	                e = (d + t1) | 0;
	                d = c;
	                c = b;
	                b = a;
	                a = (t1 + t2) | 0;
	            }

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	            H[4] = (H[4] + e) | 0;
	            H[5] = (H[5] + f) | 0;
	            H[6] = (H[6] + g) | 0;
	            H[7] = (H[7] + h) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Return final computed hash
	            return this._hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA256('message');
	     *     var hash = CryptoJS.SHA256(wordArray);
	     */
	    C.SHA256 = Hasher._createHelper(SHA256);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA256(message, key);
	     */
	    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
	}(Math));


	return CryptoJS.SHA256;

}));
},{"./core":3}],"auth":[function(require,module,exports){
'use strict';

var config = require('config'),
    Utils = require('utils'),
    sha1 = require('crypto-js/hmac-sha1'),
    sha256 = require('crypto-js/hmac-sha256');

function AuthProxy(service) {
    this.service = service;
}

AuthProxy.prototype = {

    getSession: function(callback) {
        $.ajax({ url: Utils.getUrl(config.urls.session) }, function(err, res) {
            if (err) {
                callback(err, null);
            } else {
                callback(err, res);
            }
        });
    },

    createSession: function(params, callback) {
        if (config.creds.appId === '' ||
            config.creds.authKey === '' ||
            config.creds.authSecret === '') {
            throw new Error('Cannot create a new session without app credentials (app ID, auth key and auth secret)');
        }

        var _this = this,
            message;

        if (typeof params === 'function' && typeof callback === 'undefined') {
            callback = params;
            params = {};
        }

        // Signature of message with SHA-1 using secret key
        message = generateAuthMsg(params);
        message.signature = signMessage(message, config.creds.authSecret);

        $.ajax({ url: Utils.getUrl(config.urls.session), type: 'POST', data: message },
            function(err, res) {
                if (err) {
                    callback(err, null);
                } else {
                    _this.service.setSession(res.session);
                    callback(null, res.session);
                }
            });
    },

    destroySession: function(callback) {
        var _this = this;

        this.service.ajax({ url: Utils.getUrl(config.urls.session), type: 'DELETE', dataType: 'text' },
            function(err, res) {
                if (err) {
                    callback(err, null);
                } else {
                    _this.service.setSession(null);
                    callback(null, res);
                }
            });
    },

    login: function(params, callback) {
        var ajaxParams = {
            type: 'POST',
            url: Utils.getUrl(config.urls.login),
            data: params
        };

        function handleResponce(err, res) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, res.user);
            }
        }

        $.ajax(ajaxParams, handleResponce);
    },

    logout: function(callback) {
        $.ajax({ url: Utils.getUrl(config.urls.login), type: 'DELETE', dataType: 'text' }, callback);
    }

};

module.exports = AuthProxy;

/* Private
---------------------------------------------------------------------- */
function generateAuthMsg(params) {
    var message = {
        application_id: config.creds.appId,
        auth_key: config.creds.authKey,
        nonce: Utils.randomNonce(),
        timestamp: Utils.unixTime()
    };

    // With user authorization
    if (params.login && params.password) {
        message.user = { login: params.login, password: params.password };
    } else if (params.email && params.password) {
        message.user = { email: params.email, password: params.password };
    } else if (params.provider) {
        // Via social networking provider (e.g. facebook, twitter etc.)
        message.provider = params.provider;
        if (params.scope) {
            message.scope = params.scope;
        }
        if (params.keys && params.keys.token) {
            message.keys = { token: params.keys.token };
        }
        if (params.keys && params.keys.secret) {
            message.keys.secret = params.keys.secret;
        }
    }

    return message;
}

function signMessage(message, secret) {
    var sessionMsg = Object.keys(message).map(function(val) {
        if (typeof message[val] === 'object') {
            return Object.keys(message[val]).map(function(val1) {
                return val + '[' + val1 + ']=' + message[val][val1];
            }).sort().join('&');
        } else {
            return val + '=' + message[val];
        }
    }).sort().join('&');


    var cryptoSessionMsg;

    if (config.hash === 'sha1') {
        cryptoSessionMsg = sha1(sessionMsg, secret).toString();
    } else if (config.hash === 'sha256') {
        cryptoSessionMsg = sha256(sessionMsg, secret).toString();
    } else {
        throw new Error('Unknown crypto standards, available sha1 or sha256');
    }

    return cryptoSessionMsg;
}
},{"config":"config","crypto-js/hmac-sha1":4,"crypto-js/hmac-sha256":5,"utils":"utils"}],"config":[function(require,module,exports){
'use strict';

/*
 * LAApp JavaScript SDK
 *
 * Configuration Module
 *
 * NOTE:
 *  - config.webrtc.statsReportTimeInterval [integer, sec]:
 *  could add listener onCallStatsReport(session, userId, bytesReceived) if
 *  want to get stats (bytesReceived) about peer every X sec;
 */

var config = {
    version: '2.12.0',
    buildNumber: '1081',
    creds: {
        appId: '',
        authKey: '',
        authSecret: ''
    },
    endpoints: {
        api: 'localhost:8989/api',
        chat: 'chat.quickblox.com',
        muc: 'muc.chat.quickblox.com'
    },
    hash: 'sha1',
    streamManagement: {
        enable: false
    },
    chatProtocol: {
        bosh: 'http://chat.quickblox.com:5281',
        websocket: 'wss://chat.quickblox.com:5291',
        active: 2
    },
    chatReconnectionTimeInterval: 5,
    webrtc: {
        answerTimeInterval: 60,
        dialingTimeInterval: 5,
        disconnectTimeInterval: 30,
        statsReportTimeInterval: false,
        iceServers: [{
                'url': 'stun:stun.l.google.com:19302'
            },
            {
                'url': 'stun:turn.quickblox.com',
                'username': 'quickblox',
                'credential': 'baccb97ba2d92d71e26eb9886da5f1e0'
            },
            {
                'url': 'turn:turn.quickblox.com:3478?transport=udp',
                'username': 'quickblox',
                'credential': 'baccb97ba2d92d71e26eb9886da5f1e0'
            },
            {
                'url': 'turn:turn.quickblox.com:3478?transport=tcp',
                'username': 'quickblox',
                'credential': 'baccb97ba2d92d71e26eb9886da5f1e0'
            },
            {
                'url': 'turn:turnsingapor.quickblox.com:3478?transport=udp',
                'username': 'quickblox',
                'credential': 'baccb97ba2d92d71e26eb9886da5f1e0'
            },
            {
                'url': 'turn:turnsingapore.quickblox.com:3478?transport=tcp',
                'username': 'quickblox',
                'credential': 'baccb97ba2d92d71e26eb9886da5f1e0'
            },
            {
                'url': 'turn:turnireland.quickblox.com:3478?transport=udp',
                'username': 'quickblox',
                'credential': 'baccb97ba2d92d71e26eb9886da5f1e0'
            },
            {
                'url': 'turn:turnireland.quickblox.com:3478?transport=tcp',
                'username': 'quickblox',
                'credential': 'baccb97ba2d92d71e26eb9886da5f1e0'
            }
        ]
    },
    urls: {
        session: 'session',
        login: 'login',
        users: 'users',
        chat: 'chat',
        blobs: 'blobs',
        geodata: 'geodata',
        pushtokens: 'push_tokens',
        subscriptions: 'subscriptions',
        events: 'events',
        data: 'data',
        addressbook: 'address_book',
        addressbookRegistered: 'address_book/registered_users',
        type: '.json'
    },
    on: {
        sessionExpired: null
    },
    timeout: null,
    debug: {
        mode: 0,
        file: null
    },
    addISOTime: false
};

config.set = function(options) {
    if (typeof options.endpoints === 'object' && options.endpoints.chat) {
        config.endpoints.muc = 'muc.' + options.endpoints.chat;
        config.chatProtocol.bosh = 'http://' + options.endpoints.chat + ':5281';
        config.chatProtocol.websocket = 'wss://' + options.endpoints.chat + ':5291';
    }

    Object.keys(options).forEach(function(key) {
        if (key !== 'set' && config.hasOwnProperty(key)) {
            if (typeof options[key] !== 'object') {
                config[key] = options[key];
            } else {
                Object.keys(options[key]).forEach(function(nextkey) {
                    if (config[key].hasOwnProperty(nextkey)) {
                        config[key][nextkey] = options[key][nextkey];
                    }
                });
            }
        }

        // backward compatibility: for config.iceServers
        if (key === 'iceServers') {
            config.webrtc.iceServers = options[key];
        }
    });
};

module.exports = config;
},{}],"main":[function(require,module,exports){
'use strict';

/*
 * JavaScript SDK
 *
 * Main SDK Module
 *
 */
var config = require('config');
var Utils = require('utils');

function LAApp() {};

LAApp.prototype = {

    /**
     * Return current version of LA JavaScript SDK
     * @memberof LAApp
     * */
    version: config.version,

    /**
     * Return current build number of LA JavaScript SDK
     * @memberof LAApp
     * */
    buildNumber: config.buildNumber,


    /**
     * @memberof LA
     * @param {Number | String} appIdOrToken - Application ID (from your admin panel) or Session Token.
     * @param {String | Number} authKeyOrAppId - Authorization key or Application ID. You need to set up Application ID if you use session token as appIdOrToken parameter.
     * @param {String} authSecret - Authorization secret key (from your admin panel).
     * @param {Object} configMap - Settings object for QuickBlox SDK.
     */
    init: function(appIdOrToken, authKeyOrAppId, authSecret, configMap) {
        if (configMap && typeof configMap === 'object') {
            config.set(configMap);
        }
        var Auth = require('auth');
        this.auth = new Auth(this.service);

        // if (Utils.getEnv().browser) {
        //     /** add adapter.js*/
        //     require('webrtc-adapter');

        //     /** add WebRTC API if API is avaible */
        //     if (Utils.isWebRTCAvailble()) {
        //         var WebRTCClient = require('./modules/webrtc/WebRTCClient');
        //         this.webrtc = new WebRTCClient(this.service, this.chat.connection);
        //         this.chat.webrtcSignalingProcessor = this.webrtc.signalingProcessor;
        //     } else {
        //         this.webrtc = false;
        //     }
        // } else {
        //     this.webrtc = false;
        // }

        // <!-- =================================================== BY Default =================================================== -->
        // /** include dependencies */
        // var Proxy = require('./qbProxy'),
        //     Auth = require('./modules/qbAuth'),
        //     Users = require('./modules/qbUsers'),
        //     Content = require('./modules/qbContent'),
        //     PushNotifications = require('./modules/qbPushNotifications'),
        //     Data = require('./modules/qbData'),
        //     AddressBook = require('./modules/qbAddressBook'),
        //     Chat = require('./modules/chat/qbChat'),
        //     DialogProxy = require('./modules/chat/qbDialog'),
        //     MessageProxy = require('./modules/chat/qbMessage');
        // <!-- =================================================== BY Default =================================================== -->

        // this.service = new Proxy();
        // this.auth = new Auth(this.service);
        // this.users = new Users(this.service);
        // this.content = new Content(this.service);
        // this.pushnotifications = new PushNotifications(this.service);
        // this.data = new Data(this.service);
        // this.addressbook = new AddressBook(this.service);
        // this.chat = new Chat(this.service);
        // this.chat.dialog = new DialogProxy(this.service);
        // this.chat.message = new MessageProxy(this.service);

        // if (Utils.getEnv().browser) {
        //     /** add adapter.js*/
        //     require('webrtc-adapter');

        //     /** add WebRTC API if API is avaible */
        //     if (Utils.isWebRTCAvailble()) {
        //         var WebRTCClient = require('./modules/webrtc/qbWebRTCClient');
        //         this.webrtc = new WebRTCClient(this.service, this.chat.connection);
        //         this.chat.webrtcSignalingProcessor = this.webrtc.signalingProcessor;
        //     } else {
        //         this.webrtc = false;
        //     }
        // } else {
        //     this.webrtc = false;
        // }
        // <!-- =================================================== BY Default =================================================== -->

        // Initialization by outside token
        if (typeof appIdOrToken === 'string' && (!authKeyOrAppId || typeof authKeyOrAppId === 'number') && !authSecret) {

            if (typeof authKeyOrAppId === 'number') {
                config.creds.appId = authKeyOrAppId;
                console.log("Hi Team authKeyOrAppId === number");
            }

            this.service.setSession({ token: appIdOrToken });
            console.log("Hi Team authKeyOrAppId === 'number'");

        } else {
            config.creds.appId = appIdOrToken;
            config.creds.authKey = authKeyOrAppId;
            config.creds.authSecret = authSecret;
            console.log("Hi Team config.creds.appId = appIdOrToken;");
        }
    },
    // <!-- =================================================== START SESSIONS & AUTHENTICATIONs FEATURES =================================================== -->

    /**
     * Return current session
     * @memberof LA
     * @param {getSessionCallback} callback - The getSessionCallback function.
     * */
    getSession: function(callback) {
        /**
         * This callback return session object.
         * @callback getSessionCallback
         * @param {Object} error - The error object
         * @param {Object} session - Contains of session object
         * */
        this.auth.getSession(callback);
    },

    /**
     * Creat new session.
     * @memberof LA
     * @param {String} appIdOrToken Should be applecationID or token.
     * @param {createSessionCallback} callback -
     * */
    createSession: function(params, callback) {
        /**
         * This callback return session object.
         * @callback createSession
         * @param {Object} error - The error object
         * @param {Object} session - Contains of session object
         * */
        this.auth.createSession(params, callback);
    },

    /**
     * Destroy current session.
     * @memberof LA
     * @param {destroySessionCallback} callback - The destroySessionCallback function.
     * */
    destroySession: function(callback) {
        /**
         * This callback returns error or empty string.
         * @callback destroySessionCallback
         * @param {Object | Null} error - The error object if got en error and null if success.
         * @param {Null | String} result - String (" ") if session was removed successfully.
         * */
        this.auth.destroySession(callback);
    },

    /**
     * Login to application.
     * @memberof LA
     * @param {Object} params - Params object for login into the session.
     * @param {loginCallback} callback - The loginCallback function.
     * */
    login: function(params, callback) {
        /**
         * This callback return error or user Object.
         * @callback loginCallback
         * @param {Object | Null} error - The error object if got en error and null if success.
         * @param {Null | Object} result - User data object if everything goes well and null on error.
         * */
        this.auth.login(params, callback);
    },

    /**
     * Remove user from current session, but doesn't destroy it.
     * @memberof LA
     * @param {logoutCallback} callback - The logoutCallback function.
     * */
    logout: function(callback) {
        /**
         * This callback return error or user Object.
         * @callback logoutCallback
         * @param {Object | Null} error - The error object if got en error and null if success.
         * @param {Null | String} result - String (" ") if session was removed successfully.
         * */
        this.auth.logout(callback);
    }

    // <!-- =================================================== START SESSIONS & AUTHENTICATIONs FEATURES =================================================== -->
};

/**
 * @namespace
 */
var LA = new LAApp();

LA.LAApp = LAApp;

module.exports = LA;
},{"auth":"auth","config":"config","utils":"utils"}],"utils":[function(require,module,exports){
(function (global){
/* eslint no-console: 2 */

'use strict';

var config = require('./config');

var unsupported = "This function isn't supported outside of the browser (...yet)";

var isNativeScript = typeof global === 'object' && (global.hasOwnProperty('android') || global.hasOwnProperty('NSObject')),
    isNode = typeof window === 'undefined' && typeof exports === 'object' && !isNativeScript,
    isBrowser = typeof window !== 'undefined';

if (isNode) {
    var fs = require('fs');
    var os = require('os');
}

// The object for type MongoDB.Bson.ObjectId
// http://docs.mongodb.org/manual/reference/object-id/
var ObjectId = {
    machine: Math.floor(Math.random() * 16777216).toString(16),
    pid: Math.floor(Math.random() * 32767).toString(16),
    increment: 0
};

var Utils = {
    /**
     * [getEnv get a name of an execution environment]
     * @return {object} return names of env. (node/browser)
     */
    getEnv: function() {
        return {
            'nativescript': isNativeScript,
            'browser': isBrowser,
            'node': isNode,
        };
    },

    _getOSInfoFromNodeJS: function() {
        return os.platform();
    },

    _getOSInfoFromBrowser: function() {
        return window.navigator.userAgent;
    },

    _getOSInfoFromNativeScript: function() {
        return (global && global.hasOwnProperty('android') ? 'Android' : 'iOS') + ' - NativeScript';
    },

    getOS: function() {
        var self = this;
        var osName = 'An unknown OS';

        var OS_LIST = [{
                osName: 'Windows',
                codeNames: ['Windows', 'win32']
            },
            {
                osName: 'Linux',
                codeNames: ['Linux', 'linux']
            },
            {
                osName: 'macOS',
                codeNames: ['Mac OS', 'darwin']
            }
        ];

        var platformInfo;

        if (self.getEnv().browser) {
            platformInfo = self._getOSInfoFromBrowser();
        } else if (self.getEnv().node) {
            platformInfo = self._getOSInfoFromNodeJS();
        } else if (self.getEnv().nativescript) {
            return self._getOSInfoFromNativeScript();
        }

        OS_LIST.forEach(function(osInfo) {
            osInfo.codeNames.forEach(function(codeName) {
                var index = platformInfo.indexOf(codeName);

                if (index !== -1) {
                    osName = osInfo.osName;
                }
            });
        });

        return osName;
    },

    safeCallbackCall: function() {
        var listenerString = arguments[0].toString(),
            listenerName = listenerString.split('(')[0].split(' ')[1],
            argumentsCopy = [],
            listenerCall;

        for (var i = 0; i < arguments.length; i++) {
            argumentsCopy.push(arguments[i]);
        }

        listenerCall = argumentsCopy.shift();

        try {
            listenerCall.apply(null, argumentsCopy);
        } catch (err) {
            if (listenerName === '') {
                console.error('Error: ' + err);
            } else {
                console.error('Error in listener ' + listenerName + ': ' + err);
            }
        }
    },

    randomNonce: function() {
        return Math.floor(Math.random() * 10000);
    },

    unixTime: function() {
        return Math.floor(Date.now() / 1000);
    },

    getUrl: function(base, id) {
        var resource = id ? '/' + id : '';
        return 'https://' + config.endpoints.api + '/' + base + resource + config.urls.type;
    },

    isArray: function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    },

    isObject: function(arg) {
        return Object.prototype.toString.call(arg) === '[object Object]';
    },

    // Generating BSON ObjectId and converting it to a 24 character string representation
    // Changed from https://github.com/justaprogrammer/ObjectId.js/blob/master/src/main/javascript/Objectid.js
    getBsonObjectId: function() {
        var timestamp = this.unixTime().toString(16),
            increment = (ObjectId.increment++).toString(16);

        if (increment > 0xffffff) ObjectId.increment = 0;

        return '00000000'.substr(0, 8 - timestamp.length) + timestamp +
            '000000'.substr(0, 6 - ObjectId.machine.length) + ObjectId.machine +
            '0000'.substr(0, 4 - ObjectId.pid.length) + ObjectId.pid +
            '000000'.substr(0, 6 - increment.length) + increment;
    },

    injectISOTimes: function(data) {
        if (data.created_at) {
            if (typeof data.created_at === 'number') data.iso_created_at = new Date(data.created_at * 1000).toISOString();
            if (typeof data.updated_at === 'number') data.iso_updated_at = new Date(data.updated_at * 1000).toISOString();
        } else if (data.items) {
            for (var i = 0, len = data.items.length; i < len; ++i) {
                if (typeof data.items[i].created_at === 'number') data.items[i].iso_created_at = new Date(data.items[i].created_at * 1000).toISOString();
                if (typeof data.items[i].updated_at === 'number') data.items[i].iso_updated_at = new Date(data.items[i].updated_at * 1000).toISOString();
            }
        }
        return data;
    },

    LALog: function() {
        if (this.loggers) {
            for (var i = 0; i < this.loggers.length; ++i) {
                this.loggers[i](arguments);
            }

            return;
        }

        var logger;

        this.loggers = [];

        var consoleLoggerFunction = function() {
            var logger = function(args) {
                console.log.apply(console, Array.prototype.slice.call(args));
            };

            return logger;
        };

        var fileLoggerFunction = function() {
            var logger = function(args) {
                if (!fs) {
                    throw unsupported;
                } else {
                    var data = [];

                    for (var i = 0; i < args.length; i++) {
                        data.push(JSON.stringify(args[i]));
                    }

                    data = data.join(' ');

                    var toLog = '\n' + new Date() + '. ' + data;

                    fs.appendFile(config.debug.file, toLog, function(err) {
                        if (err) {
                            return console.error('Error while writing log to file. Error: ' + err);
                        }
                    });
                }
            };

            return logger;
        };

        // Build loggers
        // format "debug: { }"

        if (typeof config.debug === 'object') {
            if (typeof config.debug.mode === 'number') {
                if (config.debug.mode == 1) {
                    logger = consoleLoggerFunction();
                    this.loggers.push(logger);
                } else if (config.debug.mode == 2) {
                    logger = fileLoggerFunction();
                    this.loggers.push(logger);
                }
            } else if (typeof config.debug.mode === 'object') {
                var self = this;

                config.debug.mode.forEach(function(mode) {
                    if (mode === 1) {
                        logger = consoleLoggerFunction();
                        self.loggers.push(logger);
                    } else if (mode === 2) {
                        logger = fileLoggerFunction();
                        self.loggers.push(logger);
                    }
                });
            }

            // format "debug: true"
            // backward compatibility
        } else if (typeof config.debug === 'boolean') {
            if (config.debug) {
                logger = consoleLoggerFunction();
                this.loggers.push(logger);
            }
        }

        if (this.loggers) {
            for (var j = 0; j < this.loggers.length; ++j) {
                this.loggers[j](arguments);
            }
        }
    },

    isWebRTCAvailble: function() {
        /** Shims */
        var RTCPeerConnection = window.RTCPeerConnection,
            IceCandidate = window.RTCIceCandidate,
            SessionDescription = window.RTCSessionDescription,
            isAvaible = true;

        if (!RTCPeerConnection || !IceCandidate || !SessionDescription) {
            isAvaible = false;
        }

        return isAvaible;
    },

    getError: function(code, detail, moduleName) {
        var errorMsg = {
            code: code,
            status: 'error',
            detail: detail
        };

        switch (code) {
            case 401:
                errorMsg.message = 'Unauthorized';
                break;

            case 403:
                errorMsg.message = 'Forbidden';
                break;

            case 408:
                errorMsg.message = 'Request Timeout';
                break;

            case 422:
                errorMsg.message = 'Unprocessable Entity';
                break;

            case 502:
                errorMsg.message = 'Bad Gateway';
                break;

            default:
                errorMsg.message = 'Unknown error';
                break;
        }

        this.QBLog('[' + moduleName + ']', 'Error:', detail);

        return errorMsg;
    },

    MergeArrayOfObjects: function(arrayTo, arrayFrom) {
        var merged = JSON.parse(JSON.stringify(arrayTo));

        firstLevel: for (var i = 0; i < arrayFrom.length; i++) {
            var newItem = arrayFrom[i];

            for (var j = 0; j < merged.length; j++) {
                if (newItem.user_id === merged[j].user_id) {
                    merged[j] = newItem;
                    continue firstLevel;
                }
            }
            merged.push(newItem);
        }
        return merged;
    }
};

module.exports = Utils;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./config":"config","fs":1,"os":2}]},{},[]);
