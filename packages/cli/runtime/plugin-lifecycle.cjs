// Generated from the engine lifecycle. Do not edit.
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "node_modules/semver/internal/constants.js"(exports2, module2) {
    "use strict";
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module2.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "node_modules/semver/internal/debug.js"(exports2, module2) {
    "use strict";
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module2.exports = debug;
  }
});

// node_modules/semver/internal/re.js
var require_re = __commonJS({
  "node_modules/semver/internal/re.js"(exports2, module2) {
    "use strict";
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants();
    var debug = require_debug();
    exports2 = module2.exports = {};
    var re = exports2.re = [];
    var safeRe = exports2.safeRe = [];
    var src = exports2.src = [];
    var safeSrc = exports2.safeSrc = [];
    var t = exports2.t = {};
    var R2 = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R2++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      safeSrc[index] = safe;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports2.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports2.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports2.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "node_modules/semver/internal/parse-options.js"(exports2, module2) {
    "use strict";
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    };
    module2.exports = parseOptions;
  }
});

// node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "node_modules/semver/internal/identifiers.js"(exports2, module2) {
    "use strict";
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b2) => {
      if (typeof a === "number" && typeof b2 === "number") {
        return a === b2 ? 0 : a < b2 ? -1 : 1;
      }
      const anum = numeric.test(a);
      const bnum = numeric.test(b2);
      if (anum && bnum) {
        a = +a;
        b2 = +b2;
      }
      return a === b2 ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b2 ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b2) => compareIdentifiers(b2, a);
    module2.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "node_modules/semver/classes/semver.js"(exports2, module2) {
    "use strict";
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var isPrereleaseIdentifier = (prerelease, identifier5) => {
      const identifiers = identifier5.split(".");
      if (identifiers.length > prerelease.length) {
        return false;
      }
      for (let i = 0; i < identifiers.length; i++) {
        if (compareIdentifiers(prerelease[i], identifiers[i]) !== 0) {
          return false;
        }
      }
      return true;
    };
    var SemVer = class _SemVer {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof _SemVer) {
          if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m2 = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m2) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m2[1];
        this.minor = +m2[2];
        this.patch = +m2[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m2[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m2[4].split(".").map((id2) => {
            if (/^[0-9]+$/.test(id2)) {
              const num = +id2;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id2;
          });
        }
        this.build = m2[5] ? m2[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.major < other.major) {
          return -1;
        }
        if (this.major > other.major) {
          return 1;
        }
        if (this.minor < other.minor) {
          return -1;
        }
        if (this.minor > other.minor) {
          return 1;
        }
        if (this.patch < other.patch) {
          return -1;
        }
        if (this.patch > other.patch) {
          return 1;
        }
        return 0;
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b2 = other.prerelease[i];
          debug("prerelease compare", i, a, b2);
          if (a === void 0 && b2 === void 0) {
            return 0;
          } else if (b2 === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b2) {
            continue;
          } else {
            return compareIdentifiers(a, b2);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b2 = other.build[i];
          debug("build compare", i, a, b2);
          if (a === void 0 && b2 === void 0) {
            return 0;
          } else if (b2 === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b2) {
            continue;
          } else {
            return compareIdentifiers(a, b2);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release2, identifier5, identifierBase) {
        if (release2.startsWith("pre")) {
          if (!identifier5 && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (identifier5) {
            const match = `-${identifier5}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
            if (!match || match[1] !== identifier5) {
              throw new Error(`invalid identifier: ${identifier5}`);
            }
          }
        }
        switch (release2) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier5, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier5, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier5, identifierBase);
            this.inc("pre", identifier5, identifierBase);
            break;
          // If the input is a non-prerelease version, this acts the same as
          // prepatch.
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier5, identifierBase);
            }
            this.inc("pre", identifier5, identifierBase);
            break;
          case "release":
            if (this.prerelease.length === 0) {
              throw new Error(`version ${this.raw} is not a prerelease`);
            }
            this.prerelease.length = 0;
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          // This probably shouldn't be used publicly.
          // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier5 === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier5) {
              let prerelease = [identifier5, base];
              if (identifierBase === false) {
                prerelease = [identifier5];
              }
              if (isPrereleaseIdentifier(this.prerelease, identifier5)) {
                const prereleaseBase = this.prerelease[identifier5.split(".").length];
                if (isNaN(prereleaseBase)) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release2}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module2.exports = SemVer;
  }
});

// node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "node_modules/semver/functions/parse.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var parse2 = (version, options, throwErrors = false) => {
      if (version instanceof SemVer) {
        return version;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module2.exports = parse2;
  }
});

// node_modules/semver/functions/valid.js
var require_valid = __commonJS({
  "node_modules/semver/functions/valid.js"(exports2, module2) {
    "use strict";
    var parse2 = require_parse();
    var valid2 = (version, options) => {
      const v2 = parse2(version, options);
      return v2 ? v2.version : null;
    };
    module2.exports = valid2;
  }
});

// node_modules/semver/functions/clean.js
var require_clean = __commonJS({
  "node_modules/semver/functions/clean.js"(exports2, module2) {
    "use strict";
    var parse2 = require_parse();
    var clean = (version, options) => {
      const s = parse2(version.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    };
    module2.exports = clean;
  }
});

// node_modules/semver/functions/inc.js
var require_inc = __commonJS({
  "node_modules/semver/functions/inc.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var inc = (version, release2, options, identifier5, identifierBase) => {
      if (typeof options === "string") {
        identifierBase = identifier5;
        identifier5 = options;
        options = void 0;
      }
      try {
        return new SemVer(
          version instanceof SemVer ? version.version : version,
          options
        ).inc(release2, identifier5, identifierBase).version;
      } catch (er) {
        return null;
      }
    };
    module2.exports = inc;
  }
});

// node_modules/semver/functions/diff.js
var require_diff = __commonJS({
  "node_modules/semver/functions/diff.js"(exports2, module2) {
    "use strict";
    var parse2 = require_parse();
    var diff = (version1, version2) => {
      const v1 = parse2(version1, null, true);
      const v2 = parse2(version2, null, true);
      const comparison = v1.compare(v2);
      if (comparison === 0) {
        return null;
      }
      const v1Higher = comparison > 0;
      const highVersion = v1Higher ? v1 : v2;
      const lowVersion = v1Higher ? v2 : v1;
      const highHasPre = !!highVersion.prerelease.length;
      const lowHasPre = !!lowVersion.prerelease.length;
      if (lowHasPre && !highHasPre) {
        if (!lowVersion.patch && !lowVersion.minor) {
          return "major";
        }
        if (lowVersion.compareMain(highVersion) === 0) {
          if (lowVersion.minor && !lowVersion.patch) {
            return "minor";
          }
          return "patch";
        }
      }
      const prefix = highHasPre ? "pre" : "";
      if (v1.major !== v2.major) {
        return prefix + "major";
      }
      if (v1.minor !== v2.minor) {
        return prefix + "minor";
      }
      if (v1.patch !== v2.patch) {
        return prefix + "patch";
      }
      return "prerelease";
    };
    module2.exports = diff;
  }
});

// node_modules/semver/functions/major.js
var require_major = __commonJS({
  "node_modules/semver/functions/major.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var major = (a, loose) => new SemVer(a, loose).major;
    module2.exports = major;
  }
});

// node_modules/semver/functions/minor.js
var require_minor = __commonJS({
  "node_modules/semver/functions/minor.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var minor = (a, loose) => new SemVer(a, loose).minor;
    module2.exports = minor;
  }
});

// node_modules/semver/functions/patch.js
var require_patch = __commonJS({
  "node_modules/semver/functions/patch.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var patch = (a, loose) => new SemVer(a, loose).patch;
    module2.exports = patch;
  }
});

// node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS({
  "node_modules/semver/functions/prerelease.js"(exports2, module2) {
    "use strict";
    var parse2 = require_parse();
    var prerelease = (version, options) => {
      const parsed = parse2(version, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    };
    module2.exports = prerelease;
  }
});

// node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "node_modules/semver/functions/compare.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var compare = (a, b2, loose) => new SemVer(a, loose).compare(new SemVer(b2, loose));
    module2.exports = compare;
  }
});

// node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS({
  "node_modules/semver/functions/rcompare.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var rcompare = (a, b2, loose) => compare(b2, a, loose);
    module2.exports = rcompare;
  }
});

// node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS({
  "node_modules/semver/functions/compare-loose.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var compareLoose = (a, b2) => compare(a, b2, true);
    module2.exports = compareLoose;
  }
});

// node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS({
  "node_modules/semver/functions/compare-build.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var compareBuild = (a, b2, loose) => {
      const versionA = new SemVer(a, loose);
      const versionB = new SemVer(b2, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    };
    module2.exports = compareBuild;
  }
});

// node_modules/semver/functions/sort.js
var require_sort = __commonJS({
  "node_modules/semver/functions/sort.js"(exports2, module2) {
    "use strict";
    var compareBuild = require_compare_build();
    var sort = (list3, loose) => list3.sort((a, b2) => compareBuild(a, b2, loose));
    module2.exports = sort;
  }
});

// node_modules/semver/functions/rsort.js
var require_rsort = __commonJS({
  "node_modules/semver/functions/rsort.js"(exports2, module2) {
    "use strict";
    var compareBuild = require_compare_build();
    var rsort = (list3, loose) => list3.sort((a, b2) => compareBuild(b2, a, loose));
    module2.exports = rsort;
  }
});

// node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  "node_modules/semver/functions/gt.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var gt = (a, b2, loose) => compare(a, b2, loose) > 0;
    module2.exports = gt;
  }
});

// node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "node_modules/semver/functions/lt.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var lt = (a, b2, loose) => compare(a, b2, loose) < 0;
    module2.exports = lt;
  }
});

// node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  "node_modules/semver/functions/eq.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var eq = (a, b2, loose) => compare(a, b2, loose) === 0;
    module2.exports = eq;
  }
});

// node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  "node_modules/semver/functions/neq.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var neq = (a, b2, loose) => compare(a, b2, loose) !== 0;
    module2.exports = neq;
  }
});

// node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "node_modules/semver/functions/gte.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var gte = (a, b2, loose) => compare(a, b2, loose) >= 0;
    module2.exports = gte;
  }
});

// node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  "node_modules/semver/functions/lte.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var lte = (a, b2, loose) => compare(a, b2, loose) <= 0;
    module2.exports = lte;
  }
});

// node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  "node_modules/semver/functions/cmp.js"(exports2, module2) {
    "use strict";
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = (a, op, b2, loose) => {
      switch (op) {
        case "===":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b2 === "object") {
            b2 = b2.version;
          }
          return a === b2;
        case "!==":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b2 === "object") {
            b2 = b2.version;
          }
          return a !== b2;
        case "":
        case "=":
        case "==":
          return eq(a, b2, loose);
        case "!=":
          return neq(a, b2, loose);
        case ">":
          return gt(a, b2, loose);
        case ">=":
          return gte(a, b2, loose);
        case "<":
          return lt(a, b2, loose);
        case "<=":
          return lte(a, b2, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module2.exports = cmp;
  }
});

// node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "node_modules/semver/functions/coerce.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var parse2 = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = (version, options) => {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === "number") {
        version = String(version);
      }
      if (typeof version !== "string") {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || "0";
      const patch = match[4] || "0";
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
      return parse2(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    };
    module2.exports = coerce;
  }
});

// node_modules/semver/functions/truncate.js
var require_truncate = __commonJS({
  "node_modules/semver/functions/truncate.js"(exports2, module2) {
    "use strict";
    var parse2 = require_parse();
    var constants2 = require_constants();
    var SemVer = require_semver();
    var truncate = (version, truncation, options) => {
      if (!constants2.RELEASE_TYPES.includes(truncation)) {
        return null;
      }
      const clonedVersion = cloneInputVersion(version, options);
      return clonedVersion && doTruncation(clonedVersion, truncation);
    };
    var cloneInputVersion = (version, options) => {
      const versionStringToParse = version instanceof SemVer ? version.version : version;
      return parse2(versionStringToParse, options);
    };
    var doTruncation = (version, truncation) => {
      if (isPrerelease(truncation)) {
        return version.version;
      }
      version.prerelease = [];
      switch (truncation) {
        case "major":
          version.minor = 0;
          version.patch = 0;
          break;
        case "minor":
          version.patch = 0;
          break;
      }
      return version.format();
    };
    var isPrerelease = (type) => {
      return type.startsWith("pre");
    };
    module2.exports = truncate;
  }
});

// node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS({
  "node_modules/semver/internal/lrucache.js"(exports2, module2) {
    "use strict";
    var LRUCache = class {
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.map.get(key);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key);
          this.map.set(key, value);
          return value;
        }
      }
      delete(key) {
        return this.map.delete(key);
      }
      set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key, value);
        }
        return this;
      }
    };
    module2.exports = LRUCache;
  }
});

// node_modules/semver/classes/range.js
var require_range = __commonJS({
  "node_modules/semver/classes/range.js"(exports2, module2) {
    "use strict";
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class _Range {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = "";
          for (let i = 0; i < this.set.length; i++) {
            if (i > 0) {
              this.formatted += "||";
            }
            const comps = this.set[i];
            for (let k2 = 0; k2 < comps.length; k2++) {
              if (k2 > 0) {
                this.formatted += " ";
              }
              this.formatted += comps[k2].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        range = range.replace(BUILDSTRIPRE, "");
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [...rangeMap.values()];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version) {
        if (!version) {
          return false;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module2.exports = Range;
    var LRU = require_lrucache();
    var cache = new LRU();
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var {
      safeRe: re,
      src,
      t,
      comparatorTrimReplace,
      tildeTrimReplace,
      caretTrimReplace
    } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var BUILDSTRIPRE = new RegExp(src[t.BUILD], "g");
    var isNullSet = (c) => c.value === "<0.0.0-0";
    var isAny = (c) => c.value === "";
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      comp = comp.replace(re[t.BUILD], "");
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    };
    var isX = (id2) => !id2 || id2.toLowerCase() === "x" || id2 === "*";
    var invalidXRangeOrder = (M, m2, p2) => isX(M) && !isX(m2) || isX(m2) && p2 && !isX(p2);
    var replaceTildes = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    };
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      const z78 = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_2, M, m2, p2, pr) => {
        debug("tilde", comp, _2, M, m2, p2, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m2)) {
          ret = `>=${M}.0.0${z78} <${+M + 1}.0.0-0`;
        } else if (isX(p2)) {
          ret = `>=${M}.${m2}.0${z78} <${M}.${+m2 + 1}.0-0`;
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = `>=${M}.${m2}.${p2}-${pr} <${M}.${+m2 + 1}.0-0`;
        } else {
          ret = `>=${M}.${m2}.${p2} <${M}.${+m2 + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    };
    var replaceCaret = (comp, options) => {
      debug("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z78 = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_2, M, m2, p2, pr) => {
        debug("caret", comp, _2, M, m2, p2, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m2)) {
          ret = `>=${M}.0.0${z78} <${+M + 1}.0.0-0`;
        } else if (isX(p2)) {
          if (M === "0") {
            ret = `>=${M}.${m2}.0${z78} <${M}.${+m2 + 1}.0-0`;
          } else {
            ret = `>=${M}.${m2}.0${z78} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m2 === "0") {
              ret = `>=${M}.${m2}.${p2}-${pr} <${M}.${m2}.${+p2 + 1}-0`;
            } else {
              ret = `>=${M}.${m2}.${p2}-${pr} <${M}.${+m2 + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m2}.${p2}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m2 === "0") {
              ret = `>=${M}.${m2}.${p2} <${M}.${m2}.${+p2 + 1}-0`;
            } else {
              ret = `>=${M}.${m2}.${p2} <${M}.${+m2 + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m2}.${p2} <${+M + 1}.0.0-0`;
          }
        }
        debug("caret return", ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m2, p2, pr) => {
        debug("xRange", comp, ret, gtlt, M, m2, p2, pr);
        if (invalidXRangeOrder(M, m2, p2)) {
          return comp;
        }
        const xM = isX(M);
        const xm = xM || isX(m2);
        const xp = xm || isX(p2);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m2 = 0;
          }
          p2 = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m2 = 0;
              p2 = 0;
            } else {
              m2 = +m2 + 1;
              p2 = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m2 = +m2 + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m2}.${p2}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m2}.0${pr} <${M}.${+m2 + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    };
    var replaceGTE0 = (comp, options) => {
      debug("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    };
    var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    };
    var testSet = (set, version, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  }
});

// node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  "node_modules/semver/classes/comparator.js"(exports2, module2) {
    "use strict";
    var ANY = /* @__PURE__ */ Symbol("SemVer ANY");
    var Comparator = class _Comparator {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m2 = comp.match(r);
        if (!m2) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m2[1] !== void 0 ? m2[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m2[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m2[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version) {
        debug("Comparator.test", version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
          return true;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    module2.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  "node_modules/semver/functions/satisfies.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var satisfies4 = (version, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    };
    module2.exports = satisfies4;
  }
});

// node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS({
  "node_modules/semver/ranges/to-comparators.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
    module2.exports = toComparators;
  }
});

// node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS({
  "node_modules/semver/ranges/max-satisfying.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var maxSatisfying = (versions, range, options) => {
      let max = null;
      let maxSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v2) => {
        if (rangeObj.test(v2)) {
          if (!max || maxSV.compare(v2) === -1) {
            max = v2;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    };
    module2.exports = maxSatisfying;
  }
});

// node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS({
  "node_modules/semver/ranges/min-satisfying.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var minSatisfying = (versions, range, options) => {
      let min = null;
      let minSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v2) => {
        if (rangeObj.test(v2)) {
          if (!min || minSV.compare(v2) === 1) {
            min = v2;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    };
    module2.exports = minSatisfying;
  }
});

// node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS({
  "node_modules/semver/ranges/min-version.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var gt = require_gt();
    var minVersion = (range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator) => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            /* fallthrough */
            case "":
            case ">=":
              if (!setMin || gt(compver, setMin)) {
                setMin = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            /* istanbul ignore next */
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
          minver = setMin;
        }
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    };
    module2.exports = minVersion;
  }
});

// node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS({
  "node_modules/semver/ranges/valid.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var validRange3 = (range, options) => {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    };
    module2.exports = validRange3;
  }
});

// node_modules/semver/ranges/outside.js
var require_outside = __commonJS({
  "node_modules/semver/ranges/outside.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var Range = require_range();
    var satisfies4 = require_satisfies();
    var gt = require_gt();
    var lt = require_lt();
    var lte = require_lte();
    var gte = require_gte();
    var outside = (version, range, hilo, options) => {
      version = new SemVer(version, options);
      range = new Range(range, options);
      let gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies4(version, range, options)) {
        return false;
      }
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator) => {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
          return false;
        }
      }
      return true;
    };
    module2.exports = outside;
  }
});

// node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS({
  "node_modules/semver/ranges/gtr.js"(exports2, module2) {
    "use strict";
    var outside = require_outside();
    var gtr = (version, range, options) => outside(version, range, ">", options);
    module2.exports = gtr;
  }
});

// node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS({
  "node_modules/semver/ranges/ltr.js"(exports2, module2) {
    "use strict";
    var outside = require_outside();
    var ltr = (version, range, options) => outside(version, range, "<", options);
    module2.exports = ltr;
  }
});

// node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS({
  "node_modules/semver/ranges/intersects.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var intersects2 = (r1, r2, options) => {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2, options);
    };
    module2.exports = intersects2;
  }
});

// node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS({
  "node_modules/semver/ranges/simplify.js"(exports2, module2) {
    "use strict";
    var satisfies4 = require_satisfies();
    var compare = require_compare();
    module2.exports = (versions, range, options) => {
      const set = [];
      let first = null;
      let prev = null;
      const v2 = versions.sort((a, b2) => compare(a, b2, options));
      for (const version of v2) {
        const included = satisfies4(version, range, options);
        if (included) {
          prev = version;
          if (!first) {
            first = version;
          }
        } else {
          if (prev) {
            set.push([first, prev]);
          }
          prev = null;
          first = null;
        }
      }
      if (first) {
        set.push([first, null]);
      }
      const ranges = [];
      for (const [min, max] of set) {
        if (min === max) {
          ranges.push(min);
        } else if (!max && min === v2[0]) {
          ranges.push("*");
        } else if (!max) {
          ranges.push(`>=${min}`);
        } else if (min === v2[0]) {
          ranges.push(`<=${max}`);
        } else {
          ranges.push(`${min} - ${max}`);
        }
      }
      const simplified = ranges.join(" || ");
      const original = typeof range.raw === "string" ? range.raw : String(range);
      return simplified.length < original.length ? simplified : range;
    };
  }
});

// node_modules/semver/ranges/subset.js
var require_subset = __commonJS({
  "node_modules/semver/ranges/subset.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var satisfies4 = require_satisfies();
    var compare = require_compare();
    var subset = (sub, dom, options = {}) => {
      if (sub === dom) {
        return true;
      }
      sub = new Range(sub, options);
      dom = new Range(dom, options);
      let sawNonNull = false;
      OUTER: for (const simpleSub of sub.set) {
        for (const simpleDom of dom.set) {
          const isSub = simpleSubset(simpleSub, simpleDom, options);
          sawNonNull = sawNonNull || isSub !== null;
          if (isSub) {
            continue OUTER;
          }
        }
        if (sawNonNull) {
          return false;
        }
      }
      return true;
    };
    var minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
    var minimumVersion = [new Comparator(">=0.0.0")];
    var simpleSubset = (sub, dom, options) => {
      if (sub === dom) {
        return true;
      }
      if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
          return true;
        } else if (options.includePrerelease) {
          sub = minimumVersionWithPreRelease;
        } else {
          sub = minimumVersion;
        }
      }
      if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
          return true;
        } else {
          dom = minimumVersion;
        }
      }
      const eqSet = /* @__PURE__ */ new Set();
      let gt, lt;
      for (const c of sub) {
        if (c.operator === ">" || c.operator === ">=") {
          gt = higherGT(gt, c, options);
        } else if (c.operator === "<" || c.operator === "<=") {
          lt = lowerLT(lt, c, options);
        } else {
          eqSet.add(c.semver);
        }
      }
      if (eqSet.size > 1) {
        return null;
      }
      let gtltComp;
      if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
          return null;
        } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
          return null;
        }
      }
      for (const eq of eqSet) {
        if (gt && !satisfies4(eq, String(gt), options)) {
          return null;
        }
        if (lt && !satisfies4(eq, String(lt), options)) {
          return null;
        }
        for (const c of dom) {
          if (!satisfies4(eq, String(c), options)) {
            return false;
          }
        }
        return true;
      }
      let higher, lower;
      let hasDomLT, hasDomGT;
      let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
      let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
      if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
      }
      for (const c of dom) {
        hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
        hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
        if (gt) {
          if (needDomGTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
              needDomGTPre = false;
            }
          }
          if (c.operator === ">" || c.operator === ">=") {
            higher = higherGT(gt, c, options);
            if (higher === c && higher !== gt) {
              return false;
            }
          } else if (gt.operator === ">=" && !c.test(gt.semver)) {
            return false;
          }
        }
        if (lt) {
          if (needDomLTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
              needDomLTPre = false;
            }
          }
          if (c.operator === "<" || c.operator === "<=") {
            lower = lowerLT(lt, c, options);
            if (lower === c && lower !== lt) {
              return false;
            }
          } else if (lt.operator === "<=" && !c.test(lt.semver)) {
            return false;
          }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
          return false;
        }
      }
      if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
      }
      if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
      }
      if (needDomGTPre || needDomLTPre) {
        return false;
      }
      return true;
    };
    var higherGT = (a, b2, options) => {
      if (!a) {
        return b2;
      }
      const comp = compare(a.semver, b2.semver, options);
      return comp > 0 ? a : comp < 0 ? b2 : b2.operator === ">" && a.operator === ">=" ? b2 : a;
    };
    var lowerLT = (a, b2, options) => {
      if (!a) {
        return b2;
      }
      const comp = compare(a.semver, b2.semver, options);
      return comp < 0 ? a : comp > 0 ? b2 : b2.operator === "<" && a.operator === "<=" ? b2 : a;
    };
    module2.exports = subset;
  }
});

// node_modules/semver/index.js
var require_semver2 = __commonJS({
  "node_modules/semver/index.js"(exports2, module2) {
    "use strict";
    var internalRe = require_re();
    var constants2 = require_constants();
    var SemVer = require_semver();
    var identifiers = require_identifiers();
    var parse2 = require_parse();
    var valid2 = require_valid();
    var clean = require_clean();
    var inc = require_inc();
    var diff = require_diff();
    var major = require_major();
    var minor = require_minor();
    var patch = require_patch();
    var prerelease = require_prerelease();
    var compare = require_compare();
    var rcompare = require_rcompare();
    var compareLoose = require_compare_loose();
    var compareBuild = require_compare_build();
    var sort = require_sort();
    var rsort = require_rsort();
    var gt = require_gt();
    var lt = require_lt();
    var eq = require_eq();
    var neq = require_neq();
    var gte = require_gte();
    var lte = require_lte();
    var cmp = require_cmp();
    var coerce = require_coerce();
    var truncate = require_truncate();
    var Comparator = require_comparator();
    var Range = require_range();
    var satisfies4 = require_satisfies();
    var toComparators = require_to_comparators();
    var maxSatisfying = require_max_satisfying();
    var minSatisfying = require_min_satisfying();
    var minVersion = require_min_version();
    var validRange3 = require_valid2();
    var outside = require_outside();
    var gtr = require_gtr();
    var ltr = require_ltr();
    var intersects2 = require_intersects();
    var simplifyRange = require_simplify();
    var subset = require_subset();
    module2.exports = {
      parse: parse2,
      valid: valid2,
      clean,
      inc,
      diff,
      major,
      minor,
      patch,
      prerelease,
      compare,
      rcompare,
      compareLoose,
      compareBuild,
      sort,
      rsort,
      gt,
      lt,
      eq,
      neq,
      gte,
      lte,
      cmp,
      coerce,
      truncate,
      Comparator,
      Range,
      satisfies: satisfies4,
      toComparators,
      maxSatisfying,
      minSatisfying,
      minVersion,
      validRange: validRange3,
      outside,
      gtr,
      ltr,
      intersects: intersects2,
      simplifyRange,
      subset,
      SemVer,
      re: internalRe.re,
      src: internalRe.src,
      tokens: internalRe.t,
      SEMVER_SPEC_VERSION: constants2.SEMVER_SPEC_VERSION,
      RELEASE_TYPES: constants2.RELEASE_TYPES,
      compareIdentifiers: identifiers.compareIdentifiers,
      rcompareIdentifiers: identifiers.rcompareIdentifiers
    };
  }
});

// packages/common/environment.cjs
var require_environment = __commonJS({
  "packages/common/environment.cjs"(exports2) {
    "use strict";
    exports2.PROCESS_ENV = process.env;
    exports2.NODE_ENV = process.env.NODE_ENV;
  }
});

// packages/plugin/src/consumer/index.ts
var index_exports = {};
__export(index_exports, {
  runPluginLifecycle: () => runPluginLifecycle
});
module.exports = __toCommonJS(index_exports);

// packages/plugin/src/consumer/lifecycle.ts
var import_node_fs17 = require("node:fs");
var import_node_path17 = require("node:path");

// packages/plugin/src/lifecycle.ts
var import_node_fs12 = require("node:fs");
var import_node_path12 = require("node:path");

// packages/plugin/src/store.ts
var import_node_fs3 = require("node:fs");
var import_node_os = require("node:os");
var import_node_path3 = require("node:path");

// packages/schema/src/ipc/envelope.ts
var import_zod2 = require("zod");

// packages/schema/src/icons.ts
var import_zod = require("zod");
var ICON_NAMES = [
  "arrow-up-down",
  "binary",
  "bomb",
  "boxes",
  "braces",
  "calculator",
  "calendar",
  "camera",
  "clock",
  "code",
  "copy-x",
  "database",
  "dices",
  "filter",
  "flag",
  "flask",
  "function",
  "git-branch",
  "git-merge",
  "group",
  "hook",
  "list-filter",
  "merge",
  "octagon-x",
  "package",
  "package-x",
  "pencil",
  "play",
  "regex",
  "repeat",
  "replace",
  "ruler",
  "scan-eye",
  "scissors",
  "search",
  "server-cog",
  "settings",
  "sigma",
  "split",
  "terminal",
  "test-tube",
  "text-cursor-input",
  "ticket",
  "truck",
  "type",
  "typescript",
  "ungroup",
  "variable",
  "wand",
  "wave",
  "webhook",
  "workflow",
  "x"
];
var IconName = import_zod.z.enum(ICON_NAMES);
var HostedIconUrl = import_zod.z.string().max(2048).url().refine((value) => {
  try {
    const url = new URL(value);
    return /^https:\/\//i.test(value) && !/[\p{Cc}\s\\]/u.test(value) && url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}, "Icon images must use an HTTPS URL without credentials");
var IconValue = import_zod.z.union([IconName, HostedIconUrl]);

// packages/schema/src/ipc/envelope.ts
var PROTOCOL_VERSION = "1";
var JsonSchema = import_zod2.z.record(import_zod2.z.unknown());
var ErrorCode = import_zod2.z.enum([
  "VALIDATION_ERROR",
  // inputs/outputs failed schema validation
  "RUNTIME_ERROR",
  // the node threw, crashed, or emitted garbage
  "TIMEOUT",
  // the node exceeded its deadline
  "NON_RETRYABLE"
  // a deliberate, terminal failure the node raised
]);
var InvocationContext = import_zod2.z.object({
  runId: import_zod2.z.string().optional(),
  env: import_zod2.z.string().optional(),
  config: import_zod2.z.record(import_zod2.z.unknown()).default({}),
  attempt: import_zod2.z.number().int().positive().default(1),
  deadlineMs: import_zod2.z.number().int().positive().optional()
});
var InvokeRequest = import_zod2.z.object({
  octonode: import_zod2.z.literal(PROTOCOL_VERSION),
  type: import_zod2.z.literal("invoke"),
  invocationId: import_zod2.z.string(),
  /** Optional node id — useful once one process can host multiple nodes. */
  node: import_zod2.z.string().optional(),
  inputs: import_zod2.z.unknown(),
  context: InvocationContext.default({})
});
var DescribeRequest = import_zod2.z.object({
  octonode: import_zod2.z.literal(PROTOCOL_VERSION),
  type: import_zod2.z.literal("describe"),
  invocationId: import_zod2.z.string(),
  node: import_zod2.z.string().optional()
});
var RequestEnvelope = import_zod2.z.discriminatedUnion("type", [InvokeRequest, DescribeRequest]);
var NodeError = import_zod2.z.object({
  code: ErrorCode,
  message: import_zod2.z.string(),
  retryable: import_zod2.z.boolean().default(false),
  details: import_zod2.z.unknown().optional(),
  stack: import_zod2.z.string().optional()
});
var ResultOk = import_zod2.z.object({
  octonode: import_zod2.z.literal(PROTOCOL_VERSION),
  type: import_zod2.z.literal("result"),
  invocationId: import_zod2.z.string(),
  status: import_zod2.z.literal("ok"),
  outputs: import_zod2.z.unknown()
});
var ResultErr = import_zod2.z.object({
  octonode: import_zod2.z.literal(PROTOCOL_VERSION),
  type: import_zod2.z.literal("result"),
  invocationId: import_zod2.z.string(),
  status: import_zod2.z.literal("error"),
  error: NodeError
});
var ResultEnvelope = import_zod2.z.discriminatedUnion("status", [ResultOk, ResultErr]);
var NodeManifest = import_zod2.z.object({
  id: import_zod2.z.string(),
  label: import_zod2.z.string().optional(),
  description: import_zod2.z.string().optional(),
  symbol: import_zod2.z.string().max(16).optional(),
  defaults: import_zod2.z.record(import_zod2.z.unknown()).optional(),
  /** A workflow wrapper receives the current execution config through its invocation context. */
  workflowId: import_zod2.z.string().min(1).optional(),
  language: import_zod2.z.string(),
  inputs: JsonSchema.optional(),
  outputs: JsonSchema.optional(),
  /**
   * What this node is: `function` (default), `class`, `service`, or `const`.
   * Set by the setup-time SDK helpers (defineService/defineClass/defineConst)
   * so `scan` writes it to `.octonode`.
   */
  kind: import_zod2.z.enum(["function", "class", "service", "const"]).optional(),
  /** Setup params for non-function kinds (constructor/config shape). */
  setup: JsonSchema.optional(),
  /** Advisory default icon — a one-time seed; config owns it thereafter. */
  icon: IconValue.optional(),
  /** Advisory default config — a one-time seed; config owns it thereafter. */
  config: import_zod2.z.record(import_zod2.z.unknown()).optional(),
  /** Explicit service exposure. Plain classes never populate this field. */
  service: import_zod2.z.object({
    lifecycle: import_zod2.z.enum(["invocation", "workflow-run", "worker"]),
    methods: import_zod2.z.array(
      import_zod2.z.object({
        name: import_zod2.z.string(),
        params: import_zod2.z.array(import_zod2.z.string()).default([]),
        inputs: JsonSchema.optional(),
        outputs: JsonSchema.optional()
      })
    )
  }).optional()
});
var ManifestOk = import_zod2.z.object({
  octonode: import_zod2.z.literal(PROTOCOL_VERSION),
  type: import_zod2.z.literal("manifest"),
  invocationId: import_zod2.z.string(),
  status: import_zod2.z.literal("ok"),
  manifest: NodeManifest
});
var ManifestErr = import_zod2.z.object({
  octonode: import_zod2.z.literal(PROTOCOL_VERSION),
  type: import_zod2.z.literal("manifest"),
  invocationId: import_zod2.z.string(),
  status: import_zod2.z.literal("error"),
  error: NodeError
});
var ManifestEnvelope = import_zod2.z.discriminatedUnion("status", [ManifestOk, ManifestErr]);

// node_modules/croner/dist/croner.js
function h(n2, t, e, r, s, i, a, l) {
  return h.fromTZ(h.tp(n2, t, e, r, s, i, a), l);
}
h.fromTZISO = (n2, t, e) => h.fromTZ(k(n2, t), e);
h.fromTZ = function(n2, t) {
  let e = new Date(Date.UTC(n2.y, n2.m - 1, n2.d, n2.h, n2.i, n2.s)), r = D(n2.tz, e), s = new Date(e.getTime() - r), i = D(n2.tz, s);
  if (i - r === 0) return s;
  {
    let a = new Date(e.getTime() - i), l = D(n2.tz, a);
    if (l - i === 0) return a;
    if (!t && l - i > 0) return a;
    if (t) throw new Error("Invalid date passed to fromTZ()");
    return s;
  }
};
h.toTZ = function(n2, t) {
  let e = n2.toLocaleString("en-US", { timeZone: t }).replace(/[\u202f]/, " "), r = new Date(e);
  return { y: r.getFullYear(), m: r.getMonth() + 1, d: r.getDate(), h: r.getHours(), i: r.getMinutes(), s: r.getSeconds(), tz: t };
};
h.tp = (n2, t, e, r, s, i, a) => ({ y: n2, m: t, d: e, h: r, i: s, s: i, tz: a });
function D(n2, t = /* @__PURE__ */ new Date()) {
  let e = t.toLocaleString("en-US", { timeZone: n2, timeZoneName: "shortOffset" }).split(" ").slice(-1)[0], r = t.toLocaleString("en-US").replace(/[\u202f]/, " ");
  return Date.parse(`${r} GMT`) - Date.parse(`${r} ${e}`);
}
function k(n2, t) {
  let e = new Date(Date.parse(n2));
  if (isNaN(e)) throw new Error("minitz: Invalid ISO8601 passed to parser.");
  let r = n2.substring(9);
  return n2.includes("Z") || r.includes("-") || r.includes("+") ? h.tp(e.getUTCFullYear(), e.getUTCMonth() + 1, e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), "Etc/UTC") : h.tp(e.getFullYear(), e.getMonth() + 1, e.getDate(), e.getHours(), e.getMinutes(), e.getSeconds(), t);
}
h.minitz = h;
var b = 32;
var p = 31 | b;
var v = [1, 2, 4, 8, 16];
var d = class {
  pattern;
  timezone;
  second;
  minute;
  hour;
  day;
  month;
  dayOfWeek;
  lastDayOfMonth;
  starDOM;
  starDOW;
  constructor(t, e) {
    this.pattern = t, this.timezone = e, this.second = Array(60).fill(0), this.minute = Array(60).fill(0), this.hour = Array(24).fill(0), this.day = Array(31).fill(0), this.month = Array(12).fill(0), this.dayOfWeek = Array(7).fill(0), this.lastDayOfMonth = false, this.starDOM = false, this.starDOW = false, this.parse();
  }
  parse() {
    if (!(typeof this.pattern == "string" || this.pattern instanceof String)) throw new TypeError("CronPattern: Pattern has to be of type string.");
    this.pattern.indexOf("@") >= 0 && (this.pattern = this.handleNicknames(this.pattern).trim());
    let t = this.pattern.replace(/\s+/g, " ").split(" ");
    if (t.length < 5 || t.length > 6) throw new TypeError("CronPattern: invalid configuration format ('" + this.pattern + "'), exactly five or six space separated parts are required.");
    if (t.length === 5 && t.unshift("0"), t[3].indexOf("L") >= 0 && (t[3] = t[3].replace("L", ""), this.lastDayOfMonth = true), t[3] == "*" && (this.starDOM = true), t[4].length >= 3 && (t[4] = this.replaceAlphaMonths(t[4])), t[5].length >= 3 && (t[5] = this.replaceAlphaDays(t[5])), t[5] == "*" && (this.starDOW = true), this.pattern.indexOf("?") >= 0) {
      let e = new f(/* @__PURE__ */ new Date(), this.timezone).getDate(true);
      t[0] = t[0].replace("?", e.getSeconds().toString()), t[1] = t[1].replace("?", e.getMinutes().toString()), t[2] = t[2].replace("?", e.getHours().toString()), this.starDOM || (t[3] = t[3].replace("?", e.getDate().toString())), t[4] = t[4].replace("?", (e.getMonth() + 1).toString()), this.starDOW || (t[5] = t[5].replace("?", e.getDay().toString()));
    }
    this.throwAtIllegalCharacters(t), this.partToArray("second", t[0], 0, 1), this.partToArray("minute", t[1], 0, 1), this.partToArray("hour", t[2], 0, 1), this.partToArray("day", t[3], -1, 1), this.partToArray("month", t[4], -1, 1), this.partToArray("dayOfWeek", t[5], 0, p), this.dayOfWeek[7] && (this.dayOfWeek[0] = this.dayOfWeek[7]);
  }
  partToArray(t, e, r, s) {
    let i = this[t], a = t === "day" && this.lastDayOfMonth;
    if (e === "" && !a) throw new TypeError("CronPattern: configuration entry " + t + " (" + e + ") is empty, check for trailing spaces.");
    if (e === "*") return i.fill(s);
    let l = e.split(",");
    if (l.length > 1) for (let o = 0; o < l.length; o++) this.partToArray(t, l[o], r, s);
    else e.indexOf("-") !== -1 && e.indexOf("/") !== -1 ? this.handleRangeWithStepping(e, t, r, s) : e.indexOf("-") !== -1 ? this.handleRange(e, t, r, s) : e.indexOf("/") !== -1 ? this.handleStepping(e, t, r, s) : e !== "" && this.handleNumber(e, t, r, s);
  }
  throwAtIllegalCharacters(t) {
    for (let e = 0; e < t.length; e++) if ((e === 5 ? /[^/*0-9,\-#L]+/ : /[^/*0-9,-]+/).test(t[e])) throw new TypeError("CronPattern: configuration entry " + e + " (" + t[e] + ") contains illegal characters.");
  }
  handleNumber(t, e, r, s) {
    let i = this.extractNth(t, e), a = parseInt(i[0], 10) + r;
    if (isNaN(a)) throw new TypeError("CronPattern: " + e + " is not a number: '" + t + "'");
    this.setPart(e, a, i[1] || s);
  }
  setPart(t, e, r) {
    if (!Object.prototype.hasOwnProperty.call(this, t)) throw new TypeError("CronPattern: Invalid part specified: " + t);
    if (t === "dayOfWeek") {
      if (e === 7 && (e = 0), e < 0 || e > 6) throw new RangeError("CronPattern: Invalid value for dayOfWeek: " + e);
      this.setNthWeekdayOfMonth(e, r);
      return;
    }
    if (t === "second" || t === "minute") {
      if (e < 0 || e >= 60) throw new RangeError("CronPattern: Invalid value for " + t + ": " + e);
    } else if (t === "hour") {
      if (e < 0 || e >= 24) throw new RangeError("CronPattern: Invalid value for " + t + ": " + e);
    } else if (t === "day") {
      if (e < 0 || e >= 31) throw new RangeError("CronPattern: Invalid value for " + t + ": " + e);
    } else if (t === "month" && (e < 0 || e >= 12)) throw new RangeError("CronPattern: Invalid value for " + t + ": " + e);
    this[t][e] = r;
  }
  handleRangeWithStepping(t, e, r, s) {
    let i = this.extractNth(t, e), a = i[0].match(/^(\d+)-(\d+)\/(\d+)$/);
    if (a === null) throw new TypeError("CronPattern: Syntax error, illegal range with stepping: '" + t + "'");
    let [, l, o, u] = a, c = parseInt(l, 10) + r, w = parseInt(o, 10) + r, C = parseInt(u, 10);
    if (isNaN(c)) throw new TypeError("CronPattern: Syntax error, illegal lower range (NaN)");
    if (isNaN(w)) throw new TypeError("CronPattern: Syntax error, illegal upper range (NaN)");
    if (isNaN(C)) throw new TypeError("CronPattern: Syntax error, illegal stepping: (NaN)");
    if (C === 0) throw new TypeError("CronPattern: Syntax error, illegal stepping: 0");
    if (C > this[e].length) throw new TypeError("CronPattern: Syntax error, steps cannot be greater than maximum value of part (" + this[e].length + ")");
    if (c > w) throw new TypeError("CronPattern: From value is larger than to value: '" + t + "'");
    for (let T = c; T <= w; T += C) this.setPart(e, T, i[1] || s);
  }
  extractNth(t, e) {
    let r = t, s;
    if (r.includes("#")) {
      if (e !== "dayOfWeek") throw new Error("CronPattern: nth (#) only allowed in day-of-week field");
      s = r.split("#")[1], r = r.split("#")[0];
    }
    return [r, s];
  }
  handleRange(t, e, r, s) {
    let i = this.extractNth(t, e), a = i[0].split("-");
    if (a.length !== 2) throw new TypeError("CronPattern: Syntax error, illegal range: '" + t + "'");
    let l = parseInt(a[0], 10) + r, o = parseInt(a[1], 10) + r;
    if (isNaN(l)) throw new TypeError("CronPattern: Syntax error, illegal lower range (NaN)");
    if (isNaN(o)) throw new TypeError("CronPattern: Syntax error, illegal upper range (NaN)");
    if (l > o) throw new TypeError("CronPattern: From value is larger than to value: '" + t + "'");
    for (let u = l; u <= o; u++) this.setPart(e, u, i[1] || s);
  }
  handleStepping(t, e, r, s) {
    let i = this.extractNth(t, e), a = i[0].split("/");
    if (a.length !== 2) throw new TypeError("CronPattern: Syntax error, illegal stepping: '" + t + "'");
    a[0] === "" && (a[0] = "*");
    let l = 0;
    a[0] !== "*" && (l = parseInt(a[0], 10) + r);
    let o = parseInt(a[1], 10);
    if (isNaN(o)) throw new TypeError("CronPattern: Syntax error, illegal stepping: (NaN)");
    if (o === 0) throw new TypeError("CronPattern: Syntax error, illegal stepping: 0");
    if (o > this[e].length) throw new TypeError("CronPattern: Syntax error, max steps for part is (" + this[e].length + ")");
    for (let u = l; u < this[e].length; u += o) this.setPart(e, u, i[1] || s);
  }
  replaceAlphaDays(t) {
    return t.replace(/-sun/gi, "-7").replace(/sun/gi, "0").replace(/mon/gi, "1").replace(/tue/gi, "2").replace(/wed/gi, "3").replace(/thu/gi, "4").replace(/fri/gi, "5").replace(/sat/gi, "6");
  }
  replaceAlphaMonths(t) {
    return t.replace(/jan/gi, "1").replace(/feb/gi, "2").replace(/mar/gi, "3").replace(/apr/gi, "4").replace(/may/gi, "5").replace(/jun/gi, "6").replace(/jul/gi, "7").replace(/aug/gi, "8").replace(/sep/gi, "9").replace(/oct/gi, "10").replace(/nov/gi, "11").replace(/dec/gi, "12");
  }
  handleNicknames(t) {
    let e = t.trim().toLowerCase();
    return e === "@yearly" || e === "@annually" ? "0 0 1 1 *" : e === "@monthly" ? "0 0 1 * *" : e === "@weekly" ? "0 0 * * 0" : e === "@daily" ? "0 0 * * *" : e === "@hourly" ? "0 * * * *" : t;
  }
  setNthWeekdayOfMonth(t, e) {
    if (typeof e != "number" && e === "L") this.dayOfWeek[t] = this.dayOfWeek[t] | b;
    else if (e === p) this.dayOfWeek[t] = p;
    else if (e < 6 && e > 0) this.dayOfWeek[t] = this.dayOfWeek[t] | v[e - 1];
    else throw new TypeError(`CronPattern: nth weekday out of range, should be 1-5 or L. Value: ${e}, Type: ${typeof e}`);
  }
};
var O = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var m = [["month", "year", 0], ["day", "month", -1], ["hour", "day", 0], ["minute", "hour", 0], ["second", "minute", 0]];
var f = class n {
  tz;
  ms;
  second;
  minute;
  hour;
  day;
  month;
  year;
  constructor(t, e) {
    if (this.tz = e, t && t instanceof Date) if (!isNaN(t)) this.fromDate(t);
    else throw new TypeError("CronDate: Invalid date passed to CronDate constructor");
    else if (t === void 0) this.fromDate(/* @__PURE__ */ new Date());
    else if (t && typeof t == "string") this.fromString(t);
    else if (t instanceof n) this.fromCronDate(t);
    else throw new TypeError("CronDate: Invalid type (" + typeof t + ") passed to CronDate constructor");
  }
  isNthWeekdayOfMonth(t, e, r, s) {
    let a = new Date(Date.UTC(t, e, r)).getUTCDay(), l = 0;
    for (let o = 1; o <= r; o++) new Date(Date.UTC(t, e, o)).getUTCDay() === a && l++;
    if (s & p && v[l - 1] & s) return true;
    if (s & b) {
      let o = new Date(Date.UTC(t, e + 1, 0)).getUTCDate();
      for (let u = r + 1; u <= o; u++) if (new Date(Date.UTC(t, e, u)).getUTCDay() === a) return false;
      return true;
    }
    return false;
  }
  fromDate(t) {
    if (this.tz !== void 0) if (typeof this.tz == "number") this.ms = t.getUTCMilliseconds(), this.second = t.getUTCSeconds(), this.minute = t.getUTCMinutes() + this.tz, this.hour = t.getUTCHours(), this.day = t.getUTCDate(), this.month = t.getUTCMonth(), this.year = t.getUTCFullYear(), this.apply();
    else {
      let e = h.toTZ(t, this.tz);
      this.ms = t.getMilliseconds(), this.second = e.s, this.minute = e.i, this.hour = e.h, this.day = e.d, this.month = e.m - 1, this.year = e.y;
    }
    else this.ms = t.getMilliseconds(), this.second = t.getSeconds(), this.minute = t.getMinutes(), this.hour = t.getHours(), this.day = t.getDate(), this.month = t.getMonth(), this.year = t.getFullYear();
  }
  fromCronDate(t) {
    this.tz = t.tz, this.year = t.year, this.month = t.month, this.day = t.day, this.hour = t.hour, this.minute = t.minute, this.second = t.second, this.ms = t.ms;
  }
  apply() {
    if (this.month > 11 || this.day > O[this.month] || this.hour > 59 || this.minute > 59 || this.second > 59 || this.hour < 0 || this.minute < 0 || this.second < 0) {
      let t = new Date(Date.UTC(this.year, this.month, this.day, this.hour, this.minute, this.second, this.ms));
      return this.ms = t.getUTCMilliseconds(), this.second = t.getUTCSeconds(), this.minute = t.getUTCMinutes(), this.hour = t.getUTCHours(), this.day = t.getUTCDate(), this.month = t.getUTCMonth(), this.year = t.getUTCFullYear(), true;
    } else return false;
  }
  fromString(t) {
    if (typeof this.tz == "number") {
      let e = h.fromTZISO(t);
      this.ms = e.getUTCMilliseconds(), this.second = e.getUTCSeconds(), this.minute = e.getUTCMinutes(), this.hour = e.getUTCHours(), this.day = e.getUTCDate(), this.month = e.getUTCMonth(), this.year = e.getUTCFullYear(), this.apply();
    } else return this.fromDate(h.fromTZISO(t, this.tz));
  }
  findNext(t, e, r, s) {
    let i = this[e], a;
    r.lastDayOfMonth && (this.month !== 1 ? a = O[this.month] : a = new Date(Date.UTC(this.year, this.month + 1, 0, 0, 0, 0, 0)).getUTCDate());
    let l = !r.starDOW && e == "day" ? new Date(Date.UTC(this.year, this.month, 1, 0, 0, 0, 0)).getUTCDay() : void 0;
    for (let o = this[e] + s; o < r[e].length; o++) {
      let u = r[e][o];
      if (e === "day" && r.lastDayOfMonth && o - s == a && (u = 1), e === "day" && !r.starDOW) {
        let c = r.dayOfWeek[(l + (o - s - 1)) % 7];
        if (c && c & p) c = this.isNthWeekdayOfMonth(this.year, this.month, o - s, c) ? 1 : 0;
        else if (c) throw new Error(`CronDate: Invalid value for dayOfWeek encountered. ${c}`);
        t.legacyMode && !r.starDOM ? u = u || c : u = u && c;
      }
      if (u) return this[e] = o - s, i !== this[e] ? 2 : 1;
    }
    return 3;
  }
  recurse(t, e, r) {
    let s = this.findNext(e, m[r][0], t, m[r][2]);
    if (s > 1) {
      let i = r + 1;
      for (; i < m.length; ) this[m[i][0]] = -m[i][2], i++;
      if (s === 3) return this[m[r][1]]++, this[m[r][0]] = -m[r][2], this.apply(), this.recurse(t, e, 0);
      if (this.apply()) return this.recurse(t, e, r - 1);
    }
    return r += 1, r >= m.length ? this : this.year >= 3e3 ? null : this.recurse(t, e, r);
  }
  increment(t, e, r) {
    return this.second += e.interval !== void 0 && e.interval > 1 && r ? e.interval : 1, this.ms = 0, this.apply(), this.recurse(t, e, 0);
  }
  getDate(t) {
    return t || this.tz === void 0 ? new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.ms) : typeof this.tz == "number" ? new Date(Date.UTC(this.year, this.month, this.day, this.hour, this.minute - this.tz, this.second, this.ms)) : h.fromTZ(h.tp(this.year, this.month + 1, this.day, this.hour, this.minute, this.second, this.tz), false);
  }
  getTime() {
    return this.getDate(false).getTime();
  }
};
function N(n2) {
  if (n2 === void 0 && (n2 = {}), delete n2.name, n2.legacyMode = n2.legacyMode === void 0 ? true : n2.legacyMode, n2.paused = n2.paused === void 0 ? false : n2.paused, n2.maxRuns = n2.maxRuns === void 0 ? 1 / 0 : n2.maxRuns, n2.catch = n2.catch === void 0 ? false : n2.catch, n2.interval = n2.interval === void 0 ? 0 : parseInt(n2.interval.toString(), 10), n2.utcOffset = n2.utcOffset === void 0 ? void 0 : parseInt(n2.utcOffset.toString(), 10), n2.unref = n2.unref === void 0 ? false : n2.unref, n2.startAt && (n2.startAt = new f(n2.startAt, n2.timezone)), n2.stopAt && (n2.stopAt = new f(n2.stopAt, n2.timezone)), n2.interval !== null) {
    if (isNaN(n2.interval)) throw new Error("CronOptions: Supplied value for interval is not a number");
    if (n2.interval < 0) throw new Error("CronOptions: Supplied value for interval can not be negative");
  }
  if (n2.utcOffset !== void 0) {
    if (isNaN(n2.utcOffset)) throw new Error("CronOptions: Invalid value passed for utcOffset, should be number representing minutes offset from UTC.");
    if (n2.utcOffset < -870 || n2.utcOffset > 870) throw new Error("CronOptions: utcOffset out of bounds.");
    if (n2.utcOffset !== void 0 && n2.timezone) throw new Error("CronOptions: Combining 'utcOffset' with 'timezone' is not allowed.");
  }
  if (n2.unref !== true && n2.unref !== false) throw new Error("CronOptions: Unref should be either true, false or undefined(false).");
  return n2;
}
function g(n2) {
  return Object.prototype.toString.call(n2) === "[object Function]" || typeof n2 == "function" || n2 instanceof Function;
}
function S(n2) {
  return g(n2);
}
function P(n2) {
  typeof Deno < "u" && typeof Deno.unrefTimer < "u" ? Deno.unrefTimer(n2) : n2 && typeof n2.unref < "u" && n2.unref();
}
var _ = 30 * 1e3;
var y = [];
var R = class {
  name;
  options;
  _states;
  fn;
  constructor(t, e, r) {
    let s, i;
    if (g(e)) i = e;
    else if (typeof e == "object") s = e;
    else if (e !== void 0) throw new Error("Cron: Invalid argument passed for optionsIn. Should be one of function, or object (options).");
    if (g(r)) i = r;
    else if (typeof r == "object") s = r;
    else if (r !== void 0) throw new Error("Cron: Invalid argument passed for funcIn. Should be one of function, or object (options).");
    if (this.name = s?.name, this.options = N(s), this._states = { kill: false, blocking: false, previousRun: void 0, currentRun: void 0, once: void 0, currentTimeout: void 0, maxRuns: s ? s.maxRuns : void 0, paused: s ? s.paused : false, pattern: new d("* * * * *") }, t && (t instanceof Date || typeof t == "string" && t.indexOf(":") > 0) ? this._states.once = new f(t, this.options.timezone || this.options.utcOffset) : this._states.pattern = new d(t, this.options.timezone), this.name) {
      if (y.find((l) => l.name === this.name)) throw new Error("Cron: Tried to initialize new named job '" + this.name + "', but name already taken.");
      y.push(this);
    }
    return i !== void 0 && S(i) && (this.fn = i, this.schedule()), this;
  }
  nextRun(t) {
    let e = this._next(t);
    return e ? e.getDate(false) : null;
  }
  nextRuns(t, e) {
    this._states.maxRuns !== void 0 && t > this._states.maxRuns && (t = this._states.maxRuns);
    let r = [], s = e || this._states.currentRun || void 0;
    for (; t-- && (s = this.nextRun(s)); ) r.push(s);
    return r;
  }
  getPattern() {
    return this._states.pattern ? this._states.pattern.pattern : void 0;
  }
  isRunning() {
    let t = this.nextRun(this._states.currentRun), e = !this._states.paused, r = this.fn !== void 0, s = !this._states.kill;
    return e && r && s && t !== null;
  }
  isStopped() {
    return this._states.kill;
  }
  isBusy() {
    return this._states.blocking;
  }
  currentRun() {
    return this._states.currentRun ? this._states.currentRun.getDate() : null;
  }
  previousRun() {
    return this._states.previousRun ? this._states.previousRun.getDate() : null;
  }
  msToNext(t) {
    let e = this._next(t);
    return e ? t instanceof f || t instanceof Date ? e.getTime() - t.getTime() : e.getTime() - new f(t).getTime() : null;
  }
  stop() {
    this._states.kill = true, this._states.currentTimeout && clearTimeout(this._states.currentTimeout);
    let t = y.indexOf(this);
    t >= 0 && y.splice(t, 1);
  }
  pause() {
    return this._states.paused = true, !this._states.kill;
  }
  resume() {
    return this._states.paused = false, !this._states.kill;
  }
  schedule(t) {
    if (t && this.fn) throw new Error("Cron: It is not allowed to schedule two functions using the same Croner instance.");
    t && (this.fn = t);
    let e = this.msToNext(), r = this.nextRun(this._states.currentRun);
    return e == null || isNaN(e) || r === null ? this : (e > _ && (e = _), this._states.currentTimeout = setTimeout(() => this._checkTrigger(r), e), this._states.currentTimeout && this.options.unref && P(this._states.currentTimeout), this);
  }
  async _trigger(t) {
    if (this._states.blocking = true, this._states.currentRun = new f(void 0, this.options.timezone || this.options.utcOffset), this.options.catch) try {
      this.fn !== void 0 && await this.fn(this, this.options.context);
    } catch (e) {
      g(this.options.catch) && this.options.catch(e, this);
    }
    else this.fn !== void 0 && await this.fn(this, this.options.context);
    this._states.previousRun = new f(t, this.options.timezone || this.options.utcOffset), this._states.blocking = false;
  }
  async trigger() {
    await this._trigger();
  }
  runsLeft() {
    return this._states.maxRuns;
  }
  _checkTrigger(t) {
    let e = /* @__PURE__ */ new Date(), r = !this._states.paused && e.getTime() >= t.getTime(), s = this._states.blocking && this.options.protect;
    r && !s ? (this._states.maxRuns !== void 0 && this._states.maxRuns--, this._trigger()) : r && s && g(this.options.protect) && setTimeout(() => this.options.protect(this), 0), this.schedule();
  }
  _next(t) {
    let e = !!(t || this._states.currentRun), r = false;
    !t && this.options.startAt && this.options.interval && ([t, e] = this._calculatePreviousRun(t, e), r = !t), t = new f(t, this.options.timezone || this.options.utcOffset), this.options.startAt && t && t.getTime() < this.options.startAt.getTime() && (t = this.options.startAt);
    let s = this._states.once || new f(t, this.options.timezone || this.options.utcOffset);
    return !r && s !== this._states.once && (s = s.increment(this._states.pattern, this.options, e)), this._states.once && this._states.once.getTime() <= t.getTime() || s === null || this._states.maxRuns !== void 0 && this._states.maxRuns <= 0 || this._states.kill || this.options.stopAt && s.getTime() >= this.options.stopAt.getTime() ? null : s;
  }
  _calculatePreviousRun(t, e) {
    let r = new f(void 0, this.options.timezone || this.options.utcOffset), s = t;
    if (this.options.startAt.getTime() <= r.getTime()) {
      s = this.options.startAt;
      let i = s.getTime() + this.options.interval * 1e3;
      for (; i <= r.getTime(); ) s = new f(s, this.options.timezone || this.options.utcOffset).increment(this._states.pattern, this.options, true), i = s.getTime() + this.options.interval * 1e3;
      e = true;
    }
    return s === null && (s = void 0), [s, e];
  }
};

// packages/schema/src/workflow/triggers.ts
var import_zod3 = require("zod");
function nextCronRun(expression, timezone, after = /* @__PURE__ */ new Date()) {
  return new R(expression, { timezone }).nextRun(after);
}
var triggerBase = import_zod3.z.object({
  id: import_zod3.z.string().uuid(),
  name: import_zod3.z.string().trim().min(1).max(100),
  enabled: import_zod3.z.boolean().default(false)
});
var WorkflowTrigger = import_zod3.z.discriminatedUnion("kind", [
  triggerBase.extend({
    kind: import_zod3.z.literal("cron"),
    provider: import_zod3.z.enum(["native", "external"]),
    expression: import_zod3.z.string().trim().max(100),
    timezone: import_zod3.z.string().max(100),
    input: import_zod3.z.record(import_zod3.z.unknown()).default({})
  }),
  triggerBase.extend({
    kind: import_zod3.z.literal("webhook"),
    /** Empty uses the whole JSON body; otherwise selects an object at a JSON Pointer. */
    payloadPath: import_zod3.z.string().max(500).regex(/^(?:|\/(?:[^~]|~[01])*)$/).default("")
  })
]);
var WorkflowTriggers = import_zod3.z.array(WorkflowTrigger).max(20).superRefine((triggers, ctx) => {
  const ids = /* @__PURE__ */ new Set();
  triggers.forEach((trigger, index) => {
    if (ids.has(trigger.id))
      ctx.addIssue({ code: "custom", path: [index, "id"], message: "Trigger IDs must be unique" });
    ids.add(trigger.id);
    if (trigger.kind !== "cron") return;
    try {
      if (trigger.expression.split(/\s+/).length !== 5) throw new Error("Use a five-field cron expression");
      new Intl.DateTimeFormat("en", { timeZone: trigger.timezone });
      if (!nextCronRun(trigger.expression, trigger.timezone)) throw new Error("Schedule has no future occurrence");
    } catch (error) {
      ctx.addIssue({
        code: "custom",
        path: [index, "expression"],
        message: error instanceof Error ? error.message : "Invalid schedule"
      });
    }
  });
});
var WorkflowTriggerState = import_zod3.z.object({
  revision: import_zod3.z.string(),
  active: import_zod3.z.boolean(),
  triggers: WorkflowTriggers,
  nativeCron: import_zod3.z.boolean(),
  synchronized: import_zod3.z.boolean(),
  nextRuns: import_zod3.z.record(import_zod3.z.string().datetime()),
  lastError: import_zod3.z.string().optional()
});
var WorkflowTriggerUpdate = import_zod3.z.object({
  baseRevision: import_zod3.z.string().regex(/^[a-f0-9]{64}$/),
  active: import_zod3.z.boolean(),
  triggers: WorkflowTriggers
});

// packages/schema/src/octonode/config.ts
var import_zod13 = require("zod");

// packages/schema/src/workflow/entry.ts
var import_zod4 = require("zod");
var WorkflowNodeRole = import_zod4.z.enum(["entry", "step"]);
function isWorkflowEntryIcon(icon, role) {
  return role ? role === "entry" : icon === "play" || icon === "webhook";
}
var WorkflowEntryNodes = import_zod4.z.array(import_zod4.z.object({ id: import_zod4.z.string(), icon: import_zod4.z.string().optional(), role: WorkflowNodeRole.optional() })).superRefine((nodes, ctx) => {
  const entries = nodes.filter((node) => isWorkflowEntryIcon(node.icon, node.role));
  if (new Set(entries.map((node) => node.id)).size > 1)
    ctx.addIssue({ code: "custom", message: "A workflow can contain only one Start or Webhook entry node." });
});

// packages/schema/src/source/index.ts
var import_zod5 = require("zod");

// packages/schema/src/constants.ts
var PLUGIN_SCHEMA_VERSION = "1";
var COMMUNITY_MEDIA_IMAGE_BYTES = 8 * 1024 * 1024;
var COMMUNITY_MEDIA_VIDEO_BYTES = 20 * 1024 * 1024;
var COMMUNITY_MEDIA_BODY_BYTES = Math.ceil(COMMUNITY_MEDIA_VIDEO_BYTES / 3) * 4 + 4096;
var COMMUNITY_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm"
];
var PLUGIN_MANIFEST_FILENAME = "octonode.plugin.json";
var PLUGIN_DEFINITION_FILENAMES = [
  "octonode.yml",
  "octonode.yaml",
  "octonode.json",
  PLUGIN_MANIFEST_FILENAME
];
var MARKETPLACE_SCOPES = ["user", "group", "org", "public"];
var SETTINGS_API_VERSION = "octonode.dev/settings/v1";
var WORKSPACE_ACTIONS = [
  "projects:read",
  "projects:write",
  "workflows:run",
  "data:read",
  "data:write",
  "tables:manage",
  "members:invite",
  "members:manage",
  "teams:manage",
  "plugins:publish",
  "plugins:install",
  "org:settings",
  "social:read",
  "social:write",
  "social:moderate",
  "tasks:read",
  "tasks:write",
  "tasks:manage",
  "reviews:write",
  "github:connect",
  "github:publish",
  "agents:manage",
  "billing:read",
  "billing:manage",
  "integrations:read",
  "integrations:manage",
  "design:read",
  "design:review",
  "previews:read",
  "previews:manage",
  "terminal:use",
  "workflow-agents:run",
  "workflow-agents:manage",
  "agent-operations:read",
  "agent-operations:manage",
  "data:export",
  "data:restore",
  "workspace:delete",
  "knowledge:read",
  "content:read",
  "content:write",
  "content:publish",
  "content:moderate",
  "apps:read",
  "apps:use",
  "apps:manage",
  "tokens:create",
  "tokens:use",
  "tokens:delegate",
  "tokens:manage",
  "policy:read",
  "policy:manage",
  "usage:read",
  "usage:manage",
  "remote:enroll",
  "remote:connect",
  "remote:execute",
  "remote:manage"
];
var AGENT_RUN_STATUSES = [
  "queued",
  "running",
  "approval_required",
  "completed",
  "cancelled",
  "failed"
];
var AGENT_ERROR_CODES = [
  "engine_incompatible",
  "provider_not_configured",
  "service_unavailable",
  "provider_rate_limited",
  "provider_unavailable",
  "timeout",
  "cancelled",
  "invalid_model_response",
  "invalid_tool_call",
  "tool_failed",
  "step_limit",
  "token_limit",
  "usage_limit",
  "permission_denied",
  "approval_denied",
  "conflict",
  "internal_error"
];
var AGENT_TOOL_RISKS = ["read", "write", "high"];
var COLLABORATION_ACTIONS = [
  "social:read",
  "social:write",
  "social:moderate",
  "tasks:read",
  "tasks:write",
  "tasks:manage",
  "reviews:write",
  "design:read",
  "design:review",
  "github:connect",
  "github:publish",
  "agents:manage",
  "data:export",
  "data:restore",
  "workspace:delete",
  "content:read",
  "content:write",
  "content:publish",
  "content:moderate"
];
var TASK_SPACE_TEMPLATES = ["simple", "kanban", "scrum"];
var TASK_STATUS_CATEGORIES = ["todo", "in_progress", "done"];
var WORK_ITEM_LEVELS = ["initiative", "epic", "standard", "subtask"];
var BUILTIN_WORK_ITEM_TYPES = ["initiative", "epic", "story", "task", "bug", "subtask"];
var WORK_ITEM_PRIORITIES = ["highest", "high", "medium", "low", "lowest"];
var TASK_FIELD_TYPES = [
  "text",
  "number",
  "single_select",
  "multi_select",
  "date",
  "checkbox",
  "user",
  "url"
];
var TASK_VIEW_LAYOUTS = ["board", "list", "calendar", "timeline"];
var TASK_VIEW_GROUPS = [
  "status",
  "assignee",
  "priority",
  "type",
  "tag",
  "sprint",
  "release",
  "custom_single_select",
  "none"
];
var TASK_VIEW_SORTS = ["rank", "updated", "due", "priority"];
var TASK_LINK_TYPES = ["blocks", "duplicates", "relates"];
var TASK_SPRINT_STATES = ["future", "active", "completed"];
var TASK_RELEASE_STATES = ["unreleased", "released", "archived"];
var WORK_ITEM_BULK_LIMIT = 100;
var WORK_ITEM_TREE_LIMIT = 1e3;
var TASK_ATTACHMENT_MAX_BYTES = 50 * 1024 * 1024;
var TASK_ATTACHMENT_WORKSPACE_QUOTA_BYTES = 5 * 1024 * 1024 * 1024;
var TASK_ATTACHMENT_INLINE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "application/pdf"
];
var TASK_ATTACHMENT_MIME_TYPES = [
  ...TASK_ATTACHMENT_INLINE_MIME_TYPES,
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/json",
  "application/zip",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
];
var SOURCE_CONTROL_REGION_KINDS = [
  "if",
  "switch",
  "for",
  "while",
  "do-while",
  "for-in",
  "for-of",
  "break",
  "continue",
  "label",
  "try",
  "catch",
  "finally"
];
var PLATFORM_CAPABILITIES = [
  "workspace_identity",
  "workspace_social",
  "task_management",
  "workspace_admin",
  "workflow_execution",
  "billing",
  "design_review",
  "design_preview",
  "architecture",
  "repository_registry",
  "repository_discovery",
  "repository_git_read",
  "repository_git_write",
  "design_architecture_embed",
  "workspace_registry_backup_restore",
  "github",
  "slack",
  "google",
  "meta",
  "qwen",
  "workflow_agents",
  "cloud_terminal",
  "mcp_catalog",
  "monitoring",
  "agent_monitoring",
  "backup_restore",
  "write_authority",
  "community_read",
  "community_authoring",
  "community_publishing",
  "workflow_templates"
];
var CAPABILITY_MODES = ["trusted-local", "configured-local-cloud", "hosted"];
var CAPABILITY_UNAVAILABLE_REASONS = [
  "not_implemented",
  "requires_cloud_configuration",
  "requires_hosted_runtime",
  "provider_not_configured",
  "disabled_by_policy",
  "missing_entitlement",
  "missing_permission"
];
var PLUGIN_PUBLISH_MAX_BYTES = 32 * 1024 * 1024;

// packages/schema/src/source/index.ts
var SourceLocation = import_zod5.z.object({
  path: import_zod5.z.string(),
  start: import_zod5.z.number().int().nonnegative(),
  end: import_zod5.z.number().int().nonnegative(),
  line: import_zod5.z.number().int().positive(),
  column: import_zod5.z.number().int().positive()
});
var SourceSymbolKind = import_zod5.z.enum([
  "function",
  "workflow",
  "module-workflow",
  "type-alias",
  "interface",
  "enum",
  "constant",
  "variable",
  "class",
  "service"
]);
var SourceDecorator = import_zod5.z.object({
  name: import_zod5.z.string(),
  text: import_zod5.z.string(),
  arguments: import_zod5.z.array(import_zod5.z.string())
});
var SourceParameter = import_zod5.z.object({
  name: import_zod5.z.string(),
  type: import_zod5.z.string().optional(),
  optional: import_zod5.z.boolean().optional(),
  rest: import_zod5.z.boolean().optional(),
  visibility: import_zod5.z.enum(["public", "protected", "private", "#private"]).optional(),
  readonly: import_zod5.z.boolean().optional(),
  decorators: import_zod5.z.array(SourceDecorator).optional(),
  initializer: import_zod5.z.string().optional()
});
var SourceClassMember = import_zod5.z.object({
  name: import_zod5.z.string(),
  kind: import_zod5.z.enum([
    "constructor",
    "method",
    "property",
    "getter",
    "setter",
    "accessor",
    "index-signature",
    "static-block"
  ]),
  type: import_zod5.z.string().optional(),
  returns: import_zod5.z.string().optional(),
  parameters: import_zod5.z.array(SourceParameter).optional(),
  typeParameters: import_zod5.z.array(import_zod5.z.string()).optional(),
  visibility: import_zod5.z.enum(["public", "protected", "private", "#private"]).optional(),
  static: import_zod5.z.boolean().optional(),
  readonly: import_zod5.z.boolean().optional(),
  declare: import_zod5.z.boolean().optional(),
  definite: import_zod5.z.boolean().optional(),
  abstract: import_zod5.z.boolean().optional(),
  optional: import_zod5.z.boolean().optional(),
  override: import_zod5.z.boolean().optional(),
  async: import_zod5.z.boolean().optional(),
  generator: import_zod5.z.boolean().optional(),
  decorators: import_zod5.z.array(SourceDecorator).optional(),
  initializer: import_zod5.z.string().optional(),
  workflowId: import_zod5.z.string().optional()
});
var SourceDiagnostic = import_zod5.z.object({
  severity: import_zod5.z.enum(["error", "warning"]),
  code: import_zod5.z.string(),
  message: import_zod5.z.string(),
  location: SourceLocation.optional()
});
var SourceControlRegion = import_zod5.z.object({
  id: import_zod5.z.string(),
  kind: import_zod5.z.enum(SOURCE_CONTROL_REGION_KINDS),
  path: import_zod5.z.array(import_zod5.z.number().int().nonnegative()),
  parentId: import_zod5.z.string().optional(),
  location: SourceLocation,
  source: import_zod5.z.string()
});
var SourceSymbol = import_zod5.z.object({
  id: import_zod5.z.string(),
  name: import_zod5.z.string(),
  kind: SourceSymbolKind,
  exported: import_zod5.z.boolean(),
  location: SourceLocation,
  declaration: import_zod5.z.string().optional(),
  owner: import_zod5.z.string().optional(),
  signature: import_zod5.z.object({
    params: import_zod5.z.array(SourceParameter).optional(),
    returns: import_zod5.z.string().optional(),
    typeText: import_zod5.z.string().optional(),
    decorators: import_zod5.z.array(SourceDecorator).optional(),
    typeParameters: import_zod5.z.array(import_zod5.z.string()).optional(),
    extends: import_zod5.z.string().optional(),
    implements: import_zod5.z.array(import_zod5.z.string()).optional(),
    abstract: import_zod5.z.boolean().optional(),
    instances: import_zod5.z.array(import_zod5.z.string()).optional(),
    members: import_zod5.z.array(SourceClassMember).optional()
  }).optional(),
  constant: import_zod5.z.object({
    serializable: import_zod5.z.boolean(),
    value: import_zod5.z.unknown().optional(),
    declarationKind: import_zod5.z.literal("const").optional(),
    mutable: import_zod5.z.boolean().optional(),
    expression: import_zod5.z.string().optional()
  }).optional(),
  variable: import_zod5.z.object({
    declarationKind: import_zod5.z.enum(["let", "var"]),
    initializer: import_zod5.z.string().optional()
  }).optional(),
  service: import_zod5.z.object({
    classSymbol: import_zod5.z.string().optional(),
    methods: import_zod5.z.array(import_zod5.z.string()),
    lifecycle: import_zod5.z.enum(["invocation", "workflow-run", "worker"])
  }).optional(),
  controlFlow: import_zod5.z.array(SourceControlRegion).optional()
});
var SourceReference = import_zod5.z.object({
  from: import_zod5.z.string(),
  to: import_zod5.z.string(),
  kind: import_zod5.z.enum(["call", "type", "value", "construct", "method"]),
  location: SourceLocation
});
var SourceRecursion = import_zod5.z.object({
  via: import_zod5.z.array(import_zod5.z.string().min(1)).min(1),
  location: SourceLocation
});
var SourceImport = import_zod5.z.object({
  source: import_zod5.z.string(),
  module: import_zod5.z.string(),
  typeOnly: import_zod5.z.boolean(),
  default: import_zod5.z.string().optional(),
  namespace: import_zod5.z.string().optional(),
  named: import_zod5.z.array(import_zod5.z.object({ name: import_zod5.z.string(), alias: import_zod5.z.string().optional(), typeOnly: import_zod5.z.boolean() }))
});
var SourceFileIndex = import_zod5.z.object({
  runtime: import_zod5.z.literal("frontend").optional(),
  path: import_zod5.z.string(),
  language: import_zod5.z.enum(["typescript", "javascript"]),
  bundleId: import_zod5.z.string(),
  entryWorkflowId: import_zod5.z.string().optional(),
  imports: import_zod5.z.array(SourceImport).optional(),
  exports: import_zod5.z.array(
    import_zod5.z.object({
      name: import_zod5.z.string(),
      local: import_zod5.z.string().optional(),
      module: import_zod5.z.string().optional(),
      typeOnly: import_zod5.z.boolean()
    })
  ).optional(),
  symbols: import_zod5.z.array(SourceSymbol),
  diagnostics: import_zod5.z.array(SourceDiagnostic)
});
var ProjectSourceIndex = import_zod5.z.object({
  revision: import_zod5.z.string(),
  files: import_zod5.z.array(SourceFileIndex),
  references: import_zod5.z.array(SourceReference)
});
var ProjectPackageExports = import_zod5.z.object({
  packages: import_zod5.z.array(import_zod5.z.string()),
  dependencies: import_zod5.z.array(
    import_zod5.z.object({
      name: import_zod5.z.string(),
      spec: import_zod5.z.string(),
      version: import_zod5.z.string().nullable(),
      pluginId: import_zod5.z.string().nullable()
    })
  ).optional(),
  exports: import_zod5.z.array(
    import_zod5.z.object({
      name: import_zod5.z.string(),
      kind: import_zod5.z.enum(["function", "constant", "type", "class", "value"]),
      typeOnly: import_zod5.z.boolean(),
      declaration: import_zod5.z.string()
    })
  )
});

// packages/schema/src/plugin/clients.ts
var import_zod11 = require("zod");

// packages/schema/src/plugin/plugin.ts
var import_zod10 = require("zod");

// packages/schema/src/app.ts
var import_zod8 = require("zod");

// packages/schema/src/app/contributions.ts
var import_zod7 = require("zod");

// packages/schema/src/personal/layout.ts
var import_zod6 = require("zod");
var PersonalLayoutItems = import_zod6.z.array(
  import_zod6.z.object({
    id: import_zod6.z.string().min(1).max(240).refine((id2) => !["__proto__", "__all__"].includes(id2)),
    label: import_zod6.z.string().trim().min(1).max(240).optional(),
    pinned: import_zod6.z.boolean().optional()
  }).strict()
).max(100).refine((items) => new Set(items.map((item) => item.id)).size === items.length, "Layout IDs must be unique");
var SettingsLayout = import_zod6.z.record(
  import_zod6.z.string().regex(/^[a-z][a-z0-9.-]*$/).max(100),
  PersonalLayoutItems
).refine((value) => Object.keys(value).length <= 64, "At most 64 layout groups");

// packages/schema/src/app/contributions.ts
var APP_VIEW_TARGETS = [
  "app.page",
  "workspace.block",
  "shell.panel",
  "shell.dock",
  "project.tab",
  "project.overview.block",
  "workflow.tab",
  "workflow.inspector.block",
  "node.view",
  "node.inspector.tab",
  "node.inspector.block",
  "task.space.view",
  "task.details.tab",
  "task.details.block",
  "task.card.badge",
  "document.tab",
  "document.panel",
  "editor.panel",
  "git.diff.panel",
  "table.view",
  "execution.details.block",
  "app.settings.section",
  "project.settings.section"
];
var APP_ACTION_TARGETS = [
  "project.action",
  "file.action",
  "editor.action",
  "editor.selection-action",
  "workflow.action",
  "workflow.canvas.action",
  "workflow.selection-action",
  "workflow.edge.action",
  "node.action",
  "task.space.action",
  "task.action",
  "document.action",
  "document.selection-action",
  "document.block.action",
  "document.slash-command",
  "document.review.action",
  "git.diff.action",
  "table.action",
  "execution.action"
];
var APP_LAUNCHER_TARGETS = ["shell.navbar.action", "shell.navigation.item", "shell.command"];
var AppViewTarget = import_zod7.z.enum(APP_VIEW_TARGETS);
var AppActionTarget = import_zod7.z.enum(APP_ACTION_TARGETS);
var AppContributionTarget = import_zod7.z.enum([...APP_VIEW_TARGETS, ...APP_ACTION_TARGETS]);
var appContributionId = import_zod7.z.string().regex(/^[a-z0-9][a-z0-9-]*$/).max(100);
var appContributionTitle = import_zod7.z.string().trim().min(1).max(240);
var appContributionWhen = import_zod7.z.object({
  hasProject: import_zod7.z.boolean().optional(),
  hasSelection: import_zod7.z.boolean().optional(),
  readOnly: import_zod7.z.boolean().optional(),
  nodeKind: import_zod7.z.string().min(1).max(240).optional(),
  documentFormat: import_zod7.z.enum(["markdown", "html", "latex"]).optional()
}).strict();
var appLauncherSchema = import_zod7.z.object({
  id: appContributionId,
  target: import_zod7.z.enum(APP_LAUNCHER_TARGETS),
  title: appContributionTitle,
  icon: IconName.optional(),
  opens: appContributionId
}).strict();
var appContributionSchema = import_zod7.z.object({
  id: appContributionId,
  target: AppContributionTarget,
  title: appContributionTitle,
  icon: IconName.optional(),
  path: import_zod7.z.string().regex(/^extensions\/[a-z0-9][a-z0-9-]*\.js$/).max(150),
  sha256: import_zod7.z.string().regex(/^sha256:[a-f0-9]{64}$/),
  when: appContributionWhen.optional()
}).strict();
var appContributionContextSchema = import_zod7.z.object({
  projectId: import_zod7.z.string().min(1).max(128).optional(),
  worktreeId: import_zod7.z.string().min(1).max(240).optional(),
  workflowId: import_zod7.z.string().min(1).max(240).optional(),
  nodeId: import_zod7.z.string().min(1).max(240).optional(),
  nodeKind: import_zod7.z.string().min(1).max(240).optional(),
  edgeId: import_zod7.z.string().min(1).max(500).optional(),
  executionId: import_zod7.z.string().min(1).max(128).optional(),
  taskSpaceId: import_zod7.z.string().min(1).max(128).optional(),
  itemId: import_zod7.z.string().min(1).max(128).optional(),
  documentId: import_zod7.z.string().min(1).max(128).optional(),
  documentFormat: import_zod7.z.enum(["markdown", "html", "latex"]).optional(),
  tableId: import_zod7.z.string().min(1).max(128).optional(),
  rowId: import_zod7.z.string().min(1).max(128).optional(),
  filePath: import_zod7.z.string().min(1).max(1024).optional(),
  revision: import_zod7.z.union([import_zod7.z.string().max(240), import_zod7.z.number().int().nonnegative()]).optional(),
  draftRevision: import_zod7.z.number().int().nonnegative().optional(),
  selection: import_zod7.z.object({ start: import_zod7.z.number().int().nonnegative(), end: import_zod7.z.number().int().nonnegative() }).strict().refine((value) => value.end >= value.start).optional(),
  selectedIds: import_zod7.z.array(import_zod7.z.string().min(1).max(500)).max(100).optional(),
  canvas: import_zod7.z.object({ x: import_zod7.z.number().finite(), y: import_zod7.z.number().finite() }).strict().optional(),
  readOnly: import_zod7.z.boolean().default(true),
  tasks: import_zod7.z.array(
    import_zod7.z.object({
      itemId: import_zod7.z.string().min(1).max(128),
      taskSpaceId: import_zod7.z.string().min(1).max(128),
      revision: import_zod7.z.number().int().nonnegative()
    }).strict()
  ).max(100).optional(),
  nodes: import_zod7.z.array(
    import_zod7.z.object({
      id: import_zod7.z.string().min(1).max(240),
      kind: import_zod7.z.string().max(240).optional(),
      label: import_zod7.z.string().max(240).optional()
    }).strict()
  ).max(100).optional()
}).strict();
var appHostRequestSchema = import_zod7.z.discriminatedUnion("command", [
  import_zod7.z.object({ command: import_zod7.z.literal("panel.open"), id: appContributionId }).strict(),
  import_zod7.z.object({ command: import_zod7.z.literal("assistant.open"), suggestion: import_zod7.z.string().max(8e3).optional() }).strict(),
  import_zod7.z.object({ command: import_zod7.z.literal("layout.list") }).strict(),
  import_zod7.z.object({
    command: import_zod7.z.literal("layout.undo"),
    scope: import_zod7.z.string().regex(/^[a-z][a-z0-9.-]*$/).max(100),
    revision: import_zod7.z.string().min(1).max(240)
  }).strict(),
  import_zod7.z.object({
    command: import_zod7.z.literal("layout.update"),
    scope: import_zod7.z.string().regex(/^[a-z][a-z0-9.-]*$/).max(100),
    revision: import_zod7.z.string().min(1).max(240),
    items: PersonalLayoutItems
  }).strict(),
  import_zod7.z.object({
    command: import_zod7.z.literal("edit.propose"),
    resource: import_zod7.z.enum(["file", "document"]),
    baseRevision: import_zod7.z.string().min(1).max(240),
    draftRevision: import_zod7.z.number().int().nonnegative(),
    content: import_zod7.z.string().max(12e3),
    mode: import_zod7.z.enum(["append", "replace", "replace-selection"])
  }).strict()
]);

// packages/schema/src/app.ts
var AppAction = import_zod8.z.enum(["projects:read", "data:read", "data:write", "workflows:run"]);
var appUrl = import_zod8.z.string().max(2048).url().refine((value) => {
  try {
    const url = new URL(value);
    return value === value.trim() && /^https:\/\//i.test(value) && !/[\p{Cc}\s\\?#]/u.test(value) && url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash && url.hostname.includes(".") && !url.hostname.endsWith(".") && !url.hostname.includes(":") && !/^\d+\.\d+\.\d+\.\d+$/.test(url.hostname) && !/\.(localhost|local|internal)$/.test(url.hostname);
  } catch {
    return false;
  }
}, "App URLs must use public HTTPS hostnames without credentials, query strings or fragments");
var SelfHostedAppExtension = import_zod8.z.object({
  id: import_zod8.z.string().regex(/^[a-z0-9][a-z0-9-]*$/).max(100),
  target: import_zod8.z.enum(["app.page", "workspace.block"]),
  url: appUrl,
  sha256: import_zod8.z.string().regex(/^sha256:[a-f0-9]{64}$/)
}).strict();
var SelfHostedApp = import_zod8.z.object({
  apiVersion: import_zod8.z.literal("1"),
  hosting: import_zod8.z.literal("self-hosted"),
  applicationUrl: appUrl,
  icon: IconName.optional(),
  iconUrl: appUrl.optional(),
  privacyUrl: appUrl.optional(),
  supportUrl: appUrl.optional(),
  redirectUrls: import_zod8.z.array(appUrl).min(1).max(10),
  webhookUrl: appUrl.optional(),
  requestedActions: import_zod8.z.array(AppAction).max(4).default([]).refine((actions) => new Set(actions).size === actions.length, "App actions must be unique"),
  extensions: import_zod8.z.array(SelfHostedAppExtension).max(32).default([])
}).strict().superRefine((app, ctx) => {
  if (!URL.canParse(app.applicationUrl)) return;
  const origin = new URL(app.applicationUrl).origin;
  for (const [path, url] of [
    ...app.redirectUrls.map((url2, index) => [["redirectUrls", index], url2]),
    ...app.iconUrl ? [[["iconUrl"], app.iconUrl]] : [],
    ...app.webhookUrl ? [[["webhookUrl"], app.webhookUrl]] : [],
    ...app.extensions.map((extension, index) => [["extensions", index, "url"], extension.url])
  ]) {
    if (URL.canParse(url) && new URL(url).origin !== origin)
      ctx.addIssue({
        code: "custom",
        path: [...path],
        message: "App endpoints and assets must share the application origin"
      });
  }
  if (new Set(app.redirectUrls).size !== app.redirectUrls.length)
    ctx.addIssue({ code: "custom", path: ["redirectUrls"], message: "App redirect URLs must be unique" });
  if (new Set(app.extensions.map((extension) => extension.id)).size !== app.extensions.length)
    ctx.addIssue({ code: "custom", path: ["extensions"], message: "App extension IDs must be unique" });
});
var extensionOnlyAppSchema = import_zod8.z.object({
  apiVersion: import_zod8.z.literal("2"),
  hosting: import_zod8.z.literal("extension-only"),
  icon: IconName.optional(),
  iconUrl: appUrl.optional(),
  settings: import_zod8.z.array(
    import_zod8.z.object({
      id: import_zod8.z.string().regex(/^[a-z][a-zA-Z0-9_]*$/).max(100),
      label: import_zod8.z.string().trim().min(1).max(240),
      defaultValue: import_zod8.z.string().max(4e3).default("")
    }).strict()
  ).max(32).default([]),
  privacyUrl: appUrl.optional(),
  supportUrl: appUrl.optional(),
  requestedActions: import_zod8.z.array(AppAction).max(0).default([]).refine((actions) => new Set(actions).size === actions.length, "App actions must be unique"),
  extensions: import_zod8.z.array(
    import_zod8.z.object({
      id: SelfHostedAppExtension.shape.id,
      target: SelfHostedAppExtension.shape.target,
      path: import_zod8.z.string().regex(/^extensions\/[a-z0-9][a-z0-9-]*\.js$/).max(150),
      sha256: SelfHostedAppExtension.shape.sha256
    }).strict()
  ).min(1).max(32)
}).strict();
var ExtensionOnlyApp = extensionOnlyAppSchema.superRefine((app, ctx) => {
  if (new Set(app.settings.map((setting) => setting.id)).size !== app.settings.length)
    ctx.addIssue({ code: "custom", path: ["settings"], message: "App setting IDs must be unique" });
  for (const field of ["id", "path"]) {
    if (new Set(app.extensions.map((extension) => extension[field])).size !== app.extensions.length)
      ctx.addIssue({ code: "custom", path: ["extensions"], message: `App extension ${field}s must be unique` });
  }
});
var ContributionApp = extensionOnlyAppSchema.extend({
  apiVersion: import_zod8.z.literal("3"),
  requestedActions: import_zod8.z.array(AppAction).max(4).default([]).refine((actions) => new Set(actions).size === actions.length, "App actions must be unique"),
  extensions: import_zod8.z.array(appContributionSchema).min(1).max(32),
  launchers: import_zod8.z.array(appLauncherSchema).max(32).default([]),
  locales: import_zod8.z.record(import_zod8.z.string().regex(/^(en|de|es|fr|ja)$/), import_zod8.z.record(import_zod8.z.string().max(100), import_zod8.z.string().max(4e3))).default({})
}).strict().superRefine((app, ctx) => {
  const ids = [...app.extensions, ...app.launchers].map((item) => item.id);
  if (new Set(ids).size !== ids.length)
    ctx.addIssue({ code: "custom", path: ["extensions"], message: "Contribution IDs must be unique" });
  if (new Set(app.extensions.map((item) => item.path)).size !== app.extensions.length)
    ctx.addIssue({ code: "custom", path: ["extensions"], message: "Contribution paths must be unique" });
  if (new Set(app.settings.map((item) => item.id)).size !== app.settings.length)
    ctx.addIssue({ code: "custom", path: ["settings"], message: "App setting IDs must be unique" });
  for (const [index, launcher] of app.launchers.entries()) {
    const destination = app.extensions.find((item) => item.id === launcher.opens);
    if (!destination || !APP_VIEW_TARGETS.includes(destination.target))
      ctx.addIssue({
        code: "custom",
        path: ["launchers", index, "opens"],
        message: "Launcher destination must be a declared view"
      });
  }
  for (const item of [...app.extensions, ...app.launchers]) {
    if (!item.title.startsWith("t:")) continue;
    for (const language of ["en", "de", "es", "fr", "ja"]) {
      if (!app.locales[language]?.[item.title.slice(2)])
        ctx.addIssue({
          code: "custom",
          path: ["locales", language],
          message: `Missing translation for ${item.title}`
        });
    }
  }
  for (const [language, dictionary] of Object.entries(app.locales))
    if (Object.keys(dictionary ?? {}).length > 200)
      ctx.addIssue({ code: "custom", path: ["locales", language], message: "At most 200 translations per language" });
});
var AppDefinition = import_zod8.z.union([SelfHostedApp, ExtensionOnlyApp, ContributionApp]);
var appTunnelRegistrationSchema = import_zod8.z.object({
  upstream: import_zod8.z.string().url().max(2048),
  previewToken: import_zod8.z.string().regex(/^[A-Za-z0-9_-]{43}$/),
  workspace: import_zod8.z.object({ kind: import_zod8.z.enum(["user", "team", "org"]), id: import_zod8.z.string().min(1).max(128) }).strict().optional()
}).strict();

// packages/schema/src/plugin/runtime.ts
var import_zod9 = require("zod");
var identifier = import_zod9.z.string().regex(/^[a-z][a-z0-9-]{0,63}$/);
var packageName = import_zod9.z.string().regex(/^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/i);
var PypiPackageName = packageName.transform((name) => name.toLowerCase().replace(/[-_.]+/g, "-"));
var PypiVersion = import_zod9.z.string().min(1).max(128).regex(/^[0-9][a-zA-Z0-9.!+_-]*$/);
var PluginRuntimeRequirement = import_zod9.z.object({
  runtime: identifier,
  versionConstraint: import_zod9.z.string().min(1).max(120),
  adapterApi: import_zod9.z.literal("1"),
  dependencyGroups: import_zod9.z.array(identifier).max(100).default([])
}).strict();
var PluginDependencyGroup = import_zod9.z.discriminatedUnion("ecosystem", [
  import_zod9.z.object({
    ecosystem: import_zod9.z.literal("pypi"),
    packages: import_zod9.z.array(
      import_zod9.z.object({
        name: PypiPackageName,
        version: PypiVersion
      }).strict()
    ).min(1).max(100)
  }).strict(),
  import_zod9.z.object({
    ecosystem: import_zod9.z.literal("npm"),
    packages: import_zod9.z.array(
      import_zod9.z.object({
        name: import_zod9.z.string().regex(/^(@[a-z0-9~._-]+\/)?[a-z0-9~._-]+$/),
        version: import_zod9.z.string().regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/)
      }).strict()
    ).min(1).max(100)
  }).strict()
]);
var PluginExecution = import_zod9.z.object({
  runtimeRef: identifier,
  entrypoint: import_zod9.z.object({
    kind: import_zod9.z.literal("file"),
    path: import_zod9.z.string().min(1).max(1024).refine(
      (path) => !path.includes("\\") && !path.includes(":") && !path.includes("\0") && path.split("/").every((part) => !!part && part !== "." && part !== ".."),
      "Entrypoints must be safe relative file paths"
    )
  }).strict(),
  args: import_zod9.z.array(
    import_zod9.z.string().max(4096).refine((arg) => !arg.includes("\0"))
  ).max(100).default([]),
  /** Original SDK identity survives project aliases and canvas instance IDs. */
  invokeAs: import_zod9.z.string().min(1).max(300).optional()
}).strict();
var PluginRuntimePlan = import_zod9.z.object({
  fingerprint: import_zod9.z.string().regex(/^[a-f0-9]{64}$/),
  ready: import_zod9.z.boolean(),
  canPrepare: import_zod9.z.boolean(),
  runtimes: import_zod9.z.array(
    import_zod9.z.object({
      runtime: import_zod9.z.string(),
      required: import_zod9.z.string(),
      version: import_zod9.z.string().optional(),
      status: import_zod9.z.enum(["ready", "setup", "blocked"]),
      message: import_zod9.z.string()
    })
  ),
  packages: import_zod9.z.array(import_zod9.z.object({ ecosystem: import_zod9.z.enum(["npm", "pypi"]), name: import_zod9.z.string(), version: import_zod9.z.string() })),
  files: import_zod9.z.array(import_zod9.z.string())
});
var PluginArtifactTarget = import_zod9.z.object({
  sourceLanguage: identifier,
  runtime: identifier,
  runtimeVersion: import_zod9.z.string().regex(/^\d+\.\d+\.\d+$/),
  platform: import_zod9.z.enum(["portable", "linux", "darwin", "win32"]),
  arch: identifier,
  abi: identifier,
  libc: import_zod9.z.enum(["glibc", "musl", "none"]).optional(),
  archiveSha256: import_zod9.z.string().regex(/^[a-f0-9]{64}$/)
}).strict().refine(
  (target) => target.platform !== "linux" || target.libc === "glibc" || target.libc === "musl",
  "Linux artifacts require their libc family"
);

// packages/schema/src/plugin/plugin.ts
var PluginScope = import_zod10.z.enum(["user", "group", "org", "public"]);
var PluginUiTarget = import_zod10.z.enum(["node.inspector.inputs"]);
var PLUGIN_UI_BUNDLE_MAX_BYTES = 512 * 1024;
var pluginUiEntry = import_zod10.z.string().min(1).max(1024).refine(
  (value) => !value.startsWith("/") && !value.includes("\\") && !value.split("/").includes("..") && /\.[cm]?[jt]sx?$/.test(value),
  "UI entries must be relative JavaScript/TypeScript module paths"
);
var PluginNodeUi = import_zod10.z.object({
  apiVersion: import_zod10.z.literal("1"),
  renderers: import_zod10.z.record(
    import_zod10.z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i, "renderer id must be alphanumeric/dash/underscore"),
    import_zod10.z.object({
      label: import_zod10.z.string().min(1).max(240),
      targets: import_zod10.z.record(PluginUiTarget, pluginUiEntry)
    }).strict()
  ).refine((renderers) => Object.keys(renderers).length > 0, "UI needs at least one renderer")
}).strict();
var NpmClientBinding = import_zod10.z.object({
  module: import_zod10.z.string().regex(/^(@[a-z0-9~._-]+\/)?[a-z0-9~._-]+(?:\/[a-zA-Z0-9~._-]+)*$/).refine((value) => !value.split("/").some((part) => part === "." || part === ".."), "Unsafe npm module path"),
  export: import_zod10.z.string().regex(/^[$A-Z_a-z][$\w]*$/),
  options: import_zod10.z.record(import_zod10.z.unknown()).optional(),
  env: import_zod10.z.record(
    import_zod10.z.string().regex(/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/).refine(
      (path) => !path.split(".").some((key) => ["__proto__", "prototype", "constructor"].includes(key)),
      "Unsafe option path"
    ),
    import_zod10.z.string().regex(/^[A-Z_][A-Z0-9_]*$/)
  ).optional()
}).strict();
var PluginImplementationSource = import_zod10.z.discriminatedUnion("kind", [
  import_zod10.z.object({ kind: import_zod10.z.literal("plugin") }).strict(),
  import_zod10.z.object({ kind: import_zod10.z.literal("pypi"), package: PypiPackageName, version: PypiVersion }).strict(),
  import_zod10.z.object({
    kind: import_zod10.z.literal("npm"),
    package: import_zod10.z.string().regex(/^(@[a-z0-9~._-]+\/)?[a-z0-9~._-]+$/),
    version: import_zod10.z.string().regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/)
  }).strict()
]);
var PluginNpmDependency = import_zod10.z.object({ package: import_zod10.z.string(), version: import_zod10.z.string(), spec: import_zod10.z.string() }).strict();
var NpmClientDefinition = import_zod10.z.object({
  module: NpmClientBinding.shape.module,
  export: NpmClientBinding.shape.export,
  construction: import_zod10.z.enum(["call", "new"]),
  overload: import_zod10.z.number().int().nonnegative().optional(),
  async: import_zod10.z.boolean(),
  parameters: import_zod10.z.array(
    import_zod10.z.object({
      name: import_zod10.z.string().regex(/^[A-Za-z_$][\w$]*$/),
      required: import_zod10.z.boolean(),
      rest: import_zod10.z.boolean(),
      schema: JsonSchema
    })
  ),
  inputs: JsonSchema,
  label: import_zod10.z.string().optional(),
  fields: import_zod10.z.record(import_zod10.z.object({ label: import_zod10.z.string(), secret: import_zod10.z.boolean().optional() })).optional()
}).strict();
var NpmSdkExport = import_zod10.z.object({
  name: import_zod10.z.string(),
  kind: import_zod10.z.enum(["type", "constant", "function", "client"]),
  type: import_zod10.z.string(),
  schema: JsonSchema.optional()
}).strict();
var PluginNode = import_zod10.z.object({
  id: import_zod10.z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i, "node id must be alphanumeric/dash/underscore"),
  /** The command the engine spawns, relative to the plugin folder. */
  command: import_zod10.z.string().default(""),
  language: import_zod10.z.string().optional(),
  sourceLanguage: import_zod10.z.string().regex(/^[a-z][a-z0-9-]{0,63}$/).optional(),
  execution: PluginExecution.optional(),
  label: import_zod10.z.string().min(1).max(240).optional(),
  symbol: import_zod10.z.string().min(1).max(16).optional(),
  description: import_zod10.z.string().optional(),
  icon: IconValue.optional(),
  trigger: import_zod10.z.boolean().optional(),
  inputs: JsonSchema.optional(),
  outputs: JsonSchema.optional(),
  /** Names of environment variables / secrets this node expects to be injected. */
  env: import_zod10.z.array(import_zod10.z.string()).optional(),
  connections: import_zod10.z.array(import_zod10.z.string().min(1)).optional(),
  defaults: import_zod10.z.record(import_zod10.z.unknown()).optional(),
  client: import_zod10.z.string().optional(),
  bindings: import_zod10.z.record(import_zod10.z.string().regex(/^[A-Za-z_$][\w$]*$/), NpmClientBinding).optional(),
  ui: PluginNodeUi.optional(),
  source: PluginImplementationSource.optional(),
  /** Explicit mapping to the library export; workflow adapters keep their own argument convention. */
  libraryExport: import_zod10.z.string().regex(/^[$A-Z_a-z][$\w]*$/).optional(),
  /** Compiler-owned original import identity, never a presentation override. */
  implementation: import_zod10.z.object({
    module: import_zod10.z.string(),
    export: import_zod10.z.string(),
    methodPath: import_zod10.z.array(
      import_zod10.z.string().regex(/^[$A-Z_a-z][$\w]*$/).refine((part) => !["__proto__", "prototype", "constructor"].includes(part))
    ).min(1).max(8).optional(),
    parameters: import_zod10.z.array(import_zod10.z.string()),
    rest: import_zod10.z.string().optional(),
    outputStreams: import_zod10.z.array(import_zod10.z.array(import_zod10.z.string().refine((part) => !["__proto__", "prototype", "constructor"].includes(part))).max(8)).max(16).optional()
  }).strict().optional()
});
var PluginPermission = import_zod10.z.object({
  resource: import_zod10.z.enum(["project_data", "secrets", "network"]),
  access: import_zod10.z.enum(["read", "write", "outbound"])
});
var PluginCategory = import_zod10.z.enum([
  "ai",
  "api",
  "communication",
  "database",
  "development",
  "finance",
  "npm",
  "productivity",
  "storage",
  "utilities",
  "other"
]);
var PluginLicense = import_zod10.z.enum(["MIT", "Apache-2.0"]);
var PluginIntegration = import_zod10.z.object({
  // Keep historical/custom categories readable; creation selectors use PluginCategory.
  category: import_zod10.z.string().optional(),
  tags: import_zod10.z.array(import_zod10.z.string()).default([]),
  /** Secrets/env the integration needs to authenticate (e.g. ["JIRA_TOKEN"]). */
  auth: import_zod10.z.array(import_zod10.z.string()).optional(),
  /** Original npm dependency used by generated npm nodes. */
  npm: PluginNpmDependency.optional(),
  npmDependencies: import_zod10.z.array(PluginNpmDependency).optional()
});
var PluginConnection = import_zod10.z.object({
  label: import_zod10.z.string().min(1).max(240),
  description: import_zod10.z.string().max(4e3).optional(),
  fields: import_zod10.z.record(
    import_zod10.z.string().regex(/^[A-Z_][A-Z0-9_]*$/, "credential fields must be environment variable names"),
    import_zod10.z.object({
      label: import_zod10.z.string().min(1).max(240),
      description: import_zod10.z.string().max(4e3).optional(),
      secret: import_zod10.z.boolean().default(true),
      required: import_zod10.z.boolean().default(true)
    }).strict()
  )
}).strict();
var PluginManifest = import_zod10.z.object({
  schemaVersion: import_zod10.z.enum(["1", "2"]).default(PLUGIN_SCHEMA_VERSION),
  runtimeRequirements: import_zod10.z.record(import_zod10.z.string().regex(/^[a-z][a-z0-9-]{0,63}$/), PluginRuntimeRequirement).optional(),
  dependencyGroups: import_zod10.z.record(import_zod10.z.string().regex(/^[a-z][a-z0-9-]{0,63}$/), PluginDependencyGroup).optional(),
  /** Stable plugin id; namespaces its nodes as `<id>/<nodeId>`. */
  id: import_zod10.z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "plugin id must be lowercase alphanumeric/dash"),
  name: import_zod10.z.string(),
  version: import_zod10.z.string(),
  description: import_zod10.z.string().optional(),
  /** Implementation authority; absent on legacy artifacts. */
  source: PluginImplementationSource.optional(),
  library: import_zod10.z.object({
    format: import_zod10.z.literal(1),
    entry: import_zod10.z.literal("library/index.js"),
    types: import_zod10.z.literal("library/index.d.ts"),
    exports: import_zod10.z.array(import_zod10.z.string().regex(/^[$A-Z_a-z][$\w]*$/)).min(1)
  }).strict().optional(),
  /** Source-level inventory shown alongside executable nodes in plugin overviews. */
  contents: import_zod10.z.object({
    types: import_zod10.z.array(import_zod10.z.string().min(1).max(240)).max(1e3),
    services: import_zod10.z.array(import_zod10.z.string().min(1).max(240)).max(1e3),
    constants: import_zod10.z.array(import_zod10.z.string().min(1).max(240)).max(1e3),
    classes: import_zod10.z.array(import_zod10.z.string().min(1).max(240)).max(1e3)
  }).strict().optional(),
  icon: IconValue.optional(),
  author: import_zod10.z.string().optional(),
  contributors: import_zod10.z.array(import_zod10.z.string().trim().min(1).max(240)).max(100).optional(),
  repository: import_zod10.z.string().url().regex(/^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/).optional(),
  homepage: import_zod10.z.string().optional(),
  license: import_zod10.z.string().optional(),
  /** Distribution tiers this plugin may be discovered/installed from. Private by default. */
  scope: import_zod10.z.array(PluginScope).default(["user"]),
  /** Coarse runtime capabilities the plugin requests; consented to at install. */
  permissions: import_zod10.z.array(PluginPermission).default([]),
  app: AppDefinition.optional(),
  integration: PluginIntegration.optional(),
  connections: import_zod10.z.record(import_zod10.z.string().regex(/^[a-z0-9][a-z0-9-]*$/), PluginConnection).optional(),
  clients: import_zod10.z.record(NpmClientDefinition).optional(),
  sdkExports: import_zod10.z.array(NpmSdkExport).optional(),
  nodes: import_zod10.z.array(PluginNode).default([])
}).superRefine((manifest2, ctx) => {
  const issue = (path, message) => ctx.addIssue({ code: "custom", path, message });
  if (manifest2.schemaVersion === "1" && (manifest2.runtimeRequirements || manifest2.dependencyGroups || manifest2.nodes.some((node) => node.execution || node.sourceLanguage)))
    issue(["schemaVersion"], "Runtime declarations require plugin schemaVersion 2");
  if (manifest2.app && (manifest2.runtimeRequirements || manifest2.dependencyGroups))
    issue(["app"], "Apps cannot declare plugin runtimes or dependency groups");
  for (const [name, requirement] of Object.entries(manifest2.runtimeRequirements ?? {})) {
    for (const group of requirement.dependencyGroups) {
      const dependency = manifest2.dependencyGroups?.[group];
      if (!dependency) issue(["runtimeRequirements", name], `Unknown dependency group ${group}`);
      else if (requirement.runtime === "node" && dependency.ecosystem !== "npm" || requirement.runtime === "cpython" && dependency.ecosystem !== "pypi")
        issue(["runtimeRequirements", name], "Dependency ecosystem does not match runtime");
    }
  }
  for (const [name, group] of Object.entries(manifest2.dependencyGroups ?? {})) {
    if (new Set(group.packages.map((item) => item.name)).size !== group.packages.length)
      issue(["dependencyGroups", name], "Package names must be unique within a dependency group");
  }
  const source = manifest2.source;
  if (source?.kind === "pypi" && !Object.values(manifest2.dependencyGroups ?? {}).some(
    (group) => group.ecosystem === "pypi" && group.packages.some((pkg) => pkg.name === source.package && pkg.version === source.version)
  ))
    issue(["source"], "PyPI source must match a declared dependency");
  if (manifest2.app && (manifest2.nodes.length || manifest2.library || manifest2.permissions.length || Object.keys(manifest2.connections ?? {}).length || Object.keys(manifest2.clients ?? {}).length || manifest2.sdkExports?.length || manifest2.integration?.npm || manifest2.integration?.npmDependencies?.length))
    ctx.addIssue({
      code: "custom",
      path: ["app"],
      message: "Self-hosted apps cannot include executable plugin nodes, libraries, dependencies, connections or plugin permissions"
    });
  const npm = manifest2.integration?.npm;
  const dependencies = [
    ...manifest2.integration?.npmDependencies ?? (npm ? [npm] : []),
    ...Object.values(manifest2.dependencyGroups ?? {}).flatMap(
      (group) => group.ecosystem === "npm" ? group.packages.map((pkg) => ({
        package: pkg.name,
        version: pkg.version,
        spec: `${pkg.name}@${pkg.version}`
      })) : []
    )
  ];
  if (new Set(dependencies.map((item) => item.package)).size !== dependencies.length)
    ctx.addIssue({
      code: "custom",
      path: ["integration"],
      message: "npm dependencies must have unique package names"
    });
  if (manifest2.source?.kind === "plugin" && npm || source?.kind === "npm" && !dependencies.some((pkg) => pkg.package === source.package && pkg.version === source.version))
    ctx.addIssue({
      code: "custom",
      path: ["source"],
      message: "source authority must match a declared npm dependency"
    });
  const ids = /* @__PURE__ */ new Set();
  manifest2.nodes.forEach((node, index) => {
    if (manifest2.schemaVersion === "2") {
      if (!node.execution || !manifest2.runtimeRequirements?.[node.execution.runtimeRef])
        issue(["nodes", index, "execution"], "Every v2 node requires a declared runtime");
      if (!node.sourceLanguage || node.inputs === void 0 || node.outputs === void 0)
        issue(["nodes", index], "Every v2 node requires sourceLanguage and input/output schemas");
      if (node.command || node.language)
        issue(["nodes", index], "v2 nodes use execution and sourceLanguage instead of command and language");
    } else if (!node.command.trim()) issue(["nodes", index, "command"], "Legacy nodes require a command");
    if (ids.has(node.id))
      ctx.addIssue({ code: "custom", path: ["nodes", index, "id"], message: "node IDs must be unique" });
    ids.add(node.id);
    const nodeSource = node.source;
    if (nodeSource?.kind === "pypi" && !Object.values(manifest2.dependencyGroups ?? {}).some(
      (group) => group.ecosystem === "pypi" && group.packages.some((pkg) => pkg.name === nodeSource.package && pkg.version === nodeSource.version)
    ))
      issue(["nodes", index, "source"], "PyPI source must match a declared dependency");
    if (node.libraryExport && node.execution && manifest2.runtimeRequirements?.[node.execution.runtimeRef]?.runtime !== "node")
      issue(["nodes", index, "libraryExport"], "Only Node.js nodes can expose direct JavaScript library imports");
    const nodeNpm = nodeSource?.kind === "npm" ? dependencies.find((item) => item.package === nodeSource.package && item.version === nodeSource.version) : nodeSource?.kind === "plugin" ? void 0 : npm;
    if (node.source?.kind === "npm" && !nodeNpm)
      ctx.addIssue({
        code: "custom",
        path: ["nodes", index, "source"],
        message: "npm source must match a declared dependency"
      });
    if (node.libraryExport && (node.source?.kind === "npm" || !manifest2.library?.exports.includes(node.libraryExport)))
      ctx.addIssue({
        code: "custom",
        path: ["nodes", index, "libraryExport"],
        message: "custom export must exist in the plugin library"
      });
    if (node.client) {
      const client = manifest2.clients?.[node.client];
      if (!client || !node.implementation?.methodPath || client.module !== node.implementation.module || client.export !== node.implementation.export || !nodeNpm || client.module !== nodeNpm.package && !client.module.startsWith(`${nodeNpm.package}/`))
        ctx.addIssue({
          code: "custom",
          path: ["nodes", index, "client"],
          message: "Client must match the verified npm method receiver"
        });
    }
    for (const binding of Object.values(node.bindings ?? {})) {
      if (!nodeNpm || binding.module !== nodeNpm.package && !binding.module.startsWith(`${nodeNpm.package}/`))
        ctx.addIssue({
          code: "custom",
          path: ["nodes", index, "bindings"],
          message: "SDK factories must belong to the original npm package"
        });
      const credentialFields = new Set(
        (node.connections ?? []).flatMap((name) => Object.keys(manifest2.connections?.[name]?.fields ?? {}))
      );
      for (const name of Object.values(binding.env ?? {}))
        if (!credentialFields.has(name))
          ctx.addIssue({
            code: "custom",
            path: ["nodes", index, "bindings"],
            message: `SDK binding requires connection field "${name}"`
          });
    }
    for (const connection of node.connections ?? []) {
      if (!Object.hasOwn(manifest2.connections ?? {}, connection))
        ctx.addIssue({
          code: "custom",
          path: ["nodes", index, "connections"],
          message: `unknown connection "${connection}"`
        });
    }
  });
  if (Object.keys(manifest2.connections ?? {}).length && !manifest2.permissions.some((permission) => permission.resource === "secrets" && permission.access === "read"))
    ctx.addIssue({
      code: "custom",
      path: ["permissions"],
      message: "credential connections require secrets:read permission"
    });
});

// packages/schema/src/plugin/clients.ts
var identifier2 = import_zod11.z.string().regex(/^[A-Za-z_$][\w$]*$/);
var ProjectClientReference = import_zod11.z.object({ path: import_zod11.z.string().min(1), export: identifier2 }).strict();
var ClientValue = import_zod11.z.discriminatedUnion("kind", [
  import_zod11.z.object({ kind: import_zod11.z.literal("sdk"), export: identifier2 }).strict(),
  import_zod11.z.object({ kind: import_zod11.z.literal("literal"), value: import_zod11.z.unknown() }).strict(),
  import_zod11.z.object({ kind: import_zod11.z.literal("env"), name: import_zod11.z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/) }).strict(),
  import_zod11.z.object({ kind: import_zod11.z.literal("symbol"), ...ProjectClientReference.shape }).strict()
]);
var ClientConfiguration = import_zod11.z.record(import_zod11.z.string().min(1), ClientValue);
var NodeClientRequest = import_zod11.z.object({
  revision: import_zod11.z.string().min(1),
  selection: import_zod11.z.discriminatedUnion("kind", [
    import_zod11.z.object({ kind: import_zod11.z.literal("keep") }).strict(),
    import_zod11.z.object({ kind: import_zod11.z.literal("existing"), ...ProjectClientReference.shape }).strict(),
    import_zod11.z.object({ kind: import_zod11.z.literal("create"), name: identifier2.optional(), values: ClientConfiguration }).strict(),
    import_zod11.z.object({ kind: import_zod11.z.literal("configure"), values: ClientConfiguration }).strict()
  ]),
  arguments: import_zod11.z.array(import_zod11.z.string().max(1e5)).optional()
}).strict();
var NodeClientView = import_zod11.z.object({
  revision: import_zod11.z.string(),
  definition: NpmClientDefinition,
  exports: import_zod11.z.array(NpmSdkExport).optional(),
  existing: import_zod11.z.array(ProjectClientReference),
  selected: ProjectClientReference.optional(),
  values: ClientConfiguration.optional(),
  arguments: import_zod11.z.array(import_zod11.z.string()).optional(),
  parameters: import_zod11.z.array(import_zod11.z.string()),
  usedBy: import_zod11.z.array(import_zod11.z.string()),
  editable: import_zod11.z.boolean()
});

// packages/schema/src/test/workflow/graph.ts
var import_zod12 = require("zod");
var TestWorkflowGraphNodeKind = import_zod12.z.enum([
  "file",
  "suite",
  "test",
  "hook",
  "before-all",
  "before-each",
  "after-each",
  "after-all",
  "module-mock",
  "ordered-module-mock",
  "function-mock",
  "hoisted-mock",
  "spy",
  "mock-operation",
  "test-data",
  "mock-data",
  "snapshot-artifact",
  "assertion",
  "source-call",
  "source-helper",
  "source-import",
  "source-symbol",
  "source-type",
  "source-constant",
  "source-class",
  "source-service"
]);
var TestWorkflowGraphEdgeKind = import_zod12.z.enum([
  "contains",
  "invokes",
  "executes",
  "applies-to",
  "replaces-module",
  "spies-on",
  "configures-mock",
  "clears",
  "resets",
  "restores",
  "uses-type",
  "uses-value",
  "constructs",
  "calls-service"
]);
var TestWorkflowGraphNode = import_zod12.z.object({
  id: import_zod12.z.string(),
  kind: TestWorkflowGraphNodeKind,
  label: import_zod12.z.string(),
  location: SourceLocation,
  detail: import_zod12.z.string().optional(),
  framework: import_zod12.z.enum(["vitest", "jest", "playwright"]).optional(),
  sourceSymbolId: import_zod12.z.string().optional(),
  sourceSymbolKind: import_zod12.z.enum([
    "workflow",
    "module-workflow",
    "function",
    "type-alias",
    "interface",
    "enum",
    "constant",
    "variable",
    "class",
    "service"
  ]).optional(),
  mockPhase: import_zod12.z.enum(["hoisted", "ordered", "runner-controlled"]).optional(),
  runnable: import_zod12.z.boolean().optional()
});
var TestWorkflowGraphEdge = import_zod12.z.object({
  id: import_zod12.z.string(),
  from: import_zod12.z.string(),
  to: import_zod12.z.string(),
  kind: TestWorkflowGraphEdgeKind
});
var TestWorkflowGraphDiagnostic = import_zod12.z.object({
  severity: import_zod12.z.enum(["warning", "error"]),
  code: import_zod12.z.string(),
  message: import_zod12.z.string(),
  location: SourceLocation.optional()
});
var TestWorkflowGraphAction = import_zod12.z.discriminatedUnion("kind", [
  import_zod12.z.object({
    kind: import_zod12.z.literal("create-node"),
    nodeKind: import_zod12.z.enum([
      "suite",
      "test",
      "helper",
      "before-all",
      "before-each",
      "after-all",
      "after-each",
      "module-mock"
    ]),
    parentId: import_zod12.z.string().optional(),
    label: import_zod12.z.string().optional(),
    module: import_zod12.z.string().optional(),
    body: import_zod12.z.string().optional(),
    parameters: import_zod12.z.string().optional(),
    async: import_zod12.z.boolean().optional()
  }),
  import_zod12.z.object({
    kind: import_zod12.z.literal("create-data"),
    dataKind: import_zod12.z.enum(["fixture", "mock-data"]),
    scopeId: import_zod12.z.string().optional(),
    name: import_zod12.z.string(),
    typeName: import_zod12.z.string(),
    value: import_zod12.z.record(import_zod12.z.string(), import_zod12.z.unknown())
  }),
  import_zod12.z.object({ kind: import_zod12.z.literal("rename-node"), nodeId: import_zod12.z.string(), label: import_zod12.z.string() }),
  import_zod12.z.object({ kind: import_zod12.z.literal("delete-node"), nodeId: import_zod12.z.string() }),
  import_zod12.z.object({ kind: import_zod12.z.literal("import-symbol"), symbolId: import_zod12.z.string(), sourceIndexRevision: import_zod12.z.string().length(64) })
]);
var TestWorkflowGraph = import_zod12.z.object({
  path: import_zod12.z.string(),
  revision: import_zod12.z.string().length(64),
  sourceIndexRevision: import_zod12.z.string().length(64),
  runner: import_zod12.z.enum(["vitest", "jest", "playwright"]),
  nodes: import_zod12.z.array(TestWorkflowGraphNode),
  edges: import_zod12.z.array(TestWorkflowGraphEdge),
  referencedSymbols: import_zod12.z.array(import_zod12.z.string()),
  diagnostics: import_zod12.z.array(TestWorkflowGraphDiagnostic),
  truncated: import_zod12.z.boolean()
});

// packages/schema/src/octonode/config.ts
var CONFIG_API_VERSION = "octonode.dev/v1";
var NodeKind = import_zod13.z.enum(["function", "class", "service", "const"]);
var NodeSignature = import_zod13.z.object({
  language: import_zod13.z.string(),
  /** CODE-OWNED target of a workflow invocation wrapper. */
  workflowId: import_zod13.z.string().min(1).optional(),
  /** The command the engine spawns for this node, e.g. `python3 nodes/x.py`. */
  command: import_zod13.z.string(),
  /** Hydrated by trusted plugin runtime adapters; bypasses command-string parsing. */
  args: import_zod13.z.array(import_zod13.z.string()).optional(),
  invokeAs: import_zod13.z.string().optional(),
  /** Live plugin readiness failure. Prevents execution while keeping the catalog editable. */
  runtimeError: import_zod13.z.string().optional(),
  defaults: import_zod13.z.record(import_zod13.z.unknown()).optional(),
  requiredEnv: import_zod13.z.array(import_zod13.z.string()).optional(),
  /**
   * What this node is (CODE-OWNED, from the describe manifest). Omitted →
   * `function`. `class`/`service`/`const` are setup-time entities without I/O.
   */
  kind: NodeKind.optional(),
  /**
   * Working directory the command runs from — relative to the project root,
   * or absolute (hydrated plugin nodes point into the global store). Set for
   * plugin nodes, whose relative paths resolve against the plugin folder.
   * Absent → the engine's working directory.
   */
  cwd: import_zod13.z.string().optional(),
  inputs: JsonSchema.optional(),
  outputs: JsonSchema.optional(),
  /** CODE-OWNED expressions evaluated inside this node's original source scope. */
  sourceExpressions: import_zod13.z.record(import_zod13.z.string()).optional(),
  /** Exact authored text for this compiled node. Empty for synthetic workflow plumbing. */
  sourceExcerpt: SourceLocation.extend({ content: import_zod13.z.string() }).optional(),
  /** Resolved marketplace calls retained in their original source scope, never IPC substitutions. */
  sourcePlugins: import_zod13.z.array(
    import_zod13.z.object({
      alias: import_zod13.z.string(),
      node: import_zod13.z.string(),
      version: import_zod13.z.string(),
      module: import_zod13.z.string(),
      export: import_zod13.z.string(),
      execution: import_zod13.z.literal("source")
    })
  ).optional(),
  /** CODE-OWNED recursive call sites; visualization only, not execution edges. */
  recursion: import_zod13.z.array(SourceRecursion).optional(),
  /**
   * Setup params for non-`function` kinds (class constructor / service config /
   * const shape). Rendered as a form in the editor. Unused by `function` nodes,
   * which carry their shape in `inputs`/`outputs` instead.
   */
  setup: JsonSchema.optional(),
  /** sha256 of the normalized signature, for drift/staleness detection. */
  checksum: import_zod13.z.string().optional(),
  /** Set when scan no longer finds this node in code; not deleted automatically. */
  orphaned: import_zod13.z.boolean().optional(),
  /** CODE-OWNED. This node participates in a shared resumable source scope. */
  sourceScope: import_zod13.z.boolean().optional(),
  /** Routing metadata for an explicitly exposed service host or method node. */
  service: import_zod13.z.object({
    host: import_zod13.z.string(),
    method: import_zod13.z.string().optional(),
    lifecycle: import_zod13.z.enum(["invocation", "workflow-run", "worker"])
  }).optional()
});
var NodeRuntime = import_zod13.z.object({
  timeout_ms: import_zod13.z.number().int().positive().optional(),
  retries: import_zod13.z.number().int().nonnegative().optional(),
  retry_backoff_ms: import_zod13.z.number().int().nonnegative().optional(),
  concurrency: import_zod13.z.number().int().positive().optional(),
  /** When true, this node waits for running nodes and executes alone within the workflow run. */
  async: import_zod13.z.boolean().optional()
});
var NodePresentation = import_zod13.z.object({
  icon: IconValue.optional(),
  /** Optional human-facing label used when the node id is implementation detail. */
  label: import_zod13.z.string().optional(),
  symbol: import_zod13.z.string().max(16).optional(),
  description: import_zod13.z.string().optional(),
  color: import_zod13.z.string().optional(),
  position: import_zod13.z.object({ x: import_zod13.z.number(), y: import_zod13.z.number() }).optional(),
  /** Optional plugin renderer selected for this node instance. */
  renderer: import_zod13.z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i).optional()
});
var NodeConfig = import_zod13.z.object({
  /** Catalog ancestry, independent of editable presentation. */
  native: import_zod13.z.string().optional(),
  /** Stable execution boundary; legacy entries fall back to their icon. */
  role: WorkflowNodeRole.optional(),
  /** Stable identity key; edges reference this, never the source path. */
  id: import_zod13.z.string(),
  /**
   * CONFIG-OWNED. For setup-time kinds (class/service/const): the ids of the
   * function nodes that depend on this entity. Rendered as dashed dependency
   * edges in the editor, distinct from data-flow edges. (The node's `kind`
   * itself is code-owned and lives in `signature.kind`.)
   */
  provides: import_zod13.z.array(import_zod13.z.string()).optional(),
  /**
   * Reference to an installed plugin's node (`<pluginId>/<nodeId>`). The
   * signature is hydrated from the LIVE plugin manifest at config-load time
   * (see @octonode/plugin hydratePluginNodes), so a lock upgrade propagates to
   * every node referencing the plugin. Any stored signature is the last-known
   * snapshot, kept as a fallback when the plugin can't be resolved.
   */
  plugin: import_zod13.z.string().optional(),
  /** Resolved from the installed immutable plugin; never edited by project configuration. */
  pluginVersion: import_zod13.z.string().optional(),
  pluginClient: ProjectClientReference.optional(),
  pluginClientChecksum: import_zod13.z.string().optional(),
  pluginUi: PluginNodeUi.optional(),
  /** Generated by `octonode scan`. Optional so runtime/presentation can be pre-declared. */
  signature: NodeSignature.optional(),
  runtime: NodeRuntime.optional(),
  presentation: NodePresentation.optional(),
  /** CODE-OWNED optional defaults from octonode.config.ts. */
  definitionPresentation: NodePresentation.optional(),
  /** Generated defaults are inheritable; old records without provenance keep their explicit presentation. */
  presentationSeed: NodePresentation.optional(),
  /** CONFIG-OWNED. When true the scheduler bypasses this node (passes inputs through). */
  disabled: import_zod13.z.boolean().optional()
});
var Environment = import_zod13.z.object({
  inherits: import_zod13.z.string().optional(),
  vars: import_zod13.z.record(import_zod13.z.string()).optional(),
  secrets: import_zod13.z.array(import_zod13.z.string()).optional()
});
var ProjectDefaults = import_zod13.z.object({
  /** TypeScript is the only active v1 authoring/runtime choice. */
  language: import_zod13.z.literal("typescript").optional()
});
var ProjectAttachments = import_zod13.z.object({
  plugins: import_zod13.z.array(import_zod13.z.string()).default([]),
  variables: import_zod13.z.array(import_zod13.z.string()).default([]),
  dataTables: import_zod13.z.array(import_zod13.z.string()).default([])
});
var WorkflowEdge = import_zod13.z.object({
  from: import_zod13.z.object({ node: import_zod13.z.string(), output: import_zod13.z.string().optional() }),
  to: import_zod13.z.object({ node: import_zod13.z.string(), input: import_zod13.z.string().optional() }),
  /**
   * `data` (default) — a normal data-flow connection between ports.
   * `dependency` — a setup-time dependency from a class/service/const onto the
   * function node that uses it. The scheduler ignores dependency edges (they
   * carry no data and don't affect topology); they exist for visualization.
   * `control` — an execution dependency that carries no input value (used by
   * sequential `await` and Promise callback lowering).
   */
  kind: import_zod13.z.enum(["data", "dependency", "control"]).optional()
});
var WorkflowPromiseMode = import_zod13.z.enum([
  "all",
  "allSettled",
  "race",
  "any",
  "reject",
  "settled",
  "then",
  "catch",
  "finally"
]);
var WorkflowPromise = import_zod13.z.object({
  node: import_zod13.z.string(),
  mode: WorkflowPromiseMode
});
var WorkflowEvaluation = import_zod13.z.object({
  id: import_zod13.z.string().min(1),
  description: import_zod13.z.string().optional(),
  input: import_zod13.z.unknown().optional(),
  expect: import_zod13.z.object({
    status: import_zod13.z.enum(["ok", "error", "partial"]).default("ok"),
    /** Exact terminal outputs, keyed by terminal node id. Omit to check status only. */
    outputs: import_zod13.z.record(import_zod13.z.unknown()).optional()
  }),
  /** Optional workflow judge for semantic, safety, or agent-trajectory grading. */
  judge: import_zod13.z.object({
    workflow: import_zod13.z.string().min(1),
    rubric: import_zod13.z.string().min(1),
    threshold: import_zod13.z.number().min(0).max(1).default(0.7)
  }).optional()
});
var WorkflowTestWorkflow = import_zod13.z.object({
  path: import_zod13.z.string().min(1),
  runner: import_zod13.z.enum(["vitest", "jest", "playwright", "promptfoo"])
});
var WorkflowInputBinding = import_zod13.z.discriminatedUnion("kind", [
  import_zod13.z.object({ kind: import_zod13.z.literal("literal"), value: import_zod13.z.unknown() }),
  import_zod13.z.object({ kind: import_zod13.z.literal("symbol"), symbol: import_zod13.z.string(), value: import_zod13.z.unknown() })
]);
var WorkflowSource = import_zod13.z.object({
  path: import_zod13.z.string(),
  symbol: import_zod13.z.string(),
  kind: import_zod13.z.enum(["module", "function"]),
  checksum: import_zod13.z.string(),
  /** CODE-OWNED revisions of resolved project imports; relative to the project root. */
  dependencies: import_zod13.z.record(import_zod13.z.string(), import_zod13.z.string()).optional(),
  /** CODE-OWNED effective tsconfig/jsconfig and configuration content revision. */
  compilerChecksum: import_zod13.z.string().optional()
});
var Workflow = import_zod13.z.object({
  /** CODE-OWNED optional defaults from octonode.config.ts. */
  definitionPresentation: NodePresentation.optional(),
  /** CONFIG-OWNED display name; stable workflow IDs remain unchanged. */
  label: import_zod13.z.string().trim().min(1).max(200).optional(),
  /** CONFIG-OWNED catalog archive state. */
  archived: import_zod13.z.boolean().optional(),
  /** CONFIG-OWNED subscriptions, never executable DAG nodes. */
  triggers: WorkflowTriggers.optional(),
  id: import_zod13.z.string(),
  /** CODE-OWNED origin for a workflow projected from a normal source file. */
  source: WorkflowSource.optional(),
  /**
   * Workflow invocation contract. Source workflows project this from their
   * function parameters; canvas workflows derive it from their root node(s).
   */
  inputs: JsonSchema.optional(),
  description: import_zod13.z.string().optional(),
  entry: import_zod13.z.string().optional(),
  /** Explicit member nodes (canvas membership for not-yet-wired nodes). */
  nodes: import_zod13.z.array(import_zod13.z.string()).default([]),
  edges: import_zod13.z.array(WorkflowEdge).default([]),
  promises: import_zod13.z.array(WorkflowPromise).default([]),
  on_error: import_zod13.z.object({ policy: import_zod13.z.enum(["halt", "continue"]).default("halt") }).optional(),
  /** CONFIG-OWNED. Whether the workflow is enabled (e.g. for scheduling/triggers). */
  active: import_zod13.z.boolean().optional(),
  /** CONFIG-OWNED freeform labels. */
  tags: import_zod13.z.array(import_zod13.z.string()).optional(),
  /** CONFIG-OWNED folder path for organizing workflows, e.g. "math/daily". Absent → project root. */
  folder: import_zod13.z.string().optional(),
  /** CONFIG-OWNED evaluation cases, versioned and shared with this workflow. */
  evaluations: import_zod13.z.array(WorkflowEvaluation).default([]),
  /** CONFIG-OWNED repository tests relevant to this workflow. */
  test_workflows: import_zod13.z.array(WorkflowTestWorkflow).default([]),
  /** CONFIG-OWNED pinned outputs: node id -> a frozen outputs object used in place of execution. */
  pins: import_zod13.z.record(import_zod13.z.unknown()).optional(),
  /**
   * CONFIG-OWNED input expressions: node id -> (input key -> `{{ $json.field }}`
   * template). Evaluated against the node's assembled inputs at runtime and merged
   * over them before the node executes. See runtime/expression.ts.
   */
  expressions: import_zod13.z.record(import_zod13.z.record(import_zod13.z.string())).optional(),
  /** Static source/manual values applied to node inputs before expressions. */
  bindings: import_zod13.z.record(import_zod13.z.record(WorkflowInputBinding)).optional(),
  /**
   * CONFIG-OWNED opt-in to orchestration codegen (Plan B). When `orchestration`
   * is true, a runnable workflow-as-function file is generated at
   * `nodes/_workflows/<id>.js` and kept in sync; `checksum` is the machine-region
   * checksum, managed by the generator (used for hand-edit conflict detection).
   */
  codegen: import_zod13.z.object({ orchestration: import_zod13.z.boolean().optional(), checksum: import_zod13.z.string().optional() }).optional()
});
var WorkflowExecutionPlan = Workflow.pick({
  id: true,
  entry: true,
  nodes: true,
  edges: true,
  promises: true,
  bindings: true,
  expressions: true
}).strict().superRefine((plan, ctx) => {
  const members = new Set(plan.nodes);
  if (!members.size || members.size !== plan.nodes.length || plan.entry !== void 0 && !members.has(plan.entry) || plan.edges.some((edge) => !members.has(edge.from.node) || !members.has(edge.to.node)) || plan.promises.some((promise) => !members.has(promise.node)) || new Set(plan.promises.map((promise) => promise.node)).size !== plan.promises.length || [...Object.keys(plan.bindings ?? {}), ...Object.keys(plan.expressions ?? {})].some((id2) => !members.has(id2))) {
    ctx.addIssue({ code: import_zod13.z.ZodIssueCode.custom, message: "Execution plan has invalid or duplicate members" });
  }
});
var OctonodeConfig = import_zod13.z.object({
  apiVersion: import_zod13.z.string().default(CONFIG_API_VERSION),
  metadata: import_zod13.z.object({
    name: import_zod13.z.string(),
    id: import_zod13.z.string().min(1).max(240).optional(),
    version: import_zod13.z.string().optional(),
    description: import_zod13.z.string().optional()
  }),
  defaults: ProjectDefaults.optional(),
  attachments: ProjectAttachments.default({ plugins: [], variables: [], dataTables: [] }),
  /** Commands `octonode scan` probes (via `describe`) to discover nodes. */
  sources: import_zod13.z.array(import_zod13.z.string()).default([]),
  environments: import_zod13.z.record(Environment).default({}),
  nodes: import_zod13.z.array(NodeConfig).default([]),
  /** Shared type registry referenced by node signatures (Phase 3+). */
  types: import_zod13.z.record(JsonSchema).default({}),
  /** CONFIG-OWNED stable IDs of projects required by this project. Resolution is capability-gated. */
  projectDependencies: import_zod13.z.array(import_zod13.z.string().min(1).max(240)).max(1e3).optional(),
  workflows: import_zod13.z.array(Workflow).default([]),
  /** CODE-OWNED test projections, including the exact source used to compile cases and data. */
  test_workflows: import_zod13.z.array(TestWorkflowGraph.extend({ source: import_zod13.z.string() })).optional()
}).superRefine((config, ctx) => {
  config.workflows.forEach((workflow, index) => {
    const members = /* @__PURE__ */ new Set([
      ...workflow.nodes,
      ...workflow.entry ? [workflow.entry] : [],
      ...workflow.edges.flatMap((edge) => [edge.from.node, edge.to.node])
    ]);
    const result = WorkflowEntryNodes.safeParse(
      config.nodes.filter((node) => members.has(node.id)).map((node) => ({ id: node.id, icon: node.presentation?.icon, role: node.role }))
    );
    if (!result.success)
      ctx.addIssue({ code: "custom", path: ["workflows", index, "nodes"], message: result.error.issues[0].message });
  });
  const dependencies = config.projectDependencies ?? [];
  const seen = /* @__PURE__ */ new Set();
  dependencies.forEach((projectId2, index) => {
    if (seen.has(projectId2))
      ctx.addIssue({
        code: "custom",
        path: ["projectDependencies", index],
        message: "project dependencies must be unique"
      });
    if (config.metadata.id === projectId2)
      ctx.addIssue({
        code: "custom",
        path: ["projectDependencies", index],
        message: "a project cannot depend on itself"
      });
    seen.add(projectId2);
  });
});

// packages/schema/src/store.ts
var import_zod14 = require("zod");
var Scope = import_zod14.z.enum(["user", "group", "org", "public"]);
var Origin = import_zod14.z.enum(["local", "native", "plugin", "marketplace"]);
var Visibility = import_zod14.z.object({
  scope: Scope,
  owner: import_zod14.z.string(),
  editors: import_zod14.z.array(import_zod14.z.string()).optional(),
  groupId: import_zod14.z.string().optional(),
  orgId: import_zod14.z.string().optional()
});
var Identity = import_zod14.z.object({
  userId: import_zod14.z.string(),
  displayName: import_zod14.z.string().optional(),
  groups: import_zod14.z.array(import_zod14.z.string()).default([]),
  orgId: import_zod14.z.string()
});
var NodeRecord = NodeConfig.extend({
  origin: Origin,
  visibility: Visibility,
  createdAt: import_zod14.z.number(),
  updatedAt: import_zod14.z.number()
});
var WorkflowRecord = Workflow.extend({
  origin: Origin,
  visibility: Visibility,
  createdAt: import_zod14.z.number(),
  updatedAt: import_zod14.z.number()
});
var InstalledPlugin = import_zod14.z.object({
  id: import_zod14.z.string(),
  name: import_zod14.z.string(),
  version: import_zod14.z.string(),
  source: import_zod14.z.string(),
  nodes: import_zod14.z.array(import_zod14.z.object({ id: import_zod14.z.string(), description: import_zod14.z.string().optional() })).default([]),
  visibility: Visibility
});
var StoredRun = import_zod14.z.object({
  runId: import_zod14.z.string(),
  workflowId: import_zod14.z.string(),
  status: import_zod14.z.enum(["ok", "error", "partial"]),
  durationMs: import_zod14.z.number(),
  startedAt: import_zod14.z.number(),
  owner: import_zod14.z.string(),
  scope: Scope,
  /** The full core RunRecord, kept opaque here (validated by core on produce). */
  record: import_zod14.z.unknown()
});

// packages/schema/src/data/table.constants.ts
var DATA_TABLE_RESERVED_COLUMNS = [
  "_id",
  "_version",
  "_created_at",
  "_updated_at",
  "__proto__"
];
var DATA_TABLE_MAX_ROW_BYTES = 256 * 1024;
var DATA_TABLE_MAX_SQL_LENGTH = 16384;
var DATA_TABLE_MAX_COLUMNS = 64;

// packages/schema/src/data/tables.ts
var import_zod15 = require("zod");
var StorageMode = import_zod15.z.enum(["sqlite", "kv_blob"]);
var DataTableColumnType = import_zod15.z.enum(["text", "number", "boolean", "date", "datetime", "json"]);
var DataTableColumn = import_zod15.z.object({
  id: import_zod15.z.string(),
  key: import_zod15.z.string().min(1).regex(
    /^[A-Za-z_][A-Za-z0-9_]*$/,
    "column key must start with a letter or '_' and contain only letters, digits, or '_'"
  ).refine((key) => !DATA_TABLE_RESERVED_COLUMNS.includes(key.toLowerCase()), "reserved column name"),
  name: import_zod15.z.string().min(1),
  type: DataTableColumnType,
  required: import_zod15.z.boolean().default(false),
  defaultValue: import_zod15.z.unknown().optional(),
  position: import_zod15.z.number().int().nonnegative()
});
var DataTable = import_zod15.z.object({
  id: import_zod15.z.string(),
  projectId: import_zod15.z.string(),
  name: import_zod15.z.string().min(1),
  slug: import_zod15.z.string().min(1).regex(
    /^[A-Za-z0-9][A-Za-z0-9._-]*$/,
    "slug must start alphanumeric and contain only letters, digits, '.', '_' or '-'"
  ),
  description: import_zod15.z.string().optional(),
  storageMode: StorageMode.default("sqlite"),
  columns: import_zod15.z.array(DataTableColumn).default([]),
  rowCount: import_zod15.z.number().int().nonnegative().default(0),
  schemaVersion: import_zod15.z.number().int().positive().default(1),
  createdAt: import_zod15.z.number(),
  updatedAt: import_zod15.z.number()
});
var DataTableRow = import_zod15.z.object({
  id: import_zod15.z.string(),
  tableId: import_zod15.z.string(),
  data: import_zod15.z.record(import_zod15.z.string(), import_zod15.z.unknown()),
  version: import_zod15.z.number().int().positive().default(1),
  createdAt: import_zod15.z.number(),
  updatedAt: import_zod15.z.number()
});
var DataTableRowsPage = import_zod15.z.object({
  rows: import_zod15.z.array(DataTableRow),
  nextCursor: import_zod15.z.string().optional()
});
var inputColumns = import_zod15.z.array(DataTableColumn.omit({ id: true }).extend({ id: import_zod15.z.string().optional() })).max(DATA_TABLE_MAX_COLUMNS).refine(
  (columns) => new Set(columns.map(({ key }) => key.toLowerCase())).size === columns.length,
  "duplicate column name"
);
var CreateDataTableInput = import_zod15.z.object({
  name: import_zod15.z.string().min(1),
  slug: import_zod15.z.string().min(1).regex(
    /^[A-Za-z0-9][A-Za-z0-9._-]*$/,
    "slug must start alphanumeric and contain only letters, digits, '.', '_' or '-'"
  ).optional(),
  description: import_zod15.z.string().optional(),
  storageMode: StorageMode.default("sqlite"),
  columns: inputColumns.default([])
});
var UpdateDataTableInput = import_zod15.z.object({
  name: import_zod15.z.string().min(1).optional(),
  slug: import_zod15.z.string().min(1).regex(
    /^[A-Za-z0-9][A-Za-z0-9._-]*$/,
    "slug must start alphanumeric and contain only letters, digits, '.', '_' or '-'"
  ).optional(),
  description: import_zod15.z.string().nullable().optional(),
  columns: inputColumns.optional()
});
var ListRowsInput = import_zod15.z.object({
  cursor: import_zod15.z.string().optional(),
  limit: import_zod15.z.number().int().positive().max(500).default(50)
});
var InsertRowInput = import_zod15.z.object({
  data: import_zod15.z.record(import_zod15.z.string(), import_zod15.z.unknown())
});
var UpdateRowInput = import_zod15.z.object({
  data: import_zod15.z.record(import_zod15.z.string(), import_zod15.z.unknown()),
  expectedVersion: import_zod15.z.number().int().positive().optional()
});
var BulkRowMutation = import_zod15.z.discriminatedUnion("operation", [
  import_zod15.z.object({ operation: import_zod15.z.literal("insert"), data: import_zod15.z.record(import_zod15.z.string(), import_zod15.z.unknown()) }),
  import_zod15.z.object({
    operation: import_zod15.z.literal("update"),
    rowId: import_zod15.z.string().min(1),
    data: import_zod15.z.record(import_zod15.z.string(), import_zod15.z.unknown()),
    expectedVersion: import_zod15.z.number().int().positive().optional()
  }),
  import_zod15.z.object({ operation: import_zod15.z.literal("delete"), rowId: import_zod15.z.string().min(1) })
]);
var BulkRowsInput = import_zod15.z.object({
  mutations: import_zod15.z.array(BulkRowMutation).min(1).max(500)
});
var BulkRowsResult = import_zod15.z.object({
  rows: import_zod15.z.array(DataTableRow),
  deletedRowIds: import_zod15.z.array(import_zod15.z.string())
});
var ImportRowsInput = import_zod15.z.object({
  rows: import_zod15.z.array(import_zod15.z.record(import_zod15.z.string(), import_zod15.z.unknown())).min(1)
});
var ImportRowsResult = import_zod15.z.object({
  inserted: import_zod15.z.number().int().nonnegative()
});
var SqlQueryInput = import_zod15.z.object({
  sql: import_zod15.z.string().min(1).max(DATA_TABLE_MAX_SQL_LENGTH),
  params: import_zod15.z.array(import_zod15.z.unknown()).max(100).default([])
});
var SqlQueryResult = import_zod15.z.object({
  columns: import_zod15.z.array(import_zod15.z.string()),
  rows: import_zod15.z.array(import_zod15.z.array(import_zod15.z.unknown())),
  rowCount: import_zod15.z.number().int().nonnegative(),
  durationMs: import_zod15.z.number().nonnegative()
});
var ProjectRepoMetadata = import_zod15.z.object({
  provider: import_zod15.z.enum(["github", "gitlab", "bitbucket", "other"]).optional(),
  url: import_zod15.z.string().url(),
  owner: import_zod15.z.string().optional(),
  name: import_zod15.z.string().optional(),
  defaultBranch: import_zod15.z.string().optional()
});
var ProjectMetadata = import_zod15.z.object({
  id: import_zod15.z.string(),
  orgId: import_zod15.z.string(),
  ownerUserId: import_zod15.z.string(),
  name: import_zod15.z.string().min(1),
  slug: import_zod15.z.string().min(1).regex(
    /^[A-Za-z0-9][A-Za-z0-9._-]*$/,
    "slug must start alphanumeric and contain only letters, digits, '.', '_' or '-'"
  ),
  description: import_zod15.z.string().optional(),
  visibility: Visibility,
  repo: ProjectRepoMetadata.optional(),
  cloudflare: import_zod15.z.object({
    workerName: import_zod15.z.string().optional(),
    dataDoName: import_zod15.z.string()
  }).optional(),
  createdAt: import_zod15.z.number(),
  updatedAt: import_zod15.z.number()
});
var CreateProjectInput = import_zod15.z.object({
  id: import_zod15.z.string().uuid().optional(),
  name: import_zod15.z.string().min(1),
  slug: import_zod15.z.string().min(1).regex(
    /^[A-Za-z0-9][A-Za-z0-9._-]*$/,
    "slug must start alphanumeric and contain only letters, digits, '.', '_' or '-'"
  ).optional(),
  description: import_zod15.z.string().optional(),
  visibility: Visibility.pick({ scope: true, groupId: true, orgId: true }).optional(),
  repo: ProjectRepoMetadata.optional()
});
var UpdateProjectInput = import_zod15.z.object({
  name: import_zod15.z.string().min(1).optional(),
  slug: import_zod15.z.string().min(1).regex(
    /^[A-Za-z0-9][A-Za-z0-9._-]*$/,
    "slug must start alphanumeric and contain only letters, digits, '.', '_' or '-'"
  ).optional(),
  description: import_zod15.z.string().nullable().optional(),
  visibility: Visibility.pick({ scope: true, groupId: true, orgId: true }).optional(),
  repo: ProjectRepoMetadata.nullable().optional()
});

// packages/schema/src/data/table/schema.ts
var import_zod16 = require("zod");
var DataTableRelationshipInput = import_zod16.z.object({
  sourceTableId: import_zod16.z.string().min(1),
  sourceColumn: import_zod16.z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/),
  targetTableId: import_zod16.z.string().min(1),
  onDelete: import_zod16.z.enum(["restrict", "set_null"]).default("restrict")
}).strict();
var DataTableRelationship = DataTableRelationshipInput.extend({ id: import_zod16.z.string(), projectId: import_zod16.z.string() });
var DataTableViewFilter = import_zod16.z.object({
  column: import_zod16.z.string().min(1),
  operator: import_zod16.z.enum(["eq", "ne", "contains", "gt", "gte", "lt", "lte", "is_null", "not_null"]),
  value: import_zod16.z.union([import_zod16.z.string().max(2e3), import_zod16.z.number().finite(), import_zod16.z.boolean(), import_zod16.z.null()]).default(null)
}).strict();
var DataTableViewInput = import_zod16.z.object({
  name: import_zod16.z.string().trim().min(1).max(120),
  tableId: import_zod16.z.string().min(1),
  relationshipIds: import_zod16.z.array(import_zod16.z.string()).max(8).default([]),
  filters: import_zod16.z.array(DataTableViewFilter).max(20).default([]),
  sort: import_zod16.z.object({ column: import_zod16.z.string().min(1), direction: import_zod16.z.enum(["asc", "desc"]) }).strict().optional()
}).strict();
var DataTableView = DataTableViewInput.extend({
  id: import_zod16.z.string(),
  projectId: import_zod16.z.string(),
  revision: import_zod16.z.number().int().positive()
});
var DataTableViewUpdate = DataTableViewInput.extend({ revision: import_zod16.z.number().int().positive() });
var DataTableViewPageInput = import_zod16.z.object({
  offset: import_zod16.z.number().int().min(0).max(1e6).default(0),
  limit: import_zod16.z.number().int().min(1).max(200).default(50)
}).strict();
var DataTableViewPage = import_zod16.z.object({
  columns: import_zod16.z.array(import_zod16.z.string()),
  rows: import_zod16.z.array(import_zod16.z.record(import_zod16.z.string(), import_zod16.z.unknown())),
  total: import_zod16.z.number(),
  nextOffset: import_zod16.z.number().nullable()
});

// packages/schema/src/test/data.ts
var import_zod17 = require("zod");

// packages/schema/src/workflow/layout.ts
var import_zod18 = require("zod");
var Point = import_zod18.z.object({ x: import_zod18.z.number(), y: import_zod18.z.number() });
var Size = import_zod18.z.object({ width: import_zod18.z.number(), height: import_zod18.z.number() });
var StickyNoteLayout = import_zod18.z.object({
  id: import_zod18.z.string(),
  position: Point,
  size: Size,
  text: import_zod18.z.string(),
  color: import_zod18.z.string()
});
var GroupLayout = import_zod18.z.object({
  id: import_zod18.z.string(),
  position: Point,
  size: Size,
  label: import_zod18.z.string().optional(),
  /** Ids of the member nodes wrapped by this group. */
  nodeIds: import_zod18.z.array(import_zod18.z.string()).default([])
});
var WorkflowLayout = import_zod18.z.object({
  version: import_zod18.z.number().default(1),
  positions: import_zod18.z.record(import_zod18.z.string(), Point).default({}),
  stickyNotes: import_zod18.z.array(StickyNoteLayout).default([]),
  groups: import_zod18.z.array(GroupLayout).default([])
});

// packages/schema/src/collaboration.ts
var import_zod21 = require("zod");

// packages/schema/src/attachments/index.ts
var import_zod19 = require("zod");

// packages/schema/src/attachments/constants.ts
var ATTACHMENT_LIMITS = {
  workspaceFiles: 1e5,
  dailyReservations: 1e3,
  scanAttempts: 8,
  scanMs: 12e4,
  recoveryMs: 3e5,
  cleanupMs: 864e5,
  imageBytes: 10 * 1024 * 1024,
  fileBytes: 25 * 1024 * 1024,
  messageBytes: 50 * 1024 * 1024,
  messageFiles: 10,
  workspaceBytes: 1024 * 1024 * 1024,
  userUploads: 4,
  draftMs: 60 * 60 * 1e3,
  uploadMs: 5 * 60 * 1e3,
  processingBytes: 16 * 1024 * 1024,
  mediaBytes: 4 * 1024 * 1024,
  modelFiles: 10,
  modelImages: 10,
  modelPdfPages: 20,
  modelTextBytes: 64 * 1024,
  modelFileTextBytes: 32 * 1024,
  metadataBytes: 16 * 1024,
  textBytes: 128 * 1024,
  pdfPages: 100,
  imagePixels: 4e7
};
var ATTACHMENT_STATES = [
  "reserved",
  "uploading",
  "scanning",
  "ready",
  "attached",
  "rejected",
  "expired",
  "deleted"
];
var ATTACHMENT_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/json",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];
var ATTACHMENT_ERRORS = [
  "unsupported_type",
  "too_large",
  "quota_exceeded",
  "upload_expired",
  "scan_unavailable",
  "unsafe_file",
  "invalid_file",
  "processing_failed",
  "model_incompatible"
];

// packages/schema/src/attachments/index.ts
var attachmentDomainSchema = import_zod19.z.enum(["chat", "assistant", "support"]);
var attachmentMimeSchema = import_zod19.z.enum(ATTACHMENT_MIME_TYPES);
var attachmentIdListSchema = import_zod19.z.array(import_zod19.z.string().uuid()).max(ATTACHMENT_LIMITS.messageFiles).refine((ids) => new Set(ids).size === ids.length, "Attachment IDs must be unique");
var attachmentUploadSchema = import_zod19.z.object({
  name: import_zod19.z.string().trim().min(1).max(240).refine(
    (name) => !Array.from(name).some(
      (char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127 || char === "/" || char === "\\"
    ),
    "Invalid filename"
  ),
  mime: attachmentMimeSchema,
  size: import_zod19.z.number().int().positive().max(ATTACHMENT_LIMITS.fileBytes)
}).strict().refine(
  ({ name }) => !/\.(?:html?|svg|exe|dll|bat|cmd|scr|com|msi|zip|rar|7z|xlsm|docm|pptm)$/i.test(name),
  "Unsupported filename extension"
).refine(
  ({ mime, size }) => !mime.startsWith("image/") || size <= ATTACHMENT_LIMITS.imageBytes,
  "Image exceeds size limit"
);
var attachmentSummarySchema = import_zod19.z.object({
  id: import_zod19.z.string().uuid(),
  conversationId: import_zod19.z.string().uuid(),
  domain: attachmentDomainSchema,
  name: import_zod19.z.string().min(1).max(240),
  mime: attachmentMimeSchema,
  size: import_zod19.z.number().int().nonnegative(),
  state: import_zod19.z.enum(ATTACHMENT_STATES),
  version: import_zod19.z.number().int().positive(),
  createdAt: import_zod19.z.number().int().nonnegative(),
  expiresAt: import_zod19.z.number().int().nonnegative(),
  errorCode: import_zod19.z.enum(ATTACHMENT_ERRORS).nullable(),
  width: import_zod19.z.number().int().positive().nullable(),
  height: import_zod19.z.number().int().positive().nullable(),
  pages: import_zod19.z.number().int().positive().nullable(),
  previews: import_zod19.z.array(import_zod19.z.enum(["thumbnail", "image", "text", "pdf"])),
  messageId: import_zod19.z.string().uuid().nullable()
}).strict();
var attachmentManifestSchema = import_zod19.z.object({
  id: import_zod19.z.string().uuid(),
  name: import_zod19.z.string().max(240),
  mime: attachmentMimeSchema,
  size: import_zod19.z.number().int().positive().max(ATTACHMENT_LIMITS.fileBytes),
  sha256: import_zod19.z.string().regex(/^[a-f0-9]{64}$/),
  pages: import_zod19.z.array(import_zod19.z.number().int().positive()).max(ATTACHMENT_LIMITS.pdfPages).optional()
}).strict();
var attachmentDerivativeSchema = import_zod19.z.object({
  kind: import_zod19.z.enum(["thumbnail", "image", "text", "pdf"]),
  key: import_zod19.z.string().min(1).max(1024),
  sha256: import_zod19.z.string().regex(/^[a-f0-9]{64}$/),
  size: import_zod19.z.number().int().nonnegative().max(ATTACHMENT_LIMITS.fileBytes),
  mime: import_zod19.z.string().max(128)
}).strict();
var attachmentStoredSchema = import_zod19.z.object({
  summary: attachmentSummarySchema,
  uploaderId: import_zod19.z.string().min(1).max(128),
  attemptId: import_zod19.z.string().uuid().nullable(),
  objectKey: import_zod19.z.string().max(1024).nullable(),
  sha256: import_zod19.z.string().regex(/^[a-f0-9]{64}$/).nullable(),
  derivatives: import_zod19.z.array(attachmentDerivativeSchema).max(4)
}).strict();
var attachmentPageSchema = import_zod19.z.object({
  items: import_zod19.z.array(attachmentSummarySchema),
  nextCursor: import_zod19.z.string().nullable()
});
var attachmentProcessingSchema = import_zod19.z.object({
  mime: attachmentMimeSchema,
  sha256: import_zod19.z.string().regex(/^[a-f0-9]{64}$/),
  width: import_zod19.z.number().int().positive().max(4e4).nullable(),
  height: import_zod19.z.number().int().positive().max(4e4).nullable(),
  pages: import_zod19.z.number().int().positive().max(ATTACHMENT_LIMITS.pdfPages).nullable(),
  scannerVersion: import_zod19.z.string().min(1).max(128),
  derivatives: import_zod19.z.array(
    import_zod19.z.object({
      kind: import_zod19.z.enum(["thumbnail", "image", "text", "pdf"]),
      mime: import_zod19.z.string().max(128),
      data: import_zod19.z.string().max(24 * 1024 * 1024)
    }).strict()
  ).max(4)
}).strict();
var attachmentPdfPreviewSchema = import_zod19.z.object({
  totalPages: import_zod19.z.number().int().positive().max(1e4),
  pages: import_zod19.z.array(
    import_zod19.z.object({
      page: import_zod19.z.number().int().positive(),
      data: import_zod19.z.string().regex(/^[A-Za-z0-9+/]*={0,2}$/).max(2 * 1024 * 1024)
    }).strict()
  ).min(1).max(100)
}).strict();
var attachmentModelBlockSchema = import_zod19.z.discriminatedUnion("type", [
  import_zod19.z.object({ type: import_zod19.z.literal("text"), text: import_zod19.z.string().max(ATTACHMENT_LIMITS.textBytes + 1024) }).strict(),
  import_zod19.z.object({
    type: import_zod19.z.literal("image"),
    mime: import_zod19.z.enum(["image/jpeg", "image/png", "image/webp"]),
    data: import_zod19.z.string().max(24 * 1024 * 1024)
  }).strict(),
  import_zod19.z.object({
    type: import_zod19.z.literal("document"),
    mime: import_zod19.z.literal("application/pdf"),
    data: import_zod19.z.string().max(24 * 1024 * 1024),
    name: import_zod19.z.string().max(240),
    textBytes: import_zod19.z.number().int().nonnegative().max(ATTACHMENT_LIMITS.modelFileTextBytes).optional()
  }).strict()
]);
var attachmentModelMessagesSchema = import_zod19.z.array(
  import_zod19.z.object({
    messageId: import_zod19.z.string().uuid(),
    blocks: import_zod19.z.array(attachmentModelBlockSchema).max(ATTACHMENT_LIMITS.messageFiles * (ATTACHMENT_LIMITS.pdfPages * 2 + 2))
  }).strict()
).max(100);
var attachmentPolicySchema = import_zod19.z.object({
  uploadsEnabled: import_zod19.z.boolean(),
  modelInputEnabled: import_zod19.z.boolean(),
  types: import_zod19.z.array(attachmentMimeSchema),
  limits: import_zod19.z.object({
    imageBytes: import_zod19.z.number().int().positive(),
    fileBytes: import_zod19.z.number().int().positive(),
    messageBytes: import_zod19.z.number().int().positive(),
    messageFiles: import_zod19.z.number().int().positive(),
    pdfPages: import_zod19.z.number().int().positive(),
    modelFiles: import_zod19.z.number().int().positive(),
    modelImages: import_zod19.z.number().int().positive(),
    modelPdfPages: import_zod19.z.number().int().positive(),
    modelEncodedBytes: import_zod19.z.number().int().positive(),
    modelTextBytes: import_zod19.z.number().int().positive(),
    modelFileTextBytes: import_zod19.z.number().int().positive()
  }).strict()
}).strict();

// packages/schema/src/assistant/models/models.ts
var import_zod20 = require("zod");
var assistantEndpointSchema = import_zod20.z.string().trim().url().max(2048).refine((value) => {
  if (!URL.canParse(value)) return false;
  const url = new URL(value);
  const host = url.hostname.toLowerCase();
  return url.protocol === "https:" && !url.username && !url.password && !url.hash && !url.search && (!url.port || url.port === "443") && host.includes(".") && !/^[\d.]+$/.test(host) && !host.includes(":") && !/(?:^|\.)(?:localhost|local|internal|test|invalid)$/.test(host);
}, "Use a public HTTPS endpoint without credentials, query parameters, or fragments");
var assistantVariableSchema = import_zod20.z.string().regex(/^[A-Za-z_][A-Za-z0-9_]{0,127}$/);
var modelId = import_zod20.z.string().trim().min(1).max(128).regex(/^[A-Za-z0-9@][A-Za-z0-9._:/@-]*$/);
var assistantModelSchema = import_zod20.z.discriminatedUnion("provider", [
  import_zod20.z.object({ provider: import_zod20.z.literal("octonode"), model: import_zod20.z.literal("auto") }).strict(),
  import_zod20.z.object({
    provider: import_zod20.z.literal("anthropic"),
    model: modelId.refine(
      (id2) => /^(?:sonnet|opus|haiku|claude-[a-z0-9.-]+)$/.test(id2),
      "Choose a Claude model or alias"
    ),
    variable: assistantVariableSchema
  }).strict(),
  import_zod20.z.object({ provider: import_zod20.z.literal("openai"), model: modelId, variable: assistantVariableSchema }).strict(),
  import_zod20.z.object({ provider: import_zod20.z.literal("google"), model: modelId, variable: assistantVariableSchema }).strict(),
  import_zod20.z.object({ provider: import_zod20.z.literal("workers-ai"), model: modelId }).strict(),
  import_zod20.z.object({
    provider: import_zod20.z.literal("custom"),
    model: modelId,
    variable: assistantVariableSchema,
    url: assistantEndpointSchema
  }).strict()
]);

// packages/schema/src/collaboration.ts
var workspaceKindSchema = import_zod21.z.enum(["user", "org", "team"]);
var workspaceRefSchema = import_zod21.z.object({
  kind: workspaceKindSchema,
  id: import_zod21.z.string().min(1).max(128)
}).strict();
var collaborationActionSchema = import_zod21.z.enum(COLLABORATION_ACTIONS);
var agentScopeSchema = import_zod21.z.enum(WORKSPACE_ACTIONS);
var principalSchema = import_zod21.z.discriminatedUnion("kind", [
  import_zod21.z.object({ kind: import_zod21.z.literal("user"), userId: import_zod21.z.string().min(1).max(128) }).strict(),
  import_zod21.z.object({
    kind: import_zod21.z.literal("agent"),
    agentId: import_zod21.z.string().uuid(),
    workspace: workspaceRefSchema,
    projectId: import_zod21.z.string().min(1).max(128).nullable(),
    scopes: import_zod21.z.array(agentScopeSchema).max(WORKSPACE_ACTIONS.length)
  }).strict()
]);
var opaqueCursorSchema = import_zod21.z.string().min(2).max(512).regex(/^[A-Za-z0-9_-]+$/);
var idempotencyKeySchema = import_zod21.z.string().min(1).max(128);
var entityIdSchema = import_zod21.z.string().uuid();
var gitShaSchema = import_zod21.z.string().regex(/^[a-f0-9]{40}$/i);
var sha256Schema = import_zod21.z.string().regex(/^[a-f0-9]{64}$/i);
var revisionSchema = import_zod21.z.number().int().positive();
var pageSchema = (item) => import_zod21.z.object({
  items: import_zod21.z.array(item),
  nextCursor: opaqueCursorSchema.nullable()
}).strict();
var profileSchema = import_zod21.z.object({
  userId: import_zod21.z.string().min(1).max(128),
  displayName: import_zod21.z.string().max(80).nullable(),
  title: import_zod21.z.string().max(120).nullable(),
  bio: import_zod21.z.string().max(280).nullable(),
  avatarUrl: import_zod21.z.string().max(2048).nullable(),
  profileVersion: revisionSchema
}).strict();
var profileUpdateSchema = import_zod21.z.object({
  displayName: import_zod21.z.string().trim().min(1).max(80).nullable().optional(),
  title: import_zod21.z.string().trim().max(120).nullable().optional(),
  bio: import_zod21.z.string().trim().max(280).nullable().optional(),
  expectedVersion: revisionSchema
}).strict();
var workspaceAgentSchema = import_zod21.z.object({
  id: entityIdSchema,
  name: import_zod21.z.string().min(1).max(80),
  tokenPrefix: import_zod21.z.string().min(4).max(32),
  scopes: import_zod21.z.array(agentScopeSchema).max(WORKSPACE_ACTIONS.length),
  projectId: import_zod21.z.string().max(128).nullable(),
  createdAt: import_zod21.z.number().int().nonnegative(),
  expiresAt: import_zod21.z.number().int().positive().nullable(),
  lastUsedAt: import_zod21.z.number().int().positive().nullable(),
  revokedAt: import_zod21.z.number().int().positive().nullable()
}).strict();
var workspaceAgentCreateSchema = import_zod21.z.object({
  name: import_zod21.z.string().trim().min(1).max(80),
  scopes: import_zod21.z.array(agentScopeSchema).min(1).max(WORKSPACE_ACTIONS.length),
  projectId: import_zod21.z.string().min(1).max(128).nullable().optional(),
  expiresAt: import_zod21.z.number().int().positive().nullable().optional()
}).strict();
var workspaceAgentListQuerySchema = import_zod21.z.object({ projectId: import_zod21.z.string().min(1).max(128).optional() });
var conversationKindSchema = import_zod21.z.enum(["workspace", "group", "direct", "assistant"]);
var conversationSchema = import_zod21.z.object({
  id: entityIdSchema,
  kind: conversationKindSchema,
  name: import_zod21.z.string().max(80).nullable(),
  version: revisionSchema,
  createdAt: import_zod21.z.number().int().nonnegative(),
  updatedAt: import_zod21.z.number().int().nonnegative(),
  archivedAt: import_zod21.z.number().int().positive().nullable(),
  lastMessageSeq: import_zod21.z.number().int().nonnegative().nullable(),
  lastMessageAt: import_zod21.z.number().int().nonnegative().nullable(),
  unreadCount: import_zod21.z.number().int().nonnegative(),
  projectIds: import_zod21.z.array(import_zod21.z.string().min(1).max(128)).max(100).optional(),
  sessionScope: import_zod21.z.enum(["workspace", "project", "workflow"]).optional()
}).strict();
var conversationCreateSchema = import_zod21.z.object({
  kind: import_zod21.z.enum(["group", "direct"]),
  name: import_zod21.z.string().trim().min(1).max(80).optional(),
  memberIds: import_zod21.z.array(import_zod21.z.string().min(1).max(128)).min(1).max(100),
  clientMutationId: idempotencyKeySchema
}).strict().superRefine((value, ctx) => {
  if (value.kind === "direct" && value.memberIds.length !== 1) {
    ctx.addIssue({ code: import_zod21.z.ZodIssueCode.custom, message: "direct conversations require one other member" });
  }
  if (value.kind === "group" && !value.name) {
    ctx.addIssue({ code: import_zod21.z.ZodIssueCode.custom, message: "group conversations require a name" });
  }
});
var assistantSessionCreateSchema = import_zod21.z.object({
  scope: import_zod21.z.enum(["workspace", "project", "workflow"]).optional(),
  projectId: import_zod21.z.string().trim().min(1).max(128),
  projectIds: import_zod21.z.array(import_zod21.z.string().trim().min(1).max(128)).min(1).max(100).refine((ids) => new Set(ids).size === ids.length, "projectIds must be unique").optional(),
  name: import_zod21.z.string().trim().min(1).max(80).optional(),
  worktreeId: import_zod21.z.string().uuid().optional(),
  mode: import_zod21.z.enum(["full", "quick"]).optional(),
  model: assistantModelSchema.optional(),
  clientMutationId: idempotencyKeySchema
}).strict().refine(
  ({ projectId: projectId2, projectIds, worktreeId }) => (!projectIds || projectIds[0] === projectId2) && (!worktreeId || !projectIds || projectIds.length === 1),
  "projectId must be first and checkout sessions require one project"
);
var assistantSessionSortSchema = import_zod21.z.enum(["activity", "created", "name"]);
var assistantSessionOrderSchema = import_zod21.z.enum(["asc", "desc"]);
var assistantSessionListQuerySchema = import_zod21.z.object({
  id: import_zod21.z.string().uuid().optional(),
  scope: import_zod21.z.enum(["workspace", "project"]).optional(),
  q: import_zod21.z.string().trim().min(1).max(80).optional(),
  projectIds: import_zod21.z.array(import_zod21.z.string().trim().min(1).max(128)).min(1).max(100).refine((ids) => new Set(ids).size === ids.length, "projectIds must be unique").optional(),
  sort: assistantSessionSortSchema.default("activity"),
  order: assistantSessionOrderSchema.default("desc"),
  cursor: opaqueCursorSchema.optional(),
  limit: import_zod21.z.number().int().min(1).max(100).default(50)
}).strict();
var messageSchema = import_zod21.z.object({
  seq: import_zod21.z.number().int().positive(),
  id: entityIdSchema,
  conversationId: entityIdSchema,
  authorKind: import_zod21.z.enum(["user", "agent"]),
  authorId: import_zod21.z.string().min(1).max(128),
  authorLabel: import_zod21.z.string().max(120).nullable(),
  origin: import_zod21.z.enum(["octonode", "slack"]),
  replyToId: entityIdSchema.nullable(),
  body: import_zod21.z.string().max(16384),
  attachments: import_zod21.z.array(attachmentSummarySchema).max(10).optional(),
  version: revisionSchema,
  createdAt: import_zod21.z.number().int().nonnegative(),
  editedAt: import_zod21.z.number().int().positive().nullable(),
  deletedAt: import_zod21.z.number().int().positive().nullable(),
  reactions: import_zod21.z.record(import_zod21.z.string(), import_zod21.z.number().int().positive()),
  viewerReactions: import_zod21.z.array(import_zod21.z.string().max(32)).max(100)
}).strict();
var messageRealtimeCreateSchema = import_zod21.z.object({
  type: import_zod21.z.literal("message.created"),
  id: entityIdSchema,
  conversationId: entityIdSchema,
  previousMessageSeq: import_zod21.z.number().int().positive().nullable(),
  message: messageSchema
}).strict().refine(
  ({ id: id2, conversationId, message }) => id2 === message.id && conversationId === message.conversationId && message.version === 1 && !message.editedAt && !message.deletedAt && !Object.keys(message.reactions).length && !message.viewerReactions.length,
  "Created message must be an unmodified, viewer-independent message"
);
var messageCreateSchema = import_zod21.z.object({
  body: import_zod21.z.string().max(16384),
  attachmentIds: attachmentIdListSchema.optional(),
  replyToId: entityIdSchema.nullable().optional(),
  clientMutationId: idempotencyKeySchema
}).strict().refine(
  ({ body, attachmentIds }) => !!body.trim() || !!attachmentIds?.length,
  "Message requires text or attachments"
);
var messageUpdateSchema = import_zod21.z.object({
  body: import_zod21.z.string().max(16384),
  attachmentIds: attachmentIdListSchema.optional(),
  expectedVersion: revisionSchema
}).strict();
var pullRequestStateSchema = import_zod21.z.enum(["open", "closed", "merged"]);
var reviewContextSchema = import_zod21.z.object({
  id: entityIdSchema,
  projectId: import_zod21.z.string().min(1).max(128),
  repositoryId: import_zod21.z.number().int().positive(),
  pullNumber: import_zod21.z.number().int().positive(),
  baseRef: import_zod21.z.string().min(1).max(255),
  baseSha: gitShaSchema,
  headRef: import_zod21.z.string().min(1).max(255),
  headSha: gitShaSchema,
  state: pullRequestStateSchema,
  createdAt: import_zod21.z.number().int().nonnegative()
}).strict();
var reviewFragmentSchema = import_zod21.z.object({
  filePath: import_zod21.z.string().min(1).max(1024),
  startLine: import_zod21.z.number().int().positive().nullable(),
  startSide: import_zod21.z.enum(["LEFT", "RIGHT"]).nullable(),
  endLine: import_zod21.z.number().int().positive(),
  endSide: import_zod21.z.enum(["LEFT", "RIGHT"])
}).strict();
var reviewAnchorSchema = import_zod21.z.object({
  publication: import_zod21.z.enum(["inline", "fragments", "file", "summary", "unavailable"]),
  state: import_zod21.z.enum(["current", "outdated", "unmapped"]),
  filePath: import_zod21.z.string().max(1024).nullable(),
  commitSha: gitShaSchema,
  blobSha: import_zod21.z.string().max(64).nullable(),
  startLine: import_zod21.z.number().int().positive().nullable(),
  startSide: import_zod21.z.enum(["LEFT", "RIGHT"]).nullable(),
  endLine: import_zod21.z.number().int().positive().nullable(),
  endSide: import_zod21.z.enum(["LEFT", "RIGHT"]).nullable(),
  fragments: import_zod21.z.array(reviewFragmentSchema).min(2).max(100).optional()
}).strict();
var reviewThreadSchema = import_zod21.z.object({
  id: entityIdSchema,
  contextId: entityIdSchema,
  workflowId: import_zod21.z.string().max(200).nullable(),
  scope: import_zod21.z.enum(["pull_request", "workflow", "nodes", "code"]),
  nodeIds: import_zod21.z.array(import_zod21.z.string().min(1).max(200)).max(100),
  anchor: reviewAnchorSchema,
  status: import_zod21.z.enum(["open", "resolved"]),
  version: revisionSchema,
  createdAt: import_zod21.z.number().int().nonnegative(),
  updatedAt: import_zod21.z.number().int().nonnegative()
}).strict();
var reviewThreadCreateSchema = import_zod21.z.object({
  context: reviewContextSchema.omit({ id: true, createdAt: true }),
  workflowId: import_zod21.z.string().min(1).max(200).nullable(),
  scope: import_zod21.z.enum(["pull_request", "workflow", "nodes", "code"]),
  nodeIds: import_zod21.z.array(import_zod21.z.string().min(1).max(200)).max(100),
  anchor: reviewAnchorSchema,
  body: import_zod21.z.string().min(1).max(32768),
  clientMutationId: idempotencyKeySchema
}).strict();
var reviewCommentSchema = import_zod21.z.object({
  seq: import_zod21.z.number().int().positive(),
  id: entityIdSchema,
  threadId: entityIdSchema,
  authorKind: import_zod21.z.enum(["user", "agent", "github"]),
  authorId: import_zod21.z.string().min(1).max(128),
  authorLabel: import_zod21.z.string().max(120).nullable(),
  authorAvatarUrl: import_zod21.z.string().max(2048).nullable(),
  origin: import_zod21.z.enum(["octonode", "github"]),
  body: import_zod21.z.string().max(32768),
  version: revisionSchema,
  createdAt: import_zod21.z.number().int().nonnegative(),
  editedAt: import_zod21.z.number().int().positive().nullable(),
  deletedAt: import_zod21.z.number().int().positive().nullable(),
  githubState: import_zod21.z.enum(["unpublished", "queued", "published", "failed", "deleted"]),
  suggestion: import_zod21.z.lazy(() => reviewSuggestionSchema).nullable()
}).strict();
var workflowSuggestionPayloadSchema = import_zod21.z.object({
  completeDraft: import_zod21.z.record(import_zod21.z.unknown())
}).strict();
var sourceSuggestionPayloadSchema = import_zod21.z.object({
  path: import_zod21.z.string().min(1).max(1024),
  startByte: import_zod21.z.number().int().nonnegative(),
  endByte: import_zod21.z.number().int().nonnegative(),
  selectedSha256: sha256Schema,
  replacement: import_zod21.z.string().max(524288),
  baseBlobSha: import_zod21.z.string().min(1).max(64)
}).strict().refine((value) => value.endByte >= value.startByte, "endByte must not precede startByte");
var suggestionCreateSchema = import_zod21.z.discriminatedUnion("kind", [
  import_zod21.z.object({
    kind: import_zod21.z.literal("workflow_draft"),
    baseHeadSha: gitShaSchema,
    baseRevision: import_zod21.z.string().min(1).max(128),
    payload: workflowSuggestionPayloadSchema,
    clientMutationId: idempotencyKeySchema
  }).strict(),
  import_zod21.z.object({
    kind: import_zod21.z.literal("source_patch"),
    baseHeadSha: gitShaSchema,
    baseRevision: import_zod21.z.string().min(1).max(128),
    payload: sourceSuggestionPayloadSchema,
    clientMutationId: idempotencyKeySchema
  }).strict()
]);
var reviewSuggestionSchema = import_zod21.z.object({
  id: entityIdSchema,
  commentId: entityIdSchema,
  kind: import_zod21.z.enum(["workflow_draft", "source_patch"]),
  baseHeadSha: gitShaSchema,
  baseRevision: import_zod21.z.string().min(1).max(128),
  payload: import_zod21.z.record(import_zod21.z.unknown()),
  prepared: import_zod21.z.record(import_zod21.z.unknown()).nullable(),
  validation: import_zod21.z.record(import_zod21.z.unknown()).nullable(),
  status: import_zod21.z.enum(["open", "applying", "applied", "rejected", "outdated", "failed"]),
  version: revisionSchema,
  createdAt: import_zod21.z.number().int().nonnegative(),
  appliedCommitSha: gitShaSchema.nullable()
}).strict();
var notificationSchema = import_zod21.z.object({
  seq: import_zod21.z.number().int().positive(),
  id: entityIdSchema,
  kind: import_zod21.z.enum(["message", "review_reply", "suggestion", "github_sync", "task"]),
  actorKind: import_zod21.z.enum(["user", "agent", "github"]),
  actorId: import_zod21.z.string().min(1).max(128),
  entityType: import_zod21.z.string().min(1).max(64),
  entityId: import_zod21.z.string().min(1).max(128),
  payload: import_zod21.z.record(import_zod21.z.unknown()),
  createdAt: import_zod21.z.number().int().nonnegative(),
  readAt: import_zod21.z.number().int().positive().nullable()
}).strict();
var githubPublicationStateSchema = import_zod21.z.enum(["queued", "processing", "published", "failed", "deleted"]);
var realtimeInvalidationSchema = import_zod21.z.object({
  type: import_zod21.z.enum([
    "message.created",
    "message.updated",
    "conversation.updated",
    "notification.created",
    "review.updated",
    "design.updated",
    "github.updated",
    "presence",
    "typing",
    "task.space.updated",
    "task.item.updated",
    "task.comment.updated"
  ]),
  id: import_zod21.z.string().min(1).max(128).optional(),
  conversationId: entityIdSchema.optional(),
  threadId: entityIdSchema.optional(),
  entityType: import_zod21.z.enum(["plugin_install", "project_job"]).optional(),
  userId: import_zod21.z.string().min(1).max(128).optional(),
  state: import_zod21.z.enum(["online", "offline"]).optional()
}).strict();
var collaborationErrorSchema = import_zod21.z.object({
  error: import_zod21.z.string(),
  code: import_zod21.z.enum(["forbidden", "conflict", "too_large", "unmappable", "rate_limited", "maintenance", "unavailable"]).optional(),
  retryAfter: import_zod21.z.number().int().positive().optional(),
  currentVersion: revisionSchema.optional(),
  currentHeadSha: gitShaSchema.optional()
}).strict();

// packages/schema/src/support/constants.ts
var PLATFORM_SCOPES = ["app-support"];
var SUPPORT_ISSUE_TYPES = [
  "app_not_working",
  "bug_report",
  "payment_issue",
  "account_access",
  "how_to",
  "other"
];
var SUPPORT_STATUSES = ["queued", "open", "waiting_customer", "waiting_internal", "closed"];
var SUPPORT_QUEUES = [
  "active",
  "unassigned",
  "mine",
  "needs_response",
  "overdue",
  "waiting",
  "closed",
  "all"
];

// packages/schema/src/support/schema.ts
var import_zod22 = require("zod");
var platformScopeSchema = import_zod22.z.enum(PLATFORM_SCOPES);
var supportIssueTypeSchema = import_zod22.z.enum(SUPPORT_ISSUE_TYPES);
var supportStatusSchema = import_zod22.z.enum(SUPPORT_STATUSES);
var supportMutationSchema = import_zod22.z.object({ clientMutationId: import_zod22.z.string().uuid(), expectedVersion: import_zod22.z.number().int().positive() }).strict();
var supportCreateSchema = import_zod22.z.object({
  clientMutationId: import_zod22.z.string().uuid(),
  issueType: supportIssueTypeSchema,
  subject: import_zod22.z.string().trim().min(1).max(200),
  description: import_zod22.z.string().trim().min(1).max(16384),
  intakeId: import_zod22.z.string().uuid().optional(),
  attachmentIds: attachmentIdListSchema.optional(),
  source: import_zod22.z.enum(["studio", "landing"]).default("studio"),
  followUpOfTicketId: import_zod22.z.string().uuid().optional()
}).strict();
var supportReplySchema = supportMutationSchema.extend({
  body: import_zod22.z.string().trim().max(16384),
  attachmentIds: attachmentIdListSchema.optional()
});
var supportTransferSchema = supportMutationSchema.extend({
  assigneeId: import_zod22.z.string().uuid(),
  reason: import_zod22.z.string().trim().min(1).max(2e3)
});
var supportCloseSchema = supportMutationSchema.extend({ summary: import_zod22.z.string().trim().min(1).max(4e3) });
var supportStateSchema = supportMutationSchema.extend({
  status: import_zod22.z.enum(["open", "waiting_customer", "waiting_internal"])
});
var supportTakeSchema = supportMutationSchema.extend({
  reason: import_zod22.z.string().trim().min(1).max(2e3).optional()
});
var supportNoteSchema = supportMutationSchema.extend({ body: import_zod22.z.string().trim().min(1).max(16384) });
var supportListQuerySchema = import_zod22.z.object({
  view: import_zod22.z.enum(SUPPORT_QUEUES).default("active"),
  cursor: import_zod22.z.string().max(2048).optional(),
  issueType: supportIssueTypeSchema.optional(),
  assigneeId: import_zod22.z.string().uuid().optional(),
  priority: import_zod22.z.enum(["low", "normal", "high", "urgent"]).optional(),
  tag: import_zod22.z.string().trim().min(1).max(40).optional(),
  sort: import_zod22.z.enum(["recent", "oldest"]).optional(),
  limit: import_zod22.z.coerce.number().int().min(1).max(100).default(50),
  q: import_zod22.z.string().trim().max(200).default("")
});
var supportTicketSchema = import_zod22.z.object({
  id: import_zod22.z.string().uuid(),
  number: import_zod22.z.number().int().positive(),
  conversationId: import_zod22.z.string().uuid(),
  requesterId: import_zod22.z.string().uuid(),
  issueType: supportIssueTypeSchema,
  subject: import_zod22.z.string(),
  status: supportStatusSchema,
  source: import_zod22.z.enum(["studio", "landing"]),
  assigneeId: import_zod22.z.string().uuid().nullable(),
  acceptedBy: import_zod22.z.string().uuid().nullable(),
  acceptedAt: import_zod22.z.number().nullable(),
  closedBy: import_zod22.z.string().uuid().nullable(),
  closedAt: import_zod22.z.number().nullable(),
  closeSummary: import_zod22.z.string().nullable(),
  followUpOfTicketId: import_zod22.z.string().uuid().nullable(),
  version: import_zod22.z.number().int().positive(),
  createdAt: import_zod22.z.number(),
  updatedAt: import_zod22.z.number(),
  firstResponseAt: import_zod22.z.number().nullable(),
  lastMessageAt: import_zod22.z.number(),
  unread: import_zod22.z.number().int().nonnegative()
});
var supportTicketPageSchema = import_zod22.z.object({
  items: supportTicketSchema.array(),
  nextCursor: import_zod22.z.string().nullable()
});
var supportMessagePageSchema = import_zod22.z.object({ items: messageSchema.array(), nextCursor: import_zod22.z.string().nullable() });
var supportActivitySchema = import_zod22.z.object({
  id: import_zod22.z.string().uuid(),
  seq: import_zod22.z.number(),
  ticketId: import_zod22.z.string().uuid(),
  actorId: import_zod22.z.string().uuid(),
  kind: import_zod22.z.string(),
  previousAssigneeId: import_zod22.z.string().uuid().nullable(),
  assigneeId: import_zod22.z.string().uuid().nullable(),
  reason: import_zod22.z.string().nullable(),
  status: supportStatusSchema,
  version: import_zod22.z.number(),
  createdAt: import_zod22.z.number()
});
var supportNoteViewSchema = import_zod22.z.object({
  id: import_zod22.z.string().uuid(),
  seq: import_zod22.z.number(),
  actorId: import_zod22.z.string().uuid(),
  body: import_zod22.z.string(),
  createdAt: import_zod22.z.number()
});
var supportAgentSchema = import_zod22.z.object({
  automatic: import_zod22.z.boolean().optional(),
  userId: import_zod22.z.string().uuid(),
  email: import_zod22.z.string().nullable(),
  version: import_zod22.z.number(),
  grantedAt: import_zod22.z.number(),
  grantedBy: import_zod22.z.string().uuid()
});
var supportGrantSchema = import_zod22.z.object({
  enabled: import_zod22.z.boolean(),
  expectedVersion: import_zod22.z.number().int().nonnegative(),
  reason: import_zod22.z.string().trim().min(1).max(2e3),
  clientMutationId: import_zod22.z.string().uuid()
}).strict();
var supportAccessSchema = import_zod22.z.object({
  uploads: import_zod22.z.boolean(),
  available: import_zod22.z.boolean(),
  staff: import_zod22.z.boolean(),
  canManageAgents: import_zod22.z.boolean(),
  userId: import_zod22.z.string().uuid()
});
var supportRealtimeRequestSchema = import_zod22.z.object({ ticketId: import_zod22.z.string().uuid().optional(), staff: import_zod22.z.boolean().default(false) }).strict();
var supportRealtimeTicketSchema = import_zod22.z.object({ ticket: import_zod22.z.string(), expiresAt: import_zod22.z.number(), path: import_zod22.z.string() });
var supportReadSchema = import_zod22.z.object({ sequence: import_zod22.z.number().int().nonnegative() }).strict();
var supportReportSchema = import_zod22.z.object({
  queued: import_zod22.z.number(),
  active: import_zod22.z.number(),
  closed: import_zod22.z.number(),
  overdue: import_zod22.z.number(),
  transfers: import_zod22.z.number(),
  meanAcceptanceMs: import_zod22.z.number().nullable(),
  meanResponseMs: import_zod22.z.number().nullable(),
  meanResolutionMs: import_zod22.z.number().nullable()
});
var supportTemplateSchema = import_zod22.z.object({
  id: import_zod22.z.string().uuid(),
  title: import_zod22.z.string().trim().min(1).max(100),
  body: import_zod22.z.string().trim().min(1).max(16384),
  version: import_zod22.z.number().int().positive()
});
var supportTemplateInputSchema = supportTemplateSchema.pick({ title: true, body: true }).extend({ expectedVersion: import_zod22.z.number().int().nonnegative() }).strict();
var supportSettingsSchema = import_zod22.z.object({
  version: import_zod22.z.number().int().positive(),
  responseTargetMinutes: import_zod22.z.number().int().min(1).max(43200).nullable(),
  retentionDays: import_zod22.z.number().int().min(1).max(3650).nullable()
});
var supportSettingsInputSchema = supportSettingsSchema.omit({ version: true }).extend({ expectedVersion: import_zod22.z.number().int().positive() }).strict();
var supportNotificationSchema = import_zod22.z.object({
  id: import_zod22.z.string().uuid(),
  seq: import_zod22.z.number(),
  ticketId: import_zod22.z.string().uuid(),
  kind: import_zod22.z.string(),
  createdAt: import_zod22.z.number(),
  readAt: import_zod22.z.number().nullable()
});
var supportNotificationPageSchema = import_zod22.z.object({
  items: supportNotificationSchema.array(),
  nextCursor: import_zod22.z.string().nullable()
});
var supportUnreadSchema = import_zod22.z.object({
  unread: import_zod22.z.number().int().nonnegative(),
  liveTickets: import_zod22.z.number().int().nonnegative()
});
var supportLabelsSchema = import_zod22.z.object({
  priority: import_zod22.z.enum(["low", "normal", "high", "urgent"]),
  tags: import_zod22.z.array(import_zod22.z.string().trim().min(1).max(40)).max(10).refine((tags) => new Set(tags).size === tags.length, "Tags must be unique")
}).strict();
var supportLabelsInputSchema = supportLabelsSchema.extend({
  clientMutationId: import_zod22.z.string().uuid(),
  expectedVersion: import_zod22.z.number().int().positive()
});
var supportUserProfileSchema = import_zod22.z.object({
  userId: import_zod22.z.string().uuid(),
  email: import_zod22.z.string().nullable(),
  displayName: import_zod22.z.string().nullable(),
  createdAt: import_zod22.z.number()
});

// packages/schema/src/support/recovery/constants.ts
var SUPPORT_ARCHIVE_VERSION = 1;
var SUPPORT_ARCHIVE_TABLES = [
  "conversations",
  "conversation_members",
  "messages",
  "message_reactions",
  "attachments",
  "message_attachments",
  "support_tickets",
  "support_intakes",
  "support_activity",
  "support_labels",
  "support_notes",
  "support_reads",
  "support_replays",
  "support_templates",
  "support_notifications",
  "support_settings",
  "support_admin_events",
  "support_deadline_alerts",
  "support_erased_users",
  "support_erased_tickets"
];
var SUPPORT_ARCHIVE_PAGE_SIZE = 25;

// packages/schema/src/support/recovery/schema.ts
var import_zod23 = require("zod");
var supportMaintenanceInputSchema = import_zod23.z.object({
  clientMutationId: import_zod23.z.string().uuid(),
  expectedEpoch: import_zod23.z.number().int().positive(),
  kind: import_zod23.z.enum(["backup", "restore", "erase"]),
  backupId: import_zod23.z.string().uuid().optional(),
  userId: import_zod23.z.string().uuid().optional(),
  ticketId: import_zod23.z.string().uuid().optional(),
  reason: import_zod23.z.string().trim().min(1).max(2e3)
}).strict().superRefine((input, ctx) => {
  if (input.kind === "restore" && !input.backupId)
    ctx.addIssue({ code: import_zod23.z.ZodIssueCode.custom, message: "backupId required" });
  if (input.kind === "erase" && Number(!!input.userId) + Number(!!input.ticketId) !== 1)
    ctx.addIssue({ code: import_zod23.z.ZodIssueCode.custom, message: "exactly one erasure target required" });
  if (input.kind !== "erase" && (input.userId || input.ticketId) || input.kind !== "restore" && input.backupId)
    ctx.addIssue({ code: import_zod23.z.ZodIssueCode.custom, message: "unexpected target" });
});
var supportArchivePageSchema = import_zod23.z.object({
  table: import_zod23.z.enum(SUPPORT_ARCHIVE_TABLES),
  rows: import_zod23.z.record(import_zod23.z.union([import_zod23.z.string(), import_zod23.z.number().finite(), import_zod23.z.null()])).array().max(SUPPORT_ARCHIVE_PAGE_SIZE)
}).strict();
var supportArchiveManifestSchema = import_zod23.z.object({
  version: import_zod23.z.literal(SUPPORT_ARCHIVE_VERSION),
  desk: import_zod23.z.literal("octonode"),
  id: import_zod23.z.string().uuid(),
  generation: import_zod23.z.number().int().positive(),
  pages: import_zod23.z.number().int().nonnegative(),
  chain: import_zod23.z.string().regex(/^[0-9a-f]{64}$/),
  counts: import_zod23.z.record(import_zod23.z.number().int().nonnegative()),
  createdAt: import_zod23.z.number().int()
}).strict();
var supportMaintenanceViewSchema = import_zod23.z.object({
  id: import_zod23.z.string().uuid(),
  kind: import_zod23.z.enum(["backup", "restore", "erase"]),
  status: import_zod23.z.enum(["running", "failed", "complete", "cancelled"]),
  phase: import_zod23.z.string(),
  createdAt: import_zod23.z.number(),
  updatedAt: import_zod23.z.number(),
  error: import_zod23.z.string().nullable()
});

// packages/schema/src/task-management/common.ts
var import_zod24 = require("zod");
var taskNameSchema = import_zod24.z.string().trim().min(1).max(120);
var taskDescriptionSchema = import_zod24.z.string().max(32768).nullable();
var taskTimestampSchema = import_zod24.z.number().int().nonnegative();
var nullableTaskTimestampSchema = taskTimestampSchema.nullable();
var taskColorSchema = import_zod24.z.string().regex(/^#[0-9a-f]{6}$/i);
var taskUserIdSchema = import_zod24.z.string().min(1).max(128);
var taskSpaceTemplateSchema = import_zod24.z.enum(TASK_SPACE_TEMPLATES);
var taskStatusCategorySchema = import_zod24.z.enum(TASK_STATUS_CATEGORIES);
var workItemLevelSchema = import_zod24.z.enum(WORK_ITEM_LEVELS);
var builtinWorkItemTypeSchema = import_zod24.z.enum(BUILTIN_WORK_ITEM_TYPES);
var workItemPrioritySchema = import_zod24.z.enum(WORK_ITEM_PRIORITIES);
var taskFieldTypeSchema = import_zod24.z.enum(TASK_FIELD_TYPES);
var taskSpaceKeySchema = import_zod24.z.string().trim().min(2).max(10).regex(/^[A-Z][A-Z0-9]*$/);
var workItemKeySchema = import_zod24.z.string().trim().regex(/^[A-Z][A-Z0-9]{1,9}-[1-9][0-9]*$/);
var taskSpaceSchema = import_zod24.z.object({
  id: entityIdSchema,
  key: taskSpaceKeySchema,
  name: taskNameSchema,
  description: taskDescriptionSchema,
  sprintsEnabled: import_zod24.z.boolean(),
  /** Finishing an item needs every open child finished first. */
  blockDoneWithOpenChildren: import_zod24.z.boolean(),
  /** Finishing the last open child finishes its parent. */
  autoCloseParent: import_zod24.z.boolean(),
  version: revisionSchema,
  createdAt: taskTimestampSchema,
  updatedAt: taskTimestampSchema,
  archivedAt: nullableTaskTimestampSchema
}).strict();
var taskSpaceCreateSchema = import_zod24.z.object({
  key: taskSpaceKeySchema,
  name: taskNameSchema,
  description: taskDescriptionSchema.optional(),
  template: taskSpaceTemplateSchema,
  clientMutationId: idempotencyKeySchema
}).strict();
var taskSpaceUpdateSchema = import_zod24.z.object({
  name: taskNameSchema.optional(),
  description: taskDescriptionSchema.optional(),
  sprintsEnabled: import_zod24.z.boolean().optional(),
  blockDoneWithOpenChildren: import_zod24.z.boolean().optional(),
  autoCloseParent: import_zod24.z.boolean().optional(),
  expectedVersion: revisionSchema
}).strict().refine((changes) => Object.keys(changes).length > 1, "at least one task space change is required");
var taskStatusSchema = import_zod24.z.object({
  id: entityIdSchema,
  spaceId: entityIdSchema,
  name: taskNameSchema,
  category: taskStatusCategorySchema,
  color: taskColorSchema,
  position: import_zod24.z.number().int().nonnegative(),
  wipLimit: import_zod24.z.number().int().positive().max(1e4).nullable(),
  version: revisionSchema,
  archivedAt: nullableTaskTimestampSchema
}).strict();
var taskStatusCreateSchema = taskStatusSchema.omit({
  id: true,
  spaceId: true,
  version: true,
  archivedAt: true
}).extend({ clientMutationId: idempotencyKeySchema }).strict();
var taskStatusUpdateSchema = import_zod24.z.object({
  name: taskNameSchema.optional(),
  category: taskStatusCategorySchema.optional(),
  color: taskColorSchema.optional(),
  position: import_zod24.z.number().int().nonnegative().optional(),
  wipLimit: import_zod24.z.number().int().positive().max(1e4).nullable().optional(),
  archived: import_zod24.z.boolean().optional(),
  expectedVersion: revisionSchema
}).strict().refine((changes) => Object.keys(changes).length > 1, "at least one status change is required");
var workItemTypeSchema = import_zod24.z.object({
  id: entityIdSchema,
  spaceId: entityIdSchema,
  name: taskNameSchema,
  level: workItemLevelSchema,
  builtin: builtinWorkItemTypeSchema.nullable(),
  color: taskColorSchema,
  icon: import_zod24.z.string().trim().min(1).max(64).nullable(),
  position: import_zod24.z.number().int().nonnegative(),
  version: revisionSchema,
  archivedAt: nullableTaskTimestampSchema
}).strict();
var workItemTypeCreateSchema = workItemTypeSchema.omit({
  id: true,
  spaceId: true,
  builtin: true,
  version: true,
  archivedAt: true
}).extend({ clientMutationId: idempotencyKeySchema }).strict();
var workItemTypeUpdateSchema = import_zod24.z.object({
  name: taskNameSchema.optional(),
  color: taskColorSchema.optional(),
  icon: import_zod24.z.string().trim().min(1).max(64).nullable().optional(),
  position: import_zod24.z.number().int().nonnegative().optional(),
  archived: import_zod24.z.boolean().optional(),
  expectedVersion: revisionSchema
}).strict().refine((changes) => Object.keys(changes).length > 1, "at least one work item type change is required");
var taskFieldOptionSchema = import_zod24.z.object({
  id: entityIdSchema,
  name: taskNameSchema,
  color: taskColorSchema,
  position: import_zod24.z.number().int().nonnegative(),
  version: revisionSchema,
  archivedAt: nullableTaskTimestampSchema
}).strict();
var taskFieldOptionCreateSchema = import_zod24.z.object({
  name: taskNameSchema,
  color: taskColorSchema,
  position: import_zod24.z.number().int().nonnegative(),
  clientMutationId: idempotencyKeySchema
}).strict();
var taskFieldOptionUpdateSchema = import_zod24.z.object({
  name: taskNameSchema.optional(),
  color: taskColorSchema.optional(),
  position: import_zod24.z.number().int().nonnegative().optional(),
  archived: import_zod24.z.boolean().optional(),
  expectedVersion: revisionSchema
}).strict().refine((changes) => Object.keys(changes).length > 1, "at least one field option change is required");
var taskFieldDefinitionShape = {
  name: taskNameSchema,
  description: import_zod24.z.string().max(500).nullable(),
  type: taskFieldTypeSchema,
  required: import_zod24.z.boolean(),
  position: import_zod24.z.number().int().nonnegative()
};
function validateTaskFieldOptions(value, context) {
  const select = value.type === "single_select" || value.type === "multi_select";
  if (select && value.options.length === 0) {
    context.addIssue({ code: import_zod24.z.ZodIssueCode.custom, path: ["options"], message: "select fields require options" });
  }
  if (!select && value.options.length > 0) {
    context.addIssue({ code: import_zod24.z.ZodIssueCode.custom, path: ["options"], message: "only select fields accept options" });
  }
}
var taskFieldDefinitionSchema = import_zod24.z.object({
  id: entityIdSchema,
  spaceId: entityIdSchema,
  ...taskFieldDefinitionShape,
  options: import_zod24.z.array(taskFieldOptionSchema).max(100),
  version: revisionSchema,
  archivedAt: nullableTaskTimestampSchema
}).strict().superRefine(validateTaskFieldOptions);
var taskFieldCreateSchema = import_zod24.z.object({
  ...taskFieldDefinitionShape,
  options: import_zod24.z.array(taskFieldOptionCreateSchema.omit({ clientMutationId: true })).max(100),
  clientMutationId: idempotencyKeySchema
}).strict().superRefine(validateTaskFieldOptions);
var taskFieldUpdateSchema = import_zod24.z.object({
  name: taskNameSchema.optional(),
  description: import_zod24.z.string().max(500).nullable().optional(),
  required: import_zod24.z.boolean().optional(),
  position: import_zod24.z.number().int().nonnegative().optional(),
  archived: import_zod24.z.boolean().optional(),
  expectedVersion: revisionSchema
}).strict().refine((changes) => Object.keys(changes).length > 1, "at least one field change is required");
var taskFieldValueSchema = import_zod24.z.discriminatedUnion("type", [
  import_zod24.z.object({ type: import_zod24.z.literal("text"), value: import_zod24.z.string().max(1e4) }).strict(),
  import_zod24.z.object({ type: import_zod24.z.literal("number"), value: import_zod24.z.number().finite() }).strict(),
  import_zod24.z.object({ type: import_zod24.z.literal("single_select"), value: entityIdSchema }).strict(),
  import_zod24.z.object({
    type: import_zod24.z.literal("multi_select"),
    value: import_zod24.z.array(entityIdSchema).max(100).refine((ids) => new Set(ids).size === ids.length, "multi-select values must be unique")
  }).strict(),
  import_zod24.z.object({ type: import_zod24.z.literal("date"), value: taskTimestampSchema }).strict(),
  import_zod24.z.object({ type: import_zod24.z.literal("checkbox"), value: import_zod24.z.boolean() }).strict(),
  import_zod24.z.object({ type: import_zod24.z.literal("user"), value: taskUserIdSchema }).strict(),
  import_zod24.z.object({ type: import_zod24.z.literal("url"), value: import_zod24.z.string().url().max(2048) }).strict()
]);
var workItemFieldValueSchema = import_zod24.z.object({
  fieldId: entityIdSchema,
  value: taskFieldValueSchema
}).strict();
var taskTagSchema = import_zod24.z.object({
  id: entityIdSchema,
  spaceId: entityIdSchema,
  name: taskNameSchema,
  color: taskColorSchema,
  version: revisionSchema,
  archivedAt: nullableTaskTimestampSchema
}).strict();
var taskTagCreateSchema = import_zod24.z.object({
  name: taskNameSchema,
  color: taskColorSchema,
  clientMutationId: idempotencyKeySchema
}).strict();
var taskTagUpdateSchema = import_zod24.z.object({
  name: taskNameSchema.optional(),
  color: taskColorSchema.optional(),
  archived: import_zod24.z.boolean().optional(),
  expectedVersion: revisionSchema
}).strict().refine((changes) => Object.keys(changes).length > 1, "at least one tag change is required");
var taskSearchQuerySchema = import_zod24.z.object({
  q: import_zod24.z.string().trim().min(1).max(240),
  offset: import_zod24.z.coerce.number().int().min(0).max(1e5).default(0),
  limit: import_zod24.z.coerce.number().int().min(1).max(100).default(20)
}).strict();

// packages/schema/src/task-management/planning.ts
var import_zod25 = require("zod");
var taskReleaseStateSchema = import_zod25.z.enum(TASK_RELEASE_STATES);
var taskSprintStateSchema = import_zod25.z.enum(TASK_SPRINT_STATES);
var taskReleaseSchema = import_zod25.z.object({
  id: entityIdSchema,
  spaceId: entityIdSchema,
  name: taskNameSchema,
  description: taskDescriptionSchema,
  state: taskReleaseStateSchema,
  startAt: nullableTaskTimestampSchema,
  targetAt: nullableTaskTimestampSchema,
  releasedAt: nullableTaskTimestampSchema,
  version: revisionSchema,
  createdAt: taskTimestampSchema,
  updatedAt: taskTimestampSchema
}).strict().superRefine((release2, context) => {
  if (release2.state === "released" && release2.releasedAt === null) {
    context.addIssue({
      code: import_zod25.z.ZodIssueCode.custom,
      path: ["releasedAt"],
      message: "released releases require releasedAt"
    });
  }
});
var taskReleaseCreateSchema = import_zod25.z.object({
  name: taskNameSchema,
  description: taskDescriptionSchema.optional(),
  startAt: nullableTaskTimestampSchema.optional(),
  targetAt: nullableTaskTimestampSchema.optional(),
  clientMutationId: idempotencyKeySchema
}).strict();
var taskReleaseUpdateSchema = import_zod25.z.object({
  name: taskNameSchema.optional(),
  description: taskDescriptionSchema.optional(),
  startAt: nullableTaskTimestampSchema.optional(),
  targetAt: nullableTaskTimestampSchema.optional(),
  archived: import_zod25.z.boolean().optional(),
  expectedVersion: revisionSchema
}).strict().refine((changes) => Object.keys(changes).length > 1, "at least one release change is required");
var taskReleaseProgressSchema = import_zod25.z.object({
  totalItems: import_zod25.z.number().int().nonnegative(),
  doneItems: import_zod25.z.number().int().nonnegative(),
  totalStoryPoints: import_zod25.z.number().nonnegative(),
  doneStoryPoints: import_zod25.z.number().nonnegative()
}).strict();
var taskSprintSchema = import_zod25.z.object({
  id: entityIdSchema,
  spaceId: entityIdSchema,
  name: taskNameSchema,
  goal: import_zod25.z.string().max(500).nullable(),
  state: taskSprintStateSchema,
  startAt: nullableTaskTimestampSchema,
  endAt: nullableTaskTimestampSchema,
  version: revisionSchema,
  createdAt: taskTimestampSchema,
  completedAt: nullableTaskTimestampSchema
}).strict().superRefine((sprint, context) => {
  if (sprint.startAt !== null && sprint.endAt !== null && sprint.endAt < sprint.startAt) {
    context.addIssue({
      code: import_zod25.z.ZodIssueCode.custom,
      path: ["endAt"],
      message: "endAt must not precede startAt"
    });
  }
  if (sprint.state === "active" && (sprint.startAt === null || sprint.endAt === null)) {
    context.addIssue({ code: import_zod25.z.ZodIssueCode.custom, message: "active sprints require startAt and endAt" });
  }
});
var taskSprintCreateSchema = import_zod25.z.object({
  name: taskNameSchema,
  goal: import_zod25.z.string().max(500).nullable().optional(),
  startAt: nullableTaskTimestampSchema.optional(),
  endAt: nullableTaskTimestampSchema.optional(),
  clientMutationId: idempotencyKeySchema
}).strict().refine(
  (sprint) => sprint.startAt == null || sprint.endAt == null || sprint.endAt >= sprint.startAt,
  "endAt must not precede startAt"
);
var taskSprintUpdateSchema = import_zod25.z.object({
  name: taskNameSchema.optional(),
  goal: import_zod25.z.string().max(500).nullable().optional(),
  startAt: nullableTaskTimestampSchema.optional(),
  endAt: nullableTaskTimestampSchema.optional(),
  expectedVersion: revisionSchema
}).strict().refine((changes) => Object.keys(changes).length > 1, "at least one sprint change is required").refine(
  (sprint) => sprint.startAt == null || sprint.endAt == null || sprint.endAt >= sprint.startAt,
  "endAt must not precede startAt"
);
var sprintStartSchema = import_zod25.z.object({
  startAt: taskTimestampSchema,
  endAt: taskTimestampSchema,
  expectedVersion: revisionSchema,
  clientMutationId: idempotencyKeySchema
}).strict().refine((sprint) => sprint.endAt >= sprint.startAt, "endAt must not precede startAt");
var sprintCompletionDestinationSchema = import_zod25.z.discriminatedUnion("kind", [
  import_zod25.z.object({ kind: import_zod25.z.literal("backlog") }).strict(),
  import_zod25.z.object({ kind: import_zod25.z.literal("sprint"), sprintId: entityIdSchema }).strict()
]);
var sprintCompleteSchema = import_zod25.z.object({
  incompleteDestination: sprintCompletionDestinationSchema,
  expectedVersion: revisionSchema,
  clientMutationId: idempotencyKeySchema
}).strict();
var releaseResolutionSchema = import_zod25.z.discriminatedUnion("kind", [
  import_zod25.z.object({ kind: import_zod25.z.literal("keep") }).strict(),
  import_zod25.z.object({ kind: import_zod25.z.literal("remove") }).strict(),
  import_zod25.z.object({ kind: import_zod25.z.literal("move"), releaseId: entityIdSchema }).strict()
]);
var taskReleaseOperationSchema = import_zod25.z.object({
  releasedAt: taskTimestampSchema,
  unresolvedItems: releaseResolutionSchema,
  expectedVersion: revisionSchema,
  clientMutationId: idempotencyKeySchema
}).strict();

// packages/schema/src/task-management/work/items.ts
var import_zod26 = require("zod");
var taskLinkTypeSchema = import_zod26.z.enum(TASK_LINK_TYPES);
var workItemLinkSchema = import_zod26.z.object({
  sourceItemId: entityIdSchema,
  targetItemId: entityIdSchema,
  type: taskLinkTypeSchema,
  createdBy: taskUserIdSchema,
  createdAt: taskTimestampSchema
}).strict();
var workItemWorkflowLinkSchema = import_zod26.z.object({
  itemId: entityIdSchema,
  projectId: import_zod26.z.string().min(1).max(128),
  workflowId: import_zod26.z.string().min(1).max(200),
  createdBy: taskUserIdSchema,
  createdAt: taskTimestampSchema
}).strict();
var workItemPullRequestLinkSchema = import_zod26.z.object({
  itemId: entityIdSchema,
  repositoryId: import_zod26.z.number().int().positive(),
  pullNumber: import_zod26.z.number().int().positive(),
  createdBy: taskUserIdSchema,
  createdAt: taskTimestampSchema
}).strict();
var workItemDesignDocLinkSchema = import_zod26.z.object({
  itemId: entityIdSchema,
  documentId: entityIdSchema,
  createdBy: taskUserIdSchema,
  createdAt: taskTimestampSchema
}).strict();
var workItemSchema = import_zod26.z.object({
  id: entityIdSchema,
  key: workItemKeySchema,
  spaceId: entityIdSchema,
  type: workItemTypeSchema,
  title: import_zod26.z.string().trim().min(1).max(240),
  description: taskDescriptionSchema,
  statusId: entityIdSchema,
  priority: workItemPrioritySchema,
  reporterId: taskUserIdSchema,
  assigneeId: taskUserIdSchema.nullable(),
  assigneeName: import_zod26.z.string().nullable().optional(),
  parentId: entityIdSchema.nullable(),
  sprintId: entityIdSchema.nullable(),
  storyPoints: import_zod26.z.number().min(0).max(1e3).nullable(),
  startAt: nullableTaskTimestampSchema,
  dueAt: nullableTaskTimestampSchema,
  rank: import_zod26.z.number().int().nonnegative(),
  fieldValues: import_zod26.z.array(workItemFieldValueSchema).max(50),
  tags: import_zod26.z.array(taskTagSchema).max(20),
  releases: import_zod26.z.array(taskReleaseSchema).max(20),
  links: import_zod26.z.object({
    items: import_zod26.z.array(workItemLinkSchema).max(100),
    workflows: import_zod26.z.array(workItemWorkflowLinkSchema).max(100),
    pullRequests: import_zod26.z.array(workItemPullRequestLinkSchema).max(100),
    designDocs: import_zod26.z.array(workItemDesignDocLinkSchema).max(100)
  }).strict(),
  version: revisionSchema,
  createdAt: taskTimestampSchema,
  updatedAt: taskTimestampSchema,
  archivedAt: nullableTaskTimestampSchema
}).strict();
var workItemMutationShape = {
  typeId: entityIdSchema,
  title: import_zod26.z.string().trim().min(1).max(240),
  description: taskDescriptionSchema,
  statusId: entityIdSchema,
  priority: workItemPrioritySchema,
  assigneeId: taskUserIdSchema.nullable(),
  parentId: entityIdSchema.nullable(),
  sprintId: entityIdSchema.nullable(),
  storyPoints: import_zod26.z.number().min(0).max(1e3).nullable(),
  startAt: nullableTaskTimestampSchema,
  dueAt: nullableTaskTimestampSchema,
  fieldValues: import_zod26.z.array(workItemFieldValueSchema).max(50),
  tagIds: import_zod26.z.array(entityIdSchema).max(20),
  releaseIds: import_zod26.z.array(entityIdSchema).max(20)
};
var workItemCreateSchema = import_zod26.z.object({
  typeId: workItemMutationShape.typeId,
  title: workItemMutationShape.title,
  description: workItemMutationShape.description.optional(),
  statusId: workItemMutationShape.statusId.optional(),
  priority: workItemMutationShape.priority.optional(),
  assigneeId: workItemMutationShape.assigneeId.optional(),
  parentId: workItemMutationShape.parentId.optional(),
  sprintId: workItemMutationShape.sprintId.optional(),
  storyPoints: workItemMutationShape.storyPoints.optional(),
  startAt: workItemMutationShape.startAt.optional(),
  dueAt: workItemMutationShape.dueAt.optional(),
  fieldValues: workItemMutationShape.fieldValues.optional(),
  tagIds: workItemMutationShape.tagIds.optional(),
  releaseIds: workItemMutationShape.releaseIds.optional(),
  clientMutationId: idempotencyKeySchema
}).strict();
var workItemChangesShape = {
  typeId: workItemMutationShape.typeId.optional(),
  title: workItemMutationShape.title.optional(),
  description: workItemMutationShape.description.optional(),
  statusId: workItemMutationShape.statusId.optional(),
  priority: workItemMutationShape.priority.optional(),
  assigneeId: workItemMutationShape.assigneeId.optional(),
  parentId: workItemMutationShape.parentId.optional(),
  sprintId: workItemMutationShape.sprintId.optional(),
  storyPoints: workItemMutationShape.storyPoints.optional(),
  startAt: workItemMutationShape.startAt.optional(),
  dueAt: workItemMutationShape.dueAt.optional(),
  fieldValues: workItemMutationShape.fieldValues.optional(),
  tagIds: workItemMutationShape.tagIds.optional(),
  releaseIds: workItemMutationShape.releaseIds.optional()
};
var workItemUpdateSchema = import_zod26.z.object({ ...workItemChangesShape, expectedVersion: revisionSchema }).strict().refine((changes) => Object.keys(changes).length > 1, "at least one work item change is required");
var workItemVersionedRefSchema = import_zod26.z.object({ itemId: entityIdSchema, expectedVersion: revisionSchema }).strict();
var workItemBulkSchema = import_zod26.z.object({
  create: import_zod26.z.array(workItemCreateSchema.omit({ clientMutationId: true })).max(WORK_ITEM_BULK_LIMIT).default([]),
  update: import_zod26.z.array(
    workItemVersionedRefSchema.extend({
      changes: import_zod26.z.object(workItemChangesShape).strict().refine((changes) => Object.keys(changes).length > 0, "at least one work item change is required")
    }).strict()
  ).max(WORK_ITEM_BULK_LIMIT).default([]),
  archive: import_zod26.z.array(workItemVersionedRefSchema).max(WORK_ITEM_BULK_LIMIT).default([]),
  restore: import_zod26.z.array(workItemVersionedRefSchema).max(WORK_ITEM_BULK_LIMIT).default([]),
  clientMutationId: idempotencyKeySchema
}).strict().superRefine((bulk, context) => {
  const total = bulk.create.length + bulk.update.length + bulk.archive.length + bulk.restore.length;
  if (total === 0 || total > WORK_ITEM_BULK_LIMIT)
    context.addIssue({
      code: import_zod26.z.ZodIssueCode.custom,
      message: `a bulk request needs 1-${WORK_ITEM_BULK_LIMIT} operations`
    });
  const ids = [...bulk.update, ...bulk.archive, ...bulk.restore].map(({ itemId }) => itemId);
  if (new Set(ids).size !== ids.length)
    context.addIssue({ code: import_zod26.z.ZodIssueCode.custom, message: "each work item may appear once per bulk request" });
});
var workItemMoveSchema = import_zod26.z.object({
  statusId: entityIdSchema,
  beforeItemId: entityIdSchema.nullable().optional(),
  afterItemId: entityIdSchema.nullable().optional(),
  expectedVersion: revisionSchema,
  clientMutationId: idempotencyKeySchema
}).strict().refine((move) => !(move.beforeItemId && move.afterItemId), "beforeItemId and afterItemId are mutually exclusive");
var workItemLinkMutationSchema = import_zod26.z.discriminatedUnion("kind", [
  import_zod26.z.object({ kind: import_zod26.z.literal("item"), targetItemId: entityIdSchema, type: taskLinkTypeSchema }).strict(),
  import_zod26.z.object({
    kind: import_zod26.z.literal("workflow"),
    projectId: import_zod26.z.string().min(1).max(128),
    workflowId: import_zod26.z.string().min(1).max(200)
  }).strict(),
  import_zod26.z.object({
    kind: import_zod26.z.literal("pull_request"),
    repositoryId: import_zod26.z.number().int().positive(),
    pullNumber: import_zod26.z.number().int().positive()
  }).strict(),
  import_zod26.z.object({
    kind: import_zod26.z.literal("design_doc"),
    documentId: entityIdSchema
  }).strict()
]);
var workItemMineQuerySchema = import_zod26.z.object({
  role: import_zod26.z.enum(["assigned", "reported"]).default("assigned"),
  includeDone: import_zod26.z.boolean().default(false),
  limit: import_zod26.z.number().int().min(1).max(100).default(50)
}).strict();

// packages/schema/src/task-management/views.ts
var import_zod27 = require("zod");
var taskViewLayoutSchema = import_zod27.z.enum(TASK_VIEW_LAYOUTS);
var taskViewGroupSchema = import_zod27.z.enum(TASK_VIEW_GROUPS);
var taskViewSortSchema = import_zod27.z.enum(TASK_VIEW_SORTS);
var taskFieldFilterSchema = import_zod27.z.object({
  fieldId: entityIdSchema,
  operator: import_zod27.z.enum(["is", "is_not", "contains", "before", "after"]),
  value: import_zod27.z.union([import_zod27.z.string().max(1e4), import_zod27.z.number().finite(), import_zod27.z.boolean(), import_zod27.z.array(import_zod27.z.string().max(128)).max(100)])
}).strict();
var taskViewFilterSchema = import_zod27.z.object({
  query: import_zod27.z.string().trim().max(200).optional(),
  focus: import_zod27.z.enum(["all", "open", "unassigned", "overdue"]).optional(),
  layout: import_zod27.z.enum(["board", "list", "calendar", "timeline", "backlog", "sprint", "releases"]).optional(),
  sort: taskViewSortSchema.optional(),
  excludeIds: import_zod27.z.array(entityIdSchema).max(100).optional(),
  typeIds: import_zod27.z.array(entityIdSchema).max(50).optional(),
  statusIds: import_zod27.z.array(entityIdSchema).max(20).optional(),
  priorities: import_zod27.z.array(workItemPrioritySchema).max(WORK_ITEM_PRIORITIES.length).optional(),
  assigneeIds: import_zod27.z.array(taskUserIdSchema).max(100).optional(),
  tagIds: import_zod27.z.array(entityIdSchema).max(500).optional(),
  archived: import_zod27.z.boolean().optional(),
  sprintIds: import_zod27.z.array(entityIdSchema).max(100).optional(),
  releaseIds: import_zod27.z.array(entityIdSchema).max(100).optional(),
  parentId: entityIdSchema.optional(),
  projectIds: import_zod27.z.array(import_zod27.z.string().min(1).max(128)).max(100).optional(),
  customFields: import_zod27.z.array(taskFieldFilterSchema).max(50).optional(),
  startFrom: taskTimestampSchema.optional(),
  dueThrough: taskTimestampSchema.optional(),
  hideDone: import_zod27.z.boolean().optional()
}).strict();
var taskViewColumnSchema = import_zod27.z.discriminatedUnion("kind", [
  import_zod27.z.object({
    kind: import_zod27.z.literal("builtin"),
    field: import_zod27.z.enum([
      "key",
      "type",
      "title",
      "status",
      "priority",
      "assignee",
      "parent",
      "sprint",
      "story_points",
      "start",
      "due",
      "tags",
      "releases",
      "updated"
    ]),
    width: import_zod27.z.number().int().min(60).max(1e3).optional()
  }).strict(),
  import_zod27.z.object({
    kind: import_zod27.z.literal("custom"),
    fieldId: entityIdSchema,
    width: import_zod27.z.number().int().min(60).max(1e3).optional()
  }).strict()
]);
function validateTaskViewGrouping(view, context) {
  if (view.groupBy === "custom_single_select" && view.groupFieldId === null) {
    context.addIssue({
      code: import_zod27.z.ZodIssueCode.custom,
      path: ["groupFieldId"],
      message: "custom grouping requires a field"
    });
  }
  if (view.groupBy !== "custom_single_select" && view.groupFieldId !== null) {
    context.addIssue({
      code: import_zod27.z.ZodIssueCode.custom,
      path: ["groupFieldId"],
      message: "groupFieldId is only valid for custom grouping"
    });
  }
}
var taskViewMutationShape = {
  name: taskNameSchema,
  layout: taskViewLayoutSchema,
  filter: taskViewFilterSchema,
  groupBy: taskViewGroupSchema,
  groupFieldId: entityIdSchema.nullable(),
  sort: taskViewSortSchema,
  columns: import_zod27.z.array(taskViewColumnSchema).max(50),
  shared: import_zod27.z.boolean()
};
var taskViewSchema = import_zod27.z.object({
  id: entityIdSchema,
  spaceId: entityIdSchema,
  ...taskViewMutationShape,
  version: revisionSchema,
  createdAt: taskTimestampSchema,
  updatedAt: taskTimestampSchema
}).strict().superRefine(validateTaskViewGrouping);
var taskViewCreateSchema = import_zod27.z.object({
  ...taskViewMutationShape,
  clientMutationId: idempotencyKeySchema
}).strict().superRefine(validateTaskViewGrouping);
var taskViewUpdateSchema = import_zod27.z.object({
  name: taskViewMutationShape.name.optional(),
  layout: taskViewMutationShape.layout.optional(),
  filter: taskViewMutationShape.filter.optional(),
  groupBy: taskViewMutationShape.groupBy.optional(),
  groupFieldId: taskViewMutationShape.groupFieldId.optional(),
  sort: taskViewMutationShape.sort.optional(),
  columns: taskViewMutationShape.columns.optional(),
  shared: taskViewMutationShape.shared.optional(),
  expectedVersion: revisionSchema
}).strict().refine((changes) => Object.keys(changes).length > 1, "at least one view change is required");

// packages/schema/src/task-management/activity.ts
var import_zod28 = require("zod");
var workItemCommentSchema = import_zod28.z.object({
  id: entityIdSchema,
  itemId: entityIdSchema,
  authorKind: import_zod28.z.enum(["user", "agent"]),
  authorId: taskUserIdSchema,
  body: import_zod28.z.string().max(32768),
  version: revisionSchema,
  createdAt: taskTimestampSchema,
  editedAt: nullableTaskTimestampSchema,
  deletedAt: nullableTaskTimestampSchema
}).strict();
var workItemCommentCreateSchema = import_zod28.z.object({
  body: import_zod28.z.string().trim().min(1).max(32768),
  replyToId: entityIdSchema.nullable().optional(),
  clientMutationId: idempotencyKeySchema
}).strict();
var activityValueSchema = import_zod28.z.union([import_zod28.z.string().max(500), import_zod28.z.number(), import_zod28.z.boolean(), import_zod28.z.null()]);
var workItemActivitySchema = import_zod28.z.object({
  seq: import_zod28.z.number().int().positive(),
  id: entityIdSchema,
  itemId: entityIdSchema,
  actorKind: import_zod28.z.enum(["user", "agent", "system"]),
  actorId: taskUserIdSchema,
  kind: import_zod28.z.enum([
    "created",
    "updated",
    "moved",
    "auto_closed",
    "reopened",
    "archived",
    "commented",
    "linked",
    "unlinked",
    "attached",
    "detached",
    "sprint_planned",
    "sprint_started",
    "sprint_completed",
    "release_updated"
  ]),
  fields: import_zod28.z.array(import_zod28.z.string().min(1).max(64)).max(50),
  before: import_zod28.z.record(activityValueSchema),
  after: import_zod28.z.record(activityValueSchema),
  createdAt: taskTimestampSchema
}).strict();
var taskErrorSchema = import_zod28.z.object({
  error: import_zod28.z.string().min(1).max(1e3),
  code: import_zod28.z.enum([
    "forbidden",
    "not_found",
    "conflict",
    "invalid_hierarchy",
    "too_large",
    "rate_limited",
    "unavailable"
  ]),
  currentVersion: revisionSchema.optional()
}).strict();
var taskSpacePageSchema = pageSchema(taskSpaceSchema);
var taskItemTotalsSchema = import_zod28.z.object({
  total: import_zod28.z.number().int().nonnegative(),
  done: import_zod28.z.number().int().nonnegative(),
  storyPoints: import_zod28.z.number().nonnegative()
});
var taskItemSummarySchema = taskItemTotalsSchema.extend({
  startAt: nullableTaskTimestampSchema,
  endAt: nullableTaskTimestampSchema,
  statuses: import_zod28.z.record(taskItemTotalsSchema),
  sprints: import_zod28.z.record(taskItemTotalsSchema),
  releases: import_zod28.z.record(taskItemTotalsSchema)
});
var workItemPageSchema = pageSchema(workItemSchema).extend({ summary: taskItemSummarySchema });
var taskSprintPageSchema = pageSchema(taskSprintSchema);
var taskReleasePageSchema = pageSchema(taskReleaseSchema);
var workItemCommentPageSchema = pageSchema(workItemCommentSchema);
var workItemActivityPageSchema = pageSchema(workItemActivitySchema);

// packages/schema/src/task-management/attachments.ts
var import_zod29 = require("zod");
var taskAttachmentMimeSchema = import_zod29.z.enum(TASK_ATTACHMENT_MIME_TYPES);
var taskAttachmentNameSchema = import_zod29.z.string().trim().min(1).max(200).regex(/^[^/\\\p{Cc}]+$/u);
var taskAttachmentSchema = import_zod29.z.object({
  id: entityIdSchema,
  itemId: entityIdSchema,
  name: taskAttachmentNameSchema,
  mime: taskAttachmentMimeSchema,
  size: import_zod29.z.number().int().positive().max(TASK_ATTACHMENT_MAX_BYTES),
  checksum: import_zod29.z.string().max(128),
  createdBy: taskUserIdSchema,
  createdAt: taskTimestampSchema
}).strict();
var taskAttachmentListSchema = import_zod29.z.object({ items: import_zod29.z.array(taskAttachmentSchema).max(100) }).strict();
var taskAttachmentUploadQuerySchema = import_zod29.z.object({ name: taskAttachmentNameSchema }).strict();
var taskAttachmentRecordSchema = import_zod29.z.object({
  id: entityIdSchema,
  name: taskAttachmentNameSchema,
  mime: taskAttachmentMimeSchema,
  size: import_zod29.z.number().int().positive().max(TASK_ATTACHMENT_MAX_BYTES),
  checksum: import_zod29.z.string().max(128),
  objectKey: import_zod29.z.string().min(1).max(512),
  clientMutationId: idempotencyKeySchema
}).strict();

// packages/schema/src/task-management/hierarchy.ts
var import_zod30 = require("zod");
var taskHierarchyRollupSchema = import_zod30.z.object({
  total: import_zod30.z.number().int().nonnegative(),
  todo: import_zod30.z.number().int().nonnegative(),
  inProgress: import_zod30.z.number().int().nonnegative(),
  done: import_zod30.z.number().int().nonnegative(),
  points: import_zod30.z.number(),
  donePoints: import_zod30.z.number(),
  startAt: nullableTaskTimestampSchema,
  dueAt: nullableTaskTimestampSchema
}).strict();
var workItemTreeNodeSchema = import_zod30.z.object({
  id: entityIdSchema,
  key: workItemKeySchema,
  spaceId: entityIdSchema,
  parentId: entityIdSchema.nullable(),
  depth: import_zod30.z.number().int().nonnegative(),
  childCount: import_zod30.z.number().int().nonnegative().optional(),
  rollup: taskHierarchyRollupSchema.optional(),
  title: import_zod30.z.string(),
  level: workItemLevelSchema,
  typeName: import_zod30.z.string(),
  typeColor: taskColorSchema,
  statusName: import_zod30.z.string(),
  statusColor: taskColorSchema,
  statusCategory: taskStatusCategorySchema,
  assigneeId: taskUserIdSchema.nullable(),
  storyPoints: import_zod30.z.number().nullable(),
  startAt: nullableTaskTimestampSchema,
  dueAt: nullableTaskTimestampSchema
}).strict();
var workItemTreeSchema = import_zod30.z.object({
  nodes: import_zod30.z.array(workItemTreeNodeSchema).max(WORK_ITEM_TREE_LIMIT),
  truncated: import_zod30.z.boolean(),
  nextCursor: import_zod30.z.string().nullable().optional()
}).strict();
var taskSpaceTreeSchema = workItemTreeSchema.omit({ truncated: true }).extend({
  nextCursor: import_zod30.z.string().nullable()
});
var workItemSummarySchema = workItemTreeNodeSchema.omit({
  parentId: true,
  depth: true,
  level: true,
  typeName: true
});
var workItemSummaryListSchema = import_zod30.z.object({ items: import_zod30.z.array(workItemSummarySchema).max(100) }).strict();
var taskTreeBranchQuerySchema = import_zod30.z.object({ branch: import_zod30.z.boolean().default(false), parentId: entityIdSchema.optional() }).strict();

// packages/schema/src/design/collaboration.ts
var import_zod31 = require("zod");
var projectRevisionSchema = import_zod31.z.union([gitShaSchema, sha256Schema]);
var projectRelativePathSchema = import_zod31.z.string().min(1).max(1024).refine(
  (value) => (value === "." || value.split("/").every((part) => part && part !== "." && part !== "..")) && !value.startsWith("/") && !value.includes("\\") && !value.includes("\0"),
  "path must be a safe project-relative path"
);
var designPreviewDescriptorSchema = import_zod31.z.object({
  title: import_zod31.z.string().trim().min(1).max(120),
  sourcePath: projectRelativePathSchema,
  entryScript: import_zod31.z.string().min(1).max(80).regex(/^[A-Za-z0-9][A-Za-z0-9:._-]*$/),
  workingDirectory: import_zod31.z.union([import_zod31.z.literal("."), projectRelativePathSchema]),
  port: import_zod31.z.number().int().min(1024).max(65535),
  healthPath: import_zod31.z.string().min(1).max(1024).regex(/^\/(?!\/)[^?#]*$/)
}).strict();
var designArtifactRevisionSchema = import_zod31.z.object({
  artifactRevision: entityIdSchema,
  projectRevision: projectRevisionSchema,
  preview: designPreviewDescriptorSchema,
  createdByKind: import_zod31.z.enum(["user", "agent"]),
  createdBy: import_zod31.z.string().min(1).max(128),
  createdAt: import_zod31.z.number().int().nonnegative()
}).strict();
var designArtifactSchema = import_zod31.z.object({
  id: entityIdSchema,
  projectId: import_zod31.z.string().min(1).max(128),
  createdByKind: import_zod31.z.enum(["user", "agent"]),
  createdBy: import_zod31.z.string().min(1).max(128),
  createdAt: import_zod31.z.number().int().nonnegative(),
  archivedAt: import_zod31.z.number().int().positive().nullable(),
  revisions: import_zod31.z.array(designArtifactRevisionSchema).min(1).max(1e3)
}).strict();
var designArtifactSummarySchema = designArtifactSchema.omit({ revisions: true }).extend({
  latestRevision: designArtifactRevisionSchema
}).strict();
var designArtifactPageSchema = pageSchema(designArtifactSummarySchema);
var designArtifactCreateSchema = import_zod31.z.object({
  projectRevision: projectRevisionSchema,
  preview: designPreviewDescriptorSchema,
  clientMutationId: idempotencyKeySchema
}).strict();
var designSourceReferenceSchema = import_zod31.z.object({
  path: projectRelativePathSchema,
  startLine: import_zod31.z.number().int().positive().nullable(),
  endLine: import_zod31.z.number().int().positive().nullable()
}).strict().superRefine((value, ctx) => {
  if (value.startLine === null !== (value.endLine === null)) {
    ctx.addIssue({ code: import_zod31.z.ZodIssueCode.custom, message: "source line bounds must be provided together" });
  } else if (value.startLine !== null && value.endLine < value.startLine) {
    ctx.addIssue({ code: import_zod31.z.ZodIssueCode.custom, message: "source endLine must not precede startLine" });
  }
});
var designCommentTargetSchema = import_zod31.z.object({
  kind: import_zod31.z.literal("design"),
  artifactId: entityIdSchema,
  artifactRevision: entityIdSchema,
  viewport: import_zod31.z.object({
    width: import_zod31.z.number().int().min(1).max(16384),
    height: import_zod31.z.number().int().min(1).max(16384)
  }).strict(),
  position: import_zod31.z.object({ x: import_zod31.z.number().min(0).max(1), y: import_zod31.z.number().min(0).max(1) }).strict(),
  selection: import_zod31.z.object({
    quote: import_zod31.z.string().trim().min(1).max(1e3),
    prefix: import_zod31.z.string().max(200),
    suffix: import_zod31.z.string().max(200)
  }).strict().optional(),
  selectorFingerprint: sha256Schema.optional(),
  nodeId: import_zod31.z.string().min(1).max(200).optional(),
  source: designSourceReferenceSchema.optional(),
  architecture: import_zod31.z.object({
    blockId: import_zod31.z.string().min(1).max(200).regex(/^[A-Za-z0-9][A-Za-z0-9._:-]*$/),
    entityId: import_zod31.z.string().min(1).max(512).optional(),
    projectionRevision: sha256Schema
  }).strict().optional()
}).strict();
var pullRequestCommentTargetSchema = import_zod31.z.object({
  kind: import_zod31.z.literal("pull_request"),
  contextId: entityIdSchema,
  workflowId: import_zod31.z.string().max(200).nullable(),
  scope: import_zod31.z.enum(["pull_request", "workflow", "nodes", "code"]),
  nodeIds: import_zod31.z.array(import_zod31.z.string().min(1).max(200)).max(100),
  anchor: reviewAnchorSchema
}).strict();
var commentTargetSchema = import_zod31.z.discriminatedUnion("kind", [
  pullRequestCommentTargetSchema,
  designCommentTargetSchema
]);
var designAnchorProjectionSchema = import_zod31.z.object({
  threadId: entityIdSchema,
  artifactRevision: entityIdSchema,
  state: import_zod31.z.enum(["projected", "detached"]),
  position: import_zod31.z.object({ x: import_zod31.z.number().min(0).max(1), y: import_zod31.z.number().min(0).max(1) }).strict().nullable(),
  reason: import_zod31.z.string().trim().min(1).max(200).nullable(),
  createdAt: import_zod31.z.number().int().nonnegative()
}).strict().superRefine((value, ctx) => {
  if (value.state === "projected" !== (value.position !== null)) {
    ctx.addIssue({ code: import_zod31.z.ZodIssueCode.custom, message: "only projected anchors carry a position" });
  }
});
var designReviewThreadSchema = import_zod31.z.object({
  id: entityIdSchema,
  target: designCommentTargetSchema,
  projections: import_zod31.z.array(designAnchorProjectionSchema).max(1e3),
  status: import_zod31.z.enum(["open", "resolved"]),
  version: revisionSchema,
  createdAt: import_zod31.z.number().int().nonnegative(),
  updatedAt: import_zod31.z.number().int().nonnegative(),
  comments: import_zod31.z.array(reviewCommentSchema).max(1e4)
}).strict();
var designReviewThreadPageSchema = pageSchema(designReviewThreadSchema);
var designReviewThreadCreateSchema = designCommentTargetSchema.omit({
  kind: true,
  artifactId: true
}).extend({
  body: import_zod31.z.string().min(1).max(32768),
  clientMutationId: idempotencyKeySchema
}).strict();

// packages/schema/src/design/documents.ts
var import_zod32 = require("zod");
var designDocumentFormatSchema = import_zod32.z.enum(["markdown", "html", "text", "latex"]);
var designDocumentAccessSchema = import_zod32.z.enum(["private", "workspace", "public_file", "public_host"]);
var designDocumentScopeSchema = import_zod32.z.discriminatedUnion("kind", [
  import_zod32.z.object({ kind: import_zod32.z.literal("workspace") }).strict(),
  import_zod32.z.object({ kind: import_zod32.z.literal("project"), projectId: import_zod32.z.string().min(1).max(128) }).strict()
]);
var designDocumentRevisionSchema = import_zod32.z.object({
  id: entityIdSchema,
  title: import_zod32.z.string().trim().min(1).max(160),
  format: designDocumentFormatSchema,
  checksum: sha256Schema,
  size: import_zod32.z.number().int().nonnegative().max(2 * 1024 * 1024),
  createdByKind: import_zod32.z.enum(["user", "agent"]),
  createdBy: import_zod32.z.string().min(1).max(128),
  createdAt: import_zod32.z.number().int().nonnegative()
}).strict();
var designDocumentSchema = import_zod32.z.object({
  id: entityIdSchema,
  scope: designDocumentScopeSchema,
  access: designDocumentAccessSchema,
  sharePath: import_zod32.z.string().startsWith("/design/").nullable(),
  version: revisionSchema,
  createdByKind: import_zod32.z.enum(["user", "agent"]),
  createdBy: import_zod32.z.string().min(1).max(128),
  createdAt: import_zod32.z.number().int().nonnegative(),
  updatedAt: import_zod32.z.number().int().nonnegative(),
  latestRevision: designDocumentRevisionSchema
}).strict();
var designDocumentDetailSchema = designDocumentSchema.extend({
  content: import_zod32.z.string().max(2 * 1024 * 1024),
  commentProjectId: import_zod32.z.string().min(1).max(128)
}).strict();
var designDocumentCreateSchema = import_zod32.z.object({
  scope: designDocumentScopeSchema,
  title: import_zod32.z.string().trim().min(1).max(160),
  format: designDocumentFormatSchema,
  content: import_zod32.z.string().max(2 * 1024 * 1024)
}).strict();
var designDocumentUpdateSchema = import_zod32.z.object({
  title: import_zod32.z.string().trim().min(1).max(160),
  format: designDocumentFormatSchema,
  content: import_zod32.z.string().max(2 * 1024 * 1024),
  baseRevision: entityIdSchema
}).strict();
var designDocumentShareSchema = import_zod32.z.object({
  access: designDocumentAccessSchema,
  expectedVersion: revisionSchema
}).strict();
var designDocumentFilterSchema = import_zod32.z.object({
  q: import_zod32.z.string().trim().max(200).optional(),
  ids: import_zod32.z.array(entityIdSchema).max(100).optional(),
  excludeIds: import_zod32.z.array(entityIdSchema).max(100).optional()
}).strict();

// packages/schema/src/design/latex.ts
var import_zod33 = require("zod");
var latexDiagnosticSchema = import_zod33.z.object({
  severity: import_zod33.z.enum(["error", "warning"]),
  message: import_zod33.z.string().max(2e3),
  line: import_zod33.z.number().int().positive().optional()
}).strict();
var latexCompileResultSchema = import_zod33.z.discriminatedUnion("status", [
  import_zod33.z.object({
    status: import_zod33.z.literal("ready"),
    pdf: import_zod33.z.string().min(1).max(24 * 1024 * 1024).regex(/^[A-Za-z0-9+/]+={0,2}$/).refine((value) => value.length % 4 === 0, "Invalid base64 PDF length"),
    diagnostics: import_zod33.z.array(latexDiagnosticSchema).max(200),
    toolchain: import_zod33.z.string().min(1).max(128)
  }).strict(),
  import_zod33.z.object({
    status: import_zod33.z.literal("error"),
    diagnostics: import_zod33.z.array(latexDiagnosticSchema).min(1).max(200),
    toolchain: import_zod33.z.string().min(1).max(128)
  }).strict()
]);
var latexCompileResponseSchema = import_zod33.z.object({ digest: import_zod33.z.string().regex(/^[a-f0-9]{64}$/), result: latexCompileResultSchema }).strict();
var latexPdfPublishSchema = import_zod33.z.object({
  revision: entityIdSchema,
  artifact: latexCompileResponseSchema.refine(
    (value) => value.result.status === "ready",
    "A successful PDF is required"
  )
}).strict();

// packages/schema/src/analytics/dashboard.ts
var import_zod34 = require("zod");
var id = import_zod34.z.string().min(1).max(80).regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/);
var title = import_zod34.z.string().trim().min(1).max(80);
var width = import_zod34.z.enum(["small", "medium", "wide"]).default("medium");
var baseWidget = import_zod34.z.object({ id, title, width });
var AnalyticsWidget = import_zod34.z.discriminatedUnion("visualization", [
  baseWidget.extend({
    visualization: import_zod34.z.literal("stat"),
    source: import_zod34.z.enum([
      "total-runs",
      "successful-runs",
      "failed-runs",
      "success-rate",
      "average-duration",
      "p50-duration",
      "p95-duration",
      "node-runs"
    ])
  }),
  baseWidget.extend({ visualization: import_zod34.z.literal("area"), source: import_zod34.z.literal("execution-volume") }),
  baseWidget.extend({ visualization: import_zod34.z.literal("bar"), source: import_zod34.z.literal("workflow-volume") }),
  baseWidget.extend({ visualization: import_zod34.z.literal("pie"), source: import_zod34.z.literal("status-distribution") })
]);
var AnalyticsDays = import_zod34.z.union([import_zod34.z.literal(7), import_zod34.z.literal(14), import_zod34.z.literal(30)]);
var dashboardFields = {
  name: import_zod34.z.string().trim().min(1).max(80),
  description: import_zod34.z.string().trim().max(240).optional(),
  days: AnalyticsDays.default(14),
  widgets: import_zod34.z.array(AnalyticsWidget).max(24).refine(
    (widgets) => new Set(widgets.map((widget) => widget.id)).size === widgets.length,
    "widget ids must be unique"
  ).default([])
};
var AnalyticsDashboard = import_zod34.z.object({
  id,
  projectId: import_zod34.z.string().min(1).max(160),
  ...dashboardFields,
  revision: import_zod34.z.number().int().positive(),
  createdAt: import_zod34.z.number().int().nonnegative(),
  updatedAt: import_zod34.z.number().int().nonnegative()
});
var CreateAnalyticsDashboardInput = import_zod34.z.object(dashboardFields);
var UpdateAnalyticsDashboardInput = import_zod34.z.object({
  revision: import_zod34.z.number().int().positive(),
  name: dashboardFields.name.optional(),
  description: dashboardFields.description.nullable(),
  days: AnalyticsDays.optional(),
  widgets: dashboardFields.widgets.optional()
});

// packages/schema/src/capabilities.ts
var import_zod35 = require("zod");

// packages/schema/src/capabilities.constants.ts
var CLIENT_CAPABILITIES = [
  "repository_registry",
  "design_architecture_embed",
  "workflow_agents",
  "community_authoring",
  "community_publishing",
  "workflow_templates"
];

// packages/schema/src/capabilities.ts
var CapabilityName = import_zod35.z.enum(PLATFORM_CAPABILITIES);
var CapabilityMode = import_zod35.z.enum(CAPABILITY_MODES);
var CapabilityUnavailableReason = import_zod35.z.enum(CAPABILITY_UNAVAILABLE_REASONS);
var Capability = import_zod35.z.discriminatedUnion("available", [
  import_zod35.z.object({ name: CapabilityName, available: import_zod35.z.literal(true), mode: CapabilityMode }),
  import_zod35.z.object({
    name: CapabilityName,
    available: import_zod35.z.literal(false),
    mode: CapabilityMode,
    reason: CapabilityUnavailableReason
  })
]);
var CapabilityDocument = import_zod35.z.object({
  version: import_zod35.z.literal(1),
  mode: CapabilityMode,
  items: import_zod35.z.array(Capability)
});
var ClientCapabilityDocument = import_zod35.z.object({
  version: import_zod35.z.literal(2),
  mode: CapabilityMode,
  items: import_zod35.z.array(import_zod35.z.object({ name: import_zod35.z.enum(CLIENT_CAPABILITIES), available: import_zod35.z.boolean() }))
});

// packages/schema/src/agent/chat.ts
var import_zod38 = require("zod");

// packages/schema/src/remote/schema.ts
var import_zod36 = require("zod");

// packages/schema/src/remote/constants.ts
var REMOTE_CHUNK_BYTES = 48 * 1024;
var REMOTE_BODY_BYTES = 4 * 1024 * 1024;
var REMOTE_FRAME_BYTES = 128 * 1024;
var REMOTE_RESPONSE_BYTES = 50 * 1024 * 1024;
var REMOTE_PAIRING_MS = 10 * 6e4;
var REMOTE_FILE_BYTES = 128 * 1024 * 1024;
var REMOTE_FILE_CHUNK_BYTES = 512 * 1024;

// packages/schema/src/remote/schema.ts
var remoteHostIdSchema = import_zod36.z.string().uuid();
var remoteTargetSchema = import_zod36.z.object({ computerId: remoteHostIdSchema, checkoutId: import_zod36.z.string().uuid() }).strict();
var remoteHostCreateSchema = import_zod36.z.object({ name: import_zod36.z.string().trim().min(1).max(80) }).strict();
var remotePreviewPortsSchema = import_zod36.z.array(import_zod36.z.number().int().min(1024).max(65535)).max(8);
var remotePreviewInputSchema = import_zod36.z.object({
  checkoutId: import_zod36.z.string().uuid(),
  projectId: import_zod36.z.string().min(1).max(128).regex(/^[a-zA-Z0-9._-]+$/),
  port: import_zod36.z.number().int().min(1024).max(65535),
  worktree: import_zod36.z.string().uuid().optional()
}).strict();
var remotePreviewSchema = import_zod36.z.object({ url: import_zod36.z.string().url(), expiresAt: import_zod36.z.number() });
var remoteFileRevisionSchema = import_zod36.z.string().regex(/^[a-f0-9]{64}$/);
var remoteFileMetadataSchema = import_zod36.z.object({
  path: import_zod36.z.string(),
  size: import_zod36.z.number(),
  revision: remoteFileRevisionSchema,
  maxBytes: import_zod36.z.number(),
  chunkBytes: import_zod36.z.number()
});
var remoteFileChunkSchema = import_zod36.z.object({ offset: import_zod36.z.number().int().nonnegative(), data: import_zod36.z.string().max(4 * Math.ceil(REMOTE_FILE_CHUNK_BYTES / 3)) }).strict();
var remoteFileDownloadSchema = remoteFileChunkSchema.extend({
  revision: remoteFileRevisionSchema,
  size: import_zod36.z.number(),
  nextOffset: import_zod36.z.number()
});
var remoteFileTransferInputSchema = import_zod36.z.object({
  id: import_zod36.z.string().uuid(),
  path: import_zod36.z.string().min(1).max(2048),
  size: import_zod36.z.number().int().min(0).max(REMOTE_FILE_BYTES),
  revision: remoteFileRevisionSchema.nullable(),
  sha256: remoteFileRevisionSchema
}).strict();
var remoteFileTransferSchema = remoteFileTransferInputSchema.extend({
  nextOffset: import_zod36.z.number(),
  state: import_zod36.z.enum(["uploading", "committing", "completed", "expired"]),
  createdAt: import_zod36.z.number(),
  project: import_zod36.z.string(),
  worktree: import_zod36.z.string().nullable()
});
var remotePairSchema = import_zod36.z.object({ checkoutId: import_zod36.z.string().uuid(), isolation: import_zod36.z.enum(["native", "container"]).default("native") }).strict();
var remoteRecoverySchema = import_zod36.z.object({ epoch: import_zod36.z.string().uuid(), state: import_zod36.z.enum(["paused", "ready"]), cursor: import_zod36.z.string().uuid().optional() }).strict();
var remoteRecoveryCommandSchema = import_zod36.z.discriminatedUnion("action", [
  import_zod36.z.object({ action: import_zod36.z.literal("begin"), epoch: import_zod36.z.string().uuid(), previousEpoch: import_zod36.z.string().uuid().nullable() }).strict(),
  import_zod36.z.object({ action: import_zod36.z.literal("finish"), epoch: import_zod36.z.string().uuid() }).strict()
]);
var remoteCredentialFenceSchema = import_zod36.z.object({ ownerHash: import_zod36.z.string().regex(/^[a-f0-9]{64}$/), epoch: import_zod36.z.string().uuid() }).strict();
var remoteHostSchema = import_zod36.z.object({
  id: remoteHostIdSchema,
  name: import_zod36.z.string(),
  workspace: import_zod36.z.string(),
  createdAt: import_zod36.z.number(),
  connectedAt: import_zod36.z.number().nullable(),
  checkoutId: import_zod36.z.string().uuid().nullable(),
  online: import_zod36.z.boolean(),
  isolation: import_zod36.z.enum(["native", "container"]).default("native"),
  canManage: import_zod36.z.boolean().default(false)
});
var remoteHostEnrollmentSchema = import_zod36.z.object({
  host: remoteHostSchema,
  token: import_zod36.z.string(),
  expiresAt: import_zod36.z.number()
});
var remoteDeviceSchema = import_zod36.z.object({
  id: remoteHostIdSchema,
  workspace: import_zod36.z.string(),
  ownerId: import_zod36.z.string(),
  checkoutId: import_zod36.z.string().uuid().nullable(),
  executionPolicy: import_zod36.z.string().regex(/^[a-f0-9]{64}$/).optional()
});
var remoteConnectionSchema = import_zod36.z.object({
  id: remoteHostIdSchema,
  gateway: import_zod36.z.string().url(),
  token: import_zod36.z.string().regex(/^octo_host_[a-f0-9]{64}$/),
  paired: import_zod36.z.boolean().default(false),
  checkoutId: import_zod36.z.string().uuid().optional(),
  rootIdentity: import_zod36.z.string().regex(/^[a-f0-9]{64}$/).optional(),
  containerImage: import_zod36.z.string().regex(/^(?:sha256:[a-f0-9]{64}|[a-zA-Z0-9./:_-]+@sha256:[a-f0-9]{64})$/).optional(),
  previewPorts: remotePreviewPortsSchema.default([])
}).strict();
var remoteTerminalSchema = import_zod36.z.object({
  id: import_zod36.z.string().uuid(),
  project: import_zod36.z.string(),
  worktree: import_zod36.z.string().nullable(),
  createdAt: import_zod36.z.number()
});
var remoteTerminalQuerySchema = import_zod36.z.object({
  project: import_zod36.z.string().min(1).max(240),
  worktree: import_zod36.z.string().uuid().optional()
});
var remoteCommandInputSchema = import_zod36.z.object({
  id: import_zod36.z.string().uuid(),
  command: import_zod36.z.string().min(1).max(8192),
  timeoutMs: import_zod36.z.number().int().min(100).max(3e5).default(6e4)
}).strict();
var remoteCommandSchema = import_zod36.z.object({
  id: import_zod36.z.string().uuid(),
  project: import_zod36.z.string(),
  worktree: import_zod36.z.string().nullable(),
  state: import_zod36.z.enum(["running", "completed", "cancelled", "interrupted", "failed"]),
  output: import_zod36.z.string(),
  truncated: import_zod36.z.boolean(),
  exitCode: import_zod36.z.number().int().nullable(),
  createdAt: import_zod36.z.number(),
  finishedAt: import_zod36.z.number().nullable()
});
var remoteGrantInputSchema = import_zod36.z.object({
  checkoutId: import_zod36.z.string().uuid(),
  read: import_zod36.z.boolean(),
  write: import_zod36.z.boolean(),
  execute: import_zod36.z.boolean(),
  terminal: import_zod36.z.boolean(),
  revision: import_zod36.z.number().int().positive().nullable()
}).strict();
var remoteGrantSchema = remoteGrantInputSchema.extend({
  userId: import_zod36.z.string(),
  id: import_zod36.z.string().uuid(),
  revision: import_zod36.z.number().int().positive()
});
var remoteFrameSchema = import_zod36.z.discriminatedUnion("type", [
  import_zod36.z.object({ type: import_zod36.z.literal("policy"), value: import_zod36.z.string().regex(/^[a-f0-9]{64}$/) }).strict(),
  import_zod36.z.object({ type: import_zod36.z.literal("dial"), ticket: import_zod36.z.string().uuid() }).strict(),
  import_zod36.z.object({ type: import_zod36.z.literal("ping") }).strict(),
  import_zod36.z.object({ type: import_zod36.z.literal("pong") }).strict(),
  import_zod36.z.object({
    type: import_zod36.z.literal("request"),
    method: import_zod36.z.string().max(10),
    path: import_zod36.z.string().max(4096),
    headers: import_zod36.z.record(import_zod36.z.string().max(8192)),
    websocket: import_zod36.z.boolean()
  }).strict(),
  import_zod36.z.object({
    type: import_zod36.z.literal("response"),
    status: import_zod36.z.number().int().min(100).max(599),
    headers: import_zod36.z.record(import_zod36.z.string().max(8192))
  }).strict(),
  import_zod36.z.object({
    type: import_zod36.z.literal("data"),
    data: import_zod36.z.string().max(REMOTE_FRAME_BYTES),
    binary: import_zod36.z.boolean().optional(),
    final: import_zod36.z.boolean().optional()
  }).strict(),
  import_zod36.z.object({ type: import_zod36.z.literal("end") }).strict(),
  import_zod36.z.object({ type: import_zod36.z.literal("ack") }).strict(),
  import_zod36.z.object({ type: import_zod36.z.literal("cancel") }).strict(),
  import_zod36.z.object({ type: import_zod36.z.literal("error"), message: import_zod36.z.string().max(200) }).strict()
]);

// packages/schema/src/assistant/artifacts.ts
var import_zod37 = require("zod");
var assistantFileSchema = import_zod37.z.object({
  path: import_zod37.z.string().min(1).max(240).refine(
    (path) => !path.startsWith("/") && !path.includes("\\") && !path.includes("\0") && path.split("/").every((part) => part !== ".." && part !== "." && !!part),
    "Use a relative file path without traversal"
  ),
  content: import_zod37.z.string().max(128e3),
  executable: import_zod37.z.boolean().optional()
}).strict();
var assistantArtifactSchema = import_zod37.z.object({
  id: import_zod37.z.string().uuid(),
  kind: import_zod37.z.enum(["skill", "plugin", "mcp"]),
  projectId: import_zod37.z.string().min(1).max(128).nullable(),
  requiresClaude: import_zod37.z.boolean().optional(),
  files: import_zod37.z.array(assistantFileSchema).min(1).max(128)
}).strict().superRefine((artifact, ctx) => {
  const paths2 = artifact.files.map((file) => file.path.toLowerCase());
  if (new Set(paths2).size !== paths2.length || paths2.some((path) => paths2.some((parent) => path.startsWith(parent + "/"))) || new TextEncoder().encode(JSON.stringify(artifact)).byteLength > 256e3)
    ctx.addIssue({ code: import_zod37.z.ZodIssueCode.custom, message: "Artifact exceeds limits or repeats paths" });
});
function assistantResourceArtifact(record) {
  const files = [...record.content.files ?? []];
  const add = (path, content) => {
    if (!files.some((file) => file.path === path)) files.push({ path, content });
  };
  add(".claude-plugin/plugin.json", JSON.stringify({ name: `resource-${record.id}`, description: record.name }));
  record.content.skills.forEach(
    (skill, index) => add(
      `skills/skill-${index}/SKILL.md`,
      /^---\r?\n/.test(skill.instructions) ? skill.instructions : `---
name: skill-${index}
description: ${JSON.stringify(record.name)}
---

${skill.instructions}`
    )
  );
  if (record.content.connectors.length)
    add(
      ".mcp.json",
      JSON.stringify(
        {
          mcpServers: Object.fromEntries(
            record.content.connectors.map((connector) => [
              connector.id,
              {
                type: "http",
                url: connector.url,
                ...connector.variable ? { headers: { Authorization: `Bearer \${OTTO_MCP_${connector.variable}}` } } : {}
              }
            ])
          )
        },
        null,
        2
      )
    );
  return assistantArtifactSchema.parse({
    id: record.id,
    kind: record.kind,
    projectId: record.projectId,
    ...record.content.files?.length ? { requiresClaude: true } : {},
    files
  });
}

// packages/schema/src/agent/chat.ts
var projectIdSchema = import_zod38.z.string().min(1).max(128);
var projectIdsSchema = import_zod38.z.array(projectIdSchema).min(1).max(100).refine((ids) => new Set(ids).size === ids.length, "projectIds must be unique");
var policyVersionSchema = import_zod38.z.string().min(1).max(64);
var modelAliasSchema = import_zod38.z.string().min(1).max(128);
var timestampSchema = import_zod38.z.number().int().nonnegative();
var toolNameSchema = import_zod38.z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
var agentRunStatusSchema = import_zod38.z.enum(AGENT_RUN_STATUSES);
var agentErrorCodeSchema = import_zod38.z.enum(AGENT_ERROR_CODES);
var agentToolRiskSchema = import_zod38.z.enum(AGENT_TOOL_RISKS);
var assistantSettingsSchema = import_zod38.z.object({
  sessionScope: import_zod38.z.enum(["workspace", "project", "workflow"]).optional(),
  model: assistantModelSchema.optional(),
  artifacts: import_zod38.z.array(assistantArtifactSchema).max(128).refine(
    (artifacts) => new TextEncoder().encode(JSON.stringify(artifacts)).byteLength <= 256e3,
    "Attached resource files exceed 256 KB"
  ).optional(),
  resourceIds: import_zod38.z.array(import_zod38.z.string().uuid()).max(128).optional(),
  excludedResourceIds: import_zod38.z.array(import_zod38.z.string().uuid()).max(128).optional(),
  gateway: import_zod38.z.object({
    url: assistantEndpointSchema,
    model: import_zod38.z.string().trim().min(1).max(128),
    variable: assistantVariableSchema
  }).strict().nullable(),
  connectors: import_zod38.z.array(
    import_zod38.z.object({
      id: import_zod38.z.string().regex(/^[a-z][a-z0-9_-]{0,31}$/),
      name: import_zod38.z.string().trim().min(1).max(80),
      url: assistantEndpointSchema,
      variable: assistantVariableSchema.nullable()
    }).strict()
  ).max(8).refine((items) => new Set(items.map(({ id: id2 }) => id2)).size === items.length, "Duplicate connectors"),
  skills: import_zod38.z.array(
    import_zod38.z.object({
      name: import_zod38.z.string().trim().min(1).max(128),
      instructions: import_zod38.z.string().min(1).max(32e3)
    }).strict()
  ).max(16).refine(
    (skills) => new Set(skills.map(({ name }) => name)).size === skills.length && skills.reduce((size, skill) => size + new TextEncoder().encode(skill.instructions).length, 0) <= 128e3,
    "Skills exceed the session limit or repeat names"
  )
}).strict();
var assistantConversationConfigSchema = import_zod38.z.object({
  remoteTarget: remoteTargetSchema.nullable().optional(),
  conversationId: entityIdSchema,
  projectId: projectIdSchema,
  projectIds: projectIdsSchema,
  worktreeId: import_zod38.z.string().uuid().nullable().optional(),
  settings: assistantSettingsSchema.optional(),
  enabled: import_zod38.z.boolean(),
  policyVersion: policyVersionSchema,
  createdByKind: import_zod38.z.enum(["user", "agent"]),
  createdBy: import_zod38.z.string().min(1).max(128),
  createdAt: timestampSchema,
  updatedByKind: import_zod38.z.enum(["user", "agent"]),
  updatedBy: import_zod38.z.string().min(1).max(128),
  updatedAt: timestampSchema,
  version: revisionSchema
}).strict().refine(({ createdAt, updatedAt }) => updatedAt >= createdAt, "updatedAt must not precede createdAt");
var assistantConversationUpdateSchema = import_zod38.z.object({
  projectId: projectIdSchema,
  projectIds: projectIdsSchema.optional(),
  worktreeId: import_zod38.z.string().uuid().nullable().optional(),
  settings: assistantSettingsSchema.optional(),
  enabled: import_zod38.z.boolean(),
  expectedVersion: revisionSchema.nullable()
}).strict();
var agentUsageSchema = import_zod38.z.object({
  inputTokens: import_zod38.z.number().int().nonnegative(),
  outputTokens: import_zod38.z.number().int().nonnegative(),
  totalTokens: import_zod38.z.number().int().nonnegative(),
  modelCalls: import_zod38.z.number().int().positive().max(100)
}).strict().refine(
  ({ inputTokens, outputTokens, totalTokens }) => inputTokens + outputTokens === totalTokens,
  "totalTokens must equal inputTokens plus outputTokens"
);
var agentRunBaseSchema = import_zod38.z.object({
  remoteTarget: remoteTargetSchema.nullable().optional(),
  id: entityIdSchema,
  conversationId: entityIdSchema,
  userMessageId: entityIdSchema,
  projectId: projectIdSchema,
  projectIds: projectIdsSchema,
  worktreeId: import_zod38.z.string().uuid().nullable().optional(),
  settings: assistantSettingsSchema.optional(),
  workflowRunId: import_zod38.z.string().min(1).max(128),
  modelAlias: modelAliasSchema,
  policyVersion: policyVersionSchema,
  createdAt: timestampSchema,
  startedAt: timestampSchema.nullable(),
  usage: agentUsageSchema.nullable()
}).strict();
var agentRunSchema = import_zod38.z.discriminatedUnion("status", [
  agentRunBaseSchema.extend({
    status: import_zod38.z.enum(["queued", "running", "approval_required"]),
    assistantMessageId: import_zod38.z.null(),
    finishedAt: import_zod38.z.null(),
    errorCode: import_zod38.z.null()
  }),
  agentRunBaseSchema.extend({
    status: import_zod38.z.literal("completed"),
    assistantMessageId: entityIdSchema,
    finishedAt: timestampSchema,
    errorCode: import_zod38.z.null()
  }),
  agentRunBaseSchema.extend({
    status: import_zod38.z.literal("cancelled"),
    assistantMessageId: entityIdSchema.nullable(),
    finishedAt: timestampSchema,
    errorCode: import_zod38.z.literal("cancelled")
  }),
  agentRunBaseSchema.extend({
    status: import_zod38.z.literal("failed"),
    assistantMessageId: entityIdSchema.nullable(),
    finishedAt: timestampSchema,
    errorCode: agentErrorCodeSchema
  })
]).superRefine((value, ctx) => {
  if (value.startedAt !== null && value.startedAt < value.createdAt) {
    ctx.addIssue({ code: import_zod38.z.ZodIssueCode.custom, message: "startedAt must not precede createdAt" });
  }
  if (value.finishedAt !== null && value.finishedAt < (value.startedAt ?? value.createdAt)) {
    ctx.addIssue({ code: import_zod38.z.ZodIssueCode.custom, message: "finishedAt must not precede the run" });
  }
  if (value.status === "failed" && value.errorCode === "cancelled") {
    ctx.addIssue({ code: import_zod38.z.ZodIssueCode.custom, message: "cancelled runs must use cancelled status" });
  }
});
var streamBaseSchema = import_zod38.z.object({
  runId: entityIdSchema,
  sequence: import_zod38.z.number().int().nonnegative(),
  at: timestampSchema
}).strict();
var toolCallIdSchema = import_zod38.z.string().min(1).max(128);
var agentStreamEventSchema = import_zod38.z.discriminatedUnion("type", [
  streamBaseSchema.extend({
    type: import_zod38.z.literal("started"),
    modelAlias: modelAliasSchema,
    policyVersion: policyVersionSchema
  }),
  streamBaseSchema.extend({
    type: import_zod38.z.literal("text_delta"),
    delta: import_zod38.z.string().min(1).max(4096)
  }),
  streamBaseSchema.extend({
    type: import_zod38.z.literal("tool_started"),
    toolCallId: toolCallIdSchema,
    toolName: toolNameSchema,
    risk: agentToolRiskSchema
  }),
  streamBaseSchema.extend({
    type: import_zod38.z.literal("tool_log"),
    toolCallId: toolCallIdSchema,
    level: import_zod38.z.enum(["info", "error", "warn", "debug"]),
    source: import_zod38.z.string(),
    message: import_zod38.z.string(),
    timestamp: import_zod38.z.number()
  }),
  streamBaseSchema.extend({
    type: import_zod38.z.literal("tool_finished"),
    toolCallId: toolCallIdSchema,
    toolName: toolNameSchema,
    risk: agentToolRiskSchema,
    outcome: import_zod38.z.enum(["ok", "error"]),
    durationMs: import_zod38.z.number().int().nonnegative().max(3e5),
    errorCode: agentErrorCodeSchema.nullable()
  }),
  streamBaseSchema.extend({
    type: import_zod38.z.literal("approval_required"),
    toolCallId: toolCallIdSchema,
    toolName: toolNameSchema,
    summary: import_zod38.z.string().min(1).max(1e3)
  }),
  streamBaseSchema.extend({
    type: import_zod38.z.literal("completed"),
    assistantMessageId: entityIdSchema,
    usage: agentUsageSchema
  }),
  streamBaseSchema.extend({ type: import_zod38.z.literal("cancelled") }),
  streamBaseSchema.extend({
    type: import_zod38.z.literal("failed"),
    errorCode: agentErrorCodeSchema
  })
]).superRefine((value, ctx) => {
  if (value.type === "tool_finished" && value.outcome === "ok" !== (value.errorCode === null)) {
    ctx.addIssue({ code: import_zod38.z.ZodIssueCode.custom, message: "only failed tool calls carry an errorCode" });
  }
});
var agentRealtimeUpdateSchema = import_zod38.z.object({
  type: import_zod38.z.literal("agent.updated"),
  runId: entityIdSchema,
  conversationId: entityIdSchema,
  remoteTarget: remoteTargetSchema.nullable().optional(),
  event: agentStreamEventSchema
}).strict().refine(({ runId, event }) => runId === event.runId, "Run event identity mismatch");
var agentToolAuditSchema = import_zod38.z.object({
  runId: entityIdSchema,
  toolCallId: toolCallIdSchema,
  toolName: toolNameSchema,
  risk: agentToolRiskSchema,
  requiredAction: agentScopeSchema,
  projectId: projectIdSchema,
  correlationId: entityIdSchema,
  startedAt: timestampSchema,
  finishedAt: timestampSchema,
  durationMs: import_zod38.z.number().int().nonnegative().max(3e5),
  outcome: import_zod38.z.enum(["ok", "error", "denied"]),
  errorCode: agentErrorCodeSchema.nullable()
}).strict().superRefine((value, ctx) => {
  if (value.finishedAt < value.startedAt) {
    ctx.addIssue({ code: import_zod38.z.ZodIssueCode.custom, message: "finishedAt must not precede startedAt" });
  }
  if (value.outcome === "ok" !== (value.errorCode === null)) {
    ctx.addIssue({ code: import_zod38.z.ZodIssueCode.custom, message: "only failed or denied tool calls carry an errorCode" });
  }
});
var agentServiceRunRequestSchema = import_zod38.z.object({
  remoteTarget: remoteTargetSchema.nullable().optional(),
  projectInstructions: import_zod38.z.string().max(17e3).optional(),
  version: import_zod38.z.literal(1),
  requestId: entityIdSchema,
  runId: entityIdSchema,
  conversationId: entityIdSchema,
  userMessageId: entityIdSchema,
  assistantMessageId: entityIdSchema,
  projectId: projectIdSchema,
  projectIds: projectIdsSchema,
  worktreeId: import_zod38.z.string().uuid().nullable().optional(),
  settings: assistantSettingsSchema.optional(),
  workspace: workspaceRefSchema,
  principal: principalSchema,
  policyVersion: policyVersionSchema,
  messages: import_zod38.z.array(
    import_zod38.z.object({
      id: entityIdSchema,
      role: import_zod38.z.enum(["user", "assistant"]),
      content: import_zod38.z.string().max(16384),
      attachments: import_zod38.z.array(attachmentManifestSchema).max(10).optional()
    }).strict().refine(
      ({ content, attachments }) => !!content.trim() || !!attachments?.length,
      "Message requires text or attachments"
    )
  ).min(1).max(100),
  limits: import_zod38.z.object({
    maxOutputTokens: import_zod38.z.number().int().min(1).max(32768),
    maxToolSteps: import_zod38.z.number().int().min(1).max(32),
    timeoutMs: import_zod38.z.number().int().min(1e3).max(3e5)
  }).strict()
}).strict().superRefine((value, ctx) => {
  if (value.projectIds[0] !== value.projectId) {
    ctx.addIssue({ code: import_zod38.z.ZodIssueCode.custom, message: "projectId must be the first projectIds entry" });
  }
  if (value.principal.kind !== "agent") return;
  if (value.principal.workspace.kind !== value.workspace.kind || value.principal.workspace.id !== value.workspace.id) {
    ctx.addIssue({ code: import_zod38.z.ZodIssueCode.custom, message: "agent principal workspace must match the request" });
  }
  if (value.principal.projectId !== null && value.principal.projectId !== value.projectId) {
    ctx.addIssue({ code: import_zod38.z.ZodIssueCode.custom, message: "agent principal project must match the request" });
  }
});
var claudeSandboxRequestSchema = import_zod38.z.object({ prompt: import_zod38.z.string().trim().min(1).max(8e3), settings: assistantSettingsSchema.optional() }).strict();

// packages/schema/src/agent/constants.ts
var ASSISTANT_MODEL_LIMITS = {
  inputTextBytes: 64 * 1024,
  inputTokens: 128e3,
  modelCalls: 8,
  claudeBudgetUsd: 1
};

// packages/schema/src/knowledge.ts
var import_zod39 = require("zod");
var digestSchema = import_zod39.z.string().regex(/^[a-f0-9]{64}$/);
var chunkIdSchema = import_zod39.z.string().regex(/^octokb:[a-f0-9]{56}$/);
var knowledgeSearchRequestSchema = import_zod39.z.object({
  query: import_zod39.z.string().trim().min(1).max(2e3),
  topK: import_zod39.z.number().int().min(1).max(8).default(6)
}).strict();
var knowledgeMatchSchema = import_zod39.z.object({
  id: chunkIdSchema,
  score: import_zod39.z.number().finite(),
  source: import_zod39.z.string().min(1).max(256),
  title: import_zod39.z.string().min(1).max(200),
  heading: import_zod39.z.string().min(1).max(200),
  content: import_zod39.z.string().min(1).max(2e3),
  digest: digestSchema,
  kind: import_zod39.z.enum(["documentation", "skill"])
}).strict();
var knowledgeSearchResponseSchema = import_zod39.z.object({
  corpusGeneration: digestSchema,
  model: import_zod39.z.literal("@cf/baai/bge-base-en-v1.5"),
  matches: import_zod39.z.array(knowledgeMatchSchema).max(8)
}).strict();
var knowledgeCorpusChunkSchema = knowledgeMatchSchema.omit({ score: true });
var knowledgeSyncBatchSchema = import_zod39.z.object({
  generation: digestSchema,
  chunks: import_zod39.z.array(knowledgeCorpusChunkSchema).min(1).max(50)
}).strict();
var knowledgeSyncActivateSchema = import_zod39.z.object({
  generation: digestSchema,
  chunkCount: import_zod39.z.number().int().min(1).max(1e4),
  sourceRevision: import_zod39.z.string().min(1).max(128)
}).strict();

// packages/schema/src/architecture.ts
var import_zod40 = require("zod");
var architectureId = import_zod40.z.string().min(1).max(1024);
var ArchitectureMode = import_zod40.z.enum(["inclusive", "exclusive"]);
var ArchitectureLevel = import_zod40.z.enum(["system", "components", "overview", "implementation"]);
var ArchitectureEntityKind = import_zod40.z.enum([
  "repository",
  "package",
  "configuration",
  "database",
  "project",
  "workflow",
  "node",
  "source",
  "plugin",
  "provider",
  "store",
  "runtime",
  "capability",
  "secret",
  "boundary"
]);
var ArchitectureScope = import_zod40.z.enum(["local", "cloud", "both"]);
var ArchitectureNode = import_zod40.z.object({
  id: architectureId,
  label: import_zod40.z.string().min(1).max(240),
  kind: ArchitectureEntityKind,
  detail: import_zod40.z.string().max(512).optional(),
  status: import_zod40.z.enum(["available", "unavailable", "reference", "boundary"]),
  scope: ArchitectureScope,
  ownerIds: import_zod40.z.array(architectureId).max(100),
  boundaryOf: architectureId.optional(),
  source: import_zod40.z.object({ projectId: architectureId, path: import_zod40.z.string().min(1).max(1024) }).strict().optional()
}).strict();
var ArchitectureEdge = import_zod40.z.object({
  id: architectureId,
  from: architectureId,
  to: architectureId,
  relation: import_zod40.z.enum([
    "owns",
    "data",
    "control",
    "dependency",
    "uses",
    "runs_on",
    "requires",
    "references",
    "attaches"
  ]),
  scope: ArchitectureScope,
  cycle: import_zod40.z.boolean()
}).strict();
var ArchitectureSeed = ArchitectureNode.pick({ id: true, label: true, kind: true });
var ArchitectureProjectionGraph = import_zod40.z.object({
  revision: import_zod40.z.string().regex(/^[a-f0-9]{64}$/),
  mode: ArchitectureMode,
  seeds: import_zod40.z.array(architectureId).max(100),
  availableSeeds: import_zod40.z.array(ArchitectureSeed).max(5e3),
  nodes: import_zod40.z.array(ArchitectureNode).max(5e3),
  edges: import_zod40.z.array(ArchitectureEdge).max(1e4)
}).strict();
var ArchitectureProjection = ArchitectureProjectionGraph.extend({
  architectureId,
  name: import_zod40.z.string().min(1).max(240),
  truncated: import_zod40.z.boolean(),
  summary: import_zod40.z.object({
    nodeCount: import_zod40.z.number().int().nonnegative(),
    edgeCount: import_zod40.z.number().int().nonnegative(),
    omittedNodes: import_zod40.z.number().int().nonnegative(),
    omittedEdges: import_zod40.z.number().int().nonnegative(),
    hiddenByView: import_zod40.z.number().int().nonnegative(),
    matchedNodes: import_zod40.z.number().int().nonnegative().optional()
  }).strict().optional(),
  matches: import_zod40.z.array(architectureId).max(5e3).optional(),
  diagnostics: import_zod40.z.array(
    import_zod40.z.object({
      code: import_zod40.z.string().min(1).max(120),
      message: import_zod40.z.string().min(1).max(512)
    }).strict()
  ).max(100)
}).strict();
var ArchitectureIdentity = import_zod40.z.object({
  architectureId,
  name: import_zod40.z.string().min(1).max(240),
  revision: import_zod40.z.string().regex(/^[a-f0-9]{64}$/),
  projects: import_zod40.z.array(import_zod40.z.object({ id: architectureId, label: import_zod40.z.string().min(1).max(240) }).strict())
}).strict();

// packages/schema/src/architecture/draft.ts
var import_zod41 = require("zod");
var draftId = import_zod41.z.string().regex(/^draft:[a-zA-Z0-9_-]+$/).max(100);
var revision = import_zod41.z.string().regex(/^[a-f0-9]{64}$/);
var ArchitectureDraftItem = import_zod41.z.object({
  id: draftId,
  type: import_zod41.z.enum(["component", "group", "note"]),
  kind: ArchitectureEntityKind.exclude(["repository", "boundary"]),
  label: import_zod41.z.string().trim().min(1).max(120),
  description: import_zod41.z.string().max(2e3),
  groupId: draftId.optional(),
  creation: import_zod41.z.object({
    template: import_zod41.z.enum(["project", "package", "workflow", "data-table"]),
    path: import_zod41.z.string().min(1).max(512).regex(/^(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+$/).optional(),
    projectId: import_zod41.z.string().min(1).max(512).optional(),
    packageName: import_zod41.z.string().regex(/^(?:@[a-z0-9._-]+\/)?[a-z0-9][a-z0-9._-]*$/).max(214).optional()
  }).strict().optional(),
  implementation: import_zod41.z.string().max(512).optional(),
  position: import_zod41.z.object({ x: import_zod41.z.number().finite().min(-1e5).max(1e5), y: import_zod41.z.number().finite().min(-1e5).max(1e5) }).strict().optional()
}).strict();
var ArchitectureDraft = import_zod41.z.object({
  version: import_zod41.z.literal(1),
  name: import_zod41.z.string().trim().min(1).max(120),
  baseRevision: revision,
  items: import_zod41.z.array(ArchitectureDraftItem).max(200),
  connections: import_zod41.z.array(ArchitectureEdge.pick({ from: true, to: true, relation: true }).extend({ id: draftId }).strict()).max(500)
}).strict();
var ArchitectureDraftResult = import_zod41.z.object({ draft: ArchitectureDraft.nullable(), revision: revision.nullable(), pendingToken: revision.optional() }).strict();
var SaveArchitectureDraft = import_zod41.z.object({ draft: ArchitectureDraft, revision: revision.nullable() }).strict();
var ArchitectureDraftReview = import_zod41.z.object({
  token: revision,
  currentRevision: revision,
  baseChanged: import_zod41.z.boolean(),
  applicableConnections: import_zod41.z.array(import_zod41.z.string()),
  plannedItems: import_zod41.z.number().int().nonnegative(),
  plannedConnections: import_zod41.z.number().int().nonnegative(),
  issues: import_zod41.z.array(
    import_zod41.z.object({
      code: import_zod41.z.enum([
        "duplicate_id",
        "missing_endpoint",
        "invalid_group",
        "self_dependency",
        "cycle",
        "partial_projection",
        "unavailable_project",
        "invalid_creation",
        "creation_conflict"
      ]),
      entityId: import_zod41.z.string().optional()
    }).strict()
  ),
  changes: import_zod41.z.array(
    import_zod41.z.object({ projectId: import_zod41.z.string(), path: import_zod41.z.string(), before: import_zod41.z.string(), after: import_zod41.z.string() }).strict()
  ),
  resources: import_zod41.z.array(
    import_zod41.z.object({
      itemId: draftId,
      template: import_zod41.z.enum(["workflow", "data-table"]),
      projectId: import_zod41.z.string(),
      id: import_zod41.z.string(),
      name: import_zod41.z.string(),
      description: import_zod41.z.string()
    }).strict()
  ).default([])
}).strict();
var ApplyArchitectureDraft = import_zod41.z.object({ token: revision, cancel: import_zod41.z.boolean().optional() }).strict();

// packages/schema/src/repository/registry.ts
var import_zod42 = require("zod");
var locator = import_zod42.z.string().min(1).max(4096);
var ProjectId = import_zod42.z.string().min(1).max(240).brand();
var SourceRepositoryId = import_zod42.z.string().regex(/^repo_[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/).brand();
var RegistryGeneration = import_zod42.z.number().int().nonnegative();
var RegistryDiagnostic = import_zod42.z.object({
  code: import_zod42.z.string().min(1).max(120),
  message: import_zod42.z.string().min(1).max(512)
}).strict();
var SourceRepositoryRecord = import_zod42.z.object({
  sourceRepositoryId: SourceRepositoryId,
  displayName: import_zod42.z.string().min(1).max(240),
  rootLocator: locator,
  canonicalRootFingerprint: import_zod42.z.string().regex(/^[a-f0-9]{64}$/),
  remote: import_zod42.z.object({
    fetchUrl: import_zod42.z.string().min(1).max(2048),
    provider: import_zod42.z.literal("github").optional(),
    githubRepositoryId: import_zod42.z.number().int().positive().optional()
  }).strict().nullable(),
  recovery: import_zod42.z.discriminatedUnion("kind", [
    import_zod42.z.object({
      kind: import_zod42.z.literal("reclone"),
      head: import_zod42.z.string().min(1).max(128),
      branch: import_zod42.z.string().min(1).max(240).optional()
    }).strict(),
    import_zod42.z.object({ kind: import_zod42.z.literal("relink") }).strict()
  ]),
  status: import_zod42.z.enum(["ready", "missing", "conflict"]),
  revision: import_zod42.z.number().int().nonnegative()
}).strict();
var RegisteredProjectRecord = import_zod42.z.object({
  projectId: ProjectId,
  sourceKind: import_zod42.z.enum(["repository", "managed", "standalone"]),
  sourceRepositoryId: SourceRepositoryId.nullable(),
  configLocator: locator,
  projectRootLocator: import_zod42.z.string().max(4096),
  configFormat: import_zod42.z.enum(["yaml", "json"]),
  configFingerprint: import_zod42.z.string().regex(/^[a-f0-9]{64}$/),
  storeKey: locator,
  identitySource: import_zod42.z.enum(["new", "legacy", "config"]),
  status: import_zod42.z.enum(["ready", "missing", "conflict", "invalid"]),
  revision: import_zod42.z.number().int().nonnegative()
}).strict();
var LegacyProjectAlias = import_zod42.z.object({
  alias: import_zod42.z.string().min(1).max(4096),
  projectId: ProjectId,
  kind: import_zod42.z.enum(["path", "slug"]),
  expiresAfterRelease: import_zod42.z.string().min(1).max(120).nullable()
}).strict();
var WorkspaceRegistryV2 = import_zod42.z.object({
  schemaVersion: import_zod42.z.literal(2),
  workspaceId: import_zod42.z.string().min(1).max(240),
  generation: RegistryGeneration,
  sourceRepositories: import_zod42.z.array(SourceRepositoryRecord),
  projects: import_zod42.z.array(RegisteredProjectRecord),
  legacyAliases: import_zod42.z.array(LegacyProjectAlias)
}).strict();
var RepositoryDiscoveryCandidate = import_zod42.z.object({
  candidateKey: import_zod42.z.string().regex(/^[a-f0-9]{64}$/),
  configLocator: locator,
  projectRootLocator: import_zod42.z.string().max(4096),
  configFormat: import_zod42.z.enum(["yaml", "json"]),
  configFingerprint: import_zod42.z.string().regex(/^[a-f0-9]{64}$/),
  displayName: import_zod42.z.string().min(1).max(240),
  status: import_zod42.z.enum(["valid", "invalid", "conflict"]),
  diagnostics: import_zod42.z.array(RegistryDiagnostic).max(100)
}).strict();
var RepositoryDiscovery = import_zod42.z.object({
  discoveryId: import_zod42.z.string().min(1).max(240),
  expectedRegistryGeneration: RegistryGeneration,
  complete: import_zod42.z.boolean(),
  expiresAt: import_zod42.z.number().int().nonnegative(),
  counts: import_zod42.z.object({
    visitedDirectories: import_zod42.z.number().int().nonnegative().max(1e4),
    candidates: import_zod42.z.number().int().nonnegative().max(1e3)
  }).strict(),
  candidates: import_zod42.z.array(RepositoryDiscoveryCandidate).max(1e3),
  diagnostics: import_zod42.z.array(RegistryDiagnostic).max(100)
}).strict();
var RegistryMigrationReport = import_zod42.z.object({
  expectedRegistryGeneration: RegistryGeneration,
  reportHash: import_zod42.z.string().regex(/^[a-f0-9]{64}$/),
  blocked: import_zod42.z.boolean(),
  recordActions: import_zod42.z.array(
    import_zod42.z.discriminatedUnion("action", [
      import_zod42.z.object({
        action: import_zod42.z.literal("preserve_id"),
        configLocator: locator,
        currentProjectId: ProjectId,
        projectId: ProjectId
      }).strict(),
      import_zod42.z.object({ action: import_zod42.z.literal("assign_id"), configLocator: locator }).strict(),
      import_zod42.z.object({ action: import_zod42.z.literal("conflict"), configLocator: locator, currentProjectId: ProjectId.optional() }).strict()
    ])
  ),
  storeMoves: import_zod42.z.array(import_zod42.z.object({ projectId: ProjectId, from: locator, to: locator }).strict()),
  collisionGroups: import_zod42.z.array(
    import_zod42.z.object({ legacyId: import_zod42.z.string().min(1).max(240), configLocators: import_zod42.z.array(locator).min(2) }).strict()
  ),
  linkedRecordCounts: import_zod42.z.record(import_zod42.z.number().int().nonnegative()),
  diagnostics: import_zod42.z.array(RegistryDiagnostic).max(100)
}).strict();
var SourceRepositorySummary = SourceRepositoryRecord.pick({
  sourceRepositoryId: true,
  displayName: true,
  rootLocator: true,
  status: true,
  revision: true
}).extend({ projectCount: import_zod42.z.number().int().nonnegative() }).strict();
var RegisteredProjectSummary = RegisteredProjectRecord.pick({
  projectId: true,
  sourceKind: true,
  sourceRepositoryId: true,
  configLocator: true,
  projectRootLocator: true,
  status: true,
  revision: true
}).extend({ displayName: import_zod42.z.string().min(1).max(240), workflowCount: import_zod42.z.number().int().nonnegative() }).strict();
var RegistryPublicSummary = import_zod42.z.object({
  workspaceId: import_zod42.z.string().min(1).max(240),
  generation: RegistryGeneration,
  sourceRepositories: import_zod42.z.array(SourceRepositorySummary),
  projects: import_zod42.z.array(RegisteredProjectSummary)
}).strict();

// packages/schema/src/community/publications.ts
var import_zod43 = require("zod");
var httpUrlSchema = import_zod43.z.string().url().max(2048).refine((value) => /^https?:\/\//i.test(value), "URL must use http or https");
var publicationKindSchema = import_zod43.z.enum(["guide", "blog", "paper"]);
var publicationStatusSchema = import_zod43.z.enum([
  "draft",
  "in_review",
  "changes_requested",
  "published",
  "rejected",
  "archived"
]);
var publicationSortSchema = import_zod43.z.enum(["published", "updated", "title", "rating"]);
var publicationOrderSchema = import_zod43.z.enum(["asc", "desc"]);
var publicationModerationDecisionSchema = import_zod43.z.enum(["request_changes", "reject", "publish"]);
var publicationSlugSchema = import_zod43.z.string().trim().min(3).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
var creatorHandleSchema = import_zod43.z.string().trim().min(3).max(39).regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/);
var creatorProfileSchema = import_zod43.z.object({
  id: entityIdSchema,
  userId: import_zod43.z.string().min(1).max(128),
  handle: creatorHandleSchema,
  displayName: import_zod43.z.string().trim().min(1).max(80),
  bio: import_zod43.z.string().max(500).nullable(),
  avatarUrl: httpUrlSchema.nullable(),
  version: revisionSchema,
  createdAt: import_zod43.z.number().int().nonnegative(),
  updatedAt: import_zod43.z.number().int().nonnegative()
}).strict();
var publicationAuthorSchema = import_zod43.z.object({
  name: import_zod43.z.string().trim().min(1).max(160),
  orcid: import_zod43.z.string().regex(/^https:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/).optional(),
  affiliation: import_zod43.z.string().trim().max(240).optional()
}).strict();
var cslNameSchema = import_zod43.z.object({
  family: import_zod43.z.string().max(160).optional(),
  given: import_zod43.z.string().max(160).optional(),
  literal: import_zod43.z.string().max(320).optional()
}).strict();
var cslDateSchema = import_zod43.z.object({
  "date-parts": import_zod43.z.array(import_zod43.z.array(import_zod43.z.number().int().nonnegative()).min(1).max(3)).min(1).max(2)
}).strict();
var cslCitationSchema = import_zod43.z.object({
  id: import_zod43.z.string().min(1).max(200),
  type: import_zod43.z.string().min(1).max(80),
  title: import_zod43.z.string().min(1).max(500),
  author: import_zod43.z.array(cslNameSchema).max(100).optional(),
  issued: cslDateSchema.optional(),
  DOI: import_zod43.z.string().max(200).optional(),
  URL: httpUrlSchema.optional(),
  publisher: import_zod43.z.string().max(240).optional(),
  "container-title": import_zod43.z.string().max(240).optional()
}).strict();
var publicationLinkSchema = import_zod43.z.discriminatedUnion("kind", [
  import_zod43.z.object({ kind: import_zod43.z.literal("api_operation"), operationId: import_zod43.z.string().min(1).max(160) }).strict(),
  import_zod43.z.object({ kind: import_zod43.z.literal("official_document"), path: import_zod43.z.string().startsWith("/").max(1024) }).strict(),
  import_zod43.z.object({ kind: import_zod43.z.literal("publication"), publicationId: entityIdSchema }).strict(),
  import_zod43.z.object({ kind: import_zod43.z.literal("plugin"), pluginId: import_zod43.z.string().min(1).max(160) }).strict(),
  import_zod43.z.object({ kind: import_zod43.z.literal("workflow_template"), templateId: entityIdSchema }).strict(),
  import_zod43.z.object({ kind: import_zod43.z.literal("external"), url: httpUrlSchema }).strict()
]);
var publicationRevisionSchema = import_zod43.z.object({
  id: entityIdSchema,
  publicationId: entityIdSchema,
  documentId: entityIdSchema,
  documentRevision: entityIdSchema,
  checksum: sha256Schema,
  createdBy: import_zod43.z.string().min(1).max(128),
  createdAt: import_zod43.z.number().int().nonnegative()
}).strict();
var publicationSummarySchema = import_zod43.z.object({
  id: entityIdSchema,
  slug: publicationSlugSchema,
  kind: publicationKindSchema,
  status: publicationStatusSchema,
  title: import_zod43.z.string().trim().min(1).max(200),
  summary: import_zod43.z.string().trim().min(1).max(500),
  license: import_zod43.z.string().trim().min(1).max(80),
  creator: creatorProfileSchema,
  topics: import_zod43.z.array(import_zod43.z.string().min(1).max(80)).max(20),
  assistantEligible: import_zod43.z.boolean(),
  version: revisionSchema,
  publishedAt: import_zod43.z.number().int().nonnegative().nullable(),
  updatedAt: import_zod43.z.number().int().nonnegative(),
  hasWorkflow: import_zod43.z.boolean(),
  viewCount: import_zod43.z.number().int().nonnegative(),
  commentCount: import_zod43.z.number().int().nonnegative(),
  ratingCount: import_zod43.z.number().int().nonnegative(),
  ratingAverage: import_zod43.z.number().min(1).max(5).nullable()
}).strict();
var publicationDetailSchema = publicationSummarySchema.extend({
  abstract: import_zod43.z.string().max(4e3).nullable(),
  content: import_zod43.z.string().max(2 * 1024 * 1024),
  revision: publicationRevisionSchema,
  authors: import_zod43.z.array(publicationAuthorSchema).max(100),
  citations: import_zod43.z.array(cslCitationSchema).max(500),
  links: import_zod43.z.array(publicationLinkSchema).max(100)
}).strict();
var publicationListQuerySchema = import_zod43.z.object({
  q: import_zod43.z.string().trim().min(1).max(200).optional(),
  kinds: import_zod43.z.array(publicationKindSchema).min(1).max(3).optional(),
  topics: import_zod43.z.array(import_zod43.z.string().trim().min(1).max(80)).min(1).max(20).optional(),
  creator: creatorHandleSchema.optional(),
  linkedOperationId: import_zod43.z.string().trim().min(1).max(160).optional(),
  sort: publicationSortSchema.default("published"),
  order: publicationOrderSchema.default("desc"),
  cursor: opaqueCursorSchema.optional(),
  limit: import_zod43.z.number().int().min(1).max(100).default(24)
}).strict();
var publicationMineListQuerySchema = import_zod43.z.object({
  q: import_zod43.z.string().trim().min(1).max(200).optional(),
  statuses: import_zod43.z.array(publicationStatusSchema).min(1).max(6).optional(),
  category: import_zod43.z.enum(["post", "workflow"]).optional(),
  cursor: opaqueCursorSchema.optional(),
  limit: import_zod43.z.number().int().min(1).max(100).default(24)
}).strict();
var publicationPageSchema = import_zod43.z.object({
  items: import_zod43.z.array(publicationSummarySchema),
  nextCursor: opaqueCursorSchema.nullable()
}).strict();
var publicationCommentSchema = import_zod43.z.object({
  id: entityIdSchema,
  publicationId: entityIdSchema,
  body: import_zod43.z.string().trim().min(1).max(2e3),
  author: import_zod43.z.object({
    handle: creatorHandleSchema.nullable(),
    avatarUrl: import_zod43.z.string().nullable().optional(),
    displayName: import_zod43.z.string().trim().min(1).max(80)
  }).strict(),
  createdAt: import_zod43.z.number().int().nonnegative()
}).strict();
var publicationCommentPageSchema = import_zod43.z.object({
  items: import_zod43.z.array(publicationCommentSchema),
  nextCursor: opaqueCursorSchema.nullable()
}).strict();
var publicationCommentListQuerySchema = import_zod43.z.object({
  cursor: opaqueCursorSchema.optional(),
  limit: import_zod43.z.number().int().min(1).max(100).default(50)
}).strict();
var publicationCommentCreateSchema = import_zod43.z.object({
  body: import_zod43.z.string().trim().min(1).max(2e3),
  clientMutationId: idempotencyKeySchema
}).strict();
var publicationMetadataSchema = import_zod43.z.object({
  slug: publicationSlugSchema,
  kind: publicationKindSchema,
  title: import_zod43.z.string().trim().min(1).max(200),
  summary: import_zod43.z.string().trim().min(1).max(500),
  abstract: import_zod43.z.string().trim().max(4e3).nullable().optional(),
  license: import_zod43.z.string().trim().min(1).max(80),
  topics: import_zod43.z.array(import_zod43.z.string().trim().min(1).max(80)).max(20).default([]),
  authors: import_zod43.z.array(publicationAuthorSchema).max(100).default([]),
  citations: import_zod43.z.array(cslCitationSchema).max(500).default([]),
  links: import_zod43.z.array(publicationLinkSchema).max(100).default([]),
  assistantEligible: import_zod43.z.boolean().default(false)
}).strict();
var publicationCreateSchema = publicationMetadataSchema.extend({
  documentId: entityIdSchema,
  documentRevision: entityIdSchema,
  creator: import_zod43.z.object({
    handle: creatorHandleSchema,
    displayName: import_zod43.z.string().trim().min(1).max(80),
    bio: import_zod43.z.string().max(500).nullable().optional()
  }).strict(),
  clientMutationId: idempotencyKeySchema
}).strict();
var publicationUpdateSchema = publicationMetadataSchema.partial().extend({
  expectedVersion: revisionSchema
}).strict().refine((value) => Object.keys(value).length > 1, "at least one field must be updated");
var publicationRevisionCreateSchema = import_zod43.z.object({
  documentId: entityIdSchema,
  documentRevision: entityIdSchema,
  expectedVersion: revisionSchema,
  clientMutationId: idempotencyKeySchema
}).strict();
var publicationSubmitSchema = import_zod43.z.object({ expectedVersion: revisionSchema }).strict();
var publicationArchiveSchema = import_zod43.z.object({ expectedVersion: revisionSchema }).strict();
var publicationModerateSchema = import_zod43.z.object({
  decision: publicationModerationDecisionSchema,
  note: import_zod43.z.string().trim().min(1).max(2e3),
  expectedVersion: revisionSchema
}).strict();
var publicationReportSchema = import_zod43.z.object({
  reason: import_zod43.z.string().trim().min(1).max(1e3)
}).strict();
var publicationRatingSchema = import_zod43.z.object({ rating: import_zod43.z.number().int().min(1).max(5) }).strict();
var communityKnowledgeSearchRequestSchema = import_zod43.z.object({
  query: import_zod43.z.string().trim().min(1).max(2e3),
  topK: import_zod43.z.number().int().min(1).max(8).default(6)
}).strict();
var communityKnowledgeMatchSchema = import_zod43.z.object({
  id: import_zod43.z.string().regex(/^[a-f0-9]{64}$/),
  score: import_zod43.z.number().finite(),
  publicationId: entityIdSchema,
  slug: publicationSlugSchema,
  title: import_zod43.z.string().min(1).max(200),
  creator: creatorHandleSchema,
  content: import_zod43.z.string().min(1).max(2e3),
  sourceLabel: import_zod43.z.literal("Community-authored, moderated publication"),
  canonical: import_zod43.z.literal(false)
}).strict();
var communityKnowledgeSearchResponseSchema = import_zod43.z.object({
  source: import_zod43.z.literal("community"),
  model: import_zod43.z.literal("@cf/baai/bge-base-en-v1.5"),
  matches: import_zod43.z.array(communityKnowledgeMatchSchema).max(8)
}).strict();
var publicationModerationItemSchema = publicationSummarySchema.extend({
  submittedAt: import_zod43.z.number().int().nonnegative()
}).strict();
var publicationModerationPageSchema = import_zod43.z.object({
  items: import_zod43.z.array(publicationModerationItemSchema),
  nextCursor: opaqueCursorSchema.nullable()
}).strict();
var publicationTopicSchema = import_zod43.z.object({ slug: publicationSlugSchema, name: import_zod43.z.string().min(1).max(80), count: import_zod43.z.number().int().nonnegative() }).strict();
var publicationTopicsSchema = import_zod43.z.array(publicationTopicSchema).max(500);

// packages/schema/src/community/media.ts
var import_zod44 = require("zod");
var communityMediaUploadSchema = import_zod44.z.object({
  contentType: import_zod44.z.enum(COMMUNITY_MEDIA_TYPES),
  data: import_zod44.z.string().min(4).max(COMMUNITY_MEDIA_BODY_BYTES).regex(/^[A-Za-z0-9+/]*={0,2}$/).refine((value) => value.length % 4 === 0, "Invalid base64 length")
}).strict();
var communityMediaItemSchema = import_zod44.z.object({
  id: import_zod44.z.string().uuid(),
  kind: import_zod44.z.enum(["image", "video"]),
  title: import_zod44.z.string().max(160).optional(),
  alt: import_zod44.z.string().max(500),
  caption: import_zod44.z.string().max(1e3)
}).strict();
var communityMediaBlockSchema = import_zod44.z.object({
  layout: import_zod44.z.enum(["single", "carousel"]),
  items: import_zod44.z.array(communityMediaItemSchema).min(1).max(20)
}).strict().refine((block) => block.layout === "carousel" || block.items.length === 1, "single media blocks require one item");

// packages/schema/src/workflow/templates.ts
var import_zod45 = require("zod");
var publicJsonSchema = import_zod45.z.lazy(
  () => import_zod45.z.union([
    import_zod45.z.null(),
    import_zod45.z.boolean(),
    import_zod45.z.number().finite(),
    import_zod45.z.string().max(1e4),
    import_zod45.z.array(publicJsonSchema).max(1e3),
    import_zod45.z.record(import_zod45.z.string().min(1).max(120), publicJsonSchema)
  ])
);
var safeId = import_zod45.z.string().min(1).max(160).regex(/^[A-Za-z0-9][A-Za-z0-9._/-]*$/);
var workflowTemplateDefinitionSchema = import_zod45.z.discriminatedUnion("kind", [
  import_zod45.z.object({ kind: import_zod45.z.literal("native"), catalogId: safeId }).strict(),
  import_zod45.z.object({ kind: import_zod45.z.literal("plugin"), pluginId: safeId, nodeId: safeId, version: import_zod45.z.string().min(1).max(80) }).strict()
]);
var workflowTemplateNodeSchema = import_zod45.z.object({
  instanceId: safeId,
  definition: workflowTemplateDefinitionSchema,
  params: import_zod45.z.record(import_zod45.z.string().min(1).max(120), publicJsonSchema).optional(),
  position: import_zod45.z.object({ x: import_zod45.z.number().finite(), y: import_zod45.z.number().finite() }).strict().optional()
}).strict();
var workflowTemplateEdgeSchema = import_zod45.z.object({
  from: import_zod45.z.object({ node: safeId, output: safeId.optional() }).strict(),
  to: import_zod45.z.object({ node: safeId, input: safeId.optional() }).strict(),
  kind: import_zod45.z.enum(["data", "dependency", "control"]).optional()
}).strict();
var workflowTemplatePlaceholderSchema = import_zod45.z.object({
  key: safeId,
  label: import_zod45.z.string().min(1).max(120),
  description: import_zod45.z.string().max(500),
  required: import_zod45.z.boolean(),
  schema: publicJsonSchema
}).strict();
var workflowTemplatePermissionSchema = import_zod45.z.object({
  id: safeId,
  label: import_zod45.z.string().min(1).max(120),
  reason: import_zod45.z.string().min(1).max(500)
}).strict();
var workflowTemplatePayloadBaseSchema = import_zod45.z.object({
  schemaVersion: import_zod45.z.literal(1),
  sourceWorkflowRevision: sha256Schema,
  title: import_zod45.z.string().trim().min(1).max(200),
  description: import_zod45.z.string().trim().min(1).max(1e3),
  graph: import_zod45.z.object({
    nodes: import_zod45.z.array(workflowTemplateNodeSchema).min(1).max(500),
    edges: import_zod45.z.array(workflowTemplateEdgeSchema).max(2e3),
    inputs: publicJsonSchema.optional()
  }).strict(),
  dependencies: import_zod45.z.object({
    plugins: import_zod45.z.array(import_zod45.z.object({ id: safeId, version: import_zod45.z.string().min(1).max(80) }).strict()).max(100),
    runtimes: import_zod45.z.array(import_zod45.z.string().min(1).max(80)).max(20)
  }).strict(),
  placeholders: import_zod45.z.array(workflowTemplatePlaceholderSchema).max(100),
  permissions: import_zod45.z.array(workflowTemplatePermissionSchema).max(100),
  compatibility: import_zod45.z.object({ octonode: import_zod45.z.string().min(1).max(80), notes: import_zod45.z.string().max(1e3).optional() }).strict(),
  creator: import_zod45.z.object({ handle: creatorHandleSchema, displayName: import_zod45.z.string().min(1).max(80) }).strict(),
  license: import_zod45.z.string().min(1).max(80)
}).strict();
var workflowTemplatePayloadSchema = workflowTemplatePayloadBaseSchema.superRefine(
  (value, context) => scanSensitive(value, context)
);
var workflowTemplateSnapshotSchema = workflowTemplatePayloadBaseSchema.extend({ digest: sha256Schema }).strict().superRefine((value, context) => scanSensitive(value, context));
var workflowTemplateCreateSchema = import_zod45.z.object({
  publicationId: entityIdSchema,
  slug: publicationSlugSchema,
  useCase: import_zod45.z.string().trim().min(1).max(120),
  difficulty: import_zod45.z.enum(["beginner", "intermediate", "advanced"]),
  triggers: import_zod45.z.array(import_zod45.z.string().min(1).max(80)).max(20),
  services: import_zod45.z.array(import_zod45.z.string().min(1).max(80)).max(20),
  snapshot: workflowTemplateSnapshotSchema,
  clientMutationId: import_zod45.z.string().min(1).max(128)
}).strict();
var workflowTemplateListQuerySchema = import_zod45.z.object({
  q: import_zod45.z.string().trim().min(1).max(200).optional(),
  useCase: import_zod45.z.string().max(120).optional(),
  node: safeId.optional(),
  plugin: safeId.optional(),
  runtime: import_zod45.z.string().max(80).optional(),
  difficulty: import_zod45.z.enum(["beginner", "intermediate", "advanced"]).optional(),
  trigger: import_zod45.z.string().max(80).optional(),
  service: import_zod45.z.string().max(80).optional(),
  creator: creatorHandleSchema.optional(),
  sort: import_zod45.z.enum(["published", "updated", "title"]).default("published"),
  order: import_zod45.z.enum(["asc", "desc"]).default("desc"),
  cursor: import_zod45.z.string().max(512).optional(),
  limit: import_zod45.z.number().int().min(1).max(100).default(24)
}).strict();
var workflowTemplateSummarySchema = import_zod45.z.object({
  id: entityIdSchema,
  publicationId: entityIdSchema,
  slug: publicationSlugSchema,
  title: import_zod45.z.string(),
  description: import_zod45.z.string(),
  useCase: import_zod45.z.string(),
  difficulty: import_zod45.z.enum(["beginner", "intermediate", "advanced"]),
  creator: creatorHandleSchema,
  nodes: import_zod45.z.array(safeId),
  plugins: import_zod45.z.array(safeId),
  runtimes: import_zod45.z.array(import_zod45.z.string()),
  triggers: import_zod45.z.array(import_zod45.z.string()),
  services: import_zod45.z.array(import_zod45.z.string()),
  license: import_zod45.z.string(),
  digest: sha256Schema,
  publishedAt: import_zod45.z.number().int().nonnegative().nullable(),
  updatedAt: import_zod45.z.number().int().nonnegative()
}).strict();
var workflowTemplateDetailSchema = workflowTemplateSummarySchema.extend({ snapshot: workflowTemplateSnapshotSchema }).strict();
function scanSensitive(value, context) {
  let fields = 0;
  const visit3 = (current, path, depth) => {
    if (depth > 12 || ++fields > 1e4) {
      context.addIssue({
        code: import_zod45.z.ZodIssueCode.custom,
        path,
        message: "workflow snapshot exceeds safe structural bounds"
      });
      return;
    }
    if (typeof current === "string" && sensitiveValue(current)) {
      context.addIssue({
        code: import_zod45.z.ZodIssueCode.custom,
        path,
        message: "workflow snapshot contains a private or secret value"
      });
    } else if (Array.isArray(current)) current.forEach((item, index) => visit3(item, [...path, index], depth + 1));
    else if (current && typeof current === "object")
      for (const [key, item] of Object.entries(current)) {
        if (/(?:secret|token|password|credential|api[_-]?key|environment|env|user[_-]?id|project[_-]?id|run[_-]?(?:id|history)|execution|history|private[_-]?url)/i.test(
          key
        )) {
          context.addIssue({
            code: import_zod45.z.ZodIssueCode.custom,
            path: [...path, key],
            message: "workflow snapshot contains a forbidden field"
          });
        } else visit3(item, [...path, key], depth + 1);
      }
  };
  visit3(value, [], 0);
}
function sensitiveValue(value) {
  return /(?:octo_agent_|sk-[A-Za-z0-9]{12}|-----BEGIN [A-Z ]*PRIVATE KEY-----|process\.env|\$\{[A-Z_][A-Z0-9_]*\})/.test(
    value
  ) || /https?:\/\/(?:[^/@\s]+:[^/@\s]+@|localhost(?::\d+)?(?:\/|$)|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)/i.test(
    value
  ) || /^(?:\/Users\/|\/home\/|[A-Za-z]:\\Users\\)/.test(value);
}

// packages/schema/src/json/schema/definitions.ts
var NODE_SCHEMA = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      description: "Stable identity key; edges reference this."
    },
    signature: {
      type: "object",
      description: "CODE-OWNED. Generated by `octonode scan`; read-only \u2014 editing is drift.",
      required: ["language", "command"],
      properties: {
        language: { type: "string" },
        workflowId: { type: "string", minLength: 1, description: "CODE-OWNED workflow invocation target." },
        command: { type: "string" },
        kind: {
          enum: ["function", "class", "service", "const"],
          description: "What this node is. Omitted \u2192 function. class/service/const are setup-time entities without data-flow I/O."
        },
        inputs: { type: "object" },
        outputs: { type: "object" },
        sourceExpressions: {
          type: "object",
          additionalProperties: { type: "string" },
          description: "CODE-OWNED expressions evaluated in the node's original source scope."
        },
        recursion: {
          type: "array",
          description: "CODE-OWNED recursive call sites for visualization only.",
          items: {
            type: "object",
            required: ["via", "location"],
            properties: {
              via: { type: "array", minItems: 1, items: { type: "string", minLength: 1 } },
              location: {
                type: "object",
                required: ["path", "start", "end", "line", "column"],
                properties: {
                  path: { type: "string" },
                  start: { type: "number" },
                  end: { type: "number" },
                  line: { type: "number" },
                  column: { type: "number" }
                }
              }
            }
          }
        },
        defaults: { type: "object", description: "Default input values declared by a plugin." },
        requiredEnv: { type: "array", items: { type: "string" } },
        setup: {
          type: "object",
          description: "Setup params (constructor/config shape) for non-function kinds."
        },
        checksum: { type: "string" },
        orphaned: { type: "boolean" },
        sourceScope: { type: "boolean" },
        service: {
          type: "object",
          required: ["host", "lifecycle"],
          properties: {
            host: { type: "string" },
            method: { type: "string" },
            lifecycle: { enum: ["invocation", "workflow-run", "worker"] }
          }
        }
      }
    },
    provides: {
      type: "array",
      description: "CONFIG-OWNED. For setup-time kinds: ids of the function nodes that depend on this entity (rendered as dashed dependency edges).",
      items: { type: "string" }
    },
    runtime: {
      type: "object",
      description: "CONFIG-OWNED operational settings.",
      properties: {
        timeout_ms: { type: "integer", minimum: 1 },
        retries: { type: "integer", minimum: 0 },
        retry_backoff_ms: { type: "integer", minimum: 0 },
        concurrency: { type: "integer", minimum: 1 },
        async: {
          type: "boolean",
          description: "Run this node alone after currently running nodes finish."
        }
      }
    },
    definitionPresentation: {
      $ref: "#/definitions/node/properties/presentation",
      description: "CODE-OWNED defaults generated from octonode.config.ts."
    },
    presentation: {
      type: "object",
      description: "CONFIG-OWNED presentation for the visual editor.",
      properties: {
        icon: { type: "string" },
        label: { type: "string" },
        symbol: { type: "string", maxLength: 16 },
        description: { type: "string" },
        color: { type: "string" },
        position: {
          type: "object",
          properties: {
            x: { type: "number" },
            y: { type: "number" }
          }
        }
      }
    }
  }
};
var WORKFLOW_SCHEMA = {
  type: "object",
  required: ["id"],
  properties: {
    definitionPresentation: {
      $ref: "#/definitions/node/properties/presentation",
      description: "CODE-OWNED defaults generated from octonode.config.ts."
    },
    label: {
      type: "string",
      minLength: 1,
      maxLength: 200,
      description: "CONFIG-OWNED display name. Workflow IDs remain stable."
    },
    archived: { type: "boolean", description: "CONFIG-OWNED catalog archive state." },
    id: { type: "string" },
    description: { type: "string" },
    source: {
      type: "object",
      required: ["path", "symbol", "kind", "checksum"],
      additionalProperties: false,
      properties: {
        path: { type: "string" },
        symbol: { type: "string" },
        kind: { enum: ["module", "function"] },
        checksum: { type: "string" },
        dependencies: { type: "object", additionalProperties: { type: "string" } },
        compilerChecksum: { type: "string" }
      }
    },
    inputs: {
      type: "object",
      description: "Workflow invocation JSON Schema. Source workflows project it from function parameters."
    },
    entry: { type: "string" },
    edges: {
      type: "array",
      items: {
        type: "object",
        required: ["from", "to"],
        properties: {
          from: {
            type: "object",
            required: ["node"],
            properties: {
              node: { type: "string" },
              output: { type: "string" }
            }
          },
          to: {
            type: "object",
            required: ["node"],
            properties: {
              node: { type: "string" },
              input: { type: "string" }
            }
          },
          kind: {
            enum: ["data", "dependency", "control"],
            description: "data (default) carries values; dependency is setup-only; control orders execution without carrying a value."
          }
        }
      }
    },
    nodes: {
      type: "array",
      description: "Explicit member node ids (canvas membership for not-yet-wired nodes).",
      items: { type: "string" }
    },
    promises: {
      type: "array",
      description: "CODE-OWNED Promise settlement nodes projected from source.",
      items: {
        type: "object",
        required: ["node", "mode"],
        additionalProperties: false,
        properties: {
          node: { type: "string" },
          mode: { enum: ["all", "allSettled", "race", "any", "reject", "settled", "then", "catch", "finally"] }
        }
      }
    },
    on_error: {
      type: "object",
      properties: { policy: { enum: ["halt", "continue"] } }
    },
    folder: {
      type: "string",
      description: 'CONFIG-OWNED folder path for organizing workflows, e.g. "math/daily".'
    },
    bindings: {
      type: "object",
      description: "Static node input values projected from source or authored in config.",
      additionalProperties: {
        type: "object",
        additionalProperties: {
          oneOf: [
            { type: "object", required: ["kind", "value"], properties: { kind: { const: "literal" }, value: {} } },
            {
              type: "object",
              required: ["kind", "symbol", "value"],
              properties: { kind: { const: "symbol" }, symbol: { type: "string" }, value: {} }
            }
          ]
        }
      }
    },
    evaluations: {
      type: "array",
      description: "CONFIG-OWNED workflow evaluation cases.",
      items: {
        type: "object",
        required: ["id", "expect"],
        additionalProperties: false,
        properties: {
          id: { type: "string", minLength: 1 },
          description: { type: "string" },
          input: {},
          expect: {
            type: "object",
            additionalProperties: false,
            properties: {
              status: { enum: ["ok", "error", "partial"], default: "ok" },
              outputs: { type: "object" }
            }
          },
          judge: {
            type: "object",
            required: ["workflow", "rubric"],
            additionalProperties: false,
            properties: {
              workflow: { type: "string", minLength: 1 },
              rubric: { type: "string", minLength: 1 },
              threshold: { type: "number", minimum: 0, maximum: 1, default: 0.7 }
            }
          }
        }
      }
    },
    test_workflows: {
      type: "array",
      description: "CONFIG-OWNED repository tests linked to this workflow.",
      items: {
        type: "object",
        required: ["path", "runner"],
        additionalProperties: false,
        properties: {
          path: { type: "string", minLength: 1 },
          runner: { enum: ["vitest", "jest", "playwright", "promptfoo"] }
        }
      }
    }
  }
};

// packages/schema/src/json/schema.ts
var location = {
  type: "object",
  required: ["path", "start", "end", "line", "column"],
  properties: {
    path: { type: "string" },
    start: { type: "number" },
    end: { type: "number" },
    line: { type: "number" },
    column: { type: "number" }
  }
};
var SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Octonode project config (.octonode)",
  description: "Single source of truth for environments, node configuration, and workflow topology.",
  type: "object",
  required: ["metadata"],
  additionalProperties: true,
  properties: {
    $schema: { type: "string" },
    apiVersion: { type: "string", default: "octonode.dev/v1" },
    metadata: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string" },
        id: { type: "string", minLength: 1, maxLength: 240 },
        version: { type: "string" },
        description: { type: "string" }
      }
    },
    defaults: {
      type: "object",
      description: "Project-wide defaults. `language` picks the codegen language for native nodes.",
      properties: {
        language: { type: "string", enum: ["typescript", "python"] }
      },
      additionalProperties: false
    },
    attachments: {
      type: "object",
      description: "Stable references to workspace-owned resources. Values and secrets remain outside Git.",
      properties: {
        plugins: { type: "array", items: { type: "string" }, default: [] },
        variables: { type: "array", items: { type: "string" }, default: [] },
        dataTables: { type: "array", items: { type: "string" }, default: [] }
      },
      additionalProperties: false
    },
    sources: {
      type: "array",
      description: "Commands `octonode scan` probes via `describe` to discover nodes.",
      items: { type: "string" }
    },
    environments: {
      type: "object",
      additionalProperties: {
        type: "object",
        properties: {
          inherits: { type: "string" },
          vars: { type: "object", additionalProperties: { type: "string" } },
          secrets: { type: "array", items: { type: "string" } }
        }
      }
    },
    nodes: { type: "array", items: { $ref: "#/definitions/node" } },
    types: {
      type: "object",
      description: "Shared JSON Schema type registry referenced by node signatures.",
      additionalProperties: { type: "object" }
    },
    projectDependencies: {
      type: "array",
      description: "Stable IDs of projects explicitly required by this project.",
      maxItems: 1e3,
      uniqueItems: true,
      items: { type: "string", minLength: 1, maxLength: 240 }
    },
    workflows: { type: "array", items: { $ref: "#/definitions/workflow" } },
    test_workflows: {
      type: "array",
      description: "CODE-OWNED test graphs and exact source snapshots generated by project compilation. Execute with the native test runner.",
      items: {
        type: "object",
        required: [
          "path",
          "runner",
          "revision",
          "sourceIndexRevision",
          "source",
          "nodes",
          "edges",
          "referencedSymbols",
          "diagnostics",
          "truncated"
        ],
        properties: {
          path: { type: "string" },
          runner: { enum: ["vitest", "jest", "playwright"] },
          revision: { type: "string", minLength: 64, maxLength: 64 },
          sourceIndexRevision: { type: "string", minLength: 64, maxLength: 64 },
          source: { type: "string" },
          truncated: { type: "boolean" },
          referencedSymbols: { type: "array", items: { type: "string" } },
          nodes: {
            type: "array",
            items: {
              type: "object",
              required: ["id", "kind", "label", "location"],
              properties: {
                id: { type: "string" },
                kind: { enum: TestWorkflowGraphNodeKind.options },
                label: { type: "string" },
                location,
                detail: { type: "string" },
                framework: { enum: ["vitest", "jest", "playwright"] },
                runnable: { type: "boolean" },
                sourceSymbolId: { type: "string" },
                sourceSymbolKind: { type: "string" },
                mockPhase: { enum: ["hoisted", "ordered", "runner-controlled"] }
              }
            }
          },
          edges: {
            type: "array",
            items: {
              type: "object",
              required: ["id", "from", "to", "kind"],
              properties: {
                id: { type: "string" },
                from: { type: "string" },
                to: { type: "string" },
                kind: { enum: TestWorkflowGraphEdgeKind.options }
              }
            }
          },
          diagnostics: {
            type: "array",
            items: {
              type: "object",
              required: ["severity", "code", "message"],
              properties: {
                severity: { enum: ["warning", "error"] },
                code: { type: "string" },
                message: { type: "string" },
                location
              }
            }
          }
        }
      }
    }
  },
  definitions: {
    node: NODE_SCHEMA,
    workflow: WORKFLOW_SCHEMA
  }
};

// packages/schema/src/settings.ts
var import_zod46 = require("zod");

// node_modules/re2js/build/index.js
var RE2Flags = class RE2Flags2 {
  static FOLD_CASE = 1;
  static LITERAL = 2;
  static CLASS_NL = 4;
  static DOT_NL = 8;
  static ONE_LINE = 16;
  static NON_GREEDY = 32;
  static PERL_X = 64;
  static UNICODE_GROUPS = 128;
  static WAS_DOLLAR = 256;
  static LOOKBEHIND = 512;
  static MATCH_NL = RE2Flags2.CLASS_NL | RE2Flags2.DOT_NL;
  static PERL = RE2Flags2.CLASS_NL | RE2Flags2.ONE_LINE | RE2Flags2.PERL_X | RE2Flags2.UNICODE_GROUPS;
  static POSIX = 0;
  static UNANCHORED = 0;
  static ANCHOR_START = 1;
  static ANCHOR_BOTH = 2;
};
var PublicFlags = {
  CASE_INSENSITIVE: 1,
  DOTALL: 2,
  MULTILINE: 4,
  DISABLE_UNICODE_GROUPS: 8,
  LONGEST_MATCH: 16,
  LOOKBEHINDS: 512
};
var ASCII_SIZE = 128;
var ASCII_TO_UPPER = new Int32Array(ASCII_SIZE);
var ASCII_TO_LOWER = new Int32Array(ASCII_SIZE);
var MAX_BMP = 65535;
for (let i = 0; i < ASCII_SIZE; i++) {
  if (i >= 97 && i <= 122) ASCII_TO_UPPER[i] = i - 32;
  else ASCII_TO_UPPER[i] = i;
  if (i >= 65 && i <= 90) ASCII_TO_LOWER[i] = i + 32;
  else ASCII_TO_LOWER[i] = i;
}
var Codepoint = class {
  static CODES = /* @__PURE__ */ new Map([
    ["\x07", 7],
    ["\b", 8],
    ["	", 9],
    ["\n", 10],
    ["\v", 11],
    ["\f", 12],
    ["\r", 13],
    [" ", 32],
    ['"', 34],
    ["$", 36],
    ["&", 38],
    ["'", 39],
    ["(", 40],
    [")", 41],
    ["*", 42],
    ["+", 43],
    ["-", 45],
    [".", 46],
    ["0", 48],
    ["1", 49],
    ["2", 50],
    ["3", 51],
    ["4", 52],
    ["5", 53],
    ["6", 54],
    ["7", 55],
    ["8", 56],
    ["9", 57],
    [":", 58],
    ["<", 60],
    [">", 62],
    ["?", 63],
    ["A", 65],
    ["B", 66],
    ["C", 67],
    ["F", 70],
    ["P", 80],
    ["Q", 81],
    ["U", 85],
    ["Z", 90],
    ["[", 91],
    ["\\", 92],
    ["]", 93],
    ["^", 94],
    ["_", 95],
    ["`", 96],
    ["a", 97],
    ["b", 98],
    ["f", 102],
    ["i", 105],
    ["m", 109],
    ["n", 110],
    ["r", 114],
    ["s", 115],
    ["t", 116],
    ["v", 118],
    ["x", 120],
    ["z", 122],
    ["{", 123],
    ["|", 124],
    ["}", 125]
  ]);
  static toUpperCase(codepoint) {
    if (codepoint < ASCII_SIZE) return ASCII_TO_UPPER[codepoint];
    const s = String.fromCodePoint(codepoint).toUpperCase();
    const expectedLen = s.codePointAt(0) > MAX_BMP ? 2 : 1;
    if (s.length > expectedLen) return codepoint;
    const sOrigin = String.fromCodePoint(s.codePointAt(0)).toLowerCase();
    const originExpectedLen = sOrigin.codePointAt(0) > MAX_BMP ? 2 : 1;
    if (sOrigin.length > originExpectedLen || sOrigin.codePointAt(0) !== codepoint) return codepoint;
    return s.codePointAt(0);
  }
  static toLowerCase(codepoint) {
    if (codepoint < ASCII_SIZE) return ASCII_TO_LOWER[codepoint];
    const s = String.fromCodePoint(codepoint).toLowerCase();
    const expectedLen = s.codePointAt(0) > MAX_BMP ? 2 : 1;
    if (s.length > expectedLen) return codepoint;
    const sOrigin = String.fromCodePoint(s.codePointAt(0)).toUpperCase();
    const originExpectedLen = sOrigin.codePointAt(0) > MAX_BMP ? 2 : 1;
    if (sOrigin.length > originExpectedLen || sOrigin.codePointAt(0) !== codepoint) return codepoint;
    return s.codePointAt(0);
  }
};
var UnicodeRangeTable = class {
  /**
  * @param {Uint32Array | number[]} data
  * @param {boolean} isStride1
  */
  constructor(data, isStride1 = false) {
    this.data = data;
    this.isStride1 = isStride1;
    this.SIZE = isStride1 ? 2 : 3;
  }
  getLo(index) {
    return this.data[index * this.SIZE];
  }
  getHi(index) {
    return this.data[index * this.SIZE + 1];
  }
  getStride(index) {
    return this.isStride1 ? 1 : this.data[index * this.SIZE + 2];
  }
  get length() {
    return this.data.length / this.SIZE;
  }
};
var B64_MAP = /* @__PURE__ */ new Uint8Array(256);
for (let i = 0, b2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-"; i < 64; i++) B64_MAP[b2.charCodeAt(i)] = i;
var decodeVLQ = (str) => {
  const res = [];
  let value = 0, shift = 0;
  for (let i = 0; i < str.length; i++) {
    let digit = B64_MAP[str.charCodeAt(i)];
    value |= (digit & 31) << shift;
    if ((digit & 32) === 0) {
      res.push(value);
      value = 0;
      shift = 0;
    } else shift += 5;
  }
  return res;
};
var decodeRanges = (str, isStride1) => {
  const res = decodeVLQ(str);
  const numRanges = isStride1 ? res.length / 2 : res.length / 3;
  const out = new Uint32Array(numRanges * 3);
  let current = 0, resIdx = 0;
  for (let i = 0; i < numRanges; i++) {
    current += res[resIdx++];
    out[i * 3] = current;
    current += res[resIdx++];
    out[i * 3 + 1] = current;
    out[i * 3 + 2] = isStride1 ? 1 : res[resIdx++];
  }
  return out;
};
var decodeOrbit = (str) => {
  const res = decodeVLQ(str);
  const map = /* @__PURE__ */ new Map();
  let currentKey = 0;
  for (let i = 0; i < res.length; i += 2) {
    currentKey += res[i];
    const zz = res[i + 1];
    const delta = zz >>> 1 ^ -(zz & 1);
    map.set(currentKey, currentKey + delta);
  }
  return map;
};
var LazyMap = class {
  constructor(initializer) {
    this.initializer = initializer;
    this.cache = /* @__PURE__ */ new Map();
  }
  has(key) {
    return key in this.initializer;
  }
  get(key) {
    if (this.cache.has(key)) return this.cache.get(key);
    const fn = this.initializer[key];
    const val = fn ? fn() : null;
    this.cache.set(key, val);
    return val;
  }
};
var UnicodeTables = class {
  static _CASE_ORBIT = null;
  static get CASE_ORBIT() {
    if (!this._CASE_ORBIT) this._CASE_ORBIT = decodeOrbit("rCgCIgCY+rQI4QiCuuBLgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCCgCBgCBgCBgCBgCBgCBgCB+7OB-BB-BB-BB-BB-BBskQB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BC-BB-BB-BB-BB-BB-BB-BByHBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBxHBCBBBCBBBCBBB3SBmMBkNBCBBBCBBB8MBCBBB6MB6MBCBBC+EB0MB2MBCBBB6MB+MBiGBmNBiNBCBBBmKBikzCBmNBqNBkIBsNBCBBBCBBBCBBB0NBCBBB0NDCBBB0NBCBBByNByNBCBBBCBBB2NBCBBDCBBCwDFCBCBDBCBCBDBCBCBDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB9EBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBCBDBCBBBhGBvDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBjICCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBH2iVBCBBBlKBwiVB+jVB+jVBCBBBlMBqEBuEBCBBBCBBBCBBBCBBBCBBB+hVB4hVB8hVBjNB7MC5MB5MCzMC1MB+0yCE5MB20yCC9MBu2yCBwyyCBo0yCChNBlNBo0yCBu-UBi0yCDlNC6-UBpNDrNIu+UDzNCm0yCBzNE0yyCBzNBpEBxNBxNBtEG1NLqxyCBkxyCnFoFrBCBBBCBBDCBBEkIBkIBkICoHHsCCqCBqCBqCCgEC+DB+DBmkOBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCC+BBgCBgCBgCBgCBgCBgCBgCBgCBrCBpCBpCBpCBmjOB-BB8BB-BB-BBgEB-BB-BByBBqgOBsDB-BBtwBB-BB-BB-BBsBBgDBCB-BB-BB-BBeB-BB-BB61OB-BB-BB-DB9DB9DBQB7DBmCE9CBrDBPBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBrFB-EBOBnHB3FB-FCCBBBNBCBBCjIBjIBjIBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB8kMB-BB6kMB-BB-BB-BB-BB-BB-BB-BB-BB-BBokMB-BB-BBkkMBkkMB-BB-BB-BB-BB-BB-BB-BB4jMB-BB-BB-BB-BB-BB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EBCBBBCBoiMBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBJCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBeBCBBBCBBBCBBBCBBBCBBBCBBBCBBBdBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDL-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-C64CgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOCgmOGgmODg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FDg8FBg8FBg8FhVg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBQBQBQBQBQBQDPBPBPBPBPBPjkC7mMB5mMBnmMBjmMBCBlmMB3lMBpiMBk8kCBCBBG-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FD-7FB-7FB-7F6FoglCEsuHRwjlCyDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCB0DBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBG1DD97OCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPEQCQCQCQCPCPCPCPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPB0EB0EBsFBsFBsFBsFBoGBoGBgIBgIBgHBgHB8HB8HDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQCSFPBPBzEBzEBRCxnOFSFrFBrFBrFBrFBREQBQClkOFPBPBnGBnGFQBQCljOCODPBPB-GB-GBNHSF-HB-HB7HB7HBRqJ53OE9tQBrmQH4Bc3BSgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfECBByZ0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzB34BgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CBCBBBt-UBruHBt+UB1iVBviVBCBBBCBBBCBBB3hVB5-UB9hVB7hVCCBBCCBBI9jVB9jVBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBICBBBCBBECBBN-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOC-lOG-lOzoeCBBBCBBBCBBBCBBBCBBBCBl8kCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBTCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBnECBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBKCBBBCBBBnglCBCBBBCBBBCBBBCBBBCBBECBBBvyyCDCBBBCBBBgDCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBn0yCB90yCB10yCBh0yCBn0yCCjxyCBzyyCBpxyCBg6BBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB-CBl0yCBvjlCBCBBBCBBBt2yCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBhkzCZCBB9a-5Bd-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCm6TCBB7gBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCH-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BmlBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvChDwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCFvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvC1DuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCCuCBuCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCCtCBtCk2BgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEO-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-D+CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCL-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-B74CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhrVgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BD1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BtxekCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjC");
    return this._CASE_ORBIT;
  }
  static _Print = null;
  static get Print() {
    if (!this._Print) this._Print = new UnicodeRangeTable(decodeRanges("hB9CBjBLBCpWBDFBFGBCCCBSBCsMBClBBDxBBDCBC2BBJaBFFBSVBC-FBCvBBD6BBDkDBP6BBDwBBDOBCbBDCCBJBGfBIqCBCgFBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYBDCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPBLCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGBCCBCHBDBBDVBCGBCBBCEBDIBDBBDCBICBFBBCEBDRBLBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBGMBCCBCWBCPBDIBCCBCDBIBBCCBCBBDDBDJBIVBCCBCWBCJBCEBDIBCCBCDBIBBGCBCDBDJBCCBNMBCCBCyBBCCBCFBFPBDZBCCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBN5BBFcBmBBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDBhBnCBCjBBFmBBCjBBCOBCMBmBlGBCGGD4LBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBH1CBDFBD-TBCbBE4CBIVBKXBKTBNMBCCBCBBN9CBDJBHJBHNBCKBH4CBIqBBGlCBLeBCLBFLBFEEBoBBDEBMrBBFZBHKBE9BBDgCBCcBDKBHJBHNBDtBBDLBVsCBClFBJ7BBEOBE9BBGqBBDKBJqBBG1QBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBSXBJuBBSBBDaBCMBEhBBPgBBQrEBF5UBXKBWz4BBD9LBGsBBCGGD3BBIBBPXBKGBCGBCGBCGBCGBCGBCGBCGBC9DBjBZBC4CBN1GBbPBC+BBC1CBDmDBGqBBC9CBC1CBKvBBCszcBE2BBK7KBV3FBJ8GBV7BBEJBH3BBJlCBJLBHzDBMdBEtCBCKBFgBBC2BBKNBDJBDmDBZbBLFBDFBDFBKGBCGBC7BBF9DBDJBHj9KBNWBFwBBloItLBDpDBnBGBNEBGZBCEBCCCBCCBCCBoUBhBpBBHyBBCSBCDBFEBCmEBF9FBEFBDFBDFBDCBEGBCGBOBBDLBCZBCSBCBBCOBDNBjB6DBGCBFsBBE3CBCMBEwBwBBsBBjEcBEwBBQbBFjBBKdBGqBBGdBCkBBFNBrB9EBDJBHjBBFjBBFnBBJzBBMLBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBCnCBJIBxBSBCBBGgBBEaBGaBnB3BBFTBDxBBCBBGHBCCBCcBDCBFJBIIBI-BBhBmBBFLBK1BBEcBDaBGZBIDBNGBxCoCB4ByBBOyBBItBBJJBHlBBEcBJBBxGeBCpBBCCBDBBRFBJIBiBtBBJpBBXZBnBbBVWBKtCBFjBBK9BBCEBOYBIJBH0BBCRBJmBBK-CBCTBMRBCuBB-BGBCCCBCBCOBCKBH6BBGJBHDBCHBDBBDVBCGBCBBCEBCJBDBBDCBDHHGGBDGBEEBMJBCDDClBBCJBCDDCDBCJBCBBJBBe7CBCEBfnCBJJBnF1BBDlBBjBkCBMJBHMBU5BBHJBHTBdaBDOBFWB6F7BBlDyCBNHBDDDBGBCBBCdBCBBDLBKJBnCHBDtBBDKBcnCBJyCBOoCBIJB3CHB5ChBBPJBHIBCsBBCNBLcBEfBDVBCNBqCGBCBBCrBBECCBCCBHBJJBHFBCBBCkBBCBBCFBIJBHrBBFJB3HYBIQBCoBBEcB2CQQBwBBO6cBnDuDBCEBMjGBtyCiDBOvhBBRVBL68DBGmSB61G5BBn2B4RBIeBCJBFwCBCJBHdBDFBLlCBLJBCGBCUBGSBxN5BBnG6CBGYBDYBtBqCBF4BBIQBhCEBMGBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBDDBh7D8HBEzNBHWBQQBQtBBDWBKzDB9B1HBLmBBDpCBJvDBWlCB7DTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBD9VBQEBCOBxiBeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBENBDJBFBBhKeBS5BBGxOxOBoBB3GqBBFhGhGBdBCVBJBBhHGBCDBCBBCOBCkGBDPBqBrCBFJBFBByYjCBtC8BBjGDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBBvIrBBFjDBNOBDOBCOBCkBBLtFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBmgB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIBnkzVvHB", false));
    return this._Print;
  }
  static CATEGORIES = new LazyMap({
    C: () => new UnicodeRangeTable(decodeRanges("AfBgDgBBOrWrWBHHBCBICCVuMuMnBBBzBBBE4B4BBGBcDBHQBXhGhGxBBB8BBBmDNB8BBByBBBQddBCCMEBhBGBsCiFiFJBBDBBXIICCBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBPMMBEB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKMMBDBbEByBPBDBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCB-FCBHBBHBBHBBECBIIIBLBDBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIB-BGGBLBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMBxhBPBXJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBF-6DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBrCHBxDUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIlkzVBxHvw-FB", false)),
    Cc: () => new UnicodeRangeTable(decodeRanges("AfgDgB", true)),
    Cf: () => new UnicodeRangeTable(decodeRanges("tFzqBzqBBEBXhGhGyBhMhMBxCxCs5D9-B9-BBDBbEByBEBCJBw03B6H6HBBBimEQQj7IPBhjiBDBwmFHBn0rYffB+CB", false)),
    Cn: () => new UnicodeRangeTable(decodeRanges("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBDBvzIBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-BB---BBB---BBB", false)),
    Co: () => new UnicodeRangeTable(decodeRanges("gg4B-nGh4hc9--BD9--B", true)),
    Cs: () => new UnicodeRangeTable(decodeRanges("gg2B--B", true)),
    L: () => new UnicodeRangeTable(decodeRanges("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICCiEEBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoCaBFDBuBqBBkBBBCiDBCQQBIIBLLBBBDRRCdBe4CBMZZBfBKBBFGGBUBFKKEYYBXBIKBGXBCGBRpBB7B1BBETTIJBQPBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNGB7BBBCCCBDBCXBCCCBIBCBBKDDBDBCWWBCBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNSSBkBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBkBFFkC4CBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBzC+C+CBtBBSHB3BdBOBBLrBBbjBBqBCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBhC1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBF1B1BB8zC8zCBjHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBxC2O2OBrBrBBDBGBBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBReBDlCByBIBDmDBDxCBVQBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBdRRBDBCJBLEBCoBBYCBCHBVWBEEEBwBBCEEBDDBDBDCCZCBDKBICBNFBDFBDFBKGBCGBCqBBCNBHyDBej9KBNWBFwBBloItLBDpDBnBGBNEBGCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBxB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOjBBnBbBKWB7HpBBHBBRFB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB1D-BBgBHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBqBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBGjCjCBLBhCBBCPPBNNB0mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBn7F0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFBmI9BBzEsBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCCBCBBCGBDEBKBBhHGBCDBCBBCOBCkGB8BjCBI1lB1lBBCBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB", false)),
    LC: () => new UnicodeRangeTable(decodeRanges("hCZBHZB7BLLBVBCeBCiGBCDBFvGBDZBhGDBDBBECBCHHCCBCCCBSBCyCBCqEBJlFBClBBKoBB44ClBBCGGDqBBDCBhV1CBDFBjkCKBGqBBDCBhCrBBgCMBChBBmD1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGBmIFFDJBCEEBDBHGCBCBCFBFDDBCBGEBF1B1BB8zC8zCB6DBDmDBHDBEBBNlBBCGGzoetBBTbBnEtCBCWBEDBCsCBZBBE2Z2ZBpBBGIBIvCBh6TGBNEBqgBZBHZBmlBvCBhDjBBFjBB1DKBCOBCGBCBBCKBCOBCGBCBBk2ByBBOyBB+CVBLVB74C-BBhrV-BBhBYBDYBtpZ0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BJBCTBHFB2uCjCB", false)),
    Ll: () => new UnicodeRangeTable(decodeRanges("hDZB7BqBqBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDZBiGCCEEEBBBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBDCB5XFBjkCIBC2D2DBqBBgCMBChBBnD0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBBzIEEBEEcKFDBBJDBF2B2Bs1CvBBCEEBGCFCCBCCBEBGiDCBIICFFNlBBCGG0oesBCUaCoEMCBBBC+BCBGBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCbEE2ZqBBGIBIvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFB4vChBB", false)),
    Lm: () => new UnicodeRangeTable(decodeRanges("wVRBFLBPEBICCmEGG-OnHnHlFBBuIBBFgBgBKEEhFoFoF1mBgEgE2R72B72BsDkTkTxOFBvF+BBOjBjBBjBByVOORMBg-CBByHgGgG2OsBsBBDBGiDiDB+C+CBBB34bjnBjnBBEBvIzDzDdBB6DIBxCYYpDDBEBB2OXXqEtDtDWBBoDDBKngVngVuBBBh-BFBCpBBCIB0sBhBhB2K04D04DnrTDB9PCBpBBBnRMBhCBBCPPB9-P9-PBCBCGBCBByhM9BBqGGBud0Q0QsSAB", false)),
    Lo: () => new UnicodeRangeTable(decodeRanges("qFQQhIFFBCBxGBB7ZaBFDBuBfBCJBkBBBCiDBCZZBLLBBBDRRCdBe4CBMZZBfBWVBrBYBIKBGXBCGBRoBB8B1BBETTIJBROBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNFB8BBBCCCBDBCXBCCCBIBCBBKDDBDBYDBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNyDyDBnKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPByDrTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBpBkCkCBhBBC0BBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBxFuBBSHB3BdBOBBLrBBbjBBqBCBLdByDDBCFBCBBE7hB7hBBCB4-C3BBZWBKGBCGBCGBCGBCGBCGBCGBCGBoR2B2BF1CBJCCB4CBFGGBpBBC9CBSfBxBPBhQ-tGBhC0wUBC2jBBkCnBBJrIBFPBLBBjCyByBBkCBqFoDoDEGBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBuBEBDIBLEBCoBBYCBCHBVPBCFBEEEBwBBCEEBDDBDBDCCZBBEKBIPPBEBDFBDFBKGBCGByEiBBej9KBNWBFwBBloItLBDpDBkCCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBqDJBCsBBDeBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBhEtCBjDnBBJzBB9CzBBN2JBKVBLHB5EFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4FjBBnBDBCxJxJBoBBHBBRCBCBB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB0GHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBnBBCBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBB0BUBGSB0NnBB2MqCBGwFwFB0mHBqBfBiDyDBuwIiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBxzI2P2PBrBBiBiKiKBcBTrBBlPaBmHdBDwGwGBdBCCBCBBCGBDEBKiHiHBFBCDBCBBCOBCkGB8pBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB", false)),
    Lt: () => new UnicodeRangeTable(decodeRanges("lOGDnB2sH2sHBGBJHBJHBNQQwBAB", false)),
    Lu: () => new UnicodeRangeTable(decodeRanges("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBG+B+B9zCvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBB", false)),
    M: () => new UnicodeRangeTable(decodeRanges("gYvDB0IGBoIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCgBB3BCBCRBCGBLBBeCB5BCCBFBDBBDCBKLLBbbDCB5BCCBDBFBBDCBEffBEEMCB5BCCBGBCCBCCBVBBXFBCCB5BCCBFBDBBDCBICBLBBf8B8BBDBECBCDBKpBpBBDB4BCCBFBCCBCDBIBBMBBeCB5BCCBFBCCBCDBIBBMBBQNNBCB4BBBCGBCCBCDBKLLBeeBBBnCFFBEBCCCBGBTBB+BDDBFBNHBjDDDBHBMGBqCBBcECFBByBTBCBBGKBCjBBKlDlDBSBYDBFCBCCBDGBEDBOLBCLLBCBgWCBzdDBdCBeBBfBBhCfBKuBuBBBBC2D2DBjBjB3DLBFLB8GEB6BJBCcBDxBxBBsBBDLBVEBwBQBnBIBNCBfMB5BNBxBTB5ECBCUBFHHDCBnG-BBxWgBB--CCBuEhDhDBeBrRFBqDBB1udDBCJBhBBBxCBBxIEEFYYBDBF0C0CBzBzBBQBbRBOnBnBBGBaMBtBDBwBNBlBkCkCBMBNJJBuBuBBBBzBCCBBBDBBGBBCqBqBBDBGBBtHHBCBBx5TiXiXBOBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB7DCB2BOBqBDDBLLBCBuBKBI+B+BBBBlBNBRBBtBNNBBBxBNBJDBCBB9CLBHDD+ELBWDB4BBBCGBDBBDCBKLLBDDBFBEEBkCIBCDDCDBCEBCPPBzCzCBQBYyCyCBSBsHGBDIBcBBzCQBrDMBmDOBhIOB2HFBCBBDDBCCCBuEuEBFBDGBEddBIBpBGBCDBJKKBJBvBPBnGHBoGHBCHBzCVBCNB7DFBECCBCCBFBCjCjCBDBCBBCEB8KDBKBBCxBxBBFBEEBYmnFmnFHOBpmLRBhuCEB8BGB5gBCCB1BBIDByCMMBslTslTBizEizEBsBBDWB-QEBEFBJHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB", false)),
    Mc: () => new UnicodeRangeTable(decodeRanges("joC4B4BDCBJDBCBBzBBB7BCBHBBDBBLsBsB7BCBjC7B7BBBBJCCB2B2BB7B7BCHHBDDBLLnDBBCBBECBCCBLqBqBBBB+BDB+BBB7BCCBDBDBBCBBKBBdPPB7B7BBBBGCBCCBLrBrBBsCsCBBBHHBTBBrKBBgCsFsFBFFHDDBaaBLLBBBDGBWBBDFBDLLBBB5zBffiEIIBGBCBB7KDBDCBFBBCFBhHBB7BCCKCCBJJBEByExBxBGCCBDBCBB+BffFBBD9B9BDCBCEEBxBxBBGBJBBsFWW35EBB0-dBBD5C5CBzBzBBOBvEBBwBxBxBBFFBDDBBBvDBBDBBZuBuBCuDuDDBBGuHuHBCCBCCBCC0gZCCgEuBuBBBBFBB0DZZB8B8BxBCBKBBO+C+CBBBEBBCrFrFBBBgBBB7BBBCDBDBBDCBKLLB1C1CBBBIDDCDBCBBCmDmDBBBJBBErDrDBBBHCCBCBDuHuHBBBHDBDyDyDBBBJBBCuDuDCBBHoDoDCBBFmImIBBBK4H4HBEBCBBFDDCvEvEBBBJDBF1C1CeBB-BqGqGECCoGPPrDIID2G2GBDBFBBC-K-KBNNxBBBJBBCpvQpvQBBBlxD2BBpDBB0rYBBHFB", false)),
    Me: () => new UnicodeRangeTable(decodeRanges("okBBB1xF-wB-wBBCBCCBsshBCB", false)),
    Mn: () => new UnicodeRangeTable(decodeRanges("gYvDB0IEBqIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCfB4BCCFHBFEEBFBLBBe7B7BFDBJVVBbbDBB6BFFBFFBDDBBBEffBEEMBB6BFFBDBCBBFVVBXXBEBC7B7BDCCBCBJIIBMMBff+BNNzBEE4BCCBBBGCBCDBIBBMBBe7B7BDHHGBBVBBdBB6BBBFDBJVVBeepCIIBBBC7C7CDGBNHBjDDDBHBMGBqCBBcEC4BNBCEBCBBGKBCjBBKnDnDBCBCFBCBBDBBaBBFCBRDBODDBHHQgWgWBBBzdCBeBBfBBfBBhCBBCGBJDDBJBKuBuBBBBC2D2DBjBjB3DCBFBBKHHBBB8GBBD7B7BCGBCCCDHBHJBDxBxBBMBCeBDLBVDBxBCCBDBCGGpBIBNBBhBDBDBBCCB5BCCBEECCB7BHBDBB5ECBCMBCGBFHHEBBnG-BBxWMBFEEBKB--CCBuEhDhDBeBrRDBsDBB1udFFBIBhBBBxCBBxIEEFaaBGG4EBBbRBOnBnBBGBaKBvBCBxBDDBCBDBBoBkCkCBEBDBBDBBNJJwB0B0BCCBDBBGBBCrBrBBJJvHDDFx5Tx5TiXPBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB8D3B3BBNBqBDDBLLBBByBDBDBBI+B+BBBBlBEBCHB-BNNB1B1BBHBLDBDgDgDBBBDCCBHHD+E+EEHBWBB6BBBEmBmBBFBEEBnCFBOECPBB2CHBDCBCYY1CFBCFFBCCBvHvHBCBHBBCBBcBB2CHBDCCBrDrDCDDBEBCmDmDCDDBCBCEBkIIBCBBhIBBCFFxEDBDBBFhBhBBIBpBFBDDBJKKBEBDCBvBMBCBBnGCCBBBCqGqGBFBCFBCzCzCBUBDGBCBBCBB7DFBECCBCCBFBCpCpCBEEC8K8KBMMB1B1BBDBGCCYmnFmnFHOBpmLLBECBhuCEB8BGB5gBgCgCBCByC5lT5lTBizEizEBsBBDWBhRCBSHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB", false)),
    N: () => new UnicodeRangeTable(decodeRanges("wBJB5DBBGDDBBBitBJBnEJBnGJB9MJB3DJBFFBtDJB3DJB3DJBDFBvDMB0DJBJGBoDJBpDGBISBuDJBhDJB3DJBnCTBtIJBnCJBwWTBybCBwHJBHJBXJBtJJBhEKBmFJBHJB3FJB3CJBnEJBHJB3gBEEBEBHJBnGyBBDEB3W7BBvCVB3TdBqrBqYqYaIBPCB4KDBrEJBfHBCOBhBJBoBOBh7cJB9FJBhKFB7EJBnBJBnGJBXJB3CJB3MJB34UJBuPsBBN4BBSBB2KaBlBDBeJJnEEBrGJBvdHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBxBJBHJB3IeB-EJBrBDBxDGBnEdBhEJB9BJBxEJBITB8HJB3KJB3DJB3LJBnDJBHTBtCLBlNSB+CJB3UJB3CcBkHJBnCJB3BJBnLJBnDUBshBuDBimPJBnpCJB3CJBnEJBCGBvQJBnIWB+KCB6nXJBnuBTBNTBtDYB2iBxBBhqCJBnNJB3PJB4HJBtWIBhEJB4Y6BBCCBCDBtCsBBCOBjeMBk3CJB", false)),
    Nd: () => new UnicodeRangeTable(decodeRanges("wBJnxBJnEJnGJ9MJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJhDJ3DJnCJ3IJnCJn6BJnBJtJJhEJnFJHJ3FJ3CJnEJHJnuiBJnVJnBJnGJXJ3CJ3MJ34UJnsBJnkCJHJ9YJhEJ9BJxEJ3IJ3KJ3DJ3LJnDJHTtCJnNJnDJ3UJ3CJ3HJnCJ3BJnLJ3uQJnpCJ3CJnEJ3QJ37XJ12CxBhqCJnNJ3PJ4HJ2aJ30EJ", true)),
    Nl: () => new UnicodeRangeTable(decodeRanges("u3FCBwzCiBBDDB-zDaaBHBPCBs1dJBxyW0BBtOJJnEEBrhIuDBm8SCB", false)),
    No: () => new UnicodeRangeTable(decodeRanges("yFBBGDDBBB2pCFB5LFB5DCBmEGB6GGBSIByNJB2hBTB0jBJBhP20B20BEFBHJBnGPBqB3W3WB6BBvCVB3TdBqrB1kB1kBBCBrEJBfHBCOBhBJBoBOBxrdFBymWsBBiCDBSBB2KaBlBDB1pBHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBhLeB-EJBrBDBxDGBnETB8LTBmqBBBvNIBobSB0aUBn8SGB-YWBqhZTBNTBtDYBvqFIBid6BBCCBCDBtCsBBCOBjeMB", false)),
    P: () => new UnicodeRangeTable(decodeRanges("hBCBCFBCDBLBBEBBbCBCccCkBkBGEELBBEEE-VJJzOFBqBBB0BCCDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCmBmBBCBoCrCrCBDBFBBwDFBsFlTlTBHB4EuTuTtBBBvCCBoCBB+ECBCCBmBKB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBM9Z9ZBWBJTBCMBCLBfBBPBB6TDBeBB+hBNBwCBBgBJB0MVBgCDBhBBB8XDBCBBxDwEwEBtBBCfBDLBkNCBFJBDLBRNNjD7C7CjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HzqUzqUBxGxGBIBXiBBCNBCFFCBB2ECBCFBCDBLBBEBBbCBCccCCCBFB7MCB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDByO-J-JjBlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB", false)),
    Pc: () => new UnicodeRangeTable(decodeRanges("-Cg-Hg-HBUU-u3BBBZCBwHAB", false)),
    Pd: () => new UnicodeRangeTable(decodeRanges("tB9qB9qB0BiyDiyDmgBqgCqgCBEBiwDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J", false)),
    Pe: () => new UnicodeRangeTable(decodeRanges("pB0B0BgB+1D+1DC-6B-6BqtC4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECtBGCtNICEGCDBB-ozB6G6GeOCESSCCCrF0B0BgBGD", false)),
    Pf: () => new UnicodeRangeTable(decodeRanges("7F+6H+6HEddpuDCCFDDQEE", false)),
    Pi: () => new UnicodeRangeTable(decodeRanges("rFt7Ht7HDBBDaapuDCCFDDQEE", false)),
    Po: () => new UnicodeRangeTable(decodeRanges("hBCBCCBDECBLLBEEBcclCGGPBBI-V-VJzOzOBEBqB3B3BDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCxDxDrCEBFBBwDFBsFlTlTBHBmY9D9DBBBoCBB+ECBCCBmBFBCDB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBMjajaBJJBGBJIBDDBDCBEKBCCCBIB7kDDBCBBxDwEwEBFFBBBDDDBHBCBBCDDBLLBDBCJBDDBCCCBLBDCBtNCB6B+F+FjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HlxUlxUBFBDXXVBBDDBECBCDBICBHCCB2E2EBBBCCBDECBLLBEEBcclBDDB7M7MBBB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDB0ZlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB", false)),
    Ps: () => new UnicodeRangeTable(decodeRanges("oBzBzBgB-1D-1DC-6B-6B-rCEEnB4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECaTTCECtNICEGCDipzBipzB4GeeCMCESSCCCrFzBzBgBEEDAB", false)),
    S: () => new UnicodeRangeTable(decodeRanges("kBHHRCBgBCCcCCkBEBCBBDCCBCBDEEfgBgBrODBNNBGGBCCCBPB2DPPBxDxDsErIrIBBB3DCBDDDBvGvGLUUB4H4HIBBpEqLqLBHHB2H2H-DjEjEBGBlEwGwGqBmGmGiGCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WuLuLlL+E+EBgBBiLJBKIBhiBCCBBBMCBOCBOCBOBBmCOOoBCBOCBUhBB-BBBCDBCBBLCCBBBGFBCECFMMBFFBDBGDBC7B7BBFFB2LBFcBD+HBXKByCtCBXnTBtBwBBDeBLyMBX+BBFfBD1LBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBB8CBB0HBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BB6RWBKBBoDBB+EDBLDB+RCBiHPPB+9T+9TpEgBBuLPBhCBB3BHBtBDBjDCCBBBD7E7EHRRBBBgBCCcCCiEGBCGBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSmWmWBiKiKBGBnjC2kC2kCBbBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQQBgDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBrbaagBaagBaagBaagBaa9B-PB4BDBzBHBCNBCBBp2BwNwNttCEE+DiOiOBvIvIBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB", false)),
    Sc: () => new UnicodeRangeTable(decodeRanges("kB+D+DBCBqnB8D8DzPBBzPBBI2H2HoImSmS8sClmClmCBgBB37hBkuVkuVtD7E7E8GBBEBB3-HDB-4wBxtCxtC", false)),
    Sk: () => new UnicodeRangeTable(decodeRanges("+CCCoCHHFEEqQDBNNBGGBCCCBPB2DPPBjoBjoB15FCCBBBMCBOCBOCBOBB9kEBBkzdWBKBBoDBBxePPBniUniUBPB8bCCjF4g9B4g9BBDB", false)),
    Sm: () => new UnicodeRangeTable(decodeRanges("rBRRBBB+BCCuBFFmBgBgB-XwQwQBBB8xGOOoBCBOCBsEoBoBBDBHlClCBDBGBBFGDIgBgBBDDCgBgBBqIBhBBB7CffBXBpBFB2OKK3BHBwDxKxKBDBDeBLPBhIiEBX+BBFfBDhIBxBUBDFB9+zB5Z5ZCCBlFRRBBB+BCCkEHHBCBitDBBhrwBx+Bx+BagBgBagBgBagBgBagBgBat5Ft5FB-uC-uCBHB", false)),
    So: () => new UnicodeRangeTable(decodeRanges("mFDDFCCyerIrIBgEgEBvGvGLUUB4H4HkQ2L2LjEFBClElEwGqBqBoMCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WzWzW+EhBBiLJBKIBksBBBCDBCBBLCCBHHBEBCECFMMBPPCBBC7B7BBKKBDBDDBCBBCBBCGBCeBDBBCCCBdBtIHBFTBDGBDwCBCdBanBBHnCBXKByCtCBX2FBCIBC1BBJuDBC3HBtBrBBhC-HBhQvBBWBBHmBBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBBxKBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BBibDBLBBC+R+RBBBqqUPBuLPBhCBB3BHBuBCBlPEEFBBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSpgBpgBBGBnjC2kC2kCBGBFQBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQPBhDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBqlB-PB4BDBzBHBCNBCBBp2B96C96CiEyWyWBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E6HBG4WBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBB-B3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB", false)),
    Z: () => new UnicodeRangeTable(decodeRanges("gBgEgEgvFgsCgsCBJBeBBGwBwBh9DAB", false)),
    Zl: () => new UnicodeRangeTable(decodeRanges("ohIA", true)),
    Zp: () => new UnicodeRangeTable(decodeRanges("phIA", true)),
    Zs: () => new UnicodeRangeTable(decodeRanges("gBgEgEgvFgsCgsCBJBlBwBwBh9DAB", false)),
    ASCII_Hex_Digit: () => new UnicodeRangeTable(decodeRanges("wBJIFbF", true)),
    Alphabetic: () => new UnicodeRangeTable(decodeRanges("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICC3CeeBQBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoBNBCCCBCCBCCJaBFDBeKBG3BBCGBPlDBCHBFHBFCBLCBDRRBuBBOkDBZgBBKBBFGGBWBDSBUYBIKBGXBCGBIJJBoBBLLBEGBHrCBCPBCCBFOBOSBCHBDBBDVBCGBCEEBCBEHBDBBDBBCJJFBBCEBNBBLFFBBBCFBFBBDVBCGBCBBCBBCBBFEBFBBDBBFIIBCBCSSBEBMCBCIBCCBCVBCGBCBBCEBEIBCCBCBBEQQBCBWDBFCBCHBDBBDVBCGBCBBCEBEHBDBBDBBKBBFBBCEBORRBCCBEBECBCDBEBBCCCBEEBEEBBBELBFEBECBCCBEHHpBMBCCBCWBCPBEHBCCBCCBJBBCCBCBBDDBdDBCHBCCBCWBCJBCEBEHBCCBCCBJBBGCBCDBOCBNMBCCBCoBBDHBCCBCCBCGGBCBIEBXFBCCBCRBEXBCIBCDDBFBJFBCCCBGBTBBO5BBGGBH0B0BBECBDBCXBCCCBRBCCBDEBCHHPDBhBgCgCBGBCjBBFSBFPBCjBBkC2BBCDDBDBR-BBLDBDlBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBEKBITBMUBNTBNMBCCBCBBNzBBDSBPFFkC4CBIqBBGlCBLeBCLBFIBYdBDEBMrBBFZB3BbBF+BBDTBzBYYBMMBBByBzBBCOBCHB0BpBBDDBLrBBCKBP2BBXCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBUhBBM1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBFSSBnBBuZzBB34BkHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBCfBwB2O2OBBBaIBIEBDEBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBGHBEwDBoBIBDmDBDxCBVUBCgBBZzBBNjCBCtBtBBEBECCBBBLgBBGiBBOcBEyBBCLBQRRBOBLEBC2BBKNBTWBEkCBCCCZCBDPBDDBMFBDFBDFBKGBCGBCqBBCNBH6DBWj9KBNWBFwBBloItLBDpDBnBGBNEBGLBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmC0BBsIcBEwBBwBfBOdBGqBBGdBDjBBFHBCEBrB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCDBCBBGHBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOnBBjBbBEGGBVB7HpBBCBBEBBRFBzBCBEcBLJJBUBrBRBvBUBcWBKlCBsBEBL4BBKOOBXBYyBBSDBJiBBEKKB+BBCDBKBBLCCkBRBChBBDHHBCB-BGBCCCBCBCOBCJBI4BBYDBCHBDBBDVBCGBCBBCEBEHBDBBDBBEHHGGBdJBCDDClBBCJBCDDCDBCBBECCtBhCBCCBCDBVCBfhCBDBBC5F5FB0BBDGBaFBjB+BBCEE8B1BBDoCoCBZBDNBWGB6F4BBoD-BBgBHBDDDBGBCBBCdBCBBDBBDDB+CHBDtBBDFBCCCBccBxBBDJBSnCBGTTBnCBoDHB5CgBBgBIBCsBBCGBCyByBBcBDVBCNBqCGBCBBCrBBECCBCCBBBCDDBZZBEBCBBCkBBCBBCDBCYYBqBBlIWBKQBCoBBECBwDwCwCB4cBnDuDBSjGBtyCgDBQvhBBSFBa68DBGmSB61GuBBy2B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBF4BBIQBhCBBCNNBFBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBFi7Fi7FBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCVBJBBhHGBCDBCBBCOBCkGB8BjCBEEE1lBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1TZBHZBHZB3zD-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB", false)),
    Dash: () => new UnicodeRangeTable(decodeRanges("tB9qB9qB0BiyDiyDmgBqgCqgCBEB+BoBoBQnMnMlgDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J", false)),
    Emoji: () => new UnicodeRangeTable(decodeRanges("jBHHGJBwDFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDrGrGhFBBNBBPDDBIBsCZBCBBYVVDIBWBBvFhBBDvDBDBBCCBDyCBDCBCmIBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDDBEJBECCBEEDJBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB", false)),
    Emoji_Component: () => new UnicodeRangeTable(decodeRanges("jBHHGJB0+H2G2Gsp3B3+8B3+8BBYB8PEBxtBDBtzhY-CB", false)),
    Emoji_Modifier: () => new UnicodeRangeTable(decodeRanges("7-8DE", true)),
    Emoji_Modifier_Base: () => new UnicodeRangeTable(decodeRanges("9wJ8G8GRDB4jzD9B9BBBBDDDBBB2DBBDKBWSBEFFBBBCCBICCZqGqGBFFWFFBvFvFBBBEEB0CRRBBBKMMgSDDJHBHKKBIBDCB5B+B+BBCCBCCSCBCMBmHCBrBIB", false)),
    Emoji_Presentation: () => new UnicodeRangeTable(decodeRanges("64IBBuGDBEDDqQBBWBBzBLBsBUUOJJBSSBGGBJJGWWIBBCFFDIIFBBdkBkBCFFBBBC+B+BBBBZPP8aBB0BFFvlxDrGrG-FDDBIBsCZBCZZVDDBDBCCBWBBvFgBBNIBClCBCVBNqBBFEBNQBEEEBlCBCCCB5FBD+BBODBCXBTbbBOO3C0CBxBlCBHEEBBBDDBEDBMBBIIBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB", false)),
    Extended_Pictographic: () => new UnicodeRangeTable(decodeRanges("pFFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDoBoBBCBlDLBQBBQPPBmBmBBIBxDBBNBBPDDBIBU3BBcOBLVVDIBCDBKWBH7FBDvDBDBBCCBDyCBDCBCDBG9HBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDQBECCBEBDMB7GlBBNDB5BHBLFBpBHBfBBNDBDNBKmBBNuBBCJBC4FB5CHBPxEBhI9fB", false)),
    Hex_Digit: () => new UnicodeRangeTable(decodeRanges("wBJIFbFq1-BJIFbF", true)),
    Lowercase: () => new UnicodeRangeTable(decodeRanges("hDZBwBLLFlBlBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDiBBIBBfEBhDsBsBCEEDDBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBCDB5XFBjkCIBC2D2DB+FBiC0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBB6DOORMBuDEEBEEcKFDBBJDBFiBiBBOBFsasaBYBn6BvBBCEEBGCFCCBCCBGBEiDCBIICFFNlBBCGG0oesBCUaCBBBmEMCBBBC8BCBIBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCWDBCCCBBB2ZqBBCNBHvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBkODDBBBCpBBCIBmoByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFBmI9BB1lChBB", false)),
    Math: () => new UnicodeRangeTable(decodeRanges("rBRRBBBgBeeCuBuBFmBmBgB5W5WBBBDbbBDDBBBwQCBuwGccBBBMEEOPPBCBWEBMEBiCMBFEEBFFBDBTFFDJBCDDBEBHEEBDDBCCBBBCFBENBClClCBWBCFBCBBFBBFfBCHHBPPBqIBJDBVBB7CffBZBCZZMGB+NBBNJBFFBFBBDBBEEBPCCDFBMHBGBB6BCCeDBKCBxK-BBhI-PBxBUBDFB9+zB4Z4ZBEBCjFjFRCBeCCeCCkEHHBCBitDBBhrwBwoBwoBBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBBhwFDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB-uCIB", false)),
    Quotation_Mark: () => new UnicodeRangeTable(decodeRanges("iBFFkEQQ96HHBaBBowDqOqOBCBOCBixzBDB+FFF7CBB", false)),
    Terminal_Punctuation: () => new UnicodeRangeTable(decodeRanges("hBLLCMMBEE-ZJJiQ6B6BpCPPCCB1FsBsBBJBCsHsHB3B3BBEBCHBgBmImIB1nB1nBBtFtFFFB4JBB2YHBmY9D9DBBBoCBB+ECBEoBoBBCBDBB7JBBjLDBjFBBLBBCCBeCB8FEB-BBBldYYBKKBBBwlDCBzJOOFLLCBBEBBtNBB8ndBBuICBkHEB-LBB3CBBgD4E4EBBB0ECBgERRB6H6HnxUDDB6B6BBBBCDBqFLLCMMBEEiCDD7hBxBxBnkBoGoG3JBB5EFBlCFB6CDB5dEBtBDB+FGBxDDBgECBiEBBHRRB5C5CBDBtDrJrJB2D2DBBBNBBnLDBEOBqDBB6HCBmQCC8HBB4CBBFBB-MCBuBmUmUBrCrCBspBspBBDB6vRBBmEiCiCBBBLqRqRBoJoJBnwTnwTovHDB", false)),
    Uppercase: () => new UnicodeRangeTable(decodeRanges("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBGbbBOBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBBvgCZBHZBHZB", false)),
    White_Space: () => new UnicodeRangeTable(decodeRanges("JEBTlDlDbgvFgvFgsCKBeBBGwBwBh9DAB", false))
  });
  static get Upper() {
    return this.CATEGORIES.get("Lu");
  }
  static SCRIPTS = new LazyMap({
    Adlam: () => new UnicodeRangeTable(decodeRanges("go6DrCFJFB", true)),
    Ahom: () => new UnicodeRangeTable(decodeRanges("g4lCaDOFW", true)),
    Anatolian_Hieroglyphs: () => new UnicodeRangeTable(decodeRanges("ggxCmS", true)),
    Arabic: () => new UnicodeRangeTable(decodeRanges("gwBEBCFBCNBCCBCfBCJBMZBCrDBChBBxCvBBxHhBBGqCBCcBxy8BtPBDvEBhBPBxDEBCmEBk7DeBkCFBJIBiBFBh43BDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB", false)),
    Armenian: () => new UnicodeRangeTable(decodeRanges("xpBlBDxBDCks9BE", true)),
    Avestan: () => new UnicodeRangeTable(decodeRanges("g4iC1BEG", true)),
    Balinese: () => new UnicodeRangeTable(decodeRanges("g4GsCCxB", true)),
    Bamum: () => new UnicodeRangeTable(decodeRanges("g1pB3CpowB4R", true)),
    Bassa_Vah: () => new UnicodeRangeTable(decodeRanges("w26CdDF", true)),
    Batak: () => new UnicodeRangeTable(decodeRanges("g+GzBJD", true)),
    Bengali: () => new UnicodeRangeTable(decodeRanges("gsCDBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYB", false)),
    Beria_Erfe: () => new UnicodeRangeTable(decodeRanges("g17CYDY", true)),
    Bhaiksuki: () => new UnicodeRangeTable(decodeRanges("ggnCICsBCNLc", true)),
    Bopomofo: () => new UnicodeRangeTable(decodeRanges("qXB6wLqBxDf", true)),
    Brahmi: () => new UnicodeRangeTable(decodeRanges("ggkCtCFjBKA", true)),
    Braille: () => new UnicodeRangeTable(decodeRanges("ggK-H", true)),
    Buginese: () => new UnicodeRangeTable(decodeRanges("gwGbDB", true)),
    Buhid: () => new UnicodeRangeTable(decodeRanges("g6FT", true)),
    Canadian_Aboriginal: () => new UnicodeRangeTable(decodeRanges("ggF-TxRlC7tgCP", true)),
    Carian: () => new UnicodeRangeTable(decodeRanges("g1gCwB", true)),
    Caucasian_Albanian: () => new UnicodeRangeTable(decodeRanges("wphCzBMA", true)),
    Chakma: () => new UnicodeRangeTable(decodeRanges("gokC0BCR", true)),
    Cham: () => new UnicodeRangeTable(decodeRanges("gwqB2BKNDJDD", true)),
    Cherokee: () => new UnicodeRangeTable(decodeRanges("g9E1CDFz7lBvC", true)),
    Chorasmian: () => new UnicodeRangeTable(decodeRanges("w9jCb", true)),
    Common: () => new UnicodeRangeTable(decodeRanges("AgCBbFBbuBBCOBCEBYgBgBiOmBBGEBDTB1DKKHCC+THHPEEhB9E9ElQiEiEB6mB6mB2MDBjJwvBwvBBBBoCBBsGBBCumBumBOIIBCBCFBCCBDmYmYBKBD2CBCKBEKBCOBShBB-BlBBCCBDFBCaBCQBqBCBF5UBXKBW-cBhIzTBDpEBhQ9CBzMUBCCCBXBQHBFDB8CBBE7C7CB0E0EBOBhBlBBKxBxBB+BBgBwCBwB5C5CBmFBhuG-BBhoWhBBnDCBmFJB1HhFhFsMPPBzuUzuUBxGxGBIBXiBBCSBCDB0ECCBeBbFBbKBLuBuBBhChCBFBCGBLEBjICBFsBBEIBxCMB0BsBBlHaBltuBDB96D8HBEzNBHWBQQBgDzDB9B1HBLmBBD9BBEQBJBBIdBF8BB2GTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBByjFjCBtC8BBjWrBBFjDBNOBDOBCOBCkBBLtFB5BZBCBBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBnghYffB+CB", false)),
    Coptic: () => new UnicodeRangeTable(decodeRanges("ifNxkKzDGG", true)),
    Cuneiform: () => new UnicodeRangeTable(decodeRanges("ggoC5cnDuDCEMjG", true)),
    Cypriot: () => new UnicodeRangeTable(decodeRanges("ggiCFBDCCBqBBCBBEDD", false)),
    Cypro_Minoan: () => new UnicodeRangeTable(decodeRanges("w8rCiD", true)),
    Cyrillic: () => new UnicodeRangeTable(decodeRanges("ggBkEBDoFBx6FKBhFtCtCojEfBhie-CBv8VBBhw4B9BBiBAB", false)),
    Deseret: () => new UnicodeRangeTable(decodeRanges("gghCvC", true)),
    Devanagari: () => new UnicodeRangeTable(decodeRanges("goCwCFODZh7nBfhwcJ", true)),
    Dives_Akuru: () => new UnicodeRangeTable(decodeRanges("gomCGBDDDBGBCBBCdBCBBDLBKJB", false)),
    Dogra: () => new UnicodeRangeTable(decodeRanges("ggmC7B", true)),
    Duployan: () => new UnicodeRangeTable(decodeRanges("ggvDqDGMEIIJDD", true)),
    Egyptian_Hieroglyphs: () => new UnicodeRangeTable(decodeRanges("ggsC1iBL68D", true)),
    Elbasan: () => new UnicodeRangeTable(decodeRanges("gohCnB", true)),
    Elymaic: () => new UnicodeRangeTable(decodeRanges("g-jCW", true)),
    Ethiopic: () => new UnicodeRangeTable(decodeRanges("gwEoCBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBnvGWBKGBCGBCGBCGBCGBCGBCGBCGBjpfFBDFBDFBKGBCGBylvCGBCDBCBBCOB", false)),
    Garay: () => new UnicodeRangeTable(decodeRanges("gqjClBEcJB", true)),
    Georgian: () => new UnicodeRangeTable(decodeRanges("glElBBCGGDqBBCDBx8CqBBDCBhiElBBCGG", false)),
    Glagolitic: () => new UnicodeRangeTable(decodeRanges("ggL-Ch9sDGCQDGCBCE", true)),
    Gothic: () => new UnicodeRangeTable(decodeRanges("w5gCa", true)),
    Grantha: () => new UnicodeRangeTable(decodeRanges("g4kCDBCHBDBBDVBCGBCBBCEBDIBDBBDCBDHHGGBDGBEEB", false)),
    Greek: () => new UnicodeRangeTable(decodeRanges("wbDBCCBDDBCFFCCCBBBCCCBSBC+BBPPBnpGEBzBEBFEB1ChKhKBUBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBoJ-xiB-xiB7uVuCBSgj0Bgj0BBkCB", false)),
    Gujarati: () => new UnicodeRangeTable(decodeRanges("h0CCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGB", false)),
    Gunjala_Gondi: () => new UnicodeRangeTable(decodeRanges("grnCFCBCkBCBCFIJ", true)),
    Gurmukhi: () => new UnicodeRangeTable(decodeRanges("hwCCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPB", false)),
    Gurung_Khema: () => new UnicodeRangeTable(decodeRanges("go4C5B", true)),
    Han: () => new UnicodeRangeTable(decodeRanges("g0LZBC4CBN1GBwBCCaIBPDBle-tGBhC-vUBhoWtLBDpDBpodBBNGBqgkB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB", false)),
    Hangul: () => new UnicodeRangeTable(decodeRanges("goE-HvxHBiI9CyDeiCei3dckUj9KNWFwBl9JeEFDFDFDC", true)),
    Hanifi_Rohingya: () => new UnicodeRangeTable(decodeRanges("gojCnBJJ", true)),
    Hanunoo: () => new UnicodeRangeTable(decodeRanges("g5FU", true)),
    Hatran: () => new UnicodeRangeTable(decodeRanges("gniCSCBGE", true)),
    Hebrew: () => new UnicodeRangeTable(decodeRanges("xsB2BBJaBFFBpp9BZBCEBCCCBCCBCCBIB", false)),
    Hiragana: () => new UnicodeRangeTable(decodeRanges("hiM1CBHCBi7-C+IBTeeBBBulQAB", false)),
    Imperial_Aramaic: () => new UnicodeRangeTable(decodeRanges("giiCVCI", true)),
    Inherited: () => new UnicodeRangeTable(decodeRanges("gYvDB2IBBlOKBbhXhXBCB8qEtBBDLBlPCBCMBCGBFHHEBBnG-BBtQBBjGgBB65DDBsDBBmrzBPBRNBwejHjH7iEl+uBl+uBBsBBDWBhRCBSHBDGBfDBz6rYvHB", false)),
    Inscriptional_Pahlavi: () => new UnicodeRangeTable(decodeRanges("g7iCSGH", true)),
    Inscriptional_Parthian: () => new UnicodeRangeTable(decodeRanges("g6iCVDH", true)),
    Javanese: () => new UnicodeRangeTable(decodeRanges("gsqBtCDJFB", true)),
    Kaithi: () => new UnicodeRangeTable(decodeRanges("gkkCiCLA", true)),
    Kannada: () => new UnicodeRangeTable(decodeRanges("gkDMCCCWCJCEDICCCDIBGCCDDJCC", true)),
    Katakana: () => new UnicodeRangeTable(decodeRanges("hlM5CBDCBxHPBxGuBBC3CBvgzBJBCsBBzisBDBCGBCBBCgJgJBBBzBPPBCB", false)),
    Kawi: () => new UnicodeRangeTable(decodeRanges("g4nCQCoBEc", true)),
    Kayah_Li: () => new UnicodeRangeTable(decodeRanges("goqBtBCA", true)),
    Kharoshthi: () => new UnicodeRangeTable(decodeRanges("gwiCDCBGHCCCcDCFJII", true)),
    Khitan_Small_Script: () => new UnicodeRangeTable(decodeRanges("k-7C84G84GB0OBqBAB", false)),
    Khmer: () => new UnicodeRangeTable(decodeRanges("g8F9CDJHJnPf", true)),
    Khojki: () => new UnicodeRangeTable(decodeRanges("gwkCRCuB", true)),
    Khudawadi: () => new UnicodeRangeTable(decodeRanges("w1kC6BGJ", true)),
    Kirat_Rai: () => new UnicodeRangeTable(decodeRanges("gq7C5B", true)),
    Lao: () => new UnicodeRangeTable(decodeRanges("h0DBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDB", false)),
    Latin: () => new UnicodeRangeTable(decodeRanges("hCZBHZBwBQQGWBCeBCgOBoBEB8wGlBBHwBBGDBGMBClCBiC-HByLOORMBuEBBHccSoBB42CfBj1elDBExCBVOBxZqBBCIBCDB38TGB7gBZBHZBmhCFBCpBBCIBm61BeBHFB", false)),
    Lepcha: () => new UnicodeRangeTable(decodeRanges("ggH3BEOEC", true)),
    Limbu: () => new UnicodeRangeTable(decodeRanges("goGeBCLBFLBFEEBKB", false)),
    Linear_A: () => new UnicodeRangeTable(decodeRanges("gwhC2JKVLH", true)),
    Linear_B: () => new UnicodeRangeTable(decodeRanges("gggCLCZCSCBCODNjB6D", true)),
    Lisu: () => new UnicodeRangeTable(decodeRanges("wmpBvBx1eA", true)),
    Lycian: () => new UnicodeRangeTable(decodeRanges("g0gCc", true)),
    Lydian: () => new UnicodeRangeTable(decodeRanges("gpiCZGA", true)),
    Mahajani: () => new UnicodeRangeTable(decodeRanges("wqkCmB", true)),
    Makasar: () => new UnicodeRangeTable(decodeRanges("g3nCY", true)),
    Malayalam: () => new UnicodeRangeTable(decodeRanges("goDMCCCyBCCCFFPDZ", true)),
    Mandaic: () => new UnicodeRangeTable(decodeRanges("giCbDA", true)),
    Manichaean: () => new UnicodeRangeTable(decodeRanges("g2iCmBFL", true)),
    Marchen: () => new UnicodeRangeTable(decodeRanges("wjnCfDVCN", true)),
    Masaram_Gondi: () => new UnicodeRangeTable(decodeRanges("gonCGBCBBCrBBECCBCCBHBJJB", false)),
    Medefaidrin: () => new UnicodeRangeTable(decodeRanges("gy7C6C", true)),
    Meetei_Mayek: () => new UnicodeRangeTable(decodeRanges("g3qBWqGtBDJ", true)),
    Mende_Kikakui: () => new UnicodeRangeTable(decodeRanges("gg6DkGDP", true)),
    Meroitic_Cursive: () => new UnicodeRangeTable(decodeRanges("gtiCXFTDtB", true)),
    Meroitic_Hieroglyphs: () => new UnicodeRangeTable(decodeRanges("gsiCf", true)),
    Miao: () => new UnicodeRangeTable(decodeRanges("g47CqCF4BIQ", true)),
    Modi: () => new UnicodeRangeTable(decodeRanges("gwlCkCMJ", true)),
    Mongolian: () => new UnicodeRangeTable(decodeRanges("ggGBBDCCBSBH4CBIqBB2t-BMB", false)),
    Mro: () => new UnicodeRangeTable(decodeRanges("gy6CeCJFB", true)),
    Multani: () => new UnicodeRangeTable(decodeRanges("g0kCGBCCCBCBCOBCKB", false)),
    Myanmar: () => new UnicodeRangeTable(decodeRanges("ggE-EhqmBeiDfxibT", true)),
    Nabataean: () => new UnicodeRangeTable(decodeRanges("gkiCeJI", true)),
    Nag_Mundari: () => new UnicodeRangeTable(decodeRanges("wm5DpB", true)),
    Nandinagari: () => new UnicodeRangeTable(decodeRanges("gtmCHDtBDK", true)),
    New_Tai_Lue: () => new UnicodeRangeTable(decodeRanges("gsGrBFZHKEB", true)),
    Newa: () => new UnicodeRangeTable(decodeRanges("gglC7CCE", true)),
    Nko: () => new UnicodeRangeTable(decodeRanges("g+B6BDC", true)),
    Nushu: () => new UnicodeRangeTable(decodeRanges("h-7CvsQvsQBqMB", false)),
    Nyiakeng_Puachue_Hmong: () => new UnicodeRangeTable(decodeRanges("go4DsBENDJFB", true)),
    Ogham: () => new UnicodeRangeTable(decodeRanges("g0Fc", true)),
    Ol_Chiki: () => new UnicodeRangeTable(decodeRanges("wiHvB", true)),
    Ol_Onal: () => new UnicodeRangeTable(decodeRanges("wu5DqBFA", true)),
    Old_Hungarian: () => new UnicodeRangeTable(decodeRanges("gkjCyBOyBIF", true)),
    Old_Italic: () => new UnicodeRangeTable(decodeRanges("g4gCjBKC", true)),
    Old_North_Arabian: () => new UnicodeRangeTable(decodeRanges("g0iCf", true)),
    Old_Permic: () => new UnicodeRangeTable(decodeRanges("w6gCqB", true)),
    Old_Persian: () => new UnicodeRangeTable(decodeRanges("g9gCjBFN", true)),
    Old_Sogdian: () => new UnicodeRangeTable(decodeRanges("g4jCnB", true)),
    Old_South_Arabian: () => new UnicodeRangeTable(decodeRanges("gziCf", true)),
    Old_Turkic: () => new UnicodeRangeTable(decodeRanges("ggjCoC", true)),
    Old_Uyghur: () => new UnicodeRangeTable(decodeRanges("w7jCZ", true)),
    Oriya: () => new UnicodeRangeTable(decodeRanges("h4CCCHDBDVCGCBCEDIDBDCICFBCEDR", true)),
    Osage: () => new UnicodeRangeTable(decodeRanges("wlhCjBFjB", true)),
    Osmanya: () => new UnicodeRangeTable(decodeRanges("gkhCdDJ", true)),
    Pahawh_Hmong: () => new UnicodeRangeTable(decodeRanges("g46ClCLJCGCUGS", true)),
    Palmyrene: () => new UnicodeRangeTable(decodeRanges("gjiCf", true)),
    Pau_Cin_Hau: () => new UnicodeRangeTable(decodeRanges("g2mC4B", true)),
    Phags_Pa: () => new UnicodeRangeTable(decodeRanges("giqB3B", true)),
    Phoenician: () => new UnicodeRangeTable(decodeRanges("goiCbEA", true)),
    Psalter_Pahlavi: () => new UnicodeRangeTable(decodeRanges("g8iCRIDNG", true)),
    Rejang: () => new UnicodeRangeTable(decodeRanges("wpqBjBMA", true)),
    Runic: () => new UnicodeRangeTable(decodeRanges("g1FqCEK", true)),
    Samaritan: () => new UnicodeRangeTable(decodeRanges("ggCtBDO", true)),
    Saurashtra: () => new UnicodeRangeTable(decodeRanges("gkqBlCJL", true)),
    Sharada: () => new UnicodeRangeTable(decodeRanges("gskC-ChsCH", true)),
    Shavian: () => new UnicodeRangeTable(decodeRanges("wihCvB", true)),
    Siddham: () => new UnicodeRangeTable(decodeRanges("gslC1BDlB", true)),
    Sidetic: () => new UnicodeRangeTable(decodeRanges("gqiCZ", true)),
    SignWriting: () => new UnicodeRangeTable(decodeRanges("gg2DrUQECO", true)),
    Sinhala: () => new UnicodeRangeTable(decodeRanges("hsDCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBt-gCTB", false)),
    Sogdian: () => new UnicodeRangeTable(decodeRanges("w5jCpB", true)),
    Sora_Sompeng: () => new UnicodeRangeTable(decodeRanges("wmkCYIJ", true)),
    Soyombo: () => new UnicodeRangeTable(decodeRanges("wymCyC", true)),
    Sundanese: () => new UnicodeRangeTable(decodeRanges("g8G-BhIH", true)),
    Sunuwar: () => new UnicodeRangeTable(decodeRanges("g+mChBPJ", true)),
    Syloti_Nagri: () => new UnicodeRangeTable(decodeRanges("ggqBsB", true)),
    Syriac: () => new UnicodeRangeTable(decodeRanges("g4BNC7BDCxIK", true)),
    Tagalog: () => new UnicodeRangeTable(decodeRanges("g4FVKA", true)),
    Tagbanwa: () => new UnicodeRangeTable(decodeRanges("g7FMCCCB", true)),
    Tai_Le: () => new UnicodeRangeTable(decodeRanges("wqGdDE", true)),
    Tai_Tham: () => new UnicodeRangeTable(decodeRanges("gxG+BCcDKHJHN", true)),
    Tai_Viet: () => new UnicodeRangeTable(decodeRanges("g0qBiCZE", true)),
    Tai_Yo: () => new UnicodeRangeTable(decodeRanges("g25DeCVJB", true)),
    Takri: () => new UnicodeRangeTable(decodeRanges("g0lC5BHJ", true)),
    Tamil: () => new UnicodeRangeTable(decodeRanges("i8CBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBm+kCxBBOAB", false)),
    Tangsa: () => new UnicodeRangeTable(decodeRanges("wz6CuCCJ", true)),
    Tangut: () => new UnicodeRangeTable(decodeRanges("g-7CgBgBB+3GBhQeBiDyDB", false)),
    Telugu: () => new UnicodeRangeTable(decodeRanges("ggDMCCCWCPDICCCDIBCCCBDDDJII", true)),
    Thaana: () => new UnicodeRangeTable(decodeRanges("g8BxB", true)),
    Thai: () => new UnicodeRangeTable(decodeRanges("hwD5BGb", true)),
    Tibetan: () => new UnicodeRangeTable(decodeRanges("g4DnCCjBFmBCjBCOCGFB", true)),
    Tifinagh: () => new UnicodeRangeTable(decodeRanges("wpL3BIBPA", true)),
    Tirhuta: () => new UnicodeRangeTable(decodeRanges("gklCnCJJ", true)),
    Todhri: () => new UnicodeRangeTable(decodeRanges("guhCzB", true)),
    Tolong_Siki: () => new UnicodeRangeTable(decodeRanges("wtnCrBFJ", true)),
    Toto: () => new UnicodeRangeTable(decodeRanges("w04De", true)),
    Tulu_Tigalari: () => new UnicodeRangeTable(decodeRanges("g8kCJBCDDClBBCJBCDDCDBCJBCBBJBB", false)),
    Ugaritic: () => new UnicodeRangeTable(decodeRanges("g8gCdCA", true)),
    Unknown: () => new UnicodeRangeTable(decodeRanges("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-FB", false)),
    Vai: () => new UnicodeRangeTable(decodeRanges("gopBrJ", true)),
    Vithkuqi: () => new UnicodeRangeTable(decodeRanges("wrhCKCOCGCBCKCOCGCB", true)),
    Wancho: () => new UnicodeRangeTable(decodeRanges("g24D5BGA", true)),
    Warang_Citi: () => new UnicodeRangeTable(decodeRanges("glmCyCNA", true)),
    Yezidi: () => new UnicodeRangeTable(decodeRanges("g0jCpBCCDB", true)),
    Yi: () => new UnicodeRangeTable(decodeRanges("ggoBskBE2B", true)),
    Zanabazar_Square: () => new UnicodeRangeTable(decodeRanges("gwmCnC", true))
  });
  static FOLD_CATEGORIES = new LazyMap({
    L: () => new UnicodeRangeTable(decodeRanges("laA", true)),
    LC: () => new UnicodeRangeTable(decodeRanges("laA", true)),
    Ll: () => new UnicodeRangeTable(decodeRanges("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGC3HrBrBCEEJHHCCBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHxC9zC9zCBuBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB", false)),
    Lt: () => new UnicodeRangeTable(decodeRanges("kOCCBCCBCClBCCtsHHBJHBJHBMQQwBAB", false)),
    Lu: () => new UnicodeRangeTable(decodeRanges("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpL2B2Bs1CvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB", false)),
    M: () => new UnicodeRangeTable(decodeRanges("5cgBgBlgHAB", false)),
    Mn: () => new UnicodeRangeTable(decodeRanges("5cgBgBlgHAB", false)),
    Emoji: () => new UnicodeRangeTable(decodeRanges("8mJA", true)),
    Extended_Pictographic: () => new UnicodeRangeTable(decodeRanges("8mJA", true)),
    Lowercase: () => new UnicodeRangeTable(decodeRanges("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHuBPBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB", false)),
    Math: () => new UnicodeRangeTable(decodeRanges("ycGDCHHFMMDDDCHHFAB", false)),
    Uppercase: () => new UnicodeRangeTable(decodeRanges("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpLiBiBBOBFsasaBYBn6BvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB", false))
  });
  static FOLD_SCRIPT = new LazyMap({
    Common: () => new UnicodeRangeTable(decodeRanges("8cgBgB", false)),
    Greek: () => new UnicodeRangeTable(decodeRanges("1FwUwU", false)),
    Inherited: () => new UnicodeRangeTable(decodeRanges("5cgBgBlgHAB", false))
  });
};
var Unicode = class Unicode2 {
  static MAX_RUNE = 1114111;
  static MAX_ASCII = 127;
  static MAX_LATIN1 = 255;
  static MAX_BMP = 65535;
  static MIN_FOLD = 65;
  static MAX_FOLD = 125251;
  static MIN_HIGH_SURROGATE = 55296;
  static MAX_HIGH_SURROGATE = 56319;
  static MIN_LOW_SURROGATE = 56320;
  static MAX_LOW_SURROGATE = 57343;
  static MIN_SUPPLEMENTARY_CODE_POINT = 65536;
  static is32(ranges, r) {
    let lo = 0;
    let hi = ranges.length;
    while (lo < hi) {
      const m2 = lo + Math.floor((hi - lo) / 2);
      const rlo = ranges.getLo(m2);
      const rhi = ranges.getHi(m2);
      if (rlo <= r && r <= rhi) {
        const stride = ranges.getStride(m2);
        return (r - rlo) % stride === 0;
      }
      if (r < rlo) hi = m2;
      else lo = m2 + 1;
    }
    return false;
  }
  static is(ranges, r) {
    if (r <= Unicode2.MAX_LATIN1) {
      for (let i = 0; i < ranges.length; i++) {
        if (r > ranges.getHi(i)) continue;
        const rlo = ranges.getLo(i);
        if (r < rlo) return false;
        const stride = ranges.getStride(i);
        return (r - rlo) % stride === 0;
      }
      return false;
    }
    return ranges.length > 0 && r >= ranges.getLo(0) && Unicode2.is32(ranges, r);
  }
  static isUpper(r) {
    if (r <= Unicode2.MAX_LATIN1) {
      const s = String.fromCodePoint(r);
      return s.toUpperCase() === s && s.toLowerCase() !== s;
    }
    return Unicode2.is(UnicodeTables.Upper, r);
  }
  static isPrint(r) {
    if (r <= Unicode2.MAX_LATIN1) return r >= 32 && r < Unicode2.MAX_ASCII || r >= 161 && r !== 173;
    return Unicode2.is(UnicodeTables.Print, r);
  }
  static simpleFold(r) {
    if (UnicodeTables.CASE_ORBIT.has(r)) return UnicodeTables.CASE_ORBIT.get(r);
    const l = Codepoint.toLowerCase(r);
    if (l !== r) return l;
    return Codepoint.toUpperCase(r);
  }
  static equalsIgnoreCase(r1, r2) {
    if (r1 === r2) return true;
    if (r1 < 0 || r2 < 0) return false;
    if (r1 <= Unicode2.MAX_ASCII && r2 <= Unicode2.MAX_ASCII) {
      if (65 <= r1 && r1 <= 90) r1 |= 32;
      if (65 <= r2 && r2 <= 90) r2 |= 32;
      return r1 === r2;
    }
    for (let r = Unicode2.simpleFold(r1); r !== r1; r = Unicode2.simpleFold(r)) if (r === r2) return true;
    return false;
  }
};
var FAST_PATH_TABLE_SIZE = 256;
var WORD_RUNE_TABLE = new Uint8Array(FAST_PATH_TABLE_SIZE);
for (let i = 0; i < FAST_PATH_TABLE_SIZE; i++) WORD_RUNE_TABLE[i] = 97 <= i && i <= 122 || 65 <= i && i <= 90 || 48 <= i && i <= 57 || i === 95 ? 1 : 0;
var cachedNativeEncoder = null;
var cachedNativeDecoder = null;
var Utils = class Utils2 {
  static METACHARACTERS = "\\.+*?()|[]{}^$";
  static EMPTY_BEGIN_LINE = 1;
  static EMPTY_END_LINE = 2;
  static EMPTY_BEGIN_TEXT = 4;
  static EMPTY_END_TEXT = 8;
  static EMPTY_WORD_BOUNDARY = 16;
  static EMPTY_NO_WORD_BOUNDARY = 32;
  static EMPTY_ALL = -1;
  static emptyInts() {
    return [];
  }
  static isByteArray(input) {
    return Array.isArray(input) || input instanceof Uint8Array;
  }
  static isalnum(c) {
    return Codepoint.CODES.get("0") <= c && c <= Codepoint.CODES.get("9") || Codepoint.CODES.get("a") <= c && c <= Codepoint.CODES.get("z") || Codepoint.CODES.get("A") <= c && c <= Codepoint.CODES.get("Z");
  }
  static unhex(c) {
    if (Codepoint.CODES.get("0") <= c && c <= Codepoint.CODES.get("9")) return c - Codepoint.CODES.get("0");
    if (Codepoint.CODES.get("a") <= c && c <= Codepoint.CODES.get("f")) return c - Codepoint.CODES.get("a") + 10;
    if (Codepoint.CODES.get("A") <= c && c <= Codepoint.CODES.get("F")) return c - Codepoint.CODES.get("A") + 10;
    return -1;
  }
  static escapeRune(rune) {
    let out = "";
    if (Unicode.isPrint(rune)) {
      if (Utils2.METACHARACTERS.indexOf(String.fromCodePoint(rune)) >= 0) out += "\\";
      out += String.fromCodePoint(rune);
    } else switch (rune) {
      case Codepoint.CODES.get('"'):
        out += '\\"';
        break;
      case Codepoint.CODES.get("\\"):
        out += "\\\\";
        break;
      case Codepoint.CODES.get("	"):
        out += "\\t";
        break;
      case Codepoint.CODES.get("\n"):
        out += "\\n";
        break;
      case Codepoint.CODES.get("\r"):
        out += "\\r";
        break;
      case Codepoint.CODES.get("\b"):
        out += "\\b";
        break;
      case Codepoint.CODES.get("\f"):
        out += "\\f";
        break;
      default: {
        let s = rune.toString(16);
        if (rune < 256) {
          out += "\\x";
          if (s.length === 1) out += "0";
          out += s;
        } else out += `\\x{${s}}`;
        break;
      }
    }
    return out;
  }
  static stringToRunes(str) {
    const string = String(str);
    const runes = [];
    let i = 0;
    while (i < string.length) {
      const cp = string.codePointAt(i);
      runes.push(cp);
      i += cp > Unicode.MAX_BMP ? 2 : 1;
    }
    return runes;
  }
  static runeToString(r) {
    return String.fromCodePoint(r);
  }
  static isWordRune(r) {
    return r < FAST_PATH_TABLE_SIZE ? WORD_RUNE_TABLE[r] === 1 : false;
  }
  static emptyOpContext(r1, r2) {
    let op = 0;
    if (r1 < 0) op |= Utils2.EMPTY_BEGIN_TEXT | Utils2.EMPTY_BEGIN_LINE;
    if (r1 === 10) op |= Utils2.EMPTY_BEGIN_LINE;
    if (r2 < 0) op |= Utils2.EMPTY_END_TEXT | Utils2.EMPTY_END_LINE;
    if (r2 === 10) op |= Utils2.EMPTY_END_LINE;
    if (Utils2.isWordRune(r1) !== Utils2.isWordRune(r2)) op |= Utils2.EMPTY_WORD_BOUNDARY;
    else op |= Utils2.EMPTY_NO_WORD_BOUNDARY;
    return op;
  }
  /**
  * Returns a string that quotes all regular expression metacharacters inside the argument text;
  * the returned string is a regular expression matching the literal text. For example,
  * {@code quoteMeta("[foo]").equals("\\[foo\\]")}.
  * @param {string} str
  * @returns {string}
  */
  static quoteMeta(str) {
    return str.split("").map((s) => {
      if (Utils2.METACHARACTERS.indexOf(s) >= 0) return `\\${s}`;
      return s;
    }).join("");
  }
  static charCount(codePoint) {
    return codePoint > Unicode.MAX_BMP ? 2 : 1;
  }
  /**
  * High-speed conversion from TypedArrays to standard JS Arrays.
  * Bypasses the expensive Symbol.iterator overhead of Array.from()
  */
  static toArray(typedArray) {
    const len = typedArray.length;
    const res = new Array(len);
    for (let i = 0; i < len; i++) res[i] = typedArray[i];
    return res;
  }
  static stringToUtf8ByteArray(str) {
    if (globalThis.TextEncoder) {
      if (!cachedNativeEncoder) cachedNativeEncoder = new TextEncoder();
      return cachedNativeEncoder.encode(str);
    } else {
      let out = [], p2 = 0;
      for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        if (c < 128) out[p2++] = c;
        else if (c < 2048) {
          out[p2++] = c >> 6 | 192;
          out[p2++] = c & 63 | 128;
        } else if ((c & 64512) === Unicode.MIN_HIGH_SURROGATE && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === Unicode.MIN_LOW_SURROGATE) {
          c = Unicode.MIN_SUPPLEMENTARY_CODE_POINT + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
          out[p2++] = c >> 18 | 240;
          out[p2++] = c >> 12 & 63 | 128;
          out[p2++] = c >> 6 & 63 | 128;
          out[p2++] = c & 63 | 128;
        } else {
          out[p2++] = c >> 12 | 224;
          out[p2++] = c >> 6 & 63 | 128;
          out[p2++] = c & 63 | 128;
        }
      }
      return out;
    }
  }
  static utf8ByteArrayToString(bytes) {
    if (globalThis.TextDecoder) {
      if (!cachedNativeDecoder) cachedNativeDecoder = new TextDecoder("utf-8");
      const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
      return cachedNativeDecoder.decode(view);
    } else {
      let out = [], pos = 0, c = 0;
      while (pos < bytes.length) {
        let c1 = bytes[pos++];
        if (c1 < 128) out[c++] = String.fromCharCode(c1);
        else if (c1 > 191 && c1 < 224) {
          let c2 = bytes[pos++];
          out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
        } else if (c1 > 239 && c1 < 365) {
          let c2 = bytes[pos++];
          let c3 = bytes[pos++];
          let c4 = bytes[pos++];
          let u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - Unicode.MIN_SUPPLEMENTARY_CODE_POINT;
          out[c++] = String.fromCharCode(Unicode.MIN_HIGH_SURROGATE + (u >> 10));
          out[c++] = String.fromCharCode(Unicode.MIN_LOW_SURROGATE + (u & 1023));
        } else {
          let c2 = bytes[pos++];
          let c3 = bytes[pos++];
          out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        }
      }
      return out.join("");
    }
  }
};
var createEnum = (values = [], initNum = 0) => {
  const enumObject = /* @__PURE__ */ Object.create(null);
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    const keyVal = initNum + i;
    enumObject[val] = keyVal;
    enumObject[keyVal] = val;
  }
  return Object.freeze(enumObject);
};
var MatcherInputBase = class MatcherInputBase2 {
  static Encoding = createEnum(["UTF_16", "UTF_8"]);
  getEncoding() {
    throw Error("not implemented");
  }
  /** @returns {string} */
  asCharSequence() {
    throw Error("not implemented");
  }
  /** @returns {Uint8Array|number[]} */
  asBytes() {
    throw Error("not implemented");
  }
  /** @returns {number} */
  length() {
    throw Error("not implemented");
  }
  /**
  *
  * @returns {boolean}
  */
  isUTF8Encoding() {
    return this.getEncoding() === MatcherInputBase2.Encoding.UTF_8;
  }
  /**
  *
  * @returns {boolean}
  */
  isUTF16Encoding() {
    return this.getEncoding() === MatcherInputBase2.Encoding.UTF_16;
  }
};
var Utf8MatcherInput = class extends MatcherInputBase {
  /** @param {Uint8Array|number[]|null} bytes */
  constructor(bytes = null) {
    super();
    this.bytes = bytes;
  }
  getEncoding() {
    return MatcherInputBase.Encoding.UTF_8;
  }
  /**
  *
  * @returns {string}
  */
  asCharSequence() {
    return Utils.utf8ByteArrayToString(this.bytes);
  }
  /**
  *
  * @returns {Uint8Array|number[]|null}
  */
  asBytes() {
    return this.bytes;
  }
  /**
  *
  * @returns {number}
  */
  length() {
    return this.bytes.length;
  }
};
var Utf16MatcherInput = class extends MatcherInputBase {
  /** @param {string|null} charSequence */
  constructor(charSequence = null) {
    super();
    this.charSequence = charSequence;
  }
  getEncoding() {
    return MatcherInputBase.Encoding.UTF_16;
  }
  /**
  *
  * @returns {string}
  */
  asCharSequence() {
    return this.charSequence;
  }
  /**
  *
  * @returns {number[]}
  */
  asBytes() {
    return Utils.stringToUtf8ByteArray(this.charSequence.toString());
  }
  /**
  *
  * @returns {number}
  */
  length() {
    return this.charSequence.length;
  }
};
var MatcherInput = class {
  /**
  * Return the MatcherInput for UTF_16 encoding.
  * @returns {Utf16MatcherInput}
  */
  static utf16(charSequence) {
    return new Utf16MatcherInput(charSequence);
  }
  /**
  * Return the MatcherInput for UTF_8 encoding.
  * @returns {Utf8MatcherInput}
  */
  static utf8(input) {
    if (Utils.isByteArray(input)) return new Utf8MatcherInput(input);
    return new Utf8MatcherInput(Utils.stringToUtf8ByteArray(input));
  }
};
var MachineInputBase = class {
  static EOF() {
    return -8;
  }
  constructor() {
    this.end = 0;
  }
  canCheckPrefix() {
    return true;
  }
  endPos() {
    return this.end;
  }
  hasString() {
    return false;
  }
  hasAnyString() {
    return false;
  }
  prefixLength() {
    return 0;
  }
};
var MachineUTF8Input = class extends MachineInputBase {
  constructor(bytes, start2 = 0, end = bytes.length) {
    super();
    this.bytes = bytes;
    this.start = start2;
    this.end = end;
  }
  hasString(prefilter, pos) {
    const target = prefilter.bytes;
    if (target.length === 0) return true;
    const idx = this.indexOf(this.bytes, target, this.start + pos);
    return idx !== -1 && idx <= this.end - target.length;
  }
  hasAnyString(prefilter, pos) {
    if (!prefilter.ac8) return false;
    return prefilter.ac8.searchUTF8(this.bytes, this.start + pos, this.end);
  }
  step(pos) {
    pos += this.start;
    if (pos >= this.end) return MachineInputBase.EOF();
    const c = this.bytes[pos] & 255;
    if (c < 128) return c << 3 | 1;
    else if (c >= 194 && c <= 223 && pos + 1 < this.end) {
      const c1 = this.bytes[pos + 1] & 255;
      if ((c1 & 192) !== 128) return c << 3 | 1;
      return ((c & 31) << 6 | c1 & 63) << 3 | 2;
    } else if (c >= 224 && c <= 239 && pos + 2 < this.end) {
      const c1 = this.bytes[pos + 1] & 255;
      if ((c1 & 192) !== 128) return c << 3 | 1;
      const c2 = this.bytes[pos + 2] & 255;
      if ((c2 & 192) !== 128) return c << 3 | 1;
      return ((c & 15) << 12 | (c1 & 63) << 6 | c2 & 63) << 3 | 3;
    } else if (c >= 240 && c <= 244 && pos + 3 < this.end) {
      const c1 = this.bytes[pos + 1] & 255;
      if ((c1 & 192) !== 128) return c << 3 | 1;
      const c2 = this.bytes[pos + 2] & 255;
      if ((c2 & 192) !== 128) return c << 3 | 1;
      const c3 = this.bytes[pos + 3] & 255;
      if ((c3 & 192) !== 128) return c << 3 | 1;
      return ((c & 7) << 18 | (c1 & 63) << 12 | (c2 & 63) << 6 | c3 & 63) << 3 | 4;
    } else return c << 3 | 1;
  }
  index(re2, pos) {
    pos += this.start;
    const i = this.indexOf(this.bytes, re2.prefixUTF8, pos);
    return i < 0 ? i : i - pos;
  }
  context(pos) {
    pos += this.start;
    let r1 = -1;
    if (pos > this.start && pos <= this.end) {
      let start2 = pos - 1;
      r1 = this.bytes[start2--];
      if (r1 >= 128) {
        let lim = pos - 4;
        if (lim < this.start) lim = this.start;
        while (start2 >= lim && (this.bytes[start2] & 192) === 128) start2--;
        if (start2 < this.start) start2 = this.start;
        r1 = this.step(start2 - this.start) >> 3;
      }
    }
    const r2 = pos < this.end ? this.step(pos - this.start) >> 3 : -1;
    return Utils.emptyOpContext(r1, r2);
  }
  indexOf(source, target, fromIndex = 0) {
    let targetLength = target.length;
    if (targetLength === 0) return fromIndex <= this.end ? fromIndex : -1;
    const firstByte = target[0];
    let limit = this.end - targetLength;
    const hasNativeIndexOf = typeof source.indexOf === "function";
    let i = fromIndex;
    while (i <= limit) {
      if (hasNativeIndexOf) {
        i = source.indexOf(firstByte, i);
        if (i === -1 || i > limit) return -1;
      } else {
        while (i <= limit && source[i] !== firstByte) i++;
        if (i > limit) return -1;
      }
      let match = true;
      for (let j = 1; j < targetLength; j++) if (source[i + j] !== target[j]) {
        match = false;
        break;
      }
      if (match) return i;
      i++;
    }
    return -1;
  }
  prefixLength(re2) {
    return re2.prefixUTF8.length;
  }
};
var MachineUTF16Input = class extends MachineInputBase {
  constructor(charSequence, start2 = 0, end = charSequence.length) {
    super();
    this.charSequence = charSequence;
    this.start = start2;
    this.end = end;
  }
  hasString(prefilter, pos) {
    const idx = this.charSequence.indexOf(prefilter.str, this.start + pos);
    return idx !== -1 && idx <= this.end - prefilter.str.length;
  }
  hasAnyString(prefilter, pos) {
    if (!prefilter.ac16) return false;
    return prefilter.ac16.searchUTF16(this.charSequence, this.start + pos, this.end);
  }
  step(pos) {
    pos += this.start;
    if (pos >= this.end) return MachineInputBase.EOF();
    const c1 = this.charSequence.charCodeAt(pos);
    if (c1 < Unicode.MIN_HIGH_SURROGATE || c1 > Unicode.MAX_HIGH_SURROGATE || pos + 1 >= this.end) return c1 << 3 | 1;
    const c2 = this.charSequence.charCodeAt(pos + 1);
    if (c2 >= Unicode.MIN_LOW_SURROGATE && c2 <= Unicode.MAX_LOW_SURROGATE) return (c1 - Unicode.MIN_HIGH_SURROGATE) * 1024 + (c2 - Unicode.MIN_LOW_SURROGATE) + Unicode.MIN_SUPPLEMENTARY_CODE_POINT << 3 | 2;
    return c1 << 3 | 1;
  }
  index(re2, pos) {
    pos += this.start;
    const i = this.charSequence.indexOf(re2.prefix, pos);
    if (i < 0 || i > this.end - re2.prefix.length) return -1;
    return i - pos;
  }
  context(pos) {
    pos += this.start;
    const r1 = pos > this.start && pos <= this.end ? this.charSequence.charCodeAt(pos - 1) : -1;
    const r2 = pos < this.end ? this.charSequence.charCodeAt(pos) : -1;
    return Utils.emptyOpContext(r1, r2);
  }
  prefixLength(re2) {
    return re2.prefix.length;
  }
};
var MachineInput = class {
  static fromUTF8(bytes, start2 = 0, end = bytes.length) {
    return new MachineUTF8Input(bytes, start2, end);
  }
  static fromUTF16(charSequence, start2 = 0, end = charSequence.length) {
    return new MachineUTF16Input(charSequence, start2, end);
  }
};
var RE2JSException = class extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = "RE2JSException";
  }
};
var RE2JSSyntaxException = class extends RE2JSException {
  /**
  * @param {string} error
  * @param {string|null} [input=null]
  */
  constructor(error, input = null) {
    let message = `error parsing regexp: ${error}`;
    if (input) message += `: \`${input}\``;
    super(message);
    this.name = "RE2JSSyntaxException";
    this.message = message;
    this.error = error;
    this.input = input;
  }
  /**
  * Retrieves the description of the error.
  * @returns {string}
  */
  getDescription() {
    return this.error;
  }
  /**
  * Retrieves the erroneous regular-expression pattern.
  * @returns {string|null}
  */
  getPattern() {
    return this.input;
  }
};
var RE2JSCompileException = class extends RE2JSException {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = "RE2JSCompileException";
  }
};
var RE2JSGroupException = class extends RE2JSException {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = "RE2JSGroupException";
  }
};
var RE2JSFlagsException = class extends RE2JSException {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = "RE2JSFlagsException";
  }
};
var RE2JSInternalException = class extends RE2JSException {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = "RE2JSInternalException";
  }
};
var Matcher = class Matcher2 {
  /**
  * V8 and WebKit have historical hard limits on the number of arguments
  * that can be passed to a function. We cap replacer arguments to prevent
  * Call Stack Overflow (DoS) vulnerabilities on massive ASTs.
  */
  static MAX_REPLACER_ARGS = 65535;
  /**
  * Quotes '\' and '$' in {@code s}, so that the returned string could be used in
  * {@link #appendReplacement} as a literal replacement of {@code s}.
  *
  * @param {string} str the string to be quoted
  * @param {boolean} [javaMode=false] whether the replacement will be used in javaMode
  * @returns {string} the quoted string
  */
  static quoteReplacement(str, javaMode = false) {
    if (javaMode) {
      if (str.indexOf("\\") < 0 && str.indexOf("$") < 0) return str;
      return str.split("").map((s) => {
        const c = s.codePointAt(0);
        if (c === Codepoint.CODES.get("\\") || c === Codepoint.CODES.get("$")) return `\\${s}`;
        return s;
      }).join("");
    }
    if (str.indexOf("$") < 0) return str;
    return str.split("").map((s) => {
      if (s.codePointAt(0) === Codepoint.CODES.get("$")) return "$$";
      return s;
    }).join("");
  }
  /**
  *
  * @param {import('./index.js').RE2JS} pattern
  * @param {string|number[]|Uint8Array|MatcherInputBase} input
  */
  constructor(pattern, input) {
    if (pattern === null) throw new Error("pattern is null");
    this.patternInput = pattern;
    const re2 = this.patternInput.re2();
    this.patternGroupCount = re2.numberOfCapturingGroups();
    this.groups = [];
    this.namedGroups = re2.namedGroups;
    this.numberOfInstructions = re2.numberOfInstructions();
    if (input instanceof MatcherInputBase) this.resetMatcherInput(input);
    else if (Utils.isByteArray(input)) this.resetMatcherInput(MatcherInput.utf8(input));
    else this.resetMatcherInput(MatcherInput.utf16(input));
  }
  /**
  * Returns the {@code RE2JS} associated with this {@code Matcher}.
  * @returns {import('./index.js').RE2JS}
  */
  pattern() {
    return this.patternInput;
  }
  /**
  * Resets the {@code Matcher}, rewinding input and discarding any match information.
  *
  * @returns {Matcher} the {@code Matcher} itself, for chained method calls
  */
  reset() {
    this.matcherInputLength = this.matcherInput.length();
    this.appendPos = 0;
    this.hasMatch = false;
    this.hasGroups = false;
    this.anchorFlag = 0;
    return this;
  }
  /**
  * Resets the {@code Matcher} and changes the input.
  * @param {string|number[]|Uint8Array|MatcherInputBase} input
  * @returns {Matcher} the {@code Matcher} itself, for chained method calls
  */
  resetMatcherInput(input) {
    if (input === null) throw new Error("input is null");
    if (!(input instanceof MatcherInputBase)) if (Utils.isByteArray(input)) input = MatcherInput.utf8(input);
    else input = MatcherInput.utf16(input);
    this.matcherInput = input;
    this.reset();
    return this;
  }
  /**
  * Returns the start of the named group of the most recent match, or -1 if the group was not
  * matched.
  * @param {string|number} [group=0]
  * @returns {number}
  */
  start(group = 0) {
    if (typeof group === "string") {
      const groupInt = this.namedGroups[group];
      if (!Number.isFinite(groupInt)) throw new RE2JSGroupException(`group '${group}' not found`);
      group = groupInt;
    }
    this.loadGroup(group);
    return this.groups[2 * group];
  }
  /**
  * Returns the end of the named group of the most recent match, or -1 if the group was not
  * matched.
  * @param {string|number} [group=0]
  * @returns {number}
  */
  end(group = 0) {
    if (typeof group === "string") {
      const groupInt = this.namedGroups[group];
      if (!Number.isFinite(groupInt)) throw new RE2JSGroupException(`group '${group}' not found`);
      group = groupInt;
    }
    this.loadGroup(group);
    return this.groups[2 * group + 1];
  }
  /**
  * Returns the program size of this pattern.
  *
  * <p>
  * Similar to the C++ implementation, the program size is a very approximate measure of a regexp's
  * "cost". Larger numbers are more expensive than smaller numbers.
  * </p>
  *
  * @returns {number} the program size of this pattern
  */
  programSize() {
    return this.numberOfInstructions;
  }
  /**
  * Returns the named group of the most recent match, or {@code null} if the group was not matched.
  * @param {string|number} [group=0]
  * @returns {string|null}
  */
  group(group = 0) {
    if (typeof group === "string") {
      const groupInt = this.namedGroups[group];
      if (!Number.isFinite(groupInt)) throw new RE2JSGroupException(`group '${group}' not found`);
      group = groupInt;
    }
    const start2 = this.start(group);
    const end = this.end(group);
    if (start2 < 0 && end < 0) return null;
    return this.substring(start2, end);
  }
  /**
  * Returns a dictionary map of all named capturing groups and their matched values.
  * If a group was not matched, its value will be `null`.
  * @returns {Record<string, string|null>}
  */
  getNamedGroups() {
    if (!this.hasMatch) throw new RE2JSGroupException("perhaps no match attempted");
    const result = /* @__PURE__ */ Object.create(null);
    for (const name of Object.keys(this.namedGroups)) result[name] = this.group(name);
    return result;
  }
  /**
  * Returns the number of subgroups in this pattern.
  *
  * @returns {number} the number of subgroups; the overall match (group 0) does not count
  */
  groupCount() {
    return this.patternGroupCount;
  }
  /**
  * Helper: finds subgroup information if needed for group.
  * @param {number} group
  * @private
  */
  loadGroup(group) {
    if (group < 0 || group > this.patternGroupCount) throw new RE2JSGroupException(`Group index out of bounds: ${group}`);
    if (!this.hasMatch) throw new RE2JSGroupException("perhaps no match attempted");
    if (group === 0 || this.hasGroups) return;
    const end = this.matcherInputLength;
    const res = this.patternInput.re2().matchMachineInput(this.matcherInput, this.groups[0], end, this.anchorFlag, 1 + this.patternGroupCount);
    if (!res[0]) throw new RE2JSGroupException("inconsistency in matching group data");
    this.groups = res[1];
    this.hasGroups = true;
  }
  /**
  * Matches the entire input against the pattern (anchored start and end). If there is a match,
  * {@code matches} sets the match state to describe it.
  *
  * @returns {boolean} true if the entire input matches the pattern
  */
  matches() {
    return this.genMatch(0, RE2Flags.ANCHOR_BOTH);
  }
  /**
  * Matches the beginning of input against the pattern (anchored start). If there is a match,
  * {@code lookingAt} sets the match state to describe it.
  *
  * @returns {boolean} true if the beginning of the input matches the pattern
  */
  lookingAt() {
    return this.genMatch(0, RE2Flags.ANCHOR_START);
  }
  /**
  * Matches the input against the pattern (unanchored), starting at a specified position. If there
  * is a match, {@code find} sets the match state to describe it.
  *
  * @param {number|null} [start=null] the input position where the search begins
  * @returns {boolean} if it finds a match
  * @throws IndexOutOfBoundsException if start is not a valid input position
  */
  find(start2 = null) {
    if (start2 !== null) {
      if (start2 < 0 || start2 > this.matcherInputLength) throw new RE2JSGroupException(`start index out of bounds: ${start2}`);
      this.reset();
      return this.genMatch(start2, 0);
    }
    start2 = 0;
    if (this.hasMatch) {
      start2 = this.groups[1];
      if (this.groups[0] === this.groups[1]) {
        const r = (this.matcherInput.isUTF16Encoding() ? MachineInput.fromUTF16(this.matcherInput.asCharSequence(), 0, this.matcherInputLength) : MachineInput.fromUTF8(this.matcherInput.asBytes(), 0, this.matcherInputLength)).step(start2);
        if (r < 0) start2++;
        else start2 += r & 7;
      }
    }
    return this.genMatch(start2, RE2Flags.UNANCHORED);
  }
  /**
  * Helper: does match starting at start, with RE2 anchor flag.
  * @param {number} startByte
  * @param {number} anchor
  * @returns {boolean}
  * @private
  */
  genMatch(startByte, anchor) {
    const res = this.patternInput.re2().matchMachineInput(this.matcherInput, startByte, this.matcherInputLength, anchor, 1);
    if (!res[0]) {
      this.hasMatch = false;
      return false;
    }
    this.groups = res[1];
    this.hasMatch = true;
    this.hasGroups = this.patternGroupCount === 0;
    this.anchorFlag = anchor;
    return true;
  }
  /**
  * Helper: return substring for [start, end).
  * @param {number} start
  * @param {number} end
  * @returns {string}
  */
  substring(start2, end) {
    if (this.matcherInput.isUTF8Encoding()) return Utils.utf8ByteArrayToString(this.matcherInput.asBytes().slice(start2, end));
    return this.matcherInput.asCharSequence().substring(start2, end).toString();
  }
  /**
  * Helper for Pattern: return input length.
  * @returns {number}
  */
  inputLength() {
    return this.matcherInputLength;
  }
  /**
  * Appends to result two strings: the text from the append position up to the beginning of the
  * most recent match, and then the replacement with submatch groups substituted for references of
  * the form {@code $n}, where {@code n} is the group number in decimal. It advances the append
  * position to where the most recent match ended.
  *
  * To embed a literal {@code $}, use \$ (actually {@code "\\$"} with string escapes). The escape
  * is only necessary when {@code $} is followed by a digit, but it is always allowed. Only
  * {@code $} and {@code \} need escaping, but any character can be escaped.
  *
  * The group number {@code n} in {@code $n} is always at least one digit and expands to use more
  * digits as long as the resulting number is a valid group number for this pattern. To cut it off
  * earlier, escape the first digit that should not be used.
  *
  * @param {string} replacement the replacement string
  * @param {boolean} [javaMode=false] activate java mode (different behaviour for capture groups and special characters)
  * @returns {string}
  * @throws IllegalStateException if there was no most recent match
  * @throws IndexOutOfBoundsException if replacement refers to an invalid group
  * @private
  */
  appendReplacement(replacement, javaMode = false) {
    let res = "";
    const s = this.start();
    const e = this.end();
    if (this.appendPos < s) res += this.substring(this.appendPos, s);
    this.appendPos = e;
    res += javaMode ? this.appendReplacementInternalJava(replacement) : this.appendReplacementInternalJs(replacement);
    return res;
  }
  /**
  * @param {string} replacement - the replacement string
  * @returns {string}
  * @private
  */
  appendReplacementInternalJava(replacement) {
    let res = "";
    let last = 0;
    const m2 = replacement.length;
    let i = 0;
    while (i < m2) {
      const cCode = replacement.codePointAt(i);
      if (cCode === Codepoint.CODES.get("\\")) {
        if (last < i) res += replacement.substring(last, i);
        i++;
        if (i >= m2) throw new RE2JSGroupException("character to be escaped is missing");
        last = i;
        i++;
        continue;
      }
      if (cCode === Codepoint.CODES.get("$")) {
        if (last < i) res += replacement.substring(last, i);
        if (i + 1 >= m2) throw new RE2JSGroupException("Illegal group reference: group index is missing");
        const nextCode = replacement.codePointAt(i + 1);
        if (Codepoint.CODES.get("0") <= nextCode && nextCode <= Codepoint.CODES.get("9")) {
          let n2 = nextCode - Codepoint.CODES.get("0");
          let j = i + 2;
          for (; j < m2; j++) {
            const digit = replacement.codePointAt(j);
            if (digit < Codepoint.CODES.get("0") || digit > Codepoint.CODES.get("9") || n2 * 10 + digit - Codepoint.CODES.get("0") > this.patternGroupCount) break;
            n2 = n2 * 10 + digit - Codepoint.CODES.get("0");
          }
          if (n2 > this.patternGroupCount) throw new RE2JSGroupException(`n > number of groups: ${n2}`);
          const group = this.group(n2);
          if (group !== null) res += group;
          i = j;
          last = i;
        } else if (nextCode === Codepoint.CODES.get("{")) {
          let j = i + 2;
          while (j < m2 && replacement.codePointAt(j) !== Codepoint.CODES.get("}")) j++;
          if (j >= m2) throw new RE2JSGroupException("named capture group is missing trailing '}'");
          const groupName = replacement.substring(i + 2, j);
          const groupVal = this.group(groupName);
          if (groupVal !== null) res += groupVal;
          i = j + 1;
          last = i;
        } else throw new RE2JSGroupException("Illegal group reference");
        continue;
      }
      i++;
    }
    if (last < m2) res += replacement.substring(last, m2);
    return res;
  }
  /**
  * @param {string} replacement - the replacement string
  * @returns {string}
  * @private
  */
  appendReplacementInternalJs(replacement) {
    let res = "";
    let last = 0;
    const m2 = replacement.length;
    for (let i = 0; i < m2 - 1; i++) if (replacement.codePointAt(i) === Codepoint.CODES.get("$")) {
      let c = replacement.codePointAt(i + 1);
      if (Codepoint.CODES.get("$") === c) {
        if (last < i) res += replacement.substring(last, i);
        res += "$";
        i++;
        last = i + 1;
        continue;
      } else if (Codepoint.CODES.get("&") === c) {
        if (last < i) res += replacement.substring(last, i);
        const group = this.group(0);
        if (group !== null) res += group;
        else res += "$&";
        i++;
        last = i + 1;
        continue;
      } else if (Codepoint.CODES.get("`") === c) {
        if (last < i) res += replacement.substring(last, i);
        res += this.substring(0, this.start(0));
        i++;
        last = i + 1;
        continue;
      } else if (Codepoint.CODES.get("'") === c) {
        if (last < i) res += replacement.substring(last, i);
        res += this.substring(this.end(0), this.matcherInputLength);
        i++;
        last = i + 1;
        continue;
      } else if (Codepoint.CODES.get("1") <= c && c <= Codepoint.CODES.get("9")) {
        let n2 = c - Codepoint.CODES.get("0");
        if (last < i) res += replacement.substring(last, i);
        for (i += 2; i < m2; i++) {
          c = replacement.codePointAt(i);
          if (c < Codepoint.CODES.get("0") || c > Codepoint.CODES.get("9") || n2 * 10 + c - Codepoint.CODES.get("0") > this.patternGroupCount) break;
          n2 = n2 * 10 + c - Codepoint.CODES.get("0");
        }
        if (n2 > this.patternGroupCount) {
          res += `$${n2}`;
          last = i;
          i--;
          continue;
        }
        const group = this.group(n2);
        if (group !== null) res += group;
        last = i;
        i--;
        continue;
      } else if (c === Codepoint.CODES.get("<")) {
        if (last < i) res += replacement.substring(last, i);
        i++;
        let j = i + 1;
        while (j < replacement.length && replacement.codePointAt(j) !== Codepoint.CODES.get(">") && replacement.codePointAt(j) !== Codepoint.CODES.get(" ")) j++;
        if (j === replacement.length || replacement.codePointAt(j) !== Codepoint.CODES.get(">")) {
          res += replacement.substring(i - 1, j + 1);
          last = j + 1;
          i = j;
          continue;
        }
        const groupName = replacement.substring(i + 1, j);
        if (Object.prototype.hasOwnProperty.call(this.namedGroups, groupName)) {
          const groupVal = this.group(groupName);
          if (groupVal !== null) res += groupVal;
        } else res += `$<${groupName}>`;
        last = j + 1;
        i = j;
        continue;
      }
    }
    if (last < m2) res += replacement.substring(last, m2);
    return res;
  }
  /**
  * Return the substring of the input from the append position to the end of the
  * input.
  * @returns {string}
  */
  appendTail() {
    return this.substring(this.appendPos, this.matcherInputLength);
  }
  /**
  * Returns the input with all matches replaced by {@code replacement}, interpreted as for
  * {@code appendReplacement}.
  *
  * @param {string|((...args: any[]) => string)} replacement - the replacement string or a replacer function
  * @param {boolean} [javaMode=false] - activate java mode (different behaviour for capture groups and special characters)
  * @returns {string} the input string with the matches replaced
  * @throws IndexOutOfBoundsException if replacement refers to an invalid group and javaMode is true
  */
  replaceAll(replacement, javaMode = false) {
    return this.replace(replacement, true, javaMode);
  }
  /**
  * Returns the input with the first match replaced by {@code replacement}, interpreted as for
  * {@code appendReplacement}.
  *
  * @param {string|((...args: any[]) => string)} replacement - the replacement string or a replacer function
  * @param {boolean} [javaMode=false] - activate java mode (different behaviour for capture groups and special characters)
  * @returns {string} the input string with the first match replaced
  * @throws IndexOutOfBoundsException if replacement refers to an invalid group and javaMode is true
  */
  replaceFirst(replacement, javaMode = false) {
    return this.replace(replacement, false, javaMode);
  }
  /**
  * Helper: replaceAll/replaceFirst hybrid.
  * @param {string|((...args: any[]) => string)} replacement - the replacement string or a replacer function
  * @param {boolean} [all=true] - replace all matches
  * @param {boolean} [javaMode=false] - activate java mode (different behaviour for capture groups and special characters)
  * @returns {string}
  * @private
  */
  replace(replacement, all = true, javaMode = false) {
    let res = "";
    this.reset();
    const isFunc = typeof replacement === "function";
    const hasNamedGroups = Object.keys(this.namedGroups).length > 0;
    let originalInput = null;
    if (isFunc) {
      if (this.groupCount() >= Matcher2.MAX_REPLACER_ARGS) throw new RE2JSGroupException("Too many capture groups to safely invoke replacer function");
      originalInput = this.matcherInput.isUTF8Encoding() ? this.matcherInput.asBytes() : this.matcherInput.asCharSequence();
    }
    while (this.find()) {
      res += isFunc ? this.appendReplacementFunc(replacement, hasNamedGroups, originalInput) : this.appendReplacement(replacement, javaMode);
      if (!all) break;
    }
    res += this.appendTail();
    return res;
  }
  /**
  * Evaluates a replacer function for the current match and appends the result,
  * along with any un-matched preceding text, advancing the append position.
  * @param {Function} replacer - the replacer function
  * @param {boolean} hasNamedGroups - cached flag if pattern has named groups
  * @param {string|Uint8Array|number[]} originalInput - the cached original input reference
  * @returns {string} the evaluated string to append
  * @private
  */
  appendReplacementFunc(replacer, hasNamedGroups, originalInput) {
    let res = "";
    const s = this.start();
    const e = this.end();
    if (this.appendPos < s) res += this.substring(this.appendPos, s);
    this.appendPos = e;
    const args = this.buildReplacerArgs(s, hasNamedGroups, originalInput);
    res += String(replacer(...args));
    return res;
  }
  /**
  * Builds the argument array for the replacer function matching the standard
  * JS String.prototype.replace(regex, replacer) signature.
  * @param {number} matchStart - the start index of the match
  * @param {boolean} hasNamedGroups - cached flag if pattern has named groups
  * @param {string|Uint8Array|number[]} originalInput - the cached original input reference
  * @returns {Array} array of arguments
  * @private
  */
  buildReplacerArgs(matchStart, hasNamedGroups, originalInput) {
    const args = [this.group(0)];
    const numGroups = this.groupCount();
    for (let i = 1; i <= numGroups; i++) {
      const start2 = this.start(i);
      if (start2 < 0) args.push(void 0);
      else args.push(this.substring(start2, this.end(i)));
    }
    args.push(matchStart);
    args.push(originalInput);
    if (hasNamedGroups) {
      const parsedGroups = this.getNamedGroups();
      for (const key in parsedGroups) if (parsedGroups[key] === null) parsedGroups[key] = void 0;
      args.push(parsedGroups);
    }
    return args;
  }
};
var Inst = class Inst2 {
  static ALT = 1;
  static ALT_MATCH = 2;
  static CAPTURE = 3;
  static EMPTY_WIDTH = 4;
  static FAIL = 5;
  static MATCH = 6;
  static NOP = 7;
  static RUNE = 8;
  static RUNE1 = 9;
  static RUNE_ANY = 10;
  static RUNE_ANY_NOT_NL = 11;
  static LB_WRITE = 12;
  static LB_CHECK = 13;
  static isRuneOp(op) {
    return Inst2.RUNE <= op && op <= Inst2.RUNE_ANY_NOT_NL;
  }
  static escapeRunes(runes) {
    let out = '"';
    for (let rune of runes) out += Utils.escapeRune(rune);
    out += '"';
    return out;
  }
  constructor(op) {
    this.op = op;
    this.out = 0;
    this.arg = 0;
    this.runes = [];
    this.next = null;
  }
  matchRune(r) {
    if (this.runes.length === 1) {
      const r0 = this.runes[0];
      if ((this.arg & RE2Flags.FOLD_CASE) !== 0) return Unicode.equalsIgnoreCase(r0, r);
      return r === r0;
    }
    const len = this.runes.length;
    if (len === 0) return false;
    if (len === 2 || len === 4 || len === 6 || len === 8) {
      for (let j = 0; j < len; j += 2) {
        if (r < this.runes[j]) return false;
        if (r <= this.runes[j + 1]) return true;
      }
      return false;
    }
    let base = 0;
    let n2 = len >> 1;
    while (n2 > 1) {
      const half = n2 >> 1;
      base += this.runes[base + half << 1] <= r ? half : 0;
      n2 -= half;
    }
    base += this.runes[base << 1] <= r ? 1 : 0;
    const m2 = base - 1;
    return m2 >= 0 && r <= this.runes[m2 << 1 | 1];
  }
  matchRunePos(r) {
    if (this.runes.length === 1) {
      const r0 = this.runes[0];
      if ((this.arg & RE2Flags.FOLD_CASE) !== 0) return Unicode.equalsIgnoreCase(r0, r) ? 0 : -1;
      return r === r0 ? 0 : -1;
    }
    const len = this.runes.length;
    if (len === 0) return -1;
    if (len === 2 || len === 4 || len === 6 || len === 8) {
      for (let j = 0; j < len; j += 2) {
        if (r < this.runes[j]) return -1;
        if (r <= this.runes[j + 1]) return Math.floor(j / 2);
      }
      return -1;
    }
    let base = 0;
    let n2 = len >> 1;
    while (n2 > 1) {
      const half = n2 >> 1;
      base += this.runes[base + half << 1] <= r ? half : 0;
      n2 -= half;
    }
    base += this.runes[base << 1] <= r ? 1 : 0;
    const m2 = base - 1;
    return m2 >= 0 && r <= this.runes[m2 << 1 | 1] ? m2 : -1;
  }
  /**
  *
  * @returns {string}
  */
  toString() {
    switch (this.op) {
      case Inst2.ALT:
        return `alt -> ${this.out}, ${this.arg}`;
      case Inst2.ALT_MATCH:
        return `altmatch -> ${this.out}, ${this.arg}`;
      case Inst2.CAPTURE:
        return `cap ${this.arg} -> ${this.out}`;
      case Inst2.EMPTY_WIDTH:
        return `empty ${this.arg} -> ${this.out}`;
      case Inst2.MATCH:
        return `match${this.arg !== 0 ? ` ${this.arg}` : ""}`;
      case Inst2.FAIL:
        return "fail";
      case Inst2.NOP:
        return `nop -> ${this.out}`;
      case Inst2.LB_WRITE:
        return `lbwrite ${this.arg} -> ${this.out}`;
      case Inst2.LB_CHECK:
        return `lbcheck ${this.arg} -> ${this.out}`;
      case Inst2.RUNE:
        if (this.runes === null) return "rune <null>";
        return [
          "rune ",
          Inst2.escapeRunes(this.runes),
          (this.arg & RE2Flags.FOLD_CASE) !== 0 ? "/i" : "",
          " -> ",
          this.out
        ].join("");
      case Inst2.RUNE1:
        return `rune1 ${Inst2.escapeRunes(this.runes)} -> ${this.out}`;
      case Inst2.RUNE_ANY:
        return `any -> ${this.out}`;
      case Inst2.RUNE_ANY_NOT_NL:
        return `anynotnl -> ${this.out}`;
      default:
        throw new Error("unhandled case in Inst.toString");
    }
  }
};
var Queue = class {
  constructor(numInst) {
    this.sparse = new Int32Array(numInst);
    this.densePcs = new Int32Array(numInst);
    this.denseCaps = null;
    this.size = 0;
    this.ncap = 0;
  }
  init(ncap) {
    this.ncap = ncap;
    const needed = this.densePcs.length * ncap;
    if (!this.denseCaps || this.denseCaps.length < needed) this.denseCaps = new Int32Array(needed);
  }
  contains(pc) {
    const j = this.sparse[pc];
    return j < this.size && this.densePcs[j] === pc;
  }
  isEmpty() {
    return this.size === 0;
  }
  add(pc) {
    const j = this.size++;
    this.sparse[pc] = j;
    this.densePcs[j] = pc;
    return j;
  }
  clear() {
    this.size = 0;
  }
  toString() {
    let out = "{";
    for (let i = 0; i < this.size; i++) {
      if (i !== 0) out += ", ";
      out += this.densePcs[i];
    }
    out += "}";
    return out;
  }
};
var Machine = class Machine2 {
  static fromRE2(re2) {
    const m2 = new Machine2();
    m2.prog = re2.prog;
    m2.re2 = re2;
    m2.q0 = new Queue(m2.prog.numInst());
    m2.q1 = new Queue(m2.prog.numInst());
    m2.matched = false;
    m2.matchcap = new Int32Array(m2.prog.numCap < 2 ? 2 : m2.prog.numCap);
    m2.ncap = 0;
    return m2;
  }
  static fromMachine(machine) {
    return Machine2.fromRE2(machine.re2);
  }
  constructor() {
    this.prog = null;
    this.re2 = null;
    this.q0 = null;
    this.q1 = null;
    this.matched = false;
    this.matchcap = null;
    this.ncap = 0;
    this.lbTable = null;
  }
  init(ncap) {
    this.ncap = ncap;
    if (ncap > this.matchcap.length) this.matchcap = new Int32Array(ncap).fill(-1);
    else this.matchcap.fill(-1);
    this.q0.init(ncap);
    this.q1.init(ncap);
    if (this.prog.numLb > 0) {
      if (!this.lbTable || this.lbTable.length < this.prog.numLb + 1) this.lbTable = new Int32Array(this.prog.numLb + 1);
      this.lbTable.fill(-1);
    }
  }
  submatches() {
    if (this.ncap === 0) return Utils.emptyInts();
    return Utils.toArray(this.matchcap.subarray(0, this.ncap));
  }
  match(input, pos, anchor) {
    const startCond = this.re2.cond;
    if (startCond === Utils.EMPTY_ALL) return false;
    if ((anchor === RE2Flags.ANCHOR_START || anchor === RE2Flags.ANCHOR_BOTH) && pos !== 0) return false;
    this.matched = false;
    this.matchcap.fill(-1);
    let currentPos = this.prog.numLb > 0 ? 0 : pos;
    let matchStartPos = pos;
    let runq = this.q0;
    let nextq = this.q1;
    let r = input.step(currentPos);
    let rune = r >> 3;
    let width2 = r & 7;
    let rune1 = -1;
    let width1 = 0;
    if (r !== MachineInputBase.EOF()) {
      r = input.step(currentPos + width2);
      rune1 = r >> 3;
      width1 = r & 7;
    }
    let flag;
    if (currentPos === 0) flag = Utils.emptyOpContext(-1, rune);
    else flag = input.context(currentPos);
    while (true) {
      if (runq.isEmpty()) {
        if ((startCond & Utils.EMPTY_BEGIN_TEXT) !== 0 && currentPos !== 0) break;
        if ((anchor === RE2Flags.ANCHOR_START || anchor === RE2Flags.ANCHOR_BOTH) && currentPos !== 0) break;
        if (this.matched) break;
        if (this.prog.numLb === 0 && !(this.re2.prefix.length === 0) && rune1 !== this.re2.prefixRune && input.canCheckPrefix()) {
          const advance = input.index(this.re2, currentPos);
          if (advance < 0) break;
          currentPos += advance;
          r = input.step(currentPos);
          rune = r >> 3;
          width2 = r & 7;
          r = input.step(currentPos + width2);
          rune1 = r >> 3;
          width1 = r & 7;
          flag = input.context(currentPos);
        }
      }
      if (currentPos === 0 && this.prog.numLb > 0) for (let i = 0; i < this.prog.lbStarts.length; i++) this.add(runq, this.prog.lbStarts[i], currentPos, this.matchcap, 0, flag);
      if (!this.matched && (currentPos === 0 || anchor === RE2Flags.UNANCHORED)) {
        if (currentPos >= matchStartPos) {
          if (this.ncap > 0) this.matchcap[0] = currentPos;
          this.add(runq, this.prog.start, currentPos, this.matchcap, 0, flag);
        }
      }
      const nextPos = currentPos + width2;
      flag = input.context(nextPos);
      this.step(runq, nextq, currentPos, nextPos, rune, flag, anchor, currentPos === input.endPos());
      if (width2 === 0) break;
      if (this.ncap === 0 && this.matched) break;
      currentPos += width2;
      rune = rune1;
      width2 = width1;
      if (rune !== -1) {
        r = input.step(currentPos + width2);
        rune1 = r >> 3;
        width1 = r & 7;
      }
      const tmpq = runq;
      runq = nextq;
      nextq = tmpq;
    }
    nextq.clear();
    return this.matched;
  }
  matchSet(input, pos, anchor) {
    const startCond = this.re2.cond;
    if (startCond === Utils.EMPTY_ALL) return [];
    if ((anchor === RE2Flags.ANCHOR_START || anchor === RE2Flags.ANCHOR_BOTH) && pos !== 0) return [];
    let currentPos = this.prog.numLb > 0 ? 0 : pos;
    let matchStartPos = pos;
    let runq = this.q0;
    let nextq = this.q1;
    let r = input.step(currentPos);
    let rune = r >> 3;
    let width2 = r & 7;
    let rune1 = -1;
    let width1 = 0;
    if (r !== MachineInputBase.EOF()) {
      r = input.step(currentPos + width2);
      rune1 = r >> 3;
      width1 = r & 7;
    }
    let flag = currentPos === 0 ? Utils.emptyOpContext(-1, rune) : input.context(currentPos);
    const matches = /* @__PURE__ */ new Set();
    while (true) {
      if (runq.isEmpty()) {
        if ((startCond & Utils.EMPTY_BEGIN_TEXT) !== 0 && currentPos !== 0) break;
        if ((anchor === RE2Flags.ANCHOR_START || anchor === RE2Flags.ANCHOR_BOTH) && currentPos !== 0) break;
      }
      if (currentPos === 0 && this.prog.numLb > 0) for (let i = 0; i < this.prog.lbStarts.length; i++) this.add(runq, this.prog.lbStarts[i], currentPos, this.matchcap, 0, flag);
      if (currentPos === 0 || anchor === RE2Flags.UNANCHORED) {
        if (currentPos >= matchStartPos) this.add(runq, this.prog.start, currentPos, this.matchcap, 0, flag);
      }
      const nextPos = currentPos + width2;
      flag = input.context(nextPos);
      for (let j = 0; j < runq.size; j++) {
        const pc = runq.densePcs[j];
        const i = this.prog.inst[pc];
        const capOffset = j * this.ncap;
        let add = false;
        switch (i.op) {
          case Inst.MATCH:
            if (anchor === RE2Flags.ANCHOR_BOTH && currentPos !== input.endPos()) break;
            matches.add(i.arg);
            break;
          case Inst.RUNE:
            add = i.matchRune(rune);
            break;
          case Inst.RUNE1:
            add = rune === i.runes[0];
            break;
          case Inst.RUNE_ANY:
            add = true;
            break;
          case Inst.RUNE_ANY_NOT_NL:
            add = rune !== 10;
            break;
          default:
            continue;
        }
        if (add) this.add(nextq, i.out, nextPos, runq.denseCaps, capOffset, flag);
      }
      runq.clear();
      if (width2 === 0) break;
      currentPos += width2;
      rune = rune1;
      width2 = width1;
      if (rune !== -1) {
        r = input.step(currentPos + width2);
        rune1 = r >> 3;
        width1 = r & 7;
      }
      const tmpq = runq;
      runq = nextq;
      nextq = tmpq;
    }
    nextq.clear();
    return Array.from(matches).sort((a, b2) => a - b2);
  }
  step(runq, nextq, pos, nextPos, c, nextCond, anchor, atEnd) {
    const longest = this.re2.longest;
    for (let j = 0; j < runq.size; j++) {
      const pc = runq.densePcs[j];
      const capOffset = j * this.ncap;
      if (longest && this.matched && this.ncap > 0 && this.matchcap[0] < runq.denseCaps[capOffset]) continue;
      const i = this.prog.inst[pc];
      let add = false;
      switch (i.op) {
        case Inst.MATCH:
          if (anchor === RE2Flags.ANCHOR_BOTH && !atEnd) break;
          if (this.ncap > 0 && (!longest || !this.matched || this.matchcap[1] < pos)) {
            runq.denseCaps[capOffset + 1] = pos;
            for (let k2 = 0; k2 < this.ncap; k2++) this.matchcap[k2] = runq.denseCaps[capOffset + k2];
          }
          if (!longest) runq.size = 0;
          this.matched = true;
          break;
        case Inst.RUNE:
          add = i.matchRune(c);
          break;
        case Inst.RUNE1:
          add = c === i.runes[0];
          break;
        case Inst.RUNE_ANY:
          add = true;
          break;
        case Inst.RUNE_ANY_NOT_NL:
          add = c !== 10;
          break;
        default:
          continue;
      }
      if (add) this.add(nextq, i.out, nextPos, runq.denseCaps, capOffset, nextCond);
    }
    runq.clear();
  }
  add(q, pc, pos, capArray, capOffset, cond) {
    while (true) {
      if (pc === 0) return;
      if (q.contains(pc)) return;
      const d2 = q.add(pc);
      const inst = this.prog.inst[pc];
      switch (inst.op) {
        case Inst.FAIL:
          return;
        case Inst.ALT:
        case Inst.ALT_MATCH:
          this.add(q, inst.out, pos, capArray, capOffset, cond);
          pc = inst.arg;
          continue;
        case Inst.EMPTY_WIDTH:
          if ((inst.arg & ~cond) === 0) {
            pc = inst.out;
            continue;
          }
          return;
        case Inst.NOP:
          pc = inst.out;
          continue;
        case Inst.CAPTURE:
          if (inst.arg < this.ncap) {
            const opos = capArray[capOffset + inst.arg];
            capArray[capOffset + inst.arg] = pos;
            this.add(q, inst.out, pos, capArray, capOffset, cond);
            capArray[capOffset + inst.arg] = opos;
            return;
          } else {
            pc = inst.out;
            continue;
          }
        case Inst.LB_WRITE:
          this.lbTable[Math.abs(inst.arg)] = pos;
          pc = inst.out;
          continue;
        case Inst.LB_CHECK:
          if (inst.arg > 0) {
            if (this.lbTable[inst.arg] === pos) {
              pc = inst.out;
              continue;
            }
          } else if (this.lbTable[-inst.arg] !== pos) {
            pc = inst.out;
            continue;
          }
          return;
        case Inst.MATCH:
        case Inst.RUNE:
        case Inst.RUNE1:
        case Inst.RUNE_ANY:
        case Inst.RUNE_ANY_NOT_NL:
          if (this.ncap > 0) {
            const destOffset = d2 * this.ncap;
            for (let c = 0; c < this.ncap; c++) q.denseCaps[destOffset + c] = capArray[capOffset + c];
          }
          return;
        default:
          throw new RE2JSInternalException("unhandled");
      }
    }
  }
};
var hashPCs = (pcs) => {
  let h2 = -2128831035;
  for (let i = 0; i < pcs.length; i++) {
    h2 ^= pcs[i];
    h2 = Math.imul(h2, 16777619);
  }
  return h2;
};
var arraysEqual = (a, b2) => {
  if (a.length !== b2.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b2[i]) return false;
  return true;
};
var DFAState = class {
  constructor(nfaStates, isMatch, matchIDs = []) {
    this.nfaStates = nfaStates;
    this.isMatch = isMatch;
    this.matchIDs = matchIDs;
    this.nextLatin1 = new Array(Unicode.MAX_LATIN1 + 1).fill(null);
    this.nextLatin1Anchored = new Array(Unicode.MAX_LATIN1 + 1).fill(null);
    this.transKeys = [];
    this.transVals = [];
    this.lastSeen = 0;
  }
};
var DFA = class DFA2 {
  static MAX_CACHE_CLEARS = 5;
  static STATE_MEMORY_ESTIMATE = 838;
  constructor(prog, maxMem = 8388608) {
    this.prog = prog;
    this.stateCache = /* @__PURE__ */ new Map();
    this.stateCount = 0;
    this.startState = null;
    this.stateLimit = Math.max(1, Math.floor(maxMem / DFA2.STATE_MEMORY_ESTIMATE));
    this.cacheClears = 0;
    this.failed = false;
    this.clock = 0;
  }
  computeClosure(pcs) {
    const closure = /* @__PURE__ */ new Set();
    const stack = [...pcs];
    let isMatch = false;
    const matchIDs = [];
    while (stack.length > 0) {
      const pc = stack.pop();
      if (closure.has(pc)) continue;
      closure.add(pc);
      const inst = this.prog.getInst(pc);
      switch (inst.op) {
        case Inst.MATCH:
          isMatch = true;
          if (!matchIDs.includes(inst.arg)) matchIDs.push(inst.arg);
          break;
        case Inst.ALT:
        case Inst.ALT_MATCH:
          stack.push(inst.out);
          stack.push(inst.arg);
          break;
        case Inst.NOP:
        case Inst.CAPTURE:
          stack.push(inst.out);
          break;
        case Inst.EMPTY_WIDTH:
        case Inst.LB_WRITE:
        case Inst.LB_CHECK:
          return null;
      }
    }
    const sortedPCs = Int32Array.from(closure).sort();
    matchIDs.sort((a, b2) => a - b2);
    return {
      pcs: sortedPCs,
      isMatch,
      matchIDs
    };
  }
  getState(pcs) {
    const closureResult = this.computeClosure(pcs);
    if (!closureResult) return null;
    const sortedPCs = closureResult.pcs;
    const hash = hashPCs(sortedPCs);
    let bucket = this.stateCache.get(hash);
    if (bucket) for (let i = 0; i < bucket.length; i++) {
      const state2 = bucket[i];
      if (arraysEqual(state2.nfaStates, sortedPCs)) {
        state2.lastSeen = ++this.clock;
        return state2;
      }
    }
    else {
      bucket = [];
      this.stateCache.set(hash, bucket);
    }
    if (this.failed) return null;
    if (this.stateCount >= this.stateLimit) {
      this.cacheClears++;
      if (this.cacheClears >= DFA2.MAX_CACHE_CLEARS) {
        this.failed = true;
        this.stateCache.clear();
        this.stateCount = 0;
        this.startState = null;
        return null;
      }
      this.evictCache();
      bucket = this.stateCache.get(hash);
      if (!bucket) {
        bucket = [];
        this.stateCache.set(hash, bucket);
      }
    }
    const state = new DFAState(sortedPCs, closureResult.isMatch, closureResult.matchIDs);
    state.lastSeen = ++this.clock;
    bucket.push(state);
    this.stateCount++;
    return state;
  }
  evictCache() {
    const allStates = [];
    for (const bucket of this.stateCache.values()) for (let i = 0; i < bucket.length; i++) allStates.push(bucket[i]);
    allStates.sort((a, b2) => a.lastSeen - b2.lastSeen);
    const keepCount = Math.max(1, Math.floor(this.stateLimit / 2));
    const startIndex = allStates.length - keepCount;
    const survivorsArray = allStates.slice(startIndex);
    const survivors = new Set(survivorsArray);
    this.stateCache.clear();
    this.stateCount = 0;
    for (let i = 0; i < survivorsArray.length; i++) {
      const state = survivorsArray[i];
      state.nextLatin1.fill(null);
      state.nextLatin1Anchored.fill(null);
      state.transKeys.length = 0;
      state.transVals.length = 0;
      const hash = hashPCs(state.nfaStates);
      let bucket = this.stateCache.get(hash);
      if (!bucket) {
        bucket = [];
        this.stateCache.set(hash, bucket);
      }
      bucket.push(state);
      this.stateCount++;
    }
    if (this.startState && !survivors.has(this.startState)) this.startState = null;
  }
  step(state, charCode, anchor) {
    if (charCode <= Unicode.MAX_LATIN1) if (anchor === RE2Flags.UNANCHORED) {
      const next = state.nextLatin1[charCode];
      if (next !== null) return next;
    } else {
      const next = state.nextLatin1Anchored[charCode];
      if (next !== null) return next;
    }
    else {
      const key = charCode + (anchor === RE2Flags.UNANCHORED ? 0 : Unicode.MAX_RUNE + 1);
      const keys = state.transKeys;
      const len = keys.length;
      for (let i = 0; i < len; i++) if (keys[i] === key) return state.transVals[i];
    }
    const nextPCs = [];
    for (let i = 0; i < state.nfaStates.length; i++) {
      const pc = state.nfaStates[i];
      const inst = this.prog.getInst(pc);
      if (Inst.isRuneOp(inst.op) && inst.matchRune(charCode)) nextPCs.push(inst.out);
    }
    if (anchor === RE2Flags.UNANCHORED) nextPCs.push(this.prog.start);
    const nextState = this.getState(nextPCs);
    if (charCode <= Unicode.MAX_LATIN1) if (anchor === RE2Flags.UNANCHORED) state.nextLatin1[charCode] = nextState;
    else state.nextLatin1Anchored[charCode] = nextState;
    else {
      const key = charCode + (anchor === RE2Flags.UNANCHORED ? 0 : Unicode.MAX_RUNE + 1);
      state.transKeys.push(key);
      state.transVals.push(nextState);
    }
    return nextState;
  }
  match(input, pos, anchor) {
    if ((anchor === RE2Flags.ANCHOR_START || anchor === RE2Flags.ANCHOR_BOTH) && pos !== 0) return false;
    if (!this.startState) {
      this.startState = this.getState([this.prog.start]);
      if (!this.startState) return null;
    }
    let endPos = input.endPos();
    let currentState = this.startState;
    if (currentState.isMatch) if (anchor === RE2Flags.ANCHOR_BOTH) {
      if (pos === endPos) return true;
    } else return true;
    let i = pos;
    while (i < endPos) {
      const r = input.step(i);
      const rune = r >> 3;
      const width2 = r & 7;
      if (width2 === 0) break;
      currentState = anchor === RE2Flags.UNANCHORED && rune <= Unicode.MAX_LATIN1 && currentState.nextLatin1[rune] || this.step(currentState, rune, anchor);
      if (currentState === null) return null;
      currentState.lastSeen = ++this.clock;
      if (currentState.isMatch) if (anchor === RE2Flags.ANCHOR_BOTH) {
        if (i + width2 === endPos) return true;
      } else return true;
      if (currentState.nfaStates.length === 0) {
        if (anchor !== RE2Flags.UNANCHORED) return false;
      }
      i += width2;
    }
    return false;
  }
  matchSet(input, pos, anchor) {
    if ((anchor === RE2Flags.ANCHOR_START || anchor === RE2Flags.ANCHOR_BOTH) && pos !== 0) return [];
    if (!this.startState) {
      this.startState = this.getState([this.prog.start]);
      if (!this.startState) return null;
    }
    let endPos = input.endPos();
    let currentState = this.startState;
    const matches = /* @__PURE__ */ new Set();
    const checkMatch = (state, currentPos) => {
      if (state.isMatch) if (anchor === RE2Flags.ANCHOR_BOTH) {
        if (currentPos === endPos) state.matchIDs.forEach((id2) => matches.add(id2));
      } else state.matchIDs.forEach((id2) => matches.add(id2));
    };
    checkMatch(currentState, pos);
    let i = pos;
    while (i < endPos) {
      const r = input.step(i);
      const rune = r >> 3;
      const width2 = r & 7;
      if (width2 === 0) break;
      currentState = anchor === RE2Flags.UNANCHORED && rune <= Unicode.MAX_LATIN1 && currentState.nextLatin1[rune] || this.step(currentState, rune, anchor);
      if (currentState === null) return null;
      currentState.lastSeen = ++this.clock;
      i += width2;
      checkMatch(currentState, i);
      if (currentState.nfaStates.length === 0) {
        if (anchor !== RE2Flags.UNANCHORED) break;
      }
    }
    return Array.from(matches).sort((a, b2) => a - b2);
  }
};
var VISITED_BITS = 32;
var MAX_BACKTRACK_PROG = 500;
var INITIAL_JOB_CAPACITY = 256;
var MAX_BACKTRACK_VECTOR = 256 * 1024;
var BitState = class {
  constructor() {
    this.end = 0;
    this.cap = /* @__PURE__ */ new Int32Array(0);
    this.matchcap = /* @__PURE__ */ new Int32Array(0);
    this.ncap = 0;
    this.jobPc = new Int32Array(INITIAL_JOB_CAPACITY);
    this.jobArg = new Uint8Array(INITIAL_JOB_CAPACITY);
    this.jobPos = new Int32Array(INITIAL_JOB_CAPACITY);
    this.jobLen = 0;
    this.visited = /* @__PURE__ */ new Uint32Array(0);
  }
  reset(prog, end, ncap) {
    this.end = end;
    this.jobLen = 0;
    this.ncap = ncap;
    const visitedSize = prog.numInst() * (end + 1) + VISITED_BITS - 1 >>> 5;
    if (this.visited.length < visitedSize) this.visited = new Uint32Array(visitedSize);
    else this.visited.fill(0, 0, visitedSize);
    if (this.cap.length < ncap) this.cap = new Int32Array(ncap).fill(-1);
    else this.cap.fill(-1, 0, ncap);
    if (this.matchcap.length < ncap) this.matchcap = new Int32Array(ncap).fill(-1);
    else this.matchcap.fill(-1, 0, ncap);
  }
  shouldVisit(pc, pos) {
    const n2 = pc * (this.end + 1) + pos;
    const idx = n2 >>> 5;
    const mask = 1 << (n2 & 31);
    if ((this.visited[idx] & mask) !== 0) return false;
    this.visited[idx] |= mask;
    return true;
  }
  push(re2, pc, pos, arg) {
    if (re2.prog.getInst(pc).op !== Inst.FAIL && (arg || this.shouldVisit(pc, pos))) {
      if (this.jobLen >= this.jobPc.length) {
        const newSize = this.jobPc.length * 2;
        const newPc = new Int32Array(newSize);
        newPc.set(this.jobPc);
        this.jobPc = newPc;
        const newArg = new Uint8Array(newSize);
        newArg.set(this.jobArg);
        this.jobArg = newArg;
        const newPos = new Int32Array(newSize);
        newPos.set(this.jobPos);
        this.jobPos = newPos;
      }
      this.jobPc[this.jobLen] = pc;
      this.jobArg[this.jobLen] = arg ? 1 : 0;
      this.jobPos[this.jobLen] = pos;
      this.jobLen++;
    }
  }
  tryBacktrack(re2, input, pc, pos, anchor) {
    const longest = re2.longest;
    this.push(re2, pc, pos, false);
    while (this.jobLen > 0) {
      this.jobLen--;
      let currentPc = this.jobPc[this.jobLen];
      let arg = this.jobArg[this.jobLen] === 1;
      let currentPos = this.jobPos[this.jobLen];
      let skipShouldVisit = true;
      while (true) {
        if (!skipShouldVisit) {
          if (!this.shouldVisit(currentPc, currentPos)) break;
        }
        skipShouldVisit = false;
        const inst = re2.prog.getInst(currentPc);
        switch (inst.op) {
          case Inst.FAIL:
            throw new RE2JSInternalException("unexpected InstFail");
          case Inst.ALT:
            if (arg) {
              arg = false;
              currentPc = inst.arg;
              continue;
            } else {
              this.push(re2, currentPc, currentPos, true);
              currentPc = inst.out;
              continue;
            }
          case Inst.ALT_MATCH: {
            const outInst = re2.prog.getInst(inst.out);
            if (Inst.isRuneOp(outInst.op)) {
              this.push(re2, inst.arg, currentPos, false);
              currentPc = inst.arg;
              currentPos = this.end;
              continue;
            }
            this.push(re2, inst.out, this.end, false);
            currentPc = inst.out;
            continue;
          }
          case Inst.RUNE: {
            const r = input.step(currentPos);
            if (r === MachineInputBase.EOF()) break;
            if (!inst.matchRune(r >> 3)) break;
            currentPos += r & 7;
            currentPc = inst.out;
            continue;
          }
          case Inst.RUNE1: {
            const r = input.step(currentPos);
            if (r === MachineInputBase.EOF()) break;
            if (r >> 3 !== inst.runes[0]) break;
            currentPos += r & 7;
            currentPc = inst.out;
            continue;
          }
          case Inst.RUNE_ANY_NOT_NL: {
            const r = input.step(currentPos);
            if (r === MachineInputBase.EOF()) break;
            if (r >> 3 === 10) break;
            currentPos += r & 7;
            currentPc = inst.out;
            continue;
          }
          case Inst.RUNE_ANY: {
            const r = input.step(currentPos);
            if (r === MachineInputBase.EOF()) break;
            currentPos += r & 7;
            currentPc = inst.out;
            continue;
          }
          case Inst.CAPTURE:
            if (arg) {
              this.cap[inst.arg] = currentPos;
              break;
            } else {
              if (inst.arg < this.ncap) {
                this.push(re2, currentPc, this.cap[inst.arg], true);
                this.cap[inst.arg] = currentPos;
              }
              currentPc = inst.out;
              continue;
            }
          case Inst.EMPTY_WIDTH: {
            const flag = input.context(currentPos);
            if ((inst.arg & ~flag) !== 0) break;
            currentPc = inst.out;
            continue;
          }
          case Inst.NOP:
            currentPc = inst.out;
            continue;
          case Inst.MATCH: {
            if (anchor === RE2Flags.ANCHOR_BOTH && currentPos !== this.end) break;
            if (this.ncap === 0) return true;
            if (this.ncap > 1) this.cap[1] = currentPos;
            const old = this.matchcap[1];
            if (old === -1 || longest && currentPos > 0 && currentPos > old) this.matchcap.set(this.cap);
            if (!longest) return true;
            if (currentPos === this.end) return true;
            break;
          }
          case Inst.LB_WRITE:
          case Inst.LB_CHECK:
            throw new RE2JSInternalException("Backtracker cannot evaluate Lookbehind instructions");
          default:
            throw new RE2JSInternalException("bad inst");
        }
        break;
      }
    }
    return longest && this.matchcap.length > 1 && this.matchcap[1] >= 0;
  }
};
var bitStatePool = [];
var Backtracker = class Backtracker2 {
  static shouldBacktrack(prog) {
    return prog.numInst() <= MAX_BACKTRACK_PROG;
  }
  static maxBitStateLen(prog) {
    if (!Backtracker2.shouldBacktrack(prog)) return 0;
    return Math.floor(MAX_BACKTRACK_VECTOR / prog.numInst());
  }
  static execute(re2, input, pos, anchor, ncap) {
    const startCond = re2.cond;
    if (startCond === Utils.EMPTY_ALL) return null;
    if ((anchor === RE2Flags.ANCHOR_START || anchor === RE2Flags.ANCHOR_BOTH) && pos !== 0) return null;
    if ((startCond & Utils.EMPTY_BEGIN_TEXT) !== 0 && pos !== 0) return null;
    const b2 = bitStatePool.length > 0 ? bitStatePool.pop() : new BitState();
    const end = input.endPos();
    b2.reset(re2.prog, end, ncap);
    let matched = false;
    if ((startCond & Utils.EMPTY_BEGIN_TEXT) !== 0 || anchor === RE2Flags.ANCHOR_START || anchor === RE2Flags.ANCHOR_BOTH) {
      if (b2.ncap > 0) b2.cap[0] = pos;
      if (b2.tryBacktrack(re2, input, re2.prog.start, pos, anchor)) matched = true;
    } else {
      let width2 = -1;
      for (; pos <= end && width2 !== 0; pos += width2) {
        if (re2.prefix.length > 0) {
          const advance = input.index(re2, pos);
          if (advance < 0) break;
          pos += advance;
        }
        if (b2.ncap > 0) b2.cap[0] = pos;
        if (b2.tryBacktrack(re2, input, re2.prog.start, pos, anchor)) {
          matched = true;
          break;
        }
        const r = input.step(pos);
        width2 = r === MachineInputBase.EOF() ? 0 : r & 7;
      }
    }
    if (!matched) {
      bitStatePool.push(b2);
      return null;
    }
    const result = ncap === 0 ? [] : Utils.toArray(b2.matchcap.subarray(0, ncap));
    bitStatePool.push(b2);
    return result;
  }
};
var QueueOnePass = class {
  constructor(size) {
    this.sparse = new Uint32Array(size);
    this.dense = new Uint32Array(size);
    this.size = 0;
    this.nextIndex = 0;
  }
  empty() {
    return this.nextIndex >= this.size;
  }
  next() {
    return this.dense[this.nextIndex++];
  }
  clear() {
    this.size = 0;
    this.nextIndex = 0;
  }
  contains(u) {
    return u < this.sparse.length && this.sparse[u] < this.size && this.dense[this.sparse[u]] === u;
  }
  insert(u) {
    if (!this.contains(u)) this.insertNew(u);
  }
  insertNew(u) {
    if (u >= this.sparse.length) return;
    this.sparse[u] = this.size;
    this.dense[this.size] = u;
    this.size++;
  }
};
var mergeRuneSets = (leftRunes, rightRunes, leftPC, rightPC) => {
  const leftLen = leftRunes.length;
  const rightLen = rightRunes.length;
  let lx = 0, rx = 0;
  const merged = [];
  const next = [];
  let ok = true;
  let ix = -1;
  const extend = (isLeft) => {
    const newArray = isLeft ? leftRunes : rightRunes;
    const low = isLeft ? lx : rx;
    const pc = isLeft ? leftPC : rightPC;
    if (ix > 0 && newArray[low] <= merged[ix]) return false;
    merged.push(newArray[low], newArray[low + 1]);
    if (isLeft) lx += 2;
    else rx += 2;
    ix += 2;
    next.push(pc);
    return true;
  };
  while (lx < leftLen || rx < rightLen) {
    if (rx >= rightLen) ok = extend(true);
    else if (lx >= leftLen) ok = extend(false);
    else if (rightRunes[rx] < leftRunes[lx]) ok = extend(false);
    else ok = extend(true);
    if (!ok) return null;
  }
  return {
    merged,
    next
  };
};
var OnePassProg = class {
  constructor(prog) {
    this.start = prog.start;
    this.numCap = prog.numCap;
    this.inst = new Array(prog.inst.length);
    for (let i = 0; i < prog.inst.length; i++) {
      const orig = prog.inst[i];
      const inst = new Inst(orig.op);
      inst.out = orig.out;
      inst.arg = orig.arg;
      inst.runes = orig.runes ? orig.runes.slice() : [];
      inst.next = null;
      this.inst[i] = inst;
    }
  }
};
var onePassCopy = (prog) => {
  const p2 = new OnePassProg(prog);
  for (let pc = 0; pc < p2.inst.length; pc++) {
    const inst = p2.inst[pc];
    if (inst.op !== Inst.ALT && inst.op !== Inst.ALT_MATCH) continue;
    let pAOther = "out";
    let pAAlt = "arg";
    let instAlt = p2.inst[inst[pAAlt]];
    if (instAlt.op !== Inst.ALT && instAlt.op !== Inst.ALT_MATCH) {
      pAOther = "arg";
      pAAlt = "out";
      instAlt = p2.inst[inst[pAAlt]];
      if (instAlt.op !== Inst.ALT && instAlt.op !== Inst.ALT_MATCH) continue;
    }
    const instOther = p2.inst[inst[pAOther]];
    if (instOther.op === Inst.ALT || instOther.op === Inst.ALT_MATCH) continue;
    let pBAlt = "out";
    let pBOther = "arg";
    let patch = false;
    if (instAlt.out === pc) patch = true;
    else if (instAlt.arg === pc) {
      patch = true;
      pBAlt = "arg";
      pBOther = "out";
    }
    if (patch) instAlt[pBAlt] = inst[pAOther];
    if (inst[pAOther] === instAlt[pBAlt]) inst[pAAlt] = instAlt[pBOther];
  }
  return p2;
};
var makeOnePass = (p2) => {
  if (p2.inst.length >= 1e3) return null;
  const instQueue = new QueueOnePass(p2.inst.length);
  const visitQueue = new QueueOnePass(p2.inst.length);
  const onePassRunes = new Array(p2.inst.length);
  const m2 = new Array(p2.inst.length).fill(false);
  const check = (pc) => {
    let ok = true;
    const inst = p2.inst[pc];
    if (visitQueue.contains(pc)) return true;
    visitQueue.insert(pc);
    switch (inst.op) {
      case Inst.ALT:
      case Inst.ALT_MATCH: {
        ok = check(inst.out) && check(inst.arg);
        let matchOut = m2[inst.out];
        let matchArg = m2[inst.arg];
        if (matchOut && matchArg) return false;
        if (matchArg) {
          const tempOut = inst.out;
          inst.out = inst.arg;
          inst.arg = tempOut;
          const tempMatch = matchOut;
          matchOut = matchArg;
          matchArg = tempMatch;
        }
        if (matchOut) {
          m2[pc] = true;
          inst.op = Inst.ALT_MATCH;
        }
        const leftRunes = onePassRunes[inst.out] || [];
        const rightRunes = onePassRunes[inst.arg] || [];
        const mergeRes = mergeRuneSets(leftRunes, rightRunes, inst.out, inst.arg);
        if (!mergeRes) return false;
        onePassRunes[pc] = mergeRes.merged;
        inst.next = new Uint32Array(mergeRes.next);
        break;
      }
      case Inst.CAPTURE:
      case Inst.EMPTY_WIDTH:
      case Inst.NOP:
        ok = check(inst.out);
        m2[pc] = m2[inst.out];
        onePassRunes[pc] = onePassRunes[inst.out] ? onePassRunes[inst.out].slice() : [];
        inst.next = new Uint32Array(Math.floor(onePassRunes[pc].length / 2) + 1).fill(inst.out);
        break;
      case Inst.MATCH:
      case Inst.FAIL:
        m2[pc] = inst.op === Inst.MATCH;
        break;
      case Inst.RUNE: {
        m2[pc] = false;
        if (inst.next && inst.next.length > 0) break;
        instQueue.insert(inst.out);
        if (!inst.runes || inst.runes.length === 0) {
          onePassRunes[pc] = [];
          inst.next = new Uint32Array([inst.out]);
          break;
        }
        let runes = [];
        if (inst.runes.length === 1 && (inst.arg & RE2Flags.FOLD_CASE) !== 0) {
          const r0 = inst.runes[0];
          runes.push(r0, r0);
          for (let r1 = Unicode.simpleFold(r0); r1 !== r0; r1 = Unicode.simpleFold(r1)) runes.push(r1, r1);
          runes.sort((a, b2) => a - b2);
        } else for (let j = 0; j < inst.runes.length; j++) runes.push(inst.runes[j]);
        onePassRunes[pc] = runes;
        inst.next = new Uint32Array(Math.floor(runes.length / 2) + 1).fill(inst.out);
        inst.op = Inst.RUNE;
        break;
      }
      case Inst.RUNE1: {
        m2[pc] = false;
        if (inst.next && inst.next.length > 0) break;
        instQueue.insert(inst.out);
        let runes = [];
        if ((inst.arg & RE2Flags.FOLD_CASE) !== 0) {
          const r0 = inst.runes[0];
          runes.push(r0, r0);
          for (let r1 = Unicode.simpleFold(r0); r1 !== r0; r1 = Unicode.simpleFold(r1)) runes.push(r1, r1);
          runes.sort((a, b2) => a - b2);
        } else runes.push(inst.runes[0], inst.runes[0]);
        onePassRunes[pc] = runes;
        inst.next = new Uint32Array(Math.floor(runes.length / 2) + 1).fill(inst.out);
        inst.op = Inst.RUNE;
        break;
      }
      case Inst.RUNE_ANY:
        m2[pc] = false;
        if (inst.next && inst.next.length > 0) break;
        instQueue.insert(inst.out);
        onePassRunes[pc] = [0, Unicode.MAX_RUNE];
        inst.next = new Uint32Array([inst.out]);
        break;
      case Inst.RUNE_ANY_NOT_NL:
        m2[pc] = false;
        if (inst.next && inst.next.length > 0) break;
        instQueue.insert(inst.out);
        onePassRunes[pc] = [
          0,
          9,
          11,
          Unicode.MAX_RUNE
        ];
        inst.next = new Uint32Array(Math.floor(onePassRunes[pc].length / 2) + 1).fill(inst.out);
        break;
    }
    return ok;
  };
  instQueue.clear();
  instQueue.insert(p2.start);
  while (!instQueue.empty()) {
    visitQueue.clear();
    if (!check(instQueue.next())) return null;
  }
  for (let i = 0; i < p2.inst.length; i++) if (onePassRunes[i]) p2.inst[i].runes = onePassRunes[i];
  return p2;
};
var cleanupOnePass = (p2, original) => {
  for (let ix = 0; ix < original.inst.length; ix++) {
    const instOriginal = original.inst[ix];
    switch (instOriginal.op) {
      case Inst.ALT:
      case Inst.ALT_MATCH:
      case Inst.RUNE:
        break;
      case Inst.CAPTURE:
      case Inst.EMPTY_WIDTH:
      case Inst.NOP:
      case Inst.MATCH:
      case Inst.FAIL:
        p2.inst[ix].next = null;
        break;
      case Inst.RUNE1:
      case Inst.RUNE_ANY:
      case Inst.RUNE_ANY_NOT_NL:
        p2.inst[ix].next = null;
        p2.inst[ix].op = instOriginal.op;
        p2.inst[ix].runes = instOriginal.runes ? instOriginal.runes.slice() : [];
        break;
    }
  }
};
var OnePass = class OnePass2 {
  static compile(prog) {
    if (prog.start === 0) return null;
    if (prog.numLb > 0) return null;
    const startInst = prog.inst[prog.start];
    if (startInst.op !== Inst.EMPTY_WIDTH || (startInst.arg & Utils.EMPTY_BEGIN_TEXT) === 0) return null;
    let hasAlt = false;
    for (let i = 0; i < prog.inst.length; i++) if (prog.inst[i].op === Inst.ALT || prog.inst[i].op === Inst.ALT_MATCH) {
      hasAlt = true;
      break;
    }
    for (let i = 0; i < prog.inst.length; i++) {
      const inst = prog.inst[i];
      const opOut = prog.inst[inst.out].op;
      switch (inst.op) {
        case Inst.ALT:
        case Inst.ALT_MATCH:
          if (opOut === Inst.MATCH || prog.inst[inst.arg].op === Inst.MATCH) return null;
          break;
        case Inst.EMPTY_WIDTH:
          if (opOut === Inst.MATCH) {
            if ((inst.arg & Utils.EMPTY_END_TEXT) === Utils.EMPTY_END_TEXT) continue;
            return null;
          }
          break;
        default:
          if (opOut === Inst.MATCH && hasAlt) return null;
          break;
      }
    }
    let p2 = onePassCopy(prog);
    p2 = makeOnePass(p2);
    if (p2 !== null) cleanupOnePass(p2, prog);
    return p2;
  }
  static next(inst, r) {
    const nextIdx = inst.matchRunePos(r);
    if (nextIdx >= 0) return inst.next[nextIdx];
    if (inst.op === Inst.ALT_MATCH) return inst.out;
    return 0;
  }
  static execute(re2, input, pos, anchor, ncap) {
    const onepass = re2.onepass;
    if (!onepass) return null;
    const matchcap = new Int32Array(ncap).fill(-1);
    let matched = false;
    let r = input.step(pos);
    let rune = r >> 3;
    let width2 = r & 7;
    let r1 = MachineInputBase.EOF();
    let rune1 = -1;
    let width1 = 0;
    if (r !== MachineInputBase.EOF()) {
      r1 = input.step(pos + width2);
      if (r1 !== MachineInputBase.EOF()) {
        rune1 = r1 >> 3;
        width1 = r1 & 7;
      }
    }
    let flag = pos === 0 ? Utils.emptyOpContext(-1, rune) : input.context(pos);
    let pc = onepass.start;
    let inst;
    while (true) {
      inst = onepass.inst[pc];
      pc = inst.out;
      switch (inst.op) {
        case Inst.MATCH:
          if (anchor === RE2Flags.ANCHOR_BOTH && pos !== input.endPos()) return null;
          matched = true;
          if (matchcap.length > 0) {
            matchcap[0] = 0;
            matchcap[1] = pos;
          }
          return ncap === 0 ? [] : Utils.toArray(matchcap);
        case Inst.RUNE:
          if (!inst.matchRune(rune)) return null;
          break;
        case Inst.RUNE1:
          if (rune !== inst.runes[0]) return null;
          break;
        case Inst.RUNE_ANY:
          break;
        case Inst.RUNE_ANY_NOT_NL:
          if (rune === 10) return null;
          break;
        case Inst.ALT:
        case Inst.ALT_MATCH:
          pc = OnePass2.next(inst, rune);
          continue;
        case Inst.FAIL:
          return null;
        case Inst.NOP:
          continue;
        case Inst.EMPTY_WIDTH:
          if ((inst.arg & ~flag) !== 0) return null;
          continue;
        case Inst.CAPTURE:
          if (inst.arg < matchcap.length) matchcap[inst.arg] = pos;
          continue;
        default:
          throw new RE2JSInternalException("bad inst");
      }
      if (width2 === 0) break;
      flag = Utils.emptyOpContext(rune, rune1);
      pos += width2;
      rune = rune1;
      width2 = width1;
      if (rune !== -1) {
        r1 = input.step(pos + width2);
        if (r1 !== MachineInputBase.EOF()) {
          rune1 = r1 >> 3;
          width1 = r1 & 7;
        } else {
          rune1 = -1;
          width1 = 0;
        }
      }
    }
    if (!matched) return null;
    return ncap === 0 ? [] : Utils.toArray(matchcap);
  }
};
var Regexp = class Regexp2 {
  static Op = createEnum([
    "NO_MATCH",
    "EMPTY_MATCH",
    "LITERAL",
    "CHAR_CLASS",
    "ANY_CHAR_NOT_NL",
    "ANY_CHAR",
    "BEGIN_LINE",
    "END_LINE",
    "BEGIN_TEXT",
    "END_TEXT",
    "WORD_BOUNDARY",
    "NO_WORD_BOUNDARY",
    "CAPTURE",
    "STAR",
    "PLUS",
    "QUEST",
    "REPEAT",
    "CONCAT",
    "ALTERNATE",
    "PLB",
    "NLB",
    "LEFT_PAREN",
    "VERTICAL_BAR"
  ]);
  static isPseudoOp(op) {
    return op >= Regexp2.Op.LEFT_PAREN;
  }
  static emptySubs() {
    return [];
  }
  static quoteIfHyphen(rune) {
    if (rune === Codepoint.CODES.get("-")) return "\\";
    return "";
  }
  static fromRegexp(re) {
    const regex = new Regexp2(re.op);
    regex.flags = re.flags;
    regex.subs = re.subs;
    regex.runes = re.runes;
    regex.cap = re.cap;
    regex.min = re.min;
    regex.max = re.max;
    regex.name = re.name;
    regex.namedGroups = re.namedGroups;
    regex.lb = re.lb;
    return regex;
  }
  constructor(op) {
    this.op = op;
    this.flags = 0;
    this.subs = Regexp2.emptySubs();
    this.runes = [];
    this.min = 0;
    this.max = 0;
    this.cap = 0;
    this.name = null;
    this.namedGroups = /* @__PURE__ */ Object.create(null);
    this.lb = 0;
  }
  reinit() {
    this.flags = 0;
    this.subs = Regexp2.emptySubs();
    this.runes = [];
    this.cap = 0;
    this.min = 0;
    this.max = 0;
    this.name = null;
    this.namedGroups = /* @__PURE__ */ Object.create(null);
    this.lb = 0;
  }
  toString() {
    return this.appendTo();
  }
  appendTo() {
    let out = "";
    switch (this.op) {
      case Regexp2.Op.NO_MATCH:
        out += "[^\\x00-\\x{10FFFF}]";
        break;
      case Regexp2.Op.EMPTY_MATCH:
        out += "(?:)";
        break;
      case Regexp2.Op.STAR:
      case Regexp2.Op.PLUS:
      case Regexp2.Op.QUEST:
      case Regexp2.Op.REPEAT: {
        const sub = this.subs[0];
        if (sub.op > Regexp2.Op.CAPTURE || sub.op === Regexp2.Op.LITERAL && sub.runes.length > 1) out += `(?:${sub.appendTo()})`;
        else out += sub.appendTo();
        switch (this.op) {
          case Regexp2.Op.STAR:
            out += "*";
            break;
          case Regexp2.Op.PLUS:
            out += "+";
            break;
          case Regexp2.Op.QUEST:
            out += "?";
            break;
          case Regexp2.Op.REPEAT:
            out += `{${this.min}`;
            if (this.min !== this.max) {
              out += ",";
              if (this.max >= 0) out += this.max;
            }
            out += "}";
            break;
        }
        if ((this.flags & RE2Flags.NON_GREEDY) !== 0) out += "?";
        break;
      }
      case Regexp2.Op.CONCAT:
        for (let sub of this.subs) if (sub.op === Regexp2.Op.ALTERNATE) out += `(?:${sub.appendTo()})`;
        else out += sub.appendTo();
        break;
      case Regexp2.Op.ALTERNATE: {
        let sep3 = "";
        for (let sub of this.subs) {
          out += sep3;
          sep3 = "|";
          out += sub.appendTo();
        }
        break;
      }
      case Regexp2.Op.LITERAL:
        if ((this.flags & RE2Flags.FOLD_CASE) !== 0) out += "(?i:";
        for (let rune of this.runes) out += Utils.escapeRune(rune);
        if ((this.flags & RE2Flags.FOLD_CASE) !== 0) out += ")";
        break;
      case Regexp2.Op.ANY_CHAR_NOT_NL:
        out += "(?-s:.)";
        break;
      case Regexp2.Op.ANY_CHAR:
        out += "(?s:.)";
        break;
      case Regexp2.Op.PLB:
        out += `(?<=${this.subs[0].appendTo()})`;
        break;
      case Regexp2.Op.NLB:
        out += `(?<!${this.subs[0].appendTo()})`;
        break;
      case Regexp2.Op.CAPTURE:
        if (this.name === null || this.name.length === 0) out += "(";
        else out += `(?P<${this.name}>`;
        if (this.subs[0].op !== Regexp2.Op.EMPTY_MATCH) out += this.subs[0].appendTo();
        out += ")";
        break;
      case Regexp2.Op.BEGIN_TEXT:
        out += "\\A";
        break;
      case Regexp2.Op.END_TEXT:
        if ((this.flags & RE2Flags.WAS_DOLLAR) !== 0) out += "(?-m:$)";
        else out += "\\z";
        break;
      case Regexp2.Op.BEGIN_LINE:
        out += "^";
        break;
      case Regexp2.Op.END_LINE:
        out += "$";
        break;
      case Regexp2.Op.WORD_BOUNDARY:
        out += "\\b";
        break;
      case Regexp2.Op.NO_WORD_BOUNDARY:
        out += "\\B";
        break;
      case Regexp2.Op.CHAR_CLASS:
        if (this.runes.length % 2 !== 0) {
          out += "[invalid char class]";
          break;
        }
        out += "[";
        if (this.runes.length === 0) out += "^\\x00-\\x{10FFFF}";
        else if (this.runes[0] === 0 && this.runes[this.runes.length - 1] === Unicode.MAX_RUNE) {
          out += "^";
          for (let i = 1; i < this.runes.length - 1; i += 2) {
            const lo = this.runes[i] + 1;
            const hi = this.runes[i + 1] - 1;
            out += Regexp2.quoteIfHyphen(lo);
            out += Utils.escapeRune(lo);
            if (lo !== hi) {
              out += "-";
              out += Regexp2.quoteIfHyphen(hi);
              out += Utils.escapeRune(hi);
            }
          }
        } else for (let i = 0; i < this.runes.length; i += 2) {
          const lo = this.runes[i];
          const hi = this.runes[i + 1];
          out += Regexp2.quoteIfHyphen(lo);
          out += Utils.escapeRune(lo);
          if (lo !== hi) {
            out += "-";
            out += Regexp2.quoteIfHyphen(hi);
            out += Utils.escapeRune(hi);
          }
        }
        out += "]";
        break;
      default:
        out += this.op;
        break;
    }
    return out;
  }
  maxCap() {
    let m2 = 0;
    if (this.op === Regexp2.Op.CAPTURE) m2 = this.cap;
    if (this.subs !== null) for (let sub of this.subs) {
      const n2 = sub.maxCap();
      if (m2 < n2) m2 = n2;
    }
    return m2;
  }
  equals(that) {
    if (!(that !== null && that instanceof Regexp2)) return false;
    if (this.op !== that.op) return false;
    switch (this.op) {
      case Regexp2.Op.END_TEXT:
        if ((this.flags & RE2Flags.WAS_DOLLAR) !== (that.flags & RE2Flags.WAS_DOLLAR)) return false;
        break;
      case Regexp2.Op.LITERAL:
      case Regexp2.Op.CHAR_CLASS:
        if (this.runes === null && that.runes === null) break;
        if (this.runes === null || that.runes === null) return false;
        if (this.runes.length !== that.runes.length) return false;
        for (let i = 0; i < this.runes.length; i++) if (this.runes[i] !== that.runes[i]) return false;
        break;
      case Regexp2.Op.ALTERNATE:
      case Regexp2.Op.CONCAT:
        if (this.subs.length !== that.subs.length) return false;
        for (let i = 0; i < this.subs.length; ++i) if (!this.subs[i].equals(that.subs[i])) return false;
        break;
      case Regexp2.Op.STAR:
      case Regexp2.Op.PLUS:
      case Regexp2.Op.QUEST:
        if ((this.flags & RE2Flags.NON_GREEDY) !== (that.flags & RE2Flags.NON_GREEDY) || !this.subs[0].equals(that.subs[0])) return false;
        break;
      case Regexp2.Op.REPEAT:
        if ((this.flags & RE2Flags.NON_GREEDY) !== (that.flags & RE2Flags.NON_GREEDY) || this.min !== that.min || this.max !== that.max || !this.subs[0].equals(that.subs[0])) return false;
        break;
      case Regexp2.Op.CAPTURE:
        if (this.cap !== that.cap || (this.name === null ? that.name !== null : this.name !== that.name) || !this.subs[0].equals(that.subs[0])) return false;
        break;
      case Regexp2.Op.PLB:
      case Regexp2.Op.NLB:
        if (this.lb !== that.lb || !this.subs[0].equals(that.subs[0])) return false;
        break;
    }
    return true;
  }
};
var AhoCorasick = class {
  constructor(wordArrays) {
    this.next = [/* @__PURE__ */ Object.create(null)];
    this.fail = [0];
    this.match = [false];
    for (const word of wordArrays) {
      let node = 0;
      for (let i = 0; i < word.length; i++) {
        const val = word[i];
        if (!(val in this.next[node])) {
          this.next.push(/* @__PURE__ */ Object.create(null));
          this.fail.push(0);
          this.match.push(false);
          this.next[node][val] = this.next.length - 1;
        }
        node = this.next[node][val];
      }
      this.match[node] = true;
    }
    const queue = [];
    for (const val in this.next[0]) if (Object.prototype.hasOwnProperty.call(this.next[0], val)) {
      const child = this.next[0][val];
      this.fail[child] = 0;
      queue.push(child);
    }
    while (queue.length > 0) {
      const curr = queue.shift();
      for (const val in this.next[curr]) if (Object.prototype.hasOwnProperty.call(this.next[curr], val)) {
        const child = this.next[curr][val];
        let failNode = this.fail[curr];
        while (failNode !== 0 && !(val in this.next[failNode])) failNode = this.fail[failNode];
        if (val in this.next[failNode]) this.fail[child] = this.next[failNode][val];
        else this.fail[child] = 0;
        this.match[child] = this.match[child] || this.match[this.fail[child]];
        queue.push(child);
      }
    }
  }
  searchUTF16(charSeq, start2, end) {
    let node = 0;
    for (let i = start2; i < end; i++) {
      const val = charSeq.charCodeAt(i);
      while (node !== 0 && !(val in this.next[node])) node = this.fail[node];
      if (val in this.next[node]) node = this.next[node][val];
      if (this.match[node]) return true;
    }
    return false;
  }
  searchUTF8(bytes, start2, end) {
    let node = 0;
    for (let i = start2; i < end; i++) {
      const val = bytes[i];
      while (node !== 0 && !(val in this.next[node])) node = this.fail[node];
      if (val in this.next[node]) node = this.next[node][val];
      if (this.match[node]) return true;
    }
    return false;
  }
};
var Prefilter = class Prefilter2 {
  static Type = {
    NONE: 0,
    EXACT: 1,
    AND: 2,
    OR: 3
  };
  constructor(type) {
    this.type = type;
    this.subs = [];
    this.str = "";
    this.bytes = null;
    this.ac16 = null;
    this.ac8 = null;
  }
  eval(input, pos) {
    switch (this.type) {
      case Prefilter2.Type.NONE:
        return true;
      case Prefilter2.Type.EXACT:
        return input.hasString(this, pos);
      case Prefilter2.Type.AND:
        for (let i = 0; i < this.subs.length; i++) if (!this.subs[i].eval(input, pos)) return false;
        return true;
      case Prefilter2.Type.OR:
        if (this.ac16 && this.ac8) return input.hasAnyString(this, pos);
        for (let i = 0; i < this.subs.length; i++) if (this.subs[i].eval(input, pos)) return true;
        return false;
      default:
        return true;
    }
  }
};
var PrefilterTree = class PrefilterTree2 {
  static build(re) {
    const pf = PrefilterTree2.fromRegexp(re);
    return PrefilterTree2.simplify(pf);
  }
  static fromRegexp(re) {
    if (!re) return new Prefilter(Prefilter.Type.NONE);
    switch (re.op) {
      case Regexp.Op.PLB:
      case Regexp.Op.NLB:
      case Regexp.Op.NO_MATCH:
      case Regexp.Op.EMPTY_MATCH:
      case Regexp.Op.BEGIN_LINE:
      case Regexp.Op.END_LINE:
      case Regexp.Op.BEGIN_TEXT:
      case Regexp.Op.END_TEXT:
      case Regexp.Op.WORD_BOUNDARY:
      case Regexp.Op.NO_WORD_BOUNDARY:
      case Regexp.Op.CHAR_CLASS:
      case Regexp.Op.ANY_CHAR_NOT_NL:
      case Regexp.Op.ANY_CHAR:
        return new Prefilter(Prefilter.Type.NONE);
      case Regexp.Op.LITERAL: {
        if (re.runes.length === 0 || (re.flags & RE2Flags.FOLD_CASE) !== 0) return new Prefilter(Prefilter.Type.NONE);
        const pf = new Prefilter(Prefilter.Type.EXACT);
        let str = "";
        for (let i = 0; i < re.runes.length; i++) str += String.fromCodePoint(re.runes[i]);
        pf.str = str;
        pf.bytes = Utils.stringToUtf8ByteArray(pf.str);
        return pf;
      }
      case Regexp.Op.CAPTURE:
      case Regexp.Op.PLUS:
        return PrefilterTree2.fromRegexp(re.subs[0]);
      case Regexp.Op.REPEAT:
        if (re.min >= 1) return PrefilterTree2.fromRegexp(re.subs[0]);
        return new Prefilter(Prefilter.Type.NONE);
      case Regexp.Op.CONCAT: {
        const pf = new Prefilter(Prefilter.Type.AND);
        for (const sub of re.subs) pf.subs.push(PrefilterTree2.fromRegexp(sub));
        return pf;
      }
      case Regexp.Op.ALTERNATE: {
        const pf = new Prefilter(Prefilter.Type.OR);
        for (const sub of re.subs) pf.subs.push(PrefilterTree2.fromRegexp(sub));
        return pf;
      }
      default:
        return new Prefilter(Prefilter.Type.NONE);
    }
  }
  static simplify(pf) {
    if (pf.type === Prefilter.Type.EXACT || pf.type === Prefilter.Type.NONE) return pf;
    if (pf.type === Prefilter.Type.AND) {
      const newSubs = [];
      for (const sub of pf.subs) {
        const s = PrefilterTree2.simplify(sub);
        if (s.type !== Prefilter.Type.NONE) if (s.type === Prefilter.Type.AND) for (let j = 0; j < s.subs.length; j++) newSubs.push(s.subs[j]);
        else newSubs.push(s);
      }
      if (newSubs.length === 0) return new Prefilter(Prefilter.Type.NONE);
      if (newSubs.length === 1) return newSubs[0];
      pf.subs = newSubs;
      return pf;
    }
    if (pf.type === Prefilter.Type.OR) {
      const newSubs = [];
      for (const sub of pf.subs) {
        const s = PrefilterTree2.simplify(sub);
        if (s.type === Prefilter.Type.NONE) return new Prefilter(Prefilter.Type.NONE);
        if (s.type === Prefilter.Type.OR) for (let j = 0; j < s.subs.length; j++) newSubs.push(s.subs[j]);
        else newSubs.push(s);
      }
      if (newSubs.length === 0) return new Prefilter(Prefilter.Type.NONE);
      if (newSubs.length === 1) return newSubs[0];
      const seen = /* @__PURE__ */ new Set();
      const uniqueSubs = [];
      for (const sub of newSubs) if (sub.type === Prefilter.Type.EXACT) {
        if (!seen.has(sub.str)) {
          seen.add(sub.str);
          uniqueSubs.push(sub);
        }
      } else uniqueSubs.push(sub);
      pf.subs = uniqueSubs;
      let allExact = true;
      for (const sub of uniqueSubs) if (sub.type !== Prefilter.Type.EXACT) {
        allExact = false;
        break;
      }
      if (allExact && uniqueSubs.length > 1) {
        pf.ac16 = new AhoCorasick(uniqueSubs.map((s) => {
          const arr = [];
          for (let i = 0; i < s.str.length; i++) arr.push(s.str.charCodeAt(i));
          return arr;
        }));
        pf.ac8 = new AhoCorasick(uniqueSubs.map((s) => s.bytes));
      }
      return pf;
    }
    return pf;
  }
};
var PatchList = class {
  /**
  * @param {number} head - Encoded pointer to the start of the patch list.
  * @param {number} tail - Encoded pointer to the end of the patch list.
  */
  constructor(head = 0, tail = 0) {
    this.head = head;
    this.tail = tail;
  }
};
var Prog = class {
  constructor() {
    this.inst = [];
    this.start = 0;
    this.numCap = 2;
    this.lbStarts = [];
    this.numLb = 0;
  }
  getInst(pc) {
    return this.inst[pc];
  }
  numInst() {
    return this.inst.length;
  }
  addInst(op) {
    this.inst.push(new Inst(op));
  }
  skipNop(pc) {
    let i = this.inst[pc];
    while (i.op === Inst.NOP || i.op === Inst.CAPTURE) {
      i = this.inst[pc];
      pc = i.out;
    }
    return i;
  }
  prefix() {
    let prefix = "";
    let i = this.skipNop(this.start);
    if (!Inst.isRuneOp(i.op) || i.runes.length !== 1) return [i.op === Inst.MATCH, prefix];
    while (Inst.isRuneOp(i.op) && i.runes.length === 1 && (i.arg & RE2Flags.FOLD_CASE) === 0) {
      prefix += String.fromCodePoint(i.runes[0]);
      i = this.skipNop(i.out);
    }
    return [i.op === Inst.MATCH, prefix];
  }
  startCond() {
    let flag = 0;
    let pc = this.start;
    loop: for (; ; ) {
      const i = this.inst[pc];
      switch (i.op) {
        case Inst.EMPTY_WIDTH:
          flag |= i.arg;
          break;
        case Inst.FAIL:
          return -1;
        case Inst.CAPTURE:
        case Inst.NOP:
          break;
        default:
          break loop;
      }
      pc = i.out;
    }
    return flag;
  }
  patch(l, val) {
    let head = l.head;
    while (head !== 0) {
      const i = this.inst[head >> 1];
      if ((head & 1) === 0) {
        head = i.out;
        i.out = val;
      } else {
        head = i.arg;
        i.arg = val;
      }
    }
  }
  append(l1, l2) {
    if (l1.head === 0) return l2;
    if (l2.head === 0) return l1;
    const i = this.inst[l1.tail >> 1];
    if ((l1.tail & 1) === 0) i.out = l2.head;
    else i.arg = l2.head;
    return new PatchList(l1.head, l2.tail);
  }
  /**
  *
  * @returns {string}
  */
  toString() {
    let out = "";
    for (let pc = 0; pc < this.inst.length; pc++) {
      const len = out.length;
      out += pc;
      if (pc === this.start) out += "*";
      out += "        ".substring(out.length - len);
      out += this.inst[pc];
      out += "\n";
    }
    return out;
  }
};
var Frag = class {
  constructor(i = 0, out = new PatchList(), nullable = false) {
    this.i = i;
    this.out = out;
    this.nullable = nullable;
  }
};
var Compiler = class Compiler2 {
  static ANY_RUNE_NOT_NL() {
    return [
      0,
      Codepoint.CODES.get("\n") - 1,
      Codepoint.CODES.get("\n") + 1,
      Unicode.MAX_RUNE
    ];
  }
  static ANY_RUNE() {
    return [0, Unicode.MAX_RUNE];
  }
  static compileRegexp(re) {
    const c = new Compiler2();
    const f2 = c.compile(re);
    c.prog.patch(f2.out, c.newInst(Inst.MATCH).i);
    c.prog.start = f2.i;
    return c.prog;
  }
  static compileSet(regexps) {
    const c = new Compiler2();
    if (regexps.length === 0) {
      c.prog.start = c.newInst(Inst.FAIL).i;
      return c.prog;
    }
    let starts = [];
    for (let i = 0; i < regexps.length; i++) {
      const f2 = c.compile(regexps[i]);
      const m2 = c.newInst(Inst.MATCH);
      c.prog.getInst(m2.i).arg = i;
      c.prog.patch(f2.out, m2.i);
      starts.push(f2.i);
    }
    let start2 = starts[0];
    for (let i = 1; i < starts.length; i++) {
      const f2 = c.newInst(Inst.ALT);
      const inst = c.prog.getInst(f2.i);
      inst.out = start2;
      inst.arg = starts[i];
      start2 = f2.i;
    }
    c.prog.start = start2;
    return c.prog;
  }
  constructor() {
    this.prog = new Prog();
    this.newInst(Inst.FAIL);
  }
  newInst(op) {
    this.prog.addInst(op);
    return new Frag(this.prog.numInst() - 1, new PatchList(), true);
  }
  nop() {
    const f2 = this.newInst(Inst.NOP);
    f2.out = new PatchList(f2.i << 1, f2.i << 1);
    return f2;
  }
  fail() {
    return new Frag();
  }
  cap(arg) {
    const f2 = this.newInst(Inst.CAPTURE);
    f2.out = new PatchList(f2.i << 1, f2.i << 1);
    this.prog.getInst(f2.i).arg = arg;
    if (this.prog.numCap < arg + 1) this.prog.numCap = arg + 1;
    return f2;
  }
  cat(f1, f2) {
    if (f1.i === 0 || f2.i === 0) return this.fail();
    this.prog.patch(f1.out, f2.i);
    return new Frag(f1.i, f2.out, f1.nullable && f2.nullable);
  }
  alt(f1, f2) {
    if (f1.i === 0) return f2;
    if (f2.i === 0) return f1;
    const f3 = this.newInst(Inst.ALT);
    const i = this.prog.getInst(f3.i);
    i.out = f1.i;
    i.arg = f2.i;
    f3.out = this.prog.append(f1.out, f2.out);
    f3.nullable = f1.nullable || f2.nullable;
    return f3;
  }
  loop(f1, nongreedy) {
    const f2 = this.newInst(Inst.ALT);
    const i = this.prog.getInst(f2.i);
    if (nongreedy) {
      i.arg = f1.i;
      f2.out = new PatchList(f2.i << 1, f2.i << 1);
    } else {
      i.out = f1.i;
      f2.out = new PatchList(f2.i << 1 | 1, f2.i << 1 | 1);
    }
    this.prog.patch(f1.out, f2.i);
    return f2;
  }
  quest(f1, nongreedy) {
    const f2 = this.newInst(Inst.ALT);
    const i = this.prog.getInst(f2.i);
    if (nongreedy) {
      i.arg = f1.i;
      f2.out = new PatchList(f2.i << 1, f2.i << 1);
    } else {
      i.out = f1.i;
      f2.out = new PatchList(f2.i << 1 | 1, f2.i << 1 | 1);
    }
    f2.out = this.prog.append(f2.out, f1.out);
    return f2;
  }
  star(f1, nongreedy) {
    if (f1.nullable) return this.quest(this.plus(f1, nongreedy), nongreedy);
    return this.loop(f1, nongreedy);
  }
  plus(f1, nongreedy) {
    return new Frag(f1.i, this.loop(f1, nongreedy).out, f1.nullable);
  }
  empty(op) {
    const f2 = this.newInst(Inst.EMPTY_WIDTH);
    this.prog.getInst(f2.i).arg = op;
    f2.out = new PatchList(f2.i << 1, f2.i << 1);
    return f2;
  }
  rune(runes, flags) {
    const f2 = this.newInst(Inst.RUNE);
    f2.nullable = false;
    const i = this.prog.getInst(f2.i);
    i.runes = runes;
    flags &= RE2Flags.FOLD_CASE;
    if (runes.length !== 1 || Unicode.simpleFold(runes[0]) === runes[0]) flags &= ~RE2Flags.FOLD_CASE;
    i.arg = flags;
    f2.out = new PatchList(f2.i << 1, f2.i << 1);
    if ((flags & RE2Flags.FOLD_CASE) === 0 && runes.length === 1 || runes.length === 2 && runes[0] === runes[1]) i.op = Inst.RUNE1;
    else if (runes.length === 2 && runes[0] === 0 && runes[1] === Unicode.MAX_RUNE) i.op = Inst.RUNE_ANY;
    else if (runes.length === 4 && runes[0] === 0 && runes[1] === Codepoint.CODES.get("\n") - 1 && runes[2] === Codepoint.CODES.get("\n") + 1 && runes[3] === Unicode.MAX_RUNE) i.op = Inst.RUNE_ANY_NOT_NL;
    return f2;
  }
  lookBehind(a, lb) {
    const id2 = this.newInst(Inst.LB_WRITE);
    this.prog.getInst(id2.i).arg = lb;
    const any = this.rune(Compiler2.ANY_RUNE(), 0);
    const dotStar = this.star(any, true);
    const lbAutomaton = this.cat(dotStar, a);
    this.prog.patch(lbAutomaton.out, id2.i);
    const checkId = this.newInst(Inst.LB_CHECK);
    this.prog.getInst(checkId.i).arg = lb;
    this.prog.lbStarts.push(lbAutomaton.i);
    if (Math.abs(lb) > this.prog.numLb) this.prog.numLb = Math.abs(lb);
    checkId.out = new PatchList(checkId.i << 1, checkId.i << 1);
    return checkId;
  }
  compile(re) {
    switch (re.op) {
      case Regexp.Op.NO_MATCH:
        return this.fail();
      case Regexp.Op.EMPTY_MATCH:
        return this.nop();
      case Regexp.Op.LITERAL:
        if (re.runes.length === 0) return this.nop();
        else {
          let f2 = null;
          for (let r of re.runes) {
            const f1 = this.rune([r], re.flags);
            f2 = f2 === null ? f1 : this.cat(f2, f1);
          }
          return f2;
        }
      case Regexp.Op.CHAR_CLASS:
        return this.rune(re.runes, re.flags);
      case Regexp.Op.ANY_CHAR_NOT_NL:
        return this.rune(Compiler2.ANY_RUNE_NOT_NL(), 0);
      case Regexp.Op.ANY_CHAR:
        return this.rune(Compiler2.ANY_RUNE(), 0);
      case Regexp.Op.BEGIN_LINE:
        return this.empty(Utils.EMPTY_BEGIN_LINE);
      case Regexp.Op.END_LINE:
        return this.empty(Utils.EMPTY_END_LINE);
      case Regexp.Op.BEGIN_TEXT:
        return this.empty(Utils.EMPTY_BEGIN_TEXT);
      case Regexp.Op.END_TEXT:
        return this.empty(Utils.EMPTY_END_TEXT);
      case Regexp.Op.WORD_BOUNDARY:
        return this.empty(Utils.EMPTY_WORD_BOUNDARY);
      case Regexp.Op.NO_WORD_BOUNDARY:
        return this.empty(Utils.EMPTY_NO_WORD_BOUNDARY);
      case Regexp.Op.PLB:
      case Regexp.Op.NLB:
        return this.lookBehind(this.compile(re.subs[0]), re.lb);
      case Regexp.Op.CAPTURE: {
        const bra = this.cap(re.cap << 1);
        const sub = this.compile(re.subs[0]);
        const ket = this.cap(re.cap << 1 | 1);
        return this.cat(this.cat(bra, sub), ket);
      }
      case Regexp.Op.STAR:
        return this.star(this.compile(re.subs[0]), (re.flags & RE2Flags.NON_GREEDY) !== 0);
      case Regexp.Op.PLUS:
        return this.plus(this.compile(re.subs[0]), (re.flags & RE2Flags.NON_GREEDY) !== 0);
      case Regexp.Op.QUEST:
        return this.quest(this.compile(re.subs[0]), (re.flags & RE2Flags.NON_GREEDY) !== 0);
      case Regexp.Op.CONCAT:
        if (re.subs.length === 0) return this.nop();
        else {
          let f2 = null;
          for (let sub of re.subs) {
            const f1 = this.compile(sub);
            f2 = f2 === null ? f1 : this.cat(f2, f1);
          }
          return f2;
        }
      case Regexp.Op.ALTERNATE:
        if (re.subs.length === 0) return this.nop();
        else {
          let f2 = null;
          for (let sub of re.subs) {
            const f1 = this.compile(sub);
            f2 = f2 === null ? f1 : this.alt(f2, f1);
          }
          return f2;
        }
      default:
        throw new RE2JSCompileException("regexp: unhandled case in compile");
    }
  }
};
var Simplify = class Simplify2 {
  static simplify(re) {
    if (re === null) return null;
    switch (re.op) {
      case Regexp.Op.PLB:
      case Regexp.Op.NLB:
      case Regexp.Op.CAPTURE: {
        const sub = Simplify2.simplify(re.subs[0]);
        if (sub !== re.subs[0]) {
          const nre = Regexp.fromRegexp(re);
          nre.runes = [];
          nre.subs = [sub];
          return nre;
        }
        return re;
      }
      case Regexp.Op.CONCAT:
      case Regexp.Op.ALTERNATE: {
        const newSubs = [];
        let changed = false;
        for (let i = 0; i < re.subs.length; i++) {
          const sub = re.subs[i];
          const nsub = Simplify2.simplify(sub);
          if (nsub !== sub) changed = true;
          if (re.op === Regexp.Op.CONCAT) {
            if (nsub.op === Regexp.Op.NO_MATCH) return new Regexp(Regexp.Op.NO_MATCH);
            if (nsub.op === Regexp.Op.EMPTY_MATCH) {
              changed = true;
              continue;
            }
            if (nsub.op === Regexp.Op.CONCAT) {
              changed = true;
              for (let j = 0; j < nsub.subs.length; j++) newSubs.push(nsub.subs[j]);
              continue;
            }
          } else if (re.op === Regexp.Op.ALTERNATE) {
            if (nsub.op === Regexp.Op.NO_MATCH) {
              changed = true;
              continue;
            }
            if (nsub.op === Regexp.Op.ALTERNATE) {
              changed = true;
              for (let j = 0; j < nsub.subs.length; j++) newSubs.push(nsub.subs[j]);
              continue;
            }
          }
          newSubs.push(nsub);
        }
        if (changed) {
          if (newSubs.length === 0) return new Regexp(re.op === Regexp.Op.CONCAT ? Regexp.Op.EMPTY_MATCH : Regexp.Op.NO_MATCH);
          if (newSubs.length === 1) return newSubs[0];
          const nre = Regexp.fromRegexp(re);
          nre.runes = [];
          nre.subs = newSubs;
          return nre;
        }
        return re;
      }
      case Regexp.Op.CHAR_CLASS:
        if (re.runes === null) return re;
        if (re.runes.length === 0) return new Regexp(Regexp.Op.NO_MATCH);
        if (re.runes.length === 2 && re.runes[0] === 0 && re.runes[1] === Unicode.MAX_RUNE) return new Regexp(Regexp.Op.ANY_CHAR);
        if (re.runes.length === 4 && re.runes[0] === 0 && re.runes[1] === Codepoint.CODES.get("\n") - 1 && re.runes[2] === Codepoint.CODES.get("\n") + 1 && re.runes[3] === Unicode.MAX_RUNE) return new Regexp(Regexp.Op.ANY_CHAR_NOT_NL);
        return re;
      case Regexp.Op.STAR:
      case Regexp.Op.PLUS:
      case Regexp.Op.QUEST: {
        const sub = Simplify2.simplify(re.subs[0]);
        return Simplify2.simplify1(re.op, re.flags, sub, re);
      }
      case Regexp.Op.REPEAT: {
        if (re.min === 0 && re.max === 0) return new Regexp(Regexp.Op.EMPTY_MATCH);
        const sub = Simplify2.simplify(re.subs[0]);
        if (re.max === -1) {
          if (re.min === 0) return Simplify2.simplify1(Regexp.Op.STAR, re.flags, sub, null);
          if (re.min === 1) return Simplify2.simplify1(Regexp.Op.PLUS, re.flags, sub, null);
          const nre = new Regexp(Regexp.Op.CONCAT);
          const subs = [];
          for (let i = 0; i < re.min - 1; i++) subs.push(sub);
          subs.push(Simplify2.simplify1(Regexp.Op.PLUS, re.flags, sub, null));
          nre.subs = subs.slice(0);
          return Simplify2.simplify(nre);
        }
        if (re.min === 1 && re.max === 1) return sub;
        let prefixSubs = null;
        if (re.min > 0) {
          prefixSubs = [];
          for (let i = 0; i < re.min; i++) prefixSubs.push(sub);
        }
        if (re.max > re.min) {
          let suffix = Simplify2.simplify1(Regexp.Op.QUEST, re.flags, sub, null);
          for (let i = re.min + 1; i < re.max; i++) {
            const nre2 = new Regexp(Regexp.Op.CONCAT);
            nre2.subs = [sub, suffix];
            suffix = Simplify2.simplify1(Regexp.Op.QUEST, re.flags, nre2, null);
          }
          if (prefixSubs === null) return suffix;
          prefixSubs.push(suffix);
        }
        if (prefixSubs !== null) {
          const prefix = new Regexp(Regexp.Op.CONCAT);
          prefix.subs = prefixSubs.slice(0);
          return Simplify2.simplify(prefix);
        }
        return new Regexp(Regexp.Op.NO_MATCH);
      }
    }
    return re;
  }
  static simplify1(op, flags, sub, re) {
    if (sub.op === Regexp.Op.EMPTY_MATCH) return sub;
    if (sub.op === Regexp.Op.NO_MATCH) {
      if (op === Regexp.Op.PLUS) return sub;
      return new Regexp(Regexp.Op.EMPTY_MATCH);
    }
    if (op === sub.op && (flags & RE2Flags.NON_GREEDY) === (sub.flags & RE2Flags.NON_GREEDY)) return sub;
    if (re !== null && re.op === op && (re.flags & RE2Flags.NON_GREEDY) === (flags & RE2Flags.NON_GREEDY) && sub === re.subs[0]) return re;
    const nre = new Regexp(op);
    nre.flags = flags;
    nre.subs = [sub];
    return nre;
  }
};
var CharGroup = class {
  constructor(sign, cls) {
    this.sign = sign;
    this.cls = cls;
  }
};
var code1 = [48, 57];
var code2 = [
  9,
  10,
  12,
  13,
  32,
  32
];
var code3 = [
  48,
  57,
  65,
  90,
  95,
  95,
  97,
  122
];
var PERL_GROUPS = /* @__PURE__ */ new Map([
  ["\\d", new CharGroup(1, code1)],
  ["\\D", new CharGroup(-1, code1)],
  ["\\s", new CharGroup(1, code2)],
  ["\\S", new CharGroup(-1, code2)],
  ["\\w", new CharGroup(1, code3)],
  ["\\W", new CharGroup(-1, code3)]
]);
var code4 = [
  48,
  57,
  65,
  90,
  97,
  122
];
var code5 = [
  65,
  90,
  97,
  122
];
var code6 = [0, 127];
var code7 = [
  9,
  9,
  32,
  32
];
var code8 = [
  0,
  31,
  127,
  127
];
var code9 = [48, 57];
var code10 = [33, 126];
var code11 = [97, 122];
var code12 = [32, 126];
var code13 = [
  33,
  47,
  58,
  64,
  91,
  96,
  123,
  126
];
var code14 = [
  9,
  13,
  32,
  32
];
var code15 = [65, 90];
var code16 = [
  48,
  57,
  65,
  90,
  95,
  95,
  97,
  122
];
var code17 = [
  48,
  57,
  65,
  70,
  97,
  102
];
var POSIX_GROUPS = /* @__PURE__ */ new Map([
  ["[:alnum:]", new CharGroup(1, code4)],
  ["[:^alnum:]", new CharGroup(-1, code4)],
  ["[:alpha:]", new CharGroup(1, code5)],
  ["[:^alpha:]", new CharGroup(-1, code5)],
  ["[:ascii:]", new CharGroup(1, code6)],
  ["[:^ascii:]", new CharGroup(-1, code6)],
  ["[:blank:]", new CharGroup(1, code7)],
  ["[:^blank:]", new CharGroup(-1, code7)],
  ["[:cntrl:]", new CharGroup(1, code8)],
  ["[:^cntrl:]", new CharGroup(-1, code8)],
  ["[:digit:]", new CharGroup(1, code9)],
  ["[:^digit:]", new CharGroup(-1, code9)],
  ["[:graph:]", new CharGroup(1, code10)],
  ["[:^graph:]", new CharGroup(-1, code10)],
  ["[:lower:]", new CharGroup(1, code11)],
  ["[:^lower:]", new CharGroup(-1, code11)],
  ["[:print:]", new CharGroup(1, code12)],
  ["[:^print:]", new CharGroup(-1, code12)],
  ["[:punct:]", new CharGroup(1, code13)],
  ["[:^punct:]", new CharGroup(-1, code13)],
  ["[:space:]", new CharGroup(1, code14)],
  ["[:^space:]", new CharGroup(-1, code14)],
  ["[:upper:]", new CharGroup(1, code15)],
  ["[:^upper:]", new CharGroup(-1, code15)],
  ["[:word:]", new CharGroup(1, code16)],
  ["[:^word:]", new CharGroup(-1, code16)],
  ["[:xdigit:]", new CharGroup(1, code17)],
  ["[:^xdigit:]", new CharGroup(-1, code17)]
]);
var CharClass = class CharClass2 {
  static charClassToString(r, len) {
    let result = "[";
    for (let i = 0; i < len; i += 2) {
      if (i > 0) result += " ";
      const lo = r[i];
      const hi = r[i + 1];
      if (lo === hi) result += `0x${lo.toString(16)}`;
      else result += `0x${lo.toString(16)}-0x${hi.toString(16)}`;
    }
    result += "]";
    return result;
  }
  static cmp(array, i, pivotFrom, pivotTo) {
    const cmp = array[i] - pivotFrom;
    return cmp !== 0 ? cmp : pivotTo - array[i + 1];
  }
  static qsortIntPair(array, left, right) {
    const pivotIndex = ((left + right) / 2 | 0) & -2;
    const pivotFrom = array[pivotIndex];
    const pivotTo = array[pivotIndex + 1];
    let i = left;
    let j = right;
    while (i <= j) {
      while (i < right && CharClass2.cmp(array, i, pivotFrom, pivotTo) < 0) i += 2;
      while (j > left && CharClass2.cmp(array, j, pivotFrom, pivotTo) > 0) j -= 2;
      if (i <= j) {
        if (i !== j) {
          let temp = array[i];
          array[i] = array[j];
          array[j] = temp;
          temp = array[i + 1];
          array[i + 1] = array[j + 1];
          array[j + 1] = temp;
        }
        i += 2;
        j -= 2;
      }
    }
    if (left < j) CharClass2.qsortIntPair(array, left, j);
    if (i < right) CharClass2.qsortIntPair(array, i, right);
  }
  constructor(r = Utils.emptyInts()) {
    this.r = r;
    this.len = r.length;
  }
  toArray() {
    if (this.len === this.r.length) return this.r;
    else return this.r.slice(0, this.len);
  }
  cleanClass() {
    if (this.len < 4) return this;
    CharClass2.qsortIntPair(this.r, 0, this.len - 2);
    let w = 2;
    for (let i = 2; i < this.len; i += 2) {
      const lo = this.r[i];
      const hi = this.r[i + 1];
      if (lo <= this.r[w - 1] + 1) {
        if (hi > this.r[w - 1]) this.r[w - 1] = hi;
        continue;
      }
      this.r[w] = lo;
      this.r[w + 1] = hi;
      w += 2;
    }
    this.len = w;
    return this;
  }
  appendLiteral(x, flags) {
    return (flags & RE2Flags.FOLD_CASE) !== 0 ? this.appendFoldedRange(x, x) : this.appendRange(x, x);
  }
  appendRange(lo, hi) {
    if (this.len > 0) {
      for (let i = 2; i <= 4; i += 2) if (this.len >= i) {
        const rlo = this.r[this.len - i];
        const rhi = this.r[this.len - i + 1];
        if (lo <= rhi + 1 && rlo <= hi + 1) {
          if (lo < rlo) this.r[this.len - i] = lo;
          if (hi > rhi) this.r[this.len - i + 1] = hi;
          return this;
        }
      }
    }
    this.r[this.len++] = lo;
    this.r[this.len++] = hi;
    return this;
  }
  appendFoldedRange(lo, hi) {
    if (lo <= Unicode.MIN_FOLD && hi >= Unicode.MAX_FOLD) return this.appendRange(lo, hi);
    if (hi < Unicode.MIN_FOLD || lo > Unicode.MAX_FOLD) return this.appendRange(lo, hi);
    if (lo < Unicode.MIN_FOLD) {
      this.appendRange(lo, Unicode.MIN_FOLD - 1);
      lo = Unicode.MIN_FOLD;
    }
    if (hi > Unicode.MAX_FOLD) {
      this.appendRange(Unicode.MAX_FOLD + 1, hi);
      hi = Unicode.MAX_FOLD;
    }
    for (let c = lo; c <= hi; c++) {
      this.appendRange(c, c);
      for (let f2 = Unicode.simpleFold(c); f2 !== c; f2 = Unicode.simpleFold(f2)) this.appendRange(f2, f2);
    }
    return this;
  }
  appendClass(x) {
    for (let i = 0; i < x.length; i += 2) this.appendRange(x[i], x[i + 1]);
    return this;
  }
  appendFoldedClass(x) {
    for (let i = 0; i < x.length; i += 2) this.appendFoldedRange(x[i], x[i + 1]);
    return this;
  }
  appendNegatedClass(x) {
    let nextLo = 0;
    for (let i = 0; i < x.length; i += 2) {
      const lo = x[i];
      const hi = x[i + 1];
      if (nextLo <= lo - 1) this.appendRange(nextLo, lo - 1);
      nextLo = hi + 1;
    }
    if (nextLo <= Unicode.MAX_RUNE) this.appendRange(nextLo, Unicode.MAX_RUNE);
    return this;
  }
  appendTable(table) {
    for (let i = 0; i < table.length; ++i) {
      const lo = table.getLo(i);
      const hi = table.getHi(i);
      const stride = table.getStride(i);
      if (stride === 1) {
        this.appendRange(lo, hi);
        continue;
      }
      for (let c = lo; c <= hi; c += stride) this.appendRange(c, c);
    }
    return this;
  }
  appendNegatedTable(table) {
    let nextLo = 0;
    for (let i = 0; i < table.length; ++i) {
      const lo = table.getLo(i);
      const hi = table.getHi(i);
      const stride = table.getStride(i);
      if (stride === 1) {
        if (nextLo <= lo - 1) this.appendRange(nextLo, lo - 1);
        nextLo = hi + 1;
        continue;
      }
      for (let c = lo; c <= hi; c += stride) {
        if (nextLo <= c - 1) this.appendRange(nextLo, c - 1);
        nextLo = c + 1;
      }
    }
    if (nextLo <= Unicode.MAX_RUNE) this.appendRange(nextLo, Unicode.MAX_RUNE);
    return this;
  }
  appendTableWithSign(table, sign) {
    return sign < 0 ? this.appendNegatedTable(table) : this.appendTable(table);
  }
  negateClass() {
    let nextLo = 0;
    let w = 0;
    for (let i = 0; i < this.len; i += 2) {
      const lo = this.r[i];
      const hi = this.r[i + 1];
      if (nextLo <= lo - 1) {
        this.r[w] = nextLo;
        this.r[w + 1] = lo - 1;
        w += 2;
      }
      nextLo = hi + 1;
    }
    this.len = w;
    if (nextLo <= Unicode.MAX_RUNE) {
      this.r[this.len++] = nextLo;
      this.r[this.len++] = Unicode.MAX_RUNE;
    }
    return this;
  }
  appendClassWithSign(x, sign) {
    return sign < 0 ? this.appendNegatedClass(x) : this.appendClass(x);
  }
  appendGroup(g2, foldCase) {
    let cls = g2.cls;
    if (foldCase) cls = new CharClass2().appendFoldedClass(cls).cleanClass().toArray();
    return this.appendClassWithSign(cls, g2.sign);
  }
  toString() {
    return CharClass2.charClassToString(this.r, this.len);
  }
};
var StringIterator = class {
  constructor(str) {
    this.str = str;
    this.position = 0;
  }
  pos() {
    return this.position;
  }
  rewindTo(pos) {
    this.position = pos;
  }
  more() {
    return this.position < this.str.length;
  }
  peek() {
    return this.str.codePointAt(this.position);
  }
  skip(n2) {
    this.position += n2;
  }
  skipString(s) {
    this.position += s.length;
  }
  pop() {
    const r = this.str.codePointAt(this.position);
    this.position += Utils.charCount(r);
    return r;
  }
  lookingAt(s) {
    return this.str.startsWith(s, this.position);
  }
  rest() {
    return this.str.substring(this.position);
  }
  from(beforePos) {
    return this.str.substring(beforePos, this.position);
  }
  toString() {
    return this.rest();
  }
};
var Parser = class Parser2 {
  static ERR_INTERNAL_ERROR = "regexp/syntax: internal error";
  static ERR_INVALID_CHAR_RANGE = "invalid character class range";
  static ERR_INVALID_ESCAPE = "invalid escape sequence";
  static ERR_INVALID_NAMED_CAPTURE = "invalid named capture";
  static ERR_INVALID_PERL_OP = "invalid or unsupported Perl syntax";
  static ERR_INVALID_REPEAT_OP = "invalid nested repetition operator";
  static ERR_INVALID_REPEAT_SIZE = "invalid repeat count";
  static ERR_MISSING_BRACKET = "missing closing ]";
  static ERR_MISSING_PAREN = "missing closing )";
  static ERR_MISSING_REPEAT_ARGUMENT = "missing argument to repetition operator";
  static ERR_TRAILING_BACKSLASH = "trailing backslash at end of expression";
  static ERR_DUPLICATE_NAMED_CAPTURE = "duplicate capture group name";
  static ERR_UNEXPECTED_PAREN = "unexpected )";
  static ERR_NESTING_DEPTH = "expression nests too deeply";
  static ERR_LARGE = "expression too large";
  static ERR_INVALID_CAPTURE_IN_LOOKBEHIND = "invalid capture in lookbehind";
  static MAX_HEIGHT = 1e3;
  static MAX_SIZE = 3355443;
  static MAX_RUNES = 33554432;
  static ANY_TABLE = new UnicodeRangeTable(new Uint32Array([
    0,
    Unicode.MAX_RUNE,
    1
  ]));
  static ASCII_TABLE = new UnicodeRangeTable(new Uint32Array([
    0,
    127,
    1
  ]));
  static ASCII_FOLD_TABLE = new UnicodeRangeTable(new Uint32Array([
    0,
    127,
    1,
    383,
    383,
    1,
    8490,
    8490,
    1
  ]));
  static unicodeTable(name) {
    if (name === "Any") return {
      tab: Parser2.ANY_TABLE,
      fold: Parser2.ANY_TABLE,
      sign: 1
    };
    if (name === "Ascii") return {
      tab: Parser2.ASCII_TABLE,
      fold: Parser2.ASCII_FOLD_TABLE,
      sign: 1
    };
    if (name === "Assigned") return {
      tab: UnicodeTables.CATEGORIES.get("Cn"),
      fold: UnicodeTables.CATEGORIES.get("Cn"),
      sign: -1
    };
    if (name === "Lc") return {
      tab: UnicodeTables.CATEGORIES.get("LC"),
      fold: UnicodeTables.FOLD_CATEGORIES.get("LC"),
      sign: 1
    };
    if (UnicodeTables.CATEGORIES.has(name)) return {
      tab: UnicodeTables.CATEGORIES.get(name),
      fold: UnicodeTables.FOLD_CATEGORIES.get(name),
      sign: 1
    };
    if (UnicodeTables.SCRIPTS.has(name)) return {
      tab: UnicodeTables.SCRIPTS.get(name),
      fold: UnicodeTables.FOLD_SCRIPT.get(name),
      sign: 1
    };
    return null;
  }
  static minFoldRune(r) {
    if (r < Unicode.MIN_FOLD || r > Unicode.MAX_FOLD) return r;
    let min = r;
    const r0 = r;
    for (r = Unicode.simpleFold(r); r !== r0; r = Unicode.simpleFold(r)) if (min > r) min = r;
    return min;
  }
  static leadingRegexp(re) {
    if (re.op === Regexp.Op.EMPTY_MATCH) return null;
    if (re.op === Regexp.Op.CONCAT && re.subs.length > 0) {
      const sub = re.subs[0];
      if (sub.op === Regexp.Op.EMPTY_MATCH) return null;
      return sub;
    }
    return re;
  }
  static literalRegexp(s, flags) {
    const re = new Regexp(Regexp.Op.LITERAL);
    re.flags = flags;
    re.runes = Utils.stringToRunes(s);
    return re;
  }
  /**
  * Parse regular expression pattern {@code pattern} with mode flags {@code flags}.
  * @param {string} pattern
  * @param {number} flags
  */
  static parse(pattern, flags) {
    return new Parser2(pattern, flags).parseInternal();
  }
  static parseRepeat(t) {
    const start2 = t.pos();
    if (!t.more() || !t.lookingAt("{")) return -1;
    t.skip(1);
    const min = Parser2.parseInt(t);
    if (min === -1) return -1;
    if (!t.more()) return -1;
    let max;
    if (!t.lookingAt(",")) max = min;
    else {
      t.skip(1);
      if (!t.more()) return -1;
      if (t.lookingAt("}")) max = -1;
      else if ((max = Parser2.parseInt(t)) === -1) return -1;
    }
    if (!t.more() || !t.lookingAt("}")) return -1;
    t.skip(1);
    if (min < 0 || min > 1e3 || max === -2 || max > 1e3 || max >= 0 && min > max) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_REPEAT_SIZE, t.from(start2));
    return min << 16 | max & Unicode.MAX_BMP;
  }
  static isValidCaptureName(name) {
    if (name.length === 0) return false;
    for (let i = 0; i < name.length; i++) {
      const c = name.codePointAt(i);
      if (c !== Codepoint.CODES.get("_") && !Utils.isalnum(c)) return false;
    }
    return true;
  }
  static parseInt(t) {
    const start2 = t.pos();
    while (t.more() && t.peek() >= Codepoint.CODES.get("0") && t.peek() <= Codepoint.CODES.get("9")) t.skip(1);
    const n2 = t.from(start2);
    if (n2.length === 0 || n2.length > 1 && n2.codePointAt(0) === Codepoint.CODES.get("0")) return -1;
    if (n2.length > 8) return -2;
    return parseInt(n2, 10);
  }
  static isCharClass(re) {
    return re.op === Regexp.Op.LITERAL && re.runes.length === 1 || re.op === Regexp.Op.CHAR_CLASS || re.op === Regexp.Op.ANY_CHAR_NOT_NL || re.op === Regexp.Op.ANY_CHAR;
  }
  static matchRune(re, r) {
    switch (re.op) {
      case Regexp.Op.LITERAL:
        return re.runes.length === 1 && re.runes[0] === r;
      case Regexp.Op.CHAR_CLASS:
        for (let i = 0; i < re.runes.length; i += 2) if (re.runes[i] <= r && r <= re.runes[i + 1]) return true;
        return false;
      case Regexp.Op.ANY_CHAR_NOT_NL:
        return r !== Codepoint.CODES.get("\n");
      case Regexp.Op.ANY_CHAR:
        return true;
    }
    return false;
  }
  static mergeCharClass(dst, src) {
    switch (dst.op) {
      case Regexp.Op.ANY_CHAR:
        break;
      case Regexp.Op.ANY_CHAR_NOT_NL:
        if (Parser2.matchRune(src, Codepoint.CODES.get("\n"))) dst.op = Regexp.Op.ANY_CHAR;
        break;
      case Regexp.Op.CHAR_CLASS:
        if (src.op === Regexp.Op.LITERAL) dst.runes = new CharClass(dst.runes).appendLiteral(src.runes[0], src.flags).toArray();
        else dst.runes = new CharClass(dst.runes).appendClass(src.runes).toArray();
        break;
      case Regexp.Op.LITERAL:
        if (src.runes[0] === dst.runes[0] && src.flags === dst.flags) break;
        dst.op = Regexp.Op.CHAR_CLASS;
        dst.runes = new CharClass().appendLiteral(dst.runes[0], dst.flags).appendLiteral(src.runes[0], src.flags).toArray();
        break;
    }
  }
  static parseEscape(t) {
    const startPos = t.pos();
    t.skip(1);
    if (!t.more()) throw new RE2JSSyntaxException(Parser2.ERR_TRAILING_BACKSLASH);
    let c = t.pop();
    bigswitch: switch (c) {
      case Codepoint.CODES.get("1"):
      case Codepoint.CODES.get("2"):
      case Codepoint.CODES.get("3"):
      case Codepoint.CODES.get("4"):
      case Codepoint.CODES.get("5"):
      case Codepoint.CODES.get("6"):
      case Codepoint.CODES.get("7"):
        if (!t.more() || t.peek() < Codepoint.CODES.get("0") || t.peek() > Codepoint.CODES.get("7")) break;
      case Codepoint.CODES.get("0"): {
        let r = c - Codepoint.CODES.get("0");
        for (let i = 1; i < 3; i++) {
          if (!t.more() || t.peek() < Codepoint.CODES.get("0") || t.peek() > Codepoint.CODES.get("7")) break;
          r = r * 8 + t.peek() - Codepoint.CODES.get("0");
          t.skip(1);
        }
        return r;
      }
      case Codepoint.CODES.get("x"): {
        if (!t.more()) break;
        c = t.pop();
        if (c === Codepoint.CODES.get("{")) {
          let nhex = 0;
          let r = 0;
          while (true) {
            if (!t.more()) break bigswitch;
            c = t.pop();
            if (c === Codepoint.CODES.get("}")) break;
            const v2 = Utils.unhex(c);
            if (v2 < 0) break bigswitch;
            r = r * 16 + v2;
            if (r > Unicode.MAX_RUNE) break bigswitch;
            nhex++;
          }
          if (nhex === 0) break bigswitch;
          return r;
        }
        const x = Utils.unhex(c);
        if (!t.more()) break;
        c = t.pop();
        const y2 = Utils.unhex(c);
        if (x < 0 || y2 < 0) break;
        return x * 16 + y2;
      }
      case Codepoint.CODES.get("a"):
        return Codepoint.CODES.get("\x07");
      case Codepoint.CODES.get("f"):
        return Codepoint.CODES.get("\f");
      case Codepoint.CODES.get("n"):
        return Codepoint.CODES.get("\n");
      case Codepoint.CODES.get("r"):
        return Codepoint.CODES.get("\r");
      case Codepoint.CODES.get("t"):
        return Codepoint.CODES.get("	");
      case Codepoint.CODES.get("v"):
        return Codepoint.CODES.get("\v");
      default:
        if (c <= Unicode.MAX_ASCII && !Utils.isalnum(c)) return c;
        break;
    }
    throw new RE2JSSyntaxException(Parser2.ERR_INVALID_ESCAPE, t.from(startPos));
  }
  static parseClassChar(t, wholeClassPos) {
    if (!t.more()) throw new RE2JSSyntaxException(Parser2.ERR_MISSING_BRACKET, t.from(wholeClassPos));
    if (t.lookingAt("\\")) return Parser2.parseEscape(t);
    return t.pop();
  }
  static concatRunes(x, y2) {
    for (let i = 0; i < y2.length; i++) x.push(y2[i]);
    return x;
  }
  static hasCapture(re) {
    if (re === null) return false;
    if (re.op === Regexp.Op.CAPTURE) return true;
    if (re.subs) {
      for (let sub of re.subs) if (Parser2.hasCapture(sub)) return true;
    }
    return false;
  }
  constructor(wholeRegexp, flags = 0) {
    this.wholeRegexp = wholeRegexp;
    this.flags = flags;
    this.numCap = 0;
    this.namedGroups = /* @__PURE__ */ Object.create(null);
    this.stack = [];
    this.free = null;
    this.numRegexp = 0;
    this.numRunes = 0;
    this.repeats = 0;
    this.height = null;
    this.size = null;
    this.nlb = 0;
  }
  newRegexp(op) {
    let re = this.free;
    if (re !== null && re.subs !== null && re.subs.length > 0) {
      this.free = re.subs[0];
      re.reinit();
      re.op = op;
    } else {
      re = new Regexp(op);
      this.numRegexp += 1;
    }
    return re;
  }
  reuse(re) {
    if (this.height !== null && this.height.has(re)) this.height.delete(re);
    if (re.subs !== null && re.subs.length > 0) re.subs[0] = this.free;
    this.free = re;
  }
  checkLimits(re) {
    if (this.numRunes > Parser2.MAX_RUNES) throw new RE2JSSyntaxException(Parser2.ERR_LARGE);
    this.checkSize(re);
    this.checkHeight(re);
  }
  checkSize(re) {
    if (this.size === null) {
      if (this.repeats === 0) this.repeats = 1;
      if (re.op === Regexp.Op.REPEAT) {
        let n2 = re.max;
        if (n2 === -1) n2 = re.min;
        if (n2 <= 0) n2 = 1;
        if (n2 > Math.floor(Parser2.MAX_SIZE / this.repeats)) this.repeats = Parser2.MAX_SIZE;
        else this.repeats *= n2;
      }
      if (this.numRegexp < Math.floor(Parser2.MAX_SIZE / this.repeats)) return;
      this.size = /* @__PURE__ */ new Map();
      for (let reEx of this.stack) this.checkSize(reEx);
    }
    if (this.calcSize(re, true) > Parser2.MAX_SIZE) throw new RE2JSSyntaxException(Parser2.ERR_LARGE);
  }
  calcSize(re, force = false) {
    if (!force && this.size !== null) {
      if (this.size.has(re)) return this.size.get(re);
    }
    let size = 0;
    switch (re.op) {
      case Regexp.Op.LITERAL:
        size = re.runes.length;
        break;
      case Regexp.Op.PLB:
      case Regexp.Op.NLB:
      case Regexp.Op.CAPTURE:
      case Regexp.Op.STAR:
        size = 2 + this.calcSize(re.subs[0]);
        break;
      case Regexp.Op.PLUS:
      case Regexp.Op.QUEST:
        size = 1 + this.calcSize(re.subs[0]);
        break;
      case Regexp.Op.CONCAT:
        for (let sub of re.subs) size = size + this.calcSize(sub);
        break;
      case Regexp.Op.ALTERNATE:
        for (let sub of re.subs) size = size + this.calcSize(sub);
        if (re.subs.length > 1) size = size + re.subs.length - 1;
        break;
      case Regexp.Op.REPEAT: {
        let sub = this.calcSize(re.subs[0]);
        if (re.max === -1) {
          if (re.min === 0) size = 2 + sub;
          else size = 1 + re.min * sub;
          break;
        }
        size = re.max * sub + (re.max - re.min);
        break;
      }
    }
    size = Math.max(1, size);
    if (this.size === null) this.size = /* @__PURE__ */ new Map();
    this.size.set(re, size);
    return size;
  }
  checkHeight(re) {
    if (this.numRegexp < Parser2.MAX_HEIGHT) return;
    if (this.height === null) {
      this.height = /* @__PURE__ */ new Map();
      for (let reEx of this.stack) this.checkHeight(reEx);
    }
    if (this.calcHeight(re, true) > Parser2.MAX_HEIGHT) throw new RE2JSSyntaxException(Parser2.ERR_NESTING_DEPTH);
  }
  calcHeight(re, force = false) {
    if (!force && this.height !== null) {
      if (this.height.has(re)) return this.height.get(re);
    }
    let h2 = 1;
    for (let sub of re.subs) {
      const hsub = this.calcHeight(sub);
      if (h2 < 1 + hsub) h2 = 1 + hsub;
    }
    if (this.height === null) this.height = /* @__PURE__ */ new Map();
    this.height.set(re, h2);
    return h2;
  }
  pop() {
    return this.stack.pop();
  }
  popToPseudo() {
    const n2 = this.stack.length;
    let i = n2;
    while (i > 0 && !Regexp.isPseudoOp(this.stack[i - 1].op)) i--;
    const r = this.stack.slice(i, n2);
    this.stack = this.stack.slice(0, i);
    return r;
  }
  push(re) {
    this.numRunes += re.runes.length;
    if (re.op === Regexp.Op.CHAR_CLASS && re.runes.length === 2 && re.runes[0] === re.runes[1]) {
      if (this.maybeConcat(re.runes[0], this.flags & ~RE2Flags.FOLD_CASE)) return null;
      re.op = Regexp.Op.LITERAL;
      re.runes = [re.runes[0]];
      re.flags = this.flags & ~RE2Flags.FOLD_CASE;
    } else if (re.op === Regexp.Op.CHAR_CLASS && re.runes.length === 4 && re.runes[0] === re.runes[1] && re.runes[2] === re.runes[3] && Unicode.simpleFold(re.runes[0]) === re.runes[2] && Unicode.simpleFold(re.runes[2]) === re.runes[0] || re.op === Regexp.Op.CHAR_CLASS && re.runes.length === 2 && re.runes[0] + 1 === re.runes[1] && Unicode.simpleFold(re.runes[0]) === re.runes[1] && Unicode.simpleFold(re.runes[1]) === re.runes[0]) {
      if (this.maybeConcat(re.runes[0], this.flags | RE2Flags.FOLD_CASE)) return null;
      re.op = Regexp.Op.LITERAL;
      re.runes = [re.runes[0]];
      re.flags = this.flags | RE2Flags.FOLD_CASE;
    } else this.maybeConcat(-1, 0);
    this.stack.push(re);
    this.checkLimits(re);
    return re;
  }
  maybeConcat(r, flags) {
    const n2 = this.stack.length;
    if (n2 < 2) return false;
    const re1 = this.stack[n2 - 1];
    const re2 = this.stack[n2 - 2];
    if (re1.op !== Regexp.Op.LITERAL || re2.op !== Regexp.Op.LITERAL || (re1.flags & RE2Flags.FOLD_CASE) !== (re2.flags & RE2Flags.FOLD_CASE)) return false;
    re2.runes = Parser2.concatRunes(re2.runes, re1.runes);
    if (r >= 0) {
      re1.runes = [r];
      re1.flags = flags;
      return true;
    }
    this.pop();
    this.reuse(re1);
    return false;
  }
  newLiteral(r, flags) {
    const re = this.newRegexp(Regexp.Op.LITERAL);
    re.flags = flags;
    if ((flags & RE2Flags.FOLD_CASE) !== 0) r = Parser2.minFoldRune(r);
    re.runes = [r];
    return re;
  }
  literal(r) {
    this.push(this.newLiteral(r, this.flags));
  }
  op(op) {
    const re = this.newRegexp(op);
    re.flags = this.flags;
    return this.push(re);
  }
  repeat(op, min, max, beforePos, t, lastRepeatPos) {
    let flags = this.flags;
    if ((flags & RE2Flags.PERL_X) !== 0) {
      if (t.more() && t.lookingAt("?")) {
        t.skip(1);
        flags ^= RE2Flags.NON_GREEDY;
      }
      if (lastRepeatPos !== -1) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_REPEAT_OP, t.from(lastRepeatPos));
    }
    const n2 = this.stack.length;
    if (n2 === 0) throw new RE2JSSyntaxException(Parser2.ERR_MISSING_REPEAT_ARGUMENT, t.from(beforePos));
    const sub = this.stack[n2 - 1];
    if (Regexp.isPseudoOp(sub.op)) throw new RE2JSSyntaxException(Parser2.ERR_MISSING_REPEAT_ARGUMENT, t.from(beforePos));
    const re = this.newRegexp(op);
    re.min = min;
    re.max = max;
    re.flags = flags;
    re.subs = [sub];
    this.stack[n2 - 1] = re;
    this.checkLimits(re);
    if (op === Regexp.Op.REPEAT && (min >= 2 || max >= 2) && !this.repeatIsValid(re, 1e3)) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_REPEAT_SIZE, t.from(beforePos));
  }
  repeatIsValid(re, n2) {
    if (re.op === Regexp.Op.REPEAT) {
      let m2 = re.max;
      if (m2 === 0) return true;
      if (m2 < 0) m2 = re.min;
      if (m2 > n2) return false;
      if (m2 > 0) n2 = Math.trunc(n2 / m2);
    }
    for (let sub of re.subs) if (!this.repeatIsValid(sub, n2)) return false;
    return true;
  }
  concat() {
    this.maybeConcat(-1, 0);
    const subs = this.popToPseudo();
    if (subs.length === 0) return this.push(this.newRegexp(Regexp.Op.EMPTY_MATCH));
    return this.push(this.collapse(subs, Regexp.Op.CONCAT));
  }
  alternate() {
    const subs = this.popToPseudo();
    if (subs.length > 0) this.cleanAlt(subs[subs.length - 1]);
    if (subs.length === 0) return this.push(this.newRegexp(Regexp.Op.NO_MATCH));
    return this.push(this.collapse(subs, Regexp.Op.ALTERNATE));
  }
  cleanAlt(re) {
    if (re.op === Regexp.Op.CHAR_CLASS) {
      re.runes = new CharClass(re.runes).cleanClass().toArray();
      if (re.runes.length === 2 && re.runes[0] === 0 && re.runes[1] === Unicode.MAX_RUNE) {
        re.runes = [];
        re.op = Regexp.Op.ANY_CHAR;
      } else if (re.runes.length === 4 && re.runes[0] === 0 && re.runes[1] === Codepoint.CODES.get("\n") - 1 && re.runes[2] === Codepoint.CODES.get("\n") + 1 && re.runes[3] === Unicode.MAX_RUNE) {
        re.runes = [];
        re.op = Regexp.Op.ANY_CHAR_NOT_NL;
      }
    }
  }
  collapse(subs, op) {
    if (subs.length === 1) return subs[0];
    let len = 0;
    for (let sub of subs) len += sub.op === op ? sub.subs.length : 1;
    let newsubs = new Array(len).fill(null);
    let i = 0;
    for (let sub of subs) if (sub.op === op) {
      for (let j = 0; j < sub.subs.length; j++) newsubs[i++] = sub.subs[j];
      this.reuse(sub);
    } else newsubs[i++] = sub;
    let re = this.newRegexp(op);
    re.subs = newsubs;
    if (op === Regexp.Op.ALTERNATE) {
      re.subs = this.factor(re.subs);
      if (re.subs.length === 1) {
        const old = re;
        re = re.subs[0];
        this.reuse(old);
      }
    }
    return re;
  }
  factor(array) {
    if (array.length < 2) return array;
    let s = 0;
    let lensub = array.length;
    let lenout = 0;
    let str = null;
    let strlen = 0;
    let strflags = 0;
    let start2 = 0;
    for (let i = 0; i <= lensub; i++) {
      let istr = null;
      let istrlen = 0;
      let iflags = 0;
      if (i < lensub) {
        let re = array[s + i];
        if (re.op === Regexp.Op.CONCAT && re.subs.length > 0) re = re.subs[0];
        if (re.op === Regexp.Op.LITERAL) {
          istr = re.runes;
          istrlen = re.runes.length;
          iflags = re.flags & RE2Flags.FOLD_CASE;
        }
        if (iflags === strflags) {
          let same = 0;
          while (same < strlen && same < istrlen && str[same] === istr[same]) same++;
          if (same > 0) {
            strlen = same;
            continue;
          }
        }
      }
      if (i === start2) {
      } else if (i === start2 + 1) array[lenout++] = array[s + start2];
      else {
        const prefix = this.newRegexp(Regexp.Op.LITERAL);
        prefix.flags = strflags;
        prefix.runes = str.slice(0, strlen);
        for (let j = start2; j < i; j++) {
          array[s + j] = this.removeLeadingString(array[s + j], strlen);
          this.checkLimits(array[s + j]);
        }
        const suffix = this.collapse(array.slice(s + start2, s + i), Regexp.Op.ALTERNATE);
        const re = this.newRegexp(Regexp.Op.CONCAT);
        re.subs = [prefix, suffix];
        array[lenout++] = re;
      }
      start2 = i;
      str = istr;
      strlen = istrlen;
      strflags = iflags;
    }
    lensub = lenout;
    s = 0;
    start2 = 0;
    lenout = 0;
    let first = null;
    for (let i = 0; i <= lensub; i++) {
      let ifirst = null;
      if (i < lensub) {
        ifirst = Parser2.leadingRegexp(array[s + i]);
        if (first !== null && first.equals(ifirst) && (Parser2.isCharClass(first) || first.op === Regexp.Op.REPEAT && first.min === first.max && Parser2.isCharClass(first.subs[0]))) continue;
      }
      if (i === start2) {
      } else if (i === start2 + 1) array[lenout++] = array[s + start2];
      else {
        const prefix = first;
        for (let j = start2; j < i; j++) {
          const reuse = j !== start2;
          array[s + j] = this.removeLeadingRegexp(array[s + j], reuse);
          this.checkLimits(array[s + j]);
        }
        const suffix = this.collapse(array.slice(s + start2, s + i), Regexp.Op.ALTERNATE);
        const re = this.newRegexp(Regexp.Op.CONCAT);
        re.subs = [prefix, suffix];
        array[lenout++] = re;
      }
      start2 = i;
      first = ifirst;
    }
    lensub = lenout;
    s = 0;
    start2 = 0;
    lenout = 0;
    for (let i = 0; i <= lensub; i++) {
      if (i < lensub && Parser2.isCharClass(array[s + i])) continue;
      if (i === start2) {
      } else if (i === start2 + 1) array[lenout++] = array[s + start2];
      else {
        let max = start2;
        for (let j = start2 + 1; j < i; j++) {
          const subMax = array[s + max];
          const subJ = array[s + j];
          if (subMax.op < subJ.op || subMax.op === subJ.op && (subMax.runes !== null ? subMax.runes.length : 0) < (subJ.runes !== null ? subJ.runes.length : 0)) max = j;
        }
        const tmp = array[s + start2];
        array[s + start2] = array[s + max];
        array[s + max] = tmp;
        for (let j = start2 + 1; j < i; j++) {
          Parser2.mergeCharClass(array[s + start2], array[s + j]);
          this.reuse(array[s + j]);
        }
        this.cleanAlt(array[s + start2]);
        array[lenout++] = array[s + start2];
      }
      if (i < lensub) array[lenout++] = array[s + i];
      start2 = i + 1;
    }
    lensub = lenout;
    s = 0;
    start2 = 0;
    lenout = 0;
    for (let i = 0; i < lensub; ++i) {
      if (i + 1 < lensub && array[s + i].op === Regexp.Op.EMPTY_MATCH && array[s + i + 1].op === Regexp.Op.EMPTY_MATCH) continue;
      array[lenout++] = array[s + i];
    }
    lensub = lenout;
    s = 0;
    return array.slice(s, lensub);
  }
  removeLeadingString(re, n2) {
    if (re.op === Regexp.Op.CONCAT && re.subs.length > 0) {
      const sub = this.removeLeadingString(re.subs[0], n2);
      re.subs[0] = sub;
      if (sub.op === Regexp.Op.EMPTY_MATCH) {
        this.reuse(sub);
        switch (re.subs.length) {
          case 0:
          case 1:
            re.op = Regexp.Op.EMPTY_MATCH;
            re.subs = Regexp.emptySubs();
            break;
          case 2: {
            const old = re;
            re = re.subs[1];
            this.reuse(old);
            break;
          }
          default:
            re.subs = re.subs.slice(1, re.subs.length);
            break;
        }
      }
      return re;
    }
    if (re.op === Regexp.Op.LITERAL) {
      re.runes = re.runes.slice(n2, re.runes.length);
      if (re.runes.length === 0) re.op = Regexp.Op.EMPTY_MATCH;
    }
    return re;
  }
  removeLeadingRegexp(re, reuse) {
    if (re.op === Regexp.Op.CONCAT && re.subs.length > 0) {
      if (reuse) this.reuse(re.subs[0]);
      re.subs = re.subs.slice(1, re.subs.length);
      switch (re.subs.length) {
        case 0:
          re.op = Regexp.Op.EMPTY_MATCH;
          re.subs = Regexp.emptySubs();
          break;
        case 1: {
          const old = re;
          re = re.subs[0];
          this.reuse(old);
          break;
        }
      }
      return re;
    }
    if (reuse) this.reuse(re);
    return this.newRegexp(Regexp.Op.EMPTY_MATCH);
  }
  parseInternal() {
    if ((this.flags & RE2Flags.LITERAL) !== 0) return Parser2.literalRegexp(this.wholeRegexp, this.flags);
    let lastRepeatPos = -1;
    let min = -1;
    let max = -1;
    const t = new StringIterator(this.wholeRegexp);
    while (t.more()) {
      let repeatPos = -1;
      bigswitch: switch (t.peek()) {
        case Codepoint.CODES.get("("):
          if ((this.flags & RE2Flags.LOOKBEHIND) !== 0) {
            if (t.lookingAt("(?<=")) {
              this.parsePosLookBehind();
              t.skip(4);
              break;
            }
            if (t.lookingAt("(?<!")) {
              this.parseNegLookBehind();
              t.skip(4);
              break;
            }
          }
          if ((this.flags & RE2Flags.PERL_X) !== 0 && t.lookingAt("(?")) {
            this.parsePerlFlags(t);
            break;
          }
          this.op(Regexp.Op.LEFT_PAREN).cap = ++this.numCap;
          t.skip(1);
          break;
        case Codepoint.CODES.get("|"):
          this.parseVerticalBar();
          t.skip(1);
          break;
        case Codepoint.CODES.get(")"):
          this.parseRightParen();
          t.skip(1);
          break;
        case Codepoint.CODES.get("^"):
          if ((this.flags & RE2Flags.ONE_LINE) !== 0) this.op(Regexp.Op.BEGIN_TEXT);
          else this.op(Regexp.Op.BEGIN_LINE);
          t.skip(1);
          break;
        case Codepoint.CODES.get("$"):
          if ((this.flags & RE2Flags.ONE_LINE) !== 0) this.op(Regexp.Op.END_TEXT).flags |= RE2Flags.WAS_DOLLAR;
          else this.op(Regexp.Op.END_LINE);
          t.skip(1);
          break;
        case Codepoint.CODES.get("."):
          if ((this.flags & RE2Flags.DOT_NL) !== 0) this.op(Regexp.Op.ANY_CHAR);
          else this.op(Regexp.Op.ANY_CHAR_NOT_NL);
          t.skip(1);
          break;
        case Codepoint.CODES.get("["):
          this.parseClass(t);
          break;
        case Codepoint.CODES.get("*"):
        case Codepoint.CODES.get("+"):
        case Codepoint.CODES.get("?"): {
          repeatPos = t.pos();
          let op = null;
          switch (t.pop()) {
            case Codepoint.CODES.get("*"):
              op = Regexp.Op.STAR;
              break;
            case Codepoint.CODES.get("+"):
              op = Regexp.Op.PLUS;
              break;
            case Codepoint.CODES.get("?"):
              op = Regexp.Op.QUEST;
              break;
          }
          this.repeat(op, min, max, repeatPos, t, lastRepeatPos);
          break;
        }
        case Codepoint.CODES.get("{"): {
          repeatPos = t.pos();
          const minMax = Parser2.parseRepeat(t);
          if (minMax < 0) {
            t.rewindTo(repeatPos);
            this.literal(t.pop());
            break;
          }
          min = minMax >> 16;
          max = (minMax & Unicode.MAX_BMP) << 16 >> 16;
          this.repeat(Regexp.Op.REPEAT, min, max, repeatPos, t, lastRepeatPos);
          break;
        }
        case Codepoint.CODES.get("\\"): {
          const savedPos = t.pos();
          t.skip(1);
          if ((this.flags & RE2Flags.PERL_X) !== 0 && t.more()) switch (t.pop()) {
            case Codepoint.CODES.get("A"):
              this.op(Regexp.Op.BEGIN_TEXT);
              break bigswitch;
            case Codepoint.CODES.get("b"):
              this.op(Regexp.Op.WORD_BOUNDARY);
              break bigswitch;
            case Codepoint.CODES.get("B"):
              this.op(Regexp.Op.NO_WORD_BOUNDARY);
              break bigswitch;
            case Codepoint.CODES.get("C"):
              throw new RE2JSSyntaxException(Parser2.ERR_INVALID_ESCAPE, "\\C");
            case Codepoint.CODES.get("Q"): {
              let lit = t.rest();
              const i = lit.indexOf("\\E");
              if (i >= 0) {
                lit = lit.substring(0, i);
                t.skipString(lit);
                t.skipString("\\E");
              } else t.skipString(lit);
              let j = 0;
              while (j < lit.length) {
                const codepoint = lit.codePointAt(j);
                this.literal(codepoint);
                j += Utils.charCount(codepoint);
              }
              break bigswitch;
            }
            case Codepoint.CODES.get("z"):
              this.op(Regexp.Op.END_TEXT);
              break bigswitch;
            default:
              t.rewindTo(savedPos);
              break;
          }
          else t.rewindTo(savedPos);
          const re = this.newRegexp(Regexp.Op.CHAR_CLASS);
          re.flags = this.flags;
          if (t.lookingAt("\\p") || t.lookingAt("\\P")) {
            const cc2 = new CharClass();
            if (this.parseUnicodeClass(t, cc2)) {
              re.runes = cc2.toArray();
              this.push(re);
              break bigswitch;
            }
          }
          const cc = new CharClass();
          if (this.parsePerlClassEscape(t, cc)) {
            re.runes = cc.toArray();
            this.push(re);
            break bigswitch;
          }
          t.rewindTo(savedPos);
          this.reuse(re);
          this.literal(Parser2.parseEscape(t));
          break;
        }
        default:
          this.literal(t.pop());
          break;
      }
      lastRepeatPos = repeatPos;
    }
    this.concat();
    if (this.swapVerticalBar()) this.pop();
    this.alternate();
    if (this.stack.length !== 1) throw new RE2JSSyntaxException(Parser2.ERR_MISSING_PAREN, this.wholeRegexp);
    this.stack[0].namedGroups = this.namedGroups;
    return this.stack[0];
  }
  parsePerlFlags(t) {
    const startPos = t.pos();
    const s = t.rest();
    if (s.startsWith("(?P<") || s.startsWith("(?<")) {
      const begin = s.charAt(2) === "P" ? 4 : 3;
      const end = s.indexOf(">");
      if (end < 0) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_NAMED_CAPTURE, s);
      const name = s.substring(begin, end);
      t.skipString(name);
      t.skip(begin + 1);
      if (!Parser2.isValidCaptureName(name)) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_NAMED_CAPTURE, s.substring(0, end + 1));
      const re = this.op(Regexp.Op.LEFT_PAREN);
      re.cap = ++this.numCap;
      if (this.namedGroups[name]) throw new RE2JSSyntaxException(Parser2.ERR_DUPLICATE_NAMED_CAPTURE, name);
      this.namedGroups[name] = this.numCap;
      re.name = name;
      return;
    }
    t.skip(2);
    let flags = this.flags;
    let sign = 1;
    let sawFlag = false;
    loop: while (t.more()) {
      const c = t.pop();
      switch (c) {
        case Codepoint.CODES.get("i"):
          flags |= RE2Flags.FOLD_CASE;
          sawFlag = true;
          break;
        case Codepoint.CODES.get("m"):
          flags &= ~RE2Flags.ONE_LINE;
          sawFlag = true;
          break;
        case Codepoint.CODES.get("s"):
          flags |= RE2Flags.DOT_NL;
          sawFlag = true;
          break;
        case Codepoint.CODES.get("U"):
          flags |= RE2Flags.NON_GREEDY;
          sawFlag = true;
          break;
        case Codepoint.CODES.get("-"):
          if (sign < 0) break loop;
          sign = -1;
          flags = ~flags;
          sawFlag = false;
          break;
        case Codepoint.CODES.get(":"):
        case Codepoint.CODES.get(")"):
          if (sign < 0) {
            if (!sawFlag) break loop;
            flags = ~flags;
          }
          if (c === Codepoint.CODES.get(":")) this.op(Regexp.Op.LEFT_PAREN);
          this.flags = flags;
          return;
        default:
          break loop;
      }
    }
    throw new RE2JSSyntaxException(Parser2.ERR_INVALID_PERL_OP, t.from(startPos));
  }
  parsePosLookBehind() {
    const re = this.newRegexp(Regexp.Op.LEFT_PAREN);
    re.flags = this.flags;
    re.lb = ++this.nlb;
    return this.push(re);
  }
  parseNegLookBehind() {
    const re = this.newRegexp(Regexp.Op.LEFT_PAREN);
    re.flags = this.flags;
    re.lb = -++this.nlb;
    return this.push(re);
  }
  parseVerticalBar() {
    this.concat();
    if (!this.swapVerticalBar()) this.op(Regexp.Op.VERTICAL_BAR);
  }
  swapVerticalBar() {
    const n2 = this.stack.length;
    if (n2 >= 3 && this.stack[n2 - 2].op === Regexp.Op.VERTICAL_BAR && Parser2.isCharClass(this.stack[n2 - 1]) && Parser2.isCharClass(this.stack[n2 - 3])) {
      let re1 = this.stack[n2 - 1];
      let re3 = this.stack[n2 - 3];
      if (re1.op > re3.op) {
        const tmp = re3;
        re3 = re1;
        re1 = tmp;
        this.stack[n2 - 3] = re3;
      }
      Parser2.mergeCharClass(re3, re1);
      this.reuse(re1);
      this.pop();
      return true;
    }
    if (n2 >= 2) {
      const re1 = this.stack[n2 - 1];
      const re2 = this.stack[n2 - 2];
      if (re2.op === Regexp.Op.VERTICAL_BAR) {
        if (n2 >= 3) this.cleanAlt(this.stack[n2 - 3]);
        this.stack[n2 - 2] = re1;
        this.stack[n2 - 1] = re2;
        return true;
      }
    }
    return false;
  }
  parseRightParen() {
    this.concat();
    if (this.swapVerticalBar()) this.pop();
    this.alternate();
    if (this.stack.length < 2) throw new RE2JSSyntaxException(Parser2.ERR_UNEXPECTED_PAREN, this.wholeRegexp);
    const re1 = this.pop();
    const re2 = this.pop();
    if (re2.op !== Regexp.Op.LEFT_PAREN) throw new RE2JSSyntaxException(Parser2.ERR_UNEXPECTED_PAREN, this.wholeRegexp);
    this.flags = re2.flags;
    if (re2.lb !== 0) {
      if (Parser2.hasCapture(re1)) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_CAPTURE_IN_LOOKBEHIND, this.wholeRegexp);
      if (re2.lb > 0) re2.op = Regexp.Op.PLB;
      else re2.op = Regexp.Op.NLB;
      re2.subs = [re1];
      this.push(re2);
      return;
    }
    if (re2.cap === 0) this.push(re1);
    else {
      re2.op = Regexp.Op.CAPTURE;
      re2.subs = [re1];
      this.push(re2);
    }
  }
  parsePerlClassEscape(t, cc) {
    const beforePos = t.pos();
    if ((this.flags & RE2Flags.PERL_X) === 0 || !t.more() || t.pop() !== Codepoint.CODES.get("\\") || !t.more()) return false;
    t.pop();
    const p2 = t.from(beforePos);
    const g2 = PERL_GROUPS.has(p2) ? PERL_GROUPS.get(p2) : null;
    if (g2 === null) return false;
    cc.appendGroup(g2, (this.flags & RE2Flags.FOLD_CASE) !== 0);
    return true;
  }
  parseNamedClass(t, cc) {
    const cls = t.rest();
    const i = cls.indexOf(":]");
    if (i < 0) return false;
    const name = cls.substring(0, i + 2);
    t.skipString(name);
    const g2 = POSIX_GROUPS.has(name) ? POSIX_GROUPS.get(name) : null;
    if (g2 === null) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_CHAR_RANGE, name);
    cc.appendGroup(g2, (this.flags & RE2Flags.FOLD_CASE) !== 0);
    return true;
  }
  parseUnicodeClass(t, cc) {
    const startPos = t.pos();
    if ((this.flags & RE2Flags.UNICODE_GROUPS) === 0 || !t.lookingAt("\\p") && !t.lookingAt("\\P")) return false;
    t.skip(1);
    let sign = 1;
    let c = t.pop();
    if (c === Codepoint.CODES.get("P")) sign = -1;
    if (!t.more()) {
      t.rewindTo(startPos);
      throw new RE2JSSyntaxException(Parser2.ERR_INVALID_CHAR_RANGE, t.rest());
    }
    c = t.pop();
    let name;
    if (c !== Codepoint.CODES.get("{")) name = Utils.runeToString(c);
    else {
      const rest = t.rest();
      const end = rest.indexOf("}");
      if (end < 0) {
        t.rewindTo(startPos);
        throw new RE2JSSyntaxException(Parser2.ERR_INVALID_CHAR_RANGE, t.rest());
      }
      name = rest.substring(0, end);
      t.skipString(name);
      t.skip(1);
    }
    if (!(name.length === 0) && name.codePointAt(0) === Codepoint.CODES.get("^")) {
      sign = 0 - sign;
      name = name.substring(1);
    }
    const pair = Parser2.unicodeTable(name);
    if (pair === null) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_CHAR_RANGE, t.from(startPos));
    if (pair.sign < 0) sign = 0 - sign;
    const tab = pair.tab;
    const fold = pair.fold;
    if ((this.flags & RE2Flags.FOLD_CASE) === 0 || fold === null) cc.appendTableWithSign(tab, sign);
    else {
      const tmp = new CharClass().appendTable(tab).appendTable(fold).cleanClass().toArray();
      cc.appendClassWithSign(tmp, sign);
    }
    return true;
  }
  parseClass(t) {
    const startPos = t.pos();
    t.skip(1);
    const re = this.newRegexp(Regexp.Op.CHAR_CLASS);
    re.flags = this.flags;
    const cc = new CharClass();
    let sign = 1;
    if (t.more() && t.lookingAt("^")) {
      sign = -1;
      t.skip(1);
      if ((this.flags & RE2Flags.CLASS_NL) === 0) cc.appendRange(Codepoint.CODES.get("\n"), Codepoint.CODES.get("\n"));
    }
    let first = true;
    while (!t.more() || t.peek() !== Codepoint.CODES.get("]") || first) {
      if (t.more() && t.lookingAt("-") && (this.flags & RE2Flags.PERL_X) === 0 && !first) {
        const s = t.rest();
        if (s === "-" || !s.startsWith("-]")) {
          t.rewindTo(startPos);
          throw new RE2JSSyntaxException(Parser2.ERR_INVALID_CHAR_RANGE, t.rest());
        }
      }
      first = false;
      const beforePos = t.pos();
      if (t.lookingAt("[:")) {
        if (this.parseNamedClass(t, cc)) continue;
        t.rewindTo(beforePos);
      }
      if (this.parseUnicodeClass(t, cc)) continue;
      if (this.parsePerlClassEscape(t, cc)) continue;
      t.rewindTo(beforePos);
      const lo = Parser2.parseClassChar(t, startPos);
      let hi = lo;
      if (t.more() && t.lookingAt("-")) {
        t.skip(1);
        if (t.more() && t.lookingAt("]")) t.skip(-1);
        else {
          hi = Parser2.parseClassChar(t, startPos);
          if (hi < lo) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_CHAR_RANGE, t.from(beforePos));
        }
      }
      if ((this.flags & RE2Flags.FOLD_CASE) === 0) cc.appendRange(lo, hi);
      else cc.appendFoldedRange(lo, hi);
    }
    t.skip(1);
    cc.cleanClass();
    if (sign < 0) cc.negateClass();
    re.runes = cc.toArray();
    this.push(re);
  }
};
var RE2 = class RE22 {
  static initTest(expr) {
    const re2 = RE22.compile(expr);
    const res = new RE22(re2.expr, re2.prog, re2.numSubexp, re2.longest);
    res.cond = re2.cond;
    res.prefix = re2.prefix;
    res.prefixUTF8 = re2.prefixUTF8;
    res.prefixComplete = re2.prefixComplete;
    res.prefixRune = re2.prefixRune;
    res.prefilter = re2.prefilter;
    return res;
  }
  /**
  * Parses a regular expression and returns, if successful, an {@code RE2} instance that can be
  * used to match against text.
  *
  * When matching against text, the regexp returns a match that begins as early as possible in the
  * input (leftmost), and among those it chooses the one that a backtracking search would have
  * found first. This so-called leftmost-first matching is the same semantics that Perl, Python,
  * and other implementations use, although this package implements it without the expense of
  * backtracking. For POSIX leftmost-longest matching, see {@link #compilePOSIX}.
  */
  static compile(expr) {
    return RE22.compileImpl(expr, RE2Flags.PERL, false);
  }
  /**
  * {@code compilePOSIX} is like {@link #compile} but restricts the regular expression to POSIX ERE
  * (egrep) syntax and changes the match semantics to leftmost-longest.
  *
  * That is, when matching against text, the regexp returns a match that begins as early as
  * possible in the input (leftmost), and among those it chooses a match that is as long as
  * possible. This so-called leftmost-longest matching is the same semantics that early regular
  * expression implementations used and that POSIX specifies.
  *
  * However, there can be multiple leftmost-longest matches, with different submatch choices, and
  * here this package diverges from POSIX. Among the possible leftmost-longest matches, this
  * package chooses the one that a backtracking search would have found first, while POSIX
  * specifies that the match be chosen to maximize the length of the first subexpression, then the
  * second, and so on from left to right. The POSIX rule is computationally prohibitive and not
  * even well-defined. See http://swtch.com/~rsc/regexp/regexp2.html#posix
  */
  static compilePOSIX(expr) {
    return RE22.compileImpl(expr, RE2Flags.POSIX, true);
  }
  static compileImpl(expr, mode, longest) {
    let re = Parser.parse(expr, mode);
    const maxCap = re.maxCap();
    re = Simplify.simplify(re);
    const prefilter = PrefilterTree.build(re);
    const prog = Compiler.compileRegexp(re);
    const re2 = new RE22(expr, prog, maxCap, longest);
    re2.prefilter = prefilter.type === Prefilter.Type.NONE ? null : prefilter;
    const [prefixCompl, prefixStr] = prog.prefix();
    re2.prefixComplete = prefixCompl;
    re2.prefix = prefixStr;
    re2.prefixUTF8 = Utils.stringToUtf8ByteArray(re2.prefix);
    if (re2.prefix.length > 0) re2.prefixRune = re2.prefix.codePointAt(0);
    re2.namedGroups = re.namedGroups;
    return re2;
  }
  /**
  * Returns true iff textual regular expression {@code pattern} matches string {@code s}.
  *
  * More complicated queries need to use {@link #compile} and the full {@code RE2} interface.
  */
  static match(pattern, s) {
    return RE22.compile(pattern).match(s);
  }
  constructor(expr, prog, numSubexp = 0, longest = 0) {
    this.expr = expr;
    this.prog = prog;
    this.numSubexp = numSubexp;
    this.longest = longest;
    this.cond = prog.startCond();
    this.prefix = null;
    this.prefixUTF8 = null;
    this.prefixComplete = false;
    this.prefixRune = 0;
    this.machinePool = [];
    this.dfa = new DFA(this.prog);
    this.onepass = OnePass.compile(this.prog);
    this.prefilter = null;
  }
  matchPrefixComplete(input, pos, anchor, ncap) {
    if ((anchor === RE2Flags.ANCHOR_START || anchor === RE2Flags.ANCHOR_BOTH) && pos !== 0) return null;
    let matchStart = -1;
    let matchEnd = -1;
    const pLen = input.prefixLength(this);
    if (anchor === RE2Flags.UNANCHORED) {
      const idx = input.index(this, pos);
      if (idx < 0) return null;
      matchStart = pos + idx;
      matchEnd = matchStart + pLen;
    } else if (anchor === RE2Flags.ANCHOR_BOTH) {
      if (input.endPos() !== pLen) return null;
      if (input.index(this, 0) !== 0) return null;
      matchStart = 0;
      matchEnd = pLen;
    } else if (anchor === RE2Flags.ANCHOR_START) {
      if (input.index(this, 0) !== 0) return null;
      matchStart = 0;
      matchEnd = pLen;
    }
    if (matchStart < 0) return null;
    if (ncap > 0) {
      const matchcap = new Int32Array(ncap).fill(-1);
      matchcap[0] = matchStart;
      matchcap[1] = matchEnd;
      return Array.from(matchcap);
    }
    return [];
  }
  executeEngine(input, pos, anchor, ncap) {
    if (this.prefixComplete && (ncap === 0 || this.numSubexp === 0)) return this.matchPrefixComplete(input, pos, anchor, ncap);
    if (this.prefilter !== null && anchor === RE2Flags.UNANCHORED) {
      if (!this.prefilter.eval(input, pos)) return null;
    }
    if (this.onepass !== null) return OnePass.execute(this, input, pos, anchor, ncap);
    if (ncap > 0) {
      if (this.prog.numLb === 0 && input.endPos() <= Backtracker.maxBitStateLen(this.prog)) return Backtracker.execute(this, input, pos, anchor, ncap);
      return this.doExecuteNFA(input, pos, anchor, ncap);
    }
    if (this.prog.numLb === 0) {
      const dfaResult = this.dfa.match(input, pos, anchor);
      if (dfaResult !== null) return dfaResult ? [] : null;
      if (input.endPos() <= Backtracker.maxBitStateLen(this.prog)) return Backtracker.execute(this, input, pos, anchor, ncap);
    }
    return this.doExecuteNFA(input, pos, anchor, ncap);
  }
  /**
  * Returns the number of parenthesized subexpressions in this regular expression.
  */
  numberOfCapturingGroups() {
    return this.numSubexp;
  }
  /**
  * Returns the number of instructions in this compiled regular expression program.
  */
  numberOfInstructions() {
    return this.prog.numInst();
  }
  get() {
    return this.machinePool.length > 0 ? this.machinePool.pop() : null;
  }
  reset() {
    this.machinePool.length = 0;
  }
  put(m2) {
    this.machinePool.push(m2);
  }
  toString() {
    return this.expr;
  }
  doExecuteNFA(input, pos, anchor, ncap) {
    let m2 = this.get();
    if (!m2) m2 = Machine.fromRE2(this);
    m2.init(ncap);
    const cap = m2.match(input, pos, anchor) ? m2.submatches() : null;
    this.put(m2);
    return cap;
  }
  match(s) {
    return this.executeEngine(MachineInput.fromUTF16(s), 0, RE2Flags.UNANCHORED, 0) !== null;
  }
  /**
  * Matches the regular expression against input starting at position start and ending at position
  * end, with the given anchoring. Records the submatch boundaries in group, which is [start, end)
  * pairs of byte offsets. The number of boundaries needed is inferred from the size of the group
  * array. It is most efficient not to ask for submatch boundaries.
  *
  * @param input the input byte array
  * @param start the beginning position in the input
  * @param end the end position in the input
  * @param anchor the anchoring flag (UNANCHORED, ANCHOR_START, ANCHOR_BOTH)
  * @param group the array to fill with submatch positions
  * @param ngroup the number of array pairs to fill in
  * @returns true if a match was found
  */
  matchWithGroup(input, start2, end, anchor, ngroup) {
    if (!(input instanceof MatcherInputBase)) if (Utils.isByteArray(input)) input = MatcherInput.utf8(input);
    else input = MatcherInput.utf16(input);
    return this.matchMachineInput(input, start2, end, anchor, ngroup);
  }
  matchMachineInput(input, start2, end, anchor, ngroup) {
    if (start2 > end) return [false, null];
    const machineInput = input.isUTF16Encoding() ? MachineInput.fromUTF16(input.asCharSequence(), 0, end) : MachineInput.fromUTF8(input.asBytes(), 0, end);
    const groupMatch = this.executeEngine(machineInput, start2, anchor, 2 * ngroup);
    if (groupMatch === null) return [false, null];
    return [true, groupMatch];
  }
  /**
  * Returns true iff this regexp matches the UTF-8 byte array {@code b}.
  */
  matchUTF8(b2) {
    return this.executeEngine(MachineInput.fromUTF8(b2), 0, RE2Flags.UNANCHORED, 0) !== null;
  }
  /**
  * Returns a copy of {@code src} in which all matches for this regexp have been replaced by
  * {@code repl}. No support is provided for expressions (e.g. {@code \1} or {@code $1}) in the
  * replacement string.
  */
  replaceAll(src, repl) {
    return this.replaceAllFunc(src, () => repl, 2 * src.length + 1);
  }
  /**
  * Returns a copy of {@code src} in which only the first match for this regexp has been replaced
  * by {@code repl}. No support is provided for expressions (e.g. {@code \1} or {@code $1}) in the
  * replacement string.
  */
  replaceFirst(src, repl) {
    return this.replaceAllFunc(src, () => repl, 1);
  }
  /**
  * Returns a copy of {@code src} in which at most {@code maxReplaces} matches for this regexp have
  * been replaced by the return value of of function {@code repl} (whose first argument is the
  * matched string). No support is provided for expressions (e.g. {@code \1} or {@code $1}) in the
  * replacement string.
  */
  replaceAllFunc(src, replFunc, maxReplaces) {
    let lastMatchEnd = 0;
    let searchPos = 0;
    let out = "";
    const input = MachineInput.fromUTF16(src);
    let numReplaces = 0;
    while (searchPos <= src.length) {
      const a = this.executeEngine(input, searchPos, RE2Flags.UNANCHORED, 2);
      if (a === null || a.length === 0) break;
      out += src.substring(lastMatchEnd, a[0]);
      if (a[1] > lastMatchEnd || a[0] === 0) {
        out += replFunc(src.substring(a[0], a[1]));
        numReplaces++;
      }
      lastMatchEnd = a[1];
      const width2 = input.step(searchPos) & 7;
      if (searchPos + width2 > a[1]) searchPos += width2;
      else if (searchPos + 1 > a[1]) searchPos++;
      else searchPos = a[1];
      if (numReplaces >= maxReplaces) break;
    }
    out += src.substring(lastMatchEnd);
    return out;
  }
  pad(a) {
    if (a === null) return null;
    let n2 = (1 + this.numSubexp) * 2;
    if (a.length < n2) {
      let a2 = new Array(n2).fill(-1);
      for (let i = 0; i < a.length; i++) a2[i] = a[i];
      a = a2;
    }
    return a;
  }
  allMatches(input, n2, deliverFun = (v2) => v2) {
    let result = [];
    const end = input.endPos();
    if (n2 < 0) n2 = end + 1;
    let pos = 0;
    let i = 0;
    let prevMatchEnd = -1;
    while (i < n2 && pos <= end) {
      const matches = this.executeEngine(input, pos, RE2Flags.UNANCHORED, this.prog.numCap);
      if (matches === null || matches.length === 0) break;
      let accept = true;
      if (matches[1] === pos) {
        if (matches[0] === prevMatchEnd) accept = false;
        const r = input.step(pos);
        if (r < 0) pos = end + 1;
        else pos += r & 7;
      } else pos = matches[1];
      prevMatchEnd = matches[1];
      if (accept) {
        result.push(deliverFun(this.pad(matches)));
        i++;
      }
    }
    return result;
  }
  /**
  * Returns an array holding the text of the leftmost match in {@code b} of this regular
  * expression.
  *
  * A return value of null indicates no match.
  */
  findUTF8(b2) {
    const a = this.executeEngine(MachineInput.fromUTF8(b2), 0, RE2Flags.UNANCHORED, 2);
    if (a === null) return null;
    return b2.slice(a[0], a[1]);
  }
  /**
  * Returns a two-element array of integers defining the location of the leftmost match in
  * {@code b} of this regular expression. The match itself is at {@code b[loc[0]...loc[1]]}.
  *
  * A return value of null indicates no match.
  */
  findUTF8Index(b2) {
    const a = this.executeEngine(MachineInput.fromUTF8(b2), 0, RE2Flags.UNANCHORED, 2);
    if (a === null) return null;
    return a.slice(0, 2);
  }
  /**
  * Returns a string holding the text of the leftmost match in {@code s} of this regular
  * expression.
  *
  * If there is no match, the return value is an empty string, but it will also be empty if the
  * regular expression successfully matches an empty string. Use {@link #findIndex} or
  * {@link #findSubmatch} if it is necessary to distinguish these cases.
  */
  find(s) {
    const a = this.executeEngine(MachineInput.fromUTF16(s), 0, RE2Flags.UNANCHORED, 2);
    if (a === null) return "";
    return s.substring(a[0], a[1]);
  }
  /**
  * Returns a two-element array of integers defining the location of the leftmost match in
  * {@code s} of this regular expression. The match itself is at
  * {@code s.substring(loc[0], loc[1])}.
  *
  * A return value of null indicates no match.
  */
  findIndex(s) {
    return this.executeEngine(MachineInput.fromUTF16(s), 0, RE2Flags.UNANCHORED, 2);
  }
  /**
  * Returns an array of arrays the text of the leftmost match of the regular expression in
  * {@code b} and the matches, if any, of its subexpressions, as defined by the <a
  * href='#submatch'>Submatch</a> description above.
  *
  * A return value of null indicates no match.
  */
  findUTF8Submatch(b2) {
    const a = this.executeEngine(MachineInput.fromUTF8(b2), 0, RE2Flags.UNANCHORED, this.prog.numCap);
    if (a === null) return null;
    const ret = new Array(1 + this.numSubexp).fill(null);
    for (let i = 0; i < ret.length; i++) if (2 * i < a.length && a[2 * i] >= 0) ret[i] = b2.slice(a[2 * i], a[2 * i + 1]);
    return ret;
  }
  /**
  * Returns an array holding the index pairs identifying the leftmost match of this regular
  * expression in {@code b} and the matches, if any, of its subexpressions, as defined by the the
  * <a href='#submatch'>Submatch</a> and <a href='#index'>Index</a> descriptions above.
  *
  * A return value of null indicates no match.
  */
  findUTF8SubmatchIndex(b2) {
    return this.pad(this.executeEngine(MachineInput.fromUTF8(b2), 0, RE2Flags.UNANCHORED, this.prog.numCap));
  }
  /**
  * Returns an array of strings holding the text of the leftmost match of the regular expression in
  * {@code s} and the matches, if any, of its subexpressions, as defined by the <a
  * href='#submatch'>Submatch</a> description above.
  *
  * A return value of null indicates no match.
  */
  findSubmatch(s) {
    const a = this.executeEngine(MachineInput.fromUTF16(s), 0, RE2Flags.UNANCHORED, this.prog.numCap);
    if (a === null) return null;
    const ret = new Array(1 + this.numSubexp).fill(null);
    for (let i = 0; i < ret.length; i++) if (2 * i < a.length && a[2 * i] >= 0) ret[i] = s.substring(a[2 * i], a[2 * i + 1]);
    return ret;
  }
  /**
  * Returns an array holding the index pairs identifying the leftmost match of this regular
  * expression in {@code s} and the matches, if any, of its subexpressions, as defined by the <a
  * href='#submatch'>Submatch</a> description above.
  *
  * A return value of null indicates no match.
  */
  findSubmatchIndex(s) {
    return this.pad(this.executeEngine(MachineInput.fromUTF16(s), 0, RE2Flags.UNANCHORED, this.prog.numCap));
  }
  /**
  * {@code findAllUTF8()} is the <a href='#all'>All</a> version of {@link #findUTF8}; it returns a
  * list of up to {@code n} successive matches of the expression, as defined by the <a
  * href='#all'>All</a> description above.
  *
  * A return value of null indicates no match.
  *
  * TODO(adonovan): think about defining a byte slice view class, like a read-only Go slice backed
  * by |b|.
  */
  findAllUTF8(b2, n2) {
    const result = this.allMatches(MachineInput.fromUTF8(b2), n2, (match) => b2.slice(match[0], match[1]));
    if (result.length === 0) return null;
    return result;
  }
  /**
  * {@code findAllUTF8Index} is the <a href='#all'>All</a> version of {@link #findUTF8Index}; it
  * returns a list of up to {@code n} successive matches of the expression, as defined by the <a
  * href='#all'>All</a> description above.
  *
  * A return value of null indicates no match.
  */
  findAllUTF8Index(b2, n2) {
    const result = this.allMatches(MachineInput.fromUTF8(b2), n2, (match) => match.slice(0, 2));
    if (result.length === 0) return null;
    return result;
  }
  /**
  * {@code findAll} is the <a href='#all'>All</a> version of {@link #find}; it returns a list of up
  * to {@code n} successive matches of the expression, as defined by the <a href='#all'>All</a>
  * description above.
  *
  * A return value of null indicates no match.
  */
  findAll(s, n2) {
    const result = this.allMatches(MachineInput.fromUTF16(s), n2, (match) => s.substring(match[0], match[1]));
    if (result.length === 0) return null;
    return result;
  }
  /**
  * {@code findAllIndex} is the <a href='#all'>All</a> version of {@link #findIndex}; it returns a
  * list of up to {@code n} successive matches of the expression, as defined by the <a
  * href='#all'>All</a> description above.
  *
  * A return value of null indicates no match.
  */
  findAllIndex(s, n2) {
    const result = this.allMatches(MachineInput.fromUTF16(s), n2, (match) => match.slice(0, 2));
    if (result.length === 0) return null;
    return result;
  }
  /**
  * {@code findAllUTF8Submatch} is the <a href='#all'>All</a> version of {@link #findUTF8Submatch};
  * it returns a list of up to {@code n} successive matches of the expression, as defined by the <a
  * href='#all'>All</a> description above.
  *
  * A return value of null indicates no match.
  */
  findAllUTF8Submatch(b2, n2) {
    const result = this.allMatches(MachineInput.fromUTF8(b2), n2, (match) => {
      let slice = new Array(match.length / 2 | 0).fill(null);
      for (let j = 0; j < slice.length; j++) if (match[2 * j] >= 0) slice[j] = b2.slice(match[2 * j], match[2 * j + 1]);
      return slice;
    });
    if (result.length === 0) return null;
    return result;
  }
  /**
  * {@code findAllUTF8SubmatchIndex} is the <a href='#all'>All</a> version of
  * {@link #findUTF8SubmatchIndex}; it returns a list of up to {@code n} successive matches of the
  * expression, as defined by the <a href='#all'>All</a> description above.
  *
  * A return value of null indicates no match.
  */
  findAllUTF8SubmatchIndex(b2, n2) {
    const result = this.allMatches(MachineInput.fromUTF8(b2), n2);
    if (result.length === 0) return null;
    return result;
  }
  /**
  * {@code findAllSubmatch} is the <a href='#all'>All</a> version of {@link #findSubmatch}; it
  * returns a list of up to {@code n} successive matches of the expression, as defined by the <a
  * href='#all'>All</a> description above.
  *
  * A return value of null indicates no match.
  */
  findAllSubmatch(s, n2) {
    const result = this.allMatches(MachineInput.fromUTF16(s), n2, (match) => {
      let slice = new Array(match.length / 2 | 0).fill(null);
      for (let j = 0; j < slice.length; j++) if (match[2 * j] >= 0) slice[j] = s.substring(match[2 * j], match[2 * j + 1]);
      return slice;
    });
    if (result.length === 0) return null;
    return result;
  }
  /**
  * {@code findAllSubmatchIndex} is the <a href='#all'>All</a> version of
  * {@link #findSubmatchIndex}; it returns a list of up to {@code n} successive matches of the
  * expression, as defined by the <a href='#all'>All</a> description above.
  *
  * A return value of null indicates no match.
  */
  findAllSubmatchIndex(s, n2) {
    const result = this.allMatches(MachineInput.fromUTF16(s), n2);
    if (result.length === 0) return null;
    return result;
  }
};
var RE2Set = class RE2Set2 {
  /** @type {number} */
  static UNANCHORED = RE2Flags.UNANCHORED;
  /** @type {number} */
  static ANCHOR_START = RE2Flags.ANCHOR_START;
  /** @type {number} */
  static ANCHOR_BOTH = RE2Flags.ANCHOR_BOTH;
  /**
  * Constructs a new RE2Set with the specified anchor mode and flags.
  * @param {number} [anchor=RE2Set.UNANCHORED] - The anchoring mode (e.g., RE2Set.UNANCHORED).
  * @param {number} [flags=0] - The public flags to apply to all patterns in the set.
  * @param {number} [maxMem=8388608] - The maximum memory in bytes to use for the DFA (default 8MB).
  */
  constructor(anchor = RE2Set2.UNANCHORED, flags = 0, maxMem = 8388608) {
    this.anchor = anchor;
    this.jsFlags = flags;
    this.maxMem = maxMem;
    let re2Flags = RE2Flags.PERL;
    if ((flags & PublicFlags.DISABLE_UNICODE_GROUPS) !== 0) re2Flags &= ~RE2Flags.UNICODE_GROUPS;
    if ((flags & PublicFlags.LOOKBEHINDS) !== 0) re2Flags |= RE2Flags.LOOKBEHIND;
    this.re2Flags = re2Flags;
    this.regexps = [];
    this.prog = null;
    this.dfa = null;
    this.dummyRe2 = null;
  }
  /**
  * Adds a new regular expression pattern to the set.
  * Patterns cannot be added after the set has been compiled.
  * @param {string} pattern - The regular expression pattern to add.
  * @returns {number} The integer index assigned to the added pattern.
  * @throws {RE2JSCompileException} If patterns are added after compilation.
  */
  add(pattern) {
    if (this.prog) throw new RE2JSCompileException("Cannot add patterns after compile");
    let fregex = pattern;
    if ((this.jsFlags & PublicFlags.CASE_INSENSITIVE) !== 0) fregex = `(?i)${fregex}`;
    if ((this.jsFlags & PublicFlags.DOTALL) !== 0) fregex = `(?s)${fregex}`;
    if ((this.jsFlags & PublicFlags.MULTILINE) !== 0) fregex = `(?m)${fregex}`;
    const re = Parser.parse(fregex, this.re2Flags);
    this.regexps.push(Simplify.simplify(re));
    return this.regexps.length - 1;
  }
  /**
  * Compiles the added patterns into a single state machine.
  * This is automatically called on the first match if not called explicitly.
  * @returns {void}
  */
  compile() {
    if (this.prog) return;
    this.prog = Compiler.compileSet(this.regexps);
    this.dfa = new DFA(this.prog, this.maxMem);
    this.dummyRe2 = {
      prog: this.prog,
      cond: this.prog.startCond(),
      prefix: "",
      prefixRune: 0,
      longest: false
    };
  }
  /**
  * Matches the input against the compiled set of regular expressions.
  * @param {string|number[]|Uint8Array} input - The input string or UTF-8 byte array to match against.
  * @returns {number[]} An array of indices representing the patterns that successfully matched the input.
  */
  match(input) {
    if (!this.prog) this.compile();
    const machineInput = Utils.isByteArray(input) ? MachineInput.fromUTF8(input) : MachineInput.fromUTF16(input);
    let internalAnchor = RE2Flags.UNANCHORED;
    if (this.anchor === RE2Set2.ANCHOR_START) internalAnchor = RE2Flags.ANCHOR_START;
    else if (this.anchor === RE2Set2.ANCHOR_BOTH) internalAnchor = RE2Flags.ANCHOR_BOTH;
    const dfaResult = this.dfa.matchSet(machineInput, 0, internalAnchor);
    if (dfaResult !== null) return dfaResult;
    const machine = Machine.fromRE2(this.dummyRe2);
    machine.init(0);
    return machine.matchSet(machineInput, 0, internalAnchor);
  }
};
var TranslateRegExpString = class TranslateRegExpString2 {
  static isHexadecimal(ch) {
    return "0" <= ch && ch <= "9" || "A" <= ch && ch <= "F" || "a" <= ch && ch <= "f";
  }
  static translate(data) {
    let prefixFlags = "";
    if (data instanceof RegExp) {
      if (data.ignoreCase) prefixFlags += "i";
      if (data.multiline) prefixFlags += "m";
      if (data.dotAll) prefixFlags += "s";
      data = data.source;
    }
    if (typeof data !== "string") return data;
    let result = "";
    let changed = false;
    let size = data.length;
    if (size === 0) {
      result = "(?:)";
      changed = true;
    }
    let inCharClass = false;
    let i = 0;
    while (i < size) {
      let ch = data[i];
      if (ch === "\\") {
        if (i + 1 < size) {
          ch = data[i + 1];
          switch (ch) {
            case "\\":
              result += "\\\\";
              i += 2;
              continue;
            case "c":
              if (i + 2 < size) {
                let code = data[i + 2].charCodeAt(0);
                if (code >= 65 && code <= 90 || code >= 97 && code <= 122) {
                  let val = code % 32;
                  result += "\\x";
                  result += (val >> 4).toString(16).toUpperCase();
                  result += (val & 15).toString(16).toUpperCase();
                  i += 3;
                  changed = true;
                  continue;
                }
              }
              result += "c";
              i += 2;
              changed = true;
              continue;
            case "u":
              if (i + 2 < size) {
                if (data[i + 2] === "{") {
                  let j = i + 3;
                  let hasHex = false;
                  let closed = false;
                  while (j < size) {
                    const hexChar = data[j];
                    if (hexChar === "}") {
                      closed = true;
                      break;
                    }
                    if (!TranslateRegExpString2.isHexadecimal(hexChar)) break;
                    hasHex = true;
                    j++;
                  }
                  if (closed && hasHex) {
                    result += "\\x";
                    i += 2;
                    changed = true;
                    continue;
                  }
                } else if (i + 5 < size) {
                  let isHex4 = true;
                  for (let j = 0; j < 4; j++) if (!TranslateRegExpString2.isHexadecimal(data[i + 2 + j])) {
                    isHex4 = false;
                    break;
                  }
                  if (isHex4) {
                    result += "\\x{" + data.substring(i + 2, i + 6) + "}";
                    i += 6;
                    changed = true;
                    continue;
                  }
                }
              }
              result += "u";
              i += 2;
              changed = true;
              continue;
            case "x": {
              let isValidHex = false;
              if (i + 2 < size && data[i + 2] === "{") {
                let j = i + 3;
                let hasHex = false;
                let closed = false;
                while (j < size) {
                  const hexChar = data[j];
                  if (hexChar === "}") {
                    closed = true;
                    break;
                  }
                  if (!TranslateRegExpString2.isHexadecimal(hexChar)) break;
                  hasHex = true;
                  j++;
                }
                if (closed && hasHex) isValidHex = true;
              } else if (i + 3 < size && TranslateRegExpString2.isHexadecimal(data[i + 2]) && TranslateRegExpString2.isHexadecimal(data[i + 3])) isValidHex = true;
              if (isValidHex) {
                result += "\\x";
                i += 2;
              } else {
                result += "x";
                i += 2;
                changed = true;
              }
              continue;
            }
            case "n":
            case "r":
            case "t":
            case "a":
            case "f":
            case "v":
            case "d":
            case "D":
            case "s":
            case "S":
            case "w":
            case "W":
            case "b":
            case "B":
            case "p":
            case "P":
            case "A":
            case "z":
            case "Q":
            case "E":
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
              result += "\\" + ch;
              i += 2;
              continue;
            default: {
              let cp2 = data.codePointAt(i + 1);
              if (cp2 >= 48 && cp2 <= 57 || cp2 >= 65 && cp2 <= 90 || cp2 >= 97 && cp2 <= 122) {
                let symSize2 = Utils.charCount(cp2);
                result += data.substring(i + 1, i + 1 + symSize2);
                i += symSize2 + 1;
                changed = true;
              } else {
                result += "\\";
                let symSize2 = Utils.charCount(cp2);
                result += data.substring(i + 1, i + 1 + symSize2);
                i += symSize2 + 1;
              }
              continue;
            }
          }
        }
      } else if (ch === "/") {
        result += "\\/";
        i += 1;
        changed = true;
        continue;
      } else if (ch === "[") inCharClass = true;
      else if (ch === "]") inCharClass = false;
      else if (!inCharClass && ch === "(" && i + 2 < size && data[i + 1] === "?" && data[i + 2] === "<") {
        if (i + 3 < size && !"=!>)".includes(data[i + 3])) {
          result += "(?P<";
          i += 3;
          changed = true;
          continue;
        }
      }
      let cp = data.codePointAt(i);
      let symSize = Utils.charCount(cp);
      result += data.substring(i, i + symSize);
      i += symSize;
    }
    const finalResult = changed ? result : data;
    if (prefixFlags.length > 0) return `(?${prefixFlags})${finalResult}`;
    return finalResult;
  }
};
var RE2JS = class RE2JS2 {
  /**
  * Flag: case insensitive matching.
  */
  static CASE_INSENSITIVE = PublicFlags.CASE_INSENSITIVE;
  /**
  * Flag: dot ({@code .}) matches all characters, including newline.
  */
  static DOTALL = PublicFlags.DOTALL;
  /**
  * Flag: multiline matching: {@code ^} and {@code $} match at beginning and end of line, not just
  * beginning and end of input.
  */
  static MULTILINE = PublicFlags.MULTILINE;
  /**
  * Flag: Unicode groups (e.g. {@code \p\ Greek\} ) will be syntax errors.
  */
  static DISABLE_UNICODE_GROUPS = PublicFlags.DISABLE_UNICODE_GROUPS;
  /**
  * Flag: matches longest possible string.
  */
  static LONGEST_MATCH = PublicFlags.LONGEST_MATCH;
  /**
  * Flag: enable linear-time captureless lookbehinds.
  */
  static LOOKBEHINDS = PublicFlags.LOOKBEHINDS;
  /**
  * Returns a literal pattern string for the specified string.
  *
  * This method produces a string that can be used to create a <code>RE2JS</code> that would
  * match the string <code>s</code> as if it were a literal pattern.
  *
  * Metacharacters or escape sequences in the input sequence will be given no special meaning.
  *
  * @param {string} str The string to be literalized
  * @returns {string} A literal string replacement
  */
  static quote(str) {
    return Utils.quoteMeta(str);
  }
  /**
  * Quotes '\' and '$' in {@code str}, so that the returned string could be used in
  * replacement methods as a literal replacement of {@code str}.
  *
  * This is a convenience delegation to {@link Matcher.quoteReplacement}.
  *
  * @param {string} str the string to be quoted
  * @param {boolean} [javaMode=false] whether the replacement will be used in javaMode
  * @returns {string} the quoted string
  */
  static quoteReplacement(str, javaMode = false) {
    return Matcher.quoteReplacement(str, javaMode);
  }
  /**
  * Translates a given regular expression string to ensure compatibility with RE2JS.
  *
  * This function preprocesses the input regex string by applying necessary transformations,
  * such as escaping special characters (e.g., `/`), converting named capture groups to
  * RE2JS-compatible syntax, and handling Unicode sequences properly. It ensures that the
  * resulting regex is safe and properly formatted before compilation.
  *
  * @param {string|RegExp} expr - The regular expression string to be translated.
  * @returns {string} - The transformed regular expression string, ready for compilation.
  */
  static translateRegExp(expr) {
    return TranslateRegExpString.translate(expr);
  }
  /**
  * Helper: create new RE2JS with given regex and flags. Flregex is the regex with flags applied.
  * @param {string} regex
  * @param {number} [flags=0]
  * @returns {RE2JS}
  */
  static compile(regex, flags = 0) {
    let fregex = regex;
    if ((flags & RE2JS2.CASE_INSENSITIVE) !== 0) fregex = `(?i)${fregex}`;
    if ((flags & RE2JS2.DOTALL) !== 0) fregex = `(?s)${fregex}`;
    if ((flags & RE2JS2.MULTILINE) !== 0) fregex = `(?m)${fregex}`;
    if ((flags & ~(RE2JS2.MULTILINE | RE2JS2.DOTALL | RE2JS2.CASE_INSENSITIVE | RE2JS2.DISABLE_UNICODE_GROUPS | RE2JS2.LONGEST_MATCH | RE2JS2.LOOKBEHINDS)) !== 0) throw new RE2JSFlagsException("Flags should only be a combination of MULTILINE, DOTALL, CASE_INSENSITIVE, DISABLE_UNICODE_GROUPS, LONGEST_MATCH, LOOKBEHINDS");
    let re2Flags = RE2Flags.PERL;
    if ((flags & RE2JS2.DISABLE_UNICODE_GROUPS) !== 0) re2Flags &= ~RE2Flags.UNICODE_GROUPS;
    if ((flags & RE2JS2.LOOKBEHINDS) !== 0) re2Flags |= RE2Flags.LOOKBEHIND;
    const p2 = new RE2JS2(regex, flags);
    p2.re2Input = RE2.compileImpl(fregex, re2Flags, (flags & RE2JS2.LONGEST_MATCH) !== 0);
    return p2;
  }
  /**
  * Matches a string against a regular expression.
  *
  * @param {string} regex the regular expression
  * @param {string|number[]|Uint8Array} input the input
  * @returns {boolean} true if the regular expression matches the entire input
  * @throws RE2JSSyntaxException if the regular expression is malformed
  */
  static matches(regex, input) {
    return RE2JS2.compile(regex).testExact(input);
  }
  /**
  * This is visible for testing.
  * @private
  */
  static initTest(pattern, flags, re2) {
    if (pattern == null) throw new Error("pattern is null");
    if (re2 == null) throw new Error("re2 is null");
    const p2 = new RE2JS2(pattern, flags);
    p2.re2Input = re2;
    return p2;
  }
  /**
  *
  * @param {string} pattern
  * @param {number} flags
  */
  constructor(pattern, flags) {
    this.patternInput = pattern;
    this.flagsInput = flags;
    this.re2Input = null;
  }
  /**
  * Releases memory used by internal caches associated with this pattern. Does not change the
  * observable behaviour. Useful for tests that detect memory leaks via allocation tracking.
  */
  reset() {
    this.re2Input.reset();
  }
  /**
  * Returns the flags used in the constructor.
  * @returns {number}
  */
  flags() {
    return this.flagsInput;
  }
  /**
  * Returns the pattern used in the constructor.
  * @returns {string}
  */
  pattern() {
    return this.patternInput;
  }
  re2() {
    return this.re2Input;
  }
  /**
  * Matches a string against a regular expression.
  *
  * @param {string|number[]|Uint8Array} input the input
  * @returns {boolean} true if the regular expression matches the entire input
  */
  matches(input) {
    return this.testExact(input);
  }
  /**
  * Creates a new {@code Matcher} matching the pattern against the input.
  *
  * @param {string|number[]|Uint8Array|MatcherInputBase} input the input string
  * @returns {Matcher}
  */
  matcher(input) {
    if (Utils.isByteArray(input)) input = MatcherInput.utf8(input);
    return new Matcher(this, input);
  }
  /**
  * Tests whether the regular expression matches any part of the input string.
  * Performance Note: This method is highly optimized. Because it only returns
  * a boolean and does not extract capture groups, it bypasses the `Matcher` overhead
  * and guarantees execution on the high-speed DFA engine whenever possible.
  *
  * @param {string|number[]|Uint8Array} input - The input string or UTF-8 byte array to test against.
  * @returns {boolean} `true` if the pattern is found anywhere in the input, `false` otherwise.
  */
  test(input) {
    if (Utils.isByteArray(input)) return this.re2Input.matchUTF8(input);
    return this.re2Input.match(input);
  }
  /**
  * Tests whether the regular expression matches the ENTIRE input string.
  * * **Performance Note:** This operates identically to `.matches()`, but is significantly
  * faster because it does not request capture group data. By requesting 0 capture groups,
  * it securely routes execution through the DFA fast-path.
  *
  * @param {string|number[]|Uint8Array} input - The input string or UTF-8 byte array to test against.
  * @returns {boolean} `true` if the exact input string fully matches the pattern, `false` otherwise.
  */
  testExact(input) {
    const machineInput = Utils.isByteArray(input) ? MachineInput.fromUTF8(input) : MachineInput.fromUTF16(input);
    return this.re2Input.executeEngine(machineInput, 0, RE2Flags.ANCHOR_BOTH, 0) !== null;
  }
  /**
  * Executes a search for a match in a specified string.
  * Returns a result array, or null if no match is found.
  * The returned array perfectly mirrors standard JavaScript `RegExpExecArray`,
  * including `.index`, `.input`, and `.groups` properties.
  *
  * @param {string|number[]|Uint8Array} input the input string or byte array
  * @returns {Array|null} the match array with index, input, and groups properties, or null
  */
  exec(input) {
    const m2 = this.matcher(input);
    if (!m2.find()) return null;
    const result = [m2.group(0)];
    for (let i = 1; i <= m2.groupCount(); i++) {
      const val = m2.group(i);
      result.push(val === null ? void 0 : val);
    }
    result.index = m2.start(0);
    result.input = input;
    const namedGroups = this.namedGroups();
    if (Object.keys(namedGroups).length > 0) {
      const parsedGroups = m2.getNamedGroups();
      for (const key in parsedGroups) if (parsedGroups[key] === null) parsedGroups[key] = void 0;
      result.groups = parsedGroups;
    } else result.groups = void 0;
    return result;
  }
  /**
  * Splits input around instances of the regular expression. It returns an array giving the strings
  * that occur before, between, and after instances of the regular expression.
  *
  * If {@code limit <= 0}, there is no limit on the size of the returned array. If
  * {@code limit == 0}, empty strings that would occur at the end of the array are omitted. If
  * {@code limit > 0}, at most limit strings are returned. The final string contains the remainder
  * of the input, possibly including additional matches of the pattern.
  *
  * @param {string} input the input string to be split
  * @param {number} [limit=0] the limit
  * @returns {string[]} the split strings
  */
  split(input, limit = 0) {
    const m2 = this.matcher(input);
    const result = [];
    let emptiesSkipped = 0;
    let last = 0;
    while (m2.find()) {
      if (last === 0 && m2.end() === 0) {
        last = m2.end();
        continue;
      }
      if (limit > 0 && result.length === limit - 1) break;
      if (last === m2.start()) {
        if (limit === 0) {
          emptiesSkipped += 1;
          last = m2.end();
          continue;
        }
      } else while (emptiesSkipped > 0) {
        result.push("");
        emptiesSkipped -= 1;
      }
      result.push(m2.substring(last, m2.start()));
      last = m2.end();
    }
    if (limit === 0 && last !== m2.inputLength()) {
      while (emptiesSkipped > 0) {
        result.push("");
        emptiesSkipped -= 1;
      }
      result.push(m2.substring(last, m2.inputLength()));
    }
    if (limit !== 0 || result.length === 0 && !(last === m2.inputLength() && last > 0)) result.push(m2.substring(last, m2.inputLength()));
    return result;
  }
  /**
  * Returns an iterator of all results matching a string against the regular expression,
  * including capturing groups.
  *
  * @param {string|number[]|Uint8Array} input the input string or byte array
  * @returns {IterableIterator<RegExpMatchArray>}
  */
  *matchAll(input) {
    const m2 = this.matcher(input);
    while (m2.find()) {
      const result = [m2.group(0)];
      for (let i = 1; i <= m2.groupCount(); i++) {
        const groupVal = m2.group(i);
        result.push(groupVal === null ? void 0 : groupVal);
      }
      result.index = m2.start(0);
      result.input = input;
      const namedGroups = this.namedGroups();
      if (Object.keys(namedGroups).length > 0) {
        const parsedGroups = m2.getNamedGroups();
        for (const key in parsedGroups) if (parsedGroups[key] === null) parsedGroups[key] = void 0;
        result.groups = parsedGroups;
      } else result.groups = void 0;
      yield result;
    }
  }
  /**
  *
  * @returns {string}
  */
  toString() {
    return this.patternInput;
  }
  /**
  * Returns the program size of this pattern.
  *
  * <p>
  * Similar to the C++ implementation, the program size is a very approximate measure of a regexp's
  * "cost". Larger numbers are more expensive than smaller numbers.
  * </p>
  *
  * @returns {number} the program size of this pattern
  */
  programSize() {
    return this.re2Input.numberOfInstructions();
  }
  /**
  * Returns the number of capturing groups in this matcher's pattern. Group zero denotes the entire
  * pattern and is excluded from this count.
  *
  * @returns {number} the number of capturing groups in this pattern
  */
  groupCount() {
    return this.re2Input.numberOfCapturingGroups();
  }
  /**
  * Return a map of the capturing groups in this matcher's pattern, where key is the name and value
  * is the index of the group in the pattern.
  * @returns {Record<string, number>}
  */
  namedGroups() {
    return this.re2Input.namedGroups;
  }
  /**
  *
  * @param {*} other
  * @returns {boolean}
  */
  equals(other) {
    if (this === other) return true;
    if (other === null || this.constructor !== other.constructor) return false;
    return this.flagsInput === other.flagsInput && this.patternInput === other.patternInput;
  }
};

// packages/schema/src/settings.ts
var identifier3 = import_zod46.z.string().min(1).max(240).regex(/^(?!(?:__proto__|__all__)$)/, "reserved settings key");
var label = import_zod46.z.string().min(1).max(240);
var strings = import_zod46.z.array(import_zod46.z.string().min(1).max(1024)).min(1).max(1e3);
var SettingsPathPattern = import_zod46.z.string().min(1).max(1024).refine((value) => {
  if (value.startsWith("regex:")) {
    try {
      if (value.length === 6) return false;
      RE2JS.compile(value.slice(6));
      return true;
    } catch {
      return false;
    }
  }
  return !value.startsWith("/") && !value.includes("\\") && !value.split("/").includes("..") && !/[[\]{}!():]/.test(value);
}, "use project-relative globs or regex: followed by a valid RE2 expression");
var paths = import_zod46.z.array(SettingsPathPattern).max(1e3);
var SettingsDiscovery = import_zod46.z.object({
  files: import_zod46.z.object({ include: paths.optional(), exclude: paths.optional() }).strict().optional()
}).strict();
var SettingsDetail = import_zod46.z.object({
  level: import_zod46.z.enum(["files", "workflows", "steps"]).optional(),
  maxCallDepth: import_zod46.z.number().int().min(0).max(10).optional(),
  maxDirectoryDepth: import_zod46.z.number().int().min(0).max(100).optional()
}).strict();
var SettingsPresentation = import_zod46.z.object({
  label: label.optional(),
  description: import_zod46.z.string().max(4e3).optional(),
  icon: IconValue.optional(),
  color: import_zod46.z.string().regex(/^(?:[a-z][a-z0-9-]*|#[0-9a-fA-F]{6})$/).optional(),
  style: import_zod46.z.object({
    density: import_zod46.z.enum(["compact", "comfortable"]).optional(),
    radius: import_zod46.z.enum(["sharp", "soft"]).optional()
  }).strict().optional(),
  renderer: identifier3.optional()
}).strict();
var workflowMatch = import_zod46.z.object({
  ids: strings.optional(),
  sourcePaths: paths.refine((values) => values.length > 0).optional(),
  symbols: strings.optional(),
  folders: strings.optional(),
  tagsAny: strings.optional(),
  exported: import_zod46.z.boolean().optional()
}).strict();
var nodeMatch = import_zod46.z.object({
  ids: strings.optional(),
  kinds: import_zod46.z.array(NodeKind).min(1).optional(),
  native: strings.optional(),
  plugins: strings.optional()
}).strict();
var SettingsWorkflowSelector = workflowMatch.refine((value) => Object.keys(value).length > 0, {
  message: "a workflow selector needs at least one condition"
});
var SettingsNodeSelector = nodeMatch.refine((value) => Object.keys(value).length > 0, {
  message: "a node selector needs at least one condition"
});
var workflowViewSelector = workflowMatch.extend({ layersAny: strings.optional() }).refine((value) => Object.keys(value).length > 0, { message: "a workflow selector needs at least one condition" });
var nodeViewSelector = nodeMatch.extend({ layersAny: strings.optional() }).refine((value) => Object.keys(value).length > 0, { message: "a node selector needs at least one condition" });
var SettingsAppearance = import_zod46.z.object({
  nodeDefaults: SettingsPresentation.optional(),
  workflowDefaults: SettingsPresentation.optional(),
  native: import_zod46.z.record(identifier3, SettingsPresentation).optional(),
  plugins: import_zod46.z.record(identifier3, SettingsPresentation).optional(),
  rules: import_zod46.z.array(
    import_zod46.z.discriminatedUnion("target", [
      import_zod46.z.object({
        id: identifier3,
        target: import_zod46.z.literal("node"),
        match: SettingsNodeSelector,
        presentation: SettingsPresentation
      }).strict(),
      import_zod46.z.object({
        id: identifier3,
        target: import_zod46.z.literal("workflow"),
        match: SettingsWorkflowSelector,
        presentation: SettingsPresentation
      }).strict()
    ])
  ).max(1e3).optional()
}).strict();
var SettingsOverrides = import_zod46.z.object({
  nodes: import_zod46.z.record(identifier3, SettingsPresentation).optional(),
  workflows: import_zod46.z.record(
    identifier3,
    import_zod46.z.object({
      presentation: SettingsPresentation.optional(),
      nodePresentation: import_zod46.z.record(identifier3, SettingsPresentation).optional()
    }).strict()
  ).optional()
}).strict();
var SettingsLayers = import_zod46.z.record(
  identifier3,
  import_zod46.z.object({
    label: label.optional(),
    workflows: import_zod46.z.array(SettingsWorkflowSelector).min(1).max(1e3).optional(),
    nodes: import_zod46.z.array(SettingsNodeSelector).min(1).max(1e3).optional()
  }).strict().refine((value) => value.workflows !== void 0 || value.nodes !== void 0, {
    message: "a layer needs workflow or node selectors"
  })
);
var SettingsViews = import_zod46.z.record(
  identifier3,
  import_zod46.z.object({
    label: label.optional(),
    groupBy: import_zod46.z.enum(["source", "folder", "flat", "architecture"]).optional(),
    detail: SettingsDetail.optional(),
    workflows: import_zod46.z.object({
      exportedOnly: import_zod46.z.boolean().optional(),
      includeModules: import_zod46.z.boolean().optional(),
      include: import_zod46.z.array(workflowViewSelector).max(1e3).optional(),
      exclude: import_zod46.z.array(workflowViewSelector).max(1e3).optional()
    }).strict().optional(),
    navigation: import_zod46.z.object({ collapsedPaths: strings.optional() }).strict().optional(),
    canvas: import_zod46.z.object({
      hideCallsToHiddenWorkflows: import_zod46.z.boolean().optional(),
      include: import_zod46.z.array(nodeViewSelector).max(1e3).optional(),
      exclude: import_zod46.z.array(nodeViewSelector).max(1e3).optional(),
      collapseLayers: strings.optional()
    }).strict().optional()
  }).strict()
);
var SettingsFileReference = import_zod46.z.object({ $file: import_zod46.z.string().min(1).max(1024) }).strict();
var OctonodeSettingsDocument = import_zod46.z.object({
  $schema: import_zod46.z.string().optional(),
  apiVersion: import_zod46.z.literal(SETTINGS_API_VERSION),
  plugin: PluginManifest.optional(),
  defaultView: identifier3.optional(),
  layout: SettingsLayout.optional(),
  discovery: import_zod46.z.union([SettingsFileReference, SettingsDiscovery]).optional(),
  appearance: import_zod46.z.union([SettingsFileReference, SettingsAppearance]).optional(),
  overrides: import_zod46.z.union([SettingsFileReference, SettingsOverrides]).optional(),
  layers: import_zod46.z.union([SettingsFileReference, SettingsLayers]).optional(),
  views: import_zod46.z.union([SettingsFileReference, SettingsViews]).optional()
}).strict();
var OctonodeSettingsValues = import_zod46.z.object({
  $schema: import_zod46.z.string().optional(),
  apiVersion: import_zod46.z.literal(SETTINGS_API_VERSION),
  plugin: PluginManifest.optional(),
  defaultView: identifier3.optional(),
  layout: SettingsLayout.optional(),
  discovery: SettingsDiscovery.optional(),
  appearance: SettingsAppearance.optional(),
  overrides: SettingsOverrides.optional(),
  layers: SettingsLayers.optional(),
  views: SettingsViews.optional()
}).strict();
var OctonodeSettings = OctonodeSettingsValues.superRefine((settings, ctx) => {
  if (settings.defaultView && !Object.hasOwn(settings.views ?? {}, settings.defaultView)) {
    ctx.addIssue({ code: "custom", path: ["defaultView"], message: `unknown view "${settings.defaultView}"` });
  }
  const ruleIds = /* @__PURE__ */ new Set();
  settings.appearance?.rules?.forEach((rule, index) => {
    if (ruleIds.has(rule.id))
      ctx.addIssue({
        code: "custom",
        path: ["appearance", "rules", index, "id"],
        message: "rule IDs must be unique"
      });
    ruleIds.add(rule.id);
  });
  for (const [viewId, view] of Object.entries(settings.views ?? {})) {
    for (const target of ["workflows", "canvas"]) {
      for (const action of ["include", "exclude"]) {
        view[target]?.[action]?.forEach((selector, index) => {
          selector.layersAny?.forEach((layerId, layerIndex) => {
            if (!Object.hasOwn(settings.layers ?? {}, layerId))
              ctx.addIssue({
                code: "custom",
                path: ["views", viewId, target, action, index, "layersAny", layerIndex],
                message: `unknown layer "${layerId}"`
              });
          });
        });
      }
    }
    view.canvas?.collapseLayers?.forEach((layerId, index) => {
      if (!Object.hasOwn(settings.layers ?? {}, layerId))
        ctx.addIssue({
          code: "custom",
          path: ["views", viewId, "canvas", "collapseLayers", index],
          message: `unknown layer "${layerId}"`
        });
    });
  }
});

// packages/schema/src/access/tokens.ts
var import_zod47 = require("zod");
var accessTokenListQuerySchema = import_zod47.z.object({
  type: import_zod47.z.enum(["personal", "service", "public"]).optional(),
  search: import_zod47.z.string().trim().max(200).default(""),
  sort: import_zod47.z.enum(["name", "createdAt", "lastUsedAt"]).default("createdAt"),
  order: import_zod47.z.enum(["asc", "desc"]).default("desc"),
  limit: import_zod47.z.coerce.number().int().min(1).max(100).default(25),
  offset: import_zod47.z.coerce.number().int().min(0).max(1e6).default(0)
});
var accessTokenOriginSchema = import_zod47.z.string().max(2048).refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.origin === value && !url.hostname.includes("*");
  } catch {
    return false;
  }
}, "Expected an exact HTTPS origin");
var accessTokenCreateSchema = import_zod47.z.object({
  name: import_zod47.z.string().trim().min(1).max(128),
  type: import_zod47.z.enum(["personal", "service", "public"]).default("personal"),
  workspaceId: import_zod47.z.string().regex(/^(user|org|team):[^:]+$/).max(256).optional(),
  scopes: import_zod47.z.array(import_zod47.z.enum(["*", ...WORKSPACE_ACTIONS])).min(1).max(WORKSPACE_ACTIONS.length).optional(),
  allowedOrigins: import_zod47.z.array(accessTokenOriginSchema).max(32).optional(),
  expiresAt: import_zod47.z.string().datetime().optional()
}).strict();
var accessTokenUpdateSchema = accessTokenCreateSchema.pick({ name: true, scopes: true, allowedOrigins: true }).partial().strict();

// packages/schema/src/access/constants.ts
var ACCESS_METERS = [
  "executions",
  "ai_credits",
  "apps",
  "api_tokens",
  "tasks",
  "data_rows",
  "storage_bytes",
  "remote_hosts",
  "concurrent_runs"
];
var ACCESS_USAGE_SORTS = ["name", "name_desc", "used_desc", "limit_asc"];
var ACCESS_USAGE_STATUSES = ["all", "at_limit", "below_limit", "unlimited", "unavailable"];
var ACCESS_USAGE_UNITS = ["all", "per_month", "resident", "bytes", "concurrent"];
var ACCESS_TOKEN_TYPES = ["personal", "service", "public", "agent", "assistant"];
var MAX_CREDENTIAL_LIFETIME_SECONDS = 31536e4;
var ACCESS_ENFORCED_METERS = [
  "executions",
  "ai_credits",
  "apps",
  "api_tokens",
  "remote_hosts",
  "tasks",
  "data_rows",
  "storage_bytes",
  "concurrent_runs"
];
var ACTION_FEATURE = {
  "knowledge:read": "knowledge",
  "projects:read": "projects",
  "projects:write": "projects",
  "workflows:run": "workflows",
  "data:read": "data",
  "data:write": "data",
  "tables:manage": "data",
  "members:invite": "members",
  "members:manage": "members",
  "teams:manage": "teams",
  "plugins:publish": "plugins",
  "plugins:install": "plugins",
  "org:settings": "administration",
  "social:read": "social",
  "social:write": "social",
  "social:moderate": "social",
  "tasks:read": "tasks",
  "tasks:write": "tasks",
  "tasks:manage": "tasks",
  "reviews:write": "reviews",
  "github:connect": "github",
  "github:publish": "github",
  "agents:manage": "agents",
  "billing:read": "billing",
  "billing:manage": "billing",
  "integrations:read": "integrations",
  "integrations:manage": "integrations",
  "design:read": "design",
  "design:review": "design",
  "previews:read": "previews",
  "previews:manage": "previews",
  "terminal:use": "terminal",
  "workflow-agents:run": "otto",
  "workflow-agents:manage": "otto",
  "agent-operations:read": "otto",
  "agent-operations:manage": "otto",
  "data:export": "data",
  "data:restore": "data",
  "workspace:delete": null,
  "content:read": "content",
  "content:write": "content",
  "content:publish": "content",
  "content:moderate": "content",
  "apps:read": "apps",
  "apps:use": "apps",
  "apps:manage": "apps",
  "tokens:create": "api_tokens",
  "tokens:use": "api_tokens",
  "tokens:delegate": "api_tokens",
  "tokens:manage": null,
  "policy:read": "administration",
  "policy:manage": "administration",
  "usage:read": "administration",
  "usage:manage": "administration",
  "remote:enroll": "remote",
  "remote:connect": "remote",
  "remote:execute": "remote",
  "remote:manage": null
};
var ACCESS_RUN_FEATURES = ["workflows", "otto", "remote", "terminal"];
var ACCESS_INSPECTION_RESOURCES = ["project", "table", "app", "task", "remote_host"];
var WORKSPACE_UI_CONTROLS = [
  "readProjects",
  "editProjects",
  "readWorkflows",
  "readPlugins",
  "runWorkflow",
  "readData",
  "editData",
  "readTasks",
  "runAssistant",
  "configureAssistant",
  "readChat",
  "moderateChat",
  "readDesignDocs",
  "publishPlugin",
  "installPlugin",
  "readApps",
  "useApps",
  "manageApps",
  "cleanupApps",
  "openAdmin",
  "readBilling",
  "searchWorkspace",
  "manageProjectKeys"
];
var ACCESS_FEATURE_ACTION_GROUP = {
  ...ACTION_FEATURE,
  "workspace:delete": "administration",
  "tokens:manage": "api_tokens",
  "remote:manage": "remote"
};
var ACCESS_CATALOG_SORTS = ["name", "name_desc"];
var ACCESS_TIER_BATCH_LIMIT = 20;

// packages/schema/src/access/policy.ts
var import_zod50 = require("zod");

// packages/schema/src/access/organization/rules/schema.ts
var import_zod48 = require("zod");
var organizationTierRulesSchema = import_zod48.z.object({
  teams: import_zod48.z.number().int().min(0).max(1e4).nullable(),
  membersPerTeam: import_zod48.z.number().int().min(0).max(1e4).nullable(),
  covers: import_zod48.z.array(import_zod48.z.object({ tier: import_zod48.z.string().min(1).max(80), version: import_zod48.z.number().int().positive() }).strict()).max(100).default([])
}).strict();

// packages/schema/src/access/catalog/schema.ts
var import_zod49 = require("zod");

// packages/schema/src/access/catalog/constants.ts
var FEATURE_LANGUAGES = ["en", "de", "es", "fr", "ja"];
var FEATURE_DIRECTORY_STATUSES = ["all", "draft", "published", "archived"];
var FEATURE_DIRECTORY_SORTS = ["name", "name_desc", "recent"];
var FEATURE_UI_SURFACES = [
  { id: "studio.home", label: "Home", actions: ["projects:read"] },
  { id: "studio.tasks", label: "Tasks", actions: ["tasks:read"] },
  { id: "studio.assistant", label: "Otto", actions: ["workflow-agents:run"] },
  { id: "studio.chat", label: "Chat", actions: ["social:read"] },
  { id: "studio.design-docs", label: "Design documents", actions: ["design:read"] },
  { id: "studio.data-tables", label: "Data tables", actions: ["data:read"] },
  { id: "studio.variables", label: "Variables", actions: ["data:read"] },
  { id: "studio.toolkits", label: "Toolkits", actions: ["projects:read"] },
  { id: "studio.marketplace", label: "Marketplace", actions: ["projects:read"] },
  { id: "studio.runs", label: "Run history", actions: ["projects:read"] }
];

// packages/schema/src/access/catalog/schema.ts
var featureIdSchema = import_zod49.z.string().min(1).max(80).regex(/^[a-z][a-z0-9_]*$/);
var featureTextSchema = import_zod49.z.object({ name: import_zod49.z.string().trim().max(100), description: import_zod49.z.string().trim().max(1e3).default("") }).strict();
var featureDefinitionSchema = import_zod49.z.object({
  labels: import_zod49.z.object({
    en: featureTextSchema,
    de: featureTextSchema,
    es: featureTextSchema,
    fr: featureTextSchema,
    ja: featureTextSchema
  }).strict(),
  actions: import_zod49.z.array(import_zod49.z.enum(WORKSPACE_ACTIONS)).max(WORKSPACE_ACTIONS.length),
  meters: import_zod49.z.array(import_zod49.z.enum(ACCESS_METERS)).max(ACCESS_METERS.length),
  surfaces: import_zod49.z.array(
    import_zod49.z.string().max(100).refine((id2) => FEATURE_UI_SURFACES.some((surface) => surface.id === id2), "Unknown UI surface")
  ).max(FEATURE_UI_SURFACES.length)
}).strict().superRefine((value, ctx) => {
  if (!FEATURE_LANGUAGES.some((language) => value.labels[language].name.trim()))
    ctx.addIssue({ code: "custom", path: ["labels"], message: "Add at least one feature name" });
  for (const key of ["actions", "meters", "surfaces"])
    if (new Set(value[key]).size !== value[key].length)
      ctx.addIssue({ code: "custom", path: [key], message: "Duplicate connection" });
});
var featureWriteSchema = import_zod49.z.object({
  id: featureIdSchema,
  revision: import_zod49.z.number().int().nonnegative(),
  definition: featureDefinitionSchema,
  operation: import_zod49.z.enum(["save", "publish", "archive"]),
  reason: import_zod49.z.string().trim().min(3).max(1e3)
}).strict();
var featureRecordSchema = import_zod49.z.object({
  id: featureIdSchema,
  revision: import_zod49.z.number().int().positive(),
  definition: featureDefinitionSchema,
  published: featureDefinitionSchema.nullable(),
  archived: import_zod49.z.boolean(),
  reason: import_zod49.z.string(),
  updatedBy: import_zod49.z.string(),
  updatedAt: import_zod49.z.number(),
  publishedAt: import_zod49.z.number().nullable()
});
var featureDirectoryQuerySchema = import_zod49.z.object({
  search: import_zod49.z.string().trim().max(100).default(""),
  locale: import_zod49.z.enum(FEATURE_LANGUAGES).default("en"),
  sort: import_zod49.z.enum(FEATURE_DIRECTORY_SORTS).default("name"),
  status: import_zod49.z.enum(FEATURE_DIRECTORY_STATUSES).default("all"),
  connection: import_zod49.z.enum(["all", "connected", "empty"]).default("all"),
  offset: import_zod49.z.coerce.number().int().min(0).max(1e6).default(0),
  limit: import_zod49.z.coerce.number().int().min(1).max(100).default(25)
});
var featureDirectorySchema = import_zod49.z.object({
  items: import_zod49.z.array(featureRecordSchema),
  total: import_zod49.z.number().int().nonnegative(),
  offset: import_zod49.z.number(),
  limit: import_zod49.z.number()
});
var featurePublicationPreviewSchema = import_zod49.z.object({
  ready: import_zod49.z.boolean(),
  issues: import_zod49.z.array(import_zod49.z.string()),
  changedActions: import_zod49.z.array(import_zod49.z.enum(WORKSPACE_ACTIONS)),
  affectedPolicies: import_zod49.z.number().int().nonnegative(),
  affectedOffers: import_zod49.z.number().int().nonnegative(),
  surfaces: import_zod49.z.array(import_zod49.z.string()),
  definition: featureDefinitionSchema
});
var featureCapabilityQuerySchema = featureDirectoryQuerySchema.pick({ search: true, locale: true, sort: true, offset: true, limit: true }).extend({
  kind: import_zod49.z.enum(["actions", "surfaces"]).default("actions"),
  availability: import_zod49.z.enum(["all", "available", "assigned"]).default("all"),
  featureId: featureIdSchema.optional()
});
var featureCapabilitySchema = import_zod49.z.object({
  id: import_zod49.z.string(),
  name: import_zod49.z.string(),
  actions: import_zod49.z.array(import_zod49.z.enum(WORKSPACE_ACTIONS)),
  featureId: featureIdSchema.nullable(),
  protected: import_zod49.z.boolean(),
  recovery: import_zod49.z.boolean()
});
var featureCapabilityListSchema = import_zod49.z.object({
  items: import_zod49.z.array(featureCapabilitySchema),
  total: import_zod49.z.number().int().nonnegative(),
  offset: import_zod49.z.number(),
  limit: import_zod49.z.number()
});
var featureHistoryQuerySchema = import_zod49.z.object({
  before: import_zod49.z.coerce.number().int().positive().default(Number.MAX_SAFE_INTEGER),
  limit: import_zod49.z.coerce.number().int().min(1).max(100).default(10)
});
var featureHistorySchema = import_zod49.z.object({
  items: import_zod49.z.array(featureRecordSchema),
  nextCursor: import_zod49.z.number().nullable()
});

// packages/schema/src/access/policy.ts
var accessFeatureSchema = featureIdSchema;
var accessMeterSchema = import_zod50.z.enum(ACCESS_METERS);
var accessLimitSchema = import_zod50.z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).nullable();
var accessLimitsSchema = import_zod50.z.object({
  executions: accessLimitSchema.optional(),
  ai_credits: accessLimitSchema.optional(),
  apps: accessLimitSchema.optional(),
  api_tokens: accessLimitSchema.optional(),
  tasks: accessLimitSchema.optional(),
  data_rows: accessLimitSchema.optional(),
  storage_bytes: accessLimitSchema.optional(),
  remote_hosts: accessLimitSchema.optional(),
  concurrent_runs: accessLimitSchema.optional()
}).strict().superRefine((limits, ctx) => {
  for (const meter of ACCESS_METERS)
    if (typeof limits[meter] === "number" && !ACCESS_ENFORCED_METERS.includes(meter))
      ctx.addIssue({ code: "custom", path: [meter], message: "This meter is not available for hard limits yet" });
});
var credentialPolicySchema = import_zod50.z.object({
  deniedTypes: import_zod50.z.array(import_zod50.z.enum(ACCESS_TOKEN_TYPES)).max(ACCESS_TOKEN_TYPES.length).default([]),
  deniedScopes: import_zod50.z.array(import_zod50.z.enum(WORKSPACE_ACTIONS)).max(WORKSPACE_ACTIONS.length).default([]),
  maxLifetimeSeconds: import_zod50.z.number().int().positive().max(MAX_CREDENTIAL_LIFETIME_SECONDS).nullable().default(null)
}).strict();
var accessPolicySchema = import_zod50.z.object({
  organization: organizationTierRulesSchema.optional(),
  deniedFeatures: import_zod50.z.array(accessFeatureSchema).max(1e3).default([]),
  deniedActions: import_zod50.z.array(import_zod50.z.enum(WORKSPACE_ACTIONS)).max(WORKSPACE_ACTIONS.length).default([]),
  limits: accessLimitsSchema.default({}),
  credentials: credentialPolicySchema.default({})
}).strict();
var accessTierIdSchema = import_zod50.z.string().regex(/^[a-z][a-z0-9_]{0,79}$/);
var accessProfileSchema = import_zod50.z.object({
  version: import_zod50.z.literal(1),
  tier: accessTierIdSchema,
  tierVersion: import_zod50.z.number().int().positive().optional(),
  policy: accessPolicySchema
}).strict();
var accessPolicyTargetSchema = import_zod50.z.object({
  kind: import_zod50.z.enum(["platform", "tier", "user", "org", "team"]),
  id: import_zod50.z.string().min(1).max(128),
  memberId: import_zod50.z.string().min(1).max(128).nullable().default(null)
}).strict().superRefine((target, ctx) => {
  if (target.kind === "platform" && (target.id !== "platform" || target.memberId))
    ctx.addIssue({ code: "custom", message: "Platform policies have a single platform target" });
  if (target.kind === "tier" && (!accessTierIdSchema.safeParse(target.id).success || target.memberId))
    ctx.addIssue({ code: "custom", message: "Tier policies require a valid tier ID and no member" });
  if (target.kind === "user" && target.memberId)
    ctx.addIssue({ code: "custom", message: "Personal policies cannot target another member" });
});
var accessPolicyWriteSchema = import_zod50.z.object({
  target: accessPolicyTargetSchema,
  revision: import_zod50.z.number().int().nonnegative(),
  policy: accessPolicySchema,
  reason: import_zod50.z.string().trim().min(3).max(1e3)
}).strict();
var accessPolicyRecordSchema = accessPolicyWriteSchema.extend({
  updatedBy: import_zod50.z.string(),
  updatedAt: import_zod50.z.number().int().nonnegative()
});
var accessPolicyHeadBaseSchema = accessPolicyRecordSchema.extend({
  tierRules: accessPolicySchema.optional(),
  tierName: import_zod50.z.string().optional(),
  canManage: import_zod50.z.boolean(),
  canManageCredentials: import_zod50.z.boolean(),
  canReadUsage: import_zod50.z.boolean(),
  canManageUsage: import_zod50.z.boolean()
});
var accessPolicyHeadSchema = import_zod50.z.union([
  accessPolicyHeadBaseSchema.extend({ revision: import_zod50.z.number().int().positive() }),
  accessPolicyHeadBaseSchema.extend({
    revision: import_zod50.z.literal(0),
    reason: import_zod50.z.literal(""),
    updatedBy: import_zod50.z.literal(""),
    updatedAt: import_zod50.z.literal(0)
  })
]);
var accessReasonSchema = import_zod50.z.enum([
  "allowed",
  "role_denied",
  "plan_denied",
  "policy_denied",
  "credential_denied",
  "resource_denied",
  "not_released"
]);
var accessDecisionSchema = import_zod50.z.object({
  action: import_zod50.z.enum(WORKSPACE_ACTIONS),
  allowed: import_zod50.z.boolean(),
  reason: accessReasonSchema,
  source: import_zod50.z.string().nullable()
});
var effectiveAccessSchema = import_zod50.z.object({
  uiBindings: import_zod50.z.record(import_zod50.z.boolean()).optional(),
  workspace: import_zod50.z.object({ kind: import_zod50.z.enum(["user", "org", "team"]), id: import_zod50.z.string() }),
  tier: accessTierIdSchema,
  tierVersion: import_zod50.z.number().int().positive().optional(),
  fundingWorkspace: import_zod50.z.object({ kind: import_zod50.z.enum(["user", "org", "team"]), id: import_zod50.z.string() }),
  decisions: import_zod50.z.array(accessDecisionSchema),
  deniedFeatures: import_zod50.z.array(accessFeatureSchema).default([]),
  limits: accessLimitsSchema,
  credentials: credentialPolicySchema,
  revisions: import_zod50.z.array(import_zod50.z.object({ source: import_zod50.z.string(), revision: import_zod50.z.number().int().nonnegative() }))
});
var accessPolicyQuerySchema = import_zod50.z.object({
  kind: import_zod50.z.enum(["platform", "tier", "user", "org", "team"]),
  id: import_zod50.z.string().min(1).max(128),
  memberId: import_zod50.z.string().min(1).max(128).optional(),
  before: import_zod50.z.coerce.number().int().positive().default(Number.MAX_SAFE_INTEGER),
  limit: import_zod50.z.coerce.number().int().min(1).max(100).default(25)
});
var accessUsageQuerySchema = accessPolicyQuerySchema.extend({
  search: import_zod50.z.string().trim().max(100).default(""),
  locale: import_zod50.z.enum(["en", "de", "es", "fr", "ja"]).default("en"),
  sort: import_zod50.z.enum(ACCESS_USAGE_SORTS).default("name"),
  status: import_zod50.z.enum(ACCESS_USAGE_STATUSES).default("all"),
  unit: import_zod50.z.enum(ACCESS_USAGE_UNITS).default("all"),
  offset: import_zod50.z.coerce.number().int().min(0).max(1e6).default(0),
  meters: import_zod50.z.string().max(256).refine(
    (value) => !value || value.split(",").every((key) => accessMeterSchema.safeParse(key).success),
    "Unknown usage meter"
  ).describe("Comma-separated usage meter keys. Omit for all meters; an empty string selects none.").optional()
});
var accessEffectiveQuerySchema = import_zod50.z.object({
  workspace: import_zod50.z.string().regex(/^(user|org|team):[^:]+$/).max(256)
});
var workspaceNavigationQuerySchema = import_zod50.z.object({
  projection: import_zod50.z.literal("compact").optional(),
  workspace: accessEffectiveQuerySchema.shape.workspace.optional()
});
var workspaceUiControlSchema = import_zod50.z.enum(WORKSPACE_UI_CONTROLS);
var workspaceMenuControlsSchema = import_zod50.z.object({
  createTeam: import_zod50.z.boolean(),
  invite: import_zod50.z.boolean(),
  editPermissions: import_zod50.z.boolean()
});
var workspaceUiAccessSchema = import_zod50.z.object({
  version: import_zod50.z.literal(2),
  workspace: effectiveAccessSchema.shape.workspace,
  uiBindings: import_zod50.z.record(import_zod50.z.boolean()),
  controls: import_zod50.z.record(workspaceUiControlSchema, import_zod50.z.boolean())
}).strict();
var accessCredentialRefSchema = import_zod50.z.object({ store: import_zod50.z.enum(["api", "agent"]), id: import_zod50.z.string().min(1).max(128) }).strict();
var accessInspectionSchema = import_zod50.z.object({
  workspace: import_zod50.z.object({ kind: import_zod50.z.enum(["user", "org", "team"]), id: import_zod50.z.string().min(1).max(128) }),
  userId: import_zod50.z.string().min(1).max(128),
  draft: accessPolicyWriteSchema.optional(),
  credential: accessCredentialRefSchema.optional(),
  projectId: import_zod50.z.string().min(1).max(128).optional(),
  resource: import_zod50.z.object({ kind: import_zod50.z.enum(ACCESS_INSPECTION_RESOURCES), id: import_zod50.z.string().min(1).max(128) }).strict().optional()
}).strict();
var accessInspectionResultSchema = import_zod50.z.object({
  sourceNames: import_zod50.z.record(import_zod50.z.string()).optional(),
  current: effectiveAccessSchema,
  proposed: effectiveAccessSchema,
  changedActions: import_zod50.z.array(import_zod50.z.enum(WORKSPACE_ACTIONS)),
  changedFeatures: import_zod50.z.array(accessFeatureSchema).default([]),
  changedLimits: import_zod50.z.array(accessMeterSchema).default([]),
  credentialsChanged: import_zod50.z.boolean().default(false),
  resource: import_zod50.z.object({
    kind: import_zod50.z.enum(ACCESS_INSPECTION_RESOURCES),
    id: import_zod50.z.string(),
    projectId: import_zod50.z.string().nullable(),
    deniedActions: import_zod50.z.array(import_zod50.z.enum(WORKSPACE_ACTIONS)).default([])
  }).nullable().default(null)
});
var accessImpactSchema = accessInspectionSchema.omit({ userId: true, credential: true }).extend({
  draft: accessPolicyWriteSchema,
  cursor: import_zod50.z.string().max(500).optional(),
  limit: import_zod50.z.number().int().min(1).max(25).default(10)
});
var accessImpactResultSchema = import_zod50.z.object({
  items: import_zod50.z.array(
    import_zod50.z.object({
      workspace: accessInspectionSchema.shape.workspace,
      userId: import_zod50.z.string(),
      userName: import_zod50.z.string(),
      workspaceName: import_zod50.z.string(),
      changedActions: import_zod50.z.array(import_zod50.z.enum(WORKSPACE_ACTIONS)),
      changedFeatures: import_zod50.z.array(accessFeatureSchema),
      changedLimits: import_zod50.z.array(accessMeterSchema),
      credentialsChanged: import_zod50.z.boolean()
    })
  ),
  scanned: import_zod50.z.number().int().nonnegative(),
  nextCursor: import_zod50.z.string().nullable()
});
var accessPolicyHistorySchema = import_zod50.z.object({
  items: import_zod50.z.array(accessPolicyRecordSchema),
  nextCursor: import_zod50.z.number().nullable()
});
var accessCatalogQuerySchema = import_zod50.z.object({
  selected: import_zod50.z.string().max(5e3).default("").refine(
    (value) => !value || value.split(",").every((key) => WORKSPACE_ACTIONS.some((action) => action === key)),
    "Unknown selected action"
  ),
  actionState: import_zod50.z.enum(["all", "selected", "unselected"]).default("all"),
  search: import_zod50.z.string().trim().max(100).default(""),
  locale: import_zod50.z.enum(["en", "de", "es", "fr", "ja"]).default("en"),
  sort: import_zod50.z.enum(ACCESS_CATALOG_SORTS).default("name"),
  feature: accessFeatureSchema.optional(),
  workspaceOnly: import_zod50.z.enum(["true", "false"]).default("false"),
  offset: import_zod50.z.coerce.number().int().min(0).max(1e6).default(0),
  limit: import_zod50.z.coerce.number().int().min(1).max(100).default(100)
});
var accessCatalogSchema = import_zod50.z.object({
  revision: import_zod50.z.number().int().nonnegative().default(0),
  actionFeatures: import_zod50.z.record(import_zod50.z.string().nullable()).default({}),
  entries: import_zod50.z.array(
    import_zod50.z.object({
      id: accessFeatureSchema,
      name: import_zod50.z.string(),
      description: import_zod50.z.string(),
      actions: import_zod50.z.array(import_zod50.z.enum(WORKSPACE_ACTIONS)),
      matchingActions: import_zod50.z.array(import_zod50.z.enum(WORKSPACE_ACTIONS)),
      meters: import_zod50.z.array(accessMeterSchema),
      actionNames: import_zod50.z.record(import_zod50.z.string()),
      recoveryActions: import_zod50.z.array(import_zod50.z.enum(WORKSPACE_ACTIONS))
    })
  ).default([]),
  featureNames: import_zod50.z.record(import_zod50.z.string()).default({}),
  totalFeatures: import_zod50.z.number().int().nonnegative(),
  matchingActions: import_zod50.z.array(import_zod50.z.enum(WORKSPACE_ACTIONS)),
  filterFeatures: import_zod50.z.array(accessFeatureSchema),
  features: import_zod50.z.array(accessFeatureSchema),
  actions: import_zod50.z.array(import_zod50.z.enum(WORKSPACE_ACTIONS)),
  meters: import_zod50.z.array(
    import_zod50.z.object({
      key: accessMeterSchema,
      unit: import_zod50.z.enum(["per_month", "resident", "bytes", "concurrent"]),
      enforced: import_zod50.z.boolean()
    })
  ),
  tokenTypes: import_zod50.z.array(import_zod50.z.enum(ACCESS_TOKEN_TYPES)),
  templates: import_zod50.z.array(accessProfileSchema)
});
var accessScopesQuerySchema = import_zod50.z.object({
  sort: import_zod50.z.enum(["id", "name", "name_desc"]).default("id"),
  view: import_zod50.z.enum(["all", "workspaces", "users"]).default("all"),
  policyState: import_zod50.z.enum(["all", "configured", "inherited"]).default("all"),
  offset: import_zod50.z.coerce.number().int().min(0).max(1e6).default(0),
  kind: import_zod50.z.enum(["platform", "user", "org", "team"]),
  id: import_zod50.z.string().min(1).max(128),
  memberId: import_zod50.z.string().min(1).max(128).optional(),
  search: import_zod50.z.string().max(100).default(""),
  cursor: import_zod50.z.string().max(400).optional(),
  limit: import_zod50.z.coerce.number().int().min(1).max(100).default(25)
});
var accessScopesSchema = import_zod50.z.object({
  total: import_zod50.z.number().int().nonnegative().default(0),
  items: import_zod50.z.array(
    import_zod50.z.object({
      target: accessPolicyTargetSchema,
      name: import_zod50.z.string(),
      role: import_zod50.z.string().nullable(),
      tierName: import_zod50.z.string().nullable().optional(),
      organizationId: import_zod50.z.string().nullable().default(null),
      organizationName: import_zod50.z.string().nullable().default(null),
      email: import_zod50.z.string().nullable().optional()
    })
  ),
  nextCursor: import_zod50.z.string().nullable()
});
var accessUsageSchema = import_zod50.z.object({
  total: import_zod50.z.number().int().nonnegative(),
  sourceNames: import_zod50.z.record(import_zod50.z.string()).optional(),
  target: accessPolicyTargetSchema,
  periodStart: import_zod50.z.number(),
  periodEnd: import_zod50.z.number(),
  meters: import_zod50.z.array(
    import_zod50.z.object({
      key: accessMeterSchema,
      used: import_zod50.z.number().nonnegative().nullable(),
      limit: accessLimitSchema,
      source: import_zod50.z.string(),
      unit: import_zod50.z.enum(["per_month", "resident", "bytes", "concurrent"])
    })
  )
});
var accessCredentialsQuerySchema = accessScopesQuerySchema.omit({ view: true, sort: true, policyState: true }).extend({
  sort: import_zod50.z.enum(["id", "name", "recent", "oldest"]).default("id"),
  memberId: import_zod50.z.string().min(1).max(128).optional(),
  type: import_zod50.z.enum(ACCESS_TOKEN_TYPES).optional(),
  status: import_zod50.z.enum(["active", "expired", "revoked", "all"]).default("active")
});
var accessCredentialSchema = accessCredentialRefSchema.extend({
  ownerName: import_zod50.z.string(),
  workspaceName: import_zod50.z.string(),
  projectName: import_zod50.z.string().nullable(),
  ownerId: import_zod50.z.string(),
  name: import_zod50.z.string(),
  type: import_zod50.z.enum(ACCESS_TOKEN_TYPES),
  prefix: import_zod50.z.string(),
  workspace: import_zod50.z.string(),
  projectId: import_zod50.z.string().nullable(),
  scopes: import_zod50.z.array(import_zod50.z.string()),
  createdAt: import_zod50.z.number(),
  expiresAt: import_zod50.z.number().nullable(),
  lastUsedAt: import_zod50.z.number().nullable(),
  revokedAt: import_zod50.z.number().nullable()
});
var accessCredentialsSchema = import_zod50.z.object({
  total: import_zod50.z.number().int().nonnegative().optional(),
  items: import_zod50.z.array(accessCredentialSchema),
  nextCursor: import_zod50.z.string().nullable()
});
var accessCredentialRevokeSchema = accessCredentialRefSchema.extend({ reason: import_zod50.z.string().trim().min(3).max(1e3) }).strict();
var adminWorkspaceCreateSchema = import_zod50.z.object({
  name: import_zod50.z.string().trim().min(1).max(120),
  leadUserId: import_zod50.z.string().min(1).max(128)
}).strict();
var adminWorkspaceConnectionSchema = import_zod50.z.object({
  orgId: import_zod50.z.string().min(1).max(128),
  teamId: import_zod50.z.string().min(1).max(128).optional()
}).strict();
var featurePreviewRequestSchema = featureWriteSchema.extend({
  inspection: accessInspectionSchema.omit({ draft: true }).optional()
});
var featurePreviewResultSchema = featurePublicationPreviewSchema.extend({
  inspection: accessInspectionResultSchema.nullable().default(null)
});
var accessCatalogSelectionSchema = import_zod50.z.object({
  revision: import_zod50.z.number().int().nonnegative(),
  actions: import_zod50.z.array(import_zod50.z.enum(WORKSPACE_ACTIONS)).max(WORKSPACE_ACTIONS.length)
}).strict();
var accessTierSchema = import_zod50.z.object({
  id: accessTierIdSchema,
  name: import_zod50.z.string().trim().min(1).max(120),
  revision: import_zod50.z.number().int().positive(),
  currentVersion: import_zod50.z.number().int().positive().nullable(),
  draftRevision: import_zod50.z.number().int().positive(),
  publishedPolicyRevision: import_zod50.z.number().int().positive().nullable(),
  archived: import_zod50.z.boolean(),
  isDefault: import_zod50.z.boolean(),
  defaultVersion: import_zod50.z.number().int().positive().nullable(),
  deprecatesAt: import_zod50.z.number().int().nonnegative().nullable(),
  updatedAt: import_zod50.z.number().int().nonnegative()
});
var accessTierVersionSchema = import_zod50.z.object({
  tier: accessTierIdSchema,
  version: import_zod50.z.number().int().positive(),
  policyRevision: import_zod50.z.number().int().positive(),
  policy: accessPolicySchema,
  digest: import_zod50.z.string(),
  publishedAt: import_zod50.z.number().int().nonnegative(),
  publishedBy: import_zod50.z.string(),
  deprecatesAt: import_zod50.z.number().int().nonnegative().nullable(),
  status: import_zod50.z.enum(["active", "legacy", "deprecated"])
});
var accessTierQuerySchema = import_zod50.z.object({
  search: import_zod50.z.string().trim().max(100).default(""),
  sort: import_zod50.z.enum(["name", "name_desc"]).default("name"),
  status: import_zod50.z.enum(["all", "active", "archived", "selectable"]).default("active"),
  id: accessTierIdSchema.optional(),
  offset: import_zod50.z.coerce.number().int().min(0).max(1e6).default(0),
  limit: import_zod50.z.coerce.number().int().min(1).max(100).default(25)
});
var accessTierVersionQuerySchema = import_zod50.z.object({
  before: import_zod50.z.coerce.number().int().positive().default(Number.MAX_SAFE_INTEGER),
  limit: import_zod50.z.coerce.number().int().min(1).max(100).default(25)
});
var accessTierPathSchema = import_zod50.z.object({ id: accessTierIdSchema });
var accessTiersSchema = import_zod50.z.object({
  generation: import_zod50.z.number().int().nonnegative(),
  validUntil: import_zod50.z.number().int().nonnegative().nullable().optional(),
  items: import_zod50.z.array(accessTierSchema),
  total: import_zod50.z.number().int().nonnegative()
});
var accessTierDetailSchema = import_zod50.z.object({
  validUntil: import_zod50.z.number().int().nonnegative().nullable().optional(),
  tier: accessTierSchema,
  draft: accessPolicyRecordSchema,
  versions: import_zod50.z.array(accessTierVersionSchema),
  nextVersion: import_zod50.z.number().nullable()
});
var tierWriteBase = import_zod50.z.object({
  id: accessTierIdSchema,
  revision: import_zod50.z.number().int().nonnegative(),
  reason: import_zod50.z.string().trim().min(3).max(1e3)
});
var accessTierWriteSchema = import_zod50.z.discriminatedUnion("operation", [
  tierWriteBase.extend({ operation: import_zod50.z.literal("create"), name: accessTierSchema.shape.name, policy: accessPolicySchema }).strict(),
  tierWriteBase.extend({ operation: import_zod50.z.literal("rename"), name: accessTierSchema.shape.name }).strict(),
  tierWriteBase.extend({ operation: import_zod50.z.literal("publish"), policyRevision: import_zod50.z.number().int().positive() }).strict(),
  tierWriteBase.extend({ operation: import_zod50.z.literal("default"), version: import_zod50.z.number().int().positive() }).strict(),
  tierWriteBase.extend({
    operation: import_zod50.z.literal("deprecate"),
    version: import_zod50.z.number().int().positive(),
    deprecatesAt: import_zod50.z.number().int().nonnegative().nullable()
  }).strict(),
  tierWriteBase.extend({ operation: import_zod50.z.literal("archive") }).strict()
]);
var accessTierHistorySchema = import_zod50.z.object({
  items: import_zod50.z.array(
    import_zod50.z.object({
      revision: import_zod50.z.number().int().positive(),
      operation: import_zod50.z.string(),
      reason: import_zod50.z.string(),
      actor: import_zod50.z.string(),
      at: import_zod50.z.number(),
      change: import_zod50.z.string()
    })
  ),
  nextCursor: import_zod50.z.number().nullable()
});
var userTierRefSchema = import_zod50.z.object({ tier: accessTierIdSchema, version: import_zod50.z.number().int().positive() }).strict();
var userTierWriteSchema = import_zod50.z.object({
  revision: import_zod50.z.number().int().nonnegative(),
  assignment: userTierRefSchema.nullable(),
  reason: import_zod50.z.string().trim().min(3).max(1e3)
}).strict();
var userTierSchema = import_zod50.z.object({
  userId: import_zod50.z.string(),
  revision: import_zod50.z.number().int().nonnegative(),
  assignment: userTierRefSchema.nullable(),
  effective: userTierRefSchema.extend({ name: import_zod50.z.string() }),
  reason: import_zod50.z.string(),
  updatedBy: import_zod50.z.string(),
  updatedAt: import_zod50.z.number().int().nonnegative()
});
var workspaceTierSchema = userTierSchema.omit({ userId: true }).extend({
  seatModel: import_zod50.z.boolean().default(false),
  workspace: import_zod50.z.object({ kind: import_zod50.z.enum(["org", "team"]), id: import_zod50.z.string().min(1).max(128) }),
  inheritedFrom: import_zod50.z.object({ kind: import_zod50.z.literal("org"), id: import_zod50.z.string() }).nullable()
});
var organizationTierTargetsSchema = import_zod50.z.object({
  total: import_zod50.z.number().int().nonnegative(),
  items: import_zod50.z.array(import_zod50.z.object({ id: import_zod50.z.string(), name: import_zod50.z.string(), revision: import_zod50.z.number().int().nonnegative() }))
});
var organizationTierWriteSchema = userTierWriteSchema.omit({ revision: true }).extend({
  targets: import_zod50.z.array(import_zod50.z.object({ id: import_zod50.z.string().min(1).max(128), revision: import_zod50.z.number().int().nonnegative() })).min(1).max(ACCESS_TIER_BATCH_LIMIT).refine((items) => new Set(items.map((item) => item.id)).size === items.length, "Duplicate tier targets")
});
var organizationTierResultSchema = import_zod50.z.object({
  items: import_zod50.z.array(import_zod50.z.object({ id: import_zod50.z.string(), error: import_zod50.z.string().nullable() }))
});
var organizationTierIdsSchema = import_zod50.z.array(import_zod50.z.string().min(1).max(128)).min(1).max(ACCESS_TIER_BATCH_LIMIT);
var organizationTierTargetsQuerySchema = import_zod50.z.object({ ids: import_zod50.z.string().max(3e4).optional() });

// packages/schema/src/access/capacity.ts
var import_zod51 = require("zod");
var capacityQuantitiesSchema = import_zod51.z.object({
  tasks: import_zod51.z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).default(0),
  data_rows: import_zod51.z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).default(0),
  storage_bytes: import_zod51.z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).default(0),
  concurrent_runs: import_zod51.z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).default(0)
}).strict();
var capacityUsageSchema = import_zod51.z.record(import_zod51.z.string().max(128), capacityQuantitiesSchema);
var capacityOwnerSchema = import_zod51.z.object({
  id: import_zod51.z.string().min(1).max(256),
  workspace: import_zod51.z.object({ kind: import_zod51.z.enum(["user", "org", "team"]), id: import_zod51.z.string().min(1).max(128) }),
  category: import_zod51.z.enum(["tasks", "tables", "attachments", "runs"]),
  revision: import_zod51.z.number().int().nonnegative(),
  usage: capacityUsageSchema
}).strict();
var capacityClaimSchema = import_zod51.z.object({
  owner: capacityOwnerSchema,
  projectId: import_zod51.z.string().min(1).max(128).optional(),
  operationId: import_zod51.z.string().uuid(),
  proposed: capacityUsageSchema
}).strict();
var capacityPrincipalSchema = import_zod51.z.discriminatedUnion("kind", [
  import_zod51.z.object({ kind: import_zod51.z.literal("user"), userId: import_zod51.z.string().min(1).max(128), apiTokenId: import_zod51.z.string().max(128).optional() }),
  import_zod51.z.object({
    kind: import_zod51.z.literal("agent"),
    agentId: import_zod51.z.string().min(1).max(128),
    apiTokenOwnerId: import_zod51.z.string().max(128).optional(),
    workspace: workspaceRefSchema,
    projectId: import_zod51.z.string().max(128).nullable(),
    scopes: import_zod51.z.array(agentScopeSchema).max(WORKSPACE_ACTIONS.length)
  })
]);
var capacityRequestSchema = import_zod51.z.discriminatedUnion("operation", [
  import_zod51.z.object({ operation: import_zod51.z.literal("recover"), owner: capacityOwnerSchema }).strict(),
  import_zod51.z.object({
    operation: import_zod51.z.literal("replace"),
    operationId: import_zod51.z.string().uuid(),
    owners: import_zod51.z.array(capacityOwnerSchema).min(1).max(4),
    principal: capacityPrincipalSchema.optional(),
    projectId: import_zod51.z.string().max(128).optional()
  }).strict(),
  import_zod51.z.object({ operation: import_zod51.z.literal("register"), owner: capacityOwnerSchema }).strict(),
  import_zod51.z.object({
    operation: import_zod51.z.literal("reserve"),
    principal: capacityPrincipalSchema,
    action: import_zod51.z.enum(WORKSPACE_ACTIONS),
    claim: capacityClaimSchema
  }).strict(),
  import_zod51.z.object({ operation: import_zod51.z.literal("reduce"), claim: capacityClaimSchema }).strict(),
  import_zod51.z.object({
    operation: import_zod51.z.literal("settle"),
    owner: capacityOwnerSchema,
    operationId: import_zod51.z.string().uuid(),
    committed: import_zod51.z.boolean()
  }).strict(),
  import_zod51.z.object({
    operation: import_zod51.z.literal("check"),
    principal: capacityPrincipalSchema,
    workspace: workspaceRefSchema,
    projectId: import_zod51.z.string().min(1).max(128).optional(),
    action: import_zod51.z.enum(WORKSPACE_ACTIONS),
    epoch: import_zod51.z.number().int().nonnegative()
  }).strict()
]);
var capacityResponseSchema = import_zod51.z.object({
  owner: capacityOwnerSchema.optional(),
  epoch: import_zod51.z.number().int().nonnegative().optional(),
  status: import_zod51.z.enum(["reserved", "settled"]).optional(),
  revisions: import_zod51.z.record(import_zod51.z.string(), import_zod51.z.number().int().nonnegative()).optional()
});
var accessRunReservationSchema = import_zod51.z.object({
  workspace: workspaceRefSchema,
  feature: import_zod51.z.enum(ACCESS_RUN_FEATURES),
  id: import_zod51.z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/),
  projectId: import_zod51.z.string().min(1).max(128).optional()
}).strict();

// packages/schema/src/plugin/allowlist.ts
var import_zod52 = require("zod");
var PluginAllowlistKind = import_zod52.z.enum(["org", "team", "user"]);
var PluginAllowlistQuery = import_zod52.z.object({
  kind: PluginAllowlistKind,
  q: import_zod52.z.string().trim().max(200).default(""),
  status: import_zod52.z.enum(["allowed", "available", "all"]).default("allowed"),
  sort: import_zod52.z.enum(["name", "id"]).default("name"),
  direction: import_zod52.z.enum(["asc", "desc"]).default("asc"),
  offset: import_zod52.z.coerce.number().int().min(0).max(1e6).default(0),
  limit: import_zod52.z.coerce.number().int().min(1).max(100).default(25)
});
var PluginAllowlistInput = import_zod52.z.object({
  kind: PluginAllowlistKind,
  id: import_zod52.z.string().min(1).max(200)
}).strict();
var PluginAllowlistPage = import_zod52.z.object({
  items: import_zod52.z.array(
    import_zod52.z.object({
      id: import_zod52.z.string(),
      name: import_zod52.z.string(),
      allowed: import_zod52.z.boolean(),
      inherited: import_zod52.z.boolean(),
      eligible: import_zod52.z.boolean()
    })
  ),
  total: import_zod52.z.number(),
  offset: import_zod52.z.number(),
  limit: import_zod52.z.number(),
  canAdd: import_zod52.z.boolean()
});

// packages/schema/src/plugin/execution.constants.ts
var PLUGIN_EXECUTION_MAX_BYTES = 1024 * 1024;
var PLUGIN_EXECUTION_TIMEOUT_MS = 5 * 6e4;
var PREPARED_RUNTIME_MAX_BYTES = 256 * 1024 * 1024;
var PREPARED_RUNTIME_ARCHIVE = "octonode-runtime.tgz";

// packages/schema/src/plugin/execution.ts
var import_zod53 = require("zod");
var PreparedPluginRuntime = import_zod53.z.object({
  format: import_zod53.z.literal(1),
  nodeMajor: import_zod53.z.literal(24),
  platform: import_zod53.z.enum(["portable", "linux", "darwin"]),
  arch: import_zod53.z.string().max(32).optional(),
  libc: import_zod53.z.string().max(64).optional(),
  dependencies: import_zod53.z.literal(PREPARED_RUNTIME_ARCHIVE).optional()
}).strict();
var PluginExecutionReference = import_zod53.z.object({
  installId: import_zod53.z.string().uuid(),
  sha256: import_zod53.z.string().regex(/^sha256:[a-f0-9]{64}$/),
  nodeId: import_zod53.z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i)
}).strict();
var PluginExecutionRequest = import_zod53.z.object({
  plugin: PluginExecutionReference,
  request: InvokeRequest,
  environment: import_zod53.z.record(
    import_zod53.z.string().regex(/^[a-z_][a-z0-9_]*$/i),
    import_zod53.z.string().max(65536).refine((value) => !value.includes("\0"))
  ).default({}),
  timeoutMs: import_zod53.z.number().int().positive().max(PLUGIN_EXECUTION_TIMEOUT_MS).default(PLUGIN_EXECUTION_TIMEOUT_MS)
}).strict();
var AuthorizedPluginRelease = import_zod53.z.object({
  manifest: PluginManifest,
  archiveSha256: import_zod53.z.string().regex(/^[a-f0-9]{64}$/)
});

// packages/schema/src/plugin/pypi.ts
var import_zod54 = require("zod");
var pythonName = import_zod54.z.string().regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/).refine((value) => !value.startsWith("__"));
var PluginPypiImport = import_zod54.z.object({
  package: PypiPackageName,
  version: PypiVersion,
  python: import_zod54.z.string().regex(/^3\.(?:12|13|14)$/).default("3.13"),
  operations: import_zod54.z.array(
    import_zod54.z.object({
      id: import_zod54.z.string().regex(/^[a-z][a-z0-9-]*$/).max(100),
      label: import_zod54.z.string().min(1).max(240),
      module: import_zod54.z.string().min(1).max(240).refine(
        (value) => value.split(".").every((part) => pythonName.safeParse(part).success),
        "Use a Python module name"
      ),
      function: pythonName,
      inputs: JsonSchema,
      outputs: JsonSchema
    }).strict()
  ).min(1).max(100)
}).strict();

// packages/schema/src/plugin/publishing.ts
var import_zod56 = require("zod");

// packages/schema/src/plugin/version.ts
var import_zod55 = require("zod");
var PluginVersion = import_zod55.z.string().max(200).regex(
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?$/,
  "Use a semantic version such as 1.2.3 or 2.0.0-beta.1"
);

// packages/schema/src/plugin/publishing.ts
var PluginConfigPath = import_zod56.z.string().max(512).refine(
  (path) => /^(?:[a-zA-Z0-9_.-]+\/)*(?:plugin\.octonode\.(?:json|ya?ml)|octonode\.plugin\.json)$/.test(path) && !path.split("/").some((part) => [".", "..", ".git", "node_modules"].includes(part)),
  "Select a repository-relative octonode.plugin.json file (older plugin.octonode release files also work)"
);
var PluginReleaseConfig = import_zod56.z.object({
  apiVersion: import_zod56.z.literal("octonode.plugin/v1"),
  id: import_zod56.z.string().max(128).regex(/^[a-z0-9][a-z0-9-]*$/),
  version: PluginVersion,
  icon: IconValue.optional(),
  scope: import_zod56.z.enum(["user", "team", "organization", "public"]),
  teamId: import_zod56.z.string().min(1).max(128).optional(),
  orgId: import_zod56.z.string().min(1).max(128).optional(),
  contributors: import_zod56.z.array(import_zod56.z.string().trim().min(1).max(240)).max(100).optional(),
  workflow: import_zod56.z.string().regex(/^\.github\/workflows\/[a-zA-Z0-9_-]+\.ya?ml$/).default(".github/workflows/octonode-publish.yml")
}).strict().superRefine((config, ctx) => {
  if (config.scope === "team" !== Boolean(config.teamId))
    ctx.addIssue({ code: "custom", path: ["teamId"], message: "teamId is required only for team scope" });
  if (config.scope === "organization" !== Boolean(config.orgId))
    ctx.addIssue({ code: "custom", path: ["orgId"], message: "orgId is required only for organization scope" });
});
var PluginPublisherInput = import_zod56.z.object({ repositoryId: import_zod56.z.number().int().positive(), configPath: PluginConfigPath }).strict();
var PluginPublisherRepository = PluginPublisherInput.pick({ repositoryId: true });
var PluginPublisherAutomatic = import_zod56.z.object({
  ok: import_zod56.z.boolean(),
  connected: import_zod56.z.number(),
  workflow: import_zod56.z.string()
});
var PluginPublisherConsent = PluginPublisherInput.extend({ sha256: import_zod56.z.string().regex(/^[a-f0-9]{64}$/) });
var PluginPublisherPreview = import_zod56.z.object({
  config: PluginReleaseConfig,
  sha256: import_zod56.z.string(),
  repository: import_zod56.z.string(),
  branch: import_zod56.z.string()
});
var PluginPublisherConnection = PluginPublisherPreview.extend({
  id: import_zod56.z.string().uuid(),
  repositoryId: import_zod56.z.number(),
  configPath: PluginConfigPath,
  lastVersion: import_zod56.z.string().nullable(),
  lastSha: import_zod56.z.string().nullable(),
  lastPublishedAt: import_zod56.z.number().nullable()
});
var PluginPublisherConnections = import_zod56.z.object({ items: import_zod56.z.array(PluginPublisherConnection) });
var PluginPublisherRepositoryQuery = import_zod56.z.object({
  search: import_zod56.z.string().trim().max(200).default(""),
  scope: import_zod56.z.enum(["all", "user", "team", "organization", "public"]).default("all"),
  sort: import_zod56.z.enum(["name", "-name"]).default("name"),
  limit: import_zod56.z.coerce.number().int().min(1).max(100).default(20),
  offset: import_zod56.z.coerce.number().int().min(0).max(1e6).default(0)
});
var PluginPublisherRepositoryPage = import_zod56.z.object({
  items: import_zod56.z.array(
    import_zod56.z.object({
      repositoryId: import_zod56.z.number().int(),
      repository: import_zod56.z.string(),
      branch: import_zod56.z.string(),
      plugins: import_zod56.z.array(import_zod56.z.string()),
      scopes: import_zod56.z.array(import_zod56.z.enum(["user", "team", "organization", "public"]))
    })
  ),
  total: import_zod56.z.number().int().nonnegative()
});
var PluginPublisherOperation = import_zod56.z.enum(["create", "update", "delete"]);
var PluginPublisherReviewItem = import_zod56.z.object({
  configPath: PluginConfigPath,
  config: PluginReleaseConfig,
  sha256: import_zod56.z.string(),
  connectionId: import_zod56.z.string().nullable(),
  missing: import_zod56.z.boolean()
});
var PluginPublisherReview = import_zod56.z.object({
  repositoryId: import_zod56.z.number(),
  repository: import_zod56.z.string(),
  branch: import_zod56.z.string(),
  headSha: import_zod56.z.string(),
  revision: import_zod56.z.string(),
  items: import_zod56.z.array(PluginPublisherReviewItem)
});
var PluginPublisherApply = import_zod56.z.object({
  repositoryId: import_zod56.z.number().int().positive(),
  revision: import_zod56.z.string().regex(/^[a-f0-9]{64}$/),
  operations: import_zod56.z.array(import_zod56.z.object({ configPath: PluginConfigPath, operation: PluginPublisherOperation }).strict()).min(1).max(100)
}).strict();
var PluginPublisherApplied = import_zod56.z.object({
  ok: import_zod56.z.boolean(),
  sha: import_zod56.z.string(),
  repositoryId: import_zod56.z.number(),
  buildId: import_zod56.z.number()
});
var PluginPublisherListQuery = import_zod56.z.object({
  q: import_zod56.z.string().trim().max(200).default(""),
  offset: import_zod56.z.coerce.number().int().min(0).max(1e6).default(0),
  limit: import_zod56.z.coerce.number().int().min(1).max(100).default(25),
  days: import_zod56.z.enum(["7", "30", "90"]).default("30"),
  scope: import_zod56.z.enum(["", "user", "group", "org", "public"]).default(""),
  source: import_zod56.z.enum(["", "sdk", "npm"]).default(""),
  sort: import_zod56.z.enum(["updated", "name", "version", "scope", "source", "installs", "score", "versions"]).default("updated"),
  direction: import_zod56.z.enum(["asc", "desc"]).default("desc")
});
var PluginPublisherBuildQuery = import_zod56.z.object({
  repositoryId: import_zod56.z.coerce.number().int().positive().optional(),
  page: import_zod56.z.coerce.number().int().min(1).max(1e6).default(1),
  search: import_zod56.z.string().max(200).default(""),
  status: import_zod56.z.enum(["", "queued", "in_progress", "success", "failure"]).default(""),
  sort: import_zod56.z.enum(["newest", "oldest", "name", "status", "branch", "sha"]).default("newest"),
  direction: import_zod56.z.enum(["asc", "desc"]).default("asc"),
  limit: import_zod56.z.coerce.number().int().min(1).max(100).default(30),
  branch: import_zod56.z.string().trim().max(200).default(""),
  sha: import_zod56.z.string().trim().max(200).default("")
});
var PluginPublisherBuilds = import_zod56.z.object({
  total: import_zod56.z.number(),
  page: import_zod56.z.number(),
  hasMore: import_zod56.z.boolean(),
  limit: import_zod56.z.number(),
  items: import_zod56.z.array(
    import_zod56.z.object({
      id: import_zod56.z.number(),
      repositoryId: import_zod56.z.number(),
      number: import_zod56.z.number(),
      attempt: import_zod56.z.number(),
      title: import_zod56.z.string(),
      sha: import_zod56.z.string(),
      branch: import_zod56.z.string(),
      status: import_zod56.z.string(),
      conclusion: import_zod56.z.string().nullable(),
      url: import_zod56.z.string(),
      createdAt: import_zod56.z.string(),
      updatedAt: import_zod56.z.string()
    })
  )
});
var PluginPublisherBuildDetail = import_zod56.z.object({
  repository: import_zod56.z.string(),
  sha: import_zod56.z.string(),
  branch: import_zod56.z.string(),
  status: import_zod56.z.string(),
  createdAt: import_zod56.z.string(),
  items: import_zod56.z.array(
    import_zod56.z.object({
      configPath: PluginConfigPath,
      name: import_zod56.z.string(),
      version: import_zod56.z.string(),
      scope: import_zod56.z.enum(["user", "team", "organization", "public"]),
      operation: PluginPublisherOperation,
      status: import_zod56.z.string(),
      url: import_zod56.z.string().nullable(),
      error: import_zod56.z.string().nullable()
    })
  ),
  log: import_zod56.z.string()
});
var PluginCloudBuild = import_zod56.z.object({
  id: import_zod56.z.number().int().positive(),
  sha: import_zod56.z.string().regex(/^[a-f0-9]{40}$/),
  active: import_zod56.z.boolean(),
  items: import_zod56.z.array(
    import_zod56.z.object({
      configPath: PluginConfigPath,
      config: PluginReleaseConfig,
      operation: PluginPublisherOperation,
      status: import_zod56.z.string()
    })
  ).max(100)
});

// packages/schema/src/app/installation.ts
var import_zod58 = require("zod");

// packages/schema/src/app/analytics.ts
var import_zod57 = require("zod");
var calendarDateSchema = import_zod57.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
}, "Invalid calendar date");
var appAnalyticsQuerySchema = import_zod57.z.object({
  days: import_zod57.z.enum(["7", "30", "90"]).default("30"),
  from: calendarDateSchema.optional(),
  to: calendarDateSchema.optional()
}).refine(({ from, to }) => {
  if (!from && !to) return true;
  if (!from || !to) return false;
  const span = Date.parse(to) - Date.parse(from);
  return span >= 0 && span < 366 * 864e5;
}, "Choose both dates in order, spanning at most 366 days");

// packages/schema/src/app/installation.ts
var appPublishSchema = import_zod58.z.object({
  workspace: workspaceRefSchema,
  distribution: import_zod58.z.enum(["user", "team", "org", "public"]).optional(),
  slug: import_zod58.z.string().regex(/^[a-z0-9][a-z0-9-]*$/).max(100),
  name: import_zod58.z.string().trim().min(1).max(200),
  description: import_zod58.z.string().max(4e3).optional(),
  version: PluginVersion,
  app: AppDefinition,
  bundles: import_zod58.z.array(
    import_zod58.z.object({
      id: import_zod58.z.string().regex(/^[a-z0-9][a-z0-9-]*$/).max(100),
      code: import_zod58.z.string().min(1).max(2 * 1024 * 1024)
    }).strict()
  ).max(32).optional(),
  expectedRevision: import_zod58.z.number().int().min(0).max(Number.MAX_SAFE_INTEGER - 1)
}).strict().refine(
  (body) => !body.distribution || body.distribution === "public" || body.distribution === body.workspace.kind,
  "Private distribution must match the publisher workspace"
);
var appLifecycleSchema = import_zod58.z.object({
  workspace: workspaceRefSchema,
  expectedRevision: import_zod58.z.number().int().min(0).max(Number.MAX_SAFE_INTEGER - 1)
}).strict();
var appStatusSchema = appLifecycleSchema.extend({ status: import_zod58.z.enum(["published", "deprecated"]) }).strict();
var appReviewSchema = import_zod58.z.object({ stars: import_zod58.z.number().int().min(1).max(5), body: import_zod58.z.string().max(2e3) }).strict();
var appGrantSchema = import_zod58.z.object({
  action: AppAction,
  projectId: import_zod58.z.string().min(1).max(128)
}).strict();
var appGrantsSchema = import_zod58.z.array(appGrantSchema).max(100).refine(
  (grants) => new Set(grants.map((grant) => JSON.stringify([grant.action, grant.projectId]))).size === grants.length,
  "App grants must be unique"
);
var appInstallSchema = import_zod58.z.object({
  appId: import_zod58.z.string().uuid(),
  version: PluginVersion,
  manifestSha256: import_zod58.z.string().regex(/^[a-f0-9]{64}$/),
  grants: appGrantsSchema,
  updateMode: import_zod58.z.literal("preserve-consent").optional(),
  expectedRevision: import_zod58.z.number().int().min(0).max(Number.MAX_SAFE_INTEGER - 1)
}).strict();
var appUninstallSchema = import_zod58.z.object({
  expectedRevision: import_zod58.z.number().int().min(1).max(Number.MAX_SAFE_INTEGER - 1)
}).strict();
var appInstallationSchema = import_zod58.z.object({
  id: import_zod58.z.string().uuid(),
  appId: import_zod58.z.string().uuid(),
  workspace: workspaceRefSchema,
  version: PluginVersion,
  manifestSha256: import_zod58.z.string().regex(/^[a-f0-9]{64}$/),
  grants: appGrantsSchema,
  status: import_zod58.z.enum(["active", "uninstalled"]),
  enabled: import_zod58.z.boolean(),
  configuration: import_zod58.z.record(import_zod58.z.string().max(4e3)),
  revision: import_zod58.z.number().int().positive(),
  installedBy: import_zod58.z.string(),
  updatedAt: import_zod58.z.number().int().nonnegative()
}).strict();
var appShellSchema = import_zod58.z.object({
  items: import_zod58.z.array(
    import_zod58.z.object({
      installation: appInstallationSchema.pick({
        id: true,
        appId: true,
        workspace: true,
        version: true,
        manifestSha256: true,
        revision: true,
        status: true,
        enabled: true
      }),
      name: import_zod58.z.string().min(1).max(200),
      icon: IconName.optional(),
      iconUrl: import_zod58.z.string().url().optional(),
      apiVersion: import_zod58.z.enum(["1", "2", "3"]),
      hasPage: import_zod58.z.boolean(),
      hasBlock: import_zod58.z.boolean(),
      contributions: import_zod58.z.array(appContributionSchema.omit({ path: true, sha256: true })).max(32),
      launchers: ContributionApp.innerType().shape.launchers,
      locales: ContributionApp.innerType().shape.locales
    }).strict()
  )
}).strict();
var appSettingsSchema = import_zod58.z.object({
  expectedRevision: import_zod58.z.number().int().min(1).max(Number.MAX_SAFE_INTEGER - 1),
  enabled: import_zod58.z.boolean(),
  configuration: import_zod58.z.record(import_zod58.z.string().max(4e3)).refine((value) => Object.keys(value).length <= 32)
}).strict();
var appDevelopmentConsentSchema = import_zod58.z.object({
  expectedRevision: import_zod58.z.number().int().positive(),
  grants: appGrantsSchema
}).strict();
var appInstallationsQuerySchema = import_zod58.z.object({
  appId: import_zod58.z.string().uuid().optional(),
  offset: import_zod58.z.coerce.number().int().min(0).max(1e6).default(0),
  q: import_zod58.z.string().max(200).optional(),
  sort: import_zod58.z.enum(["name", "installed", "updated"]).default("installed"),
  direction: import_zod58.z.enum(["asc", "desc"]).default("desc"),
  status: import_zod58.z.enum(["active", "uninstalled"]).optional(),
  enabled: import_zod58.z.enum(["true", "false"]).optional(),
  installedAfter: calendarDateSchema.optional(),
  installedBefore: calendarDateSchema.optional()
}).refine(
  (query) => query.installedAfter === void 0 || query.installedBefore === void 0 || query.installedAfter <= query.installedBefore,
  "Invalid installation date range"
);

// packages/schema/src/github.ts
var import_zod59 = require("zod");
var GitHubAutoSyncTarget = import_zod59.z.object({
  architectureId: import_zod59.z.string().min(1).max(128),
  fullName: import_zod59.z.string().regex(/^[\w.-]+\/[\w.-]+$/),
  branch: import_zod59.z.string().min(1).max(1024),
  sha: import_zod59.z.string().regex(/^[a-f0-9]{40}$/),
  projectIds: import_zod59.z.array(import_zod59.z.string().min(1).max(128)).min(1).max(1e3)
});
var GitHubAutoSyncDispatch = GitHubAutoSyncTarget.extend({
  workspace: import_zod59.z.object({ kind: import_zod59.z.enum(["user", "org", "team"]), id: import_zod59.z.string().min(1).max(128) }),
  userId: import_zod59.z.string().min(1).max(128)
});
var GitHubAutoSyncSettings = import_zod59.z.object({
  connected: import_zod59.z.boolean(),
  enabled: import_zod59.z.boolean(),
  ready: import_zod59.z.boolean()
});
var GitHubAutoSyncUpdate = import_zod59.z.object({ enabled: import_zod59.z.boolean() }).strict();
var GitHubUserRepositoriesQuery = import_zod59.z.object({
  page: import_zod59.z.coerce.number().int().min(1).max(1e4).default(1)
});
var GitHubUserRepositories = import_zod59.z.object({
  items: import_zod59.z.array(
    import_zod59.z.object({
      id: import_zod59.z.number().int(),
      full_name: import_zod59.z.string(),
      clone_url: import_zod59.z.string().url(),
      private: import_zod59.z.boolean(),
      updated_at: import_zod59.z.string().nullable()
    })
  ),
  hasMore: import_zod59.z.boolean()
});

// packages/schema/src/gitlab.ts
var import_zod60 = require("zod");
function gitlabRepositoryUrl(value) {
  const input = value.trim();
  if (!input || /[\s\\?#%]/.test(input) || /(?:^|\/)\.{1,2}(?:\/|$)/.test(input)) return null;
  const path = input.replace(/^git@gitlab\.com:/i, "https://gitlab.com/").replace(/^ssh:\/\/git@gitlab\.com\//i, "https://gitlab.com/");
  let url;
  try {
    url = new URL(path);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.host !== "gitlab.com" || url.username || url.password) return null;
  const parts = url.pathname.replace(/\/$/, "").replace(/\.git$/, "").slice(1).split("/");
  if (parts.length < 2 || parts.some((part) => !/^[A-Za-z0-9_][A-Za-z0-9_.-]*$/.test(part) || part === "." || part === ".." || part === "-"))
    return null;
  return `https://gitlab.com/${parts.join("/")}.git`;
}
var GitLabConnection = import_zod60.z.object({
  id: import_zod60.z.string().uuid(),
  accountId: import_zod60.z.string(),
  accountName: import_zod60.z.string().nullable(),
  installedBy: import_zod60.z.string(),
  status: import_zod60.z.enum([
    "active",
    "scope_drift",
    "refresh_failed",
    "revocation_pending",
    "revocation_failed",
    "revoked",
    "uninstalled"
  ]),
  tokenExpiresAt: import_zod60.z.number().nullable(),
  updatedAt: import_zod60.z.number()
});
var GitLabRepository = import_zod60.z.object({
  id: import_zod60.z.number().int().positive(),
  fullName: import_zod60.z.string().min(1).max(512),
  cloneUrl: import_zod60.z.string().refine((value) => gitlabRepositoryUrl(value) !== null),
  defaultBranch: import_zod60.z.string().nullable(),
  private: import_zod60.z.boolean(),
  archived: import_zod60.z.boolean(),
  selected: import_zod60.z.boolean()
});
var GitLabRepositories = import_zod60.z.object({
  items: import_zod60.z.array(GitLabRepository).max(100),
  nextPage: import_zod60.z.number().int().positive().nullable()
});
var GitLabRepositorySelection = import_zod60.z.object({ repositoryId: import_zod60.z.number().int().positive(), selected: import_zod60.z.boolean() }).strict();

// packages/schema/src/project/lifecycle.ts
var import_zod61 = require("zod");
var ProjectLifecycle = import_zod61.z.object({
  id: import_zod61.z.string().min(1),
  name: import_zod61.z.string(),
  state: import_zod61.z.enum(["archived", "deleted"]),
  changedAt: import_zod61.z.number(),
  expiresAt: import_zod61.z.number().optional(),
  purgedAt: import_zod61.z.number().optional()
});
var ProjectLifecycleRecord = ProjectLifecycle.extend({
  configPath: import_zod61.z.string(),
  projectRoot: import_zod61.z.string(),
  storeDir: import_zod61.z.string(),
  configFingerprint: import_zod61.z.string(),
  canonicalId: import_zod61.z.string()
});

// packages/schema/src/project/jobs.ts
var import_zod62 = require("zod");
var identity = { idempotencyKey: import_zod62.z.string().uuid() };
var ProjectJobInput = import_zod62.z.discriminatedUnion("kind", [
  import_zod62.z.object({
    ...identity,
    kind: import_zod62.z.literal("import"),
    provider: import_zod62.z.enum(["git", "github", "gitlab"]),
    url: import_zod62.z.string().trim().min(1).max(2048).refine((value) => {
      if (/[\r\n\0]/.test(value) || value.includes("::")) return false;
      if (/^https?:\/\//i.test(value)) {
        try {
          const url = new URL(value);
          return !url.username && !url.password;
        } catch {
          return false;
        }
      }
      return value.startsWith("/") || value.startsWith("file://") || /^(?:git@[^:]+:|ssh:\/\/git@)/.test(value);
    }, "Invalid repository URL"),
    dir: import_zod62.z.string().trim().min(1).max(240).optional()
  }).strict(),
  import_zod62.z.object({ ...identity, kind: import_zod62.z.literal("compile"), projectId: import_zod62.z.string().min(1).max(240) }).strict()
]);
var ProjectJobResult = import_zod62.z.object({
  projects: import_zod62.z.array(import_zod62.z.object({ projectId: import_zod62.z.string() })),
  success: import_zod62.z.boolean(),
  diagnostics: import_zod62.z.array(
    import_zod62.z.object({
      severity: import_zod62.z.enum(["error", "warning"]),
      code: import_zod62.z.string(),
      message: import_zod62.z.string(),
      path: import_zod62.z.string().optional()
    })
  )
});
var ProjectJobStatus = import_zod62.z.object({
  jobId: import_zod62.z.string(),
  status: import_zod62.z.enum(["queued", "running", "succeeded", "failed"]),
  phase: import_zod62.z.enum(["queued", "importing", "compiling", "saving", "complete"]),
  createdAt: import_zod62.z.number(),
  updatedAt: import_zod62.z.number(),
  result: ProjectJobResult.optional(),
  error: import_zod62.z.string().optional()
});
var ProjectJobNotification = import_zod62.z.object({
  jobId: import_zod62.z.string().regex(/^[a-f0-9]{64}$/),
  userId: import_zod62.z.string().min(1).max(128),
  kind: import_zod62.z.enum(["import", "compile"]),
  status: import_zod62.z.enum(["succeeded", "failed"]),
  projectId: import_zod62.z.string().min(1).max(240).optional(),
  compilationSucceeded: import_zod62.z.boolean().optional(),
  timestamp: import_zod62.z.number().int().nonnegative()
}).strict();

// packages/schema/src/toolkit.ts
var import_zod63 = require("zod");
var ToolkitOwner = import_zod63.z.object({
  kind: import_zod63.z.enum(["user", "team", "org"]),
  id: import_zod63.z.string().trim().min(1).max(240)
}).strict();
var ToolkitVisibility = import_zod63.z.enum(["user", "team", "org", "public"]);
var ToolkitMember = import_zod63.z.object({
  development: import_zod63.z.boolean().optional(),
  pluginId: import_zod63.z.string().min(1).max(240),
  version: PluginVersion,
  alias: import_zod63.z.string().regex(/^[a-z][a-z0-9-]*$/).max(100)
}).strict();
var ToolkitAction = import_zod63.z.object({
  id: import_zod63.z.string().regex(/^[a-z][a-z0-9-]*$/).max(100),
  development: import_zod63.z.boolean().optional(),
  description: import_zod63.z.string().max(1e3).default(""),
  kind: import_zod63.z.enum(["plugin", "script", "command"]),
  plugin: import_zod63.z.string().regex(/^[a-z][a-z0-9-]*$/).max(100),
  target: import_zod63.z.string().regex(/^[a-zA-Z0-9_@][a-zA-Z0-9_@:./-]*$/).max(200),
  expected: import_zod63.z.string().max(4e3).optional(),
  args: import_zod63.z.array(import_zod63.z.string().max(4e3)).max(100).default([]),
  timeoutMs: import_zod63.z.number().int().min(100).max(3e5).default(6e4)
}).strict();
var ToolkitDefinition = import_zod63.z.object({
  name: import_zod63.z.string().trim().min(1).max(200),
  description: import_zod63.z.string().max(4e3).default(""),
  version: PluginVersion,
  owner: ToolkitOwner,
  visibility: ToolkitVisibility,
  plugins: import_zod63.z.array(ToolkitMember).max(100),
  actions: import_zod63.z.array(ToolkitAction).max(100).optional()
}).strict().superRefine((value, ctx) => {
  if (value.visibility !== "public" && value.visibility !== value.owner.kind)
    ctx.addIssue({ code: "custom", path: ["visibility"], message: "Visibility must match the owner or be public" });
  if (new Set(value.actions?.map((action) => action.id)).size !== (value.actions?.length ?? 0))
    ctx.addIssue({ code: "custom", path: ["actions"], message: "Duplicate action ID" });
  for (const [index, action] of (value.actions ?? []).entries())
    if (!value.plugins.some((plugin) => plugin.alias === action.plugin))
      ctx.addIssue({
        code: "custom",
        path: ["actions", index, "plugin"],
        message: "Action must reference an included plugin"
      });
  for (const field of ["pluginId", "alias"])
    if (new Set(value.plugins.map((plugin) => plugin[field])).size !== value.plugins.length)
      ctx.addIssue({ code: "custom", path: ["plugins"], message: `Duplicate plugin ${field}` });
});
var ToolkitQuery = import_zod63.z.object({
  q: import_zod63.z.string().trim().max(200).default(""),
  visibility: ToolkitVisibility.optional(),
  status: import_zod63.z.enum(["draft", "published"]).optional(),
  ownerKind: ToolkitOwner.shape.kind.optional(),
  ownerId: ToolkitOwner.shape.id.optional(),
  sort: import_zod63.z.enum(["name", "updated", "plugins"]).default("updated"),
  direction: import_zod63.z.enum(["asc", "desc"]).default("desc"),
  offset: import_zod63.z.coerce.number().int().min(0).max(1e6).default(0),
  limit: import_zod63.z.coerce.number().int().min(1).max(100).default(24),
  npmPackage: import_zod63.z.string().regex(/^(@[a-z0-9~._-]+\/)?[a-z0-9~._-]+$/).optional(),
  npmVersion: PluginVersion.optional(),
  installed: import_zod63.z.enum(["true", "false"]).optional(),
  installedVersions: import_zod63.z.string().max(64e3).default("[]").transform((value, ctx) => {
    try {
      return import_zod63.z.array(import_zod63.z.tuple([import_zod63.z.string().max(240), PluginVersion])).max(1e3).parse(JSON.parse(value));
    } catch {
      ctx.addIssue({ code: "custom", message: "Invalid installed toolkit versions" });
      return import_zod63.z.NEVER;
    }
  })
});
var ToolkitResolvedMember = ToolkitMember.extend({
  name: import_zod63.z.string(),
  manifestId: import_zod63.z.string(),
  sha256: import_zod63.z.string().regex(/^[a-f0-9]{64}$/),
  scope: PluginScope,
  permissions: import_zod63.z.array(PluginPermission),
  publisher: import_zod63.z.string().nullable(),
  npmPackage: import_zod63.z.string().nullable(),
  connections: import_zod63.z.array(import_zod63.z.string())
});
var ToolkitRelease = import_zod63.z.object({
  id: import_zod63.z.string(),
  name: import_zod63.z.string(),
  description: import_zod63.z.string(),
  version: PluginVersion,
  owner: ToolkitOwner,
  visibility: ToolkitVisibility,
  revision: import_zod63.z.number().int(),
  sha256: import_zod63.z.string().nullable(),
  status: import_zod63.z.enum(["draft", "published"]),
  plugins: import_zod63.z.array(ToolkitResolvedMember).max(100),
  actions: import_zod63.z.array(ToolkitAction).max(100).optional()
});
var ToolkitInstallRequest = import_zod63.z.object({
  version: PluginVersion,
  sha256: import_zod63.z.string().regex(/^[a-f0-9]{64}$/),
  destination: ToolkitOwner
}).strict();
function toolkitForMode(release2, mode) {
  const plugins = release2.plugins.filter((plugin) => mode === "development" || !plugin.development);
  return {
    ...release2,
    plugins,
    actions: release2.actions?.map(
      (action) => release2.plugins.find((plugin) => plugin.alias === action.plugin)?.development ? { ...action, development: true } : action
    ).filter(
      (action) => (mode === "development" || !action.development) && plugins.some((plugin) => plugin.alias === action.plugin)
    )
  };
}

// packages/schema/src/app/runtime.ts
var import_zod64 = require("zod");
var projectId = import_zod64.z.string().min(1).max(128);
var tableId = import_zod64.z.string().min(1).max(128);
var rowId = import_zod64.z.string().min(1).max(128);
var appDataRequestSchema = import_zod64.z.discriminatedUnion("operation", [
  import_zod64.z.object({ operation: import_zod64.z.literal("project.get"), projectId }).strict(),
  import_zod64.z.object({ operation: import_zod64.z.literal("tables.list"), projectId }).strict(),
  import_zod64.z.object({ operation: import_zod64.z.literal("rows.list"), projectId, tableId, input: ListRowsInput }).strict(),
  import_zod64.z.object({ operation: import_zod64.z.literal("rows.insert"), projectId, tableId, input: InsertRowInput }).strict(),
  import_zod64.z.object({
    operation: import_zod64.z.literal("rows.update"),
    projectId,
    tableId,
    rowId,
    input: UpdateRowInput.extend({ expectedVersion: import_zod64.z.number().int().positive() })
  }).strict(),
  import_zod64.z.object({ operation: import_zod64.z.literal("rows.delete"), projectId, tableId, rowId }).strict()
]);
var appExecutionRequestSchema = import_zod64.z.object({
  projectId,
  workflowId: import_zod64.z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/).max(240),
  idempotencyKey: import_zod64.z.string().uuid(),
  input: import_zod64.z.record(import_zod64.z.string(), import_zod64.z.unknown()).default({}),
  env: import_zod64.z.string().max(100).optional()
}).strict();

// packages/schema/src/data/table/validation.ts
var import_zod65 = require("zod");

// packages/schema/src/assistant/resources.ts
var import_zod66 = require("zod");
var assistantResourceContentSchema = assistantSettingsSchema.pick({ connectors: true, skills: true }).extend({
  files: import_zod66.z.array(assistantFileSchema).max(64).optional()
});
var assistantResourceInputSchema = import_zod66.z.object({
  id: import_zod66.z.string().uuid(),
  name: import_zod66.z.string().trim().min(1).max(80),
  kind: import_zod66.z.enum(["skill", "plugin", "mcp"]),
  projectId: import_zod66.z.string().min(1).max(128).nullable(),
  autoLoad: import_zod66.z.boolean(),
  enabled: import_zod66.z.boolean().optional(),
  source: import_zod66.z.object({
    catalog: import_zod66.z.literal("claude-plugins-official"),
    name: import_zod66.z.string().max(80),
    repository: import_zod66.z.string().max(256),
    revision: import_zod66.z.string().regex(/^[a-f0-9]{40}$/),
    author: import_zod66.z.string().max(256)
  }).strict().optional(),
  content: assistantResourceContentSchema
}).strict().superRefine((record, ctx) => {
  try {
    assistantResourceArtifact(record);
  } catch {
    ctx.addIssue({ code: import_zod66.z.ZodIssueCode.custom, message: "Resource files conflict or exceed artifact limits" });
  }
  if (!record.content.skills.length && !record.content.connectors.length && !record.content.files?.length)
    ctx.addIssue({
      code: import_zod66.z.ZodIssueCode.custom,
      message: "A resource must include instructions or an MCP connector"
    });
  if (record.kind === "skill" && (record.content.skills.length !== 1 || record.content.connectors.length))
    ctx.addIssue({ code: import_zod66.z.ZodIssueCode.custom, message: "A skill contains one instruction document" });
  if (record.kind === "mcp" && (record.content.connectors.length !== 1 || record.content.skills.length))
    ctx.addIssue({ code: import_zod66.z.ZodIssueCode.custom, message: "An MCP record contains one connector" });
  if (record.content.files?.some((file) => file.path === ".mcp.json" || file.path === ".claude-plugin/plugin.json"))
    ctx.addIssue({
      code: import_zod66.z.ZodIssueCode.custom,
      message: "Configure MCP and plugin identity through the registration fields"
    });
  if (new TextEncoder().encode(JSON.stringify(record)).byteLength > 128e3)
    ctx.addIssue({ code: import_zod66.z.ZodIssueCode.custom, message: "Resource exceeds 128 KB" });
});
var assistantResourceSchema = import_zod66.z.object({
  registration: assistantResourceInputSchema,
  version: import_zod66.z.number().int().positive(),
  createdAt: import_zod66.z.number().int().nonnegative(),
  ownerUserId: import_zod66.z.string().min(1).nullable().optional(),
  canEdit: import_zod66.z.boolean().optional()
});
var assistantResourceListSchema = import_zod66.z.object({ items: import_zod66.z.array(assistantResourceSchema).max(128) });
var assistantTerminalConnectionSchema = import_zod66.z.object({
  api: import_zod66.z.string().url().max(2048),
  token: import_zod66.z.string().min(1).max(16384),
  projectId: import_zod66.z.string().min(1).max(128)
}).strict();

// packages/schema/src/billing.ts
var import_zod71 = require("zod");

// packages/schema/src/billing/ai.ts
var import_zod68 = require("zod");

// packages/schema/src/access/organization/seat.ts
var import_zod67 = require("zod");
var organizationInventorySchema = import_zod67.z.array(userTierRefSchema.extend({ quantity: import_zod67.z.number().int().min(0).max(1e4) })).max(100).refine(
  (items) => new Set(items.map((item) => `${item.tier}:${item.version}`)).size === items.length,
  "Duplicate seat tier"
);
var organizationSettingsWriteSchema = import_zod67.z.object({
  revision: import_zod67.z.number().int().nonnegative(),
  enabled: import_zod67.z.boolean(),
  defaultSeat: userTierRefSchema.nullable(),
  extraTeams: import_zod67.z.number().int().min(0).max(1e4),
  extraMembersPerTeam: import_zod67.z.number().int().min(0).max(1e4),
  inventory: organizationInventorySchema,
  reason: import_zod67.z.string().trim().min(3).max(1e3)
}).strict();
var organizationSettingsSchema = organizationSettingsWriteSchema.extend({
  orgId: import_zod67.z.string(),
  reason: import_zod67.z.string(),
  plan: userTierRefSchema.extend({ name: import_zod67.z.string() }),
  effectiveDefault: userTierRefSchema.extend({ name: import_zod67.z.string() }),
  capacity: import_zod67.z.object({
    teams: import_zod67.z.number().int().nonnegative().nullable(),
    membersPerTeam: import_zod67.z.number().int().nonnegative().nullable(),
    usedTeams: import_zod67.z.number().int().nonnegative(),
    usedSeats: import_zod67.z.number().int().nonnegative()
  }),
  seats: import_zod67.z.array(
    userTierRefSchema.extend({
      name: import_zod67.z.string(),
      purchased: import_zod67.z.number().int().nonnegative(),
      granted: import_zod67.z.number().int().nonnegative(),
      assigned: import_zod67.z.number().int().nonnegative()
    })
  ),
  updatedBy: import_zod67.z.string(),
  updatedAt: import_zod67.z.number().int().nonnegative(),
  canManage: import_zod67.z.boolean(),
  canGrant: import_zod67.z.boolean()
});
var organizationSeatWriteSchema = import_zod67.z.object({
  revision: import_zod67.z.number().int().nonnegative(),
  assignment: userTierRefSchema,
  blocked: import_zod67.z.boolean(),
  reason: import_zod67.z.string().trim().min(3).max(1e3)
}).strict();
var organizationSeatSchema = organizationSeatWriteSchema.extend({
  orgId: import_zod67.z.string(),
  userId: import_zod67.z.string(),
  name: import_zod67.z.string(),
  role: import_zod67.z.string(),
  tierName: import_zod67.z.string(),
  teamCount: import_zod67.z.number().int().nonnegative(),
  teams: import_zod67.z.array(import_zod67.z.object({ id: import_zod67.z.string(), name: import_zod67.z.string() })).max(20),
  updatedBy: import_zod67.z.string(),
  updatedAt: import_zod67.z.number().int().nonnegative(),
  canManage: import_zod67.z.boolean()
});
var organizationSeatsQuerySchema = import_zod67.z.object({
  search: import_zod67.z.string().max(100).default(""),
  offset: import_zod67.z.coerce.number().int().min(0).max(1e6).default(0),
  limit: import_zod67.z.coerce.number().int().min(1).max(100).default(25),
  teamIds: import_zod67.z.string().max(3e4).optional(),
  userId: import_zod67.z.string().min(1).max(128).optional()
});
var organizationSeatsSchema = import_zod67.z.object({
  total: import_zod67.z.number().int().nonnegative(),
  items: import_zod67.z.array(organizationSeatSchema)
});
var organizationSeatBulkWriteSchema = organizationSeatWriteSchema.omit({ revision: true }).extend({
  targets: import_zod67.z.array(import_zod67.z.object({ id: import_zod67.z.string().min(1).max(128), revision: import_zod67.z.number().int().positive() })).min(1).max(ACCESS_TIER_BATCH_LIMIT).refine((items) => new Set(items.map((item) => item.id)).size === items.length, "Duplicate people")
});

// packages/schema/src/billing/ai.ts
var identifier4 = import_zod68.z.string().regex(/^[a-z][a-z0-9_]{0,63}$/);
var usdMicros = import_zod68.z.number().int().min(0).max(1e12);
var aiBudgetWindowSchema = import_zod68.z.object({
  id: identifier4,
  durationSeconds: import_zod68.z.number().int().min(60).max(31536e3),
  budgetUsdMicros: usdMicros
}).strict();
var aiPlanBudgetSchema = import_zod68.z.object({
  plan: accessTierIdSchema,
  monthlyBudgetUsdMicros: usdMicros,
  allowPayAsYouGo: import_zod68.z.boolean().optional(),
  windows: import_zod68.z.array(aiBudgetWindowSchema).max(12),
  modelIds: import_zod68.z.array(identifier4).max(100)
}).strict().superRefine((plan, ctx) => {
  if (new Set(plan.windows.map((window) => window.id)).size !== plan.windows.length)
    ctx.addIssue({ code: "custom", path: ["windows"], message: "Window IDs must be unique within a plan" });
  if (new Set(plan.modelIds).size !== plan.modelIds.length)
    ctx.addIssue({ code: "custom", path: ["modelIds"], message: "Model IDs must be unique" });
});
var aiPricedModelSchema = import_zod68.z.object({
  id: identifier4,
  name: import_zod68.z.string().trim().min(1).max(80),
  provider: import_zod68.z.enum(["workers-ai", "anthropic", "openai", "google"]),
  model: import_zod68.z.string().trim().min(1).max(128).regex(/^[A-Za-z0-9@][A-Za-z0-9._:/@-]*$/),
  priceSource: import_zod68.z.enum(["cloudflare", "custom"]).optional(),
  inputUsdMicrosPerMillion: usdMicros,
  outputUsdMicrosPerMillion: usdMicros,
  enabled: import_zod68.z.boolean()
}).strict();
var aiGatewayRouterSchema = import_zod68.z.object({
  gatewayId: import_zod68.z.string().regex(/^[a-z0-9][a-z0-9_-]{0,63}$/),
  route: import_zod68.z.string().regex(/^[a-z0-9][a-z0-9_-]{0,63}$/)
}).strict();
var aiModelPriceSchema = import_zod68.z.object({
  model: import_zod68.z.string().min(1).max(128),
  inputUsdMicrosPerMillion: usdMicros,
  outputUsdMicrosPerMillion: usdMicros,
  syncedAt: import_zod68.z.number().int().nonnegative(),
  stale: import_zod68.z.boolean()
}).strict();
var aiBillingPolicySchema = import_zod68.z.object({
  router: aiGatewayRouterSchema.optional(),
  creditsPerUsd: import_zod68.z.number().min(1e-6).max(1e6).multipleOf(1e-6),
  models: import_zod68.z.array(aiPricedModelSchema).max(100),
  plans: import_zod68.z.array(aiPlanBudgetSchema).max(100)
}).strict().superRefine((policy, ctx) => {
  for (const field of ["models", "plans"]) {
    const ids = policy[field].map((item) => "id" in item ? item.id : item.plan);
    if (new Set(ids).size !== ids.length)
      ctx.addIssue({ code: "custom", path: [field], message: `Duplicate ${field} identifier` });
  }
  const identities = policy.models.map((model) => `${model.provider}:${model.model}`);
  if (new Set(identities).size !== identities.length)
    ctx.addIssue({ code: "custom", path: ["models"], message: "Provider/model pairs must be unique" });
  for (const [index, plan] of policy.plans.entries())
    if (plan.modelIds.some((id2) => !policy.models.some((model) => model.id === id2)))
      ctx.addIssue({ code: "custom", path: ["plans", index, "modelIds"], message: "Unknown model ID" });
});

// packages/schema/src/billing/usage.ts
var import_zod69 = require("zod");
var billingAiUserUsageSchema = import_zod69.z.object({
  periodStart: import_zod69.z.number().int().nonnegative(),
  periodEnd: import_zod69.z.number().int().nonnegative(),
  creditsPerUsd: import_zod69.z.number().positive().nullable(),
  totalCredits: import_zod69.z.number(),
  unattributedCredits: import_zod69.z.number(),
  users: import_zod69.z.array(
    import_zod69.z.object({
      userId: import_zod69.z.string(),
      name: import_zod69.z.string(),
      credits: import_zod69.z.number()
    })
  ).max(100),
  truncated: import_zod69.z.boolean()
});

// packages/schema/src/billing/grants.ts
var import_zod70 = require("zod");

// packages/schema/src/billing/constants.ts
var CREDIT_GRANT_METERS = ["ai_credits", "executions"];

// packages/schema/src/billing/grants.ts
var adminCreditGrantSchema = import_zod70.z.object({
  workspace: workspaceRefSchema,
  accountId: import_zod70.z.string().min(1).max(256),
  requestId: import_zod70.z.string().uuid(),
  meter: import_zod70.z.enum(CREDIT_GRANT_METERS),
  quantity: import_zod70.z.number().int().positive().max(1e8),
  reason: import_zod70.z.string().trim().min(3).max(1e3)
}).strict();
var adminCreditBalanceSchema = import_zod70.z.object({
  accountId: import_zod70.z.string(),
  funding: workspaceRefSchema,
  fundingName: import_zod70.z.string(),
  balances: import_zod70.z.array(import_zod70.z.object({ meter: import_zod70.z.string(), balance: import_zod70.z.number() })),
  grants: import_zod70.z.array(
    import_zod70.z.object({
      requestId: import_zod70.z.string(),
      actorId: import_zod70.z.string(),
      meter: import_zod70.z.string(),
      quantity: import_zod70.z.number(),
      reason: import_zod70.z.string(),
      createdAt: import_zod70.z.number()
    })
  )
});

// packages/schema/src/billing.ts
var capacityAddonSchema = import_zod71.z.object({
  addonId: import_zod71.z.string().max(100),
  units: import_zod71.z.number().int().positive().max(1e8),
  priceCents: import_zod71.z.number().int().nonnegative().max(1e8)
}).strict();
var billingOfferSchema = import_zod71.z.object({
  id: import_zod71.z.string().regex(/^[a-z][a-z0-9_]{0,63}$/),
  plan: import_zod71.z.string().regex(/^[a-z][a-z0-9_]{0,63}$/),
  name: import_zod71.z.string().trim().min(1).max(80),
  rank: import_zod71.z.number().int().nonnegative().max(1e3),
  workspaceKind: import_zod71.z.enum(["user", "org", "team"]),
  interval: import_zod71.z.enum(["month", "year"]),
  productId: import_zod71.z.string().regex(/^(?:pdt_[A-Za-z0-9_]+)?$/),
  currency: import_zod71.z.string().regex(/^[A-Z]{3}$/),
  monthlyPriceCents: import_zod71.z.number().int().positive().max(1e8),
  basePriceCents: import_zod71.z.number().int().nonnegative().max(1e8).optional(),
  organizationId: import_zod71.z.string().regex(/^[A-Za-z0-9_-]{1,128}$/).optional(),
  hostingMode: import_zod71.z.enum(["shared", "dedicated", "dedicated_customer_storage"]).optional(),
  annualDiscountPercent: import_zod71.z.number().min(0).max(99),
  includedExecutions: import_zod71.z.number().int().positive().max(1e8),
  includedAiCredits: import_zod71.z.number().int().positive().max(1e8),
  access: accessProfileSchema.optional(),
  seatAddonId: import_zod71.z.string().max(100).nullable(),
  executionAddon: capacityAddonSchema.nullable(),
  aiAddon: capacityAddonSchema.nullable(),
  organizationSeats: import_zod71.z.array(
    userTierRefSchema.extend({
      addonId: import_zod71.z.string().max(100),
      priceCents: import_zod71.z.number().int().positive().max(1e8)
    })
  ).max(20).optional(),
  teamAddon: capacityAddonSchema.nullable().optional(),
  membersPerTeamAddon: capacityAddonSchema.nullable().optional(),
  enabled: import_zod71.z.boolean()
}).strict().superRefine((offer, ctx) => {
  if (offer.workspaceKind !== "org" && (offer.organizationSeats?.length || offer.teamAddon || offer.membersPerTeamAddon))
    ctx.addIssue({ code: "custom", message: "Organization seat and team add-ons require an organization offer" });
  const tiers = offer.organizationSeats?.map((item) => `${item.tier}:${item.version}`) ?? [];
  if (new Set(tiers).size !== tiers.length || offer.organizationSeats?.some(
    (item) => item.tier === offer.access?.tier && item.version === offer.access?.tierVersion
  ))
    ctx.addIssue({ code: "custom", message: "Seat tiers must be distinct from the base seat tier" });
  if (offer.workspaceKind !== "org" && (offer.organizationId || offer.basePriceCents || offer.hostingMode && offer.hostingMode !== "shared"))
    ctx.addIssue({ code: "custom", message: "Enterprise agreements and hosting fees require an organization" });
  if ((offer.basePriceCents || offer.hostingMode && offer.hostingMode !== "shared") && !offer.organizationId)
    ctx.addIssue({ code: "custom", message: "Hosting agreements must be restricted to an organization" });
  if (offer.workspaceKind === "user" !== (offer.seatAddonId === null))
    ctx.addIssue({
      code: "custom",
      path: ["seatAddonId"],
      message: "Organizations and teams require a seat add-on; personal plans cannot have seats"
    });
  const ids = [
    offer.seatAddonId,
    offer.executionAddon?.addonId,
    offer.aiAddon?.addonId,
    offer.teamAddon?.addonId,
    offer.membersPerTeamAddon?.addonId,
    ...offer.organizationSeats?.map((item) => item.addonId) ?? []
  ].filter(Boolean);
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: "custom", message: "Add-on IDs must be distinct" });
});
var billingCreditPackSchema = import_zod71.z.object({
  id: import_zod71.z.string().regex(/^[a-z][a-z0-9_]{0,63}$/),
  name: import_zod71.z.string().trim().min(1).max(80),
  productId: import_zod71.z.string().regex(/^(?:pdt_[A-Za-z0-9_]+)?$/),
  meter: import_zod71.z.enum(["executions", "ai_credits"]),
  units: import_zod71.z.number().int().positive().max(1e8),
  priceCents: import_zod71.z.number().int().positive().max(1e8),
  currency: import_zod71.z.string().regex(/^[A-Z]{3}$/),
  enabled: import_zod71.z.boolean()
}).strict();
var billingCatalogSchema = import_zod71.z.object({
  revision: import_zod71.z.number().int().nonnegative(),
  freeExecutions: import_zod71.z.number().int().positive().max(1e8),
  freeAiCredits: import_zod71.z.number().int().positive().max(1e8),
  freeAccess: accessProfileSchema.optional(),
  aiPolicy: aiBillingPolicySchema.optional(),
  offers: import_zod71.z.array(billingOfferSchema).max(100),
  creditPacks: import_zod71.z.array(billingCreditPackSchema).max(100).default([])
}).strict().superRefine((catalog, ctx) => {
  if (catalog.freeAccess && catalog.freeAccess.tier !== "free")
    ctx.addIssue({
      code: "custom",
      path: ["freeAccess", "tier"],
      message: "The Free profile must use the free tier"
    });
  if (new Set(catalog.offers.map((offer) => offer.id)).size !== catalog.offers.length)
    ctx.addIssue({ code: "custom", message: "Offer IDs must be unique" });
  const products = [...catalog.offers, ...catalog.creditPacks].map((item) => item.productId).filter(Boolean);
  if (new Set(products).size !== products.length)
    ctx.addIssue({ code: "custom", message: "Product IDs must be unique" });
  if (new Set(catalog.creditPacks.map((pack) => pack.id)).size !== catalog.creditPacks.length)
    ctx.addIssue({ code: "custom", message: "Duplicate pack ID" });
  for (const field of ["id", "productId"])
    if (new Set(catalog.offers.map((offer) => offer[field])).size !== catalog.offers.length)
      ctx.addIssue({ code: "custom", path: ["offers"], message: `Duplicate ${field}` });
});
var billingSelectionSchema = import_zod71.z.object({
  offerId: import_zod71.z.string().min(1).max(64),
  seats: import_zod71.z.number().int().min(0).max(1e4).default(1),
  seatTiers: import_zod71.z.array(userTierRefSchema.extend({ quantity: import_zod71.z.number().int().min(0).max(1e4) })).max(20).optional(),
  teamPacks: import_zod71.z.number().int().min(0).max(1e4).optional(),
  membersPerTeamPacks: import_zod71.z.number().int().min(0).max(1e4).optional(),
  executionPacks: import_zod71.z.number().int().min(0).max(1e4).default(0),
  aiPacks: import_zod71.z.number().int().min(0).max(1e4).default(0),
  discountCodes: import_zod71.z.array(import_zod71.z.string().trim().min(3).max(16)).max(20).optional()
}).strict();
var billingChangeSchema = billingSelectionSchema.extend({
  quoteId: import_zod71.z.string().uuid()
});
var billingHierarchyInputSchema = import_zod71.z.object({
  mode: import_zod71.z.enum(["separate", "consolidated"]),
  revision: import_zod71.z.number().int().nonnegative()
}).strict();
var billingHierarchySchema = import_zod71.z.object({
  mode: import_zod71.z.enum(["separate", "consolidated"]),
  revision: import_zod71.z.number().int().nonnegative(),
  organizationId: import_zod71.z.string().nullable(),
  inherited: import_zod71.z.boolean(),
  canManage: import_zod71.z.boolean()
});

// packages/schema/src/hosting.ts
var import_zod72 = require("zod");
var storageLocationSchema = import_zod72.z.object({
  id: import_zod72.z.string().uuid(),
  generation: import_zod72.z.number().int().positive(),
  provider: import_zod72.z.enum(["r2", "aws_s3", "s3_compatible"]),
  endpoint: import_zod72.z.string().url(),
  region: import_zod72.z.string().min(1).max(80),
  bucket: import_zod72.z.string().regex(/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/),
  prefix: import_zod72.z.string().regex(/^(?:[a-zA-Z0-9_-]+\/)+$/).max(400),
  forcePathStyle: import_zod72.z.boolean().default(false)
}).strict();
var storageCredentialSchema = import_zod72.z.object({
  accessKeyId: import_zod72.z.string().min(1).max(256),
  secretAccessKey: import_zod72.z.string().min(1).max(256),
  sessionToken: import_zod72.z.string().min(1).max(8192).optional(),
  expiresAt: import_zod72.z.number().int().positive().optional()
}).strict().refine((value) => !value.sessionToken || Boolean(value.expiresAt), "Session credentials require expiresAt");
var storageConnectionInputSchema = import_zod72.z.object({
  location: storageLocationSchema,
  credentials: storageCredentialSchema
}).strict();
var objectArchiveSchema = import_zod72.z.object({
  format: import_zod72.z.literal("octonode-squashfs-v1"),
  id: import_zod72.z.string().uuid(),
  connectionId: import_zod72.z.string().uuid(),
  generation: import_zod72.z.number().int().positive(),
  workspace: import_zod72.z.string().regex(/^(org|team):[A-Za-z0-9_-]+$/),
  key: import_zod72.z.string().min(1).max(1024),
  dir: import_zod72.z.string().startsWith("/workspace"),
  bytes: import_zod72.z.number().int().positive().max(64 * 1024 ** 3),
  sha256: import_zod72.z.string().regex(/^[a-f0-9]{64}$/),
  createdAt: import_zod72.z.number().int().positive(),
  expiresAt: import_zod72.z.number().int().positive()
}).strict();
var archiveCaptureResultSchema = import_zod72.z.object({
  bytes: import_zod72.z.number().int().positive().max(64 * 1024 ** 3),
  sha256: import_zod72.z.string().regex(/^[a-f0-9]{64}$/)
}).strict();
var archiveUploadResultSchema = import_zod72.z.object({ etag: import_zod72.z.string().min(1).nullable() }).strict();

// packages/schema/src/assistant/instructions.ts
var import_zod73 = require("zod");

// packages/schema/src/assistant/instructions/constants.ts
var PROJECT_INSTRUCTION_MAX_BYTES = 16e3;
var PROJECT_INSTRUCTION_MAX_FILES = 32;

// packages/schema/src/assistant/instructions.ts
var assistantProjectInstructionsSchema = import_zod73.z.object({
  files: import_zod73.z.array(
    import_zod73.z.object({
      path: import_zod73.z.string().max(1024),
      content: import_zod73.z.string().max(PROJECT_INSTRUCTION_MAX_BYTES),
      revision: import_zod73.z.string().max(128)
    })
  ).max(PROJECT_INSTRUCTION_MAX_FILES),
  skipped: import_zod73.z.array(import_zod73.z.string().max(1024)).max(256)
});

// packages/schema/src/assistant/catalog.ts
var import_zod74 = require("zod");
var assistantCatalogEntrySchema = import_zod74.z.object({
  name: import_zod74.z.string().min(1).max(80),
  description: import_zod74.z.string().max(1e4),
  author: import_zod74.z.string().max(256),
  available: import_zod74.z.boolean(),
  repository: import_zod74.z.string().max(256).optional(),
  path: import_zod74.z.string().max(512).optional(),
  revision: import_zod74.z.string().max(128).optional()
});
var assistantCatalogSchema = import_zod74.z.object({
  revision: import_zod74.z.string().regex(/^[a-f0-9]{40}$/),
  items: import_zod74.z.array(assistantCatalogEntrySchema).max(1500)
});
var assistantCatalogBundleSchema = import_zod74.z.object({
  entry: assistantCatalogEntrySchema,
  revision: import_zod74.z.string().regex(/^[a-f0-9]{40}$/),
  files: import_zod74.z.array(assistantFileSchema).max(128)
});

// packages/common/src/constants.ts
var PROCESS_ENV = typeof process === "undefined" ? {} : process.env;
var workflowEnvironment = (variables = {}) => {
  const environment = Object.fromEntries(
    Object.entries(variables).filter((entry) => typeof entry[1] === "string")
  );
  delete environment.OCTONODE_CLOUD_INTERNAL_TOKEN;
  delete environment.OCTONODE_CHAT_SERVICE_TOKEN;
  delete environment.OCTONODE_API_TOKEN;
  delete environment.OPENAI_API_KEY;
  return environment;
};
var childProcessEnvironment = (overrides = {}) => workflowEnvironment({ ...PROCESS_ENV, ...overrides });
var OCTONODE_PACKAGE_CACHE = () => PROCESS_ENV.OCTONODE_PACKAGE_CACHE;
var OCTONODE_MARKETPLACE_TOKEN = () => PROCESS_ENV.OCTONODE_MARKETPLACE_TOKEN ?? PROCESS_ENV.VITE_OCTONODE_MARKETPLACE_TOKEN ?? PROCESS_ENV.VITE_PUBLIC_OCTONODE_MARKETPLACE_TOKEN;
var OCTONODE_MARKETPLACE_URL = () => PROCESS_ENV.OCTONODE_MARKETPLACE_URL ?? PROCESS_ENV.VITE_OCTONODE_MARKETPLACE_URL ?? PROCESS_ENV.VITE_PUBLIC_OCTONODE_MARKETPLACE_URL;
var DEFAULT_MARKETPLACE_URL = "https://plugins.octonodes.com";
var OCTONODE_RUNTIME = () => PROCESS_ENV.OCTONODE_RUNTIME;
var OCTONODE_USER = () => PROCESS_ENV.OCTONODE_USER;

// packages/common/src/package/cache.ts
function packageCacheEnvironment(root) {
  return {
    // Cache roots are local to a trusted host/container, never a cross-tenant filesystem.
    OCTONODE_PACKAGE_CACHE: root,
    npm_config_cache: `${root}/npm`,
    YARN_ENABLE_GLOBAL_CACHE: "true",
    YARN_GLOBAL_FOLDER: `${root}/yarn`,
    YARN_CACHE_FOLDER: `${root}/yarn/cache`,
    npm_config_store_dir: `${root}/pnpm`,
    PNPM_CONFIG_STORE_DIR: `${root}/pnpm`,
    npm_config_package_import_method: "clone-or-copy",
    PNPM_CONFIG_PACKAGE_IMPORT_METHOD: "clone-or-copy",
    BUN_INSTALL_CACHE_DIR: `${root}/bun`
  };
}

// packages/plugin-runtime/src/plugin/file.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var import_yaml = require("yaml");
function pluginDefinitionPath(dir) {
  const files = PLUGIN_DEFINITION_FILENAMES.map((name) => (0, import_node_path.join)(dir, name)).filter(import_node_fs.existsSync);
  if (files.length !== 1)
    throw new Error(
      files.length ? `Multiple plugin definitions in ${dir}; keep exactly one` : `No plugin definition in ${dir}; create octonode.yml or octonode.json`
    );
  const file = files[0];
  if ((0, import_node_path.dirname)((0, import_node_fs.realpathSync)(file)) !== (0, import_node_fs.realpathSync)(dir))
    throw new Error("Plugin definition must stay inside its folder");
  if (!(0, import_node_fs.statSync)(file).isFile() || (0, import_node_fs.statSync)(file).size > 1048576)
    throw new Error("Plugin definition must be a file smaller than 1 MiB");
  return file;
}
function loadPluginDefinition(dir) {
  const file = pluginDefinitionPath(dir);
  const source = (0, import_node_fs.readFileSync)(file, "utf8");
  const document = (0, import_yaml.parseDocument)(source, { version: "1.2", uniqueKeys: true });
  (0, import_yaml.visit)(document, {
    Alias() {
      throw new Error("Plugin definitions cannot contain YAML aliases");
    }
  });
  if (document.errors.length || document.warnings.length)
    throw new Error(`${file}: ${[...document.errors, ...document.warnings].map((error) => error.message).join("; ")}`);
  const raw = file.endsWith(".json") ? JSON.parse(source) : document.toJS({ maxAliasCount: 0 });
  if (file.endsWith(PLUGIN_MANIFEST_FILENAME)) return PluginManifest.parse(raw);
  const settings = OctonodeSettingsDocument.parse(raw);
  if (!settings.plugin) throw new Error(`${file} has no plugin section`);
  return settings.plugin;
}

// packages/plugin/src/integrity.ts
var import_node_crypto = require("node:crypto");
var import_node_fs2 = require("node:fs");
var import_node_path2 = require("node:path");

// packages/plugin/src/constants.ts
var PLUGIN_BUNDLE_EXCLUDES = [
  "node_modules",
  "__pycache__",
  ".git",
  ".DS_Store",
  "*.pyc",
  ".env",
  ".env.*",
  "*.pem",
  "*.key"
];
var MAX_CATALOG_MANIFESTS = 512;
var MAX_PLUGIN_DEFINITION_BYTES = 1024 * 1024;
var LOCK_FILENAME = "octonode.lock";

// packages/plugin/src/integrity.ts
function collectFiles(dir, base, files) {
  for (const entry of (0, import_node_fs2.readdirSync)(dir, { withFileTypes: true })) {
    if (PLUGIN_BUNDLE_EXCLUDES.some((pattern) => (0, import_node_path2.matchesGlob)(entry.name, pattern))) continue;
    const path = (0, import_node_path2.join)(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Plugin bundles cannot contain symbolic links: ${entry.name}`);
    if (!entry.isDirectory() && !entry.isFile()) throw new Error(`Unsupported plugin asset: ${entry.name}`);
    if (entry.isDirectory()) collectFiles(path, base, files);
    else files.push((0, import_node_path2.relative)(base, path).split("\\").join("/"));
  }
}
function hashPluginDir(dir) {
  const root = (0, import_node_path2.resolve)(dir);
  const files = pluginBundleFiles(root);
  const hash = (0, import_node_crypto.createHash)("sha256");
  for (const file of files) {
    hash.update(file);
    hash.update("\0");
    hash.update((0, import_node_fs2.readFileSync)((0, import_node_path2.join)(root, file)));
    hash.update("\0");
  }
  return `sha256:${hash.digest("hex")}`;
}
function pluginBundleFiles(dir) {
  const root = (0, import_node_path2.resolve)(dir);
  const files = [];
  collectFiles(root, root, files);
  return files.sort();
}

// packages/plugin/src/store.ts
function pluginStoreRoot() {
  return (0, import_node_path3.join)((0, import_node_os.homedir)(), ".octonode", "store");
}
function shortSha(sha256) {
  return sha256.replace(/^sha256:/, "").slice(0, 8);
}
function storeEntryDir(id2, version, sha256, root = pluginStoreRoot()) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id2) || !/^[a-zA-Z0-9.+_-]+$/.test(version) || !/^sha256:[a-f0-9]{64}$/.test(sha256))
    throw new Error("Invalid plugin store identity");
  const full = (0, import_node_path3.join)(root, `${id2}@${version}-${sha256.slice(7)}`);
  const legacy = (0, import_node_path3.join)(root, `${id2}@${version}-${shortSha(sha256)}`);
  return !(0, import_node_fs3.existsSync)(full) && (0, import_node_fs3.existsSync)(legacy) ? legacy : full;
}
function addToStore(srcDir, opts = {}) {
  const manifest2 = loadPluginDefinition(srcDir);
  const sha256 = hashPluginDir(srcDir);
  const dir = storeEntryDir(manifest2.id, manifest2.version, sha256, opts.storeRoot);
  const created = !(0, import_node_fs3.existsSync)(dir);
  if (created) {
    (0, import_node_fs3.mkdirSync)((0, import_node_path3.dirname)(dir), { recursive: true });
    const staging = (0, import_node_fs3.mkdtempSync)((0, import_node_path3.join)((0, import_node_path3.dirname)(dir), ".plugin-"));
    try {
      (0, import_node_fs3.cpSync)(srcDir, staging, { recursive: true });
      if (hashPluginDir(staging) !== sha256) throw new Error("Plugin changed while copying into the store");
      try {
        (0, import_node_fs3.renameSync)(staging, dir);
      } catch (error) {
        if (!(0, import_node_fs3.existsSync)(dir) || hashPluginDir(dir) !== sha256) throw error;
      }
    } finally {
      (0, import_node_fs3.rmSync)(staging, { recursive: true, force: true });
    }
  }
  if (hashPluginDir(dir) !== sha256) throw new Error(`Corrupt plugin store entry: ${manifest2.id}`);
  return { id: manifest2.id, version: manifest2.version, sha256, dir, manifest: manifest2, created };
}

// packages/plugin/src/loader.ts
var import_node_fs5 = require("node:fs");
var import_node_os2 = require("node:os");
var import_node_path5 = require("node:path");

// packages/plugin/src/lock.ts
var import_node_fs4 = require("node:fs");
var import_node_path4 = require("node:path");
var import_zod75 = require("zod");
var LockEntry = import_zod75.z.object({
  /** False only for pins introduced exclusively by a toolkit. Legacy pins are direct. */
  direct: import_zod75.z.boolean().optional(),
  installedAt: import_zod75.z.number().int().nonnegative().max(864e13).optional(),
  version: import_zod75.z.string(),
  /** `sha256:<hex>` dir-content hash (hashPluginDir) — the store address + integrity check. */
  sha256: import_zod75.z.string(),
  /** Registry archive checksum, distinct from the unpacked file-tree identity. */
  archiveSha256: import_zod75.z.string().regex(/^[a-f0-9]{64}$/).optional(),
  /** Marketplace base URL the bundle came from (absent for local installs). */
  registry: import_zod75.z.string().optional(),
  /** Marketplace tier it was resolved from. */
  scope: PluginScope.optional(),
  /** Permissions granted at install consent, frozen per locked version. */
  permissions: import_zod75.z.array(PluginPermission).optional(),
  /** Hosted marketplace install record used to report uninstall analytics. */
  installId: import_zod75.z.string().optional(),
  /** Original manifest ID; record key remains the project-local alias. */
  pluginId: import_zod75.z.string().regex(/^[a-z0-9][a-z0-9-]*$/).optional(),
  /** Registry-qualified marketplace ID (may differ from the manifest ID for private publications). */
  remoteId: import_zod75.z.string().optional(),
  publisher: import_zod75.z.string().optional()
});
var Lockfile = import_zod75.z.object({
  lockfileVersion: import_zod75.z.union([import_zod75.z.literal(1), import_zod75.z.literal(2)]).default(1),
  plugins: import_zod75.z.record(LockEntry).default({}),
  managedDependencies: import_zod75.z.record(import_zod75.z.string()).optional(),
  toolkits: import_zod75.z.record(
    import_zod75.z.object({
      id: import_zod75.z.string(),
      registry: import_zod75.z.string().url(),
      version: import_zod75.z.string(),
      sha256: import_zod75.z.string().regex(/^[a-f0-9]{64}$/),
      plugins: import_zod75.z.array(import_zod75.z.string()),
      developmentPlugins: import_zod75.z.array(import_zod75.z.string()).optional(),
      destination: ToolkitOwner,
      mode: import_zod75.z.enum(["development", "production"]).optional(),
      actions: import_zod75.z.array(ToolkitAction).max(100).optional()
    }).strict()
  ).optional(),
  generated: import_zod75.z.object({
    name: import_zod75.z.literal("@octonodes/plugin"),
    spec: import_zod75.z.string().regex(/^file:\.\/\.octonode-generated\/plugin-[a-f0-9]{64}\.tgz$/),
    subpaths: import_zod75.z.array(import_zod75.z.string()),
    packer: import_zod75.z.string(),
    sha256: import_zod75.z.string().regex(/^sha256:[a-f0-9]{64}$/)
  }).strict().optional()
});
function lockfilePath(cwd = process.cwd()) {
  return (0, import_node_path4.join)(cwd, LOCK_FILENAME);
}
function readLockfile(cwd = process.cwd()) {
  const file = lockfilePath(cwd);
  if (!(0, import_node_fs4.existsSync)(file)) return Lockfile.parse({});
  try {
    return Lockfile.parse(JSON.parse((0, import_node_fs4.readFileSync)(file, "utf8")));
  } catch (err) {
    throw new Error(`${file} is not a valid lockfile: ${err instanceof Error ? err.message : String(err)}`);
  }
}
function writeLockfile(cwd, lock) {
  const parsed = Lockfile.parse(lock);
  const previous = readLockfile(cwd).plugins;
  const now = Date.now();
  const plugins = Object.fromEntries(
    Object.entries(parsed.plugins).sort(([a], [b2]) => a.localeCompare(b2)).map(([id2, entry]) => [
      id2,
      {
        ...entry,
        installedAt: entry.installedAt ?? previous[id2]?.installedAt ?? (previous[id2] ? void 0 : now)
      }
    ])
  );
  const staging = (0, import_node_fs4.mkdtempSync)((0, import_node_path4.join)(cwd, ".octonode-lock-"));
  try {
    (0, import_node_fs4.writeFileSync)((0, import_node_path4.join)(staging, "lock"), JSON.stringify({ ...parsed, plugins }, null, 2) + "\n", "utf8");
    (0, import_node_fs4.renameSync)((0, import_node_path4.join)(staging, "lock"), lockfilePath(cwd));
  } finally {
    (0, import_node_fs4.rmSync)(staging, { recursive: true, force: true });
  }
  return { ...parsed, plugins };
}
function upsertLockEntry(cwd, id2, entry) {
  const lock = readLockfile(cwd);
  const previous = lock.plugins[id2];
  if (previous && Object.values(lock.toolkits ?? {}).some((toolkit) => toolkit.plugins.includes(id2)) && (previous.version !== entry.version || previous.sha256 !== entry.sha256 || previous.registry !== entry.registry || previous.remoteId !== entry.remoteId || previous.pluginId !== entry.pluginId))
    throw new Error(`Plugin ${id2} is required by an installed toolkit; update the toolkit first`);
  const next = { ...lock, plugins: { ...lock.plugins, [id2]: LockEntry.parse(entry) } };
  return writeLockfile(cwd, next);
}

// packages/plugin/src/loader.ts
function userPluginRoot() {
  return (0, import_node_path5.join)((0, import_node_os2.homedir)(), ".octonode", "plugins");
}
function projectPluginRoot(cwd = process.cwd()) {
  return (0, import_node_path5.join)(cwd, "octonode_plugins");
}
function loadPluginManifest(dir) {
  return loadPluginDefinition(dir);
}
function loadPlugin(dir, source = "user") {
  return { manifest: loadPluginManifest(dir), dir, source };
}
function isPluginDir(dir) {
  return PLUGIN_DEFINITION_FILENAMES.some((name) => (0, import_node_fs5.existsSync)((0, import_node_path5.join)(dir, name)));
}
function pluginDirsIn(root) {
  if (!(0, import_node_fs5.existsSync)(root)) return [];
  const out = [];
  for (const name of (0, import_node_fs5.readdirSync)(root)) {
    if (name.startsWith(".")) continue;
    const dir = (0, import_node_path5.join)(root, name);
    try {
      if ((0, import_node_fs5.statSync)(dir).isDirectory() && isPluginDir(dir)) out.push(dir);
    } catch {
    }
  }
  return out;
}
function discoverPluginCatalog(opts = {}) {
  return discover(opts, true);
}
var catalogManifests = /* @__PURE__ */ new Map();
function catalogManifest(dir) {
  const path = pluginDefinitionPath(dir);
  const stat = (0, import_node_fs5.statSync)(path);
  const revision2 = `${stat.dev}:${stat.ino}:${stat.size}:${stat.mtimeMs}:${stat.ctimeMs}`;
  const cached = catalogManifests.get(path);
  if (cached?.revision === revision2) return cached.manifest;
  const manifest2 = loadPluginManifest(dir);
  if (catalogManifests.size >= MAX_CATALOG_MANIFESTS) catalogManifests.delete(catalogManifests.keys().next().value);
  catalogManifests.set(path, { revision: revision2, manifest: manifest2 });
  return manifest2;
}
function discover(opts, metadataOnly) {
  const plugins = [];
  const errors = [];
  const seen = /* @__PURE__ */ new Set();
  const scanRoot = (root, source) => {
    for (const dir of pluginDirsIn(root)) {
      try {
        const manifest2 = metadataOnly ? catalogManifest(dir) : loadPluginManifest(dir);
        if (seen.has(manifest2.id)) continue;
        seen.add(manifest2.id);
        plugins.push({ manifest: manifest2, dir, source });
      } catch (err) {
        errors.push({ dir, message: err.message });
      }
    }
  };
  scanRoot(projectPluginRoot(opts.cwd), "project");
  try {
    const lock = readLockfile(opts.cwd);
    for (const [id2, entry] of Object.entries(lock.plugins)) {
      if (seen.has(id2)) continue;
      const dir = storeEntryDir(entry.pluginId ?? id2, entry.version, entry.sha256, opts.storeRoot);
      if (!isPluginDir(dir)) {
        errors.push({
          dir,
          message: `plugin "${id2}"@${entry.version} is locked but missing from the store \u2014 run \`octonode install\``
        });
        continue;
      }
      try {
        const manifest2 = metadataOnly ? catalogManifest(dir) : loadPluginManifest(dir);
        if (manifest2.id !== (entry.pluginId ?? id2) || manifest2.version !== entry.version || !metadataOnly && hashPluginDir(dir) !== entry.sha256)
          throw new Error(`Locked plugin ${id2} failed identity or integrity validation; run octonode install`);
        seen.add(id2);
        plugins.push({
          manifest: { ...manifest2, id: id2 },
          originalId: manifest2.id,
          dir,
          source: "store",
          installedAt: entry.installedAt
        });
      } catch (err) {
        errors.push({ dir, message: err.message });
      }
    }
  } catch (err) {
    errors.push({ dir: opts.cwd ?? process.cwd(), message: err.message });
  }
  scanRoot(opts.userRoot ?? userPluginRoot(), "user");
  return { plugins, errors };
}

// packages/plugin/src/dependencies.ts
var import_node_child_process = require("node:child_process");
var import_node_fs7 = require("node:fs");
var import_node_os4 = require("node:os");
var import_node_path7 = require("node:path");
var import_node_util = require("node:util");
var import_yaml2 = require("yaml");
var import_semver = __toESM(require_semver2());

// packages/plugin/src/dependencies.constants.ts
var DEFAULT_PACKAGE_MANAGER = "pnpm@12.3.4";
var CLASSIC_YARN = "yarn@1.22.22";
var DEPENDENCY_INSTALL_TIMEOUT_MS = 10 * 6e4;
var DEPENDENCY_MUTEX = ".octonode-install-lock";
var PACKAGE_MANAGER_LOCKS = {
  npm: ["npm-shrinkwrap.json", "package-lock.json"],
  yarn: ["yarn.lock"],
  pnpm: ["pnpm-lock.yaml"],
  bun: ["bun.lock", "bun.lockb"]
};

// packages/plugin/src/dependency/snapshot.ts
var import_node_crypto2 = require("node:crypto");
var import_node_fs6 = require("node:fs");
var import_node_path6 = require("node:path");
var import_node_os3 = require("node:os");
var import_zod76 = require("zod");

// packages/plugin/src/dependency/snapshot.constants.ts
var DEPENDENCY_SNAPSHOT_FORMAT = 1;
var DEPENDENCY_SNAPSHOT_MAX_BYTES = 256 * 1024 * 1024;
var DEPENDENCY_SNAPSHOT_MAX_FILES = 5e4;
var DEPENDENCY_SNAPSHOT_OUTPUTS = [
  "node_modules",
  ".pnp.cjs",
  ".pnp.loader.mjs",
  ".pnp.data.json",
  ".yarn/cache",
  ".yarn/unplugged",
  ".yarn/install-state.gz"
];

// packages/plugin/src/dependency/snapshot.ts
function inside(root, path) {
  const local = (0, import_node_path6.relative)(root, path);
  return local === "" || !(0, import_node_path6.isAbsolute)(local) && local !== ".." && !local.startsWith(`..${import_node_path6.sep}`);
}
function digestTree(root, paths2, projectRoot) {
  const hash = (0, import_node_crypto2.createHash)("sha256");
  let bytes = 0;
  let count = 0;
  const visit3 = (path) => {
    if (++count > DEPENDENCY_SNAPSHOT_MAX_FILES) throw new Error("Dependency snapshot file limit");
    const file = (0, import_node_path6.join)(root, path);
    for (let parent = (0, import_node_path6.dirname)(file); inside(root, parent); parent = (0, import_node_path6.dirname)(parent)) {
      if ((0, import_node_fs6.lstatSync)(parent).isSymbolicLink()) throw new Error("Dependency snapshot ancestor is a link");
      if (parent === root) break;
    }
    const stat = (0, import_node_fs6.lstatSync)(file);
    hash.update(
      JSON.stringify([
        path,
        stat.mode & 511,
        stat.isDirectory() ? "directory" : stat.isSymbolicLink() ? "link" : "file"
      ])
    );
    if (stat.isSymbolicLink()) {
      const link = (0, import_node_fs6.readlinkSync)(file);
      if (!inside(projectRoot, (0, import_node_path6.resolve)((0, import_node_path6.dirname)((0, import_node_path6.join)(projectRoot, path)), link)))
        throw new Error("Dependency snapshot link leaves project");
      hash.update(JSON.stringify(link));
    } else if (stat.isDirectory()) {
      for (const name of (0, import_node_fs6.readdirSync)(file).sort()) visit3((0, import_node_path6.join)(path, name));
    } else if (stat.isFile()) {
      bytes += stat.size;
      if (bytes > DEPENDENCY_SNAPSHOT_MAX_BYTES) throw new Error("Dependency snapshot size limit");
      hash.update(String(stat.size)).update("\0").update((0, import_node_fs6.readFileSync)(file));
    } else throw new Error("Unsupported dependency snapshot file");
  };
  for (const path of [...paths2].sort()) visit3(path);
  return hash.digest("hex");
}
function dependencySnapshot(project, cacheRoot, managerVersion, environment) {
  try {
    if (inside(cacheRoot, project.root)) return;
    if (!PACKAGE_MANAGER_LOCKS[project.manager].some((name) => (0, import_node_fs6.existsSync)((0, import_node_path6.join)(project.root, name)))) return;
    const outputs = new Set(DEPENDENCY_SNAPSHOT_OUTPUTS);
    let inputCount = 0;
    if (/--(?:require|import|loader|experimental-loader)(?:[=\s]|$)/.test(environment.NODE_OPTIONS ?? "")) return;
    const walk = (directory) => (0, import_node_fs6.readdirSync)(directory).sort().flatMap((name) => {
      const file = (0, import_node_path6.join)(directory, name);
      const local = (0, import_node_path6.relative)(project.root, file);
      if (inside(cacheRoot, file) || outputs.has(local) || name === "node_modules" || name === ".git" || name === ".octonode" || name === DEPENDENCY_MUTEX || name.startsWith(".octonode-recovery-"))
        return [];
      if (++inputCount > DEPENDENCY_SNAPSHOT_MAX_FILES) throw new Error("Dependency input file limit");
      const stat = (0, import_node_fs6.lstatSync)(file);
      if (stat.isSymbolicLink()) throw new Error("Linked source is not snapshot eligible");
      if (/^\.?pnpmfile\.[cm]?js$/.test(name))
        throw new Error("Dynamic package-manager hooks require installation");
      if (name === ".yarnrc.yml" && /^(?:plugins|yarnPath):/m.test((0, import_node_fs6.readFileSync)(file, "utf8")))
        throw new Error("Custom Yarn code requires installation");
      if (stat.isDirectory()) return walk(file);
      else {
        if (name === "package.json") {
          const manifest2 = JSON.parse((0, import_node_fs6.readFileSync)(file, "utf8"));
          for (const dependencies of [
            manifest2.dependencies,
            manifest2.devDependencies,
            manifest2.optionalDependencies
          ]) {
            for (const spec of Object.values(dependencies ?? {})) {
              if (typeof spec !== "string") throw new Error("Invalid dependency");
              const localSpec = /^(?:file:|link:|portal:)(.*)$/.exec(spec);
              if (localSpec) {
                const target = (0, import_node_path6.resolve)(directory, localSpec[1]);
                if (!inside(project.root, target) || inside(cacheRoot, target) || (0, import_node_path6.relative)(project.root, target).split(import_node_path6.sep).some((part) => ["node_modules", ".git", ".octonode"].includes(part)))
                  throw new Error("External or excluded dependency is not snapshot eligible");
              }
            }
          }
          outputs.add((0, import_node_path6.relative)(project.root, (0, import_node_path6.join)(directory, "node_modules")));
        }
        return [local];
      }
    });
    const inputs = walk(project.root);
    const inputHash = digestTree(project.root, inputs, project.root);
    const userRoot = environment.HOME ?? (0, import_node_os3.homedir)();
    const configuration = new Set(
      [
        (0, import_node_path6.join)(userRoot, ".npmrc"),
        (0, import_node_path6.join)(userRoot, ".yarnrc"),
        (0, import_node_path6.join)(userRoot, ".yarnrc.yml"),
        (0, import_node_path6.join)(userRoot, ".config/pnpm/rc"),
        "/etc/npmrc",
        "/usr/local/etc/npmrc",
        environment.npm_config_userconfig,
        environment.NPM_CONFIG_USERCONFIG,
        environment.npm_config_globalconfig,
        environment.NPM_CONFIG_GLOBALCONFIG
      ].filter((path) => !!path)
    );
    for (let cursor = (0, import_node_path6.dirname)(project.root); ; cursor = (0, import_node_path6.dirname)(cursor)) {
      for (const name of [".npmrc", ".yarnrc", ".yarnrc.yml"]) configuration.add((0, import_node_path6.join)(cursor, name));
      if (cursor === (0, import_node_path6.dirname)(cursor)) break;
    }
    const configHash = [...configuration].sort().map((file) => {
      if (!(0, import_node_fs6.existsSync)(file)) return [file, null];
      if (/(?:yarnPath|plugins|pnpmfile)/.test((0, import_node_fs6.readFileSync)(file, "utf8")))
        throw new Error("Custom package-manager configuration requires installation");
      return [file, digestTree((0, import_node_path6.dirname)(file), [(0, import_node_path6.relative)((0, import_node_path6.dirname)(file), file)], (0, import_node_path6.dirname)(file))];
    });
    const yarnCache = (0, import_node_path6.join)(cacheRoot, "yarn");
    const nativeCache = project.manager === "yarn" && (0, import_node_fs6.existsSync)(yarnCache) ? digestTree(yarnCache, (0, import_node_fs6.readdirSync)(yarnCache), yarnCache) : null;
    const key = (0, import_node_crypto2.createHash)("sha256").update(
      JSON.stringify({
        format: DEPENDENCY_SNAPSHOT_FORMAT,
        root: project.root,
        cacheRoot,
        manager: project.manager,
        managerVersion,
        declared: project.declared,
        platform: process.platform,
        arch: process.arch,
        kernel: (0, import_node_os3.release)(),
        runtime: process.versions,
        environment: Object.entries(environment).sort(([a], [b2]) => a.localeCompare(b2)),
        inputHash,
        configHash,
        nativeCache
      })
    ).digest("hex");
    const projectKey = (0, import_node_crypto2.createHash)("sha256").update(project.root).digest("hex");
    return {
      root: project.root,
      cacheRoot,
      directory: (0, import_node_path6.join)(cacheRoot, "prepared-v1", projectKey),
      key,
      outputs: [...outputs].sort()
    };
  } catch {
    return void 0;
  }
}
function copy(source, destination) {
  (0, import_node_fs6.cpSync)(source, destination, {
    recursive: true,
    dereference: false,
    verbatimSymlinks: true,
    mode: import_node_fs6.constants.COPYFILE_FICLONE
  });
}
function restoreDependencySnapshot(snapshot) {
  let staging;
  let activated = [];
  let previous = [];
  try {
    if ((0, import_node_fs6.lstatSync)(snapshot.directory, { throwIfNoEntry: false })?.isSymbolicLink()) return false;
    const record = import_zod76.z.object({
      format: import_zod76.z.literal(DEPENDENCY_SNAPSHOT_FORMAT),
      key: import_zod76.z.literal(snapshot.key),
      sha256: import_zod76.z.string().regex(/^[a-f0-9]{64}$/),
      outputs: import_zod76.z.array(import_zod76.z.string()).refine(
        (paths2) => new Set(paths2).size === paths2.length && paths2.every((path) => snapshot.outputs.includes(path))
      )
    }).parse(JSON.parse((0, import_node_fs6.readFileSync)((0, import_node_path6.join)(snapshot.directory, "snapshot.json"), "utf8")));
    const stored = (0, import_node_path6.join)(snapshot.directory, "files");
    if (!record.outputs.length || digestTree(stored, record.outputs, snapshot.root) !== record.sha256) return false;
    for (const path of snapshot.outputs) {
      for (let cursor = (0, import_node_path6.dirname)((0, import_node_path6.join)(snapshot.root, path)); inside(snapshot.root, cursor); cursor = (0, import_node_path6.dirname)(cursor)) {
        if ((0, import_node_fs6.lstatSync)(cursor, { throwIfNoEntry: false })?.isSymbolicLink()) return false;
        if (cursor === snapshot.root) break;
      }
    }
    staging = (0, import_node_fs6.mkdtempSync)((0, import_node_path6.join)(snapshot.root, DEPENDENCY_MUTEX, "snapshot-"));
    for (const path of record.outputs) copy((0, import_node_path6.join)(stored, path), (0, import_node_path6.join)(staging, "next", path));
    if (digestTree((0, import_node_path6.join)(staging, "next"), record.outputs, snapshot.root) !== record.sha256) return false;
    for (const path of snapshot.outputs) {
      const target = (0, import_node_path6.join)(snapshot.root, path);
      if ((0, import_node_fs6.lstatSync)(target, { throwIfNoEntry: false })) {
        const backup = (0, import_node_path6.join)(staging, "previous", path);
        (0, import_node_fs6.mkdirSync)((0, import_node_path6.dirname)(backup), { recursive: true });
        (0, import_node_fs6.renameSync)(target, backup);
        previous = [...previous, path];
      }
      if (record.outputs.includes(path)) {
        (0, import_node_fs6.mkdirSync)((0, import_node_path6.dirname)(target), { recursive: true });
        (0, import_node_fs6.renameSync)((0, import_node_path6.join)(staging, "next", path), target);
        activated = [...activated, path];
      }
    }
    return true;
  } catch {
    try {
      for (const path of [...activated].reverse()) (0, import_node_fs6.rmSync)((0, import_node_path6.join)(snapshot.root, path), { recursive: true, force: true });
      for (const path of [...previous].reverse())
        (0, import_node_fs6.renameSync)((0, import_node_path6.join)(staging, "previous", path), (0, import_node_path6.join)(snapshot.root, path));
    } catch {
      const retained = staging;
      staging = void 0;
      throw new Error(`Dependency snapshot activation failed; previous files retained in ${retained}`);
    }
    return false;
  } finally {
    if (staging) (0, import_node_fs6.rmSync)(staging, { recursive: true, force: true });
  }
}
function saveDependencySnapshot(snapshot) {
  let staging;
  try {
    const outputs = snapshot.outputs.filter((path) => (0, import_node_fs6.lstatSync)((0, import_node_path6.join)(snapshot.root, path), { throwIfNoEntry: false }));
    if (!outputs.length) return;
    const sha256 = digestTree(snapshot.root, outputs, snapshot.root);
    (0, import_node_fs6.mkdirSync)((0, import_node_path6.dirname)(snapshot.directory), { recursive: true });
    staging = (0, import_node_fs6.mkdtempSync)((0, import_node_path6.join)((0, import_node_path6.dirname)(snapshot.directory), ".prepared-"));
    for (const path of outputs) copy((0, import_node_path6.join)(snapshot.root, path), (0, import_node_path6.join)(staging, "files", path));
    if (digestTree((0, import_node_path6.join)(staging, "files"), outputs, snapshot.root) !== sha256) return;
    (0, import_node_fs6.writeFileSync)(
      (0, import_node_path6.join)(staging, "snapshot.json"),
      JSON.stringify({ format: DEPENDENCY_SNAPSHOT_FORMAT, key: snapshot.key, sha256, outputs })
    );
    (0, import_node_fs6.rmSync)(snapshot.directory, { recursive: true, force: true });
    (0, import_node_fs6.renameSync)(staging, snapshot.directory);
  } catch {
  } finally {
    if (staging) (0, import_node_fs6.rmSync)(staging, { recursive: true, force: true });
  }
}

// packages/plugin/src/dependencies.ts
var execute = (0, import_node_util.promisify)(import_node_child_process.execFile);
var installations = /* @__PURE__ */ new Map();
function checkTransactionPath(root, file) {
  const local = (0, import_node_path7.relative)(root, file);
  if (!local || local.startsWith("../") || (0, import_node_path7.resolve)(root, local) !== file)
    throw new Error("Transaction path must stay inside its project");
  for (let cursor = file; cursor !== root; cursor = (0, import_node_path7.dirname)(cursor)) {
    const stat = (0, import_node_fs7.lstatSync)(cursor, { throwIfNoEntry: false });
    if (stat?.isSymbolicLink()) throw new Error("Transaction path contains a symbolic link");
  }
}
function manifest(root) {
  const file = (0, import_node_path7.join)(root, "package.json");
  return (0, import_node_fs7.existsSync)(file) ? JSON.parse((0, import_node_fs7.readFileSync)(file, "utf8")) : {};
}
function dependencyCacheRoot(root) {
  return (0, import_node_path7.resolve)(root ?? OCTONODE_PACKAGE_CACHE() ?? (0, import_node_path7.join)((0, import_node_os4.homedir)(), ".octonode", "package-cache"));
}
function dependencyPaths(cwd) {
  const start2 = (0, import_node_fs7.realpathSync)(cwd);
  if (!(0, import_node_fs7.existsSync)((0, import_node_path7.join)(start2, "package.json")) && ((0, import_node_fs7.existsSync)((0, import_node_path7.join)(start2, "pyproject.toml")) || (0, import_node_fs7.existsSync)((0, import_node_path7.join)(start2, "octonode.lock"))))
    return { root: start2, target: start2 };
  const ancestors = [];
  for (let path = start2; ; path = (0, import_node_path7.dirname)(path)) {
    ancestors.push(path);
    if ((0, import_node_fs7.existsSync)((0, import_node_path7.join)(path, ".git")) || (0, import_node_path7.dirname)(path) === path) break;
  }
  const repository = ancestors.find((path) => (0, import_node_fs7.existsSync)((0, import_node_path7.join)(path, ".git")));
  const target = (0, import_node_fs7.existsSync)((0, import_node_path7.join)(start2, "package.json")) ? start2 : repository ? ancestors.find((path) => (0, import_node_fs7.existsSync)((0, import_node_path7.join)(path, "package.json"))) ?? start2 : start2;
  const root = ancestors.find((path) => {
    if (path === target || !(0, import_node_path7.relative)(path, target) || (0, import_node_path7.relative)(path, target).startsWith("..")) return false;
    const workspaces = manifest(path).workspaces;
    const pnpmWorkspace = (0, import_node_path7.join)(path, "pnpm-workspace.yaml");
    const patterns = (0, import_node_fs7.existsSync)(pnpmWorkspace) ? (0, import_yaml2.parse)((0, import_node_fs7.readFileSync)(pnpmWorkspace, "utf8"))?.packages : Array.isArray(workspaces) ? workspaces : workspaces?.packages;
    if (!Array.isArray(patterns)) return false;
    const local = (0, import_node_path7.relative)(path, target).split("\\").join("/");
    const globs = patterns.filter((value) => typeof value === "string");
    return globs.some((pattern) => !pattern.startsWith("!") && (0, import_node_path7.matchesGlob)(local, pattern.replace(/\/$/, ""))) && !globs.some((pattern) => pattern.startsWith("!") && (0, import_node_path7.matchesGlob)(local, pattern.slice(1).replace(/\/$/, "")));
  }) ?? target;
  return { root, target };
}
function resolveDependencyProject(cwd) {
  const { root, target } = dependencyPaths(cwd);
  const declared = manifest(root).packageManager;
  const locked = Object.keys(PACKAGE_MANAGER_LOCKS).filter(
    (manager2) => PACKAGE_MANAGER_LOCKS[manager2].some((file) => (0, import_node_fs7.existsSync)((0, import_node_path7.join)(root, file)))
  );
  const manager = declared?.split("@")[0];
  if (manager && !(manager in PACKAGE_MANAGER_LOCKS)) throw new Error(`unsupported package manager: ${declared}`);
  if (locked.length > 1 || manager && locked.some((lockedManager) => lockedManager !== manager)) {
    throw new Error("conflicting package managers: keep the lockfile matching package.json packageManager");
  }
  return {
    target,
    root,
    manager: manager ?? locked[0] ?? ((0, import_node_fs7.existsSync)((0, import_node_path7.join)(root, "pnpm-workspace.yaml")) ? "pnpm" : (0, import_node_fs7.existsSync)((0, import_node_path7.join)(target, "package.json")) ? "npm" : "pnpm"),
    declared
  };
}
function packageManagerAdd(manager, ...specs) {
  switch (manager) {
    case "yarn":
      return ["yarn", ["add", "--exact", "--mode=skip-build", ...specs]];
    case "pnpm":
      return ["pnpm", ["add", "--save-exact", "--ignore-scripts", ...specs]];
    case "bun":
      return ["bun", ["add", "--exact", "--ignore-scripts", ...specs]];
    case "npm":
      return ["npm", ["install", "--save-exact", "--ignore-scripts", "--no-audit", "--no-fund", ...specs]];
  }
}
function installCommand(project, frozen) {
  switch (project.manager) {
    case "yarn":
      return ["yarn", ["install", ...frozen ? ["--immutable"] : [], "--mode=skip-build"]];
    case "pnpm":
      return ["pnpm", ["install", ...frozen ? ["--frozen-lockfile"] : [], "--ignore-scripts"]];
    case "bun":
      return ["bun", ["install", ...frozen ? ["--frozen-lockfile"] : [], "--ignore-scripts"]];
    case "npm":
      return ["npm", [frozen ? "ci" : "install", "--ignore-scripts", "--no-audit", "--no-fund"]];
  }
}
function installEnvironment(cacheRoot) {
  return childProcessEnvironment({
    ...packageCacheEnvironment(dependencyCacheRoot(cacheRoot)),
    YARN_ENABLE_SCRIPTS: "false",
    // Frozen installs opt in with --immutable; CI must not freeze mutable operations.
    YARN_ENABLE_IMMUTABLE_INSTALLS: "false",
    COREPACK_ENABLE_DOWNLOAD_PROMPT: "0",
    COREPACK_ENABLE_AUTO_PIN: "0"
  });
}
function isClassicYarn(project) {
  return project.manager === "yarn" && (project.declared?.startsWith("yarn@1.") || !project.declared && (0, import_node_fs7.existsSync)((0, import_node_path7.join)(project.root, "yarn.lock")) && (0, import_node_fs7.readFileSync)((0, import_node_path7.join)(project.root, "yarn.lock"), "utf8").includes("# yarn lockfile v1"));
}
async function run(project, command, cwd, cacheRoot) {
  const [file, args] = command;
  const yarnClassic = isClassicYarn(project);
  const flags = yarnClassic ? [
    ...args.filter((arg) => arg !== "--mode=skip-build").map((arg) => arg === "--immutable" ? "--frozen-lockfile" : arg),
    "--ignore-scripts"
  ] : project.manager === "pnpm" && args[0] === "add" && project.root === cwd && (0, import_node_fs7.existsSync)((0, import_node_path7.join)(cwd, "pnpm-workspace.yaml")) ? [...args, "--workspace-root"] : args;
  const pinned = project.declared && file !== "bun" || yarnClassic;
  const executable = yarnClassic && !project.declared ? CLASSIC_YARN : file;
  await execute(pinned ? "corepack" : file, pinned ? [executable, ...flags] : flags, {
    cwd,
    env: installEnvironment(cacheRoot),
    timeout: DEPENDENCY_INSTALL_TIMEOUT_MS,
    maxBuffer: 4 * 1024 * 1024
  });
}
async function verifyProjectDependencies(project, names, versions = {}) {
  if (!names.length) return;
  const pnp = (0, import_node_path7.join)(project.root, ".pnp.cjs");
  const loader = (0, import_node_path7.join)(project.root, ".pnp.loader.mjs");
  await execute(
    process.execPath,
    [
      ...(0, import_node_fs7.existsSync)(pnp) ? ["--require", pnp] : [],
      ...(0, import_node_fs7.existsSync)(loader) ? ["--loader", loader] : [],
      "--input-type=module",
      "-e",
      `import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(${JSON.stringify((0, import_node_path7.join)(project.target, "package.json"))});
const versions = ${JSON.stringify(versions)};
for (const name of ${JSON.stringify(names)}) {
  let resolved;
  try { resolved = require.resolve(name); } catch {
    const entry = import.meta.resolve(name);
    resolved = entry.startsWith('file:') ? fileURLToPath(entry) : undefined;
    if (entry.startsWith('file:') && !existsSync(fileURLToPath(entry))) throw new Error('missing package entry: ' + name);
  }
  const identity = name.startsWith('@') ? name.split('/').slice(0, 2).join('/') : name.split('/')[0];
  if (Object.hasOwn(versions, identity)) {
    let directory = resolved ? dirname(resolved) : '';
    let matched = false;
    while (directory) {
      const file = join(directory, 'package.json');
      if (existsSync(file)) {
        const pkg = JSON.parse(readFileSync(file, 'utf8'));
        if (pkg.name === identity) {
          if (pkg.version !== versions[identity]) throw new Error('installed dependency version mismatch: ' + name);
          matched = true; break;
        }
      }
      const parent = dirname(directory);
      if (parent === directory) break;
      directory = parent;
    }
    if (!matched) throw new Error('cannot verify installed package: ' + name);
  }
}`
    ],
    { cwd: project.target, env: childProcessEnvironment(), timeout: 3e4, maxBuffer: 1024 * 1024 }
  );
}
async function withDependencyInstall(cwd, action) {
  if (process.platform === "win32")
    throw new Error("Plugin dependency lifecycle currently supports macOS and Linux; use WSL on Windows");
  const root = dependencyPaths(cwd).root;
  const previous = installations.get(root) ?? Promise.resolve();
  const next = previous.catch(() => {
  }).then(async () => {
    const mutex = (0, import_node_path7.join)(root, DEPENDENCY_MUTEX);
    try {
      (0, import_node_fs7.mkdirSync)(mutex);
    } catch {
      throw new Error(
        "Another dependency installation is running or needs recovery; use octonodes plugin recover after it exits"
      );
    }
    (0, import_node_fs7.writeFileSync)((0, import_node_path7.join)(mutex, "owner.json"), JSON.stringify({ pid: process.pid }));
    try {
      return await action();
    } finally {
      if (!(0, import_node_fs7.existsSync)((0, import_node_path7.join)(mutex, "journal.json"))) (0, import_node_fs7.rmSync)(mutex, { recursive: true, force: true });
    }
  });
  installations.set(root, next);
  try {
    return await next;
  } finally {
    if (installations.get(root) === next) installations.delete(root);
  }
}
async function reconcileDependencies(cwd, dependencies, options = {}) {
  if (options.metadataOnly && (dependencies.length || options.remove?.length || options.frozen))
    throw new Error("Metadata-only transactions cannot change or restore dependencies");
  if (options.frozen && (dependencies.length || options.remove?.length))
    throw new Error("Frozen installation cannot add or remove dependencies");
  for (const { name, spec, subpaths } of dependencies) {
    if (!/^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/i.test(name) || !spec.trim() || spec.startsWith("-")) {
      throw new Error("invalid npm dependency specification");
    }
    if (subpaths && (!subpaths.length || subpaths.some(
      (path) => !/^\.\/[a-z0-9_.-]+(?:\/[a-z0-9_.-]+)*$/i.test(path) || path.split("/").slice(1).some((part) => part === "." || part === "..")
    ))) {
      throw new Error("invalid npm dependency subpath");
    }
  }
  const unique = /* @__PURE__ */ new Map();
  for (const dependency of dependencies) {
    const spec = dependency.spec.startsWith(`${dependency.name}@`) ? dependency.spec.slice(dependency.name.length + 1) : dependency.spec;
    const previous = unique.get(dependency.name);
    if (previous && previous.spec !== spec) throw new Error(`Conflicting dependency requests for ${dependency.name}`);
    unique.set(dependency.name, {
      ...dependency,
      spec,
      ...previous?.subpaths || dependency.subpaths ? { subpaths: [.../* @__PURE__ */ new Set([...previous?.subpaths ?? [], ...dependency.subpaths ?? []])] } : {}
    });
  }
  dependencies = [...unique.values()];
  const project = resolveDependencyProject(cwd);
  const declared = manifest(project.target);
  const existing = { ...declared.devDependencies, ...declared.optionalDependencies, ...declared.dependencies };
  const reusedRanges = dependencies.filter(
    ({ name, spec }) => options.preserveExisting && existing[name] && existing[name] !== spec && (0, import_semver.valid)(spec) && (0, import_semver.satisfies)(spec, existing[name])
  );
  if (reusedRanges.length)
    await verifyProjectDependencies(
      project,
      reusedRanges.map(({ name }) => name),
      Object.fromEntries(reusedRanges.map(({ name, spec }) => [name, spec]))
    );
  if (options.preserveExisting) {
    for (const { name, spec } of dependencies)
      if (Object.hasOwn(existing, name) && existing[name] !== spec && !reusedRanges.some((dependency) => dependency.name === name) && !(existing[name].startsWith("file:") && spec.startsWith("file:") && (0, import_node_path7.resolve)(project.target, existing[name].slice(5)) === (0, import_node_path7.resolve)(project.target, spec.slice(5))))
        throw new Error(
          `Dependency conflict: ${name} is ${existing[name]}, plugin requires ${spec}; reconcile it explicitly first`
        );
  }
  const reusable = dependencies.length > 0 && !options.remove?.length && dependencies.every(
    ({ name, spec, development }) => ((development ? declared.devDependencies?.[name] === spec : declared.dependencies?.[name] === spec) || reusedRanges.some((dependency) => dependency.name === name)) && (existing[name] === spec || reusedRanges.some((dependency) => dependency.name === name)) && /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(spec)
  );
  const reuse = reusable && await verifyProjectDependencies(
    project,
    dependencies.flatMap(({ name, subpaths }) => subpaths ? subpaths.map((path) => name + path.slice(1)) : [name]),
    Object.fromEntries(dependencies.map(({ name, spec }) => [name, spec]))
  ).then(
    () => true,
    () => false
  );
  const metadataOnly = options.metadataOnly || reuse;
  const packageJson = (0, import_node_path7.join)(project.target, "package.json");
  if (!dependencies.length && !(0, import_node_fs7.existsSync)(packageJson) && !options.commit) return;
  const hasLock = PACKAGE_MANAGER_LOCKS[project.manager].some((file) => (0, import_node_fs7.existsSync)((0, import_node_path7.join)(project.root, file)));
  if (options.frozen && !hasLock)
    throw new Error("commit the native package-manager lockfile before preparing this worktree");
  const files = [
    .../* @__PURE__ */ new Set([
      packageJson,
      (0, import_node_path7.join)(project.root, "package.json"),
      ...Object.values(PACKAGE_MANAGER_LOCKS).flat().map((file) => (0, import_node_path7.join)(project.root, file)),
      (0, import_node_path7.join)(project.root, "pnpm-workspace.yaml"),
      ...options.transactionFiles ?? []
    ])
  ];
  for (const path of files) checkTransactionPath(project.root, path);
  const before = new Map(files.map((path) => [path, (0, import_node_fs7.existsSync)(path) ? (0, import_node_fs7.readFileSync)(path) : void 0]));
  const journal = (0, import_node_path7.join)(project.root, DEPENDENCY_MUTEX, "journal.json");
  const hadModules = (0, import_node_fs7.existsSync)((0, import_node_path7.join)(project.root, "node_modules"));
  const pnpFiles = [".pnp.cjs", ".pnp.loader.mjs", ".pnp.data.json"];
  const pnpBefore = new Map(
    pnpFiles.map((file) => {
      const path = (0, import_node_path7.join)(project.root, file);
      return [path, (0, import_node_fs7.existsSync)(path) ? (0, import_node_fs7.readFileSync)(path) : void 0];
    })
  );
  const hadInstall = hadModules || (0, import_node_fs7.existsSync)((0, import_node_path7.join)(project.root, ".pnp.cjs"));
  let metadataTouched = false;
  const metadata = new Set(options.transactionFiles ?? []);
  const restoreBefore = () => {
    for (const [path, content] of before) {
      if (metadata.has(path) && !metadataTouched) continue;
      if (content === void 0) (0, import_node_fs7.rmSync)(path, { force: true });
      else (0, import_node_fs7.writeFileSync)(path, content);
    }
  };
  if (hadInstall && !hasLock && !metadataOnly)
    throw new Error(
      "create a native lockfile before updating existing dependencies so failed installations can be recovered"
    );
  try {
    if (metadataOnly && (0, import_node_fs7.existsSync)((0, import_node_path7.dirname)(journal))) (0, import_node_fs7.writeFileSync)((0, import_node_path7.join)((0, import_node_path7.dirname)(journal), "metadata-only"), "1");
    if ((0, import_node_fs7.existsSync)((0, import_node_path7.dirname)(journal)))
      (0, import_node_fs7.writeFileSync)(
        journal,
        JSON.stringify(
          [...before].map(([path, content]) => ({
            path: (0, import_node_path7.relative)(project.root, path).replaceAll("\\", "/"),
            content: content?.toString("base64") ?? null
          }))
        )
      );
    if (metadataOnly) {
      metadataTouched = true;
      await options.commit?.();
      (0, import_node_fs7.rmSync)(journal, { force: true });
      (0, import_node_fs7.rmSync)((0, import_node_path7.join)((0, import_node_path7.dirname)(journal), "metadata-only"), { force: true });
      return;
    }
    if (!(0, import_node_fs7.existsSync)(packageJson)) {
      (0, import_node_fs7.mkdirSync)(project.target, { recursive: true });
      (0, import_node_fs7.writeFileSync)(
        packageJson,
        JSON.stringify({ private: true, packageManager: DEFAULT_PACKAGE_MANAGER }, null, 2) + "\n"
      );
    }
    const current = resolveDependencyProject(cwd);
    if (current.root !== project.root || current.target !== project.target)
      throw new Error(
        "Native dependency ownership changed. Initialize package.json in the selected project and review again"
      );
    const snapshotEnvironment = installEnvironment(options.cacheRoot);
    const pinnedManager = current.declared && current.manager !== "bun" || isClassicYarn(current);
    const versionCommand = isClassicYarn(current) && !current.declared ? CLASSIC_YARN : current.manager;
    const managerVersion = options.frozen && (options.cacheRoot || OCTONODE_PACKAGE_CACHE()) ? await execute(
      pinnedManager ? "corepack" : current.manager,
      pinnedManager ? [versionCommand, "--version"] : ["--version"],
      { cwd: current.root, env: snapshotEnvironment, timeout: 3e4 }
    ).then(({ stdout }) => stdout.trim()).catch(() => void 0) : void 0;
    const snapshot = managerVersion ? dependencySnapshot(current, dependencyCacheRoot(options.cacheRoot), managerVersion, snapshotEnvironment) : void 0;
    if (options.remove?.length) {
      for (const name of options.remove)
        if (!/^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/i.test(name))
          throw new Error("Invalid dependency removal");
      const args = current.manager === "npm" ? ["uninstall", "--ignore-scripts", "--no-audit", "--no-fund"] : current.manager === "yarn" ? ["remove", "--mode=skip-build"] : ["remove", "--ignore-scripts"];
      await run(current, [current.manager, [...args, ...options.remove]], current.target, options.cacheRoot);
    }
    const restored = snapshot ? restoreDependencySnapshot(snapshot) : false;
    if (!restored) {
      if (!dependencies.length)
        await run(current, installCommand(current, options.frozen ?? false), current.root, options.cacheRoot);
      for (const development of [false, true]) {
        const group = dependencies.filter((item) => !!item.development === development);
        if (!group.length) continue;
        const manifest2 = JSON.parse((0, import_node_fs7.readFileSync)(packageJson, "utf8"));
        const previousSection = development ? "dependencies" : "devDependencies";
        if (group.some(({ name }) => manifest2[previousSection]?.[name])) {
          for (const { name } of group) delete manifest2[previousSection]?.[name];
          (0, import_node_fs7.writeFileSync)(packageJson, JSON.stringify(manifest2, null, 2) + "\n");
        }
        const [command, args] = packageManagerAdd(
          current.manager,
          ...group.map(({ name, spec }) => spec.startsWith(`${name}@`) ? spec : `${name}@${spec}`)
        );
        if (development) args.splice(1, 0, current.manager === "yarn" ? "--dev" : "--save-dev");
        else if (current.manager === "npm") args.splice(1, 0, "--save-prod");
        await run(current, [command, args], current.target, options.cacheRoot);
      }
    }
    await verifyProjectDependencies(
      current,
      dependencies.flatMap(({ name, subpaths }) => subpaths ? subpaths.map((path) => name + path.slice(1)) : [name])
    );
    if (options.frozen) {
      for (const [path, content] of before) {
        const after = (0, import_node_fs7.existsSync)(path) ? (0, import_node_fs7.readFileSync)(path) : void 0;
        if (content?.equals(after ?? Buffer.alloc(0)) || !content && !after) continue;
        if (path.endsWith("package.json") && content && after && (0, import_node_util.isDeepStrictEqual)(JSON.parse(content.toString()), JSON.parse(after.toString()))) {
          (0, import_node_fs7.writeFileSync)(path, content);
        } else {
          throw new Error(`frozen installation changed ${(0, import_node_path7.relative)(project.root, path)}`);
        }
      }
    }
    for (const path of metadata) {
      const content = before.get(path);
      const current2 = (0, import_node_fs7.existsSync)(path) ? (0, import_node_fs7.readFileSync)(path) : void 0;
      if (!(content?.equals(current2 ?? Buffer.alloc(0)) || !content && !current2))
        throw new Error(
          `Owner metadata changed during installation: ${(0, import_node_path7.relative)(project.root, path)}; refresh and retry`
        );
    }
    metadataTouched = true;
    await options.commit?.();
    (0, import_node_fs7.rmSync)(journal, { force: true });
    if (snapshot && !restored) {
      const after = dependencySnapshot(
        current,
        dependencyCacheRoot(options.cacheRoot),
        managerVersion,
        snapshotEnvironment
      );
      if (after?.key === snapshot.key) saveDependencySnapshot(after);
    }
  } catch (error) {
    const changed = [...before].filter(([path, content]) => (0, import_node_fs7.existsSync)(path) && !content?.equals((0, import_node_fs7.readFileSync)(path)));
    if (changed.length) {
      const backup = (0, import_node_path7.join)(project.root, `.octonode-recovery-${Date.now()}`);
      for (const [path] of changed) {
        checkTransactionPath(project.root, path);
        const target = (0, import_node_path7.join)(backup, (0, import_node_path7.relative)(project.root, path));
        (0, import_node_fs7.mkdirSync)((0, import_node_path7.dirname)(target), { recursive: true });
        (0, import_node_fs7.writeFileSync)(target, (0, import_node_fs7.readFileSync)(path));
      }
      process.stderr.write(`Pre-rollback files preserved in ${backup}
`);
    }
    restoreBefore();
    let recovery = "";
    if (!metadataOnly && hadInstall && hasLock) {
      try {
        await run(project, installCommand(project, true), project.root, options.cacheRoot);
      } catch {
        recovery = "; manifests restored, but dependency recovery failed \u2014 run a frozen install before executing workflows";
      }
      restoreBefore();
    } else if (!metadataOnly && !hadInstall) {
      (0, import_node_fs7.rmSync)((0, import_node_path7.join)(project.root, "node_modules"), { recursive: true, force: true });
    }
    for (const [path, content] of pnpBefore) {
      if (content === void 0) (0, import_node_fs7.rmSync)(path, { force: true });
      else (0, import_node_fs7.writeFileSync)(path, content);
    }
    const failure = error;
    if (!recovery) (0, import_node_fs7.rmSync)(journal, { force: true });
    throw new Error(`package installation failed: ${failure.stderr?.trim() || failure.message}${recovery}`);
  }
}
async function recoverDependencyInstall(cwd) {
  const project = resolveDependencyProject(cwd);
  const mutex = (0, import_node_path7.join)(project.root, DEPENDENCY_MUTEX);
  if (!(0, import_node_fs7.existsSync)(mutex)) return;
  checkTransactionPath(project.root, (0, import_node_path7.join)(mutex, "owner.json"));
  const owner = JSON.parse((0, import_node_fs7.readFileSync)((0, import_node_path7.join)(mutex, "owner.json"), "utf8"));
  if (!Number.isInteger(owner.pid) || owner.pid < 1)
    throw new Error("Invalid installation owner; inspect the transaction manually");
  try {
    process.kill(owner.pid, 0);
    throw new Error("Installation owner is still running");
  } catch (error) {
    if (error.code !== "ESRCH") throw error;
  }
  const journal = (0, import_node_path7.join)(mutex, "journal.json");
  checkTransactionPath(project.root, journal);
  if ((0, import_node_fs7.existsSync)(journal)) {
    const records = JSON.parse((0, import_node_fs7.readFileSync)(journal, "utf8"));
    if (!Array.isArray(records)) throw new Error("Invalid recovery journal");
    for (const record of records) {
      if (!record || typeof record.path !== "string" || !record.path || record.path.includes("\\") || record.path.startsWith("/") || record.path.split("/").some((part) => part === ".." || part === "." || part.includes(":")) || record.content !== null && typeof record.content !== "string")
        throw new Error("Invalid recovery journal path");
      checkTransactionPath(project.root, (0, import_node_path7.join)(project.root, record.path));
      checkTransactionPath(project.root, (0, import_node_path7.join)(mutex, "recovery-backup", record.path));
    }
    for (const record of records) {
      const path = (0, import_node_path7.join)(project.root, record.path);
      if ((0, import_node_fs7.existsSync)(path)) {
        const backup = (0, import_node_path7.join)(mutex, "recovery-backup", record.path);
        (0, import_node_fs7.mkdirSync)((0, import_node_path7.dirname)(backup), { recursive: true });
        if (!(0, import_node_fs7.existsSync)(backup)) (0, import_node_fs7.writeFileSync)(backup, (0, import_node_fs7.readFileSync)(path));
      }
      if (record.content === null) (0, import_node_fs7.rmSync)(path, { force: true });
      else (0, import_node_fs7.writeFileSync)(path, Buffer.from(record.content, "base64"));
    }
    if (!(0, import_node_fs7.existsSync)((0, import_node_path7.join)(mutex, "metadata-only")) && PACKAGE_MANAGER_LOCKS[project.manager].some((file) => (0, import_node_fs7.existsSync)((0, import_node_path7.join)(project.root, file))))
      await run(project, installCommand(project, true), project.root);
  }
  if ((0, import_node_fs7.existsSync)((0, import_node_path7.join)(mutex, "recovery-backup"))) {
    const backup = (0, import_node_path7.join)(project.root, `.octonode-recovery-${Date.now()}`);
    (0, import_node_fs7.renameSync)((0, import_node_path7.join)(mutex, "recovery-backup"), backup);
    process.stderr.write(`Pre-recovery files preserved in ${backup}
`);
  }
  (0, import_node_fs7.rmSync)(mutex, { recursive: true, force: true });
}
function installProjectDependencies(cwd, dependencies = [], options = {}) {
  return withDependencyInstall(cwd, () => reconcileDependencies(cwd, dependencies, options));
}

// packages/plugin/src/generated/package.ts
var import_tar = require("tar");
var import_node_zlib = require("node:zlib");
var import_node_crypto4 = require("node:crypto");
var import_node_fs9 = require("node:fs");
var import_node_os5 = require("node:os");
var import_node_path9 = require("node:path");

// packages/plugin/src/authoring/artifact.ts
var import_node_crypto3 = require("node:crypto");
var import_node_fs8 = require("node:fs");
var import_node_path8 = require("node:path");
var import_yaml3 = require("yaml");

// packages/plugin/src/authoring/constants.ts
var BUILD_RECORD = "octonode-build.json";
var DEFINITION_FILES = ["octonode.yml", "octonode.yaml", "octonode.json", "octonode.plugin.json"];
var FORBIDDEN_PART = /^(?:\.env(?:\..*)?|\.git|\.npmrc|\.pypirc|\.netrc|\.git-credentials|node_modules)$|\.(?:pem|key|p12)$/i;
var RESERVED_ASSETS = /* @__PURE__ */ new Set([
  ...DEFINITION_FILES,
  BUILD_RECORD,
  "package.json",
  "dist",
  "README.md",
  "nodes",
  "workflow-runtime",
  "library"
]);

// packages/plugin/src/authoring/artifact.ts
var fileHash = (path) => (0, import_node_crypto3.createHash)("sha256").update((0, import_node_fs8.readFileSync)(path)).digest("hex");
function safePath(path) {
  if (!path || (0, import_node_path8.isAbsolute)(path) || path.includes("\\") || path.split("/").some((part) => !part || part === "." || part === ".." || part.includes(":") || FORBIDDEN_PART.test(part))) {
    throw new Error(`Unsafe plugin file: ${path}`);
  }
}
function pluginFiles(root, prefix = "") {
  if (!(0, import_node_fs8.lstatSync)((0, import_node_path8.join)(root, prefix)).isDirectory()) throw new Error(`Not a plugin directory: ${root}`);
  return (0, import_node_fs8.readdirSync)((0, import_node_path8.join)(root, prefix)).sort().flatMap((name) => {
    const path = prefix ? `${prefix}/${name}` : name;
    safePath(path);
    const stat = (0, import_node_fs8.lstatSync)((0, import_node_path8.join)(root, path));
    if (stat.isSymbolicLink()) throw new Error(`Plugin files cannot be symbolic links: ${path}`);
    if (stat.isDirectory()) return pluginFiles(root, path);
    if (!stat.isFile()) throw new Error(`Plugin asset must be a regular file: ${path}`);
    return [path];
  });
}
function loadManifest(directory) {
  if ((0, import_node_fs8.lstatSync)(directory).isSymbolicLink()) throw new Error("Plugin directory cannot be a symbolic link");
  const definitions = DEFINITION_FILES.filter((name) => (0, import_node_fs8.existsSync)((0, import_node_path8.join)(directory, name)));
  if (definitions.length !== 1) throw new Error("Keep exactly one plugin definition in the package");
  const path = (0, import_node_path8.join)(directory, definitions[0]);
  const stat = (0, import_node_fs8.lstatSync)(path);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 1048576)
    throw new Error("Invalid plugin definition file");
  const document = (0, import_yaml3.parseDocument)((0, import_node_fs8.readFileSync)(path, "utf8"), { uniqueKeys: true, version: "1.2" });
  (0, import_yaml3.visit)(document, {
    Alias() {
      throw new Error("Plugin definitions cannot contain YAML aliases");
    }
  });
  if (document.errors.length || document.warnings.length) throw new Error("Invalid plugin definition YAML/JSON");
  const data = document.toJS({ maxAliasCount: 0 });
  if (definitions[0] === "octonode.plugin.json") return PluginManifest.parse(data);
  if (data?.apiVersion !== SETTINGS_API_VERSION) throw new Error("Unsupported plugin apiVersion");
  return PluginManifest.parse(data.plugin);
}
function verifyBuild(directory) {
  const manifest2 = loadManifest(directory);
  const files = pluginFiles(directory);
  if (!files.includes(BUILD_RECORD)) throw new Error("Missing build record; run octonodes plugin build first");
  const record = JSON.parse((0, import_node_fs8.readFileSync)((0, import_node_path8.join)(directory, BUILD_RECORD), "utf8"));
  if (manifest2.app && (record.runtime || record.ui?.length))
    throw new Error("Self-hosted apps cannot include a prepared runtime or packaged UI");
  if (record.runtime) {
    const runtime = PreparedPluginRuntime.parse(record.runtime);
    if ((manifest2.integration?.npm || manifest2.integration?.npmDependencies?.length) && !runtime.dependencies)
      throw new Error("Prepared npm plugins must include their dependency runtime");
    if (runtime.dependencies && !files.includes(runtime.dependencies))
      throw new Error("Missing prepared dependency archive");
    if (runtime.dependencies && (runtime.platform === "portable" || !runtime.arch || runtime.platform === "linux" && !runtime.libc))
      throw new Error("Prepared dependencies require a platform, architecture and libc identity");
  }
  if (record.format !== 1 || !record.files || typeof record.files !== "object" || Array.isArray(record.files)) {
    throw new Error("Invalid plugin build record");
  }
  const expected = Object.keys(record.files).sort();
  if (JSON.stringify(expected) !== JSON.stringify(files.filter((name) => name !== BUILD_RECORD).sort())) {
    throw new Error("Plugin files changed since build; rebuild before publishing");
  }
  for (const file of expected) {
    if (record.files[file] !== fileHash((0, import_node_path8.join)(directory, file)))
      throw new Error(`Plugin file changed since build: ${file}`);
  }
  if (manifest2.app) {
    const assets = manifest2.app.hosting === "extension-only" ? manifest2.app.extensions : [];
    const allowed = ["octonode.json", ...assets.map((extension) => extension.path)].sort();
    if (JSON.stringify(expected) !== JSON.stringify(allowed))
      throw new Error("App artifacts contain registration metadata only and declared static bundles");
    for (const extension of assets) {
      if ((0, import_node_fs8.lstatSync)((0, import_node_path8.join)(directory, extension.path)).size > 2 * 1024 * 1024 || `sha256:${fileHash((0, import_node_path8.join)(directory, extension.path))}` !== extension.sha256)
        throw new Error(`Invalid app bundle: ${extension.path}`);
    }
    return { manifest: manifest2, files };
  }
  if (manifest2.schemaVersion === "2") {
    if (record.runtime) throw new Error("v2 plugins cannot use the legacy prepared Node.js runtime");
    const assets = new Set(expected);
    for (const node of manifest2.nodes) {
      if (!node.execution || !assets.has(node.execution.entrypoint.path))
        throw new Error(`Missing runtime entrypoint for ${node.id}`);
    }
    if (!manifest2.nodes.length) throw new Error("A runtime plugin needs at least one node");
  } else if (!expected.includes("dist/index.js") || !manifest2.nodes.length || manifest2.nodes.some(
    (node) => node.command !== `node dist/index.js ${node.id}` && !((manifest2.integration?.npm || manifest2.integration?.npmDependencies?.length) && node.command === `node --experimental-import-meta-resolve dist/index.js ${node.id}`)
  ))
    throw new Error("Invalid built plugin runner");
  if (manifest2.library && (!expected.includes(manifest2.library.entry) || !expected.includes(manifest2.library.types)))
    throw new Error("Missing built plugin library");
  const ui = manifest2.nodes.flatMap(
    (node) => Object.entries(node.ui?.renderers ?? {}).flatMap(
      ([renderer, definition]) => Object.entries(definition.targets).map(([target, path]) => ({
        nodeId: node.id,
        apiVersion: node.ui.apiVersion,
        renderer,
        target,
        path
      }))
    )
  );
  for (const entry of new Set(ui.map(({ path }) => path))) {
    if (!expected.includes(entry) || (0, import_node_fs8.lstatSync)((0, import_node_path8.join)(directory, entry)).size > PLUGIN_UI_BUNDLE_MAX_BYTES)
      throw new Error(`Invalid plugin UI bundle: ${entry}`);
  }
  if (JSON.stringify(record.ui ?? []) !== JSON.stringify(
    ui.map((declaration) => ({
      ...declaration,
      size: (0, import_node_fs8.lstatSync)((0, import_node_path8.join)(directory, declaration.path)).size,
      sha256: fileHash((0, import_node_path8.join)(directory, declaration.path))
    }))
  ))
    throw new Error("Invalid plugin UI build record");
  return { manifest: manifest2, files };
}

// packages/plugin/src/generated/package.constants.ts
var GENERATED_PLUGIN_PACKAGE = "@octonodes/plugin";
var GENERATED_PLUGIN_DIRECTORY = ".octonode-generated";
var GENERATED_PLUGIN_FORMAT = 1;

// packages/plugin/src/generated/package.ts
async function generatePluginPackage(cwd, selections, expectedPacker) {
  const selected = [...selections].sort((a, b2) => a.alias < b2.alias ? -1 : a.alias > b2.alias ? 1 : 0);
  if (!selected.length || new Set(selected.map(({ alias }) => alias)).size !== selected.length)
    throw new Error("Select at least one library with unique aliases");
  for (const { alias, sha256 } of selected) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(alias) || /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/.test(alias))
      throw new Error(`Invalid plugin import alias: ${alias}`);
    if (!/^sha256:[a-f0-9]{64}$/.test(sha256)) throw new Error(`Invalid plugin checksum: ${alias}`);
  }
  const packer = "tar@7.5.22/portable-v1";
  if (expectedPacker && expectedPacker !== packer)
    throw new Error(`Plugin package restore requires ${expectedPacker}; found ${packer}`);
  const digest2 = (0, import_node_crypto4.createHash)("sha256").update(
    JSON.stringify({
      format: GENERATED_PLUGIN_FORMAT,
      packer,
      selections: selected.map(({ alias, sha256 }) => ({ alias, sha256 }))
    })
  ).digest("hex");
  const stage = (0, import_node_fs9.mkdtempSync)((0, import_node_path9.join)((0, import_node_os5.tmpdir)(), "octonode-package-"));
  try {
    const packageRoot = (0, import_node_path9.join)(stage, "package");
    (0, import_node_fs9.mkdirSync)(packageRoot);
    for (const { alias, directory, sha256 } of selected) {
      if ((0, import_node_fs9.lstatSync)(directory).isSymbolicLink())
        throw new Error(`Plugin directory cannot be a symbolic link: ${alias}`);
      const snapshot = (0, import_node_path9.join)(stage, "snapshots", alias);
      (0, import_node_fs9.mkdirSync)(snapshot, { recursive: true });
      for (const file of pluginBundleFiles(directory)) {
        safePath(file);
        (0, import_node_fs9.mkdirSync)((0, import_node_path9.dirname)((0, import_node_path9.join)(snapshot, file)), { recursive: true });
        (0, import_node_fs9.writeFileSync)((0, import_node_path9.join)(snapshot, file), (0, import_node_fs9.readFileSync)((0, import_node_path9.join)(directory, file)));
      }
      if (hashPluginDir(snapshot) !== sha256) throw new Error(`Plugin integrity mismatch: ${alias}`);
      const library = (0, import_node_path9.join)(snapshot, "library");
      if (!(0, import_node_fs9.existsSync)((0, import_node_path9.join)(library, "index.js")) || !(0, import_node_fs9.existsSync)((0, import_node_path9.join)(library, "index.d.ts")))
        throw new Error(`Plugin ${alias} has no importable library; rebuild with a compatible CLI`);
      for (const file of pluginFiles(library)) {
        const target = (0, import_node_path9.join)(packageRoot, alias, file);
        (0, import_node_fs9.mkdirSync)((0, import_node_path9.dirname)(target), { recursive: true });
        (0, import_node_fs9.writeFileSync)(target, (0, import_node_fs9.readFileSync)((0, import_node_path9.join)(library, file)));
        (0, import_node_fs9.chmodSync)(target, 420);
      }
    }
    const subpaths = selected.map(({ alias }) => `./${alias}`);
    (0, import_node_fs9.writeFileSync)(
      (0, import_node_path9.join)(packageRoot, "package.json"),
      JSON.stringify(
        {
          name: GENERATED_PLUGIN_PACKAGE,
          version: `0.0.0-${digest2}`,
          private: true,
          type: "module",
          exports: Object.fromEntries(
            subpaths.map((path) => [path, { types: `${path}/index.d.ts`, import: `${path}/index.js` }])
          )
        },
        null,
        2
      ) + "\n"
    );
    (0, import_node_fs9.chmodSync)((0, import_node_path9.join)(packageRoot, "package.json"), 420);
    const archive = (0, import_node_path9.join)(stage, "package.tar");
    (0, import_tar.create)(
      {
        file: archive,
        cwd: packageRoot,
        sync: true,
        portable: true,
        mtime: /* @__PURE__ */ new Date(0),
        prefix: "package",
        strict: true
      },
      pluginFiles(packageRoot)
    );
    const bytes = (0, import_node_zlib.gzipSync)((0, import_node_fs9.readFileSync)(archive), { level: 0 });
    bytes[9] = 255;
    const output = (0, import_node_path9.join)(cwd, GENERATED_PLUGIN_DIRECTORY);
    (0, import_node_fs9.mkdirSync)(output, { recursive: true });
    if ((0, import_node_fs9.lstatSync)(output).isSymbolicLink()) throw new Error("Generated plugin directory cannot be a symbolic link");
    const ignore = (0, import_node_path9.join)(output, ".gitignore");
    if (!(0, import_node_fs9.existsSync)(ignore)) (0, import_node_fs9.writeFileSync)(ignore, "*\n", { flag: "wx" });
    const destination = (0, import_node_path9.join)(output, `plugin-${digest2}.tgz`);
    if ((0, import_node_fs9.existsSync)(destination)) {
      if ((0, import_node_fs9.lstatSync)(destination).isSymbolicLink() || !(0, import_node_fs9.readFileSync)(destination).equals(bytes))
        throw new Error("Generated plugin package changed; remove the corrupt generated file and restore again");
    } else {
      const temporary = (0, import_node_fs9.mkdtempSync)((0, import_node_path9.join)(output, ".pack-"));
      try {
        (0, import_node_fs9.writeFileSync)((0, import_node_path9.join)(temporary, "package.tgz"), bytes);
        (0, import_node_fs9.renameSync)((0, import_node_path9.join)(temporary, "package.tgz"), destination);
      } finally {
        (0, import_node_fs9.rmSync)(temporary, { recursive: true, force: true });
      }
    }
    return {
      name: GENERATED_PLUGIN_PACKAGE,
      spec: `file:./${GENERATED_PLUGIN_DIRECTORY}/plugin-${digest2}.tgz`,
      subpaths,
      packer,
      sha256: `sha256:${(0, import_node_crypto4.createHash)("sha256").update(bytes).digest("hex")}`
    };
  } finally {
    (0, import_node_fs9.rmSync)(stage, { recursive: true, force: true });
  }
}

// packages/plugin/src/plugin/dependencies.ts
function pluginNpmDependencies(manifest2) {
  return [
    ...manifest2.integration?.npmDependencies ?? (manifest2.integration?.npm ? [manifest2.integration.npm] : []),
    ...Object.values(manifest2.dependencyGroups ?? {}).flatMap(
      (group) => group.ecosystem === "npm" ? group.packages.map((pkg) => ({ package: pkg.name, version: pkg.version, spec: `${pkg.name}@${pkg.version}` })) : []
    )
  ];
}
function assertUniqueNpmPlugins(plugins) {
  const owners = /* @__PURE__ */ new Map();
  for (const { alias, manifest: manifest2 } of plugins) {
    const source = manifest2.source;
    const pkg = source?.kind === "pypi" ? `pypi:${source.package}` : manifest2.integration?.npm?.package.trim().toLowerCase() ?? (source?.kind === "npm" ? source.package : void 0);
    if (!pkg) continue;
    const previous = owners.get(pkg);
    if (previous && previous !== alias)
      throw new Error(
        `Use existing ${source?.kind === "pypi" ? "PyPI" : "npm"} integration "${previous}" for ${pkg}; duplicate plugin alias "${alias}" is not allowed`
      );
    owners.set(pkg, alias);
  }
}

// packages/plugin/src/prepared/runtime.ts
var import_node_fs10 = require("node:fs");
var import_node_path10 = require("node:path");
var import_tar2 = require("tar");
function preparedRuntime(directory) {
  const path = (0, import_node_path10.join)(directory, BUILD_RECORD);
  if (!(0, import_node_fs10.existsSync)(path)) return;
  const record = JSON.parse((0, import_node_fs10.readFileSync)(path, "utf8"));
  if (record.runtime === void 0) return;
  return PreparedPluginRuntime.parse(record.runtime);
}
function assertPreparedRuntime(runtime) {
  const libc = process.platform === "linux" && process.report.getReport().header?.glibcVersionRuntime ? "glibc" : "musl";
  if (Number(process.versions.node.split(".")[0]) !== runtime.nodeMajor || runtime.platform !== "portable" && (runtime.platform !== process.platform || runtime.arch !== process.arch || runtime.platform === "linux" && runtime.libc !== libc))
    throw new Error("Prepared plugin runtime is incompatible; rebuild for this Node/platform/architecture/libc");
}

// packages/plugin/src/prepared/invocation.ts
function usesPreparedRunner(directory) {
  if (PROCESS_ENV.OCTONODE_PLUGIN_RUNNER !== "true") return false;
  const runtime = preparedRuntime(directory);
  if (!runtime) return false;
  assertPreparedRuntime(runtime);
  const { manifest: manifest2 } = verifyBuild(directory);
  return !manifest2.permissions.some((permission) => permission.resource === "project_data");
}
function preparedPluginPin(directory, pin) {
  return !!pin?.installId && !!pin.registry && pin.registry.replace(/\/$/, "") === (OCTONODE_MARKETPLACE_URL() ?? DEFAULT_MARKETPLACE_URL).replace(/\/$/, "") && usesPreparedRunner(directory);
}

// packages/plugin/src/runtimes/environment.ts
var import_node_crypto5 = require("node:crypto");
var import_node_fs11 = require("node:fs");
var import_node_path11 = require("node:path");

// packages/core/src/ipc/constants.ts
var MAX_BUFFER_BYTES = 32 * 1024 * 1024;
var MAX_STDERR_BYTES = 8 * 1024 * 1024;
var MAX_STREAM_BYTES = 32 * 1024 * 1024;

// packages/core/src/ipc/spawn.ts
var import_node_child_process2 = require("node:child_process");

// packages/core/src/ipc/command.ts
function commandArgs(command) {
  const args = [];
  let token = "";
  let quote = "";
  let escaped = false;
  for (const char of command.trim()) {
    if (escaped) {
      token += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (char === quote) quote = "";
      else token += char;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }
    if (/\s/.test(char)) {
      if (token) {
        args.push(token);
        token = "";
      }
      continue;
    }
    token += char;
  }
  if (escaped) token += "\\";
  if (quote) throw new Error("unterminated quote in node command");
  if (token) args.push(token);
  if (args.length === 0) throw new Error("node command is empty");
  return args;
}

// packages/core/src/ipc/spawn.ts
function runExchange(requestJson, options) {
  const startedAt = Date.now();
  if (options.signal?.aborted)
    return Promise.resolve({
      stdout: "",
      stderr: "",
      exitCode: null,
      signal: null,
      timedOut: false,
      aborted: true,
      stdoutTruncated: false,
      stderrTruncated: false,
      durationMs: 0
    });
  return new Promise((resolve8) => {
    const detached = process.platform !== "win32";
    const [executable, ...args] = options.args ? [options.command, ...options.args] : commandArgs(options.command);
    const child = (0, import_node_child_process2.spawn)(executable, args, {
      cwd: options.cwd,
      env: options.inheritEnv === false ? options.env ?? {} : childProcessEnvironment(options.env),
      stdio: ["pipe", "pipe", "pipe"],
      detached
    });
    const killTree = (signal) => {
      if (child.pid === void 0) return;
      try {
        if (detached) process.kill(-child.pid, signal);
        else child.kill(signal);
      } catch {
      }
    };
    const stdoutChunks = [];
    const stderrChunks = [];
    const maxStdoutBytes = options.maxStdoutBytes ?? MAX_BUFFER_BYTES;
    const maxStderrBytes = options.maxStderrBytes ?? MAX_STDERR_BYTES;
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let settled = false;
    let timedOut = false;
    let aborted = false;
    let stdoutTruncated = false;
    let stderrTruncated = false;
    let streamError;
    let killTimer;
    let escalationTimer;
    const terminate = () => {
      killTree("SIGTERM");
      escalationTimer ??= setTimeout(() => killTree("SIGKILL"), 2e3);
      escalationTimer.unref();
    };
    if (options.timeoutMs && options.timeoutMs > 0) {
      killTimer = setTimeout(() => {
        timedOut = true;
        terminate();
      }, options.timeoutMs);
      killTimer.unref();
    }
    const abort = () => {
      aborted = true;
      terminate();
    };
    if (options.signal?.aborted) abort();
    else options.signal?.addEventListener("abort", abort, { once: true });
    const finish = (outcome) => {
      if (settled) return;
      settled = true;
      if (killTimer) clearTimeout(killTimer);
      if (escalationTimer) clearTimeout(escalationTimer);
      options.signal?.removeEventListener("abort", abort);
      resolve8({ ...outcome, streamError, durationMs: Date.now() - startedAt });
    };
    child.stdout.on("data", (chunk) => {
      const remaining = Math.max(0, maxStdoutBytes - stdoutBytes);
      if (remaining) stdoutChunks.push(chunk.subarray(0, remaining));
      stdoutBytes += chunk.length;
      if (stdoutBytes > maxStdoutBytes) {
        stdoutTruncated = true;
        killTree("SIGKILL");
      }
    });
    child.stderr.on("data", (chunk) => {
      const remaining = Math.max(0, maxStderrBytes - stderrBytes);
      const captured = chunk.subarray(0, remaining);
      if (captured.length) stderrChunks.push(captured);
      stderrBytes += chunk.length;
      if (options.onStderr && captured.length && !streamError) {
        try {
          options.onStderr(captured.toString("utf8"));
        } catch (error) {
          streamError = error instanceof Error ? error : new Error(String(error));
          killTree("SIGKILL");
        }
      }
      if (stderrBytes > maxStderrBytes) {
        stderrTruncated = true;
        killTree("SIGKILL");
      }
    });
    child.on("error", (err) => {
      finish({
        stdout: "",
        stderr: Buffer.concat(stderrChunks).toString("utf8"),
        exitCode: null,
        signal: null,
        timedOut: false,
        aborted: false,
        stdoutTruncated,
        stderrTruncated,
        spawnError: err
      });
    });
    child.once("exit", () => killTree("SIGKILL"));
    child.on("close", (code, signal) => {
      finish({
        stdout: Buffer.concat(stdoutChunks).toString("utf8").trim(),
        stderr: Buffer.concat(stderrChunks).toString("utf8"),
        exitCode: code,
        signal,
        timedOut,
        aborted,
        stdoutTruncated,
        stderrTruncated
      });
    });
    child.stdin.on("error", () => {
    });
    child.stdin.write(requestJson + "\n");
    child.stdin.end();
  });
}
async function runCommandProcess(options) {
  const outcome = await runExchange("", options);
  return {
    stdout: outcome.stdout,
    stderr: outcome.stderr,
    exitCode: outcome.exitCode,
    durationMs: outcome.durationMs,
    timedOut: outcome.timedOut,
    cancelled: outcome.aborted,
    truncated: outcome.stdoutTruncated || outcome.stderrTruncated,
    error: outcome.streamError?.message ?? outcome.spawnError?.message
  };
}

// packages/core/src/runtime/resolve.ts
var import_environment = __toESM(require_environment());

// packages/core/src/dag/compiled.ts
var import_typescript = __toESM(require("typescript"));

// packages/plugin/src/runtimes/environment.ts
var import_semver2 = __toESM(require_semver2());
var import_zod77 = require("zod");

// packages/plugin/src/runtimes/constants.ts
var PYTHON_DEFAULT_VERSION = "3.13";
var PYTHON_LOCAL_VERSIONS = [PYTHON_DEFAULT_VERSION, "3.14", "3.12"];
var RUNTIME_DIRECTORY = ".octonode-generated/plugin-runtimes";
var RUNTIME_RECEIPT = `${RUNTIME_DIRECTORY}/python.json`;
var PYTHON_PROJECT_FILES = ["pyproject.toml", "uv.lock", ".python-version", "uv.toml"];
var RUNTIME_SETUP_TIMEOUT_MS = 18e4;
var PYTHON_INSPECT = `import json,platform,sys,tomllib,pathlib
p=pathlib.Path('pyproject.toml')
d=tomllib.loads(p.read_text()) if p.exists() else {}
ancestors=[tomllib.loads(content) for content in json.loads(sys.argv[1])]
workspace=any('workspace' in project.get('tool',{}).get('uv',{}) for project in [d,*ancestors])
print(json.dumps({'version':platform.python_version(),'implementation':platform.python_implementation(),'dependencies':d.get('project',{}).get('dependencies',[]),'workspace':workspace,'sources':d.get('tool',{}).get('uv',{}).get('sources',{})}))`;
var PYTHON_VERIFY = `import importlib.metadata as m,json,pathlib,sys,tomllib
required=json.loads(sys.argv[1])
locked=tomllib.loads(pathlib.Path('uv.lock').read_text()).get('package',[])
for p in required:
 d=m.distribution(p['name'])
 if d.version!=p['version']: raise ValueError('Installed version mismatch: '+p['name'])
 if d.read_text('direct_url.json'): raise ValueError('Registry dependency replaced by a direct source: '+p['name'])
 if not any(x['name']==p['name'] and x['version']==p['version'] and x.get('source',{}).get('registry')=='https://pypi.org/simple' for x in locked): raise ValueError('PyPI dependency is not locked: '+p['name'])
print('verified')`;

// packages/plugin/src/runtimes/environment.ts
var receiptSchema = import_zod77.z.object({
  format: import_zod77.z.literal(1),
  fingerprint: import_zod77.z.string(),
  executable: import_zod77.z.string(),
  version: import_zod77.z.string(),
  revision: import_zod77.z.string(),
  packages: import_zod77.z.array(import_zod77.z.object({ name: import_zod77.z.string(), version: import_zod77.z.string() }))
});
var inspectedPython = import_zod77.z.object({
  version: import_zod77.z.string(),
  implementation: import_zod77.z.string(),
  dependencies: import_zod77.z.array(import_zod77.z.string()),
  workspace: import_zod77.z.boolean(),
  sources: import_zod77.z.record(import_zod77.z.unknown())
});
var digest = (value) => (0, import_node_crypto5.createHash)("sha256").update(value).digest("hex");
function checkedFile(root, file) {
  const path = (0, import_node_path11.join)(root, file);
  for (let parent = path; parent !== root; parent = (0, import_node_path11.dirname)(parent)) {
    if (!parent.startsWith(root.endsWith(import_node_path11.sep) ? root : root + import_node_path11.sep)) throw new Error("Runtime file escapes the project");
    if ((0, import_node_fs11.lstatSync)(parent, { throwIfNoEntry: false })?.isSymbolicLink())
      throw new Error(`Runtime files cannot be symlinks: ${file}`);
  }
  if (!(0, import_node_fs11.existsSync)(path)) return;
  if (!(0, import_node_fs11.statSync)(path).isFile() || (0, import_node_fs11.statSync)(path).size > 16777216) throw new Error(`Invalid runtime file: ${file}`);
  return (0, import_node_fs11.readFileSync)(path, "utf8");
}
function nativeFingerprint(root) {
  return digest(JSON.stringify(PYTHON_PROJECT_FILES.map((file) => [file, checkedFile(root, file) ?? null])));
}
function ancestorPythonProjects(root) {
  const parent = (0, import_node_path11.dirname)(root);
  if (parent === root) return [];
  const content = checkedFile(parent, "pyproject.toml");
  return [...content ? [content] : [], ...ancestorPythonProjects(parent)];
}
function executableRevision(path) {
  const real = (0, import_node_fs11.realpathSync)(path);
  const stat = (0, import_node_fs11.statSync)(real);
  return digest(JSON.stringify([real, stat.size, stat.mtimeMs]));
}
function pluginRuntimePackages(manifests) {
  return manifests.flatMap(
    (manifest2) => Object.values(manifest2.dependencyGroups ?? {}).flatMap(
      (group) => group.packages.map((pkg) => ({ ecosystem: group.ecosystem, ...pkg }))
    )
  );
}
function pythonRuntimeReceipt(cwd) {
  const root = (0, import_node_fs11.realpathSync)(cwd);
  const content = checkedFile(root, RUNTIME_RECEIPT);
  if (!content) return;
  let value;
  try {
    value = JSON.parse(content);
  } catch {
    return;
  }
  const parsed = receiptSchema.safeParse(value);
  if (!parsed.success) return;
  const receipt = parsed.data;
  if (!receipt.executable.startsWith((0, import_node_path11.join)(root, RUNTIME_DIRECTORY) + import_node_path11.sep)) return;
  if (receipt.fingerprint !== nativeFingerprint(root) || !(0, import_node_fs11.existsSync)(receipt.executable)) return;
  if (receipt.revision !== executableRevision(receipt.executable)) return;
  return receipt;
}
async function runtimeCommand(cwd, command, args, options = {}, env) {
  const result = await runCommandProcess({
    command,
    args,
    cwd,
    env,
    signal: options.signal,
    timeoutMs: RUNTIME_SETUP_TIMEOUT_MS,
    maxStdoutBytes: 2097152,
    maxStderrBytes: 2097152
  });
  if (result.exitCode !== 0 || result.error || result.timedOut || result.cancelled || result.truncated)
    throw new Error(
      result.error ?? (result.cancelled ? "Runtime setup cancelled" : result.timedOut ? "Runtime setup timed out" : result.stderr.trim() || "Runtime command failed")
    );
  return result.stdout;
}
async function inspectRuntimePlan(cwd, manifests, options) {
  const root = (0, import_node_fs11.realpathSync)(cwd);
  const requirements = manifests.flatMap((manifest2) => Object.values(manifest2.runtimeRequirements ?? {}));
  const packages = pluginRuntimePackages(manifests);
  const python = requirements.filter((requirement) => requirement.runtime === "cpython");
  const fingerprint = digest(
    JSON.stringify([
      root,
      python.length ? nativeFingerprint(root) : null,
      python.length ? checkedFile(root, RUNTIME_RECEIPT) : null,
      [...manifests].sort((a, b2) => JSON.stringify(a).localeCompare(JSON.stringify(b2)))
    ])
  );
  const runtimes = [];
  for (const requirement of requirements.filter((item) => item.runtime !== "cpython")) {
    const ready = requirement.runtime === "node" && (0, import_semver2.validRange)(requirement.versionConstraint) && (0, import_semver2.satisfies)(process.versions.node, requirement.versionConstraint);
    runtimes.push({
      runtime: requirement.runtime,
      required: requirement.versionConstraint,
      version: requirement.runtime === "node" ? process.versions.node : void 0,
      status: ready ? "ready" : "blocked",
      message: ready ? "Ready" : `No compatible local adapter for ${requirement.runtime} ${requirement.versionConstraint}`
    });
  }
  let executable;
  let version;
  let ancestors = [];
  if (python.length) {
    try {
      if (OCTONODE_RUNTIME() === "node" || process.platform === "win32")
        throw new Error("Python plugins are available for local macOS/Linux testing; this target is not qualified yet");
      const requested = checkedFile(root, ".python-version")?.trim() || PYTHON_LOCAL_VERSIONS.find(
        (candidate) => python.every(
          (requirement) => (0, import_semver2.validRange)(requirement.versionConstraint) && (0, import_semver2.intersects)(requirement.versionConstraint, `>=${candidate} <3.${Number(candidate.split(".")[1]) + 1}`)
        )
      ) || PYTHON_DEFAULT_VERSION;
      if (!/^3\.\d+(?:\.\d+)?$/.test(requested)) throw new Error("Set .python-version to one numeric CPython version");
      executable = await runtimeCommand(
        root,
        options.uv ?? PROCESS_ENV.OCTONODE_UV ?? "uv",
        ["python", "find", "--directory", root, "--system", "--no-project", "--no-python-downloads", requested],
        options
      );
      ancestors = ancestorPythonProjects(root);
      const inspection = inspectedPython.parse(
        JSON.parse(
          await runtimeCommand(root, executable, ["-I", "-c", PYTHON_INSPECT, JSON.stringify(ancestors)], options)
        )
      );
      version = inspection.version;
      if (inspection.implementation !== "CPython" || python.some((r) => !(0, import_semver2.validRange)(r.versionConstraint) || !(0, import_semver2.satisfies)(inspection.version, r.versionConstraint)))
        throw new Error(
          `Installed CPython ${version} does not satisfy all plugin requirements. Select a compatible .python-version`
        );
      if (inspection.workspace)
        throw new Error(
          "uv workspaces and their descendant projects are not supported by local plugin setup; select a standalone project"
        );
      const pypi = packages.filter((p2) => p2.ecosystem === "pypi");
      for (const pkg of pypi) {
        if (pypi.some((other) => other.name === pkg.name && other.version !== pkg.version))
          throw new Error(`Python dependency conflict: ${pkg.name}`);
        if (Object.keys(inspection.sources).some((name) => name.toLowerCase().replace(/[-_.]+/g, "-") === pkg.name))
          throw new Error(`Remove the custom uv source for ${pkg.name} before using a PyPI plugin`);
        const declared = inspection.dependencies.find(
          (item) => item.match(/^[A-Za-z0-9._-]+/)?.[0].toLowerCase().replace(/[-_.]+/g, "-") === pkg.name
        );
        if (declared && declared.replace(/\s/g, "").toLowerCase().replace(/^[^=<>!~;[]+/, pkg.name) !== `${pkg.name}==${pkg.version}`.toLowerCase())
          throw new Error(
            `Dependency conflict: ${declared}; plugin requires ${pkg.name}==${pkg.version}. Reconcile pyproject.toml explicitly`
          );
      }
      const receipt = pythonRuntimeReceipt(root);
      const ready = receipt?.version === version && pypi.every((pkg) => receipt.packages.some((item) => item.name === pkg.name && item.version === pkg.version));
      runtimes.push({
        runtime: "cpython",
        required: python.map((r) => r.versionConstraint).join("; "),
        version,
        status: ready ? "ready" : "setup",
        message: ready ? "Ready" : "Prepare the project Python environment with uv"
      });
    } catch (error) {
      runtimes.push({
        runtime: "cpython",
        required: python.map((r) => r.versionConstraint).join("; "),
        version,
        status: "blocked",
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }
  return {
    manifests,
    executable,
    version,
    plan: {
      fingerprint: digest(
        JSON.stringify([
          fingerprint,
          ancestors,
          executable,
          version,
          executable && (0, import_node_fs11.existsSync)(executable) ? executableRevision(executable) : null
        ])
      ),
      ready: runtimes.every((r) => r.status === "ready"),
      canPrepare: runtimes.every((r) => r.status !== "blocked"),
      runtimes,
      packages,
      files: python.length ? ["pyproject.toml", "uv.lock", ".python-version", RUNTIME_RECEIPT] : []
    }
  };
}
async function planPluginRuntimes(cwd, manifests, options = {}) {
  return (await inspectRuntimePlan(cwd, manifests, options)).plan;
}
function runtimeTransactionFiles(cwd) {
  return ["pyproject.toml", "uv.lock", ".python-version", RUNTIME_RECEIPT].map((file) => (0, import_node_path11.resolve)(cwd, file));
}
async function preparePluginRuntimes(cwd, manifests, options) {
  const root = (0, import_node_fs11.realpathSync)(cwd);
  const { plan, executable, version } = await inspectRuntimePlan(root, manifests, options);
  if (plan.fingerprint !== options.expectedFingerprint)
    throw new Error("Runtime requirements or project files changed. Review setup again");
  if (!plan.canPrepare)
    throw new Error(
      plan.runtimes.filter((r) => r.status === "blocked").map((r) => r.message).join("; ")
    );
  if (plan.ready) return;
  if (!executable || !version) throw new Error("No compatible interpreter selected");
  const uv = options.uv ?? PROCESS_ENV.OCTONODE_UV ?? "uv";
  const directory = (0, import_node_path11.join)(root, RUNTIME_DIRECTORY, (0, import_node_crypto5.randomUUID)());
  checkedFile(root, RUNTIME_RECEIPT);
  (0, import_node_fs11.mkdirSync)((0, import_node_path11.dirname)(directory), { recursive: true });
  try {
    if (!(0, import_node_fs11.existsSync)((0, import_node_path11.join)(root, "pyproject.toml")))
      (0, import_node_fs11.writeFileSync)(
        (0, import_node_path11.join)(root, "pyproject.toml"),
        `[project]
name = "octonode-local-plugins"
version = "0.1.0"
requires-python = ">=${version.split(".").slice(0, 2).join(".")},<${Number(version.split(".")[0]) + 1}"
dependencies = []
`
      );
    if (!(0, import_node_fs11.existsSync)((0, import_node_path11.join)(root, ".python-version"))) (0, import_node_fs11.writeFileSync)((0, import_node_path11.join)(root, ".python-version"), version + "\n");
    const packages = [
      ...new Map(
        plan.packages.filter((p2) => p2.ecosystem === "pypi").map((p2) => [p2.name, { name: p2.name, version: p2.version }])
      ).values()
    ];
    if (packages.length)
      await runtimeCommand(
        root,
        uv,
        [
          "add",
          "--directory",
          root,
          "--project",
          root,
          "--no-sync",
          "--no-python-downloads",
          "--no-build",
          "--python",
          executable,
          ...packages.map((p2) => `${p2.name}==${p2.version}`)
        ],
        options
      );
    else
      await runtimeCommand(
        root,
        uv,
        ["lock", "--directory", root, "--project", root, "--no-python-downloads", "--no-build", "--python", executable],
        options
      );
    const lockedFingerprint = nativeFingerprint(root);
    await runtimeCommand(
      root,
      uv,
      [
        "sync",
        "--directory",
        root,
        "--project",
        root,
        "--locked",
        "--no-install-project",
        "--no-dev",
        "--no-editable",
        "--no-build",
        "--no-python-downloads",
        "--python",
        executable
      ],
      options,
      { UV_PROJECT_ENVIRONMENT: directory }
    );
    const python = (0, import_node_path11.join)(directory, "bin", "python");
    await runtimeCommand(root, python, ["-I", "-c", PYTHON_VERIFY, JSON.stringify(packages)], options);
    if (nativeFingerprint(root) !== lockedFingerprint)
      throw new Error("Python project changed during setup. Review again");
    const receipt = {
      format: 1,
      fingerprint: lockedFingerprint,
      executable: python,
      version,
      revision: executableRevision(python),
      packages
    };
    const staging = (0, import_node_path11.join)(directory, "receipt.json");
    (0, import_node_fs11.writeFileSync)(staging, JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
    (0, import_node_fs11.renameSync)(staging, (0, import_node_path11.join)(root, RUNTIME_RECEIPT));
  } catch (error) {
    (0, import_node_fs11.rmSync)(directory, { recursive: true, force: true });
    throw error;
  }
}

// packages/plugin/src/runtimes/resolve.ts
var import_semver3 = __toESM(require_semver2());

// packages/plugin/src/lifecycle.ts
function runtimeProject(cwd, manifest2) {
  const project = resolveDependencyProject(cwd);
  if (manifest2.schemaVersion === "2" && (0, import_node_fs12.realpathSync)(cwd) !== project.target)
    throw new Error(
      "Initialize pyproject.toml or package.json in the selected project before installing runtime plugins; ancestor project files will not be changed"
    );
  return project.target;
}
function runtimeManifests(cwd, locked, options) {
  return [
    ...locked,
    ...discoverPluginCatalog({ cwd, storeRoot: options.storeRoot }).plugins.filter(
      (plugin) => plugin.source === "project" && !locked.some((manifest2) => manifest2.id === plugin.manifest.id)
    ).map((plugin) => plugin.manifest)
  ];
}
async function reconcilePluginLock(cwd, next, options = {}) {
  const project = resolveDependencyProject(cwd);
  const before = readLockfile(cwd);
  for (const toolkit of Object.values(next.toolkits ?? {})) {
    for (const alias of toolkit.plugins) {
      const pin = next.plugins[alias];
      const previous = before.plugins[alias];
      if (!pin) throw new Error(`Toolkit ${toolkit.id} requires plugin ${alias}`);
      if (previous && before.toolkits?.[toolkit.id]?.sha256 === toolkit.sha256 && (pin.version !== previous.version || pin.sha256 !== previous.sha256 || pin.registry !== previous.registry || pin.remoteId !== previous.remoteId))
        throw new Error(`Update toolkit ${toolkit.id} before changing required plugin ${alias}`);
    }
  }
  const loaded = Object.entries(next.plugins).map(([alias, pin]) => {
    const directory = storeEntryDir(pin.pluginId ?? alias, pin.version, pin.sha256, options.storeRoot);
    const manifest2 = loadPluginManifest(directory);
    if (manifest2.id !== (pin.pluginId ?? alias) || manifest2.version !== pin.version || hashPluginDir(directory) !== pin.sha256)
      throw new Error(`Plugin identity or integrity mismatch: ${alias}`);
    const users = Object.values(next.toolkits ?? {}).filter((toolkit) => toolkit.plugins.includes(alias));
    const development = pin.direct === false && users.length > 0 && users.every((toolkit) => toolkit.developmentPlugins?.includes(alias));
    return { alias, development, directory, sha256: pin.sha256, manifest: manifest2, remote: preparedPluginPin(directory, pin) };
  });
  assertUniqueNpmPlugins([
    ...discoverPluginCatalog({ cwd, storeRoot: options.storeRoot }).plugins.filter((item) => item.source === "project" && !loaded.some((pin) => pin.alias === item.manifest.id)).map((item) => ({ alias: item.manifest.id, manifest: item.manifest })),
    ...loaded
  ]);
  const manifests = runtimeManifests(
    cwd,
    loaded.map((item) => item.manifest),
    options
  );
  const runtimePlan = await planPluginRuntimes(project.target, manifests, options);
  if (!runtimePlan.canPrepare)
    throw new Error(
      runtimePlan.runtimes.filter((runtime) => runtime.status === "blocked").map((runtime) => runtime.message).join("; ")
    );
  if (!runtimePlan.ready && !options.runtimeFingerprint && !options.dryRun)
    throw new Error("Plugin runtimes need setup. Review the runtime plan before installation");
  const libraries = loaded.filter((item) => item.manifest.library);
  const generated = libraries.length ? await generatePluginPackage(project.target, libraries) : void 0;
  const packageFile = (0, import_node_path12.join)(project.target, "package.json");
  const packageJson = (0, import_node_fs12.existsSync)(packageFile) ? JSON.parse((0, import_node_fs12.readFileSync)(packageFile, "utf8")) : {};
  const declared = { ...packageJson.devDependencies, ...packageJson.optionalDependencies, ...packageJson.dependencies };
  if (generated && declared[generated.name] && declared[generated.name].replace(/^file:\.\//, "file:") !== before.generated?.spec.replace(/^file:\.\//, "file:") && !options.migrate)
    throw new Error(
      "Existing @octonodes/plugin dependency is not managed by this lock; pass --migrate to replace it explicitly"
    );
  const dependencies = loaded.filter((item) => !item.remote || item.manifest.library).flatMap(
    ({ manifest: manifest2, development }) => pluginNpmDependencies(manifest2).map((npm) => {
      const spec = npm.spec.startsWith(`${npm.package}@`) ? npm.spec.slice(npm.package.length + 1) : npm.spec;
      const sameLocal = typeof declared[npm.package] === "string" && declared[npm.package].startsWith("file:") && spec.startsWith("file:") && (0, import_node_path12.resolve)(project.target, declared[npm.package].slice(5)) === (0, import_node_path12.resolve)(project.target, spec.slice(5));
      if (declared[npm.package] && declared[npm.package] !== spec && !sameLocal)
        throw new Error(
          `Dependency conflict: ${npm.package} is ${declared[npm.package]}, plugin requires ${spec}; reconcile it explicitly first`
        );
      const subpaths = manifest2.nodes.filter((node) => node.source?.kind === "npm" && node.source.package === npm.package).flatMap(
        (node) => node.implementation?.module.startsWith(`${npm.package}/`) ? ["." + node.implementation.module.slice(npm.package.length)] : []
      );
      return {
        name: npm.package,
        spec,
        development: development && (!packageJson.dependencies?.[npm.package] || before.managedDependencies?.[npm.package] === declared[npm.package]) && !packageJson.optionalDependencies?.[npm.package] ? true : void 0,
        ...subpaths.length ? { subpaths: [...new Set(subpaths)] } : {}
      };
    })
  );
  const unique = [
    ...new Map(
      dependencies.map((item) => [
        item.name,
        {
          ...item,
          development: dependencies.filter((other) => other.name === item.name).every((other) => other.development) ? true : void 0
        }
      ])
    ).values()
  ];
  if (dependencies.some((item) => unique.some((other) => item.name === other.name && item.spec !== other.spec)))
    throw new Error("Selected plugins require conflicting npm dependency versions");
  const managedDependencies = Object.fromEntries(
    unique.filter((item) => !declared[item.name] || before.managedDependencies?.[item.name] === declared[item.name]).map((item) => [item.name, item.spec])
  );
  const remove = Object.entries(before.managedDependencies ?? {}).filter(([name, spec]) => declared[name] === spec && !unique.some((item) => item.name === name)).map(([name]) => name);
  if (!generated && before.generated) remove.push(before.generated.name);
  const committed = {
    ...next,
    lockfileVersion: loaded.some((item) => item.manifest.schemaVersion === "2") ? 2 : next.lockfileVersion,
    generated,
    managedDependencies
  };
  if (options.dryRun) return committed;
  if (generated || before.generated || unique.length || remove.length || options.commit || options.runtimeFingerprint) {
    await reconcileDependencies(project.target, [...unique, ...generated ? [generated] : []], {
      cacheRoot: options.cacheRoot,
      metadataOnly: !generated && !before.generated && !unique.length && !remove.length,
      remove,
      transactionFiles: [
        lockfilePath(cwd),
        ...options.runtimeFingerprint ? runtimeTransactionFiles(project.target) : [],
        ...options.transactionFiles ?? []
      ],
      commit: async () => {
        if (options.runtimeFingerprint)
          await preparePluginRuntimes(project.target, manifests, {
            ...options,
            expectedFingerprint: options.runtimeFingerprint
          });
        options.commit?.();
        const installedManifest = (0, import_node_fs12.existsSync)(packageFile) ? JSON.parse((0, import_node_fs12.readFileSync)(packageFile, "utf8")) : {};
        const installedDependencies = {
          ...installedManifest.devDependencies,
          ...installedManifest.optionalDependencies,
          ...installedManifest.dependencies
        };
        writeLockfile(cwd, {
          ...committed,
          managedDependencies: Object.fromEntries(
            Object.keys(managedDependencies).filter((name) => installedDependencies[name]).map((name) => [name, installedDependencies[name]])
          )
        });
      }
    });
  } else writeLockfile(cwd, committed);
  return readLockfile(cwd);
}
async function activatePluginPin(alias, pin, options = {}) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(alias)) throw new Error("Invalid project plugin alias");
  const manifest2 = loadPluginManifest(storeEntryDir(pin.pluginId ?? alias, pin.version, pin.sha256, options.storeRoot));
  const cwd = runtimeProject(options.cwd ?? process.cwd(), manifest2);
  return withDependencyInstall(cwd, () => {
    const lock = readLockfile(cwd);
    const previous = lock.plugins[alias];
    if (previous && Object.values(lock.toolkits ?? {}).some((toolkit) => toolkit.plugins.includes(alias)) && (previous.version !== pin.version || previous.sha256 !== pin.sha256))
      throw new Error(`Plugin ${alias} is required by an installed toolkit; update the toolkit first`);
    if (previous && ((previous.pluginId ?? alias) !== (pin.pluginId ?? alias) || previous.registry !== pin.registry || previous.scope !== pin.scope || previous.remoteId !== pin.remoteId || previous.publisher !== pin.publisher))
      throw new Error(`Plugin alias ${alias} belongs to another source; choose another alias or remove it first`);
    return reconcilePluginLock(
      cwd,
      { ...lock, plugins: { ...lock.plugins, [alias]: { ...pin, direct: true } } },
      options
    );
  });
}
async function installLocalArtifact(directory, options = {}) {
  const manifest2 = loadPluginManifest(directory);
  runtimeProject(options.cwd ?? process.cwd(), manifest2);
  if (manifest2.library || manifest2.schemaVersion === "2") verifyBuild(directory);
  const entry = addToStore(directory, { storeRoot: options.storeRoot });
  await activatePluginPin(
    options.alias ?? entry.id,
    { pluginId: entry.id, version: entry.version, sha256: entry.sha256, permissions: manifest2.permissions },
    options
  );
  return entry;
}
async function removePluginPin(alias, options = {}) {
  const cwd = resolveDependencyProject(options.cwd ?? process.cwd()).target;
  await withDependencyInstall(cwd, async () => {
    const lock = readLockfile(cwd);
    if (Object.values(lock.toolkits ?? {}).some((toolkit) => toolkit.plugins.includes(alias)))
      throw new Error(`Plugin ${alias} is required by an installed toolkit; remove the toolkit first`);
    const plugins = Object.fromEntries(Object.entries(lock.plugins).filter(([id2]) => id2 !== alias));
    await reconcilePluginLock(cwd, { ...lock, plugins }, options);
  });
}

// packages/plugin/src/restore.ts
var import_node_util3 = require("node:util");
var import_node_fs16 = require("node:fs");
var import_node_path16 = require("node:path");

// packages/plugin/src/remote/registry.ts
var import_node_fs15 = require("node:fs");
var import_node_os6 = require("node:os");
var import_node_path15 = require("node:path");

// packages/plugin/src/install.ts
var import_node_fs13 = require("node:fs");
var import_node_path13 = require("node:path");
var import_node_child_process3 = require("node:child_process");
var import_node_util2 = require("node:util");
function commandError(err) {
  const error = err;
  return [error.stderr, error.stdout].map((output) => output?.toString().trim()).find(Boolean) ?? error.message;
}
function installRoot(opts) {
  return opts.project ? { root: projectPluginRoot(opts.cwd), source: "project" } : { root: userPluginRoot(), source: "user" };
}
async function installNodeDeps(dir, opts = {}) {
  return installNodeDepsUnlocked(dir, opts, false);
}
async function installNodeDepsUnlocked(dir, opts, locked) {
  if (opts.noDeps) return {};
  const dependencies = pluginNpmDependencies(loadPluginManifest(dir));
  if (dependencies.length) {
    try {
      if (opts.cacheOnly) {
        for (const npm of dependencies)
          await (0, import_node_util2.promisify)(import_node_child_process3.execFile)("npm", ["cache", "add", "--ignore-scripts", "--", npm.spec], {
            env: childProcessEnvironment(packageCacheEnvironment(dependencyCacheRoot(opts.cacheRoot))),
            timeout: 10 * 6e4
          });
        return {};
      }
      await (locked ? reconcileDependencies : installProjectDependencies)(
        opts.cwd ?? process.cwd(),
        dependencies.map((npm) => ({ name: npm.package, spec: npm.spec })),
        {
          cacheRoot: opts.cacheRoot,
          preserveExisting: true
        }
      );
      return { depsInstalled: true };
    } catch (err) {
      return { depsInstalled: false, depsError: commandError(err) };
    }
  }
  const pjPath = (0, import_node_path13.join)(dir, "package.json");
  if (!(0, import_node_fs13.existsSync)(pjPath)) return {};
  const pj = JSON.parse((0, import_node_fs13.readFileSync)(pjPath, "utf8"));
  if (!pj.dependencies && !pj.optionalDependencies) return {};
  try {
    await (0, import_node_util2.promisify)(import_node_child_process3.execFile)(
      "npm",
      [
        "install",
        "--omit=dev",
        "--no-audit",
        "--no-fund",
        "--silent",
        "--ignore-scripts",
        ...opts.preserveArtifact ? ["--no-save", "--package-lock=false"] : []
      ],
      {
        cwd: dir,
        env: childProcessEnvironment(packageCacheEnvironment(dependencyCacheRoot(opts.cacheRoot))),
        timeout: 10 * 6e4
      }
    );
    return { depsInstalled: true };
  } catch (err) {
    return { depsInstalled: false, depsError: commandError(err) };
  }
}
async function installPlugin(src, opts = {}) {
  if (opts.project) return withDependencyInstall(opts.cwd ?? process.cwd(), () => installPluginUnlocked(src, opts));
  return installPluginUnlocked(src, opts);
}
async function installPluginUnlocked(src, opts) {
  if (!(0, import_node_fs13.existsSync)(src) || !(0, import_node_fs13.statSync)(src).isDirectory()) {
    throw new Error(`source "${src}" is not a directory`);
  }
  if (!isPluginDir(src)) {
    throw new Error(`source "${src}" has no octonode.plugin.json`);
  }
  const { manifest: manifest2 } = loadPlugin(src);
  if (manifest2.schemaVersion === "2")
    throw new Error(
      "Runtime v2 plugins require a project runtime plan and installLocalArtifact; global folder installs are not supported"
    );
  const { root, source } = installRoot(opts);
  const installed = discoverPluginCatalog({ cwd: opts.cwd }).plugins.filter(
    (item) => (opts.project ? item.source !== "user" : item.source === "user") && item.manifest.id !== manifest2.id
  );
  assertUniqueNpmPlugins([
    ...installed.map((item) => ({ alias: item.manifest.id, manifest: item.manifest })),
    { alias: manifest2.id, manifest: manifest2 }
  ]);
  const dest = (0, import_node_path13.join)(root, manifest2.id);
  if ((0, import_node_fs13.existsSync)(dest)) {
    if (!opts.force) {
      throw new Error(`plugin "${manifest2.id}" is already installed at ${dest} (use --force to overwrite)`);
    }
  }
  const deps = pluginNpmDependencies(manifest2).length ? await installNodeDepsUnlocked(src, { ...opts, cacheOnly: opts.cacheOnly ?? !opts.project }, !!opts.project) : {};
  if (deps.depsError) return { manifest: manifest2, dir: dest, source, ...deps };
  if ((0, import_node_fs13.existsSync)(dest)) (0, import_node_fs13.rmSync)(dest, { recursive: true, force: true });
  (0, import_node_fs13.mkdirSync)(root, { recursive: true });
  (0, import_node_fs13.cpSync)(src, dest, { recursive: true });
  return {
    manifest: manifest2,
    dir: dest,
    source,
    ...deps,
    ...pluginNpmDependencies(manifest2).length ? {} : await installNodeDepsUnlocked(dest, opts, !!opts.project)
  };
}

// packages/plugin/src/archive.ts
var import_node_zlib2 = require("node:zlib");
var import_node_fs14 = require("node:fs");
var import_node_path14 = require("node:path");
var import_tar3 = require("tar");

// packages/plugin/src/archive.constants.ts
var PLUGIN_ARCHIVE_MAX_BYTES = 64 * 1024 * 1024;
var PLUGIN_ARCHIVE_MAX_FILES = 1e4;

// packages/plugin/src/archive.ts
function extractPluginArchive(bytes, stage) {
  if (bytes.length > PLUGIN_ARCHIVE_MAX_BYTES) throw new Error("Plugin archive exceeds download limit");
  const decoded = (0, import_node_zlib2.gunzipSync)(bytes, { maxOutputLength: PLUGIN_ARCHIVE_MAX_BYTES });
  const archive = (0, import_node_path14.join)(stage, "bundle.tar");
  (0, import_node_fs14.writeFileSync)(archive, decoded);
  const seen = /* @__PURE__ */ new Set();
  let total = 0;
  (0, import_tar3.list)({
    file: archive,
    sync: true,
    strict: true,
    onReadEntry(entry) {
      const path = entry.path.replace(/^(?:\.\/)+/, "").replace(/\/$/, "");
      if ((!path || path === ".") && entry.type === "Directory") return;
      safePath(path);
      if (entry.type !== "File" && entry.type !== "Directory")
        throw new Error("Plugin archive links and special files are forbidden");
      if (seen.has(path.toLowerCase())) throw new Error("Duplicate or case-colliding plugin archive path");
      seen.add(path.toLowerCase());
      total += entry.size;
      if (seen.size > PLUGIN_ARCHIVE_MAX_FILES || total > PLUGIN_ARCHIVE_MAX_BYTES || path.split("/").length > 64)
        throw new Error("Plugin archive exceeds extraction limits");
    }
  });
  const output = (0, import_node_path14.join)(stage, "plugin");
  (0, import_node_fs14.mkdirSync)(output);
  (0, import_tar3.extract)({
    file: archive,
    cwd: output,
    sync: true,
    strict: true,
    preserveOwner: false,
    maxDepth: 64,
    // Native macOS tar emitted AppleDouble metadata in historical bundles, not plugin content.
    filter: (path) => !path.split("/").some((part) => part.startsWith("._"))
  });
  return output;
}

// packages/plugin/src/remote/registry.ts
var import_tar4 = require("tar");
var import_node_crypto6 = require("node:crypto");
var RemoteRegistry = class _RemoteRegistry {
  constructor(opts = {}) {
    const baseUrl = opts.baseUrl ?? OCTONODE_MARKETPLACE_URL() ?? DEFAULT_MARKETPLACE_URL;
    if (!baseUrl) {
      throw new Error("marketplace URL is not configured (set OCTONODE_MARKETPLACE_URL or pass baseUrl)");
    }
    if (/^https?:\/\/dash\.cloudflare\.com\//.test(baseUrl)) {
      throw new Error(
        "OCTONODE_MARKETPLACE_URL must point to the Worker API endpoint (e.g. https://<worker>.workers.dev), not the Cloudflare dashboard URL."
      );
    }
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.token = opts.token ?? OCTONODE_MARKETPLACE_TOKEN();
    this.workspace = opts.workspace ?? OCTONODE_USER()?.match(/^workspace:((?:user|org|team):.+)$/)?.[1];
  }
  forWorkspace(destination) {
    const workspace = `${destination.kind}:${destination.id}`;
    if (this.workspace && this.workspace !== workspace)
      throw new Error("Toolkit destination must match the registry workspace");
    return this.workspace === workspace ? this : new _RemoteRegistry({ baseUrl: this.baseUrl, token: this.token, workspace });
  }
  async request(path, init = {}) {
    const headers = new Headers(init.headers);
    if (this.token) headers.set("authorization", `Bearer ${this.token}`);
    const url = new URL(`${this.baseUrl}${path}`);
    if (this.workspace && url.searchParams.get("catalog") !== "public" && (init.method === void 0 || init.method === "GET" || url.pathname.endsWith("/install") || url.pathname.endsWith("/resolve")))
      url.searchParams.set("workspace", this.workspace);
    const res = await fetch(url.toString(), {
      ...init,
      headers,
      redirect: "error",
      signal: AbortSignal.timeout(6e4)
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`marketplace request ${path} failed: ${res.status} ${body.slice(0, 200)}`);
    }
    return res;
  }
  async searchPage(filter = {}, offset = 0, limit = 24) {
    const params = new URLSearchParams({ offset: String(offset), limit: String(limit) });
    for (const [key, value] of Object.entries(filter)) if (value !== void 0) params.set(key, value);
    const res = await this.request(`/marketplace/plugins?${params}`);
    return await res.json();
  }
  async search(filter = {}) {
    let entries = [];
    for (; ; ) {
      const page = await this.searchPage(filter, entries.length, 100);
      entries = [...entries, ...page.entries];
      if (!page.entries.length || page.total === void 0 || entries.length >= page.total) return entries;
    }
  }
  async detail(id2, scope, version, page = {}) {
    const params = new URLSearchParams({ ...scope ? { scope } : {}, ...version ? { version } : {} });
    for (const [key, value] of Object.entries(page)) if (value !== void 0) params.set(key, String(value));
    const query = params.size ? `?${params}` : "";
    const res = await this.request(`/marketplace/plugins/${encodeURIComponent(id2)}${query}`);
    return await res.json();
  }
  /** Publisher authorization is checked live before returning an exact version. */
  async publisherVersion(id2, version) {
    const response = await this.request(
      `/marketplace/publisher/plugins/${encodeURIComponent(id2)}/versions/${encodeURIComponent(version)}`
    );
    return await response.json();
  }
  /** Reauthorize an immutable pin, including older locks that only recorded the extracted tree hash. */
  async matchesLockedRelease(id2, pin) {
    const remoteId = pin.remoteId ?? id2;
    const detail = await this.detail(remoteId, pin.scope, pin.version);
    const release2 = detail.versions.find((entry) => entry.version === pin.version);
    if (!release2 || pin.publisher && release2.publishedBy !== pin.publisher) return false;
    const checksum = release2.archiveSha256 ?? release2.sha256;
    if (pin.archiveSha256 || checksum?.startsWith("sha256:")) return checksum === (pin.archiveSha256 ?? pin.sha256);
    if (!/^[a-f0-9]{64}$/.test(checksum)) return false;
    const directory = await this.downloadBundle(remoteId, pin.version, pin.scope, id2, checksum);
    try {
      return hashPluginDir(directory) === pin.sha256;
    } finally {
      (0, import_node_fs15.rmSync)((0, import_node_path15.dirname)(directory), { recursive: true, force: true });
    }
  }
  async registerInstall(id2, version, scope, opts) {
    const response = await this.request(`/marketplace/plugins/${encodeURIComponent(id2)}/install`, {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": opts.idempotencyKey ?? crypto.randomUUID() },
      body: JSON.stringify({
        version,
        scope,
        ownerId: opts.ownerId,
        environment: opts.environment ?? "self_hosted",
        toolkitId: opts.toolkitId,
        toolkitVersion: opts.toolkitVersion
      })
    });
    return (await response.json()).installId;
  }
  async toolkit(id2, version) {
    const response = await this.request(
      `/marketplace/toolkits/${encodeURIComponent(id2)}${version ? `?version=${encodeURIComponent(version)}` : ""}`
    );
    return ToolkitRelease.parse(await response.json());
  }
  async toolkitPlugins(query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) if (value !== void 0) params.set(key, String(value));
    const response = await this.request(`/marketplace/toolkits/plugins?${params}`);
    const page = await response.json();
    return page.items.map((item) => ToolkitResolvedMember.parse(item));
  }
  async resolveToolkit(id2, body) {
    const response = await this.forWorkspace(body.destination).request(
      `/marketplace/toolkits/${encodeURIComponent(id2)}/resolve`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      }
    );
    return ToolkitRelease.parse(await response.json());
  }
  async saveToolkit(definition, id2, revision2) {
    const response = await this.request(`/marketplace/toolkits${id2 ? `/${encodeURIComponent(id2)}` : ""}`, {
      method: id2 ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(id2 ? { definition, revision: revision2 } : definition)
    });
    return ToolkitRelease.parse(await response.json());
  }
  async publishToolkit(id2, version, revision2) {
    const response = await this.request(`/marketplace/toolkits/${encodeURIComponent(id2)}/publish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ version, revision: revision2 })
    });
    return ToolkitRelease.parse(await response.json());
  }
  /**
   * Pack a plugin folder into a tarball and publish it (metadata + bundle).
   * `orgId` names the org an org/group-scoped version belongs to; `teamId`
   * names the team for a group-scoped version. The Worker validates both
   * against the publisher's memberships (and infers a sole membership when
   * omitted).
   */
  async publish(pluginDir, opts = {}) {
    const manifest2 = loadPluginManifest(pluginDir);
    if (manifest2.schemaVersion === "2")
      throw new Error("Plugin runtime v2 is local-only until marketplace rollout is qualified");
    const packageFile = (0, import_node_path15.join)(pluginDir, "package.json");
    if ((0, import_node_fs15.existsSync)(packageFile)) {
      const metadata = JSON.parse((0, import_node_fs15.readFileSync)(packageFile, "utf8"));
      if (metadata.version && metadata.version !== manifest2.version) {
        throw new Error("package.json version must match the plugin version before publishing");
      }
    }
    const bundle = packPluginDir(pluginDir);
    const form = new FormData();
    form.set("manifest", JSON.stringify(manifest2));
    if (opts.orgId) form.set("orgId", opts.orgId);
    if (opts.teamId) form.set("teamId", opts.teamId);
    form.set("bundle", new Blob([new Uint8Array(bundle)], { type: "application/gzip" }), "bundle.tar.gz");
    const res = await this.request(`/marketplace/plugins/${encodeURIComponent(manifest2.id)}/versions`, {
      method: "POST",
      body: form
    });
    const release2 = await res.json();
    const digest2 = (0, import_node_crypto6.createHash)("sha256").update(bundle).digest("hex");
    if (release2.sha256 !== digest2 || release2.archiveSha256 !== void 0 && release2.archiveSha256 !== digest2)
      throw new Error("Marketplace published archive checksum mismatch; check the release before publishing again");
    return release2;
  }
  /** Download a version's bundle and extract it to a fresh temp folder. */
  async downloadBundle(id2, version, scope, expectedId = id2, expectedChecksum) {
    const params = new URLSearchParams(scope ? { scope } : {});
    const query = params.size ? `?${params}` : "";
    const res = await this.request(
      `/marketplace/plugins/${encodeURIComponent(id2)}/versions/${encodeURIComponent(version)}/bundle${query}`
    );
    if (!res.body) throw new Error("Missing plugin bundle body");
    const reader = res.body.getReader();
    const chunks = [];
    let size = 0;
    try {
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > PLUGIN_ARCHIVE_MAX_BYTES) throw new Error("Plugin bundle exceeds download limit");
        chunks.push(value);
      }
    } finally {
      await reader.cancel();
    }
    const bytes = Buffer.concat(chunks);
    const archiveChecksum = res.headers.get("x-octonode-archive-sha256");
    if (archiveChecksum !== null && !/^[a-f0-9]{64}$/.test(archiveChecksum))
      throw new Error("Plugin registry archive checksum is invalid");
    const checksums = [archiveChecksum, res.headers.get("x-octonode-sha256"), expectedChecksum].filter(
      (checksum) => !!checksum
    );
    const digest2 = (0, import_node_crypto6.createHash)("sha256").update(bytes).digest("hex");
    for (const expected of checksums)
      if (/^[a-f0-9]{64}$/.test(expected) && expected !== digest2) throw new Error("Plugin registry checksum mismatch");
    const dir = (0, import_node_fs15.mkdtempSync)((0, import_node_path15.join)((0, import_node_os6.tmpdir)(), "octo-bundle-"));
    try {
      const extracted = extractPluginArchive(bytes, dir);
      const manifest2 = loadPluginManifest(extracted);
      if (manifest2.id !== expectedId || manifest2.version !== version)
        throw new Error(`Downloaded plugin does not match requested ${id2}@${version}`);
      for (const expected of checksums)
        if (!/^[a-f0-9]{64}$/.test(expected) && hashPluginDir(extracted) !== expected)
          throw new Error("Plugin registry checksum mismatch");
      return extracted;
    } catch (error) {
      (0, import_node_fs15.rmSync)(dir, { recursive: true, force: true });
      throw error;
    }
  }
  /**
   * Install a plugin from the hosted marketplace: resolve the version, download
   * + extract the bundle, run the normal local installer, then record the
   * install (with its granted permissions) in the marketplace DB.
   */
  async install(id2, opts = {}) {
    const detail = await this.detail(id2, opts.scope, opts.version);
    if (detail.manifestId && detail.manifestId !== id2)
      throw new Error("Publisher-qualified plugins require installToStore so their registry identity is preserved");
    const version = opts.version ?? detail.version;
    const release2 = detail.versions?.find((entry) => entry.version === version);
    const dir = await this.downloadBundle(
      id2,
      version,
      opts.scope,
      detail.manifestId ?? id2,
      release2?.archiveSha256 ?? release2?.sha256
    );
    const plugin = await installPlugin(dir, opts);
    const res = await this.request(`/marketplace/plugins/${encodeURIComponent(id2)}/install`, {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": opts.idempotencyKey ?? crypto.randomUUID() },
      body: JSON.stringify({
        version,
        scope: opts.scope,
        ownerId: opts.ownerId,
        environment: opts.environment ?? "self_hosted"
      })
    });
    const body = await res.json();
    return { plugin, installId: body.installId };
  }
  /**
   * Install a plugin the octonode.lock way: download + extract the bundle,
   * add it to the global content-addressed store, reconcile npm-derived deps
   * into this project, pin it in `octonode.lock`, and record the
   * install in the marketplace DB. The project repo is never touched beyond
   * the lockfile — the code lives in the store.
   */
  async installToStore(id2, opts = {}) {
    const detail = await this.detail(id2, opts.scope, opts.version);
    const version = opts.version ?? detail.version;
    const versionMeta = detail.versions?.find((v2) => v2.version === version);
    const releaseChecksum = versionMeta?.archiveSha256 ?? versionMeta?.sha256;
    if (!opts.cacheOnly && !opts.noDeps && !releaseChecksum)
      throw new Error("Marketplace release is missing its immutable checksum");
    const availableScopes = versionMeta?.scope ?? detail.scope;
    const scope = opts.scope && availableScopes.includes(opts.scope) ? opts.scope : availableScopes[0];
    const dir = await this.downloadBundle(id2, version, scope, detail.manifestId ?? id2, releaseChecksum);
    const entry = (() => {
      try {
        return addToStore(dir, { storeRoot: opts.storeRoot });
      } finally {
        (0, import_node_fs15.rmSync)((0, import_node_path15.dirname)(dir), { recursive: true, force: true });
      }
    })();
    const archiveSha256 = releaseChecksum && /^[a-f0-9]{64}$/.test(releaseChecksum) ? releaseChecksum : void 0;
    const prepared = this.baseUrl === (OCTONODE_MARKETPLACE_URL() ?? DEFAULT_MARKETPLACE_URL).replace(/\/$/, "") && usesPreparedRunner(entry.dir);
    if (entry.manifest.library && opts.noDeps && !opts.cacheOnly)
      throw new Error(
        "Library installation requires native dependency activation; use frozen --artifacts-only for CI restore"
      );
    if (!opts.cacheOnly && !opts.noDeps) {
      const alias2 = opts.alias ?? (detail.manifestId && id2 !== detail.manifestId ? id2 : entry.id);
      const pin2 = {
        pluginId: entry.id,
        remoteId: id2,
        version: entry.version,
        sha256: entry.sha256,
        archiveSha256,
        registry: this.baseUrl,
        scope,
        permissions: versionMeta?.permissions ?? detail.permissions,
        publisher: versionMeta?.publishedBy
      };
      let installId2 = "";
      if (prepared && !opts.dryRun) {
        installId2 = await this.registerInstall(id2, version, scope, { ...opts, environment: "cloud" });
        if (!installId2 || !/^[a-f0-9-]{36}$/.test(installId2))
          throw new Error("Marketplace did not authorize the prepared installation");
        pin2.installId = installId2;
      }
      try {
        await activatePluginPin(alias2, pin2, opts);
      } catch (error) {
        if (installId2) await this.postEvent(installId2, "uninstall").catch(() => {
        });
        throw error;
      }
      if (!opts.dryRun && !prepared) {
        try {
          installId2 = await this.registerInstall(id2, version, scope, opts);
          if (installId2)
            await withDependencyInstall(opts.cwd ?? process.cwd(), async () => {
              const current = readLockfile(opts.cwd).plugins[alias2];
              if (current?.sha256 === pin2.sha256 && current.registry === pin2.registry)
                upsertLockEntry(opts.cwd ?? process.cwd(), alias2, { ...current, installId: installId2 });
            });
        } catch {
        }
      }
      return {
        plugin: { manifest: entry.manifest, dir: entry.dir, source: "store" },
        entry,
        installId: installId2,
        depsInstalled: !opts.dryRun && (!prepared || !!entry.manifest.library)
      };
    }
    const deps = !prepared && (entry.created || entry.manifest.integration?.npm) ? await installNodeDeps(entry.dir, {
      noDeps: opts.noDeps,
      cwd: opts.cwd,
      cacheRoot: opts.cacheRoot,
      cacheOnly: opts.cacheOnly
    }) : {};
    if (deps.depsError) throw new Error(deps.depsError);
    const alias = opts.alias ?? (detail.manifestId && id2 !== detail.manifestId ? id2 : entry.id);
    const pin = {
      pluginId: entry.id,
      remoteId: id2,
      version: entry.version,
      sha256: entry.sha256,
      archiveSha256,
      registry: this.baseUrl,
      scope,
      publisher: versionMeta?.publishedBy,
      permissions: versionMeta?.permissions ?? detail.permissions
    };
    if (opts.dryRun)
      return { plugin: { manifest: entry.manifest, dir: entry.dir, source: "store" }, entry, installId: "" };
    let installId = "";
    if (prepared) {
      installId = await this.registerInstall(id2, version, scope, { ...opts, environment: "cloud" });
      if (!installId || !/^[a-f0-9-]{36}$/.test(installId))
        throw new Error("Marketplace did not authorize the prepared installation");
      pin.installId = installId;
    }
    try {
      await withDependencyInstall(opts.cwd ?? process.cwd(), async () => {
        const pins = readLockfile(opts.cwd).plugins;
        assertUniqueNpmPlugins([
          ...discoverPluginCatalog({ cwd: opts.cwd, storeRoot: opts.storeRoot }).plugins.filter(
            (item) => item.source === "project" && item.manifest.id !== alias && !pins[item.manifest.id]
          ).map((item) => ({ alias: item.manifest.id, manifest: item.manifest })),
          ...Object.entries(pins).filter(([key]) => key !== alias).map(([key, locked]) => ({
            alias: key,
            manifest: loadPluginManifest(
              storeEntryDir(locked.pluginId ?? key, locked.version, locked.sha256, opts.storeRoot)
            )
          })),
          { alias, manifest: entry.manifest }
        ]);
        const previous = pins[alias];
        if (previous && ((previous.pluginId ?? alias) !== entry.id || previous.registry !== this.baseUrl || previous.publisher !== pin.publisher))
          throw new Error("Plugin alias belongs to another publisher or registry");
        upsertLockEntry(opts.cwd ?? process.cwd(), alias, pin);
      });
    } catch (error) {
      if (installId) await this.postEvent(installId, "uninstall").catch(() => {
      });
      throw error;
    }
    if (prepared) return { plugin: { manifest: entry.manifest, dir: entry.dir, source: "store" }, entry, installId };
    try {
      installId = await this.registerInstall(id2, version, scope, opts);
      await withDependencyInstall(opts.cwd ?? process.cwd(), async () => {
        const current = readLockfile(opts.cwd).plugins[alias];
        if (current?.sha256 === pin.sha256 && current.registry === pin.registry)
          upsertLockEntry(opts.cwd ?? process.cwd(), alias, { ...current, installId });
      });
    } catch {
    }
    return { plugin: { manifest: entry.manifest, dir: entry.dir, source: "store" }, entry, installId, ...deps };
  }
  /** Report a lifecycle event (invoke/error/uninstall) for an install — the analytics feed. */
  async postEvent(installId, eventType, metadata, idempotencyKey = crypto.randomUUID()) {
    await this.request(`/marketplace/installs/${encodeURIComponent(installId)}/events`, {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": idempotencyKey },
      body: JSON.stringify({ eventType, metadata })
    });
  }
  async analytics(ownerId) {
    const params = new URLSearchParams({ limit: "100", ...ownerId ? { owner_id: ownerId } : {} });
    const res = await this.request(`/marketplace/analytics?${params}`);
    const result = await res.json();
    while (result.plugins.length < result.summary.pluginCount) {
      params.set("offset", String(result.plugins.length));
      const page = await (await this.request(`/marketplace/analytics?${params}`)).json();
      if (!page.plugins.length) break;
      result.plugins.push(...page.plugins);
    }
    return result;
  }
};
function packPluginDir(pluginDir) {
  pluginBundleFiles(pluginDir);
  const staging = (0, import_node_fs15.mkdtempSync)((0, import_node_path15.join)((0, import_node_os6.tmpdir)(), "octo-pack-"));
  const out = (0, import_node_path15.join)(staging, "bundle.tar.gz");
  try {
    (0, import_tar4.create)({ file: out, cwd: pluginDir, sync: true, portable: true, gzip: true }, pluginBundleFiles(pluginDir));
    return (0, import_node_fs15.readFileSync)(out);
  } finally {
    (0, import_node_fs15.rmSync)(staging, { recursive: true, force: true });
  }
}

// packages/plugin/src/restore.ts
async function installFromLock(opts = {}) {
  const cwd = resolveDependencyProject(opts.cwd ?? process.cwd()).target;
  if (opts.frozen && opts.force) throw new Error("Frozen restore cannot accept changed artifact bytes");
  if (opts.frozen && !(0, import_node_fs16.existsSync)((0, import_node_path16.join)(cwd, "octonode.lock"))) throw new Error("Frozen restore requires octonode.lock");
  return withDependencyInstall(cwd, async () => {
    const lock = readLockfile(cwd);
    if (lock.generated && opts.force)
      throw new Error("Generated packages require explicit version updates, not --force repinning");
    const result = { restored: [], present: [], errors: [] };
    for (const toolkit of Object.values(lock.toolkits ?? {})) {
      try {
        if (opts.offline) throw new Error("Toolkit access must be reauthorized online before restore");
        const resolved = await new RemoteRegistry({ baseUrl: toolkit.registry, token: opts.token }).forWorkspace(toolkit.destination).resolveToolkit(toolkit.id, {
          version: toolkit.version,
          sha256: toolkit.sha256,
          destination: toolkit.destination
        });
        const release2 = toolkitForMode(resolved, toolkit.mode ?? "development");
        if (!(0, import_node_util3.isDeepStrictEqual)(release2.actions ?? [], toolkit.actions ?? []) || release2.plugins.length !== toolkit.plugins.length || release2.plugins.some((member) => {
          const pin = lock.plugins[member.alias];
          return !toolkit.plugins.includes(member.alias) || !pin || pin.remoteId !== member.pluginId || pin.registry !== toolkit.registry || pin.version !== member.version || pin.archiveSha256 !== member.sha256;
        }))
          throw new Error("Toolkit membership disagrees with octonode.lock");
      } catch (error) {
        result.errors.push({ id: toolkit.id, message: error.message });
      }
    }
    if (result.errors.length) return result;
    const libraries = [];
    const runtimeManifests2 = [];
    const dependencies = [];
    const packageFile = (0, import_node_path16.join)(cwd, "package.json");
    const packageJson = (0, import_node_fs16.existsSync)(packageFile) ? JSON.parse((0, import_node_fs16.readFileSync)(packageFile, "utf8")) : {};
    for (const [alias, pin] of Object.entries(lock.plugins)) {
      try {
        const id2 = pin.pluginId ?? alias;
        const remoteId = pin.remoteId ?? id2;
        const registry = opts.registry ?? pin.registry;
        const toolkit = Object.values(lock.toolkits ?? {}).find((entry) => entry.plugins.includes(alias));
        const registryClient = registry ? new RemoteRegistry({ baseUrl: registry, token: opts.token }) : void 0;
        const remote = toolkit ? registryClient?.forWorkspace(toolkit.destination) : registryClient;
        if (opts.frozen && opts.registry && opts.registry !== pin.registry)
          throw new Error("Frozen restore cannot change the registry");
        if (pin.scope && pin.scope !== "public" && registry) {
          if (opts.offline) throw new Error("Private plugin access must be reauthorized online before restore");
          if (!await remote.matchesLockedRelease(id2, pin))
            throw new Error("Locked private release is not authorized or changed");
        }
        let directory = storeEntryDir(id2, pin.version, pin.sha256, opts.storeRoot);
        if (isPluginDir(directory)) {
          if (hashPluginDir(directory) !== pin.sha256) throw new Error("Corrupt plugin cache: " + alias);
          result.present.push(alias);
        } else {
          if (opts.offline) throw new Error("Plugin " + alias + " is not in the offline cache");
          if (!registry) throw new Error(alias + " has no registry recorded; reinstall this local artifact");
          const downloaded = await remote.downloadBundle(
            remoteId,
            pin.version,
            pin.scope,
            id2,
            opts.force ? void 0 : pin.archiveSha256
          );
          try {
            const actual = hashPluginDir(downloaded);
            if (actual !== pin.sha256 && !opts.force) throw new Error("integrity mismatch for " + alias);
            const entry = addToStore(downloaded, { storeRoot: opts.storeRoot });
            directory = entry.dir;
            if (actual !== pin.sha256)
              upsertLockEntry(cwd, alias, { ...pin, sha256: actual, archiveSha256: void 0 });
          } finally {
            (0, import_node_fs16.rmSync)((0, import_node_path16.dirname)(downloaded), { recursive: true, force: true });
          }
          result.restored.push(alias);
        }
        const manifest2 = loadPluginManifest(directory);
        if (manifest2.id !== id2 || manifest2.version !== pin.version)
          throw new Error("Plugin identity mismatch: " + alias);
        runtimeManifests2.push(manifest2);
        if (manifest2.library) libraries.push({ alias, directory, sha256: pin.sha256 });
        if (!manifest2.library && preparedPluginPin(directory, pin)) continue;
        if (!manifest2.library && !pluginNpmDependencies(manifest2).length && !opts.artifactsOnly && !opts.noDeps) {
          const packagePath = (0, import_node_path16.join)(directory, "package.json");
          const legacy = (0, import_node_fs16.existsSync)(packagePath) ? JSON.parse((0, import_node_fs16.readFileSync)(packagePath, "utf8")) : {};
          if (legacy.dependencies || legacy.optionalDependencies) {
            if (opts.frozen || opts.offline)
              throw new Error(
                "Legacy artifact dependencies cannot be restored frozen; publish a bundled artifact or use artifacts-only"
              );
            const installed = await installNodeDeps(directory, {
              cwd,
              cacheRoot: opts.cacheRoot,
              preserveArtifact: true
            });
            if (installed.depsError) throw new Error(installed.depsError);
          }
        }
        dependencies.push(
          ...pluginNpmDependencies(manifest2).map((npm) => ({
            name: npm.package,
            spec: npm.spec,
            development: !!packageJson.devDependencies?.[npm.package] && !packageJson.dependencies?.[npm.package] && !packageJson.optionalDependencies?.[npm.package]
          }))
        );
      } catch (error) {
        result.errors.push({ id: alias, message: error.message });
      }
    }
    if (result.errors.length) return result;
    try {
      if (!opts.artifactsOnly && !opts.noDeps) {
        const plan = await planPluginRuntimes(cwd, runtimeManifests2, { uv: opts.uv });
        if (!plan.ready)
          throw new Error(
            `Plugin runtime is not ready: ${plan.runtimes.filter((runtime) => runtime.status !== "ready").map((runtime) => runtime.message).join("; ")}. Review plugin runtime-plan and reinstall with --runtime-plan before running nodes`
          );
      }
      if (libraries.length || lock.generated) {
        if (!lock.generated)
          throw new Error("Plugin lock has no generated package pin; install the library explicitly first");
        const generated = await generatePluginPackage(cwd, libraries, lock.generated.packer);
        if (generated.spec !== lock.generated.spec || generated.sha256 !== lock.generated.sha256 || JSON.stringify(generated.subpaths) !== JSON.stringify(lock.generated.subpaths))
          throw new Error("Generated package does not match octonode.lock");
        const manifest2 = JSON.parse((0, import_node_fs16.readFileSync)((0, import_node_path16.join)(cwd, "package.json"), "utf8"));
        if (manifest2.dependencies?.[generated.name]?.replace(/^file:\.\//, "file:") !== generated.spec.replace(/^file:\.\//, "file:"))
          throw new Error("package.json disagrees with octonode.lock");
      }
      if (!opts.artifactsOnly && !opts.noDeps && (dependencies.length || lock.generated)) {
        if (opts.offline)
          throw new Error("Use --offline --artifacts-only, then the package manager's offline frozen install");
        await reconcileDependencies(cwd, opts.frozen || lock.generated ? [] : dependencies, {
          frozen: opts.frozen || !!lock.generated,
          cacheRoot: opts.cacheRoot
        });
      }
    } catch (error) {
      result.errors.push({ id: "project", message: error.message });
    }
    return result;
  });
}

// packages/plugin/src/consumer/lifecycle.ts
async function runPluginLifecycle(command, target, flags) {
  const selectedCwd = typeof flags.cwd === "string" ? (0, import_node_path17.resolve)(flags.cwd) : process.cwd();
  const cwd = resolveDependencyProject(selectedCwd).target;
  const scope = typeof flags.scope === "string" ? flags.scope : void 0;
  if (scope && !MARKETPLACE_SCOPES.includes(scope)) throw new Error("Invalid marketplace scope");
  const options = {
    cwd: selectedCwd,
    alias: typeof flags.alias === "string" ? flags.alias : void 0,
    migrate: !!flags.migrate,
    dryRun: !!flags["dry-run"],
    runtimeFingerprint: typeof flags["runtime-plan"] === "string" ? flags["runtime-plan"] : void 0,
    uv: typeof flags.uv === "string" ? flags.uv : void 0
  };
  if (command === "recover") {
    await recoverDependencyInstall(cwd);
    return { recovered: true };
  }
  if (command === "list") return readLockfile(cwd);
  if (command === "restore") {
    const result2 = await installFromLock({
      cwd,
      uv: options.uv,
      frozen: !!flags.frozen,
      artifactsOnly: !!flags["artifacts-only"],
      offline: !!flags.offline,
      token: typeof flags.token === "string" ? flags.token : void 0
    });
    if (result2.errors.length) throw new Error(result2.errors.map((error) => `${error.id}: ${error.message}`).join("\n"));
    return result2;
  }
  if (!target) throw new Error(`plugin ${command} requires a target`);
  if (command === "remove") {
    await removePluginPin(target, options);
    return { removed: target, dryRun: options.dryRun };
  }
  if (command === "install" && (0, import_node_fs17.existsSync)((0, import_node_path17.resolve)(selectedCwd, target))) {
    const entry = await installLocalArtifact((0, import_node_path17.resolve)(selectedCwd, target), options);
    return { id: options.alias ?? entry.id, version: entry.version, sha256: entry.sha256, dryRun: options.dryRun };
  }
  if (command !== "install" && command !== "update") throw new Error(`Unknown plugin lifecycle command: ${command}`);
  const pin = command === "update" ? readLockfile(cwd).plugins[target] : void 0;
  if (command === "update" && !pin) throw new Error(`Plugin ${target} is not installed`);
  const registry = typeof flags.registry === "string" ? flags.registry : pin?.registry;
  if (pin && registry !== pin.registry) throw new Error("Update cannot change plugin registry identity");
  const remote = new RemoteRegistry({
    baseUrl: registry,
    token: typeof flags.token === "string" ? flags.token : void 0
  });
  const result = await remote.installToStore(pin?.remoteId ?? pin?.pluginId ?? target, {
    ...options,
    alias: options.alias ?? (pin ? target : void 0),
    version: typeof flags.version === "string" ? flags.version : void 0,
    scope: pin?.scope ?? scope
  });
  return {
    id: options.alias ?? target,
    version: result.entry.version,
    sha256: result.entry.sha256,
    dryRun: options.dryRun
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  runPluginLifecycle
});
/*! Bundled license information:

re2js/build/index.js:
  (*!
  * re2js
  * RE2JS is the JavaScript port of RE2, a regular expression engine that provides linear time matching
  *
  * @version v2.8.6
  * @author Oleksii Vasyliev
  * @homepage https://github.com/le0pard/re2js#readme
  * @repository github:le0pard/re2js
  * @license MIT
  *)
*/
