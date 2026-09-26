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

// packages/plugin-runtime/dist/define-node.js
var require_define_node = __commonJS({
  "packages/plugin-runtime/dist/define-node.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.defineNode = defineNode;
    exports2.defineService = defineService;
    exports2.defineClass = defineClass;
    exports2.defineConst = defineConst;
    function defineNode(args) {
      return {
        id: args.id ?? "node",
        ...args.workflowId ? { workflowId: args.workflowId } : {},
        run: args.run,
        label: args.label,
        description: args.description,
        symbol: args.symbol,
        defaults: args.defaults,
        inputs: args.inputs,
        outputs: args.outputs,
        kind: args.kind,
        setup: args.setup,
        icon: args.icon,
        config: args.config
      };
    }
    var setupPassthrough = (_inputs, context) => context?.config ?? {};
    function defineService(args) {
      if ("create" in args && "expose" in args) {
        const methods = Array.isArray(args.expose) ? Object.fromEntries(args.expose.map((name) => [String(name), {}])) : args.expose;
        return {
          ...defineNode({
            id: args.id,
            run: setupPassthrough,
            kind: "service",
            setup: args.setup,
            icon: args.icon,
            config: args.config
          }),
          kind: "service",
          service: { create: args.create, lifecycle: args.lifecycle ?? "invocation", methods }
        };
      }
      return defineNode({ ...args, run: args.run ?? setupPassthrough, kind: "service" });
    }
    function defineClass(args) {
      return defineNode({ ...args, run: args.run ?? setupPassthrough, kind: "class" });
    }
    function defineConst(args) {
      return defineNode({ ...args, run: args.run ?? setupPassthrough, kind: "const" });
    }
  }
});

// packages/schema/dist/icons.js
var require_icons = __commonJS({
  "packages/schema/dist/icons.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.IconName = exports2.ICON_NAMES = void 0;
    var zod_1 = require("zod");
    exports2.ICON_NAMES = [
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
    exports2.IconName = zod_1.z.enum(exports2.ICON_NAMES);
  }
});

// packages/schema/dist/ipc-envelope.js
var require_ipc_envelope = __commonJS({
  "packages/schema/dist/ipc-envelope.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ManifestEnvelope = exports2.NodeManifest = exports2.ResultEnvelope = exports2.NodeError = exports2.RequestEnvelope = exports2.DescribeRequest = exports2.InvokeRequest = exports2.InvocationContext = exports2.ErrorCode = exports2.JsonSchema = exports2.PROTOCOL_VERSION = void 0;
    exports2.makeInvokeRequest = makeInvokeRequest;
    exports2.makeDescribeRequest = makeDescribeRequest;
    exports2.makeOkResult = makeOkResult;
    exports2.makeErrorResult = makeErrorResult;
    exports2.makeManifestResult = makeManifestResult;
    exports2.makeManifestError = makeManifestError;
    var zod_1 = require("zod");
    var icons_1 = require_icons();
    exports2.PROTOCOL_VERSION = "1";
    exports2.JsonSchema = zod_1.z.record(zod_1.z.unknown());
    exports2.ErrorCode = zod_1.z.enum([
      "VALIDATION_ERROR",
      // inputs/outputs failed schema validation
      "RUNTIME_ERROR",
      // the node threw, crashed, or emitted garbage
      "TIMEOUT",
      // the node exceeded its deadline
      "NON_RETRYABLE"
      // a deliberate, terminal failure the node raised
    ]);
    exports2.InvocationContext = zod_1.z.object({
      runId: zod_1.z.string().optional(),
      env: zod_1.z.string().optional(),
      config: zod_1.z.record(zod_1.z.unknown()).default({}),
      attempt: zod_1.z.number().int().positive().default(1),
      deadlineMs: zod_1.z.number().int().positive().optional()
    });
    exports2.InvokeRequest = zod_1.z.object({
      octonode: zod_1.z.literal(exports2.PROTOCOL_VERSION),
      type: zod_1.z.literal("invoke"),
      invocationId: zod_1.z.string(),
      /** Optional node id — useful once one process can host multiple nodes. */
      node: zod_1.z.string().optional(),
      inputs: zod_1.z.unknown(),
      context: exports2.InvocationContext.default({})
    });
    exports2.DescribeRequest = zod_1.z.object({
      octonode: zod_1.z.literal(exports2.PROTOCOL_VERSION),
      type: zod_1.z.literal("describe"),
      invocationId: zod_1.z.string(),
      node: zod_1.z.string().optional()
    });
    exports2.RequestEnvelope = zod_1.z.discriminatedUnion("type", [exports2.InvokeRequest, exports2.DescribeRequest]);
    exports2.NodeError = zod_1.z.object({
      code: exports2.ErrorCode,
      message: zod_1.z.string(),
      retryable: zod_1.z.boolean().default(false),
      details: zod_1.z.unknown().optional(),
      stack: zod_1.z.string().optional()
    });
    var ResultOk = zod_1.z.object({
      octonode: zod_1.z.literal(exports2.PROTOCOL_VERSION),
      type: zod_1.z.literal("result"),
      invocationId: zod_1.z.string(),
      status: zod_1.z.literal("ok"),
      outputs: zod_1.z.unknown()
    });
    var ResultErr = zod_1.z.object({
      octonode: zod_1.z.literal(exports2.PROTOCOL_VERSION),
      type: zod_1.z.literal("result"),
      invocationId: zod_1.z.string(),
      status: zod_1.z.literal("error"),
      error: exports2.NodeError
    });
    exports2.ResultEnvelope = zod_1.z.discriminatedUnion("status", [ResultOk, ResultErr]);
    exports2.NodeManifest = zod_1.z.object({
      id: zod_1.z.string(),
      label: zod_1.z.string().optional(),
      description: zod_1.z.string().optional(),
      symbol: zod_1.z.string().max(16).optional(),
      defaults: zod_1.z.record(zod_1.z.unknown()).optional(),
      /** A workflow wrapper receives the current execution config through its invocation context. */
      workflowId: zod_1.z.string().min(1).optional(),
      language: zod_1.z.string(),
      inputs: exports2.JsonSchema.optional(),
      outputs: exports2.JsonSchema.optional(),
      /**
       * What this node is: `function` (default), `class`, `service`, or `const`.
       * Set by the setup-time SDK helpers (defineService/defineClass/defineConst)
       * so `scan` writes it to `.octonode`.
       */
      kind: zod_1.z.enum(["function", "class", "service", "const"]).optional(),
      /** Setup params for non-function kinds (constructor/config shape). */
      setup: exports2.JsonSchema.optional(),
      /** Advisory default icon — a one-time seed; config owns it thereafter. */
      icon: icons_1.IconName.optional(),
      /** Advisory default config — a one-time seed; config owns it thereafter. */
      config: zod_1.z.record(zod_1.z.unknown()).optional(),
      /** Explicit service exposure. Plain classes never populate this field. */
      service: zod_1.z.object({
        lifecycle: zod_1.z.enum(["invocation", "workflow-run", "worker"]),
        methods: zod_1.z.array(zod_1.z.object({
          name: zod_1.z.string(),
          params: zod_1.z.array(zod_1.z.string()).default([]),
          inputs: exports2.JsonSchema.optional(),
          outputs: exports2.JsonSchema.optional()
        }))
      }).optional()
    });
    var ManifestOk = zod_1.z.object({
      octonode: zod_1.z.literal(exports2.PROTOCOL_VERSION),
      type: zod_1.z.literal("manifest"),
      invocationId: zod_1.z.string(),
      status: zod_1.z.literal("ok"),
      manifest: exports2.NodeManifest
    });
    var ManifestErr = zod_1.z.object({
      octonode: zod_1.z.literal(exports2.PROTOCOL_VERSION),
      type: zod_1.z.literal("manifest"),
      invocationId: zod_1.z.string(),
      status: zod_1.z.literal("error"),
      error: exports2.NodeError
    });
    exports2.ManifestEnvelope = zod_1.z.discriminatedUnion("status", [ManifestOk, ManifestErr]);
    function makeInvokeRequest(args) {
      return exports2.InvokeRequest.parse({
        octonode: exports2.PROTOCOL_VERSION,
        type: "invoke",
        invocationId: args.invocationId,
        node: args.node,
        inputs: args.inputs,
        context: args.context ?? {}
      });
    }
    function makeDescribeRequest(args) {
      return exports2.DescribeRequest.parse({
        octonode: exports2.PROTOCOL_VERSION,
        type: "describe",
        invocationId: args.invocationId,
        node: args.node
      });
    }
    function makeOkResult(invocationId, outputs) {
      return {
        octonode: exports2.PROTOCOL_VERSION,
        type: "result",
        invocationId,
        status: "ok",
        outputs
      };
    }
    function makeErrorResult(invocationId, error) {
      return {
        octonode: exports2.PROTOCOL_VERSION,
        type: "result",
        invocationId,
        status: "error",
        error: exports2.NodeError.parse(error)
      };
    }
    function makeManifestResult(invocationId, manifest2) {
      return {
        octonode: exports2.PROTOCOL_VERSION,
        type: "manifest",
        invocationId,
        status: "ok",
        manifest: exports2.NodeManifest.parse(manifest2)
      };
    }
    function makeManifestError(invocationId, error) {
      return {
        octonode: exports2.PROTOCOL_VERSION,
        type: "manifest",
        invocationId,
        status: "error",
        error: exports2.NodeError.parse(error)
      };
    }
  }
});

// node_modules/croner/dist/croner.cjs
var require_croner = __commonJS({
  "node_modules/croner/dist/croner.cjs"(exports2, module2) {
    var D = Object.defineProperty;
    var x = Object.getOwnPropertyDescriptor;
    var E = Object.getOwnPropertyNames;
    var M = Object.prototype.hasOwnProperty;
    var U = (n, t) => {
      for (var e in t) D(n, e, { get: t[e], enumerable: true });
    };
    var A = (n, t, e, r) => {
      if (t && typeof t == "object" || typeof t == "function") for (let s of E(t)) !M.call(n, s) && s !== e && D(n, s, { get: () => t[s], enumerable: !(r = x(t, s)) || r.enumerable });
      return n;
    };
    var z3 = (n) => A(D({}, "__esModule", { value: true }), n);
    var W = {};
    U(W, { Cron: () => N, CronDate: () => h, CronPattern: () => g, scheduledJobs: () => C });
    module2.exports = z3(W);
    function f(n, t, e, r, s, i, a, l) {
      return f.fromTZ(f.tp(n, t, e, r, s, i, a), l);
    }
    f.fromTZISO = (n, t, e) => f.fromTZ(I(n, t), e);
    f.fromTZ = function(n, t) {
      let e = new Date(Date.UTC(n.y, n.m - 1, n.d, n.h, n.i, n.s)), r = v(n.tz, e), s = new Date(e.getTime() - r), i = v(n.tz, s);
      if (i - r === 0) return s;
      {
        let a = new Date(e.getTime() - i), l = v(n.tz, a);
        if (l - i === 0) return a;
        if (!t && l - i > 0) return a;
        if (t) throw new Error("Invalid date passed to fromTZ()");
        return s;
      }
    };
    f.toTZ = function(n, t) {
      let e = n.toLocaleString("en-US", { timeZone: t }).replace(/[\u202f]/, " "), r = new Date(e);
      return { y: r.getFullYear(), m: r.getMonth() + 1, d: r.getDate(), h: r.getHours(), i: r.getMinutes(), s: r.getSeconds(), tz: t };
    };
    f.tp = (n, t, e, r, s, i, a) => ({ y: n, m: t, d: e, h: r, i: s, s: i, tz: a });
    function v(n, t = /* @__PURE__ */ new Date()) {
      let e = t.toLocaleString("en-US", { timeZone: n, timeZoneName: "shortOffset" }).split(" ").slice(-1)[0], r = t.toLocaleString("en-US").replace(/[\u202f]/, " ");
      return Date.parse(`${r} GMT`) - Date.parse(`${r} ${e}`);
    }
    function I(n, t) {
      let e = new Date(Date.parse(n));
      if (isNaN(e)) throw new Error("minitz: Invalid ISO8601 passed to parser.");
      let r = n.substring(9);
      return n.includes("Z") || r.includes("-") || r.includes("+") ? f.tp(e.getUTCFullYear(), e.getUTCMonth() + 1, e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), "Etc/UTC") : f.tp(e.getFullYear(), e.getMonth() + 1, e.getDate(), e.getHours(), e.getMinutes(), e.getSeconds(), t);
    }
    f.minitz = f;
    var y = 32;
    var p = 31 | y;
    var O = [1, 2, 4, 8, 16];
    var g = class {
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
          let e = new h(/* @__PURE__ */ new Date(), this.timezone).getDate(true);
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
        let [, l, o, u] = a, c = parseInt(l, 10) + r, w = parseInt(o, 10) + r, b = parseInt(u, 10);
        if (isNaN(c)) throw new TypeError("CronPattern: Syntax error, illegal lower range (NaN)");
        if (isNaN(w)) throw new TypeError("CronPattern: Syntax error, illegal upper range (NaN)");
        if (isNaN(b)) throw new TypeError("CronPattern: Syntax error, illegal stepping: (NaN)");
        if (b === 0) throw new TypeError("CronPattern: Syntax error, illegal stepping: 0");
        if (b > this[e].length) throw new TypeError("CronPattern: Syntax error, steps cannot be greater than maximum value of part (" + this[e].length + ")");
        if (c > w) throw new TypeError("CronPattern: From value is larger than to value: '" + t + "'");
        for (let T = c; T <= w; T += b) this.setPart(e, T, i[1] || s);
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
        if (typeof e != "number" && e === "L") this.dayOfWeek[t] = this.dayOfWeek[t] | y;
        else if (e === p) this.dayOfWeek[t] = p;
        else if (e < 6 && e > 0) this.dayOfWeek[t] = this.dayOfWeek[t] | O[e - 1];
        else throw new TypeError(`CronPattern: nth weekday out of range, should be 1-5 or L. Value: ${e}, Type: ${typeof e}`);
      }
    };
    var S = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var m = [["month", "year", 0], ["day", "month", -1], ["hour", "day", 0], ["minute", "hour", 0], ["second", "minute", 0]];
    var h = class n {
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
        if (s & p && O[l - 1] & s) return true;
        if (s & y) {
          let o = new Date(Date.UTC(t, e + 1, 0)).getUTCDate();
          for (let u = r + 1; u <= o; u++) if (new Date(Date.UTC(t, e, u)).getUTCDay() === a) return false;
          return true;
        }
        return false;
      }
      fromDate(t) {
        if (this.tz !== void 0) if (typeof this.tz == "number") this.ms = t.getUTCMilliseconds(), this.second = t.getUTCSeconds(), this.minute = t.getUTCMinutes() + this.tz, this.hour = t.getUTCHours(), this.day = t.getUTCDate(), this.month = t.getUTCMonth(), this.year = t.getUTCFullYear(), this.apply();
        else {
          let e = f.toTZ(t, this.tz);
          this.ms = t.getMilliseconds(), this.second = e.s, this.minute = e.i, this.hour = e.h, this.day = e.d, this.month = e.m - 1, this.year = e.y;
        }
        else this.ms = t.getMilliseconds(), this.second = t.getSeconds(), this.minute = t.getMinutes(), this.hour = t.getHours(), this.day = t.getDate(), this.month = t.getMonth(), this.year = t.getFullYear();
      }
      fromCronDate(t) {
        this.tz = t.tz, this.year = t.year, this.month = t.month, this.day = t.day, this.hour = t.hour, this.minute = t.minute, this.second = t.second, this.ms = t.ms;
      }
      apply() {
        if (this.month > 11 || this.day > S[this.month] || this.hour > 59 || this.minute > 59 || this.second > 59 || this.hour < 0 || this.minute < 0 || this.second < 0) {
          let t = new Date(Date.UTC(this.year, this.month, this.day, this.hour, this.minute, this.second, this.ms));
          return this.ms = t.getUTCMilliseconds(), this.second = t.getUTCSeconds(), this.minute = t.getUTCMinutes(), this.hour = t.getUTCHours(), this.day = t.getUTCDate(), this.month = t.getUTCMonth(), this.year = t.getUTCFullYear(), true;
        } else return false;
      }
      fromString(t) {
        if (typeof this.tz == "number") {
          let e = f.fromTZISO(t);
          this.ms = e.getUTCMilliseconds(), this.second = e.getUTCSeconds(), this.minute = e.getUTCMinutes(), this.hour = e.getUTCHours(), this.day = e.getUTCDate(), this.month = e.getUTCMonth(), this.year = e.getUTCFullYear(), this.apply();
        } else return this.fromDate(f.fromTZISO(t, this.tz));
      }
      findNext(t, e, r, s) {
        let i = this[e], a;
        r.lastDayOfMonth && (this.month !== 1 ? a = S[this.month] : a = new Date(Date.UTC(this.year, this.month + 1, 0, 0, 0, 0, 0)).getUTCDate());
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
        return t || this.tz === void 0 ? new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.ms) : typeof this.tz == "number" ? new Date(Date.UTC(this.year, this.month, this.day, this.hour, this.minute - this.tz, this.second, this.ms)) : f.fromTZ(f.tp(this.year, this.month + 1, this.day, this.hour, this.minute, this.second, this.tz), false);
      }
      getTime() {
        return this.getDate(false).getTime();
      }
    };
    function P(n) {
      if (n === void 0 && (n = {}), delete n.name, n.legacyMode = n.legacyMode === void 0 ? true : n.legacyMode, n.paused = n.paused === void 0 ? false : n.paused, n.maxRuns = n.maxRuns === void 0 ? 1 / 0 : n.maxRuns, n.catch = n.catch === void 0 ? false : n.catch, n.interval = n.interval === void 0 ? 0 : parseInt(n.interval.toString(), 10), n.utcOffset = n.utcOffset === void 0 ? void 0 : parseInt(n.utcOffset.toString(), 10), n.unref = n.unref === void 0 ? false : n.unref, n.startAt && (n.startAt = new h(n.startAt, n.timezone)), n.stopAt && (n.stopAt = new h(n.stopAt, n.timezone)), n.interval !== null) {
        if (isNaN(n.interval)) throw new Error("CronOptions: Supplied value for interval is not a number");
        if (n.interval < 0) throw new Error("CronOptions: Supplied value for interval can not be negative");
      }
      if (n.utcOffset !== void 0) {
        if (isNaN(n.utcOffset)) throw new Error("CronOptions: Invalid value passed for utcOffset, should be number representing minutes offset from UTC.");
        if (n.utcOffset < -870 || n.utcOffset > 870) throw new Error("CronOptions: utcOffset out of bounds.");
        if (n.utcOffset !== void 0 && n.timezone) throw new Error("CronOptions: Combining 'utcOffset' with 'timezone' is not allowed.");
      }
      if (n.unref !== true && n.unref !== false) throw new Error("CronOptions: Unref should be either true, false or undefined(false).");
      return n;
    }
    function d(n) {
      return Object.prototype.toString.call(n) === "[object Function]" || typeof n == "function" || n instanceof Function;
    }
    function _(n) {
      return d(n);
    }
    function R(n) {
      typeof Deno < "u" && typeof Deno.unrefTimer < "u" ? Deno.unrefTimer(n) : n && typeof n.unref < "u" && n.unref();
    }
    var k = 30 * 1e3;
    var C = [];
    var N = class {
      name;
      options;
      _states;
      fn;
      constructor(t, e, r) {
        let s, i;
        if (d(e)) i = e;
        else if (typeof e == "object") s = e;
        else if (e !== void 0) throw new Error("Cron: Invalid argument passed for optionsIn. Should be one of function, or object (options).");
        if (d(r)) i = r;
        else if (typeof r == "object") s = r;
        else if (r !== void 0) throw new Error("Cron: Invalid argument passed for funcIn. Should be one of function, or object (options).");
        if (this.name = s?.name, this.options = P(s), this._states = { kill: false, blocking: false, previousRun: void 0, currentRun: void 0, once: void 0, currentTimeout: void 0, maxRuns: s ? s.maxRuns : void 0, paused: s ? s.paused : false, pattern: new g("* * * * *") }, t && (t instanceof Date || typeof t == "string" && t.indexOf(":") > 0) ? this._states.once = new h(t, this.options.timezone || this.options.utcOffset) : this._states.pattern = new g(t, this.options.timezone), this.name) {
          if (C.find((l) => l.name === this.name)) throw new Error("Cron: Tried to initialize new named job '" + this.name + "', but name already taken.");
          C.push(this);
        }
        return i !== void 0 && _(i) && (this.fn = i, this.schedule()), this;
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
        return e ? t instanceof h || t instanceof Date ? e.getTime() - t.getTime() : e.getTime() - new h(t).getTime() : null;
      }
      stop() {
        this._states.kill = true, this._states.currentTimeout && clearTimeout(this._states.currentTimeout);
        let t = C.indexOf(this);
        t >= 0 && C.splice(t, 1);
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
        return e == null || isNaN(e) || r === null ? this : (e > k && (e = k), this._states.currentTimeout = setTimeout(() => this._checkTrigger(r), e), this._states.currentTimeout && this.options.unref && R(this._states.currentTimeout), this);
      }
      async _trigger(t) {
        if (this._states.blocking = true, this._states.currentRun = new h(void 0, this.options.timezone || this.options.utcOffset), this.options.catch) try {
          this.fn !== void 0 && await this.fn(this, this.options.context);
        } catch (e) {
          d(this.options.catch) && this.options.catch(e, this);
        }
        else this.fn !== void 0 && await this.fn(this, this.options.context);
        this._states.previousRun = new h(t, this.options.timezone || this.options.utcOffset), this._states.blocking = false;
      }
      async trigger() {
        await this._trigger();
      }
      runsLeft() {
        return this._states.maxRuns;
      }
      _checkTrigger(t) {
        let e = /* @__PURE__ */ new Date(), r = !this._states.paused && e.getTime() >= t.getTime(), s = this._states.blocking && this.options.protect;
        r && !s ? (this._states.maxRuns !== void 0 && this._states.maxRuns--, this._trigger()) : r && s && d(this.options.protect) && setTimeout(() => this.options.protect(this), 0), this.schedule();
      }
      _next(t) {
        let e = !!(t || this._states.currentRun), r = false;
        !t && this.options.startAt && this.options.interval && ([t, e] = this._calculatePreviousRun(t, e), r = !t), t = new h(t, this.options.timezone || this.options.utcOffset), this.options.startAt && t && t.getTime() < this.options.startAt.getTime() && (t = this.options.startAt);
        let s = this._states.once || new h(t, this.options.timezone || this.options.utcOffset);
        return !r && s !== this._states.once && (s = s.increment(this._states.pattern, this.options, e)), this._states.once && this._states.once.getTime() <= t.getTime() || s === null || this._states.maxRuns !== void 0 && this._states.maxRuns <= 0 || this._states.kill || this.options.stopAt && s.getTime() >= this.options.stopAt.getTime() ? null : s;
      }
      _calculatePreviousRun(t, e) {
        let r = new h(void 0, this.options.timezone || this.options.utcOffset), s = t;
        if (this.options.startAt.getTime() <= r.getTime()) {
          s = this.options.startAt;
          let i = s.getTime() + this.options.interval * 1e3;
          for (; i <= r.getTime(); ) s = new h(s, this.options.timezone || this.options.utcOffset).increment(this._states.pattern, this.options, true), i = s.getTime() + this.options.interval * 1e3;
          e = true;
        }
        return s === null && (s = void 0), [s, e];
      }
    };
  }
});

// packages/schema/dist/workflow-triggers.js
var require_workflow_triggers = __commonJS({
  "packages/schema/dist/workflow-triggers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WorkflowTriggerUpdate = exports2.WorkflowTriggerState = exports2.WorkflowTriggers = exports2.WorkflowTrigger = void 0;
    exports2.nextCronRun = nextCronRun;
    exports2.triggerInput = triggerInput;
    var croner_1 = require_croner();
    var zod_1 = require("zod");
    function nextCronRun(expression, timezone, after = /* @__PURE__ */ new Date()) {
      return new croner_1.Cron(expression, { timezone }).nextRun(after);
    }
    var triggerBase = zod_1.z.object({
      id: zod_1.z.string().uuid(),
      name: zod_1.z.string().trim().min(1).max(100),
      enabled: zod_1.z.boolean().default(false)
    });
    exports2.WorkflowTrigger = zod_1.z.discriminatedUnion("kind", [
      triggerBase.extend({
        kind: zod_1.z.literal("cron"),
        provider: zod_1.z.enum(["native", "external"]),
        expression: zod_1.z.string().trim().max(100),
        timezone: zod_1.z.string().max(100),
        input: zod_1.z.record(zod_1.z.unknown()).default({})
      }),
      triggerBase.extend({
        kind: zod_1.z.literal("webhook"),
        /** Empty uses the whole JSON body; otherwise selects an object at a JSON Pointer. */
        payloadPath: zod_1.z.string().max(500).regex(/^(?:|\/(?:[^~]|~[01])*)$/).default("")
      })
    ]);
    exports2.WorkflowTriggers = zod_1.z.array(exports2.WorkflowTrigger).max(20).superRefine((triggers, ctx) => {
      const ids = /* @__PURE__ */ new Set();
      triggers.forEach((trigger, index) => {
        if (ids.has(trigger.id))
          ctx.addIssue({ code: "custom", path: [index, "id"], message: "Trigger IDs must be unique" });
        ids.add(trigger.id);
        if (trigger.kind !== "cron")
          return;
        try {
          if (trigger.expression.split(/\s+/).length !== 5)
            throw new Error("Use a five-field cron expression");
          new Intl.DateTimeFormat("en", { timeZone: trigger.timezone });
          if (!nextCronRun(trigger.expression, trigger.timezone))
            throw new Error("Schedule has no future occurrence");
        } catch (error) {
          ctx.addIssue({
            code: "custom",
            path: [index, "expression"],
            message: error instanceof Error ? error.message : "Invalid schedule"
          });
        }
      });
    });
    exports2.WorkflowTriggerState = zod_1.z.object({
      revision: zod_1.z.string(),
      active: zod_1.z.boolean(),
      triggers: exports2.WorkflowTriggers,
      nativeCron: zod_1.z.boolean(),
      synchronized: zod_1.z.boolean(),
      nextRuns: zod_1.z.record(zod_1.z.string().datetime()),
      lastError: zod_1.z.string().optional()
    });
    exports2.WorkflowTriggerUpdate = zod_1.z.object({
      baseRevision: zod_1.z.string().regex(/^[a-f0-9]{64}$/),
      active: zod_1.z.boolean(),
      triggers: exports2.WorkflowTriggers
    });
    function triggerInput(trigger, payload) {
      if (trigger.kind === "cron")
        return trigger.input;
      let value = payload;
      for (const encoded of trigger.payloadPath ? trigger.payloadPath.slice(1).split("/") : []) {
        const key = encoded.replace(/~1/g, "/").replace(/~0/g, "~");
        if (!value || typeof value !== "object" || !Object.hasOwn(value, key))
          throw new Error("Webhook payload path was not found");
        value = value[key];
      }
      return zod_1.z.record(zod_1.z.unknown()).parse(value);
    }
  }
});

// packages/schema/dist/workflow-entry.js
var require_workflow_entry = __commonJS({
  "packages/schema/dist/workflow-entry.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WorkflowEntryNodes = exports2.WorkflowNodeRole = void 0;
    exports2.isWorkflowEntryIcon = isWorkflowEntryIcon;
    var zod_1 = require("zod");
    exports2.WorkflowNodeRole = zod_1.z.enum(["entry", "step"]);
    function isWorkflowEntryIcon(icon, role) {
      return role ? role === "entry" : icon === "play" || icon === "webhook";
    }
    exports2.WorkflowEntryNodes = zod_1.z.array(zod_1.z.object({ id: zod_1.z.string(), icon: zod_1.z.string().optional(), role: exports2.WorkflowNodeRole.optional() })).superRefine((nodes, ctx) => {
      const entries = nodes.filter((node) => isWorkflowEntryIcon(node.icon, node.role));
      if (new Set(entries.map((node) => node.id)).size > 1)
        ctx.addIssue({ code: "custom", message: "A workflow can contain only one Start or Webhook entry node." });
    });
  }
});

// packages/schema/dist/constants.js
var require_constants = __commonJS({
  "packages/schema/dist/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PLUGIN_PUBLISH_MAX_BYTES = exports2.PLUGIN_CONFIG_MAX_BYTES = exports2.PLUGIN_PUBLISH_AUDIENCE = exports2.PLUGIN_RELEASE_FILES = exports2.CAPABILITY_UNAVAILABLE_REASONS = exports2.CAPABILITY_MODES = exports2.PLATFORM_CAPABILITIES = exports2.SOURCE_CONTROL_REGION_KINDS = exports2.TASK_RELEASE_STATES = exports2.TASK_SPRINT_STATES = exports2.TASK_LINK_TYPES = exports2.TASK_VIEW_SORTS = exports2.TASK_VIEW_GROUPS = exports2.TASK_VIEW_LAYOUTS = exports2.TASK_FIELD_TYPES = exports2.WORK_ITEM_PRIORITIES = exports2.BUILTIN_WORK_ITEM_TYPES = exports2.WORK_ITEM_LEVELS = exports2.TASK_STATUS_CATEGORIES = exports2.TASK_SPACE_TEMPLATES = exports2.COLLABORATION_ACTIONS = exports2.AGENT_TOOL_RISKS = exports2.AGENT_ERROR_CODES = exports2.AGENT_RUN_STATUSES = exports2.WORKSPACE_ACTIONS = exports2.SETTINGS_SECTIONS = exports2.SETTINGS_API_VERSION = exports2.MARKETPLACE_SCOPES = exports2.PLUGIN_DEFINITION_FILENAMES = exports2.PLUGIN_MANIFEST_FILENAME = exports2.COMMUNITY_MEDIA_TYPES = exports2.COMMUNITY_MEDIA_BODY_BYTES = exports2.COMMUNITY_MEDIA_VIDEO_BYTES = exports2.COMMUNITY_MEDIA_IMAGE_BYTES = exports2.PROJECT_JOB_PROTOCOL = exports2.PLUGIN_SCHEMA_VERSION = void 0;
    exports2.PLUGIN_SCHEMA_VERSION = "1";
    exports2.PROJECT_JOB_PROTOCOL = "octonode.project-job.v1";
    exports2.COMMUNITY_MEDIA_IMAGE_BYTES = 8 * 1024 * 1024;
    exports2.COMMUNITY_MEDIA_VIDEO_BYTES = 20 * 1024 * 1024;
    exports2.COMMUNITY_MEDIA_BODY_BYTES = Math.ceil(exports2.COMMUNITY_MEDIA_VIDEO_BYTES / 3) * 4 + 4096;
    exports2.COMMUNITY_MEDIA_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm"
    ];
    exports2.PLUGIN_MANIFEST_FILENAME = "octonode.plugin.json";
    exports2.PLUGIN_DEFINITION_FILENAMES = [
      "octonode.yml",
      "octonode.yaml",
      "octonode.json",
      exports2.PLUGIN_MANIFEST_FILENAME
    ];
    exports2.MARKETPLACE_SCOPES = ["user", "group", "org", "public"];
    exports2.SETTINGS_API_VERSION = "octonode.dev/settings/v1";
    exports2.SETTINGS_SECTIONS = ["appearance", "overrides", "layers", "views", "discovery"];
    exports2.WORKSPACE_ACTIONS = [
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
      "content:read",
      "content:write",
      "content:publish",
      "content:moderate"
    ];
    exports2.AGENT_RUN_STATUSES = [
      "queued",
      "running",
      "approval_required",
      "completed",
      "cancelled",
      "failed"
    ];
    exports2.AGENT_ERROR_CODES = [
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
      "permission_denied",
      "approval_denied",
      "conflict",
      "internal_error"
    ];
    exports2.AGENT_TOOL_RISKS = ["read", "write", "high"];
    exports2.COLLABORATION_ACTIONS = [
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
    exports2.TASK_SPACE_TEMPLATES = ["simple", "kanban", "scrum"];
    exports2.TASK_STATUS_CATEGORIES = ["todo", "in_progress", "done"];
    exports2.WORK_ITEM_LEVELS = ["initiative", "epic", "standard", "subtask"];
    exports2.BUILTIN_WORK_ITEM_TYPES = ["initiative", "epic", "story", "task", "bug", "subtask"];
    exports2.WORK_ITEM_PRIORITIES = ["highest", "high", "medium", "low", "lowest"];
    exports2.TASK_FIELD_TYPES = [
      "text",
      "number",
      "single_select",
      "multi_select",
      "date",
      "checkbox",
      "user",
      "url"
    ];
    exports2.TASK_VIEW_LAYOUTS = ["board", "list", "calendar", "timeline"];
    exports2.TASK_VIEW_GROUPS = [
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
    exports2.TASK_VIEW_SORTS = ["rank", "updated", "due", "priority"];
    exports2.TASK_LINK_TYPES = ["blocks", "duplicates", "relates"];
    exports2.TASK_SPRINT_STATES = ["future", "active", "completed"];
    exports2.TASK_RELEASE_STATES = ["unreleased", "released", "archived"];
    exports2.SOURCE_CONTROL_REGION_KINDS = [
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
    exports2.PLATFORM_CAPABILITIES = [
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
    exports2.CAPABILITY_MODES = ["trusted-local", "configured-local-cloud", "hosted"];
    exports2.CAPABILITY_UNAVAILABLE_REASONS = [
      "not_implemented",
      "requires_cloud_configuration",
      "requires_hosted_runtime",
      "provider_not_configured",
      "disabled_by_policy",
      "missing_entitlement",
      "missing_permission"
    ];
    exports2.PLUGIN_RELEASE_FILES = [
      exports2.PLUGIN_MANIFEST_FILENAME,
      "plugin.octonode.json",
      "plugin.octonode.yml",
      "plugin.octonode.yaml"
    ];
    exports2.PLUGIN_PUBLISH_AUDIENCE = "https://plugins.octonodes.com";
    exports2.PLUGIN_CONFIG_MAX_BYTES = 65536;
    exports2.PLUGIN_PUBLISH_MAX_BYTES = 32 * 1024 * 1024;
  }
});

// packages/schema/dist/source-index.js
var require_source_index = __commonJS({
  "packages/schema/dist/source-index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ProjectPackageExports = exports2.ProjectSourceIndex = exports2.SourceFileIndex = exports2.SourceImport = exports2.SourceRecursion = exports2.SourceReference = exports2.SourceSymbol = exports2.SourceControlRegion = exports2.SourceDiagnostic = exports2.SourceClassMember = exports2.SourceParameter = exports2.SourceDecorator = exports2.SourceSymbolKind = exports2.SourceLocation = void 0;
    var zod_1 = require("zod");
    var constants_1 = require_constants();
    exports2.SourceLocation = zod_1.z.object({
      path: zod_1.z.string(),
      start: zod_1.z.number().int().nonnegative(),
      end: zod_1.z.number().int().nonnegative(),
      line: zod_1.z.number().int().positive(),
      column: zod_1.z.number().int().positive()
    });
    exports2.SourceSymbolKind = zod_1.z.enum([
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
    exports2.SourceDecorator = zod_1.z.object({
      name: zod_1.z.string(),
      text: zod_1.z.string(),
      arguments: zod_1.z.array(zod_1.z.string())
    });
    exports2.SourceParameter = zod_1.z.object({
      name: zod_1.z.string(),
      type: zod_1.z.string().optional(),
      optional: zod_1.z.boolean().optional(),
      rest: zod_1.z.boolean().optional(),
      visibility: zod_1.z.enum(["public", "protected", "private", "#private"]).optional(),
      readonly: zod_1.z.boolean().optional(),
      decorators: zod_1.z.array(exports2.SourceDecorator).optional(),
      initializer: zod_1.z.string().optional()
    });
    exports2.SourceClassMember = zod_1.z.object({
      name: zod_1.z.string(),
      kind: zod_1.z.enum([
        "constructor",
        "method",
        "property",
        "getter",
        "setter",
        "accessor",
        "index-signature",
        "static-block"
      ]),
      type: zod_1.z.string().optional(),
      returns: zod_1.z.string().optional(),
      parameters: zod_1.z.array(exports2.SourceParameter).optional(),
      typeParameters: zod_1.z.array(zod_1.z.string()).optional(),
      visibility: zod_1.z.enum(["public", "protected", "private", "#private"]).optional(),
      static: zod_1.z.boolean().optional(),
      readonly: zod_1.z.boolean().optional(),
      declare: zod_1.z.boolean().optional(),
      definite: zod_1.z.boolean().optional(),
      abstract: zod_1.z.boolean().optional(),
      optional: zod_1.z.boolean().optional(),
      override: zod_1.z.boolean().optional(),
      async: zod_1.z.boolean().optional(),
      generator: zod_1.z.boolean().optional(),
      decorators: zod_1.z.array(exports2.SourceDecorator).optional(),
      initializer: zod_1.z.string().optional(),
      workflowId: zod_1.z.string().optional()
    });
    exports2.SourceDiagnostic = zod_1.z.object({
      severity: zod_1.z.enum(["error", "warning"]),
      code: zod_1.z.string(),
      message: zod_1.z.string(),
      location: exports2.SourceLocation.optional()
    });
    exports2.SourceControlRegion = zod_1.z.object({
      id: zod_1.z.string(),
      kind: zod_1.z.enum(constants_1.SOURCE_CONTROL_REGION_KINDS),
      path: zod_1.z.array(zod_1.z.number().int().nonnegative()),
      parentId: zod_1.z.string().optional(),
      location: exports2.SourceLocation,
      source: zod_1.z.string()
    });
    exports2.SourceSymbol = zod_1.z.object({
      id: zod_1.z.string(),
      name: zod_1.z.string(),
      kind: exports2.SourceSymbolKind,
      exported: zod_1.z.boolean(),
      location: exports2.SourceLocation,
      declaration: zod_1.z.string().optional(),
      owner: zod_1.z.string().optional(),
      signature: zod_1.z.object({
        params: zod_1.z.array(exports2.SourceParameter).optional(),
        returns: zod_1.z.string().optional(),
        typeText: zod_1.z.string().optional(),
        decorators: zod_1.z.array(exports2.SourceDecorator).optional(),
        typeParameters: zod_1.z.array(zod_1.z.string()).optional(),
        extends: zod_1.z.string().optional(),
        implements: zod_1.z.array(zod_1.z.string()).optional(),
        abstract: zod_1.z.boolean().optional(),
        instances: zod_1.z.array(zod_1.z.string()).optional(),
        members: zod_1.z.array(exports2.SourceClassMember).optional()
      }).optional(),
      constant: zod_1.z.object({
        serializable: zod_1.z.boolean(),
        value: zod_1.z.unknown().optional(),
        declarationKind: zod_1.z.literal("const").optional(),
        mutable: zod_1.z.boolean().optional(),
        expression: zod_1.z.string().optional()
      }).optional(),
      variable: zod_1.z.object({
        declarationKind: zod_1.z.enum(["let", "var"]),
        initializer: zod_1.z.string().optional()
      }).optional(),
      service: zod_1.z.object({
        classSymbol: zod_1.z.string().optional(),
        methods: zod_1.z.array(zod_1.z.string()),
        lifecycle: zod_1.z.enum(["invocation", "workflow-run", "worker"])
      }).optional(),
      controlFlow: zod_1.z.array(exports2.SourceControlRegion).optional()
    });
    exports2.SourceReference = zod_1.z.object({
      from: zod_1.z.string(),
      to: zod_1.z.string(),
      kind: zod_1.z.enum(["call", "type", "value", "construct", "method"]),
      location: exports2.SourceLocation
    });
    exports2.SourceRecursion = zod_1.z.object({
      via: zod_1.z.array(zod_1.z.string().min(1)).min(1),
      location: exports2.SourceLocation
    });
    exports2.SourceImport = zod_1.z.object({
      source: zod_1.z.string(),
      module: zod_1.z.string(),
      typeOnly: zod_1.z.boolean(),
      default: zod_1.z.string().optional(),
      namespace: zod_1.z.string().optional(),
      named: zod_1.z.array(zod_1.z.object({ name: zod_1.z.string(), alias: zod_1.z.string().optional(), typeOnly: zod_1.z.boolean() }))
    });
    exports2.SourceFileIndex = zod_1.z.object({
      runtime: zod_1.z.literal("frontend").optional(),
      path: zod_1.z.string(),
      language: zod_1.z.enum(["typescript", "javascript"]),
      bundleId: zod_1.z.string(),
      entryWorkflowId: zod_1.z.string().optional(),
      imports: zod_1.z.array(exports2.SourceImport).optional(),
      exports: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        local: zod_1.z.string().optional(),
        module: zod_1.z.string().optional(),
        typeOnly: zod_1.z.boolean()
      })).optional(),
      symbols: zod_1.z.array(exports2.SourceSymbol),
      diagnostics: zod_1.z.array(exports2.SourceDiagnostic)
    });
    exports2.ProjectSourceIndex = zod_1.z.object({
      revision: zod_1.z.string(),
      files: zod_1.z.array(exports2.SourceFileIndex),
      references: zod_1.z.array(exports2.SourceReference)
    });
    exports2.ProjectPackageExports = zod_1.z.object({
      packages: zod_1.z.array(zod_1.z.string()),
      exports: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        kind: zod_1.z.enum(["function", "constant", "type", "class", "value"]),
        typeOnly: zod_1.z.boolean(),
        declaration: zod_1.z.string()
      }))
    });
  }
});

// packages/schema/dist/plugin.js
var require_plugin = __commonJS({
  "packages/schema/dist/plugin.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PluginManifest = exports2.PluginConnection = exports2.PluginIntegration = exports2.PluginPermission = exports2.PluginNode = exports2.PluginNpmDependency = exports2.PluginImplementationSource = exports2.NpmClientBinding = exports2.PluginNodeUi = exports2.PLUGIN_UI_BUNDLE_MAX_BYTES = exports2.PluginUiTarget = exports2.PluginScope = void 0;
    var zod_1 = require("zod");
    var ipc_envelope_1 = require_ipc_envelope();
    var icons_1 = require_icons();
    var constants_1 = require_constants();
    exports2.PluginScope = zod_1.z.enum(["user", "group", "org", "public"]);
    exports2.PluginUiTarget = zod_1.z.enum(["node.inspector.inputs"]);
    exports2.PLUGIN_UI_BUNDLE_MAX_BYTES = 512 * 1024;
    var pluginUiEntry = zod_1.z.string().min(1).max(1024).refine((value) => !value.startsWith("/") && !value.includes("\\") && !value.split("/").includes("..") && /\.[cm]?[jt]sx?$/.test(value), "UI entries must be relative JavaScript/TypeScript module paths");
    exports2.PluginNodeUi = zod_1.z.object({
      apiVersion: zod_1.z.literal("1"),
      renderers: zod_1.z.record(zod_1.z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i, "renderer id must be alphanumeric/dash/underscore"), zod_1.z.object({
        label: zod_1.z.string().min(1).max(240),
        targets: zod_1.z.record(exports2.PluginUiTarget, pluginUiEntry)
      }).strict()).refine((renderers) => Object.keys(renderers).length > 0, "UI needs at least one renderer")
    }).strict();
    exports2.NpmClientBinding = zod_1.z.object({
      module: zod_1.z.string().regex(/^(@[a-z0-9~._-]+\/)?[a-z0-9~._-]+(?:\/[a-zA-Z0-9~._-]+)*$/).refine((value) => !value.split("/").some((part) => part === "." || part === ".."), "Unsafe npm module path"),
      export: zod_1.z.string().regex(/^[$A-Z_a-z][$\w]*$/),
      options: zod_1.z.record(zod_1.z.unknown()).optional(),
      env: zod_1.z.record(zod_1.z.string().regex(/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/).refine((path) => !path.split(".").some((key) => ["__proto__", "prototype", "constructor"].includes(key)), "Unsafe option path"), zod_1.z.string().regex(/^[A-Z_][A-Z0-9_]*$/)).optional()
    }).strict();
    exports2.PluginImplementationSource = zod_1.z.discriminatedUnion("kind", [
      zod_1.z.object({ kind: zod_1.z.literal("plugin") }).strict(),
      zod_1.z.object({
        kind: zod_1.z.literal("npm"),
        package: zod_1.z.string().regex(/^(@[a-z0-9~._-]+\/)?[a-z0-9~._-]+$/),
        version: zod_1.z.string().regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/)
      }).strict()
    ]);
    exports2.PluginNpmDependency = zod_1.z.object({ package: zod_1.z.string(), version: zod_1.z.string(), spec: zod_1.z.string() }).strict();
    exports2.PluginNode = zod_1.z.object({
      id: zod_1.z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i, "node id must be alphanumeric/dash/underscore"),
      /** The command the engine spawns, relative to the plugin folder. */
      command: zod_1.z.string(),
      language: zod_1.z.string().optional(),
      label: zod_1.z.string().min(1).max(240).optional(),
      symbol: zod_1.z.string().min(1).max(16).optional(),
      description: zod_1.z.string().optional(),
      icon: icons_1.IconName.optional(),
      trigger: zod_1.z.boolean().optional(),
      inputs: ipc_envelope_1.JsonSchema.optional(),
      outputs: ipc_envelope_1.JsonSchema.optional(),
      /** Names of environment variables / secrets this node expects to be injected. */
      env: zod_1.z.array(zod_1.z.string()).optional(),
      connections: zod_1.z.array(zod_1.z.string().min(1)).optional(),
      defaults: zod_1.z.record(zod_1.z.unknown()).optional(),
      bindings: zod_1.z.record(zod_1.z.string().regex(/^[A-Za-z_$][\w$]*$/), exports2.NpmClientBinding).optional(),
      ui: exports2.PluginNodeUi.optional(),
      source: exports2.PluginImplementationSource.optional(),
      /** Explicit mapping to the library export; workflow adapters keep their own argument convention. */
      libraryExport: zod_1.z.string().regex(/^[$A-Z_a-z][$\w]*$/).optional(),
      /** Compiler-owned original import identity, never a presentation override. */
      implementation: zod_1.z.object({
        module: zod_1.z.string(),
        export: zod_1.z.string(),
        parameters: zod_1.z.array(zod_1.z.string())
      }).strict().optional()
    });
    exports2.PluginPermission = zod_1.z.object({
      resource: zod_1.z.enum(["project_data", "secrets", "network"]),
      access: zod_1.z.enum(["read", "write", "outbound"])
    });
    exports2.PluginIntegration = zod_1.z.object({
      category: zod_1.z.string().optional(),
      tags: zod_1.z.array(zod_1.z.string()).default([]),
      /** Secrets/env the integration needs to authenticate (e.g. ["JIRA_TOKEN"]). */
      auth: zod_1.z.array(zod_1.z.string()).optional(),
      /** Original npm dependency used by generated npm nodes. */
      npm: exports2.PluginNpmDependency.optional(),
      npmDependencies: zod_1.z.array(exports2.PluginNpmDependency).optional()
    });
    exports2.PluginConnection = zod_1.z.object({
      label: zod_1.z.string().min(1).max(240),
      description: zod_1.z.string().max(4e3).optional(),
      fields: zod_1.z.record(zod_1.z.string().regex(/^[A-Z_][A-Z0-9_]*$/, "credential fields must be environment variable names"), zod_1.z.object({
        label: zod_1.z.string().min(1).max(240),
        description: zod_1.z.string().max(4e3).optional(),
        secret: zod_1.z.boolean().default(true),
        required: zod_1.z.boolean().default(true)
      }).strict())
    }).strict();
    exports2.PluginManifest = zod_1.z.object({
      schemaVersion: zod_1.z.string().default(constants_1.PLUGIN_SCHEMA_VERSION),
      /** Stable plugin id; namespaces its nodes as `<id>/<nodeId>`. */
      id: zod_1.z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "plugin id must be lowercase alphanumeric/dash"),
      name: zod_1.z.string(),
      version: zod_1.z.string(),
      description: zod_1.z.string().optional(),
      /** Implementation authority; absent on legacy artifacts. */
      source: exports2.PluginImplementationSource.optional(),
      library: zod_1.z.object({
        format: zod_1.z.literal(1),
        entry: zod_1.z.literal("library/index.js"),
        types: zod_1.z.literal("library/index.d.ts"),
        exports: zod_1.z.array(zod_1.z.string().regex(/^[$A-Z_a-z][$\w]*$/)).min(1)
      }).strict().optional(),
      icon: icons_1.IconName.optional(),
      author: zod_1.z.string().optional(),
      contributors: zod_1.z.array(zod_1.z.string().trim().min(1).max(240)).max(100).optional(),
      repository: zod_1.z.string().url().regex(/^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/).optional(),
      homepage: zod_1.z.string().optional(),
      license: zod_1.z.string().optional(),
      /** Distribution tiers this plugin may be discovered/installed from. Private by default. */
      scope: zod_1.z.array(exports2.PluginScope).default(["user"]),
      /** Coarse runtime capabilities the plugin requests; consented to at install. */
      permissions: zod_1.z.array(exports2.PluginPermission).default([]),
      integration: exports2.PluginIntegration.optional(),
      connections: zod_1.z.record(zod_1.z.string().regex(/^[a-z0-9][a-z0-9-]*$/), exports2.PluginConnection).optional(),
      nodes: zod_1.z.array(exports2.PluginNode).default([])
    }).superRefine((manifest2, ctx) => {
      const npm = manifest2.integration?.npm;
      const dependencies = manifest2.integration?.npmDependencies ?? (npm ? [npm] : []);
      if (new Set(dependencies.map((item) => item.package)).size !== dependencies.length)
        ctx.addIssue({
          code: "custom",
          path: ["integration"],
          message: "npm dependencies must have unique package names"
        });
      if (manifest2.source?.kind === "plugin" && npm || manifest2.source?.kind === "npm" && (npm?.package !== manifest2.source.package || npm?.version !== manifest2.source.version))
        ctx.addIssue({ code: "custom", path: ["source"], message: "source authority must match integration.npm" });
      const ids = /* @__PURE__ */ new Set();
      manifest2.nodes.forEach((node, index) => {
        if (ids.has(node.id))
          ctx.addIssue({ code: "custom", path: ["nodes", index, "id"], message: "node IDs must be unique" });
        ids.add(node.id);
        const nodeSource = node.source;
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
        for (const binding of Object.values(node.bindings ?? {})) {
          if (!nodeNpm || binding.module !== nodeNpm.package && !binding.module.startsWith(`${nodeNpm.package}/`))
            ctx.addIssue({
              code: "custom",
              path: ["nodes", index, "bindings"],
              message: "SDK factories must belong to the original npm package"
            });
          const credentialFields = new Set((node.connections ?? []).flatMap((name) => Object.keys(manifest2.connections?.[name]?.fields ?? {})));
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
  }
});

// packages/schema/dist/octonode-config.js
var require_octonode_config = __commonJS({
  "packages/schema/dist/octonode-config.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.OctonodeConfig = exports2.WorkflowExecutionPlan = exports2.Workflow = exports2.WorkflowSource = exports2.WorkflowInputBinding = exports2.WorkflowTestWorkflow = exports2.WorkflowEvaluation = exports2.WorkflowPromise = exports2.WorkflowPromiseMode = exports2.WorkflowEdge = exports2.ProjectAttachments = exports2.ProjectDefaults = exports2.Environment = exports2.NodeConfig = exports2.NodePresentation = exports2.NodeRuntime = exports2.NodeSignature = exports2.NodeKind = exports2.CONFIG_API_VERSION = void 0;
    exports2.resolveEnvVars = resolveEnvVars;
    var workflow_triggers_js_1 = require_workflow_triggers();
    var zod_1 = require("zod");
    var ipc_envelope_1 = require_ipc_envelope();
    var icons_1 = require_icons();
    var workflow_entry_1 = require_workflow_entry();
    var source_index_1 = require_source_index();
    var plugin_1 = require_plugin();
    exports2.CONFIG_API_VERSION = "octonode.dev/v1";
    exports2.NodeKind = zod_1.z.enum(["function", "class", "service", "const"]);
    exports2.NodeSignature = zod_1.z.object({
      language: zod_1.z.string(),
      /** CODE-OWNED target of a workflow invocation wrapper. */
      workflowId: zod_1.z.string().min(1).optional(),
      /** The command the engine spawns for this node, e.g. `python3 nodes/x.py`. */
      command: zod_1.z.string(),
      defaults: zod_1.z.record(zod_1.z.unknown()).optional(),
      requiredEnv: zod_1.z.array(zod_1.z.string()).optional(),
      /**
       * What this node is (CODE-OWNED, from the describe manifest). Omitted →
       * `function`. `class`/`service`/`const` are setup-time entities without I/O.
       */
      kind: exports2.NodeKind.optional(),
      /**
       * Working directory the command runs from — relative to the project root,
       * or absolute (hydrated plugin nodes point into the global store). Set for
       * plugin nodes, whose relative paths resolve against the plugin folder.
       * Absent → the engine's working directory.
       */
      cwd: zod_1.z.string().optional(),
      inputs: ipc_envelope_1.JsonSchema.optional(),
      outputs: ipc_envelope_1.JsonSchema.optional(),
      /** CODE-OWNED expressions evaluated inside this node's original source scope. */
      sourceExpressions: zod_1.z.record(zod_1.z.string()).optional(),
      /** Exact authored text for this compiled node. Empty for synthetic workflow plumbing. */
      sourceExcerpt: source_index_1.SourceLocation.extend({ content: zod_1.z.string() }).optional(),
      /** Resolved marketplace calls retained in their original source scope, never IPC substitutions. */
      sourcePlugins: zod_1.z.array(zod_1.z.object({
        alias: zod_1.z.string(),
        node: zod_1.z.string(),
        version: zod_1.z.string(),
        module: zod_1.z.string(),
        export: zod_1.z.string(),
        execution: zod_1.z.literal("source")
      })).optional(),
      /** CODE-OWNED recursive call sites; visualization only, not execution edges. */
      recursion: zod_1.z.array(source_index_1.SourceRecursion).optional(),
      /**
       * Setup params for non-`function` kinds (class constructor / service config /
       * const shape). Rendered as a form in the editor. Unused by `function` nodes,
       * which carry their shape in `inputs`/`outputs` instead.
       */
      setup: ipc_envelope_1.JsonSchema.optional(),
      /** sha256 of the normalized signature, for drift/staleness detection. */
      checksum: zod_1.z.string().optional(),
      /** Set when scan no longer finds this node in code; not deleted automatically. */
      orphaned: zod_1.z.boolean().optional(),
      /** Routing metadata for an explicitly exposed service host or method node. */
      service: zod_1.z.object({
        host: zod_1.z.string(),
        method: zod_1.z.string().optional(),
        lifecycle: zod_1.z.enum(["invocation", "workflow-run", "worker"])
      }).optional()
    });
    exports2.NodeRuntime = zod_1.z.object({
      timeout_ms: zod_1.z.number().int().positive().optional(),
      retries: zod_1.z.number().int().nonnegative().optional(),
      retry_backoff_ms: zod_1.z.number().int().nonnegative().optional(),
      concurrency: zod_1.z.number().int().positive().optional(),
      /** When true, this node waits for running nodes and executes alone within the workflow run. */
      async: zod_1.z.boolean().optional()
    });
    exports2.NodePresentation = zod_1.z.object({
      icon: icons_1.IconName.optional(),
      /** Optional human-facing label used when the node id is implementation detail. */
      label: zod_1.z.string().optional(),
      symbol: zod_1.z.string().max(16).optional(),
      description: zod_1.z.string().optional(),
      color: zod_1.z.string().optional(),
      position: zod_1.z.object({ x: zod_1.z.number(), y: zod_1.z.number() }).optional(),
      /** Optional plugin renderer selected for this node instance. */
      renderer: zod_1.z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i).optional()
    });
    exports2.NodeConfig = zod_1.z.object({
      /** Catalog ancestry, independent of editable presentation. */
      native: zod_1.z.string().optional(),
      /** Stable execution boundary; legacy entries fall back to their icon. */
      role: workflow_entry_1.WorkflowNodeRole.optional(),
      /** Stable identity key; edges reference this, never the source path. */
      id: zod_1.z.string(),
      /**
       * CONFIG-OWNED. For setup-time kinds (class/service/const): the ids of the
       * function nodes that depend on this entity. Rendered as dashed dependency
       * edges in the editor, distinct from data-flow edges. (The node's `kind`
       * itself is code-owned and lives in `signature.kind`.)
       */
      provides: zod_1.z.array(zod_1.z.string()).optional(),
      /**
       * Reference to an installed plugin's node (`<pluginId>/<nodeId>`). The
       * signature is hydrated from the LIVE plugin manifest at config-load time
       * (see @octonode/plugin hydratePluginNodes), so a lock upgrade propagates to
       * every node referencing the plugin. Any stored signature is the last-known
       * snapshot, kept as a fallback when the plugin can't be resolved.
       */
      plugin: zod_1.z.string().optional(),
      /** Resolved from the installed immutable plugin; never edited by project configuration. */
      pluginVersion: zod_1.z.string().optional(),
      pluginUi: plugin_1.PluginNodeUi.optional(),
      /** Generated by `octonode scan`. Optional so runtime/presentation can be pre-declared. */
      signature: exports2.NodeSignature.optional(),
      runtime: exports2.NodeRuntime.optional(),
      presentation: exports2.NodePresentation.optional(),
      /** CODE-OWNED optional defaults from octonode.config.ts. */
      definitionPresentation: exports2.NodePresentation.optional(),
      /** Generated defaults are inheritable; old records without provenance keep their explicit presentation. */
      presentationSeed: exports2.NodePresentation.optional(),
      /** CONFIG-OWNED. When true the scheduler bypasses this node (passes inputs through). */
      disabled: zod_1.z.boolean().optional()
    });
    exports2.Environment = zod_1.z.object({
      inherits: zod_1.z.string().optional(),
      vars: zod_1.z.record(zod_1.z.string()).optional(),
      secrets: zod_1.z.array(zod_1.z.string()).optional()
    });
    exports2.ProjectDefaults = zod_1.z.object({
      /** TypeScript is the only active v1 authoring/runtime choice. */
      language: zod_1.z.literal("typescript").optional()
    });
    exports2.ProjectAttachments = zod_1.z.object({
      plugins: zod_1.z.array(zod_1.z.string()).default([]),
      variables: zod_1.z.array(zod_1.z.string()).default([]),
      dataTables: zod_1.z.array(zod_1.z.string()).default([])
    });
    exports2.WorkflowEdge = zod_1.z.object({
      from: zod_1.z.object({ node: zod_1.z.string(), output: zod_1.z.string().optional() }),
      to: zod_1.z.object({ node: zod_1.z.string(), input: zod_1.z.string().optional() }),
      /**
       * `data` (default) — a normal data-flow connection between ports.
       * `dependency` — a setup-time dependency from a class/service/const onto the
       * function node that uses it. The scheduler ignores dependency edges (they
       * carry no data and don't affect topology); they exist for visualization.
       * `control` — an execution dependency that carries no input value (used by
       * sequential `await` and Promise callback lowering).
       */
      kind: zod_1.z.enum(["data", "dependency", "control"]).optional()
    });
    exports2.WorkflowPromiseMode = zod_1.z.enum([
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
    exports2.WorkflowPromise = zod_1.z.object({
      node: zod_1.z.string(),
      mode: exports2.WorkflowPromiseMode
    });
    exports2.WorkflowEvaluation = zod_1.z.object({
      id: zod_1.z.string().min(1),
      description: zod_1.z.string().optional(),
      input: zod_1.z.unknown().optional(),
      expect: zod_1.z.object({
        status: zod_1.z.enum(["ok", "error", "partial"]).default("ok"),
        /** Exact terminal outputs, keyed by terminal node id. Omit to check status only. */
        outputs: zod_1.z.record(zod_1.z.unknown()).optional()
      }),
      /** Optional workflow judge for semantic, safety, or agent-trajectory grading. */
      judge: zod_1.z.object({
        workflow: zod_1.z.string().min(1),
        rubric: zod_1.z.string().min(1),
        threshold: zod_1.z.number().min(0).max(1).default(0.7)
      }).optional()
    });
    exports2.WorkflowTestWorkflow = zod_1.z.object({
      path: zod_1.z.string().min(1),
      runner: zod_1.z.enum(["vitest", "jest", "playwright", "promptfoo"])
    });
    exports2.WorkflowInputBinding = zod_1.z.discriminatedUnion("kind", [
      zod_1.z.object({ kind: zod_1.z.literal("literal"), value: zod_1.z.unknown() }),
      zod_1.z.object({ kind: zod_1.z.literal("symbol"), symbol: zod_1.z.string(), value: zod_1.z.unknown() })
    ]);
    exports2.WorkflowSource = zod_1.z.object({
      path: zod_1.z.string(),
      symbol: zod_1.z.string(),
      kind: zod_1.z.enum(["module", "function"]),
      checksum: zod_1.z.string()
    });
    exports2.Workflow = zod_1.z.object({
      /** CODE-OWNED optional defaults from octonode.config.ts. */
      definitionPresentation: exports2.NodePresentation.optional(),
      /** CONFIG-OWNED display name; stable workflow IDs remain unchanged. */
      label: zod_1.z.string().trim().min(1).max(200).optional(),
      /** CONFIG-OWNED catalog archive state. */
      archived: zod_1.z.boolean().optional(),
      /** CONFIG-OWNED subscriptions, never executable DAG nodes. */
      triggers: workflow_triggers_js_1.WorkflowTriggers.optional(),
      id: zod_1.z.string(),
      /** CODE-OWNED origin for a workflow projected from a normal source file. */
      source: exports2.WorkflowSource.optional(),
      /**
       * Workflow invocation contract. Source workflows project this from their
       * function parameters; canvas workflows derive it from their root node(s).
       */
      inputs: ipc_envelope_1.JsonSchema.optional(),
      description: zod_1.z.string().optional(),
      entry: zod_1.z.string().optional(),
      /** Explicit member nodes (canvas membership for not-yet-wired nodes). */
      nodes: zod_1.z.array(zod_1.z.string()).default([]),
      edges: zod_1.z.array(exports2.WorkflowEdge).default([]),
      promises: zod_1.z.array(exports2.WorkflowPromise).default([]),
      on_error: zod_1.z.object({ policy: zod_1.z.enum(["halt", "continue"]).default("halt") }).optional(),
      /** CONFIG-OWNED. Whether the workflow is enabled (e.g. for scheduling/triggers). */
      active: zod_1.z.boolean().optional(),
      /** CONFIG-OWNED freeform labels. */
      tags: zod_1.z.array(zod_1.z.string()).optional(),
      /** CONFIG-OWNED folder path for organizing workflows, e.g. "math/daily". Absent → project root. */
      folder: zod_1.z.string().optional(),
      /** CONFIG-OWNED evaluation cases, versioned and shared with this workflow. */
      evaluations: zod_1.z.array(exports2.WorkflowEvaluation).default([]),
      /** CONFIG-OWNED repository tests relevant to this workflow. */
      test_workflows: zod_1.z.array(exports2.WorkflowTestWorkflow).default([]),
      /** CONFIG-OWNED pinned outputs: node id -> a frozen outputs object used in place of execution. */
      pins: zod_1.z.record(zod_1.z.unknown()).optional(),
      /**
       * CONFIG-OWNED input expressions: node id -> (input key -> `{{ $json.field }}`
       * template). Evaluated against the node's assembled inputs at runtime and merged
       * over them before the node executes. See runtime/expression.ts.
       */
      expressions: zod_1.z.record(zod_1.z.record(zod_1.z.string())).optional(),
      /** Static source/manual values applied to node inputs before expressions. */
      bindings: zod_1.z.record(zod_1.z.record(exports2.WorkflowInputBinding)).optional(),
      /**
       * CONFIG-OWNED opt-in to orchestration codegen (Plan B). When `orchestration`
       * is true, a runnable workflow-as-function file is generated at
       * `nodes/_workflows/<id>.js` and kept in sync; `checksum` is the machine-region
       * checksum, managed by the generator (used for hand-edit conflict detection).
       */
      codegen: zod_1.z.object({ orchestration: zod_1.z.boolean().optional(), checksum: zod_1.z.string().optional() }).optional()
    });
    exports2.WorkflowExecutionPlan = exports2.Workflow.pick({
      id: true,
      entry: true,
      nodes: true,
      edges: true,
      promises: true,
      bindings: true,
      expressions: true
    }).strict().superRefine((plan, ctx) => {
      const members = new Set(plan.nodes);
      if (!members.size || members.size !== plan.nodes.length || plan.entry !== void 0 && !members.has(plan.entry) || plan.edges.some((edge) => !members.has(edge.from.node) || !members.has(edge.to.node)) || plan.promises.some((promise) => !members.has(promise.node)) || new Set(plan.promises.map((promise) => promise.node)).size !== plan.promises.length || [...Object.keys(plan.bindings ?? {}), ...Object.keys(plan.expressions ?? {})].some((id) => !members.has(id))) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "Execution plan has invalid or duplicate members" });
      }
    });
    exports2.OctonodeConfig = zod_1.z.object({
      apiVersion: zod_1.z.string().default(exports2.CONFIG_API_VERSION),
      metadata: zod_1.z.object({
        name: zod_1.z.string(),
        id: zod_1.z.string().min(1).max(240).optional(),
        version: zod_1.z.string().optional(),
        description: zod_1.z.string().optional()
      }),
      defaults: exports2.ProjectDefaults.optional(),
      attachments: exports2.ProjectAttachments.default({ plugins: [], variables: [], dataTables: [] }),
      /** Commands `octonode scan` probes (via `describe`) to discover nodes. */
      sources: zod_1.z.array(zod_1.z.string()).default([]),
      environments: zod_1.z.record(exports2.Environment).default({}),
      nodes: zod_1.z.array(exports2.NodeConfig).default([]),
      /** Shared type registry referenced by node signatures (Phase 3+). */
      types: zod_1.z.record(ipc_envelope_1.JsonSchema).default({}),
      /** CONFIG-OWNED stable IDs of projects required by this project. Resolution is capability-gated. */
      projectDependencies: zod_1.z.array(zod_1.z.string().min(1).max(240)).max(1e3).optional(),
      workflows: zod_1.z.array(exports2.Workflow).default([])
    }).superRefine((config, ctx) => {
      config.workflows.forEach((workflow, index) => {
        const members = /* @__PURE__ */ new Set([
          ...workflow.nodes,
          ...workflow.entry ? [workflow.entry] : [],
          ...workflow.edges.flatMap((edge) => [edge.from.node, edge.to.node])
        ]);
        const result = workflow_entry_1.WorkflowEntryNodes.safeParse(config.nodes.filter((node) => members.has(node.id)).map((node) => ({ id: node.id, icon: node.presentation?.icon, role: node.role })));
        if (!result.success)
          ctx.addIssue({ code: "custom", path: ["workflows", index, "nodes"], message: result.error.issues[0].message });
      });
      const dependencies = config.projectDependencies ?? [];
      const seen = /* @__PURE__ */ new Set();
      dependencies.forEach((projectId, index) => {
        if (seen.has(projectId))
          ctx.addIssue({
            code: "custom",
            path: ["projectDependencies", index],
            message: "project dependencies must be unique"
          });
        if (config.metadata.id === projectId)
          ctx.addIssue({
            code: "custom",
            path: ["projectDependencies", index],
            message: "a project cannot depend on itself"
          });
        seen.add(projectId);
      });
    });
    function resolveEnvVars(config, envName, seen = /* @__PURE__ */ new Set()) {
      if (!envName)
        return {};
      if (seen.has(envName))
        return {};
      seen.add(envName);
      const env = config.environments[envName];
      if (!env)
        return {};
      const parent = env.inherits ? resolveEnvVars(config, env.inherits, seen) : {};
      return { ...parent, ...env.vars };
    }
  }
});

// packages/schema/dist/store.js
var require_store = __commonJS({
  "packages/schema/dist/store.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.StoredRun = exports2.InstalledPlugin = exports2.WorkflowRecord = exports2.NodeRecord = exports2.Identity = exports2.Visibility = exports2.Origin = exports2.Scope = void 0;
    var zod_1 = require("zod");
    var octonode_config_1 = require_octonode_config();
    exports2.Scope = zod_1.z.enum(["user", "group", "org", "public"]);
    exports2.Origin = zod_1.z.enum(["local", "native", "plugin", "marketplace"]);
    exports2.Visibility = zod_1.z.object({
      scope: exports2.Scope,
      owner: zod_1.z.string(),
      editors: zod_1.z.array(zod_1.z.string()).optional(),
      groupId: zod_1.z.string().optional(),
      orgId: zod_1.z.string().optional()
    });
    exports2.Identity = zod_1.z.object({
      userId: zod_1.z.string(),
      displayName: zod_1.z.string().optional(),
      groups: zod_1.z.array(zod_1.z.string()).default([]),
      orgId: zod_1.z.string()
    });
    exports2.NodeRecord = octonode_config_1.NodeConfig.extend({
      origin: exports2.Origin,
      visibility: exports2.Visibility,
      createdAt: zod_1.z.number(),
      updatedAt: zod_1.z.number()
    });
    exports2.WorkflowRecord = octonode_config_1.Workflow.extend({
      origin: exports2.Origin,
      visibility: exports2.Visibility,
      createdAt: zod_1.z.number(),
      updatedAt: zod_1.z.number()
    });
    exports2.InstalledPlugin = zod_1.z.object({
      id: zod_1.z.string(),
      name: zod_1.z.string(),
      version: zod_1.z.string(),
      source: zod_1.z.string(),
      nodes: zod_1.z.array(zod_1.z.object({ id: zod_1.z.string(), description: zod_1.z.string().optional() })).default([]),
      visibility: exports2.Visibility
    });
    exports2.StoredRun = zod_1.z.object({
      runId: zod_1.z.string(),
      workflowId: zod_1.z.string(),
      status: zod_1.z.enum(["ok", "error", "partial"]),
      durationMs: zod_1.z.number(),
      startedAt: zod_1.z.number(),
      owner: zod_1.z.string(),
      scope: exports2.Scope,
      /** The full core RunRecord, kept opaque here (validated by core on produce). */
      record: zod_1.z.unknown()
    });
  }
});

// packages/schema/dist/data-tables.js
var require_data_tables = __commonJS({
  "packages/schema/dist/data-tables.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UpdateProjectInput = exports2.CreateProjectInput = exports2.ProjectMetadata = exports2.ProjectRepoMetadata = exports2.SqlQueryResult = exports2.SqlQueryInput = exports2.ImportRowsResult = exports2.ImportRowsInput = exports2.BulkRowsResult = exports2.BulkRowsInput = exports2.BulkRowMutation = exports2.UpdateRowInput = exports2.InsertRowInput = exports2.ListRowsInput = exports2.UpdateDataTableInput = exports2.CreateDataTableInput = exports2.DataTableRowsPage = exports2.DataTableRow = exports2.DataTable = exports2.DataTableColumn = exports2.DataTableColumnType = exports2.StorageMode = void 0;
    var zod_1 = require("zod");
    var store_1 = require_store();
    exports2.StorageMode = zod_1.z.enum(["sqlite", "kv_blob"]);
    exports2.DataTableColumnType = zod_1.z.enum(["text", "number", "boolean", "date", "datetime", "json"]);
    exports2.DataTableColumn = zod_1.z.object({
      id: zod_1.z.string(),
      key: zod_1.z.string().min(1).regex(/^[A-Za-z_][A-Za-z0-9_]*$/, "column key must start with a letter or '_' and contain only letters, digits, or '_'"),
      name: zod_1.z.string().min(1),
      type: exports2.DataTableColumnType,
      required: zod_1.z.boolean().default(false),
      defaultValue: zod_1.z.unknown().optional(),
      position: zod_1.z.number().int().nonnegative()
    });
    exports2.DataTable = zod_1.z.object({
      id: zod_1.z.string(),
      projectId: zod_1.z.string(),
      name: zod_1.z.string().min(1),
      slug: zod_1.z.string().min(1).regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/, "slug must start alphanumeric and contain only letters, digits, '.', '_' or '-'"),
      description: zod_1.z.string().optional(),
      storageMode: exports2.StorageMode.default("sqlite"),
      columns: zod_1.z.array(exports2.DataTableColumn).default([]),
      rowCount: zod_1.z.number().int().nonnegative().default(0),
      schemaVersion: zod_1.z.number().int().positive().default(1),
      createdAt: zod_1.z.number(),
      updatedAt: zod_1.z.number()
    });
    exports2.DataTableRow = zod_1.z.object({
      id: zod_1.z.string(),
      tableId: zod_1.z.string(),
      data: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()),
      version: zod_1.z.number().int().positive().default(1),
      createdAt: zod_1.z.number(),
      updatedAt: zod_1.z.number()
    });
    exports2.DataTableRowsPage = zod_1.z.object({
      rows: zod_1.z.array(exports2.DataTableRow),
      nextCursor: zod_1.z.string().optional()
    });
    exports2.CreateDataTableInput = zod_1.z.object({
      name: zod_1.z.string().min(1),
      slug: zod_1.z.string().min(1).regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/, "slug must start alphanumeric and contain only letters, digits, '.', '_' or '-'").optional(),
      description: zod_1.z.string().optional(),
      storageMode: exports2.StorageMode.default("sqlite"),
      columns: zod_1.z.array(exports2.DataTableColumn.omit({ id: true }).extend({ id: zod_1.z.string().optional() })).default([])
    });
    exports2.UpdateDataTableInput = zod_1.z.object({
      name: zod_1.z.string().min(1).optional(),
      slug: zod_1.z.string().min(1).regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/, "slug must start alphanumeric and contain only letters, digits, '.', '_' or '-'").optional(),
      description: zod_1.z.string().nullable().optional(),
      columns: zod_1.z.array(exports2.DataTableColumn.omit({ id: true }).extend({ id: zod_1.z.string().optional() })).optional()
    });
    exports2.ListRowsInput = zod_1.z.object({
      cursor: zod_1.z.string().optional(),
      limit: zod_1.z.number().int().positive().max(500).default(50)
    });
    exports2.InsertRowInput = zod_1.z.object({
      data: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown())
    });
    exports2.UpdateRowInput = zod_1.z.object({
      data: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()),
      expectedVersion: zod_1.z.number().int().positive().optional()
    });
    exports2.BulkRowMutation = zod_1.z.discriminatedUnion("operation", [
      zod_1.z.object({ operation: zod_1.z.literal("insert"), data: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()) }),
      zod_1.z.object({
        operation: zod_1.z.literal("update"),
        rowId: zod_1.z.string().min(1),
        data: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()),
        expectedVersion: zod_1.z.number().int().positive().optional()
      }),
      zod_1.z.object({ operation: zod_1.z.literal("delete"), rowId: zod_1.z.string().min(1) })
    ]);
    exports2.BulkRowsInput = zod_1.z.object({
      mutations: zod_1.z.array(exports2.BulkRowMutation).min(1).max(500)
    });
    exports2.BulkRowsResult = zod_1.z.object({
      rows: zod_1.z.array(exports2.DataTableRow),
      deletedRowIds: zod_1.z.array(zod_1.z.string())
    });
    exports2.ImportRowsInput = zod_1.z.object({
      rows: zod_1.z.array(zod_1.z.record(zod_1.z.string(), zod_1.z.unknown())).min(1)
    });
    exports2.ImportRowsResult = zod_1.z.object({
      inserted: zod_1.z.number().int().nonnegative()
    });
    exports2.SqlQueryInput = zod_1.z.object({
      sql: zod_1.z.string().min(1),
      params: zod_1.z.array(zod_1.z.unknown()).default([])
    });
    exports2.SqlQueryResult = zod_1.z.object({
      columns: zod_1.z.array(zod_1.z.string()),
      rows: zod_1.z.array(zod_1.z.array(zod_1.z.unknown())),
      rowCount: zod_1.z.number().int().nonnegative(),
      durationMs: zod_1.z.number().nonnegative()
    });
    exports2.ProjectRepoMetadata = zod_1.z.object({
      provider: zod_1.z.enum(["github", "gitlab", "bitbucket", "other"]).optional(),
      url: zod_1.z.string().url(),
      owner: zod_1.z.string().optional(),
      name: zod_1.z.string().optional(),
      defaultBranch: zod_1.z.string().optional()
    });
    exports2.ProjectMetadata = zod_1.z.object({
      id: zod_1.z.string(),
      orgId: zod_1.z.string(),
      ownerUserId: zod_1.z.string(),
      name: zod_1.z.string().min(1),
      slug: zod_1.z.string().min(1).regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/, "slug must start alphanumeric and contain only letters, digits, '.', '_' or '-'"),
      description: zod_1.z.string().optional(),
      visibility: store_1.Visibility,
      repo: exports2.ProjectRepoMetadata.optional(),
      cloudflare: zod_1.z.object({
        workerName: zod_1.z.string().optional(),
        dataDoName: zod_1.z.string()
      }).optional(),
      createdAt: zod_1.z.number(),
      updatedAt: zod_1.z.number()
    });
    exports2.CreateProjectInput = zod_1.z.object({
      name: zod_1.z.string().min(1),
      slug: zod_1.z.string().min(1).regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/, "slug must start alphanumeric and contain only letters, digits, '.', '_' or '-'").optional(),
      description: zod_1.z.string().optional(),
      visibility: store_1.Visibility.pick({ scope: true, groupId: true, orgId: true }).optional(),
      repo: exports2.ProjectRepoMetadata.optional()
    });
    exports2.UpdateProjectInput = zod_1.z.object({
      name: zod_1.z.string().min(1).optional(),
      slug: zod_1.z.string().min(1).regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/, "slug must start alphanumeric and contain only letters, digits, '.', '_' or '-'").optional(),
      description: zod_1.z.string().nullable().optional(),
      visibility: store_1.Visibility.pick({ scope: true, groupId: true, orgId: true }).optional(),
      repo: exports2.ProjectRepoMetadata.nullable().optional()
    });
  }
});

// packages/schema/dist/data-table-schema.js
var require_data_table_schema = __commonJS({
  "packages/schema/dist/data-table-schema.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DataTableViewPage = exports2.DataTableViewPageInput = exports2.DataTableViewUpdate = exports2.DataTableView = exports2.DataTableViewInput = exports2.DataTableViewFilter = exports2.DataTableRelationship = exports2.DataTableRelationshipInput = void 0;
    var zod_1 = require("zod");
    exports2.DataTableRelationshipInput = zod_1.z.object({
      sourceTableId: zod_1.z.string().min(1),
      sourceColumn: zod_1.z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/),
      targetTableId: zod_1.z.string().min(1),
      onDelete: zod_1.z.enum(["restrict", "set_null"]).default("restrict")
    }).strict();
    exports2.DataTableRelationship = exports2.DataTableRelationshipInput.extend({ id: zod_1.z.string(), projectId: zod_1.z.string() });
    exports2.DataTableViewFilter = zod_1.z.object({
      column: zod_1.z.string().min(1),
      operator: zod_1.z.enum(["eq", "ne", "contains", "gt", "gte", "lt", "lte", "is_null", "not_null"]),
      value: zod_1.z.union([zod_1.z.string().max(2e3), zod_1.z.number().finite(), zod_1.z.boolean(), zod_1.z.null()]).default(null)
    }).strict();
    exports2.DataTableViewInput = zod_1.z.object({
      name: zod_1.z.string().trim().min(1).max(120),
      tableId: zod_1.z.string().min(1),
      relationshipIds: zod_1.z.array(zod_1.z.string()).max(8).default([]),
      filters: zod_1.z.array(exports2.DataTableViewFilter).max(20).default([]),
      sort: zod_1.z.object({ column: zod_1.z.string().min(1), direction: zod_1.z.enum(["asc", "desc"]) }).strict().optional()
    }).strict();
    exports2.DataTableView = exports2.DataTableViewInput.extend({
      id: zod_1.z.string(),
      projectId: zod_1.z.string(),
      revision: zod_1.z.number().int().positive()
    });
    exports2.DataTableViewUpdate = exports2.DataTableViewInput.extend({ revision: zod_1.z.number().int().positive() });
    exports2.DataTableViewPageInput = zod_1.z.object({
      offset: zod_1.z.number().int().min(0).max(1e6).default(0),
      limit: zod_1.z.number().int().min(1).max(200).default(50)
    }).strict();
    exports2.DataTableViewPage = zod_1.z.object({
      columns: zod_1.z.array(zod_1.z.string()),
      rows: zod_1.z.array(zod_1.z.record(zod_1.z.string(), zod_1.z.unknown())),
      total: zod_1.z.number(),
      nextOffset: zod_1.z.number().nullable()
    });
  }
});

// packages/schema/dist/workflow-layout.js
var require_workflow_layout = __commonJS({
  "packages/schema/dist/workflow-layout.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WorkflowLayout = exports2.GroupLayout = exports2.StickyNoteLayout = void 0;
    var zod_1 = require("zod");
    var Point = zod_1.z.object({ x: zod_1.z.number(), y: zod_1.z.number() });
    var Size = zod_1.z.object({ width: zod_1.z.number(), height: zod_1.z.number() });
    exports2.StickyNoteLayout = zod_1.z.object({
      id: zod_1.z.string(),
      position: Point,
      size: Size,
      text: zod_1.z.string(),
      color: zod_1.z.string()
    });
    exports2.GroupLayout = zod_1.z.object({
      id: zod_1.z.string(),
      position: Point,
      size: Size,
      label: zod_1.z.string().optional(),
      /** Ids of the member nodes wrapped by this group. */
      nodeIds: zod_1.z.array(zod_1.z.string()).default([])
    });
    exports2.WorkflowLayout = zod_1.z.object({
      version: zod_1.z.number().default(1),
      positions: zod_1.z.record(zod_1.z.string(), Point).default({}),
      stickyNotes: zod_1.z.array(exports2.StickyNoteLayout).default([]),
      groups: zod_1.z.array(exports2.GroupLayout).default([])
    });
  }
});

// packages/schema/dist/test-workflow-graph.js
var require_test_workflow_graph = __commonJS({
  "packages/schema/dist/test-workflow-graph.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TestWorkflowGraph = exports2.TestWorkflowGraphAction = exports2.TestWorkflowGraphDiagnostic = exports2.TestWorkflowGraphEdge = exports2.TestWorkflowGraphNode = exports2.TestWorkflowGraphEdgeKind = exports2.TestWorkflowGraphNodeKind = void 0;
    var zod_1 = require("zod");
    var source_index_1 = require_source_index();
    exports2.TestWorkflowGraphNodeKind = zod_1.z.enum([
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
    exports2.TestWorkflowGraphEdgeKind = zod_1.z.enum([
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
    exports2.TestWorkflowGraphNode = zod_1.z.object({
      id: zod_1.z.string(),
      kind: exports2.TestWorkflowGraphNodeKind,
      label: zod_1.z.string(),
      location: source_index_1.SourceLocation,
      detail: zod_1.z.string().optional(),
      framework: zod_1.z.enum(["vitest", "jest", "playwright"]).optional(),
      sourceSymbolId: zod_1.z.string().optional(),
      sourceSymbolKind: zod_1.z.enum([
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
      mockPhase: zod_1.z.enum(["hoisted", "ordered", "runner-controlled"]).optional(),
      runnable: zod_1.z.boolean().optional()
    });
    exports2.TestWorkflowGraphEdge = zod_1.z.object({
      id: zod_1.z.string(),
      from: zod_1.z.string(),
      to: zod_1.z.string(),
      kind: exports2.TestWorkflowGraphEdgeKind
    });
    exports2.TestWorkflowGraphDiagnostic = zod_1.z.object({
      severity: zod_1.z.enum(["warning", "error"]),
      code: zod_1.z.string(),
      message: zod_1.z.string(),
      location: source_index_1.SourceLocation.optional()
    });
    exports2.TestWorkflowGraphAction = zod_1.z.discriminatedUnion("kind", [
      zod_1.z.object({
        kind: zod_1.z.literal("create-node"),
        nodeKind: zod_1.z.enum([
          "suite",
          "test",
          "helper",
          "before-all",
          "before-each",
          "after-all",
          "after-each",
          "module-mock"
        ]),
        parentId: zod_1.z.string().optional(),
        label: zod_1.z.string().optional(),
        module: zod_1.z.string().optional(),
        body: zod_1.z.string().optional(),
        parameters: zod_1.z.string().optional(),
        async: zod_1.z.boolean().optional()
      }),
      zod_1.z.object({
        kind: zod_1.z.literal("create-data"),
        dataKind: zod_1.z.enum(["fixture", "mock-data"]),
        scopeId: zod_1.z.string().optional(),
        name: zod_1.z.string(),
        typeName: zod_1.z.string(),
        value: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown())
      }),
      zod_1.z.object({ kind: zod_1.z.literal("rename-node"), nodeId: zod_1.z.string(), label: zod_1.z.string() }),
      zod_1.z.object({ kind: zod_1.z.literal("delete-node"), nodeId: zod_1.z.string() }),
      zod_1.z.object({ kind: zod_1.z.literal("import-symbol"), symbolId: zod_1.z.string(), sourceIndexRevision: zod_1.z.string().length(64) })
    ]);
    exports2.TestWorkflowGraph = zod_1.z.object({
      path: zod_1.z.string(),
      revision: zod_1.z.string().length(64),
      sourceIndexRevision: zod_1.z.string().length(64),
      runner: zod_1.z.enum(["vitest", "jest", "playwright"]),
      nodes: zod_1.z.array(exports2.TestWorkflowGraphNode),
      edges: zod_1.z.array(exports2.TestWorkflowGraphEdge),
      referencedSymbols: zod_1.z.array(zod_1.z.string()),
      diagnostics: zod_1.z.array(exports2.TestWorkflowGraphDiagnostic),
      truncated: zod_1.z.boolean()
    });
  }
});

// packages/schema/dist/collaboration.js
var require_collaboration = __commonJS({
  "packages/schema/dist/collaboration.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.collaborationErrorSchema = exports2.realtimeInvalidationSchema = exports2.githubPublicationStateSchema = exports2.notificationSchema = exports2.reviewSuggestionSchema = exports2.suggestionCreateSchema = exports2.reviewCommentSchema = exports2.reviewThreadCreateSchema = exports2.reviewThreadSchema = exports2.reviewAnchorSchema = exports2.reviewFragmentSchema = exports2.reviewContextSchema = exports2.pullRequestStateSchema = exports2.messageUpdateSchema = exports2.messageCreateSchema = exports2.messageSchema = exports2.assistantSessionListQuerySchema = exports2.assistantSessionOrderSchema = exports2.assistantSessionSortSchema = exports2.assistantSessionCreateSchema = exports2.conversationCreateSchema = exports2.conversationSchema = exports2.conversationKindSchema = exports2.workspaceAgentCreateSchema = exports2.workspaceAgentSchema = exports2.profileUpdateSchema = exports2.profileSchema = exports2.pageSchema = exports2.revisionSchema = exports2.sha256Schema = exports2.gitShaSchema = exports2.entityIdSchema = exports2.idempotencyKeySchema = exports2.opaqueCursorSchema = exports2.principalSchema = exports2.agentScopeSchema = exports2.collaborationActionSchema = exports2.workspaceRefSchema = exports2.workspaceKindSchema = void 0;
    var zod_1 = require("zod");
    var constants_1 = require_constants();
    exports2.workspaceKindSchema = zod_1.z.enum(["user", "org", "team"]);
    exports2.workspaceRefSchema = zod_1.z.object({
      kind: exports2.workspaceKindSchema,
      id: zod_1.z.string().min(1).max(128)
    }).strict();
    exports2.collaborationActionSchema = zod_1.z.enum(constants_1.COLLABORATION_ACTIONS);
    exports2.agentScopeSchema = zod_1.z.enum(constants_1.WORKSPACE_ACTIONS);
    exports2.principalSchema = zod_1.z.discriminatedUnion("kind", [
      zod_1.z.object({ kind: zod_1.z.literal("user"), userId: zod_1.z.string().min(1).max(128) }).strict(),
      zod_1.z.object({
        kind: zod_1.z.literal("agent"),
        agentId: zod_1.z.string().uuid(),
        workspace: exports2.workspaceRefSchema,
        projectId: zod_1.z.string().min(1).max(128).nullable(),
        scopes: zod_1.z.array(exports2.agentScopeSchema).max(constants_1.WORKSPACE_ACTIONS.length)
      }).strict()
    ]);
    exports2.opaqueCursorSchema = zod_1.z.string().min(2).max(512).regex(/^[A-Za-z0-9_-]+$/);
    exports2.idempotencyKeySchema = zod_1.z.string().min(1).max(128);
    exports2.entityIdSchema = zod_1.z.string().uuid();
    exports2.gitShaSchema = zod_1.z.string().regex(/^[a-f0-9]{40}$/i);
    exports2.sha256Schema = zod_1.z.string().regex(/^[a-f0-9]{64}$/i);
    exports2.revisionSchema = zod_1.z.number().int().positive();
    var pageSchema = (item) => zod_1.z.object({
      items: zod_1.z.array(item),
      nextCursor: exports2.opaqueCursorSchema.nullable()
    }).strict();
    exports2.pageSchema = pageSchema;
    exports2.profileSchema = zod_1.z.object({
      userId: zod_1.z.string().min(1).max(128),
      displayName: zod_1.z.string().max(80).nullable(),
      title: zod_1.z.string().max(120).nullable(),
      bio: zod_1.z.string().max(280).nullable(),
      avatarUrl: zod_1.z.string().max(2048).nullable(),
      profileVersion: exports2.revisionSchema
    }).strict();
    exports2.profileUpdateSchema = zod_1.z.object({
      displayName: zod_1.z.string().trim().min(1).max(80).nullable().optional(),
      title: zod_1.z.string().trim().max(120).nullable().optional(),
      bio: zod_1.z.string().trim().max(280).nullable().optional(),
      expectedVersion: exports2.revisionSchema
    }).strict();
    exports2.workspaceAgentSchema = zod_1.z.object({
      id: exports2.entityIdSchema,
      name: zod_1.z.string().min(1).max(80),
      tokenPrefix: zod_1.z.string().min(4).max(32),
      scopes: zod_1.z.array(exports2.agentScopeSchema).max(constants_1.WORKSPACE_ACTIONS.length),
      projectId: zod_1.z.string().max(128).nullable(),
      createdAt: zod_1.z.number().int().nonnegative(),
      expiresAt: zod_1.z.number().int().positive().nullable(),
      lastUsedAt: zod_1.z.number().int().positive().nullable(),
      revokedAt: zod_1.z.number().int().positive().nullable()
    }).strict();
    exports2.workspaceAgentCreateSchema = zod_1.z.object({
      name: zod_1.z.string().trim().min(1).max(80),
      scopes: zod_1.z.array(exports2.agentScopeSchema).min(1).max(constants_1.WORKSPACE_ACTIONS.length),
      projectId: zod_1.z.string().min(1).max(128).nullable().optional(),
      expiresAt: zod_1.z.number().int().positive().nullable().optional()
    }).strict();
    exports2.conversationKindSchema = zod_1.z.enum(["workspace", "group", "direct", "assistant"]);
    exports2.conversationSchema = zod_1.z.object({
      id: exports2.entityIdSchema,
      kind: exports2.conversationKindSchema,
      name: zod_1.z.string().max(80).nullable(),
      version: exports2.revisionSchema,
      createdAt: zod_1.z.number().int().nonnegative(),
      updatedAt: zod_1.z.number().int().nonnegative(),
      archivedAt: zod_1.z.number().int().positive().nullable(),
      lastMessageSeq: zod_1.z.number().int().nonnegative().nullable(),
      lastMessageAt: zod_1.z.number().int().nonnegative().nullable(),
      unreadCount: zod_1.z.number().int().nonnegative()
    }).strict();
    exports2.conversationCreateSchema = zod_1.z.object({
      kind: zod_1.z.enum(["group", "direct"]),
      name: zod_1.z.string().trim().min(1).max(80).optional(),
      memberIds: zod_1.z.array(zod_1.z.string().min(1).max(128)).min(1).max(100),
      clientMutationId: exports2.idempotencyKeySchema
    }).strict().superRefine((value, ctx) => {
      if (value.kind === "direct" && value.memberIds.length !== 1) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "direct conversations require one other member" });
      }
      if (value.kind === "group" && !value.name) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "group conversations require a name" });
      }
    });
    exports2.assistantSessionCreateSchema = zod_1.z.object({
      projectId: zod_1.z.string().trim().min(1).max(128),
      projectIds: zod_1.z.array(zod_1.z.string().trim().min(1).max(128)).min(1).max(100).refine((ids) => new Set(ids).size === ids.length, "projectIds must be unique").optional(),
      name: zod_1.z.string().trim().min(1).max(80).optional(),
      worktreeId: zod_1.z.string().uuid().optional(),
      mode: zod_1.z.enum(["full", "quick"]).optional(),
      clientMutationId: exports2.idempotencyKeySchema
    }).strict().refine(({ projectId, projectIds, worktreeId }) => (!projectIds || projectIds[0] === projectId) && (!worktreeId || !projectIds || projectIds.length === 1), "projectId must be first and checkout sessions require one project");
    exports2.assistantSessionSortSchema = zod_1.z.enum(["activity", "created", "name"]);
    exports2.assistantSessionOrderSchema = zod_1.z.enum(["asc", "desc"]);
    exports2.assistantSessionListQuerySchema = zod_1.z.object({
      q: zod_1.z.string().trim().min(1).max(80).optional(),
      projectIds: zod_1.z.array(zod_1.z.string().trim().min(1).max(128)).min(1).max(100).refine((ids) => new Set(ids).size === ids.length, "projectIds must be unique").optional(),
      sort: exports2.assistantSessionSortSchema.default("activity"),
      order: exports2.assistantSessionOrderSchema.default("desc"),
      cursor: exports2.opaqueCursorSchema.optional(),
      limit: zod_1.z.number().int().min(1).max(100).default(50)
    }).strict();
    exports2.messageSchema = zod_1.z.object({
      seq: zod_1.z.number().int().positive(),
      id: exports2.entityIdSchema,
      conversationId: exports2.entityIdSchema,
      authorKind: zod_1.z.enum(["user", "agent"]),
      authorId: zod_1.z.string().min(1).max(128),
      authorLabel: zod_1.z.string().max(120).nullable(),
      origin: zod_1.z.enum(["octonode", "slack"]),
      replyToId: exports2.entityIdSchema.nullable(),
      body: zod_1.z.string().max(16384),
      version: exports2.revisionSchema,
      createdAt: zod_1.z.number().int().nonnegative(),
      editedAt: zod_1.z.number().int().positive().nullable(),
      deletedAt: zod_1.z.number().int().positive().nullable(),
      reactions: zod_1.z.record(zod_1.z.string(), zod_1.z.number().int().positive()),
      viewerReactions: zod_1.z.array(zod_1.z.string().max(32)).max(100)
    }).strict();
    exports2.messageCreateSchema = zod_1.z.object({
      body: zod_1.z.string().min(1).max(16384),
      replyToId: exports2.entityIdSchema.nullable().optional(),
      clientMutationId: exports2.idempotencyKeySchema
    }).strict();
    exports2.messageUpdateSchema = zod_1.z.object({
      body: zod_1.z.string().min(1).max(16384),
      expectedVersion: exports2.revisionSchema
    }).strict();
    exports2.pullRequestStateSchema = zod_1.z.enum(["open", "closed", "merged"]);
    exports2.reviewContextSchema = zod_1.z.object({
      id: exports2.entityIdSchema,
      projectId: zod_1.z.string().min(1).max(128),
      repositoryId: zod_1.z.number().int().positive(),
      pullNumber: zod_1.z.number().int().positive(),
      baseRef: zod_1.z.string().min(1).max(255),
      baseSha: exports2.gitShaSchema,
      headRef: zod_1.z.string().min(1).max(255),
      headSha: exports2.gitShaSchema,
      state: exports2.pullRequestStateSchema,
      createdAt: zod_1.z.number().int().nonnegative()
    }).strict();
    exports2.reviewFragmentSchema = zod_1.z.object({
      filePath: zod_1.z.string().min(1).max(1024),
      startLine: zod_1.z.number().int().positive().nullable(),
      startSide: zod_1.z.enum(["LEFT", "RIGHT"]).nullable(),
      endLine: zod_1.z.number().int().positive(),
      endSide: zod_1.z.enum(["LEFT", "RIGHT"])
    }).strict();
    exports2.reviewAnchorSchema = zod_1.z.object({
      publication: zod_1.z.enum(["inline", "fragments", "file", "summary", "unavailable"]),
      state: zod_1.z.enum(["current", "outdated", "unmapped"]),
      filePath: zod_1.z.string().max(1024).nullable(),
      commitSha: exports2.gitShaSchema,
      blobSha: zod_1.z.string().max(64).nullable(),
      startLine: zod_1.z.number().int().positive().nullable(),
      startSide: zod_1.z.enum(["LEFT", "RIGHT"]).nullable(),
      endLine: zod_1.z.number().int().positive().nullable(),
      endSide: zod_1.z.enum(["LEFT", "RIGHT"]).nullable(),
      fragments: zod_1.z.array(exports2.reviewFragmentSchema).min(2).max(100).optional()
    }).strict();
    exports2.reviewThreadSchema = zod_1.z.object({
      id: exports2.entityIdSchema,
      contextId: exports2.entityIdSchema,
      workflowId: zod_1.z.string().max(200).nullable(),
      scope: zod_1.z.enum(["pull_request", "workflow", "nodes", "code"]),
      nodeIds: zod_1.z.array(zod_1.z.string().min(1).max(200)).max(100),
      anchor: exports2.reviewAnchorSchema,
      status: zod_1.z.enum(["open", "resolved"]),
      version: exports2.revisionSchema,
      createdAt: zod_1.z.number().int().nonnegative(),
      updatedAt: zod_1.z.number().int().nonnegative()
    }).strict();
    exports2.reviewThreadCreateSchema = zod_1.z.object({
      context: exports2.reviewContextSchema.omit({ id: true, createdAt: true }),
      workflowId: zod_1.z.string().min(1).max(200).nullable(),
      scope: zod_1.z.enum(["pull_request", "workflow", "nodes", "code"]),
      nodeIds: zod_1.z.array(zod_1.z.string().min(1).max(200)).max(100),
      anchor: exports2.reviewAnchorSchema,
      body: zod_1.z.string().min(1).max(32768),
      clientMutationId: exports2.idempotencyKeySchema
    }).strict();
    exports2.reviewCommentSchema = zod_1.z.object({
      seq: zod_1.z.number().int().positive(),
      id: exports2.entityIdSchema,
      threadId: exports2.entityIdSchema,
      authorKind: zod_1.z.enum(["user", "agent", "github"]),
      authorId: zod_1.z.string().min(1).max(128),
      authorLabel: zod_1.z.string().max(120).nullable(),
      authorAvatarUrl: zod_1.z.string().max(2048).nullable(),
      origin: zod_1.z.enum(["octonode", "github"]),
      body: zod_1.z.string().max(32768),
      version: exports2.revisionSchema,
      createdAt: zod_1.z.number().int().nonnegative(),
      editedAt: zod_1.z.number().int().positive().nullable(),
      deletedAt: zod_1.z.number().int().positive().nullable(),
      githubState: zod_1.z.enum(["unpublished", "queued", "published", "failed", "deleted"]),
      suggestion: zod_1.z.lazy(() => exports2.reviewSuggestionSchema).nullable()
    }).strict();
    var workflowSuggestionPayloadSchema = zod_1.z.object({
      completeDraft: zod_1.z.record(zod_1.z.unknown())
    }).strict();
    var sourceSuggestionPayloadSchema = zod_1.z.object({
      path: zod_1.z.string().min(1).max(1024),
      startByte: zod_1.z.number().int().nonnegative(),
      endByte: zod_1.z.number().int().nonnegative(),
      selectedSha256: exports2.sha256Schema,
      replacement: zod_1.z.string().max(524288),
      baseBlobSha: zod_1.z.string().min(1).max(64)
    }).strict().refine((value) => value.endByte >= value.startByte, "endByte must not precede startByte");
    exports2.suggestionCreateSchema = zod_1.z.discriminatedUnion("kind", [
      zod_1.z.object({
        kind: zod_1.z.literal("workflow_draft"),
        baseHeadSha: exports2.gitShaSchema,
        baseRevision: zod_1.z.string().min(1).max(128),
        payload: workflowSuggestionPayloadSchema,
        clientMutationId: exports2.idempotencyKeySchema
      }).strict(),
      zod_1.z.object({
        kind: zod_1.z.literal("source_patch"),
        baseHeadSha: exports2.gitShaSchema,
        baseRevision: zod_1.z.string().min(1).max(128),
        payload: sourceSuggestionPayloadSchema,
        clientMutationId: exports2.idempotencyKeySchema
      }).strict()
    ]);
    exports2.reviewSuggestionSchema = zod_1.z.object({
      id: exports2.entityIdSchema,
      commentId: exports2.entityIdSchema,
      kind: zod_1.z.enum(["workflow_draft", "source_patch"]),
      baseHeadSha: exports2.gitShaSchema,
      baseRevision: zod_1.z.string().min(1).max(128),
      payload: zod_1.z.record(zod_1.z.unknown()),
      prepared: zod_1.z.record(zod_1.z.unknown()).nullable(),
      validation: zod_1.z.record(zod_1.z.unknown()).nullable(),
      status: zod_1.z.enum(["open", "applying", "applied", "rejected", "outdated", "failed"]),
      version: exports2.revisionSchema,
      createdAt: zod_1.z.number().int().nonnegative(),
      appliedCommitSha: exports2.gitShaSchema.nullable()
    }).strict();
    exports2.notificationSchema = zod_1.z.object({
      seq: zod_1.z.number().int().positive(),
      id: exports2.entityIdSchema,
      kind: zod_1.z.enum(["message", "review_reply", "suggestion", "github_sync", "task"]),
      actorKind: zod_1.z.enum(["user", "agent", "github"]),
      actorId: zod_1.z.string().min(1).max(128),
      entityType: zod_1.z.string().min(1).max(64),
      entityId: zod_1.z.string().min(1).max(128),
      payload: zod_1.z.record(zod_1.z.unknown()),
      createdAt: zod_1.z.number().int().nonnegative(),
      readAt: zod_1.z.number().int().positive().nullable()
    }).strict();
    exports2.githubPublicationStateSchema = zod_1.z.enum(["queued", "processing", "published", "failed", "deleted"]);
    exports2.realtimeInvalidationSchema = zod_1.z.object({
      type: zod_1.z.enum([
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
      id: zod_1.z.string().min(1).max(128).optional(),
      conversationId: exports2.entityIdSchema.optional(),
      threadId: exports2.entityIdSchema.optional(),
      entityType: zod_1.z.enum(["plugin_install", "project_job"]).optional(),
      userId: zod_1.z.string().min(1).max(128).optional(),
      state: zod_1.z.enum(["online", "offline"]).optional()
    }).strict();
    exports2.collaborationErrorSchema = zod_1.z.object({
      error: zod_1.z.string(),
      code: zod_1.z.enum(["forbidden", "conflict", "too_large", "unmappable", "rate_limited", "maintenance", "unavailable"]).optional(),
      retryAfter: zod_1.z.number().int().positive().optional(),
      currentVersion: exports2.revisionSchema.optional(),
      currentHeadSha: exports2.gitShaSchema.optional()
    }).strict();
  }
});

// packages/schema/dist/task-management/common.js
var require_common = __commonJS({
  "packages/schema/dist/task-management/common.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.taskTagUpdateSchema = exports2.taskTagCreateSchema = exports2.taskTagSchema = exports2.workItemFieldValueSchema = exports2.taskFieldValueSchema = exports2.taskFieldUpdateSchema = exports2.taskFieldCreateSchema = exports2.taskFieldDefinitionSchema = exports2.taskFieldOptionUpdateSchema = exports2.taskFieldOptionCreateSchema = exports2.taskFieldOptionSchema = exports2.workItemTypeUpdateSchema = exports2.workItemTypeCreateSchema = exports2.workItemTypeSchema = exports2.taskStatusUpdateSchema = exports2.taskStatusCreateSchema = exports2.taskStatusSchema = exports2.taskSpaceUpdateSchema = exports2.taskSpaceCreateSchema = exports2.taskSpaceSchema = exports2.workItemKeySchema = exports2.taskSpaceKeySchema = exports2.taskFieldTypeSchema = exports2.workItemPrioritySchema = exports2.builtinWorkItemTypeSchema = exports2.workItemLevelSchema = exports2.taskStatusCategorySchema = exports2.taskSpaceTemplateSchema = exports2.taskUserIdSchema = exports2.taskColorSchema = exports2.nullableTaskTimestampSchema = exports2.taskTimestampSchema = exports2.taskDescriptionSchema = exports2.taskNameSchema = void 0;
    var zod_1 = require("zod");
    var constants_1 = require_constants();
    var collaboration_1 = require_collaboration();
    exports2.taskNameSchema = zod_1.z.string().trim().min(1).max(120);
    exports2.taskDescriptionSchema = zod_1.z.string().max(32768).nullable();
    exports2.taskTimestampSchema = zod_1.z.number().int().nonnegative();
    exports2.nullableTaskTimestampSchema = exports2.taskTimestampSchema.nullable();
    exports2.taskColorSchema = zod_1.z.string().regex(/^#[0-9a-f]{6}$/i);
    exports2.taskUserIdSchema = zod_1.z.string().min(1).max(128);
    exports2.taskSpaceTemplateSchema = zod_1.z.enum(constants_1.TASK_SPACE_TEMPLATES);
    exports2.taskStatusCategorySchema = zod_1.z.enum(constants_1.TASK_STATUS_CATEGORIES);
    exports2.workItemLevelSchema = zod_1.z.enum(constants_1.WORK_ITEM_LEVELS);
    exports2.builtinWorkItemTypeSchema = zod_1.z.enum(constants_1.BUILTIN_WORK_ITEM_TYPES);
    exports2.workItemPrioritySchema = zod_1.z.enum(constants_1.WORK_ITEM_PRIORITIES);
    exports2.taskFieldTypeSchema = zod_1.z.enum(constants_1.TASK_FIELD_TYPES);
    exports2.taskSpaceKeySchema = zod_1.z.string().trim().min(2).max(10).regex(/^[A-Z][A-Z0-9]*$/);
    exports2.workItemKeySchema = zod_1.z.string().trim().regex(/^[A-Z][A-Z0-9]{1,9}-[1-9][0-9]*$/);
    exports2.taskSpaceSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      key: exports2.taskSpaceKeySchema,
      name: exports2.taskNameSchema,
      description: exports2.taskDescriptionSchema,
      sprintsEnabled: zod_1.z.boolean(),
      version: collaboration_1.revisionSchema,
      createdAt: exports2.taskTimestampSchema,
      updatedAt: exports2.taskTimestampSchema,
      archivedAt: exports2.nullableTaskTimestampSchema
    }).strict();
    exports2.taskSpaceCreateSchema = zod_1.z.object({
      key: exports2.taskSpaceKeySchema,
      name: exports2.taskNameSchema,
      description: exports2.taskDescriptionSchema.optional(),
      template: exports2.taskSpaceTemplateSchema,
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict();
    exports2.taskSpaceUpdateSchema = zod_1.z.object({
      name: exports2.taskNameSchema.optional(),
      description: exports2.taskDescriptionSchema.optional(),
      sprintsEnabled: zod_1.z.boolean().optional(),
      expectedVersion: collaboration_1.revisionSchema
    }).strict().refine((changes) => Object.keys(changes).length > 1, "at least one task space change is required");
    exports2.taskStatusSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      spaceId: collaboration_1.entityIdSchema,
      name: exports2.taskNameSchema,
      category: exports2.taskStatusCategorySchema,
      color: exports2.taskColorSchema,
      position: zod_1.z.number().int().nonnegative(),
      wipLimit: zod_1.z.number().int().positive().max(1e4).nullable(),
      version: collaboration_1.revisionSchema,
      archivedAt: exports2.nullableTaskTimestampSchema
    }).strict();
    exports2.taskStatusCreateSchema = exports2.taskStatusSchema.omit({
      id: true,
      spaceId: true,
      version: true,
      archivedAt: true
    }).extend({ clientMutationId: collaboration_1.idempotencyKeySchema }).strict();
    exports2.taskStatusUpdateSchema = zod_1.z.object({
      name: exports2.taskNameSchema.optional(),
      category: exports2.taskStatusCategorySchema.optional(),
      color: exports2.taskColorSchema.optional(),
      position: zod_1.z.number().int().nonnegative().optional(),
      wipLimit: zod_1.z.number().int().positive().max(1e4).nullable().optional(),
      archived: zod_1.z.boolean().optional(),
      expectedVersion: collaboration_1.revisionSchema
    }).strict().refine((changes) => Object.keys(changes).length > 1, "at least one status change is required");
    exports2.workItemTypeSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      spaceId: collaboration_1.entityIdSchema,
      name: exports2.taskNameSchema,
      level: exports2.workItemLevelSchema,
      builtin: exports2.builtinWorkItemTypeSchema.nullable(),
      color: exports2.taskColorSchema,
      icon: zod_1.z.string().trim().min(1).max(64).nullable(),
      position: zod_1.z.number().int().nonnegative(),
      version: collaboration_1.revisionSchema,
      archivedAt: exports2.nullableTaskTimestampSchema
    }).strict();
    exports2.workItemTypeCreateSchema = exports2.workItemTypeSchema.omit({
      id: true,
      spaceId: true,
      builtin: true,
      version: true,
      archivedAt: true
    }).extend({ clientMutationId: collaboration_1.idempotencyKeySchema }).strict();
    exports2.workItemTypeUpdateSchema = zod_1.z.object({
      name: exports2.taskNameSchema.optional(),
      color: exports2.taskColorSchema.optional(),
      icon: zod_1.z.string().trim().min(1).max(64).nullable().optional(),
      position: zod_1.z.number().int().nonnegative().optional(),
      archived: zod_1.z.boolean().optional(),
      expectedVersion: collaboration_1.revisionSchema
    }).strict().refine((changes) => Object.keys(changes).length > 1, "at least one work item type change is required");
    exports2.taskFieldOptionSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      name: exports2.taskNameSchema,
      color: exports2.taskColorSchema,
      position: zod_1.z.number().int().nonnegative(),
      version: collaboration_1.revisionSchema,
      archivedAt: exports2.nullableTaskTimestampSchema
    }).strict();
    exports2.taskFieldOptionCreateSchema = zod_1.z.object({
      name: exports2.taskNameSchema,
      color: exports2.taskColorSchema,
      position: zod_1.z.number().int().nonnegative(),
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict();
    exports2.taskFieldOptionUpdateSchema = zod_1.z.object({
      name: exports2.taskNameSchema.optional(),
      color: exports2.taskColorSchema.optional(),
      position: zod_1.z.number().int().nonnegative().optional(),
      archived: zod_1.z.boolean().optional(),
      expectedVersion: collaboration_1.revisionSchema
    }).strict().refine((changes) => Object.keys(changes).length > 1, "at least one field option change is required");
    var taskFieldDefinitionShape = {
      name: exports2.taskNameSchema,
      description: zod_1.z.string().max(500).nullable(),
      type: exports2.taskFieldTypeSchema,
      required: zod_1.z.boolean(),
      position: zod_1.z.number().int().nonnegative()
    };
    function validateTaskFieldOptions(value, context) {
      const select = value.type === "single_select" || value.type === "multi_select";
      if (select && value.options.length === 0) {
        context.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ["options"], message: "select fields require options" });
      }
      if (!select && value.options.length > 0) {
        context.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ["options"], message: "only select fields accept options" });
      }
    }
    exports2.taskFieldDefinitionSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      spaceId: collaboration_1.entityIdSchema,
      ...taskFieldDefinitionShape,
      options: zod_1.z.array(exports2.taskFieldOptionSchema).max(100),
      version: collaboration_1.revisionSchema,
      archivedAt: exports2.nullableTaskTimestampSchema
    }).strict().superRefine(validateTaskFieldOptions);
    exports2.taskFieldCreateSchema = zod_1.z.object({
      ...taskFieldDefinitionShape,
      options: zod_1.z.array(exports2.taskFieldOptionCreateSchema.omit({ clientMutationId: true })).max(100),
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict().superRefine(validateTaskFieldOptions);
    exports2.taskFieldUpdateSchema = zod_1.z.object({
      name: exports2.taskNameSchema.optional(),
      description: zod_1.z.string().max(500).nullable().optional(),
      required: zod_1.z.boolean().optional(),
      position: zod_1.z.number().int().nonnegative().optional(),
      archived: zod_1.z.boolean().optional(),
      expectedVersion: collaboration_1.revisionSchema
    }).strict().refine((changes) => Object.keys(changes).length > 1, "at least one field change is required");
    exports2.taskFieldValueSchema = zod_1.z.discriminatedUnion("type", [
      zod_1.z.object({ type: zod_1.z.literal("text"), value: zod_1.z.string().max(1e4) }).strict(),
      zod_1.z.object({ type: zod_1.z.literal("number"), value: zod_1.z.number().finite() }).strict(),
      zod_1.z.object({ type: zod_1.z.literal("single_select"), value: collaboration_1.entityIdSchema }).strict(),
      zod_1.z.object({
        type: zod_1.z.literal("multi_select"),
        value: zod_1.z.array(collaboration_1.entityIdSchema).max(100).refine((ids) => new Set(ids).size === ids.length, "multi-select values must be unique")
      }).strict(),
      zod_1.z.object({ type: zod_1.z.literal("date"), value: exports2.taskTimestampSchema }).strict(),
      zod_1.z.object({ type: zod_1.z.literal("checkbox"), value: zod_1.z.boolean() }).strict(),
      zod_1.z.object({ type: zod_1.z.literal("user"), value: exports2.taskUserIdSchema }).strict(),
      zod_1.z.object({ type: zod_1.z.literal("url"), value: zod_1.z.string().url().max(2048) }).strict()
    ]);
    exports2.workItemFieldValueSchema = zod_1.z.object({
      fieldId: collaboration_1.entityIdSchema,
      value: exports2.taskFieldValueSchema
    }).strict();
    exports2.taskTagSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      spaceId: collaboration_1.entityIdSchema,
      name: exports2.taskNameSchema,
      color: exports2.taskColorSchema,
      version: collaboration_1.revisionSchema,
      archivedAt: exports2.nullableTaskTimestampSchema
    }).strict();
    exports2.taskTagCreateSchema = zod_1.z.object({
      name: exports2.taskNameSchema,
      color: exports2.taskColorSchema,
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict();
    exports2.taskTagUpdateSchema = zod_1.z.object({
      name: exports2.taskNameSchema.optional(),
      color: exports2.taskColorSchema.optional(),
      archived: zod_1.z.boolean().optional(),
      expectedVersion: collaboration_1.revisionSchema
    }).strict().refine((changes) => Object.keys(changes).length > 1, "at least one tag change is required");
  }
});

// packages/schema/dist/task-management/planning.js
var require_planning = __commonJS({
  "packages/schema/dist/task-management/planning.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.taskReleaseOperationSchema = exports2.releaseResolutionSchema = exports2.sprintCompleteSchema = exports2.sprintCompletionDestinationSchema = exports2.sprintStartSchema = exports2.taskSprintUpdateSchema = exports2.taskSprintCreateSchema = exports2.taskSprintSchema = exports2.taskReleaseProgressSchema = exports2.taskReleaseUpdateSchema = exports2.taskReleaseCreateSchema = exports2.taskReleaseSchema = exports2.taskSprintStateSchema = exports2.taskReleaseStateSchema = void 0;
    var zod_1 = require("zod");
    var constants_1 = require_constants();
    var collaboration_1 = require_collaboration();
    var common_1 = require_common();
    exports2.taskReleaseStateSchema = zod_1.z.enum(constants_1.TASK_RELEASE_STATES);
    exports2.taskSprintStateSchema = zod_1.z.enum(constants_1.TASK_SPRINT_STATES);
    exports2.taskReleaseSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      spaceId: collaboration_1.entityIdSchema,
      name: common_1.taskNameSchema,
      description: common_1.taskDescriptionSchema,
      state: exports2.taskReleaseStateSchema,
      startAt: common_1.nullableTaskTimestampSchema,
      targetAt: common_1.nullableTaskTimestampSchema,
      releasedAt: common_1.nullableTaskTimestampSchema,
      version: collaboration_1.revisionSchema,
      createdAt: common_1.taskTimestampSchema,
      updatedAt: common_1.taskTimestampSchema
    }).strict().superRefine((release2, context) => {
      if (release2.state === "released" && release2.releasedAt === null) {
        context.addIssue({
          code: zod_1.z.ZodIssueCode.custom,
          path: ["releasedAt"],
          message: "released releases require releasedAt"
        });
      }
    });
    exports2.taskReleaseCreateSchema = zod_1.z.object({
      name: common_1.taskNameSchema,
      description: common_1.taskDescriptionSchema.optional(),
      startAt: common_1.nullableTaskTimestampSchema.optional(),
      targetAt: common_1.nullableTaskTimestampSchema.optional(),
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict();
    exports2.taskReleaseUpdateSchema = zod_1.z.object({
      name: common_1.taskNameSchema.optional(),
      description: common_1.taskDescriptionSchema.optional(),
      startAt: common_1.nullableTaskTimestampSchema.optional(),
      targetAt: common_1.nullableTaskTimestampSchema.optional(),
      archived: zod_1.z.boolean().optional(),
      expectedVersion: collaboration_1.revisionSchema
    }).strict().refine((changes) => Object.keys(changes).length > 1, "at least one release change is required");
    exports2.taskReleaseProgressSchema = zod_1.z.object({
      totalItems: zod_1.z.number().int().nonnegative(),
      doneItems: zod_1.z.number().int().nonnegative(),
      totalStoryPoints: zod_1.z.number().nonnegative(),
      doneStoryPoints: zod_1.z.number().nonnegative()
    }).strict();
    exports2.taskSprintSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      spaceId: collaboration_1.entityIdSchema,
      name: common_1.taskNameSchema,
      goal: zod_1.z.string().max(500).nullable(),
      state: exports2.taskSprintStateSchema,
      startAt: common_1.nullableTaskTimestampSchema,
      endAt: common_1.nullableTaskTimestampSchema,
      version: collaboration_1.revisionSchema,
      createdAt: common_1.taskTimestampSchema,
      completedAt: common_1.nullableTaskTimestampSchema
    }).strict().superRefine((sprint, context) => {
      if (sprint.startAt !== null && sprint.endAt !== null && sprint.endAt < sprint.startAt) {
        context.addIssue({
          code: zod_1.z.ZodIssueCode.custom,
          path: ["endAt"],
          message: "endAt must not precede startAt"
        });
      }
      if (sprint.state === "active" && (sprint.startAt === null || sprint.endAt === null)) {
        context.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "active sprints require startAt and endAt" });
      }
    });
    exports2.taskSprintCreateSchema = zod_1.z.object({
      name: common_1.taskNameSchema,
      goal: zod_1.z.string().max(500).nullable().optional(),
      startAt: common_1.nullableTaskTimestampSchema.optional(),
      endAt: common_1.nullableTaskTimestampSchema.optional(),
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict().refine((sprint) => sprint.startAt == null || sprint.endAt == null || sprint.endAt >= sprint.startAt, "endAt must not precede startAt");
    exports2.taskSprintUpdateSchema = zod_1.z.object({
      name: common_1.taskNameSchema.optional(),
      goal: zod_1.z.string().max(500).nullable().optional(),
      startAt: common_1.nullableTaskTimestampSchema.optional(),
      endAt: common_1.nullableTaskTimestampSchema.optional(),
      expectedVersion: collaboration_1.revisionSchema
    }).strict().refine((changes) => Object.keys(changes).length > 1, "at least one sprint change is required").refine((sprint) => sprint.startAt == null || sprint.endAt == null || sprint.endAt >= sprint.startAt, "endAt must not precede startAt");
    exports2.sprintStartSchema = zod_1.z.object({
      startAt: common_1.taskTimestampSchema,
      endAt: common_1.taskTimestampSchema,
      expectedVersion: collaboration_1.revisionSchema,
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict().refine((sprint) => sprint.endAt >= sprint.startAt, "endAt must not precede startAt");
    exports2.sprintCompletionDestinationSchema = zod_1.z.discriminatedUnion("kind", [
      zod_1.z.object({ kind: zod_1.z.literal("backlog") }).strict(),
      zod_1.z.object({ kind: zod_1.z.literal("sprint"), sprintId: collaboration_1.entityIdSchema }).strict()
    ]);
    exports2.sprintCompleteSchema = zod_1.z.object({
      incompleteDestination: exports2.sprintCompletionDestinationSchema,
      expectedVersion: collaboration_1.revisionSchema,
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict();
    exports2.releaseResolutionSchema = zod_1.z.discriminatedUnion("kind", [
      zod_1.z.object({ kind: zod_1.z.literal("keep") }).strict(),
      zod_1.z.object({ kind: zod_1.z.literal("remove") }).strict(),
      zod_1.z.object({ kind: zod_1.z.literal("move"), releaseId: collaboration_1.entityIdSchema }).strict()
    ]);
    exports2.taskReleaseOperationSchema = zod_1.z.object({
      releasedAt: common_1.taskTimestampSchema,
      unresolvedItems: exports2.releaseResolutionSchema,
      expectedVersion: collaboration_1.revisionSchema,
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict();
  }
});

// packages/schema/dist/task-management/work-items.js
var require_work_items = __commonJS({
  "packages/schema/dist/task-management/work-items.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.workItemLinkMutationSchema = exports2.workItemMoveSchema = exports2.workItemUpdateSchema = exports2.workItemCreateSchema = exports2.workItemSchema = exports2.workItemPullRequestLinkSchema = exports2.workItemWorkflowLinkSchema = exports2.workItemLinkSchema = exports2.taskLinkTypeSchema = void 0;
    var zod_1 = require("zod");
    var constants_1 = require_constants();
    var collaboration_1 = require_collaboration();
    var common_1 = require_common();
    var planning_1 = require_planning();
    exports2.taskLinkTypeSchema = zod_1.z.enum(constants_1.TASK_LINK_TYPES);
    exports2.workItemLinkSchema = zod_1.z.object({
      sourceItemId: collaboration_1.entityIdSchema,
      targetItemId: collaboration_1.entityIdSchema,
      type: exports2.taskLinkTypeSchema,
      createdBy: common_1.taskUserIdSchema,
      createdAt: common_1.taskTimestampSchema
    }).strict();
    exports2.workItemWorkflowLinkSchema = zod_1.z.object({
      itemId: collaboration_1.entityIdSchema,
      projectId: zod_1.z.string().min(1).max(128),
      workflowId: zod_1.z.string().min(1).max(200),
      createdBy: common_1.taskUserIdSchema,
      createdAt: common_1.taskTimestampSchema
    }).strict();
    exports2.workItemPullRequestLinkSchema = zod_1.z.object({
      itemId: collaboration_1.entityIdSchema,
      repositoryId: zod_1.z.number().int().positive(),
      pullNumber: zod_1.z.number().int().positive(),
      createdBy: common_1.taskUserIdSchema,
      createdAt: common_1.taskTimestampSchema
    }).strict();
    exports2.workItemSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      key: common_1.workItemKeySchema,
      spaceId: collaboration_1.entityIdSchema,
      type: common_1.workItemTypeSchema,
      title: zod_1.z.string().trim().min(1).max(240),
      description: common_1.taskDescriptionSchema,
      statusId: collaboration_1.entityIdSchema,
      priority: common_1.workItemPrioritySchema,
      reporterId: common_1.taskUserIdSchema,
      assigneeId: common_1.taskUserIdSchema.nullable(),
      parentId: collaboration_1.entityIdSchema.nullable(),
      sprintId: collaboration_1.entityIdSchema.nullable(),
      storyPoints: zod_1.z.number().min(0).max(1e3).nullable(),
      startAt: common_1.nullableTaskTimestampSchema,
      dueAt: common_1.nullableTaskTimestampSchema,
      rank: zod_1.z.number().int().nonnegative(),
      fieldValues: zod_1.z.array(common_1.workItemFieldValueSchema).max(50),
      tags: zod_1.z.array(common_1.taskTagSchema).max(20),
      releases: zod_1.z.array(planning_1.taskReleaseSchema).max(20),
      links: zod_1.z.object({
        items: zod_1.z.array(exports2.workItemLinkSchema).max(100),
        workflows: zod_1.z.array(exports2.workItemWorkflowLinkSchema).max(100),
        pullRequests: zod_1.z.array(exports2.workItemPullRequestLinkSchema).max(100)
      }).strict(),
      version: collaboration_1.revisionSchema,
      createdAt: common_1.taskTimestampSchema,
      updatedAt: common_1.taskTimestampSchema,
      archivedAt: common_1.nullableTaskTimestampSchema
    }).strict();
    var workItemMutationShape = {
      typeId: collaboration_1.entityIdSchema,
      title: zod_1.z.string().trim().min(1).max(240),
      description: common_1.taskDescriptionSchema,
      statusId: collaboration_1.entityIdSchema,
      priority: common_1.workItemPrioritySchema,
      assigneeId: common_1.taskUserIdSchema.nullable(),
      parentId: collaboration_1.entityIdSchema.nullable(),
      sprintId: collaboration_1.entityIdSchema.nullable(),
      storyPoints: zod_1.z.number().min(0).max(1e3).nullable(),
      startAt: common_1.nullableTaskTimestampSchema,
      dueAt: common_1.nullableTaskTimestampSchema,
      fieldValues: zod_1.z.array(common_1.workItemFieldValueSchema).max(50),
      tagIds: zod_1.z.array(collaboration_1.entityIdSchema).max(20),
      releaseIds: zod_1.z.array(collaboration_1.entityIdSchema).max(20)
    };
    exports2.workItemCreateSchema = zod_1.z.object({
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
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict();
    exports2.workItemUpdateSchema = zod_1.z.object({
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
      releaseIds: workItemMutationShape.releaseIds.optional(),
      expectedVersion: collaboration_1.revisionSchema
    }).strict().refine((changes) => Object.keys(changes).length > 1, "at least one work item change is required");
    exports2.workItemMoveSchema = zod_1.z.object({
      statusId: collaboration_1.entityIdSchema,
      beforeItemId: collaboration_1.entityIdSchema.nullable().optional(),
      afterItemId: collaboration_1.entityIdSchema.nullable().optional(),
      expectedVersion: collaboration_1.revisionSchema,
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict().refine((move) => !(move.beforeItemId && move.afterItemId), "beforeItemId and afterItemId are mutually exclusive");
    exports2.workItemLinkMutationSchema = zod_1.z.discriminatedUnion("kind", [
      zod_1.z.object({ kind: zod_1.z.literal("item"), targetItemId: collaboration_1.entityIdSchema, type: exports2.taskLinkTypeSchema }).strict(),
      zod_1.z.object({
        kind: zod_1.z.literal("workflow"),
        projectId: zod_1.z.string().min(1).max(128),
        workflowId: zod_1.z.string().min(1).max(200)
      }).strict(),
      zod_1.z.object({
        kind: zod_1.z.literal("pull_request"),
        repositoryId: zod_1.z.number().int().positive(),
        pullNumber: zod_1.z.number().int().positive()
      }).strict()
    ]);
  }
});

// packages/schema/dist/task-management/views.js
var require_views = __commonJS({
  "packages/schema/dist/task-management/views.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.taskViewUpdateSchema = exports2.taskViewCreateSchema = exports2.taskViewSchema = exports2.taskViewColumnSchema = exports2.taskViewFilterSchema = exports2.taskFieldFilterSchema = exports2.taskViewSortSchema = exports2.taskViewGroupSchema = exports2.taskViewLayoutSchema = void 0;
    var zod_1 = require("zod");
    var constants_1 = require_constants();
    var collaboration_1 = require_collaboration();
    var common_1 = require_common();
    exports2.taskViewLayoutSchema = zod_1.z.enum(constants_1.TASK_VIEW_LAYOUTS);
    exports2.taskViewGroupSchema = zod_1.z.enum(constants_1.TASK_VIEW_GROUPS);
    exports2.taskViewSortSchema = zod_1.z.enum(constants_1.TASK_VIEW_SORTS);
    exports2.taskFieldFilterSchema = zod_1.z.object({
      fieldId: collaboration_1.entityIdSchema,
      operator: zod_1.z.enum(["is", "is_not", "contains", "before", "after"]),
      value: zod_1.z.union([zod_1.z.string().max(1e4), zod_1.z.number().finite(), zod_1.z.boolean(), zod_1.z.array(zod_1.z.string().max(128)).max(100)])
    }).strict();
    exports2.taskViewFilterSchema = zod_1.z.object({
      query: zod_1.z.string().trim().max(200).optional(),
      typeIds: zod_1.z.array(collaboration_1.entityIdSchema).max(50).optional(),
      statusIds: zod_1.z.array(collaboration_1.entityIdSchema).max(20).optional(),
      priorities: zod_1.z.array(common_1.workItemPrioritySchema).max(constants_1.WORK_ITEM_PRIORITIES.length).optional(),
      assigneeIds: zod_1.z.array(common_1.taskUserIdSchema).max(100).optional(),
      tagIds: zod_1.z.array(collaboration_1.entityIdSchema).max(500).optional(),
      sprintIds: zod_1.z.array(collaboration_1.entityIdSchema).max(100).optional(),
      releaseIds: zod_1.z.array(collaboration_1.entityIdSchema).max(100).optional(),
      parentId: collaboration_1.entityIdSchema.optional(),
      projectIds: zod_1.z.array(zod_1.z.string().min(1).max(128)).max(100).optional(),
      customFields: zod_1.z.array(exports2.taskFieldFilterSchema).max(50).optional(),
      startFrom: common_1.taskTimestampSchema.optional(),
      dueThrough: common_1.taskTimestampSchema.optional(),
      hideDone: zod_1.z.boolean().optional()
    }).strict();
    exports2.taskViewColumnSchema = zod_1.z.discriminatedUnion("kind", [
      zod_1.z.object({
        kind: zod_1.z.literal("builtin"),
        field: zod_1.z.enum([
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
        width: zod_1.z.number().int().min(60).max(1e3).optional()
      }).strict(),
      zod_1.z.object({
        kind: zod_1.z.literal("custom"),
        fieldId: collaboration_1.entityIdSchema,
        width: zod_1.z.number().int().min(60).max(1e3).optional()
      }).strict()
    ]);
    function validateTaskViewGrouping(view, context) {
      if (view.groupBy === "custom_single_select" && view.groupFieldId === null) {
        context.addIssue({
          code: zod_1.z.ZodIssueCode.custom,
          path: ["groupFieldId"],
          message: "custom grouping requires a field"
        });
      }
      if (view.groupBy !== "custom_single_select" && view.groupFieldId !== null) {
        context.addIssue({
          code: zod_1.z.ZodIssueCode.custom,
          path: ["groupFieldId"],
          message: "groupFieldId is only valid for custom grouping"
        });
      }
    }
    var taskViewMutationShape = {
      name: common_1.taskNameSchema,
      layout: exports2.taskViewLayoutSchema,
      filter: exports2.taskViewFilterSchema,
      groupBy: exports2.taskViewGroupSchema,
      groupFieldId: collaboration_1.entityIdSchema.nullable(),
      sort: exports2.taskViewSortSchema,
      columns: zod_1.z.array(exports2.taskViewColumnSchema).max(50),
      shared: zod_1.z.boolean()
    };
    exports2.taskViewSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      spaceId: collaboration_1.entityIdSchema,
      ...taskViewMutationShape,
      version: collaboration_1.revisionSchema,
      createdAt: common_1.taskTimestampSchema,
      updatedAt: common_1.taskTimestampSchema
    }).strict().superRefine(validateTaskViewGrouping);
    exports2.taskViewCreateSchema = zod_1.z.object({
      ...taskViewMutationShape,
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict().superRefine(validateTaskViewGrouping);
    exports2.taskViewUpdateSchema = zod_1.z.object({
      name: taskViewMutationShape.name.optional(),
      layout: taskViewMutationShape.layout.optional(),
      filter: taskViewMutationShape.filter.optional(),
      groupBy: taskViewMutationShape.groupBy.optional(),
      groupFieldId: taskViewMutationShape.groupFieldId.optional(),
      sort: taskViewMutationShape.sort.optional(),
      columns: taskViewMutationShape.columns.optional(),
      shared: taskViewMutationShape.shared.optional(),
      expectedVersion: collaboration_1.revisionSchema
    }).strict().refine((changes) => Object.keys(changes).length > 1, "at least one view change is required");
  }
});

// packages/schema/dist/task-management/activity.js
var require_activity = __commonJS({
  "packages/schema/dist/task-management/activity.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.workItemActivityPageSchema = exports2.workItemCommentPageSchema = exports2.taskReleasePageSchema = exports2.taskSprintPageSchema = exports2.workItemPageSchema = exports2.taskSpacePageSchema = exports2.taskErrorSchema = exports2.workItemActivitySchema = exports2.workItemCommentCreateSchema = exports2.workItemCommentSchema = void 0;
    var zod_1 = require("zod");
    var collaboration_1 = require_collaboration();
    var common_1 = require_common();
    var planning_1 = require_planning();
    var work_items_1 = require_work_items();
    exports2.workItemCommentSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      itemId: collaboration_1.entityIdSchema,
      authorKind: zod_1.z.enum(["user", "agent"]),
      authorId: common_1.taskUserIdSchema,
      body: zod_1.z.string().max(32768),
      version: collaboration_1.revisionSchema,
      createdAt: common_1.taskTimestampSchema,
      editedAt: common_1.nullableTaskTimestampSchema,
      deletedAt: common_1.nullableTaskTimestampSchema
    }).strict();
    exports2.workItemCommentCreateSchema = zod_1.z.object({
      body: zod_1.z.string().trim().min(1).max(32768),
      replyToId: collaboration_1.entityIdSchema.nullable().optional(),
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict();
    var activityValueSchema = zod_1.z.union([zod_1.z.string().max(500), zod_1.z.number(), zod_1.z.boolean(), zod_1.z.null()]);
    exports2.workItemActivitySchema = zod_1.z.object({
      seq: zod_1.z.number().int().positive(),
      id: collaboration_1.entityIdSchema,
      itemId: collaboration_1.entityIdSchema,
      actorKind: zod_1.z.enum(["user", "agent", "system"]),
      actorId: common_1.taskUserIdSchema,
      kind: zod_1.z.enum([
        "created",
        "updated",
        "moved",
        "archived",
        "commented",
        "linked",
        "unlinked",
        "sprint_planned",
        "sprint_started",
        "sprint_completed",
        "release_updated"
      ]),
      fields: zod_1.z.array(zod_1.z.string().min(1).max(64)).max(50),
      before: zod_1.z.record(activityValueSchema),
      after: zod_1.z.record(activityValueSchema),
      createdAt: common_1.taskTimestampSchema
    }).strict();
    exports2.taskErrorSchema = zod_1.z.object({
      error: zod_1.z.string().min(1).max(1e3),
      code: zod_1.z.enum([
        "forbidden",
        "not_found",
        "conflict",
        "invalid_hierarchy",
        "too_large",
        "rate_limited",
        "unavailable"
      ]),
      currentVersion: collaboration_1.revisionSchema.optional()
    }).strict();
    exports2.taskSpacePageSchema = (0, collaboration_1.pageSchema)(common_1.taskSpaceSchema);
    exports2.workItemPageSchema = (0, collaboration_1.pageSchema)(work_items_1.workItemSchema);
    exports2.taskSprintPageSchema = (0, collaboration_1.pageSchema)(planning_1.taskSprintSchema);
    exports2.taskReleasePageSchema = (0, collaboration_1.pageSchema)(planning_1.taskReleaseSchema);
    exports2.workItemCommentPageSchema = (0, collaboration_1.pageSchema)(exports2.workItemCommentSchema);
    exports2.workItemActivityPageSchema = (0, collaboration_1.pageSchema)(exports2.workItemActivitySchema);
  }
});

// packages/schema/dist/task-management/index.js
var require_task_management = __commonJS({
  "packages/schema/dist/task-management/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_common(), exports2);
    __exportStar(require_planning(), exports2);
    __exportStar(require_work_items(), exports2);
    __exportStar(require_views(), exports2);
    __exportStar(require_activity(), exports2);
  }
});

// packages/schema/dist/design-collaboration.js
var require_design_collaboration = __commonJS({
  "packages/schema/dist/design-collaboration.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.designReviewThreadCreateSchema = exports2.designReviewThreadPageSchema = exports2.designReviewThreadSchema = exports2.designAnchorProjectionSchema = exports2.commentTargetSchema = exports2.pullRequestCommentTargetSchema = exports2.designCommentTargetSchema = exports2.designSourceReferenceSchema = exports2.designArtifactRevisionCreateSchema = exports2.designArtifactCreateSchema = exports2.designArtifactPageSchema = exports2.designArtifactSummarySchema = exports2.designArtifactSchema = exports2.designArtifactRevisionSchema = exports2.designPreviewDescriptorSchema = exports2.projectRevisionSchema = void 0;
    var zod_1 = require("zod");
    var collaboration_1 = require_collaboration();
    exports2.projectRevisionSchema = zod_1.z.union([collaboration_1.gitShaSchema, collaboration_1.sha256Schema]);
    var projectRelativePathSchema = zod_1.z.string().min(1).max(1024).refine((value) => (value === "." || value.split("/").every((part) => part && part !== "." && part !== "..")) && !value.startsWith("/") && !value.includes("\\") && !value.includes("\0"), "path must be a safe project-relative path");
    exports2.designPreviewDescriptorSchema = zod_1.z.object({
      title: zod_1.z.string().trim().min(1).max(120),
      sourcePath: projectRelativePathSchema,
      entryScript: zod_1.z.string().min(1).max(80).regex(/^[A-Za-z0-9][A-Za-z0-9:._-]*$/),
      workingDirectory: zod_1.z.union([zod_1.z.literal("."), projectRelativePathSchema]),
      port: zod_1.z.number().int().min(1024).max(65535),
      healthPath: zod_1.z.string().min(1).max(1024).regex(/^\/(?!\/)[^?#]*$/)
    }).strict();
    exports2.designArtifactRevisionSchema = zod_1.z.object({
      artifactRevision: collaboration_1.entityIdSchema,
      projectRevision: exports2.projectRevisionSchema,
      preview: exports2.designPreviewDescriptorSchema,
      createdByKind: zod_1.z.enum(["user", "agent"]),
      createdBy: zod_1.z.string().min(1).max(128),
      createdAt: zod_1.z.number().int().nonnegative()
    }).strict();
    exports2.designArtifactSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      projectId: zod_1.z.string().min(1).max(128),
      createdByKind: zod_1.z.enum(["user", "agent"]),
      createdBy: zod_1.z.string().min(1).max(128),
      createdAt: zod_1.z.number().int().nonnegative(),
      archivedAt: zod_1.z.number().int().positive().nullable(),
      revisions: zod_1.z.array(exports2.designArtifactRevisionSchema).min(1).max(1e3)
    }).strict();
    exports2.designArtifactSummarySchema = exports2.designArtifactSchema.omit({ revisions: true }).extend({
      latestRevision: exports2.designArtifactRevisionSchema
    }).strict();
    exports2.designArtifactPageSchema = (0, collaboration_1.pageSchema)(exports2.designArtifactSummarySchema);
    exports2.designArtifactCreateSchema = zod_1.z.object({
      projectRevision: exports2.projectRevisionSchema,
      preview: exports2.designPreviewDescriptorSchema,
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict();
    exports2.designArtifactRevisionCreateSchema = exports2.designArtifactCreateSchema;
    exports2.designSourceReferenceSchema = zod_1.z.object({
      path: projectRelativePathSchema,
      startLine: zod_1.z.number().int().positive().nullable(),
      endLine: zod_1.z.number().int().positive().nullable()
    }).strict().superRefine((value, ctx) => {
      if (value.startLine === null !== (value.endLine === null)) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "source line bounds must be provided together" });
      } else if (value.startLine !== null && value.endLine < value.startLine) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "source endLine must not precede startLine" });
      }
    });
    exports2.designCommentTargetSchema = zod_1.z.object({
      kind: zod_1.z.literal("design"),
      artifactId: collaboration_1.entityIdSchema,
      artifactRevision: collaboration_1.entityIdSchema,
      viewport: zod_1.z.object({
        width: zod_1.z.number().int().min(1).max(16384),
        height: zod_1.z.number().int().min(1).max(16384)
      }).strict(),
      position: zod_1.z.object({ x: zod_1.z.number().min(0).max(1), y: zod_1.z.number().min(0).max(1) }).strict(),
      selection: zod_1.z.object({
        quote: zod_1.z.string().trim().min(1).max(1e3),
        prefix: zod_1.z.string().max(200),
        suffix: zod_1.z.string().max(200)
      }).strict().optional(),
      selectorFingerprint: collaboration_1.sha256Schema.optional(),
      nodeId: zod_1.z.string().min(1).max(200).optional(),
      source: exports2.designSourceReferenceSchema.optional(),
      architecture: zod_1.z.object({
        blockId: zod_1.z.string().min(1).max(200).regex(/^[A-Za-z0-9][A-Za-z0-9._:-]*$/),
        entityId: zod_1.z.string().min(1).max(512).optional(),
        projectionRevision: collaboration_1.sha256Schema
      }).strict().optional()
    }).strict();
    exports2.pullRequestCommentTargetSchema = zod_1.z.object({
      kind: zod_1.z.literal("pull_request"),
      contextId: collaboration_1.entityIdSchema,
      workflowId: zod_1.z.string().max(200).nullable(),
      scope: zod_1.z.enum(["pull_request", "workflow", "nodes", "code"]),
      nodeIds: zod_1.z.array(zod_1.z.string().min(1).max(200)).max(100),
      anchor: collaboration_1.reviewAnchorSchema
    }).strict();
    exports2.commentTargetSchema = zod_1.z.discriminatedUnion("kind", [
      exports2.pullRequestCommentTargetSchema,
      exports2.designCommentTargetSchema
    ]);
    exports2.designAnchorProjectionSchema = zod_1.z.object({
      threadId: collaboration_1.entityIdSchema,
      artifactRevision: collaboration_1.entityIdSchema,
      state: zod_1.z.enum(["projected", "detached"]),
      position: zod_1.z.object({ x: zod_1.z.number().min(0).max(1), y: zod_1.z.number().min(0).max(1) }).strict().nullable(),
      reason: zod_1.z.string().trim().min(1).max(200).nullable(),
      createdAt: zod_1.z.number().int().nonnegative()
    }).strict().superRefine((value, ctx) => {
      if (value.state === "projected" !== (value.position !== null)) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "only projected anchors carry a position" });
      }
    });
    exports2.designReviewThreadSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      target: exports2.designCommentTargetSchema,
      projections: zod_1.z.array(exports2.designAnchorProjectionSchema).max(1e3),
      status: zod_1.z.enum(["open", "resolved"]),
      version: collaboration_1.revisionSchema,
      createdAt: zod_1.z.number().int().nonnegative(),
      updatedAt: zod_1.z.number().int().nonnegative(),
      comments: zod_1.z.array(collaboration_1.reviewCommentSchema).max(1e4)
    }).strict();
    exports2.designReviewThreadPageSchema = (0, collaboration_1.pageSchema)(exports2.designReviewThreadSchema);
    exports2.designReviewThreadCreateSchema = exports2.designCommentTargetSchema.omit({
      kind: true,
      artifactId: true
    }).extend({
      body: zod_1.z.string().min(1).max(32768),
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict();
  }
});

// packages/schema/dist/design-documents.js
var require_design_documents = __commonJS({
  "packages/schema/dist/design-documents.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.designDocumentShareSchema = exports2.designDocumentUpdateSchema = exports2.designDocumentCreateSchema = exports2.designDocumentDetailSchema = exports2.designDocumentSchema = exports2.designDocumentRevisionSchema = exports2.designDocumentScopeSchema = exports2.designDocumentAccessSchema = exports2.designDocumentFormatSchema = void 0;
    var zod_1 = require("zod");
    var collaboration_1 = require_collaboration();
    exports2.designDocumentFormatSchema = zod_1.z.enum(["markdown", "html", "text", "latex"]);
    exports2.designDocumentAccessSchema = zod_1.z.enum(["private", "workspace", "public_file", "public_host"]);
    exports2.designDocumentScopeSchema = zod_1.z.discriminatedUnion("kind", [
      zod_1.z.object({ kind: zod_1.z.literal("workspace") }).strict(),
      zod_1.z.object({ kind: zod_1.z.literal("project"), projectId: zod_1.z.string().min(1).max(128) }).strict()
    ]);
    exports2.designDocumentRevisionSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      title: zod_1.z.string().trim().min(1).max(160),
      format: exports2.designDocumentFormatSchema,
      checksum: collaboration_1.sha256Schema,
      size: zod_1.z.number().int().nonnegative().max(2 * 1024 * 1024),
      createdByKind: zod_1.z.enum(["user", "agent"]),
      createdBy: zod_1.z.string().min(1).max(128),
      createdAt: zod_1.z.number().int().nonnegative()
    }).strict();
    exports2.designDocumentSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      scope: exports2.designDocumentScopeSchema,
      access: exports2.designDocumentAccessSchema,
      sharePath: zod_1.z.string().startsWith("/design/").nullable(),
      version: collaboration_1.revisionSchema,
      createdByKind: zod_1.z.enum(["user", "agent"]),
      createdBy: zod_1.z.string().min(1).max(128),
      createdAt: zod_1.z.number().int().nonnegative(),
      updatedAt: zod_1.z.number().int().nonnegative(),
      latestRevision: exports2.designDocumentRevisionSchema
    }).strict();
    exports2.designDocumentDetailSchema = exports2.designDocumentSchema.extend({
      content: zod_1.z.string().max(2 * 1024 * 1024),
      commentProjectId: zod_1.z.string().min(1).max(128)
    }).strict();
    exports2.designDocumentCreateSchema = zod_1.z.object({
      scope: exports2.designDocumentScopeSchema,
      title: zod_1.z.string().trim().min(1).max(160),
      format: exports2.designDocumentFormatSchema,
      content: zod_1.z.string().max(2 * 1024 * 1024)
    }).strict();
    exports2.designDocumentUpdateSchema = zod_1.z.object({
      title: zod_1.z.string().trim().min(1).max(160),
      format: exports2.designDocumentFormatSchema,
      content: zod_1.z.string().max(2 * 1024 * 1024),
      baseRevision: collaboration_1.entityIdSchema
    }).strict();
    exports2.designDocumentShareSchema = zod_1.z.object({
      access: exports2.designDocumentAccessSchema,
      expectedVersion: collaboration_1.revisionSchema
    }).strict();
  }
});

// packages/schema/dist/analytics-dashboard.js
var require_analytics_dashboard = __commonJS({
  "packages/schema/dist/analytics-dashboard.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UpdateAnalyticsDashboardInput = exports2.CreateAnalyticsDashboardInput = exports2.AnalyticsDashboard = exports2.AnalyticsDays = exports2.AnalyticsWidget = void 0;
    var zod_1 = require("zod");
    var id = zod_1.z.string().min(1).max(80).regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/);
    var title = zod_1.z.string().trim().min(1).max(80);
    var width = zod_1.z.enum(["small", "medium", "wide"]).default("medium");
    var baseWidget = zod_1.z.object({ id, title, width });
    exports2.AnalyticsWidget = zod_1.z.discriminatedUnion("visualization", [
      baseWidget.extend({
        visualization: zod_1.z.literal("stat"),
        source: zod_1.z.enum([
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
      baseWidget.extend({ visualization: zod_1.z.literal("area"), source: zod_1.z.literal("execution-volume") }),
      baseWidget.extend({ visualization: zod_1.z.literal("bar"), source: zod_1.z.literal("workflow-volume") }),
      baseWidget.extend({ visualization: zod_1.z.literal("pie"), source: zod_1.z.literal("status-distribution") })
    ]);
    exports2.AnalyticsDays = zod_1.z.union([zod_1.z.literal(7), zod_1.z.literal(14), zod_1.z.literal(30)]);
    var dashboardFields = {
      name: zod_1.z.string().trim().min(1).max(80),
      description: zod_1.z.string().trim().max(240).optional(),
      days: exports2.AnalyticsDays.default(14),
      widgets: zod_1.z.array(exports2.AnalyticsWidget).max(24).refine((widgets) => new Set(widgets.map((widget) => widget.id)).size === widgets.length, "widget ids must be unique").default([])
    };
    exports2.AnalyticsDashboard = zod_1.z.object({
      id,
      projectId: zod_1.z.string().min(1).max(160),
      ...dashboardFields,
      revision: zod_1.z.number().int().positive(),
      createdAt: zod_1.z.number().int().nonnegative(),
      updatedAt: zod_1.z.number().int().nonnegative()
    });
    exports2.CreateAnalyticsDashboardInput = zod_1.z.object(dashboardFields);
    exports2.UpdateAnalyticsDashboardInput = zod_1.z.object({
      revision: zod_1.z.number().int().positive(),
      name: dashboardFields.name.optional(),
      description: dashboardFields.description.nullable(),
      days: exports2.AnalyticsDays.optional(),
      widgets: dashboardFields.widgets.optional()
    });
  }
});

// packages/schema/dist/capabilities.constants.js
var require_capabilities_constants = __commonJS({
  "packages/schema/dist/capabilities.constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.REPOSITORY = exports2.CLOUD = exports2.EVERYWHERE = exports2.COMMUNITY_RANK = void 0;
    exports2.COMMUNITY_RANK = { off: 0, read: 1, submit: 2, publish: 3, all: 3 };
    exports2.EVERYWHERE = /* @__PURE__ */ new Set([
      "workspace_identity",
      "workflow_execution",
      "monitoring",
      "backup_restore",
      "write_authority"
    ]);
    exports2.CLOUD = /* @__PURE__ */ new Set([
      "workspace_social",
      "task_management",
      "workspace_admin",
      "billing",
      "github",
      "slack"
    ]);
    exports2.REPOSITORY = /* @__PURE__ */ new Set([
      "repository_registry",
      "repository_discovery",
      "repository_git_read",
      "repository_git_write",
      "architecture",
      "workspace_registry_backup_restore",
      "design_architecture_embed"
    ]);
  }
});

// packages/schema/dist/capabilities.js
var require_capabilities = __commonJS({
  "packages/schema/dist/capabilities.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CapabilityDocument = exports2.Capability = exports2.CapabilityUnavailableReason = exports2.CapabilityMode = exports2.CapabilityName = void 0;
    exports2.buildCapabilityDocument = buildCapabilityDocument;
    var zod_1 = require("zod");
    var capabilities_constants_1 = require_capabilities_constants();
    var constants_1 = require_constants();
    exports2.CapabilityName = zod_1.z.enum(constants_1.PLATFORM_CAPABILITIES);
    exports2.CapabilityMode = zod_1.z.enum(constants_1.CAPABILITY_MODES);
    exports2.CapabilityUnavailableReason = zod_1.z.enum(constants_1.CAPABILITY_UNAVAILABLE_REASONS);
    exports2.Capability = zod_1.z.discriminatedUnion("available", [
      zod_1.z.object({ name: exports2.CapabilityName, available: zod_1.z.literal(true), mode: exports2.CapabilityMode }),
      zod_1.z.object({
        name: exports2.CapabilityName,
        available: zod_1.z.literal(false),
        mode: exports2.CapabilityMode,
        reason: exports2.CapabilityUnavailableReason
      })
    ]);
    exports2.CapabilityDocument = zod_1.z.object({
      version: zod_1.z.literal(1),
      mode: exports2.CapabilityMode,
      items: zod_1.z.array(exports2.Capability)
    });
    function buildCapabilityDocument(mode, repositoryEnabled, workflowAgentsConfigured, communityRollout) {
      const communityStage = capabilities_constants_1.COMMUNITY_RANK[communityRollout] ?? capabilities_constants_1.COMMUNITY_RANK.read;
      const items = constants_1.PLATFORM_CAPABILITIES.map((name) => {
        const communityRequirement = name === "community_read" ? 1 : name === "community_authoring" ? 2 : name === "community_publishing" || name === "workflow_templates" ? 3 : 0;
        if (communityRequirement) {
          return mode !== "trusted-local" && communityStage >= communityRequirement ? { name, available: true, mode } : {
            name,
            available: false,
            mode,
            reason: mode === "trusted-local" ? "requires_cloud_configuration" : "disabled_by_policy"
          };
        }
        if (capabilities_constants_1.EVERYWHERE.has(name) || mode !== "trusted-local" && capabilities_constants_1.CLOUD.has(name) || repositoryEnabled && capabilities_constants_1.REPOSITORY.has(name)) {
          return { name, available: true, mode };
        }
        if (name === "workflow_agents") {
          return workflowAgentsConfigured ? { name, available: true, mode } : {
            name,
            available: false,
            mode,
            reason: mode === "trusted-local" ? "requires_cloud_configuration" : "provider_not_configured"
          };
        }
        return {
          name,
          available: false,
          mode,
          reason: capabilities_constants_1.CLOUD.has(name) ? "requires_cloud_configuration" : capabilities_constants_1.REPOSITORY.has(name) ? "disabled_by_policy" : "not_implemented"
        };
      });
      return exports2.CapabilityDocument.parse({ version: 1, mode, items });
    }
  }
});

// packages/schema/dist/agent-chat.js
var require_agent_chat = __commonJS({
  "packages/schema/dist/agent-chat.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.canTransitionAgentRun = exports2.claudeSandboxRequestSchema = exports2.agentServiceRunRequestSchema = exports2.agentToolAuditSchema = exports2.agentStreamEventSchema = exports2.agentRunSchema = exports2.agentUsageSchema = exports2.assistantConversationUpdateSchema = exports2.assistantConversationConfigSchema = exports2.agentToolRiskSchema = exports2.agentErrorCodeSchema = exports2.agentRunStatusSchema = void 0;
    var zod_1 = require("zod");
    var constants_1 = require_constants();
    var collaboration_1 = require_collaboration();
    var projectIdSchema = zod_1.z.string().min(1).max(128);
    var projectIdsSchema = zod_1.z.array(projectIdSchema).min(1).max(100).refine((ids) => new Set(ids).size === ids.length, "projectIds must be unique");
    var policyVersionSchema = zod_1.z.string().min(1).max(64);
    var modelAliasSchema = zod_1.z.string().min(1).max(128);
    var timestampSchema = zod_1.z.number().int().nonnegative();
    var toolNameSchema = zod_1.z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
    exports2.agentRunStatusSchema = zod_1.z.enum(constants_1.AGENT_RUN_STATUSES);
    exports2.agentErrorCodeSchema = zod_1.z.enum(constants_1.AGENT_ERROR_CODES);
    exports2.agentToolRiskSchema = zod_1.z.enum(constants_1.AGENT_TOOL_RISKS);
    exports2.assistantConversationConfigSchema = zod_1.z.object({
      conversationId: collaboration_1.entityIdSchema,
      projectId: projectIdSchema,
      projectIds: projectIdsSchema,
      worktreeId: zod_1.z.string().uuid().nullable().optional(),
      enabled: zod_1.z.boolean(),
      policyVersion: policyVersionSchema,
      createdByKind: zod_1.z.enum(["user", "agent"]),
      createdBy: zod_1.z.string().min(1).max(128),
      createdAt: timestampSchema,
      updatedByKind: zod_1.z.enum(["user", "agent"]),
      updatedBy: zod_1.z.string().min(1).max(128),
      updatedAt: timestampSchema,
      version: collaboration_1.revisionSchema
    }).strict().refine(({ createdAt, updatedAt }) => updatedAt >= createdAt, "updatedAt must not precede createdAt");
    exports2.assistantConversationUpdateSchema = zod_1.z.object({
      projectId: projectIdSchema,
      projectIds: projectIdsSchema.optional(),
      worktreeId: zod_1.z.string().uuid().nullable().optional(),
      enabled: zod_1.z.boolean(),
      expectedVersion: collaboration_1.revisionSchema.nullable()
    }).strict();
    exports2.agentUsageSchema = zod_1.z.object({
      inputTokens: zod_1.z.number().int().nonnegative(),
      outputTokens: zod_1.z.number().int().nonnegative(),
      totalTokens: zod_1.z.number().int().nonnegative(),
      modelCalls: zod_1.z.number().int().positive().max(100)
    }).strict().refine(({ inputTokens, outputTokens, totalTokens }) => inputTokens + outputTokens === totalTokens, "totalTokens must equal inputTokens plus outputTokens");
    var agentRunBaseSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      conversationId: collaboration_1.entityIdSchema,
      userMessageId: collaboration_1.entityIdSchema,
      projectId: projectIdSchema,
      projectIds: projectIdsSchema,
      worktreeId: zod_1.z.string().uuid().nullable().optional(),
      workflowRunId: zod_1.z.string().min(1).max(128),
      modelAlias: modelAliasSchema,
      policyVersion: policyVersionSchema,
      createdAt: timestampSchema,
      startedAt: timestampSchema.nullable(),
      usage: exports2.agentUsageSchema.nullable()
    }).strict();
    exports2.agentRunSchema = zod_1.z.discriminatedUnion("status", [
      agentRunBaseSchema.extend({
        status: zod_1.z.enum(["queued", "running", "approval_required"]),
        assistantMessageId: zod_1.z.null(),
        finishedAt: zod_1.z.null(),
        errorCode: zod_1.z.null()
      }),
      agentRunBaseSchema.extend({
        status: zod_1.z.literal("completed"),
        assistantMessageId: collaboration_1.entityIdSchema,
        finishedAt: timestampSchema,
        errorCode: zod_1.z.null()
      }),
      agentRunBaseSchema.extend({
        status: zod_1.z.literal("cancelled"),
        assistantMessageId: collaboration_1.entityIdSchema.nullable(),
        finishedAt: timestampSchema,
        errorCode: zod_1.z.literal("cancelled")
      }),
      agentRunBaseSchema.extend({
        status: zod_1.z.literal("failed"),
        assistantMessageId: collaboration_1.entityIdSchema.nullable(),
        finishedAt: timestampSchema,
        errorCode: exports2.agentErrorCodeSchema
      })
    ]).superRefine((value, ctx) => {
      if (value.startedAt !== null && value.startedAt < value.createdAt) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "startedAt must not precede createdAt" });
      }
      if (value.finishedAt !== null && value.finishedAt < (value.startedAt ?? value.createdAt)) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "finishedAt must not precede the run" });
      }
      if (value.status === "failed" && value.errorCode === "cancelled") {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "cancelled runs must use cancelled status" });
      }
    });
    var streamBaseSchema = zod_1.z.object({
      runId: collaboration_1.entityIdSchema,
      sequence: zod_1.z.number().int().nonnegative(),
      at: timestampSchema
    }).strict();
    var toolCallIdSchema = zod_1.z.string().min(1).max(128);
    exports2.agentStreamEventSchema = zod_1.z.discriminatedUnion("type", [
      streamBaseSchema.extend({
        type: zod_1.z.literal("started"),
        modelAlias: modelAliasSchema,
        policyVersion: policyVersionSchema
      }),
      streamBaseSchema.extend({
        type: zod_1.z.literal("text_delta"),
        delta: zod_1.z.string().min(1).max(4096)
      }),
      streamBaseSchema.extend({
        type: zod_1.z.literal("tool_started"),
        toolCallId: toolCallIdSchema,
        toolName: toolNameSchema,
        risk: exports2.agentToolRiskSchema
      }),
      streamBaseSchema.extend({
        type: zod_1.z.literal("tool_log"),
        toolCallId: toolCallIdSchema,
        level: zod_1.z.enum(["info", "error", "warn", "debug"]),
        source: zod_1.z.string(),
        message: zod_1.z.string(),
        timestamp: zod_1.z.number()
      }),
      streamBaseSchema.extend({
        type: zod_1.z.literal("tool_finished"),
        toolCallId: toolCallIdSchema,
        toolName: toolNameSchema,
        risk: exports2.agentToolRiskSchema,
        outcome: zod_1.z.enum(["ok", "error"]),
        durationMs: zod_1.z.number().int().nonnegative().max(3e5),
        errorCode: exports2.agentErrorCodeSchema.nullable()
      }),
      streamBaseSchema.extend({
        type: zod_1.z.literal("approval_required"),
        toolCallId: toolCallIdSchema,
        toolName: toolNameSchema,
        summary: zod_1.z.string().min(1).max(1e3)
      }),
      streamBaseSchema.extend({
        type: zod_1.z.literal("completed"),
        assistantMessageId: collaboration_1.entityIdSchema,
        usage: exports2.agentUsageSchema
      }),
      streamBaseSchema.extend({ type: zod_1.z.literal("cancelled") }),
      streamBaseSchema.extend({
        type: zod_1.z.literal("failed"),
        errorCode: exports2.agentErrorCodeSchema
      })
    ]).superRefine((value, ctx) => {
      if (value.type === "tool_finished" && value.outcome === "ok" !== (value.errorCode === null)) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "only failed tool calls carry an errorCode" });
      }
    });
    exports2.agentToolAuditSchema = zod_1.z.object({
      runId: collaboration_1.entityIdSchema,
      toolCallId: toolCallIdSchema,
      toolName: toolNameSchema,
      risk: exports2.agentToolRiskSchema,
      requiredAction: collaboration_1.agentScopeSchema,
      projectId: projectIdSchema,
      correlationId: collaboration_1.entityIdSchema,
      startedAt: timestampSchema,
      finishedAt: timestampSchema,
      durationMs: zod_1.z.number().int().nonnegative().max(3e5),
      outcome: zod_1.z.enum(["ok", "error", "denied"]),
      errorCode: exports2.agentErrorCodeSchema.nullable()
    }).strict().superRefine((value, ctx) => {
      if (value.finishedAt < value.startedAt) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "finishedAt must not precede startedAt" });
      }
      if (value.outcome === "ok" !== (value.errorCode === null)) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "only failed or denied tool calls carry an errorCode" });
      }
    });
    exports2.agentServiceRunRequestSchema = zod_1.z.object({
      version: zod_1.z.literal(1),
      requestId: collaboration_1.entityIdSchema,
      runId: collaboration_1.entityIdSchema,
      conversationId: collaboration_1.entityIdSchema,
      userMessageId: collaboration_1.entityIdSchema,
      assistantMessageId: collaboration_1.entityIdSchema,
      projectId: projectIdSchema,
      projectIds: projectIdsSchema,
      worktreeId: zod_1.z.string().uuid().nullable().optional(),
      workspace: collaboration_1.workspaceRefSchema,
      principal: collaboration_1.principalSchema,
      policyVersion: policyVersionSchema,
      messages: zod_1.z.array(zod_1.z.object({
        id: collaboration_1.entityIdSchema,
        role: zod_1.z.enum(["user", "assistant"]),
        content: zod_1.z.string().min(1).max(16384)
      }).strict()).min(1).max(100),
      limits: zod_1.z.object({
        maxOutputTokens: zod_1.z.number().int().min(1).max(32768),
        maxToolSteps: zod_1.z.number().int().min(1).max(32),
        timeoutMs: zod_1.z.number().int().min(1e3).max(3e5)
      }).strict()
    }).strict().superRefine((value, ctx) => {
      if (value.projectIds[0] !== value.projectId) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "projectId must be the first projectIds entry" });
      }
      if (value.principal.kind !== "agent")
        return;
      if (value.principal.workspace.kind !== value.workspace.kind || value.principal.workspace.id !== value.workspace.id) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "agent principal workspace must match the request" });
      }
      if (value.principal.projectId !== null && value.principal.projectId !== value.projectId) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "agent principal project must match the request" });
      }
    });
    exports2.claudeSandboxRequestSchema = zod_1.z.object({ prompt: zod_1.z.string().trim().min(1).max(8e3) }).strict();
    var AGENT_RUN_TRANSITIONS = {
      queued: ["running", "cancelled", "failed"],
      running: ["approval_required", "completed", "cancelled", "failed"],
      approval_required: ["running", "cancelled", "failed"],
      completed: [],
      cancelled: [],
      failed: []
    };
    var canTransitionAgentRun = (from, to) => from === to || AGENT_RUN_TRANSITIONS[from].includes(to);
    exports2.canTransitionAgentRun = canTransitionAgentRun;
  }
});

// packages/schema/dist/knowledge.js
var require_knowledge = __commonJS({
  "packages/schema/dist/knowledge.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.knowledgeSyncActivateSchema = exports2.knowledgeSyncBatchSchema = exports2.knowledgeCorpusChunkSchema = exports2.knowledgeSearchResponseSchema = exports2.knowledgeMatchSchema = exports2.knowledgeSearchRequestSchema = void 0;
    var zod_1 = require("zod");
    var digestSchema = zod_1.z.string().regex(/^[a-f0-9]{64}$/);
    var chunkIdSchema = zod_1.z.string().regex(/^octokb:[a-f0-9]{56}$/);
    exports2.knowledgeSearchRequestSchema = zod_1.z.object({
      query: zod_1.z.string().trim().min(1).max(2e3),
      topK: zod_1.z.number().int().min(1).max(8).default(6)
    }).strict();
    exports2.knowledgeMatchSchema = zod_1.z.object({
      id: chunkIdSchema,
      score: zod_1.z.number().finite(),
      source: zod_1.z.string().min(1).max(256),
      title: zod_1.z.string().min(1).max(200),
      heading: zod_1.z.string().min(1).max(200),
      content: zod_1.z.string().min(1).max(2e3),
      digest: digestSchema,
      kind: zod_1.z.enum(["documentation", "skill"])
    }).strict();
    exports2.knowledgeSearchResponseSchema = zod_1.z.object({
      corpusGeneration: digestSchema,
      model: zod_1.z.literal("@cf/baai/bge-base-en-v1.5"),
      matches: zod_1.z.array(exports2.knowledgeMatchSchema).max(8)
    }).strict();
    exports2.knowledgeCorpusChunkSchema = exports2.knowledgeMatchSchema.omit({ score: true });
    exports2.knowledgeSyncBatchSchema = zod_1.z.object({
      generation: digestSchema,
      chunks: zod_1.z.array(exports2.knowledgeCorpusChunkSchema).min(1).max(50)
    }).strict();
    exports2.knowledgeSyncActivateSchema = zod_1.z.object({
      generation: digestSchema,
      chunkCount: zod_1.z.number().int().min(1).max(1e4),
      sourceRevision: zod_1.z.string().min(1).max(128)
    }).strict();
  }
});

// packages/schema/dist/architecture.js
var require_architecture = __commonJS({
  "packages/schema/dist/architecture.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ArchitectureProjection = exports2.ArchitectureSeed = exports2.ArchitectureEdge = exports2.ArchitectureNode = exports2.ArchitectureScope = exports2.ArchitectureEntityKind = exports2.ArchitectureMode = void 0;
    var zod_1 = require("zod");
    var architectureId = zod_1.z.string().min(1).max(1024);
    exports2.ArchitectureMode = zod_1.z.enum(["inclusive", "exclusive"]);
    exports2.ArchitectureEntityKind = zod_1.z.enum([
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
    exports2.ArchitectureScope = zod_1.z.enum(["local", "cloud", "both"]);
    exports2.ArchitectureNode = zod_1.z.object({
      id: architectureId,
      label: zod_1.z.string().min(1).max(240),
      kind: exports2.ArchitectureEntityKind,
      detail: zod_1.z.string().max(512).optional(),
      status: zod_1.z.enum(["available", "unavailable", "reference", "boundary"]),
      scope: exports2.ArchitectureScope,
      ownerIds: zod_1.z.array(architectureId).max(100),
      boundaryOf: architectureId.optional()
    }).strict();
    exports2.ArchitectureEdge = zod_1.z.object({
      id: architectureId,
      from: architectureId,
      to: architectureId,
      relation: zod_1.z.enum([
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
      scope: exports2.ArchitectureScope,
      cycle: zod_1.z.boolean()
    }).strict();
    exports2.ArchitectureSeed = exports2.ArchitectureNode.pick({ id: true, label: true, kind: true });
    var ArchitectureProjectionGraph = zod_1.z.object({
      revision: zod_1.z.string().regex(/^[a-f0-9]{64}$/),
      mode: exports2.ArchitectureMode,
      seeds: zod_1.z.array(architectureId).max(100),
      availableSeeds: zod_1.z.array(exports2.ArchitectureSeed).max(5e3),
      nodes: zod_1.z.array(exports2.ArchitectureNode).max(5e3),
      edges: zod_1.z.array(exports2.ArchitectureEdge).max(1e4)
    }).strict();
    exports2.ArchitectureProjection = ArchitectureProjectionGraph.extend({
      architectureId,
      name: zod_1.z.string().min(1).max(240),
      truncated: zod_1.z.boolean(),
      diagnostics: zod_1.z.array(zod_1.z.object({
        code: zod_1.z.string().min(1).max(120),
        message: zod_1.z.string().min(1).max(512)
      }).strict()).max(100)
    }).strict();
  }
});

// packages/schema/dist/repository-registry.js
var require_repository_registry = __commonJS({
  "packages/schema/dist/repository-registry.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RegistryPublicSummary = exports2.RegisteredProjectSummary = exports2.SourceRepositorySummary = exports2.RegistryMigrationReport = exports2.RepositoryDiscovery = exports2.RepositoryDiscoveryCandidate = exports2.WorkspaceRegistryV2 = exports2.LegacyProjectAlias = exports2.RegisteredProjectRecord = exports2.SourceRepositoryRecord = exports2.RegistryDiagnostic = exports2.RegistryGeneration = exports2.SourceRepositoryId = exports2.ProjectId = void 0;
    var zod_1 = require("zod");
    var locator = zod_1.z.string().min(1).max(4096);
    exports2.ProjectId = zod_1.z.string().min(1).max(240).brand();
    exports2.SourceRepositoryId = zod_1.z.string().regex(/^repo_[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/).brand();
    exports2.RegistryGeneration = zod_1.z.number().int().nonnegative();
    exports2.RegistryDiagnostic = zod_1.z.object({
      code: zod_1.z.string().min(1).max(120),
      message: zod_1.z.string().min(1).max(512)
    }).strict();
    exports2.SourceRepositoryRecord = zod_1.z.object({
      sourceRepositoryId: exports2.SourceRepositoryId,
      displayName: zod_1.z.string().min(1).max(240),
      rootLocator: locator,
      canonicalRootFingerprint: zod_1.z.string().regex(/^[a-f0-9]{64}$/),
      remote: zod_1.z.object({
        fetchUrl: zod_1.z.string().min(1).max(2048),
        provider: zod_1.z.literal("github").optional(),
        githubRepositoryId: zod_1.z.number().int().positive().optional()
      }).strict().nullable(),
      recovery: zod_1.z.discriminatedUnion("kind", [
        zod_1.z.object({
          kind: zod_1.z.literal("reclone"),
          head: zod_1.z.string().min(1).max(128),
          branch: zod_1.z.string().min(1).max(240).optional()
        }).strict(),
        zod_1.z.object({ kind: zod_1.z.literal("relink") }).strict()
      ]),
      status: zod_1.z.enum(["ready", "missing", "conflict"]),
      revision: zod_1.z.number().int().nonnegative()
    }).strict();
    exports2.RegisteredProjectRecord = zod_1.z.object({
      projectId: exports2.ProjectId,
      sourceKind: zod_1.z.enum(["repository", "managed", "standalone"]),
      sourceRepositoryId: exports2.SourceRepositoryId.nullable(),
      configLocator: locator,
      projectRootLocator: zod_1.z.string().max(4096),
      configFormat: zod_1.z.enum(["yaml", "json"]),
      configFingerprint: zod_1.z.string().regex(/^[a-f0-9]{64}$/),
      storeKey: locator,
      identitySource: zod_1.z.enum(["new", "legacy", "config"]),
      status: zod_1.z.enum(["ready", "missing", "conflict", "invalid"]),
      revision: zod_1.z.number().int().nonnegative()
    }).strict();
    exports2.LegacyProjectAlias = zod_1.z.object({
      alias: zod_1.z.string().min(1).max(4096),
      projectId: exports2.ProjectId,
      kind: zod_1.z.enum(["path", "slug"]),
      expiresAfterRelease: zod_1.z.string().min(1).max(120).nullable()
    }).strict();
    exports2.WorkspaceRegistryV2 = zod_1.z.object({
      schemaVersion: zod_1.z.literal(2),
      workspaceId: zod_1.z.string().min(1).max(240),
      generation: exports2.RegistryGeneration,
      sourceRepositories: zod_1.z.array(exports2.SourceRepositoryRecord),
      projects: zod_1.z.array(exports2.RegisteredProjectRecord),
      legacyAliases: zod_1.z.array(exports2.LegacyProjectAlias)
    }).strict();
    exports2.RepositoryDiscoveryCandidate = zod_1.z.object({
      candidateKey: zod_1.z.string().regex(/^[a-f0-9]{64}$/),
      configLocator: locator,
      projectRootLocator: zod_1.z.string().max(4096),
      configFormat: zod_1.z.enum(["yaml", "json"]),
      configFingerprint: zod_1.z.string().regex(/^[a-f0-9]{64}$/),
      displayName: zod_1.z.string().min(1).max(240),
      status: zod_1.z.enum(["valid", "invalid", "conflict"]),
      diagnostics: zod_1.z.array(exports2.RegistryDiagnostic).max(100)
    }).strict();
    exports2.RepositoryDiscovery = zod_1.z.object({
      discoveryId: zod_1.z.string().min(1).max(240),
      expectedRegistryGeneration: exports2.RegistryGeneration,
      complete: zod_1.z.boolean(),
      expiresAt: zod_1.z.number().int().nonnegative(),
      counts: zod_1.z.object({
        visitedDirectories: zod_1.z.number().int().nonnegative().max(1e4),
        candidates: zod_1.z.number().int().nonnegative().max(1e3)
      }).strict(),
      candidates: zod_1.z.array(exports2.RepositoryDiscoveryCandidate).max(1e3),
      diagnostics: zod_1.z.array(exports2.RegistryDiagnostic).max(100)
    }).strict();
    exports2.RegistryMigrationReport = zod_1.z.object({
      expectedRegistryGeneration: exports2.RegistryGeneration,
      reportHash: zod_1.z.string().regex(/^[a-f0-9]{64}$/),
      blocked: zod_1.z.boolean(),
      recordActions: zod_1.z.array(zod_1.z.discriminatedUnion("action", [
        zod_1.z.object({
          action: zod_1.z.literal("preserve_id"),
          configLocator: locator,
          currentProjectId: exports2.ProjectId,
          projectId: exports2.ProjectId
        }).strict(),
        zod_1.z.object({ action: zod_1.z.literal("assign_id"), configLocator: locator }).strict(),
        zod_1.z.object({ action: zod_1.z.literal("conflict"), configLocator: locator, currentProjectId: exports2.ProjectId.optional() }).strict()
      ])),
      storeMoves: zod_1.z.array(zod_1.z.object({ projectId: exports2.ProjectId, from: locator, to: locator }).strict()),
      collisionGroups: zod_1.z.array(zod_1.z.object({ legacyId: zod_1.z.string().min(1).max(240), configLocators: zod_1.z.array(locator).min(2) }).strict()),
      linkedRecordCounts: zod_1.z.record(zod_1.z.number().int().nonnegative()),
      diagnostics: zod_1.z.array(exports2.RegistryDiagnostic).max(100)
    }).strict();
    exports2.SourceRepositorySummary = exports2.SourceRepositoryRecord.pick({
      sourceRepositoryId: true,
      displayName: true,
      rootLocator: true,
      status: true,
      revision: true
    }).extend({ projectCount: zod_1.z.number().int().nonnegative() }).strict();
    exports2.RegisteredProjectSummary = exports2.RegisteredProjectRecord.pick({
      projectId: true,
      sourceKind: true,
      sourceRepositoryId: true,
      configLocator: true,
      projectRootLocator: true,
      status: true,
      revision: true
    }).extend({ displayName: zod_1.z.string().min(1).max(240), workflowCount: zod_1.z.number().int().nonnegative() }).strict();
    exports2.RegistryPublicSummary = zod_1.z.object({
      workspaceId: zod_1.z.string().min(1).max(240),
      generation: exports2.RegistryGeneration,
      sourceRepositories: zod_1.z.array(exports2.SourceRepositorySummary),
      projects: zod_1.z.array(exports2.RegisteredProjectSummary)
    }).strict();
  }
});

// packages/schema/dist/community-publications.js
var require_community_publications = __commonJS({
  "packages/schema/dist/community-publications.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.publicationTransitions = exports2.publicationTopicsSchema = exports2.publicationTopicSchema = exports2.publicationModerationPageSchema = exports2.publicationModerationItemSchema = exports2.communityKnowledgeSearchResponseSchema = exports2.communityKnowledgeMatchSchema = exports2.communityKnowledgeSearchRequestSchema = exports2.publicationRatingSchema = exports2.publicationReportSchema = exports2.publicationModerateSchema = exports2.publicationArchiveSchema = exports2.publicationSubmitSchema = exports2.publicationRevisionCreateSchema = exports2.publicationUpdateSchema = exports2.publicationCreateSchema = exports2.publicationCommentCreateSchema = exports2.publicationCommentListQuerySchema = exports2.publicationCommentPageSchema = exports2.publicationCommentSchema = exports2.publicationPageSchema = exports2.publicationMineListQuerySchema = exports2.publicationListQuerySchema = exports2.publicationDetailSchema = exports2.publicationSummarySchema = exports2.publicationRevisionSchema = exports2.publicationLinkSchema = exports2.cslCitationSchema = exports2.publicationAuthorSchema = exports2.creatorProfileSchema = exports2.creatorHandleSchema = exports2.publicationSlugSchema = exports2.publicationModerationDecisionSchema = exports2.publicationOrderSchema = exports2.publicationSortSchema = exports2.publicationStatusSchema = exports2.publicationKindSchema = void 0;
    var zod_1 = require("zod");
    var collaboration_1 = require_collaboration();
    var httpUrlSchema = zod_1.z.string().url().max(2048).refine((value) => /^https?:\/\//i.test(value), "URL must use http or https");
    exports2.publicationKindSchema = zod_1.z.enum(["guide", "blog", "paper"]);
    exports2.publicationStatusSchema = zod_1.z.enum([
      "draft",
      "in_review",
      "changes_requested",
      "published",
      "rejected",
      "archived"
    ]);
    exports2.publicationSortSchema = zod_1.z.enum(["published", "updated", "title", "rating"]);
    exports2.publicationOrderSchema = zod_1.z.enum(["asc", "desc"]);
    exports2.publicationModerationDecisionSchema = zod_1.z.enum(["request_changes", "reject", "publish"]);
    exports2.publicationSlugSchema = zod_1.z.string().trim().min(3).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    exports2.creatorHandleSchema = zod_1.z.string().trim().min(3).max(39).regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/);
    exports2.creatorProfileSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      userId: zod_1.z.string().min(1).max(128),
      handle: exports2.creatorHandleSchema,
      displayName: zod_1.z.string().trim().min(1).max(80),
      bio: zod_1.z.string().max(500).nullable(),
      avatarUrl: httpUrlSchema.nullable(),
      version: collaboration_1.revisionSchema,
      createdAt: zod_1.z.number().int().nonnegative(),
      updatedAt: zod_1.z.number().int().nonnegative()
    }).strict();
    exports2.publicationAuthorSchema = zod_1.z.object({
      name: zod_1.z.string().trim().min(1).max(160),
      orcid: zod_1.z.string().regex(/^https:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/).optional(),
      affiliation: zod_1.z.string().trim().max(240).optional()
    }).strict();
    var cslNameSchema = zod_1.z.object({
      family: zod_1.z.string().max(160).optional(),
      given: zod_1.z.string().max(160).optional(),
      literal: zod_1.z.string().max(320).optional()
    }).strict();
    var cslDateSchema = zod_1.z.object({
      "date-parts": zod_1.z.array(zod_1.z.array(zod_1.z.number().int().nonnegative()).min(1).max(3)).min(1).max(2)
    }).strict();
    exports2.cslCitationSchema = zod_1.z.object({
      id: zod_1.z.string().min(1).max(200),
      type: zod_1.z.string().min(1).max(80),
      title: zod_1.z.string().min(1).max(500),
      author: zod_1.z.array(cslNameSchema).max(100).optional(),
      issued: cslDateSchema.optional(),
      DOI: zod_1.z.string().max(200).optional(),
      URL: httpUrlSchema.optional(),
      publisher: zod_1.z.string().max(240).optional(),
      "container-title": zod_1.z.string().max(240).optional()
    }).strict();
    exports2.publicationLinkSchema = zod_1.z.discriminatedUnion("kind", [
      zod_1.z.object({ kind: zod_1.z.literal("api_operation"), operationId: zod_1.z.string().min(1).max(160) }).strict(),
      zod_1.z.object({ kind: zod_1.z.literal("official_document"), path: zod_1.z.string().startsWith("/").max(1024) }).strict(),
      zod_1.z.object({ kind: zod_1.z.literal("publication"), publicationId: collaboration_1.entityIdSchema }).strict(),
      zod_1.z.object({ kind: zod_1.z.literal("plugin"), pluginId: zod_1.z.string().min(1).max(160) }).strict(),
      zod_1.z.object({ kind: zod_1.z.literal("workflow_template"), templateId: collaboration_1.entityIdSchema }).strict(),
      zod_1.z.object({ kind: zod_1.z.literal("external"), url: httpUrlSchema }).strict()
    ]);
    exports2.publicationRevisionSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      publicationId: collaboration_1.entityIdSchema,
      documentId: collaboration_1.entityIdSchema,
      documentRevision: collaboration_1.entityIdSchema,
      checksum: collaboration_1.sha256Schema,
      createdBy: zod_1.z.string().min(1).max(128),
      createdAt: zod_1.z.number().int().nonnegative()
    }).strict();
    exports2.publicationSummarySchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      slug: exports2.publicationSlugSchema,
      kind: exports2.publicationKindSchema,
      status: exports2.publicationStatusSchema,
      title: zod_1.z.string().trim().min(1).max(200),
      summary: zod_1.z.string().trim().min(1).max(500),
      license: zod_1.z.string().trim().min(1).max(80),
      creator: exports2.creatorProfileSchema,
      topics: zod_1.z.array(zod_1.z.string().min(1).max(80)).max(20),
      assistantEligible: zod_1.z.boolean(),
      version: collaboration_1.revisionSchema,
      publishedAt: zod_1.z.number().int().nonnegative().nullable(),
      updatedAt: zod_1.z.number().int().nonnegative(),
      hasWorkflow: zod_1.z.boolean(),
      viewCount: zod_1.z.number().int().nonnegative(),
      commentCount: zod_1.z.number().int().nonnegative(),
      ratingCount: zod_1.z.number().int().nonnegative(),
      ratingAverage: zod_1.z.number().min(1).max(5).nullable()
    }).strict();
    exports2.publicationDetailSchema = exports2.publicationSummarySchema.extend({
      abstract: zod_1.z.string().max(4e3).nullable(),
      content: zod_1.z.string().max(2 * 1024 * 1024),
      revision: exports2.publicationRevisionSchema,
      authors: zod_1.z.array(exports2.publicationAuthorSchema).max(100),
      citations: zod_1.z.array(exports2.cslCitationSchema).max(500),
      links: zod_1.z.array(exports2.publicationLinkSchema).max(100)
    }).strict();
    exports2.publicationListQuerySchema = zod_1.z.object({
      q: zod_1.z.string().trim().min(1).max(200).optional(),
      kinds: zod_1.z.array(exports2.publicationKindSchema).min(1).max(3).optional(),
      topics: zod_1.z.array(zod_1.z.string().trim().min(1).max(80)).min(1).max(20).optional(),
      creator: exports2.creatorHandleSchema.optional(),
      linkedOperationId: zod_1.z.string().trim().min(1).max(160).optional(),
      sort: exports2.publicationSortSchema.default("published"),
      order: exports2.publicationOrderSchema.default("desc"),
      cursor: collaboration_1.opaqueCursorSchema.optional(),
      limit: zod_1.z.number().int().min(1).max(100).default(24)
    }).strict();
    exports2.publicationMineListQuerySchema = zod_1.z.object({
      q: zod_1.z.string().trim().min(1).max(200).optional(),
      statuses: zod_1.z.array(exports2.publicationStatusSchema).min(1).max(6).optional(),
      category: zod_1.z.enum(["post", "workflow"]).optional(),
      cursor: collaboration_1.opaqueCursorSchema.optional(),
      limit: zod_1.z.number().int().min(1).max(100).default(24)
    }).strict();
    exports2.publicationPageSchema = zod_1.z.object({
      items: zod_1.z.array(exports2.publicationSummarySchema),
      nextCursor: collaboration_1.opaqueCursorSchema.nullable()
    }).strict();
    exports2.publicationCommentSchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      publicationId: collaboration_1.entityIdSchema,
      body: zod_1.z.string().trim().min(1).max(2e3),
      author: zod_1.z.object({
        handle: exports2.creatorHandleSchema.nullable(),
        avatarUrl: zod_1.z.string().nullable().optional(),
        displayName: zod_1.z.string().trim().min(1).max(80)
      }).strict(),
      createdAt: zod_1.z.number().int().nonnegative()
    }).strict();
    exports2.publicationCommentPageSchema = zod_1.z.object({
      items: zod_1.z.array(exports2.publicationCommentSchema),
      nextCursor: collaboration_1.opaqueCursorSchema.nullable()
    }).strict();
    exports2.publicationCommentListQuerySchema = zod_1.z.object({
      cursor: collaboration_1.opaqueCursorSchema.optional(),
      limit: zod_1.z.number().int().min(1).max(100).default(50)
    }).strict();
    exports2.publicationCommentCreateSchema = zod_1.z.object({
      body: zod_1.z.string().trim().min(1).max(2e3),
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict();
    var publicationMetadataSchema = zod_1.z.object({
      slug: exports2.publicationSlugSchema,
      kind: exports2.publicationKindSchema,
      title: zod_1.z.string().trim().min(1).max(200),
      summary: zod_1.z.string().trim().min(1).max(500),
      abstract: zod_1.z.string().trim().max(4e3).nullable().optional(),
      license: zod_1.z.string().trim().min(1).max(80),
      topics: zod_1.z.array(zod_1.z.string().trim().min(1).max(80)).max(20).default([]),
      authors: zod_1.z.array(exports2.publicationAuthorSchema).max(100).default([]),
      citations: zod_1.z.array(exports2.cslCitationSchema).max(500).default([]),
      links: zod_1.z.array(exports2.publicationLinkSchema).max(100).default([]),
      assistantEligible: zod_1.z.boolean().default(false)
    }).strict();
    exports2.publicationCreateSchema = publicationMetadataSchema.extend({
      documentId: collaboration_1.entityIdSchema,
      documentRevision: collaboration_1.entityIdSchema,
      creator: zod_1.z.object({
        handle: exports2.creatorHandleSchema,
        displayName: zod_1.z.string().trim().min(1).max(80),
        bio: zod_1.z.string().max(500).nullable().optional()
      }).strict(),
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict();
    exports2.publicationUpdateSchema = publicationMetadataSchema.partial().extend({
      expectedVersion: collaboration_1.revisionSchema
    }).strict().refine((value) => Object.keys(value).length > 1, "at least one field must be updated");
    exports2.publicationRevisionCreateSchema = zod_1.z.object({
      documentId: collaboration_1.entityIdSchema,
      documentRevision: collaboration_1.entityIdSchema,
      expectedVersion: collaboration_1.revisionSchema,
      clientMutationId: collaboration_1.idempotencyKeySchema
    }).strict();
    exports2.publicationSubmitSchema = zod_1.z.object({ expectedVersion: collaboration_1.revisionSchema }).strict();
    exports2.publicationArchiveSchema = zod_1.z.object({ expectedVersion: collaboration_1.revisionSchema }).strict();
    exports2.publicationModerateSchema = zod_1.z.object({
      decision: exports2.publicationModerationDecisionSchema,
      note: zod_1.z.string().trim().min(1).max(2e3),
      expectedVersion: collaboration_1.revisionSchema
    }).strict();
    exports2.publicationReportSchema = zod_1.z.object({
      reason: zod_1.z.string().trim().min(1).max(1e3)
    }).strict();
    exports2.publicationRatingSchema = zod_1.z.object({ rating: zod_1.z.number().int().min(1).max(5) }).strict();
    exports2.communityKnowledgeSearchRequestSchema = zod_1.z.object({
      query: zod_1.z.string().trim().min(1).max(2e3),
      topK: zod_1.z.number().int().min(1).max(8).default(6)
    }).strict();
    exports2.communityKnowledgeMatchSchema = zod_1.z.object({
      id: zod_1.z.string().regex(/^[a-f0-9]{64}$/),
      score: zod_1.z.number().finite(),
      publicationId: collaboration_1.entityIdSchema,
      slug: exports2.publicationSlugSchema,
      title: zod_1.z.string().min(1).max(200),
      creator: exports2.creatorHandleSchema,
      content: zod_1.z.string().min(1).max(2e3),
      sourceLabel: zod_1.z.literal("Community-authored, moderated publication"),
      canonical: zod_1.z.literal(false)
    }).strict();
    exports2.communityKnowledgeSearchResponseSchema = zod_1.z.object({
      source: zod_1.z.literal("community"),
      model: zod_1.z.literal("@cf/baai/bge-base-en-v1.5"),
      matches: zod_1.z.array(exports2.communityKnowledgeMatchSchema).max(8)
    }).strict();
    exports2.publicationModerationItemSchema = exports2.publicationSummarySchema.extend({
      submittedAt: zod_1.z.number().int().nonnegative()
    }).strict();
    exports2.publicationModerationPageSchema = zod_1.z.object({
      items: zod_1.z.array(exports2.publicationModerationItemSchema),
      nextCursor: collaboration_1.opaqueCursorSchema.nullable()
    }).strict();
    exports2.publicationTopicSchema = zod_1.z.object({ slug: exports2.publicationSlugSchema, name: zod_1.z.string().min(1).max(80), count: zod_1.z.number().int().nonnegative() }).strict();
    exports2.publicationTopicsSchema = zod_1.z.array(exports2.publicationTopicSchema).max(500);
    exports2.publicationTransitions = {
      draft: ["in_review", "archived"],
      in_review: ["changes_requested", "published", "rejected", "archived"],
      changes_requested: ["in_review", "archived"],
      published: ["archived"],
      rejected: ["archived"],
      archived: []
    };
  }
});

// packages/schema/dist/community-media.js
var require_community_media = __commonJS({
  "packages/schema/dist/community-media.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.communityMediaBlockSchema = exports2.communityMediaItemSchema = exports2.communityMediaUploadSchema = void 0;
    exports2.parseCommunityMediaBlock = parseCommunityMediaBlock;
    exports2.communityMediaBlocks = communityMediaBlocks;
    exports2.serializeCommunityMediaBlock = serializeCommunityMediaBlock;
    var zod_1 = require("zod");
    var constants_js_1 = require_constants();
    exports2.communityMediaUploadSchema = zod_1.z.object({
      contentType: zod_1.z.enum(constants_js_1.COMMUNITY_MEDIA_TYPES),
      data: zod_1.z.string().min(4).max(constants_js_1.COMMUNITY_MEDIA_BODY_BYTES).regex(/^[A-Za-z0-9+/]*={0,2}$/).refine((value) => value.length % 4 === 0, "Invalid base64 length")
    }).strict();
    exports2.communityMediaItemSchema = zod_1.z.object({
      id: zod_1.z.string().uuid(),
      kind: zod_1.z.enum(["image", "video"]),
      title: zod_1.z.string().max(160).optional(),
      alt: zod_1.z.string().max(500),
      caption: zod_1.z.string().max(1e3)
    }).strict();
    exports2.communityMediaBlockSchema = zod_1.z.object({
      layout: zod_1.z.enum(["single", "carousel"]),
      items: zod_1.z.array(exports2.communityMediaItemSchema).min(1).max(20)
    }).strict().refine((block) => block.layout === "carousel" || block.items.length === 1, "single media blocks require one item");
    function parseCommunityMediaBlock(value) {
      try {
        return exports2.communityMediaBlockSchema.parse(JSON.parse(value));
      } catch {
        return null;
      }
    }
    function communityMediaBlocks(content) {
      return [...content.matchAll(/^```octonode-media\r?\n([\s\S]*?)^```[ \t]*$/gm)].map((match) => {
        const block = parseCommunityMediaBlock(match[1]);
        if (!block)
          throw new Error("Invalid community media block");
        return block;
      });
    }
    function serializeCommunityMediaBlock(block) {
      return `

\`\`\`octonode-media
${JSON.stringify(exports2.communityMediaBlockSchema.parse(block))}
\`\`\`

`;
    }
  }
});

// packages/schema/dist/community-media.types.js
var require_community_media_types = __commonJS({
  "packages/schema/dist/community-media.types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// packages/schema/dist/workflow-templates.js
var require_workflow_templates = __commonJS({
  "packages/schema/dist/workflow-templates.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.workflowTemplateDetailSchema = exports2.workflowTemplateSummarySchema = exports2.workflowTemplateListQuerySchema = exports2.workflowTemplateCreateSchema = exports2.workflowTemplateSnapshotSchema = exports2.workflowTemplatePermissionSchema = exports2.workflowTemplatePlaceholderSchema = exports2.workflowTemplateEdgeSchema = exports2.workflowTemplateNodeSchema = exports2.workflowTemplateDefinitionSchema = void 0;
    exports2.readWorkflowCodeReference = readWorkflowCodeReference;
    exports2.createWorkflowTemplateSnapshot = createWorkflowTemplateSnapshot;
    exports2.verifyWorkflowTemplateSnapshot = verifyWorkflowTemplateSnapshot;
    var zod_1 = require("zod");
    var community_publications_1 = require_community_publications();
    var collaboration_1 = require_collaboration();
    var publicJsonSchema = zod_1.z.lazy(() => zod_1.z.union([
      zod_1.z.null(),
      zod_1.z.boolean(),
      zod_1.z.number().finite(),
      zod_1.z.string().max(1e4),
      zod_1.z.array(publicJsonSchema).max(1e3),
      zod_1.z.record(zod_1.z.string().min(1).max(120), publicJsonSchema)
    ]));
    var safeId = zod_1.z.string().min(1).max(160).regex(/^[A-Za-z0-9][A-Za-z0-9._/-]*$/);
    exports2.workflowTemplateDefinitionSchema = zod_1.z.discriminatedUnion("kind", [
      zod_1.z.object({ kind: zod_1.z.literal("native"), catalogId: safeId }).strict(),
      zod_1.z.object({ kind: zod_1.z.literal("plugin"), pluginId: safeId, nodeId: safeId, version: zod_1.z.string().min(1).max(80) }).strict()
    ]);
    exports2.workflowTemplateNodeSchema = zod_1.z.object({
      instanceId: safeId,
      definition: exports2.workflowTemplateDefinitionSchema,
      params: zod_1.z.record(zod_1.z.string().min(1).max(120), publicJsonSchema).optional(),
      position: zod_1.z.object({ x: zod_1.z.number().finite(), y: zod_1.z.number().finite() }).strict().optional()
    }).strict();
    exports2.workflowTemplateEdgeSchema = zod_1.z.object({
      from: zod_1.z.object({ node: safeId, output: safeId.optional() }).strict(),
      to: zod_1.z.object({ node: safeId, input: safeId.optional() }).strict(),
      kind: zod_1.z.enum(["data", "dependency", "control"]).optional()
    }).strict();
    exports2.workflowTemplatePlaceholderSchema = zod_1.z.object({
      key: safeId,
      label: zod_1.z.string().min(1).max(120),
      description: zod_1.z.string().max(500),
      required: zod_1.z.boolean(),
      schema: publicJsonSchema
    }).strict();
    exports2.workflowTemplatePermissionSchema = zod_1.z.object({
      id: safeId,
      label: zod_1.z.string().min(1).max(120),
      reason: zod_1.z.string().min(1).max(500)
    }).strict();
    var workflowTemplatePayloadBaseSchema = zod_1.z.object({
      schemaVersion: zod_1.z.literal(1),
      sourceWorkflowRevision: collaboration_1.sha256Schema,
      title: zod_1.z.string().trim().min(1).max(200),
      description: zod_1.z.string().trim().min(1).max(1e3),
      graph: zod_1.z.object({
        nodes: zod_1.z.array(exports2.workflowTemplateNodeSchema).min(1).max(500),
        edges: zod_1.z.array(exports2.workflowTemplateEdgeSchema).max(2e3),
        inputs: publicJsonSchema.optional()
      }).strict(),
      dependencies: zod_1.z.object({
        plugins: zod_1.z.array(zod_1.z.object({ id: safeId, version: zod_1.z.string().min(1).max(80) }).strict()).max(100),
        runtimes: zod_1.z.array(zod_1.z.string().min(1).max(80)).max(20)
      }).strict(),
      placeholders: zod_1.z.array(exports2.workflowTemplatePlaceholderSchema).max(100),
      permissions: zod_1.z.array(exports2.workflowTemplatePermissionSchema).max(100),
      compatibility: zod_1.z.object({ octonode: zod_1.z.string().min(1).max(80), notes: zod_1.z.string().max(1e3).optional() }).strict(),
      creator: zod_1.z.object({ handle: community_publications_1.creatorHandleSchema, displayName: zod_1.z.string().min(1).max(80) }).strict(),
      license: zod_1.z.string().min(1).max(80)
    }).strict();
    var workflowTemplatePayloadSchema = workflowTemplatePayloadBaseSchema.superRefine((value, context) => scanSensitive(value, context));
    exports2.workflowTemplateSnapshotSchema = workflowTemplatePayloadBaseSchema.extend({ digest: collaboration_1.sha256Schema }).strict().superRefine((value, context) => scanSensitive(value, context));
    function readWorkflowCodeReference(code) {
      const match = /^\/\/ octonode-community: ([a-z0-9-]+) ([a-f0-9]{64})\r?\n/.exec(code);
      if (!match || !community_publications_1.publicationSlugSchema.safeParse(match[1]).success)
        return null;
      return { slug: match[1], digest: match[2] };
    }
    exports2.workflowTemplateCreateSchema = zod_1.z.object({
      publicationId: collaboration_1.entityIdSchema,
      slug: community_publications_1.publicationSlugSchema,
      useCase: zod_1.z.string().trim().min(1).max(120),
      difficulty: zod_1.z.enum(["beginner", "intermediate", "advanced"]),
      triggers: zod_1.z.array(zod_1.z.string().min(1).max(80)).max(20),
      services: zod_1.z.array(zod_1.z.string().min(1).max(80)).max(20),
      snapshot: exports2.workflowTemplateSnapshotSchema,
      clientMutationId: zod_1.z.string().min(1).max(128)
    }).strict();
    exports2.workflowTemplateListQuerySchema = zod_1.z.object({
      q: zod_1.z.string().trim().min(1).max(200).optional(),
      useCase: zod_1.z.string().max(120).optional(),
      node: safeId.optional(),
      plugin: safeId.optional(),
      runtime: zod_1.z.string().max(80).optional(),
      difficulty: zod_1.z.enum(["beginner", "intermediate", "advanced"]).optional(),
      trigger: zod_1.z.string().max(80).optional(),
      service: zod_1.z.string().max(80).optional(),
      creator: community_publications_1.creatorHandleSchema.optional(),
      sort: zod_1.z.enum(["published", "updated", "title"]).default("published"),
      order: zod_1.z.enum(["asc", "desc"]).default("desc"),
      cursor: zod_1.z.string().max(512).optional(),
      limit: zod_1.z.number().int().min(1).max(100).default(24)
    }).strict();
    exports2.workflowTemplateSummarySchema = zod_1.z.object({
      id: collaboration_1.entityIdSchema,
      publicationId: collaboration_1.entityIdSchema,
      slug: community_publications_1.publicationSlugSchema,
      title: zod_1.z.string(),
      description: zod_1.z.string(),
      useCase: zod_1.z.string(),
      difficulty: zod_1.z.enum(["beginner", "intermediate", "advanced"]),
      creator: community_publications_1.creatorHandleSchema,
      nodes: zod_1.z.array(safeId),
      plugins: zod_1.z.array(safeId),
      runtimes: zod_1.z.array(zod_1.z.string()),
      triggers: zod_1.z.array(zod_1.z.string()),
      services: zod_1.z.array(zod_1.z.string()),
      license: zod_1.z.string(),
      digest: collaboration_1.sha256Schema,
      publishedAt: zod_1.z.number().int().nonnegative().nullable(),
      updatedAt: zod_1.z.number().int().nonnegative()
    }).strict();
    exports2.workflowTemplateDetailSchema = exports2.workflowTemplateSummarySchema.extend({ snapshot: exports2.workflowTemplateSnapshotSchema }).strict();
    async function createWorkflowTemplateSnapshot(payload) {
      const parsed = workflowTemplatePayloadSchema.parse(payload);
      return exports2.workflowTemplateSnapshotSchema.parse({ ...parsed, digest: await digest(canonicalJson(parsed)) });
    }
    async function verifyWorkflowTemplateSnapshot(snapshot) {
      const parsed = exports2.workflowTemplateSnapshotSchema.parse(snapshot);
      const { digest: expected, ...payload } = parsed;
      return expected === await digest(canonicalJson(payload));
    }
    function scanSensitive(value, context) {
      let fields = 0;
      const visit2 = (current, path, depth) => {
        if (depth > 12 || ++fields > 1e4) {
          context.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path,
            message: "workflow snapshot exceeds safe structural bounds"
          });
          return;
        }
        if (typeof current === "string" && sensitiveValue(current)) {
          context.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path,
            message: "workflow snapshot contains a private or secret value"
          });
        } else if (Array.isArray(current))
          current.forEach((item, index) => visit2(item, [...path, index], depth + 1));
        else if (current && typeof current === "object")
          for (const [key, item] of Object.entries(current)) {
            if (/(?:secret|token|password|credential|api[_-]?key|environment|env|user[_-]?id|project[_-]?id|run[_-]?(?:id|history)|execution|history|private[_-]?url)/i.test(key)) {
              context.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: [...path, key],
                message: "workflow snapshot contains a forbidden field"
              });
            } else
              visit2(item, [...path, key], depth + 1);
          }
      };
      visit2(value, [], 0);
    }
    function sensitiveValue(value) {
      return /(?:octo_agent_|sk-[A-Za-z0-9]{12}|-----BEGIN [A-Z ]*PRIVATE KEY-----|process\.env|\$\{[A-Z_][A-Z0-9_]*\})/.test(value) || /https?:\/\/(?:[^/@\s]+:[^/@\s]+@|localhost(?::\d+)?(?:\/|$)|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)/i.test(value) || /^(?:\/Users\/|\/home\/|[A-Za-z]:\\Users\\)/.test(value);
    }
    function canonicalJson(value) {
      if (Array.isArray(value))
        return `[${value.map(canonicalJson).join(",")}]`;
      if (value && typeof value === "object")
        return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
      return JSON.stringify(value);
    }
    async function digest(value) {
      const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
      return [...new Uint8Array(bytes)].map((item) => item.toString(16).padStart(2, "0")).join("");
    }
  }
});

// packages/schema/dist/json-schema-definitions.js
var require_json_schema_definitions = __commonJS({
  "packages/schema/dist/json-schema-definitions.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WORKFLOW_SCHEMA = exports2.NODE_SCHEMA = void 0;
    exports2.NODE_SCHEMA = {
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
    exports2.WORKFLOW_SCHEMA = {
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
            checksum: { type: "string" }
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
  }
});

// packages/schema/dist/json-schema.js
var require_json_schema = __commonJS({
  "packages/schema/dist/json-schema.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.schemaVersion = schemaVersion;
    exports2.octonodeJsonSchema = octonodeJsonSchema;
    var json_schema_definitions_1 = require_json_schema_definitions();
    var octonode_config_1 = require_octonode_config();
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
        workflows: { type: "array", items: { $ref: "#/definitions/workflow" } }
      },
      definitions: {
        node: json_schema_definitions_1.NODE_SCHEMA,
        workflow: json_schema_definitions_1.WORKFLOW_SCHEMA
      }
    };
    function schemaVersion() {
      const parts = octonode_config_1.CONFIG_API_VERSION.split("/");
      return parts[parts.length - 1] || "v1";
    }
    function octonodeJsonSchema() {
      return {
        $schema: "http://json-schema.org/draft-07/schema#",
        $id: `https://octonode.dev/schema/${schemaVersion()}/octonode.schema.json`,
        ...SCHEMA
      };
    }
  }
});

// node_modules/re2js/build/index.cjs
var require_build = __commonJS({
  "node_modules/re2js/build/index.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
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
    for (let i = 0, b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-"; i < 64; i++) B64_MAP[b.charCodeAt(i)] = i;
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
          const m = lo + Math.floor((hi - lo) / 2);
          const rlo = ranges.getLo(m);
          const rhi = ranges.getHi(m);
          if (rlo <= r && r <= rhi) {
            const stride = ranges.getStride(m);
            return (r - rlo) % stride === 0;
          }
          if (r < rlo) hi = m;
          else lo = m + 1;
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
          let out = [], p = 0;
          for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            if (c < 128) out[p++] = c;
            else if (c < 2048) {
              out[p++] = c >> 6 | 192;
              out[p++] = c & 63 | 128;
            } else if ((c & 64512) === Unicode.MIN_HIGH_SURROGATE && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === Unicode.MIN_LOW_SURROGATE) {
              c = Unicode.MIN_SUPPLEMENTARY_CODE_POINT + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
              out[p++] = c >> 18 | 240;
              out[p++] = c >> 12 & 63 | 128;
              out[p++] = c >> 6 & 63 | 128;
              out[p++] = c & 63 | 128;
            } else {
              out[p++] = c >> 12 | 224;
              out[p++] = c >> 6 & 63 | 128;
              out[p++] = c & 63 | 128;
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
      constructor(bytes, start = 0, end = bytes.length) {
        super();
        this.bytes = bytes;
        this.start = start;
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
          let start = pos - 1;
          r1 = this.bytes[start--];
          if (r1 >= 128) {
            let lim = pos - 4;
            if (lim < this.start) lim = this.start;
            while (start >= lim && (this.bytes[start] & 192) === 128) start--;
            if (start < this.start) start = this.start;
            r1 = this.step(start - this.start) >> 3;
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
      constructor(charSequence, start = 0, end = charSequence.length) {
        super();
        this.charSequence = charSequence;
        this.start = start;
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
      static fromUTF8(bytes, start = 0, end = bytes.length) {
        return new MachineUTF8Input(bytes, start, end);
      }
      static fromUTF16(charSequence, start = 0, end = charSequence.length) {
        return new MachineUTF16Input(charSequence, start, end);
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
        const start = this.start(group);
        const end = this.end(group);
        if (start < 0 && end < 0) return null;
        return this.substring(start, end);
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
      find(start = null) {
        if (start !== null) {
          if (start < 0 || start > this.matcherInputLength) throw new RE2JSGroupException(`start index out of bounds: ${start}`);
          this.reset();
          return this.genMatch(start, 0);
        }
        start = 0;
        if (this.hasMatch) {
          start = this.groups[1];
          if (this.groups[0] === this.groups[1]) {
            const r = (this.matcherInput.isUTF16Encoding() ? MachineInput.fromUTF16(this.matcherInput.asCharSequence(), 0, this.matcherInputLength) : MachineInput.fromUTF8(this.matcherInput.asBytes(), 0, this.matcherInputLength)).step(start);
            if (r < 0) start++;
            else start += r & 7;
          }
        }
        return this.genMatch(start, RE2Flags.UNANCHORED);
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
      substring(start, end) {
        if (this.matcherInput.isUTF8Encoding()) return Utils.utf8ByteArrayToString(this.matcherInput.asBytes().slice(start, end));
        return this.matcherInput.asCharSequence().substring(start, end).toString();
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
        const m = replacement.length;
        let i = 0;
        while (i < m) {
          const cCode = replacement.codePointAt(i);
          if (cCode === Codepoint.CODES.get("\\")) {
            if (last < i) res += replacement.substring(last, i);
            i++;
            if (i >= m) throw new RE2JSGroupException("character to be escaped is missing");
            last = i;
            i++;
            continue;
          }
          if (cCode === Codepoint.CODES.get("$")) {
            if (last < i) res += replacement.substring(last, i);
            if (i + 1 >= m) throw new RE2JSGroupException("Illegal group reference: group index is missing");
            const nextCode = replacement.codePointAt(i + 1);
            if (Codepoint.CODES.get("0") <= nextCode && nextCode <= Codepoint.CODES.get("9")) {
              let n = nextCode - Codepoint.CODES.get("0");
              let j = i + 2;
              for (; j < m; j++) {
                const digit = replacement.codePointAt(j);
                if (digit < Codepoint.CODES.get("0") || digit > Codepoint.CODES.get("9") || n * 10 + digit - Codepoint.CODES.get("0") > this.patternGroupCount) break;
                n = n * 10 + digit - Codepoint.CODES.get("0");
              }
              if (n > this.patternGroupCount) throw new RE2JSGroupException(`n > number of groups: ${n}`);
              const group = this.group(n);
              if (group !== null) res += group;
              i = j;
              last = i;
            } else if (nextCode === Codepoint.CODES.get("{")) {
              let j = i + 2;
              while (j < m && replacement.codePointAt(j) !== Codepoint.CODES.get("}")) j++;
              if (j >= m) throw new RE2JSGroupException("named capture group is missing trailing '}'");
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
        if (last < m) res += replacement.substring(last, m);
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
        const m = replacement.length;
        for (let i = 0; i < m - 1; i++) if (replacement.codePointAt(i) === Codepoint.CODES.get("$")) {
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
            let n = c - Codepoint.CODES.get("0");
            if (last < i) res += replacement.substring(last, i);
            for (i += 2; i < m; i++) {
              c = replacement.codePointAt(i);
              if (c < Codepoint.CODES.get("0") || c > Codepoint.CODES.get("9") || n * 10 + c - Codepoint.CODES.get("0") > this.patternGroupCount) break;
              n = n * 10 + c - Codepoint.CODES.get("0");
            }
            if (n > this.patternGroupCount) {
              res += `$${n}`;
              last = i;
              i--;
              continue;
            }
            const group = this.group(n);
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
        if (last < m) res += replacement.substring(last, m);
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
          const start = this.start(i);
          if (start < 0) args.push(void 0);
          else args.push(this.substring(start, this.end(i)));
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
        let n = len >> 1;
        while (n > 1) {
          const half = n >> 1;
          base += this.runes[base + half << 1] <= r ? half : 0;
          n -= half;
        }
        base += this.runes[base << 1] <= r ? 1 : 0;
        const m = base - 1;
        return m >= 0 && r <= this.runes[m << 1 | 1];
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
        let n = len >> 1;
        while (n > 1) {
          const half = n >> 1;
          base += this.runes[base + half << 1] <= r ? half : 0;
          n -= half;
        }
        base += this.runes[base << 1] <= r ? 1 : 0;
        const m = base - 1;
        return m >= 0 && r <= this.runes[m << 1 | 1] ? m : -1;
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
        const m = new Machine2();
        m.prog = re2.prog;
        m.re2 = re2;
        m.q0 = new Queue(m.prog.numInst());
        m.q1 = new Queue(m.prog.numInst());
        m.matched = false;
        m.matchcap = new Int32Array(m.prog.numCap < 2 ? 2 : m.prog.numCap);
        m.ncap = 0;
        return m;
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
        let width = r & 7;
        let rune1 = -1;
        let width1 = 0;
        if (r !== MachineInputBase.EOF()) {
          r = input.step(currentPos + width);
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
              width = r & 7;
              r = input.step(currentPos + width);
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
          const nextPos = currentPos + width;
          flag = input.context(nextPos);
          this.step(runq, nextq, currentPos, nextPos, rune, flag, anchor, currentPos === input.endPos());
          if (width === 0) break;
          if (this.ncap === 0 && this.matched) break;
          currentPos += width;
          rune = rune1;
          width = width1;
          if (rune !== -1) {
            r = input.step(currentPos + width);
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
        let width = r & 7;
        let rune1 = -1;
        let width1 = 0;
        if (r !== MachineInputBase.EOF()) {
          r = input.step(currentPos + width);
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
          const nextPos = currentPos + width;
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
          if (width === 0) break;
          currentPos += width;
          rune = rune1;
          width = width1;
          if (rune !== -1) {
            r = input.step(currentPos + width);
            rune1 = r >> 3;
            width1 = r & 7;
          }
          const tmpq = runq;
          runq = nextq;
          nextq = tmpq;
        }
        nextq.clear();
        return Array.from(matches).sort((a, b) => a - b);
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
                for (let k = 0; k < this.ncap; k++) this.matchcap[k] = runq.denseCaps[capOffset + k];
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
          const d = q.add(pc);
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
                const destOffset = d * this.ncap;
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
      let h = -2128831035;
      for (let i = 0; i < pcs.length; i++) {
        h ^= pcs[i];
        h = Math.imul(h, 16777619);
      }
      return h;
    };
    var arraysEqual = (a, b) => {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
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
        matchIDs.sort((a, b) => a - b);
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
        allStates.sort((a, b) => a.lastSeen - b.lastSeen);
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
          const width = r & 7;
          if (width === 0) break;
          currentState = anchor === RE2Flags.UNANCHORED && rune <= Unicode.MAX_LATIN1 && currentState.nextLatin1[rune] || this.step(currentState, rune, anchor);
          if (currentState === null) return null;
          currentState.lastSeen = ++this.clock;
          if (currentState.isMatch) if (anchor === RE2Flags.ANCHOR_BOTH) {
            if (i + width === endPos) return true;
          } else return true;
          if (currentState.nfaStates.length === 0) {
            if (anchor !== RE2Flags.UNANCHORED) return false;
          }
          i += width;
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
            if (currentPos === endPos) state.matchIDs.forEach((id) => matches.add(id));
          } else state.matchIDs.forEach((id) => matches.add(id));
        };
        checkMatch(currentState, pos);
        let i = pos;
        while (i < endPos) {
          const r = input.step(i);
          const rune = r >> 3;
          const width = r & 7;
          if (width === 0) break;
          currentState = anchor === RE2Flags.UNANCHORED && rune <= Unicode.MAX_LATIN1 && currentState.nextLatin1[rune] || this.step(currentState, rune, anchor);
          if (currentState === null) return null;
          currentState.lastSeen = ++this.clock;
          i += width;
          checkMatch(currentState, i);
          if (currentState.nfaStates.length === 0) {
            if (anchor !== RE2Flags.UNANCHORED) break;
          }
        }
        return Array.from(matches).sort((a, b) => a - b);
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
        const n = pc * (this.end + 1) + pos;
        const idx = n >>> 5;
        const mask = 1 << (n & 31);
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
        const b = bitStatePool.length > 0 ? bitStatePool.pop() : new BitState();
        const end = input.endPos();
        b.reset(re2.prog, end, ncap);
        let matched = false;
        if ((startCond & Utils.EMPTY_BEGIN_TEXT) !== 0 || anchor === RE2Flags.ANCHOR_START || anchor === RE2Flags.ANCHOR_BOTH) {
          if (b.ncap > 0) b.cap[0] = pos;
          if (b.tryBacktrack(re2, input, re2.prog.start, pos, anchor)) matched = true;
        } else {
          let width = -1;
          for (; pos <= end && width !== 0; pos += width) {
            if (re2.prefix.length > 0) {
              const advance = input.index(re2, pos);
              if (advance < 0) break;
              pos += advance;
            }
            if (b.ncap > 0) b.cap[0] = pos;
            if (b.tryBacktrack(re2, input, re2.prog.start, pos, anchor)) {
              matched = true;
              break;
            }
            const r = input.step(pos);
            width = r === MachineInputBase.EOF() ? 0 : r & 7;
          }
        }
        if (!matched) {
          bitStatePool.push(b);
          return null;
        }
        const result = ncap === 0 ? [] : Utils.toArray(b.matchcap.subarray(0, ncap));
        bitStatePool.push(b);
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
      const p = new OnePassProg(prog);
      for (let pc = 0; pc < p.inst.length; pc++) {
        const inst = p.inst[pc];
        if (inst.op !== Inst.ALT && inst.op !== Inst.ALT_MATCH) continue;
        let pAOther = "out";
        let pAAlt = "arg";
        let instAlt = p.inst[inst[pAAlt]];
        if (instAlt.op !== Inst.ALT && instAlt.op !== Inst.ALT_MATCH) {
          pAOther = "arg";
          pAAlt = "out";
          instAlt = p.inst[inst[pAAlt]];
          if (instAlt.op !== Inst.ALT && instAlt.op !== Inst.ALT_MATCH) continue;
        }
        const instOther = p.inst[inst[pAOther]];
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
      return p;
    };
    var makeOnePass = (p) => {
      if (p.inst.length >= 1e3) return null;
      const instQueue = new QueueOnePass(p.inst.length);
      const visitQueue = new QueueOnePass(p.inst.length);
      const onePassRunes = new Array(p.inst.length);
      const m = new Array(p.inst.length).fill(false);
      const check = (pc) => {
        let ok = true;
        const inst = p.inst[pc];
        if (visitQueue.contains(pc)) return true;
        visitQueue.insert(pc);
        switch (inst.op) {
          case Inst.ALT:
          case Inst.ALT_MATCH: {
            ok = check(inst.out) && check(inst.arg);
            let matchOut = m[inst.out];
            let matchArg = m[inst.arg];
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
              m[pc] = true;
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
            m[pc] = m[inst.out];
            onePassRunes[pc] = onePassRunes[inst.out] ? onePassRunes[inst.out].slice() : [];
            inst.next = new Uint32Array(Math.floor(onePassRunes[pc].length / 2) + 1).fill(inst.out);
            break;
          case Inst.MATCH:
          case Inst.FAIL:
            m[pc] = inst.op === Inst.MATCH;
            break;
          case Inst.RUNE: {
            m[pc] = false;
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
              runes.sort((a, b) => a - b);
            } else for (let j = 0; j < inst.runes.length; j++) runes.push(inst.runes[j]);
            onePassRunes[pc] = runes;
            inst.next = new Uint32Array(Math.floor(runes.length / 2) + 1).fill(inst.out);
            inst.op = Inst.RUNE;
            break;
          }
          case Inst.RUNE1: {
            m[pc] = false;
            if (inst.next && inst.next.length > 0) break;
            instQueue.insert(inst.out);
            let runes = [];
            if ((inst.arg & RE2Flags.FOLD_CASE) !== 0) {
              const r0 = inst.runes[0];
              runes.push(r0, r0);
              for (let r1 = Unicode.simpleFold(r0); r1 !== r0; r1 = Unicode.simpleFold(r1)) runes.push(r1, r1);
              runes.sort((a, b) => a - b);
            } else runes.push(inst.runes[0], inst.runes[0]);
            onePassRunes[pc] = runes;
            inst.next = new Uint32Array(Math.floor(runes.length / 2) + 1).fill(inst.out);
            inst.op = Inst.RUNE;
            break;
          }
          case Inst.RUNE_ANY:
            m[pc] = false;
            if (inst.next && inst.next.length > 0) break;
            instQueue.insert(inst.out);
            onePassRunes[pc] = [0, Unicode.MAX_RUNE];
            inst.next = new Uint32Array([inst.out]);
            break;
          case Inst.RUNE_ANY_NOT_NL:
            m[pc] = false;
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
      instQueue.insert(p.start);
      while (!instQueue.empty()) {
        visitQueue.clear();
        if (!check(instQueue.next())) return null;
      }
      for (let i = 0; i < p.inst.length; i++) if (onePassRunes[i]) p.inst[i].runes = onePassRunes[i];
      return p;
    };
    var cleanupOnePass = (p, original) => {
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
            p.inst[ix].next = null;
            break;
          case Inst.RUNE1:
          case Inst.RUNE_ANY:
          case Inst.RUNE_ANY_NOT_NL:
            p.inst[ix].next = null;
            p.inst[ix].op = instOriginal.op;
            p.inst[ix].runes = instOriginal.runes ? instOriginal.runes.slice() : [];
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
        let p = onePassCopy(prog);
        p = makeOnePass(p);
        if (p !== null) cleanupOnePass(p, prog);
        return p;
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
        let width = r & 7;
        let r1 = MachineInputBase.EOF();
        let rune1 = -1;
        let width1 = 0;
        if (r !== MachineInputBase.EOF()) {
          r1 = input.step(pos + width);
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
          if (width === 0) break;
          flag = Utils.emptyOpContext(rune, rune1);
          pos += width;
          rune = rune1;
          width = width1;
          if (rune !== -1) {
            r1 = input.step(pos + width);
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
      static fromRegexp(re2) {
        const regex = new Regexp2(re2.op);
        regex.flags = re2.flags;
        regex.subs = re2.subs;
        regex.runes = re2.runes;
        regex.cap = re2.cap;
        regex.min = re2.min;
        regex.max = re2.max;
        regex.name = re2.name;
        regex.namedGroups = re2.namedGroups;
        regex.lb = re2.lb;
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
            let sep2 = "";
            for (let sub of this.subs) {
              out += sep2;
              sep2 = "|";
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
        let m = 0;
        if (this.op === Regexp2.Op.CAPTURE) m = this.cap;
        if (this.subs !== null) for (let sub of this.subs) {
          const n = sub.maxCap();
          if (m < n) m = n;
        }
        return m;
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
      searchUTF16(charSeq, start, end) {
        let node = 0;
        for (let i = start; i < end; i++) {
          const val = charSeq.charCodeAt(i);
          while (node !== 0 && !(val in this.next[node])) node = this.fail[node];
          if (val in this.next[node]) node = this.next[node][val];
          if (this.match[node]) return true;
        }
        return false;
      }
      searchUTF8(bytes, start, end) {
        let node = 0;
        for (let i = start; i < end; i++) {
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
      static build(re2) {
        const pf = PrefilterTree2.fromRegexp(re2);
        return PrefilterTree2.simplify(pf);
      }
      static fromRegexp(re2) {
        if (!re2) return new Prefilter(Prefilter.Type.NONE);
        switch (re2.op) {
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
            if (re2.runes.length === 0 || (re2.flags & RE2Flags.FOLD_CASE) !== 0) return new Prefilter(Prefilter.Type.NONE);
            const pf = new Prefilter(Prefilter.Type.EXACT);
            let str = "";
            for (let i = 0; i < re2.runes.length; i++) str += String.fromCodePoint(re2.runes[i]);
            pf.str = str;
            pf.bytes = Utils.stringToUtf8ByteArray(pf.str);
            return pf;
          }
          case Regexp.Op.CAPTURE:
          case Regexp.Op.PLUS:
            return PrefilterTree2.fromRegexp(re2.subs[0]);
          case Regexp.Op.REPEAT:
            if (re2.min >= 1) return PrefilterTree2.fromRegexp(re2.subs[0]);
            return new Prefilter(Prefilter.Type.NONE);
          case Regexp.Op.CONCAT: {
            const pf = new Prefilter(Prefilter.Type.AND);
            for (const sub of re2.subs) pf.subs.push(PrefilterTree2.fromRegexp(sub));
            return pf;
          }
          case Regexp.Op.ALTERNATE: {
            const pf = new Prefilter(Prefilter.Type.OR);
            for (const sub of re2.subs) pf.subs.push(PrefilterTree2.fromRegexp(sub));
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
      static compileRegexp(re2) {
        const c = new Compiler2();
        const f = c.compile(re2);
        c.prog.patch(f.out, c.newInst(Inst.MATCH).i);
        c.prog.start = f.i;
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
          const f = c.compile(regexps[i]);
          const m = c.newInst(Inst.MATCH);
          c.prog.getInst(m.i).arg = i;
          c.prog.patch(f.out, m.i);
          starts.push(f.i);
        }
        let start = starts[0];
        for (let i = 1; i < starts.length; i++) {
          const f = c.newInst(Inst.ALT);
          const inst = c.prog.getInst(f.i);
          inst.out = start;
          inst.arg = starts[i];
          start = f.i;
        }
        c.prog.start = start;
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
        const f = this.newInst(Inst.NOP);
        f.out = new PatchList(f.i << 1, f.i << 1);
        return f;
      }
      fail() {
        return new Frag();
      }
      cap(arg) {
        const f = this.newInst(Inst.CAPTURE);
        f.out = new PatchList(f.i << 1, f.i << 1);
        this.prog.getInst(f.i).arg = arg;
        if (this.prog.numCap < arg + 1) this.prog.numCap = arg + 1;
        return f;
      }
      cat(f1, f2) {
        if (f1.i === 0 || f2.i === 0) return this.fail();
        this.prog.patch(f1.out, f2.i);
        return new Frag(f1.i, f2.out, f1.nullable && f2.nullable);
      }
      alt(f1, f2) {
        if (f1.i === 0) return f2;
        if (f2.i === 0) return f1;
        const f = this.newInst(Inst.ALT);
        const i = this.prog.getInst(f.i);
        i.out = f1.i;
        i.arg = f2.i;
        f.out = this.prog.append(f1.out, f2.out);
        f.nullable = f1.nullable || f2.nullable;
        return f;
      }
      loop(f1, nongreedy) {
        const f = this.newInst(Inst.ALT);
        const i = this.prog.getInst(f.i);
        if (nongreedy) {
          i.arg = f1.i;
          f.out = new PatchList(f.i << 1, f.i << 1);
        } else {
          i.out = f1.i;
          f.out = new PatchList(f.i << 1 | 1, f.i << 1 | 1);
        }
        this.prog.patch(f1.out, f.i);
        return f;
      }
      quest(f1, nongreedy) {
        const f = this.newInst(Inst.ALT);
        const i = this.prog.getInst(f.i);
        if (nongreedy) {
          i.arg = f1.i;
          f.out = new PatchList(f.i << 1, f.i << 1);
        } else {
          i.out = f1.i;
          f.out = new PatchList(f.i << 1 | 1, f.i << 1 | 1);
        }
        f.out = this.prog.append(f.out, f1.out);
        return f;
      }
      star(f1, nongreedy) {
        if (f1.nullable) return this.quest(this.plus(f1, nongreedy), nongreedy);
        return this.loop(f1, nongreedy);
      }
      plus(f1, nongreedy) {
        return new Frag(f1.i, this.loop(f1, nongreedy).out, f1.nullable);
      }
      empty(op) {
        const f = this.newInst(Inst.EMPTY_WIDTH);
        this.prog.getInst(f.i).arg = op;
        f.out = new PatchList(f.i << 1, f.i << 1);
        return f;
      }
      rune(runes, flags) {
        const f = this.newInst(Inst.RUNE);
        f.nullable = false;
        const i = this.prog.getInst(f.i);
        i.runes = runes;
        flags &= RE2Flags.FOLD_CASE;
        if (runes.length !== 1 || Unicode.simpleFold(runes[0]) === runes[0]) flags &= ~RE2Flags.FOLD_CASE;
        i.arg = flags;
        f.out = new PatchList(f.i << 1, f.i << 1);
        if ((flags & RE2Flags.FOLD_CASE) === 0 && runes.length === 1 || runes.length === 2 && runes[0] === runes[1]) i.op = Inst.RUNE1;
        else if (runes.length === 2 && runes[0] === 0 && runes[1] === Unicode.MAX_RUNE) i.op = Inst.RUNE_ANY;
        else if (runes.length === 4 && runes[0] === 0 && runes[1] === Codepoint.CODES.get("\n") - 1 && runes[2] === Codepoint.CODES.get("\n") + 1 && runes[3] === Unicode.MAX_RUNE) i.op = Inst.RUNE_ANY_NOT_NL;
        return f;
      }
      lookBehind(a, lb) {
        const id = this.newInst(Inst.LB_WRITE);
        this.prog.getInst(id.i).arg = lb;
        const any = this.rune(Compiler2.ANY_RUNE(), 0);
        const dotStar = this.star(any, true);
        const lbAutomaton = this.cat(dotStar, a);
        this.prog.patch(lbAutomaton.out, id.i);
        const checkId = this.newInst(Inst.LB_CHECK);
        this.prog.getInst(checkId.i).arg = lb;
        this.prog.lbStarts.push(lbAutomaton.i);
        if (Math.abs(lb) > this.prog.numLb) this.prog.numLb = Math.abs(lb);
        checkId.out = new PatchList(checkId.i << 1, checkId.i << 1);
        return checkId;
      }
      compile(re2) {
        switch (re2.op) {
          case Regexp.Op.NO_MATCH:
            return this.fail();
          case Regexp.Op.EMPTY_MATCH:
            return this.nop();
          case Regexp.Op.LITERAL:
            if (re2.runes.length === 0) return this.nop();
            else {
              let f = null;
              for (let r of re2.runes) {
                const f1 = this.rune([r], re2.flags);
                f = f === null ? f1 : this.cat(f, f1);
              }
              return f;
            }
          case Regexp.Op.CHAR_CLASS:
            return this.rune(re2.runes, re2.flags);
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
            return this.lookBehind(this.compile(re2.subs[0]), re2.lb);
          case Regexp.Op.CAPTURE: {
            const bra = this.cap(re2.cap << 1);
            const sub = this.compile(re2.subs[0]);
            const ket = this.cap(re2.cap << 1 | 1);
            return this.cat(this.cat(bra, sub), ket);
          }
          case Regexp.Op.STAR:
            return this.star(this.compile(re2.subs[0]), (re2.flags & RE2Flags.NON_GREEDY) !== 0);
          case Regexp.Op.PLUS:
            return this.plus(this.compile(re2.subs[0]), (re2.flags & RE2Flags.NON_GREEDY) !== 0);
          case Regexp.Op.QUEST:
            return this.quest(this.compile(re2.subs[0]), (re2.flags & RE2Flags.NON_GREEDY) !== 0);
          case Regexp.Op.CONCAT:
            if (re2.subs.length === 0) return this.nop();
            else {
              let f = null;
              for (let sub of re2.subs) {
                const f1 = this.compile(sub);
                f = f === null ? f1 : this.cat(f, f1);
              }
              return f;
            }
          case Regexp.Op.ALTERNATE:
            if (re2.subs.length === 0) return this.nop();
            else {
              let f = null;
              for (let sub of re2.subs) {
                const f1 = this.compile(sub);
                f = f === null ? f1 : this.alt(f, f1);
              }
              return f;
            }
          default:
            throw new RE2JSCompileException("regexp: unhandled case in compile");
        }
      }
    };
    var Simplify = class Simplify2 {
      static simplify(re2) {
        if (re2 === null) return null;
        switch (re2.op) {
          case Regexp.Op.PLB:
          case Regexp.Op.NLB:
          case Regexp.Op.CAPTURE: {
            const sub = Simplify2.simplify(re2.subs[0]);
            if (sub !== re2.subs[0]) {
              const nre = Regexp.fromRegexp(re2);
              nre.runes = [];
              nre.subs = [sub];
              return nre;
            }
            return re2;
          }
          case Regexp.Op.CONCAT:
          case Regexp.Op.ALTERNATE: {
            const newSubs = [];
            let changed = false;
            for (let i = 0; i < re2.subs.length; i++) {
              const sub = re2.subs[i];
              const nsub = Simplify2.simplify(sub);
              if (nsub !== sub) changed = true;
              if (re2.op === Regexp.Op.CONCAT) {
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
              } else if (re2.op === Regexp.Op.ALTERNATE) {
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
              if (newSubs.length === 0) return new Regexp(re2.op === Regexp.Op.CONCAT ? Regexp.Op.EMPTY_MATCH : Regexp.Op.NO_MATCH);
              if (newSubs.length === 1) return newSubs[0];
              const nre = Regexp.fromRegexp(re2);
              nre.runes = [];
              nre.subs = newSubs;
              return nre;
            }
            return re2;
          }
          case Regexp.Op.CHAR_CLASS:
            if (re2.runes === null) return re2;
            if (re2.runes.length === 0) return new Regexp(Regexp.Op.NO_MATCH);
            if (re2.runes.length === 2 && re2.runes[0] === 0 && re2.runes[1] === Unicode.MAX_RUNE) return new Regexp(Regexp.Op.ANY_CHAR);
            if (re2.runes.length === 4 && re2.runes[0] === 0 && re2.runes[1] === Codepoint.CODES.get("\n") - 1 && re2.runes[2] === Codepoint.CODES.get("\n") + 1 && re2.runes[3] === Unicode.MAX_RUNE) return new Regexp(Regexp.Op.ANY_CHAR_NOT_NL);
            return re2;
          case Regexp.Op.STAR:
          case Regexp.Op.PLUS:
          case Regexp.Op.QUEST: {
            const sub = Simplify2.simplify(re2.subs[0]);
            return Simplify2.simplify1(re2.op, re2.flags, sub, re2);
          }
          case Regexp.Op.REPEAT: {
            if (re2.min === 0 && re2.max === 0) return new Regexp(Regexp.Op.EMPTY_MATCH);
            const sub = Simplify2.simplify(re2.subs[0]);
            if (re2.max === -1) {
              if (re2.min === 0) return Simplify2.simplify1(Regexp.Op.STAR, re2.flags, sub, null);
              if (re2.min === 1) return Simplify2.simplify1(Regexp.Op.PLUS, re2.flags, sub, null);
              const nre = new Regexp(Regexp.Op.CONCAT);
              const subs = [];
              for (let i = 0; i < re2.min - 1; i++) subs.push(sub);
              subs.push(Simplify2.simplify1(Regexp.Op.PLUS, re2.flags, sub, null));
              nre.subs = subs.slice(0);
              return Simplify2.simplify(nre);
            }
            if (re2.min === 1 && re2.max === 1) return sub;
            let prefixSubs = null;
            if (re2.min > 0) {
              prefixSubs = [];
              for (let i = 0; i < re2.min; i++) prefixSubs.push(sub);
            }
            if (re2.max > re2.min) {
              let suffix = Simplify2.simplify1(Regexp.Op.QUEST, re2.flags, sub, null);
              for (let i = re2.min + 1; i < re2.max; i++) {
                const nre2 = new Regexp(Regexp.Op.CONCAT);
                nre2.subs = [sub, suffix];
                suffix = Simplify2.simplify1(Regexp.Op.QUEST, re2.flags, nre2, null);
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
        return re2;
      }
      static simplify1(op, flags, sub, re2) {
        if (sub.op === Regexp.Op.EMPTY_MATCH) return sub;
        if (sub.op === Regexp.Op.NO_MATCH) {
          if (op === Regexp.Op.PLUS) return sub;
          return new Regexp(Regexp.Op.EMPTY_MATCH);
        }
        if (op === sub.op && (flags & RE2Flags.NON_GREEDY) === (sub.flags & RE2Flags.NON_GREEDY)) return sub;
        if (re2 !== null && re2.op === op && (re2.flags & RE2Flags.NON_GREEDY) === (flags & RE2Flags.NON_GREEDY) && sub === re2.subs[0]) return re2;
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
          for (let f = Unicode.simpleFold(c); f !== c; f = Unicode.simpleFold(f)) this.appendRange(f, f);
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
      appendGroup(g, foldCase) {
        let cls = g.cls;
        if (foldCase) cls = new CharClass2().appendFoldedClass(cls).cleanClass().toArray();
        return this.appendClassWithSign(cls, g.sign);
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
      skip(n) {
        this.position += n;
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
      static leadingRegexp(re2) {
        if (re2.op === Regexp.Op.EMPTY_MATCH) return null;
        if (re2.op === Regexp.Op.CONCAT && re2.subs.length > 0) {
          const sub = re2.subs[0];
          if (sub.op === Regexp.Op.EMPTY_MATCH) return null;
          return sub;
        }
        return re2;
      }
      static literalRegexp(s, flags) {
        const re2 = new Regexp(Regexp.Op.LITERAL);
        re2.flags = flags;
        re2.runes = Utils.stringToRunes(s);
        return re2;
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
        const start = t.pos();
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
        if (min < 0 || min > 1e3 || max === -2 || max > 1e3 || max >= 0 && min > max) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_REPEAT_SIZE, t.from(start));
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
        const start = t.pos();
        while (t.more() && t.peek() >= Codepoint.CODES.get("0") && t.peek() <= Codepoint.CODES.get("9")) t.skip(1);
        const n = t.from(start);
        if (n.length === 0 || n.length > 1 && n.codePointAt(0) === Codepoint.CODES.get("0")) return -1;
        if (n.length > 8) return -2;
        return parseInt(n, 10);
      }
      static isCharClass(re2) {
        return re2.op === Regexp.Op.LITERAL && re2.runes.length === 1 || re2.op === Regexp.Op.CHAR_CLASS || re2.op === Regexp.Op.ANY_CHAR_NOT_NL || re2.op === Regexp.Op.ANY_CHAR;
      }
      static matchRune(re2, r) {
        switch (re2.op) {
          case Regexp.Op.LITERAL:
            return re2.runes.length === 1 && re2.runes[0] === r;
          case Regexp.Op.CHAR_CLASS:
            for (let i = 0; i < re2.runes.length; i += 2) if (re2.runes[i] <= r && r <= re2.runes[i + 1]) return true;
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
                const v = Utils.unhex(c);
                if (v < 0) break bigswitch;
                r = r * 16 + v;
                if (r > Unicode.MAX_RUNE) break bigswitch;
                nhex++;
              }
              if (nhex === 0) break bigswitch;
              return r;
            }
            const x = Utils.unhex(c);
            if (!t.more()) break;
            c = t.pop();
            const y = Utils.unhex(c);
            if (x < 0 || y < 0) break;
            return x * 16 + y;
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
      static concatRunes(x, y) {
        for (let i = 0; i < y.length; i++) x.push(y[i]);
        return x;
      }
      static hasCapture(re2) {
        if (re2 === null) return false;
        if (re2.op === Regexp.Op.CAPTURE) return true;
        if (re2.subs) {
          for (let sub of re2.subs) if (Parser2.hasCapture(sub)) return true;
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
        let re2 = this.free;
        if (re2 !== null && re2.subs !== null && re2.subs.length > 0) {
          this.free = re2.subs[0];
          re2.reinit();
          re2.op = op;
        } else {
          re2 = new Regexp(op);
          this.numRegexp += 1;
        }
        return re2;
      }
      reuse(re2) {
        if (this.height !== null && this.height.has(re2)) this.height.delete(re2);
        if (re2.subs !== null && re2.subs.length > 0) re2.subs[0] = this.free;
        this.free = re2;
      }
      checkLimits(re2) {
        if (this.numRunes > Parser2.MAX_RUNES) throw new RE2JSSyntaxException(Parser2.ERR_LARGE);
        this.checkSize(re2);
        this.checkHeight(re2);
      }
      checkSize(re2) {
        if (this.size === null) {
          if (this.repeats === 0) this.repeats = 1;
          if (re2.op === Regexp.Op.REPEAT) {
            let n = re2.max;
            if (n === -1) n = re2.min;
            if (n <= 0) n = 1;
            if (n > Math.floor(Parser2.MAX_SIZE / this.repeats)) this.repeats = Parser2.MAX_SIZE;
            else this.repeats *= n;
          }
          if (this.numRegexp < Math.floor(Parser2.MAX_SIZE / this.repeats)) return;
          this.size = /* @__PURE__ */ new Map();
          for (let reEx of this.stack) this.checkSize(reEx);
        }
        if (this.calcSize(re2, true) > Parser2.MAX_SIZE) throw new RE2JSSyntaxException(Parser2.ERR_LARGE);
      }
      calcSize(re2, force = false) {
        if (!force && this.size !== null) {
          if (this.size.has(re2)) return this.size.get(re2);
        }
        let size = 0;
        switch (re2.op) {
          case Regexp.Op.LITERAL:
            size = re2.runes.length;
            break;
          case Regexp.Op.PLB:
          case Regexp.Op.NLB:
          case Regexp.Op.CAPTURE:
          case Regexp.Op.STAR:
            size = 2 + this.calcSize(re2.subs[0]);
            break;
          case Regexp.Op.PLUS:
          case Regexp.Op.QUEST:
            size = 1 + this.calcSize(re2.subs[0]);
            break;
          case Regexp.Op.CONCAT:
            for (let sub of re2.subs) size = size + this.calcSize(sub);
            break;
          case Regexp.Op.ALTERNATE:
            for (let sub of re2.subs) size = size + this.calcSize(sub);
            if (re2.subs.length > 1) size = size + re2.subs.length - 1;
            break;
          case Regexp.Op.REPEAT: {
            let sub = this.calcSize(re2.subs[0]);
            if (re2.max === -1) {
              if (re2.min === 0) size = 2 + sub;
              else size = 1 + re2.min * sub;
              break;
            }
            size = re2.max * sub + (re2.max - re2.min);
            break;
          }
        }
        size = Math.max(1, size);
        if (this.size === null) this.size = /* @__PURE__ */ new Map();
        this.size.set(re2, size);
        return size;
      }
      checkHeight(re2) {
        if (this.numRegexp < Parser2.MAX_HEIGHT) return;
        if (this.height === null) {
          this.height = /* @__PURE__ */ new Map();
          for (let reEx of this.stack) this.checkHeight(reEx);
        }
        if (this.calcHeight(re2, true) > Parser2.MAX_HEIGHT) throw new RE2JSSyntaxException(Parser2.ERR_NESTING_DEPTH);
      }
      calcHeight(re2, force = false) {
        if (!force && this.height !== null) {
          if (this.height.has(re2)) return this.height.get(re2);
        }
        let h = 1;
        for (let sub of re2.subs) {
          const hsub = this.calcHeight(sub);
          if (h < 1 + hsub) h = 1 + hsub;
        }
        if (this.height === null) this.height = /* @__PURE__ */ new Map();
        this.height.set(re2, h);
        return h;
      }
      pop() {
        return this.stack.pop();
      }
      popToPseudo() {
        const n = this.stack.length;
        let i = n;
        while (i > 0 && !Regexp.isPseudoOp(this.stack[i - 1].op)) i--;
        const r = this.stack.slice(i, n);
        this.stack = this.stack.slice(0, i);
        return r;
      }
      push(re2) {
        this.numRunes += re2.runes.length;
        if (re2.op === Regexp.Op.CHAR_CLASS && re2.runes.length === 2 && re2.runes[0] === re2.runes[1]) {
          if (this.maybeConcat(re2.runes[0], this.flags & ~RE2Flags.FOLD_CASE)) return null;
          re2.op = Regexp.Op.LITERAL;
          re2.runes = [re2.runes[0]];
          re2.flags = this.flags & ~RE2Flags.FOLD_CASE;
        } else if (re2.op === Regexp.Op.CHAR_CLASS && re2.runes.length === 4 && re2.runes[0] === re2.runes[1] && re2.runes[2] === re2.runes[3] && Unicode.simpleFold(re2.runes[0]) === re2.runes[2] && Unicode.simpleFold(re2.runes[2]) === re2.runes[0] || re2.op === Regexp.Op.CHAR_CLASS && re2.runes.length === 2 && re2.runes[0] + 1 === re2.runes[1] && Unicode.simpleFold(re2.runes[0]) === re2.runes[1] && Unicode.simpleFold(re2.runes[1]) === re2.runes[0]) {
          if (this.maybeConcat(re2.runes[0], this.flags | RE2Flags.FOLD_CASE)) return null;
          re2.op = Regexp.Op.LITERAL;
          re2.runes = [re2.runes[0]];
          re2.flags = this.flags | RE2Flags.FOLD_CASE;
        } else this.maybeConcat(-1, 0);
        this.stack.push(re2);
        this.checkLimits(re2);
        return re2;
      }
      maybeConcat(r, flags) {
        const n = this.stack.length;
        if (n < 2) return false;
        const re1 = this.stack[n - 1];
        const re2 = this.stack[n - 2];
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
        const re2 = this.newRegexp(Regexp.Op.LITERAL);
        re2.flags = flags;
        if ((flags & RE2Flags.FOLD_CASE) !== 0) r = Parser2.minFoldRune(r);
        re2.runes = [r];
        return re2;
      }
      literal(r) {
        this.push(this.newLiteral(r, this.flags));
      }
      op(op) {
        const re2 = this.newRegexp(op);
        re2.flags = this.flags;
        return this.push(re2);
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
        const n = this.stack.length;
        if (n === 0) throw new RE2JSSyntaxException(Parser2.ERR_MISSING_REPEAT_ARGUMENT, t.from(beforePos));
        const sub = this.stack[n - 1];
        if (Regexp.isPseudoOp(sub.op)) throw new RE2JSSyntaxException(Parser2.ERR_MISSING_REPEAT_ARGUMENT, t.from(beforePos));
        const re2 = this.newRegexp(op);
        re2.min = min;
        re2.max = max;
        re2.flags = flags;
        re2.subs = [sub];
        this.stack[n - 1] = re2;
        this.checkLimits(re2);
        if (op === Regexp.Op.REPEAT && (min >= 2 || max >= 2) && !this.repeatIsValid(re2, 1e3)) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_REPEAT_SIZE, t.from(beforePos));
      }
      repeatIsValid(re2, n) {
        if (re2.op === Regexp.Op.REPEAT) {
          let m = re2.max;
          if (m === 0) return true;
          if (m < 0) m = re2.min;
          if (m > n) return false;
          if (m > 0) n = Math.trunc(n / m);
        }
        for (let sub of re2.subs) if (!this.repeatIsValid(sub, n)) return false;
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
      cleanAlt(re2) {
        if (re2.op === Regexp.Op.CHAR_CLASS) {
          re2.runes = new CharClass(re2.runes).cleanClass().toArray();
          if (re2.runes.length === 2 && re2.runes[0] === 0 && re2.runes[1] === Unicode.MAX_RUNE) {
            re2.runes = [];
            re2.op = Regexp.Op.ANY_CHAR;
          } else if (re2.runes.length === 4 && re2.runes[0] === 0 && re2.runes[1] === Codepoint.CODES.get("\n") - 1 && re2.runes[2] === Codepoint.CODES.get("\n") + 1 && re2.runes[3] === Unicode.MAX_RUNE) {
            re2.runes = [];
            re2.op = Regexp.Op.ANY_CHAR_NOT_NL;
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
        let re2 = this.newRegexp(op);
        re2.subs = newsubs;
        if (op === Regexp.Op.ALTERNATE) {
          re2.subs = this.factor(re2.subs);
          if (re2.subs.length === 1) {
            const old = re2;
            re2 = re2.subs[0];
            this.reuse(old);
          }
        }
        return re2;
      }
      factor(array) {
        if (array.length < 2) return array;
        let s = 0;
        let lensub = array.length;
        let lenout = 0;
        let str = null;
        let strlen = 0;
        let strflags = 0;
        let start = 0;
        for (let i = 0; i <= lensub; i++) {
          let istr = null;
          let istrlen = 0;
          let iflags = 0;
          if (i < lensub) {
            let re2 = array[s + i];
            if (re2.op === Regexp.Op.CONCAT && re2.subs.length > 0) re2 = re2.subs[0];
            if (re2.op === Regexp.Op.LITERAL) {
              istr = re2.runes;
              istrlen = re2.runes.length;
              iflags = re2.flags & RE2Flags.FOLD_CASE;
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
          if (i === start) {
          } else if (i === start + 1) array[lenout++] = array[s + start];
          else {
            const prefix = this.newRegexp(Regexp.Op.LITERAL);
            prefix.flags = strflags;
            prefix.runes = str.slice(0, strlen);
            for (let j = start; j < i; j++) {
              array[s + j] = this.removeLeadingString(array[s + j], strlen);
              this.checkLimits(array[s + j]);
            }
            const suffix = this.collapse(array.slice(s + start, s + i), Regexp.Op.ALTERNATE);
            const re2 = this.newRegexp(Regexp.Op.CONCAT);
            re2.subs = [prefix, suffix];
            array[lenout++] = re2;
          }
          start = i;
          str = istr;
          strlen = istrlen;
          strflags = iflags;
        }
        lensub = lenout;
        s = 0;
        start = 0;
        lenout = 0;
        let first = null;
        for (let i = 0; i <= lensub; i++) {
          let ifirst = null;
          if (i < lensub) {
            ifirst = Parser2.leadingRegexp(array[s + i]);
            if (first !== null && first.equals(ifirst) && (Parser2.isCharClass(first) || first.op === Regexp.Op.REPEAT && first.min === first.max && Parser2.isCharClass(first.subs[0]))) continue;
          }
          if (i === start) {
          } else if (i === start + 1) array[lenout++] = array[s + start];
          else {
            const prefix = first;
            for (let j = start; j < i; j++) {
              const reuse = j !== start;
              array[s + j] = this.removeLeadingRegexp(array[s + j], reuse);
              this.checkLimits(array[s + j]);
            }
            const suffix = this.collapse(array.slice(s + start, s + i), Regexp.Op.ALTERNATE);
            const re2 = this.newRegexp(Regexp.Op.CONCAT);
            re2.subs = [prefix, suffix];
            array[lenout++] = re2;
          }
          start = i;
          first = ifirst;
        }
        lensub = lenout;
        s = 0;
        start = 0;
        lenout = 0;
        for (let i = 0; i <= lensub; i++) {
          if (i < lensub && Parser2.isCharClass(array[s + i])) continue;
          if (i === start) {
          } else if (i === start + 1) array[lenout++] = array[s + start];
          else {
            let max = start;
            for (let j = start + 1; j < i; j++) {
              const subMax = array[s + max];
              const subJ = array[s + j];
              if (subMax.op < subJ.op || subMax.op === subJ.op && (subMax.runes !== null ? subMax.runes.length : 0) < (subJ.runes !== null ? subJ.runes.length : 0)) max = j;
            }
            const tmp = array[s + start];
            array[s + start] = array[s + max];
            array[s + max] = tmp;
            for (let j = start + 1; j < i; j++) {
              Parser2.mergeCharClass(array[s + start], array[s + j]);
              this.reuse(array[s + j]);
            }
            this.cleanAlt(array[s + start]);
            array[lenout++] = array[s + start];
          }
          if (i < lensub) array[lenout++] = array[s + i];
          start = i + 1;
        }
        lensub = lenout;
        s = 0;
        start = 0;
        lenout = 0;
        for (let i = 0; i < lensub; ++i) {
          if (i + 1 < lensub && array[s + i].op === Regexp.Op.EMPTY_MATCH && array[s + i + 1].op === Regexp.Op.EMPTY_MATCH) continue;
          array[lenout++] = array[s + i];
        }
        lensub = lenout;
        s = 0;
        return array.slice(s, lensub);
      }
      removeLeadingString(re2, n) {
        if (re2.op === Regexp.Op.CONCAT && re2.subs.length > 0) {
          const sub = this.removeLeadingString(re2.subs[0], n);
          re2.subs[0] = sub;
          if (sub.op === Regexp.Op.EMPTY_MATCH) {
            this.reuse(sub);
            switch (re2.subs.length) {
              case 0:
              case 1:
                re2.op = Regexp.Op.EMPTY_MATCH;
                re2.subs = Regexp.emptySubs();
                break;
              case 2: {
                const old = re2;
                re2 = re2.subs[1];
                this.reuse(old);
                break;
              }
              default:
                re2.subs = re2.subs.slice(1, re2.subs.length);
                break;
            }
          }
          return re2;
        }
        if (re2.op === Regexp.Op.LITERAL) {
          re2.runes = re2.runes.slice(n, re2.runes.length);
          if (re2.runes.length === 0) re2.op = Regexp.Op.EMPTY_MATCH;
        }
        return re2;
      }
      removeLeadingRegexp(re2, reuse) {
        if (re2.op === Regexp.Op.CONCAT && re2.subs.length > 0) {
          if (reuse) this.reuse(re2.subs[0]);
          re2.subs = re2.subs.slice(1, re2.subs.length);
          switch (re2.subs.length) {
            case 0:
              re2.op = Regexp.Op.EMPTY_MATCH;
              re2.subs = Regexp.emptySubs();
              break;
            case 1: {
              const old = re2;
              re2 = re2.subs[0];
              this.reuse(old);
              break;
            }
          }
          return re2;
        }
        if (reuse) this.reuse(re2);
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
              const re2 = this.newRegexp(Regexp.Op.CHAR_CLASS);
              re2.flags = this.flags;
              if (t.lookingAt("\\p") || t.lookingAt("\\P")) {
                const cc2 = new CharClass();
                if (this.parseUnicodeClass(t, cc2)) {
                  re2.runes = cc2.toArray();
                  this.push(re2);
                  break bigswitch;
                }
              }
              const cc = new CharClass();
              if (this.parsePerlClassEscape(t, cc)) {
                re2.runes = cc.toArray();
                this.push(re2);
                break bigswitch;
              }
              t.rewindTo(savedPos);
              this.reuse(re2);
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
          const re2 = this.op(Regexp.Op.LEFT_PAREN);
          re2.cap = ++this.numCap;
          if (this.namedGroups[name]) throw new RE2JSSyntaxException(Parser2.ERR_DUPLICATE_NAMED_CAPTURE, name);
          this.namedGroups[name] = this.numCap;
          re2.name = name;
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
        const re2 = this.newRegexp(Regexp.Op.LEFT_PAREN);
        re2.flags = this.flags;
        re2.lb = ++this.nlb;
        return this.push(re2);
      }
      parseNegLookBehind() {
        const re2 = this.newRegexp(Regexp.Op.LEFT_PAREN);
        re2.flags = this.flags;
        re2.lb = -++this.nlb;
        return this.push(re2);
      }
      parseVerticalBar() {
        this.concat();
        if (!this.swapVerticalBar()) this.op(Regexp.Op.VERTICAL_BAR);
      }
      swapVerticalBar() {
        const n = this.stack.length;
        if (n >= 3 && this.stack[n - 2].op === Regexp.Op.VERTICAL_BAR && Parser2.isCharClass(this.stack[n - 1]) && Parser2.isCharClass(this.stack[n - 3])) {
          let re1 = this.stack[n - 1];
          let re3 = this.stack[n - 3];
          if (re1.op > re3.op) {
            const tmp = re3;
            re3 = re1;
            re1 = tmp;
            this.stack[n - 3] = re3;
          }
          Parser2.mergeCharClass(re3, re1);
          this.reuse(re1);
          this.pop();
          return true;
        }
        if (n >= 2) {
          const re1 = this.stack[n - 1];
          const re2 = this.stack[n - 2];
          if (re2.op === Regexp.Op.VERTICAL_BAR) {
            if (n >= 3) this.cleanAlt(this.stack[n - 3]);
            this.stack[n - 2] = re1;
            this.stack[n - 1] = re2;
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
        const p = t.from(beforePos);
        const g = PERL_GROUPS.has(p) ? PERL_GROUPS.get(p) : null;
        if (g === null) return false;
        cc.appendGroup(g, (this.flags & RE2Flags.FOLD_CASE) !== 0);
        return true;
      }
      parseNamedClass(t, cc) {
        const cls = t.rest();
        const i = cls.indexOf(":]");
        if (i < 0) return false;
        const name = cls.substring(0, i + 2);
        t.skipString(name);
        const g = POSIX_GROUPS.has(name) ? POSIX_GROUPS.get(name) : null;
        if (g === null) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_CHAR_RANGE, name);
        cc.appendGroup(g, (this.flags & RE2Flags.FOLD_CASE) !== 0);
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
        const re2 = this.newRegexp(Regexp.Op.CHAR_CLASS);
        re2.flags = this.flags;
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
        re2.runes = cc.toArray();
        this.push(re2);
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
        let re2 = Parser.parse(expr, mode);
        const maxCap = re2.maxCap();
        re2 = Simplify.simplify(re2);
        const prefilter = PrefilterTree.build(re2);
        const prog = Compiler.compileRegexp(re2);
        const re22 = new RE22(expr, prog, maxCap, longest);
        re22.prefilter = prefilter.type === Prefilter.Type.NONE ? null : prefilter;
        const [prefixCompl, prefixStr] = prog.prefix();
        re22.prefixComplete = prefixCompl;
        re22.prefix = prefixStr;
        re22.prefixUTF8 = Utils.stringToUtf8ByteArray(re22.prefix);
        if (re22.prefix.length > 0) re22.prefixRune = re22.prefix.codePointAt(0);
        re22.namedGroups = re2.namedGroups;
        return re22;
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
      put(m) {
        this.machinePool.push(m);
      }
      toString() {
        return this.expr;
      }
      doExecuteNFA(input, pos, anchor, ncap) {
        let m = this.get();
        if (!m) m = Machine.fromRE2(this);
        m.init(ncap);
        const cap = m.match(input, pos, anchor) ? m.submatches() : null;
        this.put(m);
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
      matchWithGroup(input, start, end, anchor, ngroup) {
        if (!(input instanceof MatcherInputBase)) if (Utils.isByteArray(input)) input = MatcherInput.utf8(input);
        else input = MatcherInput.utf16(input);
        return this.matchMachineInput(input, start, end, anchor, ngroup);
      }
      matchMachineInput(input, start, end, anchor, ngroup) {
        if (start > end) return [false, null];
        const machineInput = input.isUTF16Encoding() ? MachineInput.fromUTF16(input.asCharSequence(), 0, end) : MachineInput.fromUTF8(input.asBytes(), 0, end);
        const groupMatch = this.executeEngine(machineInput, start, anchor, 2 * ngroup);
        if (groupMatch === null) return [false, null];
        return [true, groupMatch];
      }
      /**
      * Returns true iff this regexp matches the UTF-8 byte array {@code b}.
      */
      matchUTF8(b) {
        return this.executeEngine(MachineInput.fromUTF8(b), 0, RE2Flags.UNANCHORED, 0) !== null;
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
          const width = input.step(searchPos) & 7;
          if (searchPos + width > a[1]) searchPos += width;
          else if (searchPos + 1 > a[1]) searchPos++;
          else searchPos = a[1];
          if (numReplaces >= maxReplaces) break;
        }
        out += src.substring(lastMatchEnd);
        return out;
      }
      pad(a) {
        if (a === null) return null;
        let n = (1 + this.numSubexp) * 2;
        if (a.length < n) {
          let a2 = new Array(n).fill(-1);
          for (let i = 0; i < a.length; i++) a2[i] = a[i];
          a = a2;
        }
        return a;
      }
      allMatches(input, n, deliverFun = (v) => v) {
        let result = [];
        const end = input.endPos();
        if (n < 0) n = end + 1;
        let pos = 0;
        let i = 0;
        let prevMatchEnd = -1;
        while (i < n && pos <= end) {
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
      findUTF8(b) {
        const a = this.executeEngine(MachineInput.fromUTF8(b), 0, RE2Flags.UNANCHORED, 2);
        if (a === null) return null;
        return b.slice(a[0], a[1]);
      }
      /**
      * Returns a two-element array of integers defining the location of the leftmost match in
      * {@code b} of this regular expression. The match itself is at {@code b[loc[0]...loc[1]]}.
      *
      * A return value of null indicates no match.
      */
      findUTF8Index(b) {
        const a = this.executeEngine(MachineInput.fromUTF8(b), 0, RE2Flags.UNANCHORED, 2);
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
      findUTF8Submatch(b) {
        const a = this.executeEngine(MachineInput.fromUTF8(b), 0, RE2Flags.UNANCHORED, this.prog.numCap);
        if (a === null) return null;
        const ret = new Array(1 + this.numSubexp).fill(null);
        for (let i = 0; i < ret.length; i++) if (2 * i < a.length && a[2 * i] >= 0) ret[i] = b.slice(a[2 * i], a[2 * i + 1]);
        return ret;
      }
      /**
      * Returns an array holding the index pairs identifying the leftmost match of this regular
      * expression in {@code b} and the matches, if any, of its subexpressions, as defined by the the
      * <a href='#submatch'>Submatch</a> and <a href='#index'>Index</a> descriptions above.
      *
      * A return value of null indicates no match.
      */
      findUTF8SubmatchIndex(b) {
        return this.pad(this.executeEngine(MachineInput.fromUTF8(b), 0, RE2Flags.UNANCHORED, this.prog.numCap));
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
      findAllUTF8(b, n) {
        const result = this.allMatches(MachineInput.fromUTF8(b), n, (match) => b.slice(match[0], match[1]));
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
      findAllUTF8Index(b, n) {
        const result = this.allMatches(MachineInput.fromUTF8(b), n, (match) => match.slice(0, 2));
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
      findAll(s, n) {
        const result = this.allMatches(MachineInput.fromUTF16(s), n, (match) => s.substring(match[0], match[1]));
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
      findAllIndex(s, n) {
        const result = this.allMatches(MachineInput.fromUTF16(s), n, (match) => match.slice(0, 2));
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
      findAllUTF8Submatch(b, n) {
        const result = this.allMatches(MachineInput.fromUTF8(b), n, (match) => {
          let slice = new Array(match.length / 2 | 0).fill(null);
          for (let j = 0; j < slice.length; j++) if (match[2 * j] >= 0) slice[j] = b.slice(match[2 * j], match[2 * j + 1]);
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
      findAllUTF8SubmatchIndex(b, n) {
        const result = this.allMatches(MachineInput.fromUTF8(b), n);
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
      findAllSubmatch(s, n) {
        const result = this.allMatches(MachineInput.fromUTF16(s), n, (match) => {
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
      findAllSubmatchIndex(s, n) {
        const result = this.allMatches(MachineInput.fromUTF16(s), n);
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
        const re2 = Parser.parse(fregex, this.re2Flags);
        this.regexps.push(Simplify.simplify(re2));
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
        const p = new RE2JS2(regex, flags);
        p.re2Input = RE2.compileImpl(fregex, re2Flags, (flags & RE2JS2.LONGEST_MATCH) !== 0);
        return p;
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
        const p = new RE2JS2(pattern, flags);
        p.re2Input = re2;
        return p;
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
        const m = this.matcher(input);
        if (!m.find()) return null;
        const result = [m.group(0)];
        for (let i = 1; i <= m.groupCount(); i++) {
          const val = m.group(i);
          result.push(val === null ? void 0 : val);
        }
        result.index = m.start(0);
        result.input = input;
        const namedGroups = this.namedGroups();
        if (Object.keys(namedGroups).length > 0) {
          const parsedGroups = m.getNamedGroups();
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
        const m = this.matcher(input);
        const result = [];
        let emptiesSkipped = 0;
        let last = 0;
        while (m.find()) {
          if (last === 0 && m.end() === 0) {
            last = m.end();
            continue;
          }
          if (limit > 0 && result.length === limit - 1) break;
          if (last === m.start()) {
            if (limit === 0) {
              emptiesSkipped += 1;
              last = m.end();
              continue;
            }
          } else while (emptiesSkipped > 0) {
            result.push("");
            emptiesSkipped -= 1;
          }
          result.push(m.substring(last, m.start()));
          last = m.end();
        }
        if (limit === 0 && last !== m.inputLength()) {
          while (emptiesSkipped > 0) {
            result.push("");
            emptiesSkipped -= 1;
          }
          result.push(m.substring(last, m.inputLength()));
        }
        if (limit !== 0 || result.length === 0 && !(last === m.inputLength() && last > 0)) result.push(m.substring(last, m.inputLength()));
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
        const m = this.matcher(input);
        while (m.find()) {
          const result = [m.group(0)];
          for (let i = 1; i <= m.groupCount(); i++) {
            const groupVal = m.group(i);
            result.push(groupVal === null ? void 0 : groupVal);
          }
          result.index = m.start(0);
          result.input = input;
          const namedGroups = this.namedGroups();
          if (Object.keys(namedGroups).length > 0) {
            const parsedGroups = m.getNamedGroups();
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
    var re = (stringsOrFlags, ...values) => {
      if (Array.isArray(stringsOrFlags) && "raw" in stringsOrFlags) {
        const pattern = String.raw(stringsOrFlags, ...values);
        return RE2JS.compile(pattern);
      }
      const flags = typeof stringsOrFlags === "number" ? stringsOrFlags : 0;
      return (strings, ...tagValues) => {
        const pattern = String.raw(strings, ...tagValues);
        return RE2JS.compile(pattern, flags);
      };
    };
    exports2.Matcher = Matcher;
    exports2.MatcherInput = MatcherInput;
    exports2.MatcherInputBase = MatcherInputBase;
    exports2.RE2JS = RE2JS;
    exports2.RE2JSCompileException = RE2JSCompileException;
    exports2.RE2JSException = RE2JSException;
    exports2.RE2JSFlagsException = RE2JSFlagsException;
    exports2.RE2JSGroupException = RE2JSGroupException;
    exports2.RE2JSInternalException = RE2JSInternalException;
    exports2.RE2JSSyntaxException = RE2JSSyntaxException;
    exports2.RE2Set = RE2Set;
    exports2.re = re;
  }
});

// packages/schema/dist/settings.js
var require_settings = __commonJS({
  "packages/schema/dist/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.OctonodeSettings = exports2.OctonodeSettingsValues = exports2.OctonodeSettingsDocument = exports2.SettingsFileReference = exports2.SettingsViews = exports2.SettingsLayers = exports2.SettingsOverrides = exports2.SettingsAppearance = exports2.SettingsNodeSelector = exports2.SettingsWorkflowSelector = exports2.SettingsPresentation = exports2.SettingsDetail = exports2.SettingsDiscovery = exports2.SettingsPathPattern = void 0;
    exports2.settingsRegexMatches = settingsRegexMatches;
    var zod_1 = require("zod");
    var constants_1 = require_constants();
    var icons_1 = require_icons();
    var plugin_1 = require_plugin();
    var octonode_config_1 = require_octonode_config();
    var re2js_1 = require_build();
    var identifier = zod_1.z.string().min(1).max(240).regex(/^(?!(?:__proto__|__all__)$)/, "reserved settings key");
    var label = zod_1.z.string().min(1).max(240);
    var strings = zod_1.z.array(zod_1.z.string().min(1).max(1024)).min(1).max(1e3);
    exports2.SettingsPathPattern = zod_1.z.string().min(1).max(1024).refine((value) => {
      if (value.startsWith("regex:")) {
        try {
          if (value.length === 6)
            return false;
          re2js_1.RE2JS.compile(value.slice(6));
          return true;
        } catch {
          return false;
        }
      }
      return !value.startsWith("/") && !value.includes("\\") && !value.split("/").includes("..") && !/[[\]{}!():]/.test(value);
    }, "use project-relative globs or regex: followed by a valid RE2 expression");
    var paths = zod_1.z.array(exports2.SettingsPathPattern).max(1e3);
    function settingsRegexMatches(path, pattern) {
      return re2js_1.RE2JS.compile(pattern).matcher(path).find();
    }
    exports2.SettingsDiscovery = zod_1.z.object({
      files: zod_1.z.object({ include: paths.optional(), exclude: paths.optional() }).strict().optional()
    }).strict();
    exports2.SettingsDetail = zod_1.z.object({
      level: zod_1.z.enum(["files", "workflows", "steps"]).optional(),
      maxCallDepth: zod_1.z.number().int().min(0).max(10).optional(),
      maxDirectoryDepth: zod_1.z.number().int().min(0).max(100).optional()
    }).strict();
    exports2.SettingsPresentation = zod_1.z.object({
      label: label.optional(),
      description: zod_1.z.string().max(4e3).optional(),
      icon: icons_1.IconName.optional(),
      color: zod_1.z.string().regex(/^(?:[a-z][a-z0-9-]*|#[0-9a-fA-F]{6})$/).optional(),
      style: zod_1.z.object({
        density: zod_1.z.enum(["compact", "comfortable"]).optional(),
        radius: zod_1.z.enum(["sharp", "soft"]).optional()
      }).strict().optional(),
      renderer: identifier.optional()
    }).strict();
    var workflowMatch = zod_1.z.object({
      ids: strings.optional(),
      sourcePaths: paths.refine((values) => values.length > 0).optional(),
      symbols: strings.optional(),
      folders: strings.optional(),
      tagsAny: strings.optional(),
      exported: zod_1.z.boolean().optional()
    }).strict();
    var nodeMatch = zod_1.z.object({
      ids: strings.optional(),
      kinds: zod_1.z.array(octonode_config_1.NodeKind).min(1).optional(),
      native: strings.optional(),
      plugins: strings.optional()
    }).strict();
    exports2.SettingsWorkflowSelector = workflowMatch.refine((value) => Object.keys(value).length > 0, {
      message: "a workflow selector needs at least one condition"
    });
    exports2.SettingsNodeSelector = nodeMatch.refine((value) => Object.keys(value).length > 0, {
      message: "a node selector needs at least one condition"
    });
    var workflowViewSelector = workflowMatch.extend({ layersAny: strings.optional() }).refine((value) => Object.keys(value).length > 0, { message: "a workflow selector needs at least one condition" });
    var nodeViewSelector = nodeMatch.extend({ layersAny: strings.optional() }).refine((value) => Object.keys(value).length > 0, { message: "a node selector needs at least one condition" });
    exports2.SettingsAppearance = zod_1.z.object({
      nodeDefaults: exports2.SettingsPresentation.optional(),
      workflowDefaults: exports2.SettingsPresentation.optional(),
      native: zod_1.z.record(identifier, exports2.SettingsPresentation).optional(),
      plugins: zod_1.z.record(identifier, exports2.SettingsPresentation).optional(),
      rules: zod_1.z.array(zod_1.z.discriminatedUnion("target", [
        zod_1.z.object({
          id: identifier,
          target: zod_1.z.literal("node"),
          match: exports2.SettingsNodeSelector,
          presentation: exports2.SettingsPresentation
        }).strict(),
        zod_1.z.object({
          id: identifier,
          target: zod_1.z.literal("workflow"),
          match: exports2.SettingsWorkflowSelector,
          presentation: exports2.SettingsPresentation
        }).strict()
      ])).max(1e3).optional()
    }).strict();
    exports2.SettingsOverrides = zod_1.z.object({
      nodes: zod_1.z.record(identifier, exports2.SettingsPresentation).optional(),
      workflows: zod_1.z.record(identifier, zod_1.z.object({
        presentation: exports2.SettingsPresentation.optional(),
        nodePresentation: zod_1.z.record(identifier, exports2.SettingsPresentation).optional()
      }).strict()).optional()
    }).strict();
    exports2.SettingsLayers = zod_1.z.record(identifier, zod_1.z.object({
      label: label.optional(),
      workflows: zod_1.z.array(exports2.SettingsWorkflowSelector).min(1).max(1e3).optional(),
      nodes: zod_1.z.array(exports2.SettingsNodeSelector).min(1).max(1e3).optional()
    }).strict().refine((value) => value.workflows !== void 0 || value.nodes !== void 0, {
      message: "a layer needs workflow or node selectors"
    }));
    exports2.SettingsViews = zod_1.z.record(identifier, zod_1.z.object({
      label: label.optional(),
      groupBy: zod_1.z.enum(["source", "folder", "flat", "architecture"]).optional(),
      detail: exports2.SettingsDetail.optional(),
      workflows: zod_1.z.object({
        exportedOnly: zod_1.z.boolean().optional(),
        includeModules: zod_1.z.boolean().optional(),
        include: zod_1.z.array(workflowViewSelector).max(1e3).optional(),
        exclude: zod_1.z.array(workflowViewSelector).max(1e3).optional()
      }).strict().optional(),
      navigation: zod_1.z.object({ collapsedPaths: strings.optional() }).strict().optional(),
      canvas: zod_1.z.object({
        hideCallsToHiddenWorkflows: zod_1.z.boolean().optional(),
        include: zod_1.z.array(nodeViewSelector).max(1e3).optional(),
        exclude: zod_1.z.array(nodeViewSelector).max(1e3).optional(),
        collapseLayers: strings.optional()
      }).strict().optional()
    }).strict());
    exports2.SettingsFileReference = zod_1.z.object({ $file: zod_1.z.string().min(1).max(1024) }).strict();
    exports2.OctonodeSettingsDocument = zod_1.z.object({
      $schema: zod_1.z.string().optional(),
      apiVersion: zod_1.z.literal(constants_1.SETTINGS_API_VERSION),
      plugin: plugin_1.PluginManifest.optional(),
      defaultView: identifier.optional(),
      discovery: zod_1.z.union([exports2.SettingsFileReference, exports2.SettingsDiscovery]).optional(),
      appearance: zod_1.z.union([exports2.SettingsFileReference, exports2.SettingsAppearance]).optional(),
      overrides: zod_1.z.union([exports2.SettingsFileReference, exports2.SettingsOverrides]).optional(),
      layers: zod_1.z.union([exports2.SettingsFileReference, exports2.SettingsLayers]).optional(),
      views: zod_1.z.union([exports2.SettingsFileReference, exports2.SettingsViews]).optional()
    }).strict();
    exports2.OctonodeSettingsValues = zod_1.z.object({
      $schema: zod_1.z.string().optional(),
      apiVersion: zod_1.z.literal(constants_1.SETTINGS_API_VERSION),
      plugin: plugin_1.PluginManifest.optional(),
      defaultView: identifier.optional(),
      discovery: exports2.SettingsDiscovery.optional(),
      appearance: exports2.SettingsAppearance.optional(),
      overrides: exports2.SettingsOverrides.optional(),
      layers: exports2.SettingsLayers.optional(),
      views: exports2.SettingsViews.optional()
    }).strict();
    exports2.OctonodeSettings = exports2.OctonodeSettingsValues.superRefine((settings, ctx) => {
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
  }
});

// packages/schema/dist/access-tokens.js
var require_access_tokens = __commonJS({
  "packages/schema/dist/access-tokens.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.accessTokenUpdateSchema = exports2.accessTokenCreateSchema = exports2.accessTokenOriginSchema = exports2.accessTokenListQuerySchema = void 0;
    var zod_1 = require("zod");
    var constants_1 = require_constants();
    exports2.accessTokenListQuerySchema = zod_1.z.object({
      type: zod_1.z.enum(["personal", "service", "public"]).optional(),
      search: zod_1.z.string().trim().max(200).default(""),
      sort: zod_1.z.enum(["name", "createdAt", "lastUsedAt"]).default("createdAt"),
      order: zod_1.z.enum(["asc", "desc"]).default("desc"),
      limit: zod_1.z.coerce.number().int().min(1).max(100).default(25),
      offset: zod_1.z.coerce.number().int().min(0).max(1e6).default(0)
    });
    exports2.accessTokenOriginSchema = zod_1.z.string().max(2048).refine((value) => {
      try {
        const url = new URL(value);
        return url.protocol === "https:" && url.origin === value && !url.hostname.includes("*");
      } catch {
        return false;
      }
    }, "Expected an exact HTTPS origin");
    exports2.accessTokenCreateSchema = zod_1.z.object({
      name: zod_1.z.string().trim().min(1).max(128),
      type: zod_1.z.enum(["personal", "service", "public"]).default("personal"),
      workspaceId: zod_1.z.string().regex(/^(user|org|team):[^:]+$/).max(256).optional(),
      scopes: zod_1.z.array(zod_1.z.enum(["*", ...constants_1.WORKSPACE_ACTIONS])).min(1).max(constants_1.WORKSPACE_ACTIONS.length).optional(),
      allowedOrigins: zod_1.z.array(exports2.accessTokenOriginSchema).max(32).optional(),
      expiresAt: zod_1.z.string().datetime().optional()
    }).strict();
    exports2.accessTokenUpdateSchema = exports2.accessTokenCreateSchema.pick({ name: true, scopes: true, allowedOrigins: true }).partial().strict();
  }
});

// packages/schema/dist/github.js
var require_github = __commonJS({
  "packages/schema/dist/github.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.GitHubUserRepositories = exports2.GitHubUserRepositoriesQuery = exports2.GitHubAutoSyncUpdate = exports2.GitHubAutoSyncSettings = exports2.GitHubAutoSyncDispatch = exports2.GitHubAutoSyncTarget = void 0;
    exports2.githubRepositoryUrl = githubRepositoryUrl;
    var zod_1 = require("zod");
    exports2.GitHubAutoSyncTarget = zod_1.z.object({
      architectureId: zod_1.z.string().min(1).max(128),
      fullName: zod_1.z.string().regex(/^[\w.-]+\/[\w.-]+$/),
      branch: zod_1.z.string().min(1).max(1024),
      sha: zod_1.z.string().regex(/^[a-f0-9]{40}$/),
      projectIds: zod_1.z.array(zod_1.z.string().min(1).max(128)).min(1).max(1e3)
    });
    exports2.GitHubAutoSyncDispatch = exports2.GitHubAutoSyncTarget.extend({
      workspace: zod_1.z.object({ kind: zod_1.z.enum(["user", "org", "team"]), id: zod_1.z.string().min(1).max(128) }),
      userId: zod_1.z.string().min(1).max(128)
    });
    exports2.GitHubAutoSyncSettings = zod_1.z.object({
      connected: zod_1.z.boolean(),
      enabled: zod_1.z.boolean(),
      ready: zod_1.z.boolean()
    });
    exports2.GitHubAutoSyncUpdate = zod_1.z.object({ enabled: zod_1.z.boolean() }).strict();
    function githubRepositoryUrl(value) {
      const match = value.trim().match(/^(?:https:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/i);
      return match ? `https://github.com/${match[1].toLowerCase()}/${match[2].toLowerCase()}.git` : void 0;
    }
    exports2.GitHubUserRepositoriesQuery = zod_1.z.object({
      page: zod_1.z.coerce.number().int().min(1).max(1e4).default(1)
    });
    exports2.GitHubUserRepositories = zod_1.z.object({
      items: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.number().int(),
        full_name: zod_1.z.string(),
        clone_url: zod_1.z.string().url(),
        private: zod_1.z.boolean(),
        updated_at: zod_1.z.string().nullable()
      })),
      hasMore: zod_1.z.boolean()
    });
  }
});

// packages/schema/dist/project-lifecycle.js
var require_project_lifecycle = __commonJS({
  "packages/schema/dist/project-lifecycle.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ProjectLifecycleRecord = exports2.ProjectLifecycle = void 0;
    var zod_1 = require("zod");
    exports2.ProjectLifecycle = zod_1.z.object({
      id: zod_1.z.string().min(1),
      name: zod_1.z.string(),
      state: zod_1.z.enum(["archived", "deleted"]),
      changedAt: zod_1.z.number(),
      expiresAt: zod_1.z.number().optional(),
      purgedAt: zod_1.z.number().optional()
    });
    exports2.ProjectLifecycleRecord = exports2.ProjectLifecycle.extend({
      configPath: zod_1.z.string(),
      projectRoot: zod_1.z.string(),
      storeDir: zod_1.z.string(),
      configFingerprint: zod_1.z.string(),
      canonicalId: zod_1.z.string()
    });
  }
});

// packages/schema/dist/project-jobs.js
var require_project_jobs = __commonJS({
  "packages/schema/dist/project-jobs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ProjectJobNotification = exports2.ProjectJobStatus = exports2.ProjectJobResult = exports2.ProjectJobInput = void 0;
    var zod_1 = require("zod");
    var identity = { idempotencyKey: zod_1.z.string().uuid() };
    exports2.ProjectJobInput = zod_1.z.discriminatedUnion("kind", [
      zod_1.z.object({
        ...identity,
        kind: zod_1.z.literal("import"),
        provider: zod_1.z.enum(["git", "github"]),
        url: zod_1.z.string().trim().min(1).max(2048).refine((value) => {
          if (/[\r\n\0]/.test(value) || value.includes("::"))
            return false;
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
        dir: zod_1.z.string().trim().min(1).max(240).optional()
      }).strict(),
      zod_1.z.object({ ...identity, kind: zod_1.z.literal("compile"), projectId: zod_1.z.string().min(1).max(240) }).strict()
    ]);
    exports2.ProjectJobResult = zod_1.z.object({
      projects: zod_1.z.array(zod_1.z.object({ projectId: zod_1.z.string() })),
      success: zod_1.z.boolean(),
      diagnostics: zod_1.z.array(zod_1.z.object({
        severity: zod_1.z.enum(["error", "warning"]),
        code: zod_1.z.string(),
        message: zod_1.z.string(),
        path: zod_1.z.string().optional()
      }))
    });
    exports2.ProjectJobStatus = zod_1.z.object({
      jobId: zod_1.z.string(),
      status: zod_1.z.enum(["queued", "running", "succeeded", "failed"]),
      phase: zod_1.z.enum(["queued", "importing", "compiling", "saving", "complete"]),
      createdAt: zod_1.z.number(),
      updatedAt: zod_1.z.number(),
      result: exports2.ProjectJobResult.optional(),
      error: zod_1.z.string().optional()
    });
    exports2.ProjectJobNotification = zod_1.z.object({
      jobId: zod_1.z.string().regex(/^[a-f0-9]{64}$/),
      userId: zod_1.z.string().min(1).max(128),
      kind: zod_1.z.enum(["import", "compile"]),
      status: zod_1.z.enum(["succeeded", "failed"]),
      projectId: zod_1.z.string().min(1).max(240).optional(),
      compilationSucceeded: zod_1.z.boolean().optional(),
      timestamp: zod_1.z.number().int().nonnegative()
    }).strict();
  }
});

// packages/schema/dist/plugin-version.js
var require_plugin_version = __commonJS({
  "packages/schema/dist/plugin-version.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PluginVersion = void 0;
    exports2.comparePluginVersions = comparePluginVersions;
    exports2.bumpPluginVersion = bumpPluginVersion;
    var zod_1 = require("zod");
    exports2.PluginVersion = zod_1.z.string().max(200).regex(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?$/, "Use a semantic version such as 1.2.3 or 2.0.0-beta.1");
    function comparePluginVersions(left, right) {
      const validLeft = exports2.PluginVersion.safeParse(left).success;
      const validRight = exports2.PluginVersion.safeParse(right).success;
      if (!validLeft || !validRight)
        return Number(validLeft) - Number(validRight) || left.localeCompare(right);
      const [leftCore, ...leftPre] = left.split("+")[0].split("-");
      const [rightCore, ...rightPre] = right.split("+")[0].split("-");
      const numeric = (a2, b2) => a2.length - b2.length || (a2 > b2 ? 1 : a2 < b2 ? -1 : 0);
      const a = leftCore.split(".");
      const b = rightCore.split(".");
      for (let i = 0; i < 3; i++) {
        const difference = numeric(a[i], b[i]);
        if (difference)
          return difference;
      }
      if (!leftPre.length || !rightPre.length)
        return Number(!leftPre.length) - Number(!rightPre.length);
      const ap = leftPre.join("-").split(".");
      const bp = rightPre.join("-").split(".");
      for (let i = 0; i < Math.min(ap.length, bp.length); i++) {
        if (ap[i] === bp[i])
          continue;
        const an = /^\d+$/.test(ap[i]);
        const bn = /^\d+$/.test(bp[i]);
        return an && bn ? numeric(ap[i], bp[i]) : an !== bn ? Number(bn) - Number(an) : ap[i] > bp[i] ? 1 : -1;
      }
      return ap.length - bp.length;
    }
    function bumpPluginVersion(version, release2) {
      exports2.PluginVersion.parse(version);
      const core = version.split("+")[0];
      const prerelease = core.includes("-");
      let [major, minor, patch] = core.split("-")[0].split(".").map(BigInt);
      if (release2 === "major") {
        major += !prerelease || minor !== 0n || patch !== 0n ? 1n : 0n;
        minor = 0n;
        patch = 0n;
      } else if (release2 === "minor") {
        minor += !prerelease || patch !== 0n ? 1n : 0n;
        patch = 0n;
      } else
        patch += prerelease ? 0n : 1n;
      return exports2.PluginVersion.parse(`${major}.${minor}.${patch}`);
    }
  }
});

// packages/schema/dist/plugin/execution.constants.js
var require_execution_constants = __commonJS({
  "packages/schema/dist/plugin/execution.constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PREPARED_RUNTIME_ARCHIVE = exports2.PREPARED_RUNTIME_MAX_FILES = exports2.PREPARED_RUNTIME_MAX_BYTES = exports2.PLUGIN_EXECUTION_TIMEOUT_MS = exports2.PLUGIN_EXECUTION_MAX_BYTES = exports2.PLUGIN_RUNNER_PORT = exports2.PLUGIN_RUNNER_ORIGIN = void 0;
    exports2.PLUGIN_RUNNER_ORIGIN = "http://plugin-runner.octonode.internal";
    exports2.PLUGIN_RUNNER_PORT = 4001;
    exports2.PLUGIN_EXECUTION_MAX_BYTES = 1024 * 1024;
    exports2.PLUGIN_EXECUTION_TIMEOUT_MS = 5 * 6e4;
    exports2.PREPARED_RUNTIME_MAX_BYTES = 256 * 1024 * 1024;
    exports2.PREPARED_RUNTIME_MAX_FILES = 5e4;
    exports2.PREPARED_RUNTIME_ARCHIVE = "octonode-runtime.tgz";
  }
});

// packages/schema/dist/plugin/execution.js
var require_execution = __commonJS({
  "packages/schema/dist/plugin/execution.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AuthorizedPluginRelease = exports2.PluginExecutionRequest = exports2.PluginExecutionReference = exports2.PreparedPluginRuntime = void 0;
    var zod_1 = require("zod");
    var ipc_envelope_1 = require_ipc_envelope();
    var plugin_1 = require_plugin();
    var execution_constants_1 = require_execution_constants();
    exports2.PreparedPluginRuntime = zod_1.z.object({
      format: zod_1.z.literal(1),
      nodeMajor: zod_1.z.literal(24),
      platform: zod_1.z.enum(["portable", "linux", "darwin"]),
      arch: zod_1.z.string().max(32).optional(),
      libc: zod_1.z.string().max(64).optional(),
      dependencies: zod_1.z.literal(execution_constants_1.PREPARED_RUNTIME_ARCHIVE).optional()
    }).strict();
    exports2.PluginExecutionReference = zod_1.z.object({
      installId: zod_1.z.string().uuid(),
      sha256: zod_1.z.string().regex(/^sha256:[a-f0-9]{64}$/),
      nodeId: zod_1.z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i)
    }).strict();
    exports2.PluginExecutionRequest = zod_1.z.object({
      plugin: exports2.PluginExecutionReference,
      request: ipc_envelope_1.InvokeRequest,
      environment: zod_1.z.record(zod_1.z.string().regex(/^[a-z_][a-z0-9_]*$/i), zod_1.z.string().max(65536).refine((value) => !value.includes("\0"))).default({}),
      timeoutMs: zod_1.z.number().int().positive().max(execution_constants_1.PLUGIN_EXECUTION_TIMEOUT_MS).default(execution_constants_1.PLUGIN_EXECUTION_TIMEOUT_MS)
    }).strict();
    exports2.AuthorizedPluginRelease = zod_1.z.object({
      manifest: plugin_1.PluginManifest,
      archiveSha256: zod_1.z.string().regex(/^[a-f0-9]{64}$/)
    });
  }
});

// packages/schema/dist/plugin-publishing.js
var require_plugin_publishing = __commonJS({
  "packages/schema/dist/plugin-publishing.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PluginPublisherConnections = exports2.PluginPublisherConnection = exports2.PluginPublisherPreview = exports2.PluginPublisherConsent = exports2.PluginPublisherAutomatic = exports2.PluginPublisherRepository = exports2.PluginPublisherInput = exports2.pluginReleaseScope = exports2.PluginReleaseConfig = exports2.PluginConfigPath = void 0;
    var zod_1 = require("zod");
    var plugin_version_1 = require_plugin_version();
    exports2.PluginConfigPath = zod_1.z.string().max(512).refine((path) => /^(?:[a-zA-Z0-9_.-]+\/)*(?:plugin\.octonode\.(?:json|ya?ml)|octonode\.plugin\.json)$/.test(path) && !path.split("/").some((part) => [".", "..", ".git", "node_modules"].includes(part)), "Select a repository-relative octonode.plugin.json file (older plugin.octonode release files also work)");
    exports2.PluginReleaseConfig = zod_1.z.object({
      apiVersion: zod_1.z.literal("octonode.plugin/v1"),
      id: zod_1.z.string().max(128).regex(/^[a-z0-9][a-z0-9-]*$/),
      version: plugin_version_1.PluginVersion,
      scope: zod_1.z.enum(["user", "team", "organization", "public"]),
      teamId: zod_1.z.string().min(1).max(128).optional(),
      orgId: zod_1.z.string().min(1).max(128).optional(),
      contributors: zod_1.z.array(zod_1.z.string().trim().min(1).max(240)).max(100).optional(),
      workflow: zod_1.z.string().regex(/^\.github\/workflows\/[a-zA-Z0-9_-]+\.ya?ml$/).default(".github/workflows/octonode-publish.yml")
    }).strict().superRefine((config, ctx) => {
      if (config.scope === "team" !== Boolean(config.teamId))
        ctx.addIssue({ code: "custom", path: ["teamId"], message: "teamId is required only for team scope" });
      if (config.scope === "organization" !== Boolean(config.orgId))
        ctx.addIssue({ code: "custom", path: ["orgId"], message: "orgId is required only for organization scope" });
    });
    var pluginReleaseScope = (config) => config.scope === "team" ? "group" : config.scope === "organization" ? "org" : config.scope;
    exports2.pluginReleaseScope = pluginReleaseScope;
    exports2.PluginPublisherInput = zod_1.z.object({ repositoryId: zod_1.z.number().int().positive(), configPath: exports2.PluginConfigPath }).strict();
    exports2.PluginPublisherRepository = exports2.PluginPublisherInput.pick({ repositoryId: true });
    exports2.PluginPublisherAutomatic = zod_1.z.object({
      ok: zod_1.z.boolean(),
      connected: zod_1.z.number(),
      workflow: zod_1.z.string()
    });
    exports2.PluginPublisherConsent = exports2.PluginPublisherInput.extend({ sha256: zod_1.z.string().regex(/^[a-f0-9]{64}$/) });
    exports2.PluginPublisherPreview = zod_1.z.object({
      config: exports2.PluginReleaseConfig,
      sha256: zod_1.z.string(),
      repository: zod_1.z.string(),
      branch: zod_1.z.string()
    });
    exports2.PluginPublisherConnection = exports2.PluginPublisherPreview.extend({
      id: zod_1.z.string().uuid(),
      repositoryId: zod_1.z.number(),
      configPath: exports2.PluginConfigPath,
      lastVersion: zod_1.z.string().nullable(),
      lastSha: zod_1.z.string().nullable(),
      lastPublishedAt: zod_1.z.number().nullable()
    });
    exports2.PluginPublisherConnections = zod_1.z.object({ items: zod_1.z.array(exports2.PluginPublisherConnection) });
  }
});

// packages/schema/dist/index.js
var require_dist = __commonJS({
  "packages/schema/dist/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.schemaVersion = exports2.octonodeJsonSchema = void 0;
    __exportStar(require_ipc_envelope(), exports2);
    __exportStar(require_octonode_config(), exports2);
    __exportStar(require_workflow_entry(), exports2);
    __exportStar(require_store(), exports2);
    __exportStar(require_data_tables(), exports2);
    __exportStar(require_data_table_schema(), exports2);
    __exportStar(require_workflow_layout(), exports2);
    __exportStar(require_source_index(), exports2);
    __exportStar(require_test_workflow_graph(), exports2);
    __exportStar(require_collaboration(), exports2);
    __exportStar(require_task_management(), exports2);
    __exportStar(require_design_collaboration(), exports2);
    __exportStar(require_design_documents(), exports2);
    __exportStar(require_analytics_dashboard(), exports2);
    __exportStar(require_capabilities(), exports2);
    __exportStar(require_agent_chat(), exports2);
    __exportStar(require_knowledge(), exports2);
    __exportStar(require_architecture(), exports2);
    __exportStar(require_repository_registry(), exports2);
    __exportStar(require_community_publications(), exports2);
    __exportStar(require_community_media(), exports2);
    __exportStar(require_community_media_types(), exports2);
    __exportStar(require_workflow_templates(), exports2);
    __exportStar(require_constants(), exports2);
    var json_schema_1 = require_json_schema();
    Object.defineProperty(exports2, "octonodeJsonSchema", { enumerable: true, get: function() {
      return json_schema_1.octonodeJsonSchema;
    } });
    Object.defineProperty(exports2, "schemaVersion", { enumerable: true, get: function() {
      return json_schema_1.schemaVersion;
    } });
    __exportStar(require_icons(), exports2);
    __exportStar(require_settings(), exports2);
    __exportStar(require_access_tokens(), exports2);
    __exportStar(require_plugin(), exports2);
    __exportStar(require_github(), exports2);
    __exportStar(require_workflow_triggers(), exports2);
    __exportStar(require_project_lifecycle(), exports2);
    __exportStar(require_project_jobs(), exports2);
    __exportStar(require_plugin_version(), exports2);
    __exportStar(require_execution(), exports2);
    __exportStar(require_execution_constants(), exports2);
    __exportStar(require_plugin_publishing(), exports2);
  }
});

// packages/plugin-runtime/dist/json-schema.js
var require_json_schema2 = __commonJS({
  "packages/plugin-runtime/dist/json-schema.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.validate = validate;
    function validate(schema, data) {
      if (!schema)
        return [];
      const errors = [];
      walk(schema, data, "$", errors);
      return errors;
    }
    function walk(schema, data, path, errors) {
      const allowed = normalizeTypes(schema.type);
      if (allowed.length > 0 && !allowed.some((t) => matchesType(t, data))) {
        errors.push({ path, message: `expected type ${allowed.join("|")}, got ${jsonType(data)}` });
        return;
      }
      if (Array.isArray(schema.enum) && !schema.enum.some((v) => deepEqual(v, data))) {
        errors.push({ path, message: `value is not one of the allowed enum values` });
      }
      if (isPlainObject(data)) {
        const required = Array.isArray(schema.required) ? schema.required : [];
        for (const key of required) {
          if (!(key in data))
            errors.push({ path: `${path}.${key}`, message: `missing required property` });
        }
        const props = isPlainObject(schema.properties) ? schema.properties : void 0;
        if (props) {
          for (const [key, sub] of Object.entries(props)) {
            if (key in data && isPlainObject(sub)) {
              walk(sub, data[key], `${path}.${key}`, errors);
            }
          }
        }
      }
      if (Array.isArray(data) && isPlainObject(schema.items)) {
        data.forEach((item, i) => walk(schema.items, item, `${path}[${i}]`, errors));
      }
    }
    function normalizeTypes(type) {
      if (typeof type === "string")
        return [type];
      if (Array.isArray(type))
        return type.filter((t) => typeof t === "string");
      return [];
    }
    function matchesType(type, data) {
      switch (type) {
        case "object":
          return isPlainObject(data);
        case "array":
          return Array.isArray(data);
        case "string":
          return typeof data === "string";
        case "number":
          return typeof data === "number" && Number.isFinite(data);
        case "integer":
          return typeof data === "number" && Number.isInteger(data);
        case "boolean":
          return typeof data === "boolean";
        case "null":
          return data === null;
        default:
          return true;
      }
    }
    function jsonType(data) {
      if (data === null)
        return "null";
      if (Array.isArray(data))
        return "array";
      return typeof data;
    }
    function isPlainObject(v) {
      return typeof v === "object" && v !== null && !Array.isArray(v);
    }
    function deepEqual(a, b) {
      return JSON.stringify(a) === JSON.stringify(b);
    }
  }
});

// packages/plugin-runtime/dist/runner.js
var require_runner = __commonJS({
  "packages/plugin-runtime/dist/runner.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.NodeError = void 0;
    exports2.processRequest = processRequest;
    exports2.jsonSafetyError = jsonSafetyError;
    exports2.runNode = runNode;
    exports2.start = start;
    var node_console_1 = require("node:console");
    var schema_1 = require_dist();
    var json_schema_1 = require_json_schema2();
    var LANGUAGE = "typescript";
    var NodeError = class extends Error {
      constructor(message, opts) {
        super(message);
        this.name = "NodeError";
        this.retryable = opts?.retryable ?? false;
        this.code = this.retryable ? "RUNTIME_ERROR" : "NON_RETRYABLE";
      }
    };
    exports2.NodeError = NodeError;
    function manifestOf(node, requestedNode) {
      if (isExplicitService(node)) {
        const methodName = requestedServiceMethod(node, requestedNode);
        if (methodName) {
          const method = node.service.methods[methodName];
          return {
            id: `${node.id}.${methodName}`,
            language: LANGUAGE,
            inputs: method.inputs,
            outputs: method.outputs,
            icon: node.icon
          };
        }
      }
      return {
        id: node.id,
        ...node.workflowId ? { workflowId: node.workflowId } : {},
        language: LANGUAGE,
        label: node.label,
        description: node.description,
        symbol: node.symbol,
        defaults: node.defaults,
        inputs: node.inputs,
        outputs: node.outputs,
        kind: node.kind,
        setup: node.setup,
        icon: node.icon,
        config: node.config,
        service: isExplicitService(node) ? {
          lifecycle: node.service.lifecycle,
          methods: Object.entries(node.service.methods).map(([name, spec]) => ({
            name,
            params: spec.params ?? [],
            inputs: spec.inputs,
            outputs: spec.outputs
          }))
        } : void 0
      };
    }
    var workerServiceInstances = /* @__PURE__ */ new WeakMap();
    var runServiceInstances = /* @__PURE__ */ new WeakMap();
    var isExplicitService = (node) => node.kind === "service" && "service" in node && !!node.service;
    function requestedServiceMethod(node, requested) {
      if (!requested || requested === node.id)
        return void 0;
      const prefix = `${node.id}.`;
      const method = requested.startsWith(prefix) ? requested.slice(prefix.length) : requested;
      return method in node.service.methods ? method : void 0;
    }
    async function serviceInstance(node, context, invocationId) {
      if (node.service.lifecycle === "invocation")
        return node.service.create(context);
      if (node.service.lifecycle === "worker") {
        let instance2 = workerServiceInstances.get(node);
        if (!instance2) {
          instance2 = Promise.resolve(node.service.create(context));
          workerServiceInstances.set(node, instance2);
        }
        return instance2;
      }
      let runs = runServiceInstances.get(node);
      if (!runs) {
        runs = /* @__PURE__ */ new Map();
        runServiceInstances.set(node, runs);
      }
      const key = context.runId ?? invocationId;
      let instance = runs.get(key);
      if (!instance) {
        instance = Promise.resolve(node.service.create(context));
        runs.set(key, instance);
        if (runs.size > 100)
          runs.delete(runs.keys().next().value);
      }
      return instance;
    }
    async function invokeServiceMethod(node, methodName, spec, inputs, context, invocationId) {
      const instance = await serviceInstance(node, context, invocationId);
      const method = instance[methodName];
      if (typeof method !== "function")
        throw new Error(`service "${node.id}" does not implement exposed method "${methodName}"`);
      const record = inputs && typeof inputs === "object" ? inputs : { value: inputs };
      const args = spec.params?.length ? spec.params.map((name) => record[name]) : [inputs];
      return method.apply(instance, args);
    }
    async function processRequest(node, raw) {
      let request;
      let invocationId = "unknown";
      try {
        request = schema_1.RequestEnvelope.parse(JSON.parse(raw.trim()));
        invocationId = request.invocationId;
      } catch (err) {
        return (0, schema_1.makeErrorResult)(invocationId, {
          code: "VALIDATION_ERROR",
          message: `Invalid request envelope on stdin: ${describe(err)}`,
          retryable: false
        });
      }
      if (request.type === "describe") {
        try {
          return (0, schema_1.makeManifestResult)(invocationId, manifestOf(node, request.node));
        } catch (err) {
          return (0, schema_1.makeManifestError)(invocationId, {
            code: "RUNTIME_ERROR",
            message: `Failed to build manifest: ${describe(err)}`,
            retryable: false
          });
        }
      }
      const serviceMethod = isExplicitService(node) ? requestedServiceMethod(node, request.node) : void 0;
      if (isExplicitService(node) && request.node && request.node !== node.id && !serviceMethod) {
        return (0, schema_1.makeErrorResult)(invocationId, {
          code: "VALIDATION_ERROR",
          message: `service method not exposed: ${request.node}`,
          retryable: false
        });
      }
      const methodSpec = serviceMethod && isExplicitService(node) ? node.service.methods[serviceMethod] : void 0;
      const inputs = node.defaults && request.inputs && typeof request.inputs === "object" && !Array.isArray(request.inputs) ? { ...node.defaults, ...request.inputs } : request.inputs;
      const inputErrors = (0, json_schema_1.validate)(methodSpec?.inputs ?? node.inputs, inputs);
      if (inputErrors.length > 0) {
        return (0, schema_1.makeErrorResult)(invocationId, {
          code: "VALIDATION_ERROR",
          message: `Inputs failed schema validation: ${inputErrors[0].path} ${inputErrors[0].message}`,
          retryable: false,
          details: { errors: inputErrors }
        });
      }
      let outputs;
      try {
        outputs = serviceMethod && isExplicitService(node) ? await invokeServiceMethod(node, serviceMethod, methodSpec ?? {}, inputs, request.context, invocationId) : await node.run(inputs, request.context);
      } catch (err) {
        if (err instanceof NodeError) {
          return (0, schema_1.makeErrorResult)(invocationId, {
            code: err.code,
            message: err.message,
            retryable: err.retryable,
            stack: err.stack
          });
        }
        return (0, schema_1.makeErrorResult)(invocationId, {
          code: "RUNTIME_ERROR",
          message: describe(err),
          retryable: false,
          stack: err instanceof Error ? err.stack : void 0
        });
      }
      const outputErrors = (0, json_schema_1.validate)(methodSpec?.outputs ?? node.outputs, outputs);
      if (outputErrors.length > 0) {
        return (0, schema_1.makeErrorResult)(invocationId, {
          code: "VALIDATION_ERROR",
          message: `Outputs failed schema validation: ${outputErrors[0].path} ${outputErrors[0].message}`,
          retryable: false,
          details: { errors: outputErrors }
        });
      }
      let serializationError;
      try {
        serializationError = jsonSafetyError(outputs);
      } catch (err) {
        serializationError = `output inspection failed: ${describe(err)}`;
      }
      if (serializationError) {
        return (0, schema_1.makeErrorResult)(invocationId, {
          code: "VALIDATION_ERROR",
          message: `Outputs must be losslessly JSON-serializable: ${serializationError}`,
          retryable: false
        });
      }
      return (0, schema_1.makeOkResult)(invocationId, outputs);
    }
    function jsonSafetyError(value, path = "$", ancestors = /* @__PURE__ */ new Set()) {
      if (value === null || typeof value === "string" || typeof value === "boolean")
        return void 0;
      if (typeof value === "number")
        return Number.isFinite(value) ? void 0 : `${path} is not a finite number`;
      if (typeof value !== "object")
        return `${path} has type ${typeof value}`;
      if (ancestors.has(value))
        return `${path} is cyclic`;
      ancestors.add(value);
      try {
        if (Array.isArray(value)) {
          for (let index = 0; index < value.length; index++) {
            if (!(index in value))
              return `${path}[${index}] is an array hole`;
            const error = jsonSafetyError(value[index], `${path}[${index}]`, ancestors);
            if (error)
              return error;
          }
          return void 0;
        }
        const prototype = Object.getPrototypeOf(value);
        if (prototype !== Object.prototype && prototype !== null)
          return `${path} is not a plain object`;
        if (Object.getOwnPropertySymbols(value).length)
          return `${path} has symbol keys`;
        for (const [key, item] of Object.entries(value)) {
          const error = jsonSafetyError(item, `${path}.${key}`, ancestors);
          if (error)
            return error;
        }
        return void 0;
      } finally {
        ancestors.delete(value);
      }
    }
    function write(envelope) {
      process.stdout.write(JSON.stringify(envelope) + "\n");
    }
    async function runNode(node) {
      const stdin = process.stdin;
      stdin.setEncoding("utf8");
      let buffer = "";
      const queue = [];
      let draining = false;
      let ended = false;
      let done;
      const finished = new Promise((resolve7) => done = resolve7);
      const drain = async () => {
        if (draining)
          return;
        draining = true;
        while (queue.length > 0) {
          const line = queue.shift();
          if (line.trim().length > 0)
            write(await processRequest(node, line));
        }
        draining = false;
        if (ended)
          done();
      };
      stdin.on("data", (chunk) => {
        buffer += chunk;
        let idx;
        while ((idx = buffer.indexOf("\n")) >= 0) {
          queue.push(buffer.slice(0, idx));
          buffer = buffer.slice(idx + 1);
        }
        void drain();
      });
      stdin.on("end", () => {
        if (buffer.length > 0)
          queue.push(buffer);
        buffer = "";
        ended = true;
        void drain();
        if (!draining && queue.length === 0)
          done();
      });
      return finished;
    }
    function describe(err) {
      return err instanceof Error ? err.message : String(err);
    }
    function start(node) {
      globalThis.console = new node_console_1.Console({ stdout: process.stderr, stderr: process.stderr });
      runNode(node).then(() => {
        process.exitCode = 0;
      }).catch((err) => {
        process.stderr.write(`octonode runner failure: ${describe(err)}
`);
        process.exitCode = 1;
      });
    }
  }
});

// packages/common/dist/constants.js
var require_constants2 = __commonJS({
  "packages/common/dist/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PYTHONPATH = exports2.PORT = exports2.PATH = exports2.OPENROUTER_API_KEY = exports2.CLOUDFLARE_ACCOUNT_ID = exports2.CLOUDFLARE_API_KEY = exports2.OPENAI_API_KEY = exports2.OTEL_SERVICE_NAME = exports2.OTEL_SDK_DISABLED = exports2.OTEL_EXPORTER_OTLP_ENDPOINT = exports2.OCTONODE_WORKSPACE = exports2.OCTONODE_VISUAL_PORT = exports2.OCTONODE_USER_EMAIL = exports2.OCTONODE_USER = exports2.OCTONODE_STUDIO_URL = exports2.OCTONODE_STORE_DIR = exports2.OCTONODE_SOURCE_WATCH_CONCURRENCY = exports2.OCTONODE_SHUTDOWN_TIMEOUT_MS = exports2.OCTONODE_SERVER_PROFILE = exports2.OCTONODE_RUNTIME = exports2.OCTONODE_REPOSITORY_REGISTRY_V2 = exports2.OCTONODE_RUN_RETENTION_COUNT = exports2.OCTONODE_RUN_RETENTION_BYTES = exports2.OCTONODE_RUN_RETENTION_AGE_MS = exports2.OCTONODE_STATE_NAMESPACE = exports2.OCTONODE_RUN_QUEUE = exports2.OCTONODE_RUN_CONCURRENCY = exports2.DEFAULT_MARKETPLACE_URL = exports2.OCTONODE_MARKETPLACE_URL = exports2.OCTONODE_MARKETPLACE_TOKEN = exports2.OCTONODE_PACKAGE_CACHE = exports2.OCTONODE_PROJECT = exports2.OCTONODE_CWD = exports2.OCTONODE_COMMUNITY_ROLLOUT = exports2.OCTONODE_CHAT_SERVICE_URL = exports2.OCTONODE_CHAT_SERVICE_TOKEN = exports2.OCTONODE_CHAT_SERVICE_AVAILABLE = exports2.OCTONODE_CHAT_MODEL = exports2.OCTONODE_CLOUD_INTERNAL_TOKEN = exports2.OCTONODE_CORS_ORIGINS = exports2.OCTONODE_API_TOKEN = exports2.OCTONODE_API_URL = exports2.OCTONODE_AUTH_TOKEN = exports2.OCTONODE_AUTH_PRINCIPAL = exports2.HOST = exports2.CONFIG_PATH = exports2.setEnvironmentVariable = exports2.childProcessEnvironment = exports2.workflowEnvironment = exports2.PROCESS_ENV = void 0;
    exports2.VISUAL_UPDATE = exports2.VISUAL_STORY = exports2.VISUAL_REVIEW_DIR = exports2.VISUAL_FULL = exports2.VISUAL_BASE = exports2.USERNAME = exports2.USER = exports2.UI_DIR = void 0;
    exports2.PROCESS_ENV = typeof process === "undefined" ? {} : process.env;
    var workflowEnvironment = (variables = {}) => {
      const environment = Object.fromEntries(Object.entries(variables).filter((entry) => typeof entry[1] === "string"));
      delete environment.OCTONODE_CLOUD_INTERNAL_TOKEN;
      delete environment.OCTONODE_CHAT_SERVICE_TOKEN;
      delete environment.OCTONODE_API_TOKEN;
      delete environment.OPENAI_API_KEY;
      return environment;
    };
    exports2.workflowEnvironment = workflowEnvironment;
    var childProcessEnvironment4 = (overrides = {}) => (0, exports2.workflowEnvironment)({ ...exports2.PROCESS_ENV, ...overrides });
    exports2.childProcessEnvironment = childProcessEnvironment4;
    var setEnvironmentVariable = (name, value) => {
      if (value === void 0)
        delete exports2.PROCESS_ENV[name];
      else
        exports2.PROCESS_ENV[name] = value;
    };
    exports2.setEnvironmentVariable = setEnvironmentVariable;
    var CONFIG_PATH = () => exports2.PROCESS_ENV.CONFIG_PATH;
    exports2.CONFIG_PATH = CONFIG_PATH;
    var HOST = () => exports2.PROCESS_ENV.HOST;
    exports2.HOST = HOST;
    var OCTONODE_AUTH_PRINCIPAL = () => exports2.PROCESS_ENV.OCTONODE_AUTH_PRINCIPAL;
    exports2.OCTONODE_AUTH_PRINCIPAL = OCTONODE_AUTH_PRINCIPAL;
    var OCTONODE_AUTH_TOKEN = () => exports2.PROCESS_ENV.OCTONODE_AUTH_TOKEN;
    exports2.OCTONODE_AUTH_TOKEN = OCTONODE_AUTH_TOKEN;
    var OCTONODE_API_URL = () => exports2.PROCESS_ENV.OCTONODE_API_URL;
    exports2.OCTONODE_API_URL = OCTONODE_API_URL;
    var OCTONODE_API_TOKEN = () => exports2.PROCESS_ENV.OCTONODE_API_TOKEN;
    exports2.OCTONODE_API_TOKEN = OCTONODE_API_TOKEN;
    var OCTONODE_CORS_ORIGINS = () => exports2.PROCESS_ENV.OCTONODE_CORS_ORIGINS;
    exports2.OCTONODE_CORS_ORIGINS = OCTONODE_CORS_ORIGINS;
    var OCTONODE_CLOUD_INTERNAL_TOKEN = () => exports2.PROCESS_ENV.OCTONODE_CLOUD_INTERNAL_TOKEN;
    exports2.OCTONODE_CLOUD_INTERNAL_TOKEN = OCTONODE_CLOUD_INTERNAL_TOKEN;
    var OCTONODE_CHAT_MODEL = () => exports2.PROCESS_ENV.OCTONODE_CHAT_MODEL;
    exports2.OCTONODE_CHAT_MODEL = OCTONODE_CHAT_MODEL;
    var OCTONODE_CHAT_SERVICE_AVAILABLE = () => exports2.PROCESS_ENV.OCTONODE_CHAT_SERVICE_AVAILABLE;
    exports2.OCTONODE_CHAT_SERVICE_AVAILABLE = OCTONODE_CHAT_SERVICE_AVAILABLE;
    var OCTONODE_CHAT_SERVICE_TOKEN = () => exports2.PROCESS_ENV.OCTONODE_CHAT_SERVICE_TOKEN;
    exports2.OCTONODE_CHAT_SERVICE_TOKEN = OCTONODE_CHAT_SERVICE_TOKEN;
    var OCTONODE_CHAT_SERVICE_URL = () => exports2.PROCESS_ENV.OCTONODE_CHAT_SERVICE_URL;
    exports2.OCTONODE_CHAT_SERVICE_URL = OCTONODE_CHAT_SERVICE_URL;
    var OCTONODE_COMMUNITY_ROLLOUT = () => exports2.PROCESS_ENV.OCTONODE_COMMUNITY_ROLLOUT;
    exports2.OCTONODE_COMMUNITY_ROLLOUT = OCTONODE_COMMUNITY_ROLLOUT;
    var OCTONODE_CWD = () => exports2.PROCESS_ENV.OCTONODE_CWD;
    exports2.OCTONODE_CWD = OCTONODE_CWD;
    var OCTONODE_PROJECT = () => exports2.PROCESS_ENV.OCTONODE_PROJECT;
    exports2.OCTONODE_PROJECT = OCTONODE_PROJECT;
    var OCTONODE_PACKAGE_CACHE2 = () => exports2.PROCESS_ENV.OCTONODE_PACKAGE_CACHE;
    exports2.OCTONODE_PACKAGE_CACHE = OCTONODE_PACKAGE_CACHE2;
    var OCTONODE_MARKETPLACE_TOKEN2 = () => exports2.PROCESS_ENV.OCTONODE_MARKETPLACE_TOKEN ?? exports2.PROCESS_ENV.VITE_OCTONODE_MARKETPLACE_TOKEN ?? exports2.PROCESS_ENV.VITE_PUBLIC_OCTONODE_MARKETPLACE_TOKEN;
    exports2.OCTONODE_MARKETPLACE_TOKEN = OCTONODE_MARKETPLACE_TOKEN2;
    var OCTONODE_MARKETPLACE_URL3 = () => exports2.PROCESS_ENV.OCTONODE_MARKETPLACE_URL ?? exports2.PROCESS_ENV.VITE_OCTONODE_MARKETPLACE_URL ?? exports2.PROCESS_ENV.VITE_PUBLIC_OCTONODE_MARKETPLACE_URL;
    exports2.OCTONODE_MARKETPLACE_URL = OCTONODE_MARKETPLACE_URL3;
    exports2.DEFAULT_MARKETPLACE_URL = "https://plugins.octonodes.com";
    var OCTONODE_RUN_CONCURRENCY = () => exports2.PROCESS_ENV.OCTONODE_RUN_CONCURRENCY;
    exports2.OCTONODE_RUN_CONCURRENCY = OCTONODE_RUN_CONCURRENCY;
    var OCTONODE_RUN_QUEUE = () => exports2.PROCESS_ENV.OCTONODE_RUN_QUEUE;
    exports2.OCTONODE_RUN_QUEUE = OCTONODE_RUN_QUEUE;
    var OCTONODE_STATE_NAMESPACE = () => exports2.PROCESS_ENV.OCTONODE_STATE_NAMESPACE;
    exports2.OCTONODE_STATE_NAMESPACE = OCTONODE_STATE_NAMESPACE;
    var OCTONODE_RUN_RETENTION_AGE_MS = () => exports2.PROCESS_ENV.OCTONODE_RUN_RETENTION_AGE_MS;
    exports2.OCTONODE_RUN_RETENTION_AGE_MS = OCTONODE_RUN_RETENTION_AGE_MS;
    var OCTONODE_RUN_RETENTION_BYTES = () => exports2.PROCESS_ENV.OCTONODE_RUN_RETENTION_BYTES;
    exports2.OCTONODE_RUN_RETENTION_BYTES = OCTONODE_RUN_RETENTION_BYTES;
    var OCTONODE_RUN_RETENTION_COUNT = () => exports2.PROCESS_ENV.OCTONODE_RUN_RETENTION_COUNT;
    exports2.OCTONODE_RUN_RETENTION_COUNT = OCTONODE_RUN_RETENTION_COUNT;
    var OCTONODE_REPOSITORY_REGISTRY_V2 = () => exports2.PROCESS_ENV.OCTONODE_REPOSITORY_REGISTRY_V2;
    exports2.OCTONODE_REPOSITORY_REGISTRY_V2 = OCTONODE_REPOSITORY_REGISTRY_V2;
    var OCTONODE_RUNTIME = () => exports2.PROCESS_ENV.OCTONODE_RUNTIME;
    exports2.OCTONODE_RUNTIME = OCTONODE_RUNTIME;
    var OCTONODE_SERVER_PROFILE = () => exports2.PROCESS_ENV.OCTONODE_SERVER_PROFILE;
    exports2.OCTONODE_SERVER_PROFILE = OCTONODE_SERVER_PROFILE;
    var OCTONODE_SHUTDOWN_TIMEOUT_MS = () => exports2.PROCESS_ENV.OCTONODE_SHUTDOWN_TIMEOUT_MS;
    exports2.OCTONODE_SHUTDOWN_TIMEOUT_MS = OCTONODE_SHUTDOWN_TIMEOUT_MS;
    var OCTONODE_SOURCE_WATCH_CONCURRENCY = () => exports2.PROCESS_ENV.OCTONODE_SOURCE_WATCH_CONCURRENCY;
    exports2.OCTONODE_SOURCE_WATCH_CONCURRENCY = OCTONODE_SOURCE_WATCH_CONCURRENCY;
    var OCTONODE_STORE_DIR = () => exports2.PROCESS_ENV.OCTONODE_STORE_DIR;
    exports2.OCTONODE_STORE_DIR = OCTONODE_STORE_DIR;
    var OCTONODE_STUDIO_URL = () => exports2.PROCESS_ENV.OCTONODE_STUDIO_URL ?? exports2.PROCESS_ENV.VITE_OCTONODE_STUDIO_URL ?? exports2.PROCESS_ENV.VITE_PUBLIC_OCTONODE_STUDIO_URL;
    exports2.OCTONODE_STUDIO_URL = OCTONODE_STUDIO_URL;
    var OCTONODE_USER = () => exports2.PROCESS_ENV.OCTONODE_USER;
    exports2.OCTONODE_USER = OCTONODE_USER;
    var OCTONODE_USER_EMAIL = () => exports2.PROCESS_ENV.OCTONODE_USER_EMAIL;
    exports2.OCTONODE_USER_EMAIL = OCTONODE_USER_EMAIL;
    var OCTONODE_VISUAL_PORT = () => exports2.PROCESS_ENV.OCTONODE_VISUAL_PORT;
    exports2.OCTONODE_VISUAL_PORT = OCTONODE_VISUAL_PORT;
    var OCTONODE_WORKSPACE = () => exports2.PROCESS_ENV.OCTONODE_WORKSPACE;
    exports2.OCTONODE_WORKSPACE = OCTONODE_WORKSPACE;
    var OTEL_EXPORTER_OTLP_ENDPOINT = () => exports2.PROCESS_ENV.OTEL_EXPORTER_OTLP_ENDPOINT;
    exports2.OTEL_EXPORTER_OTLP_ENDPOINT = OTEL_EXPORTER_OTLP_ENDPOINT;
    var OTEL_SDK_DISABLED = () => exports2.PROCESS_ENV.OTEL_SDK_DISABLED;
    exports2.OTEL_SDK_DISABLED = OTEL_SDK_DISABLED;
    var OTEL_SERVICE_NAME = () => exports2.PROCESS_ENV.OTEL_SERVICE_NAME;
    exports2.OTEL_SERVICE_NAME = OTEL_SERVICE_NAME;
    var OPENAI_API_KEY = () => exports2.PROCESS_ENV.OPENAI_API_KEY;
    exports2.OPENAI_API_KEY = OPENAI_API_KEY;
    var CLOUDFLARE_API_KEY = () => exports2.PROCESS_ENV.CLOUDFLARE_API_KEY;
    exports2.CLOUDFLARE_API_KEY = CLOUDFLARE_API_KEY;
    var CLOUDFLARE_ACCOUNT_ID = () => exports2.PROCESS_ENV.CLOUDFLARE_ACCOUNT_ID;
    exports2.CLOUDFLARE_ACCOUNT_ID = CLOUDFLARE_ACCOUNT_ID;
    var OPENROUTER_API_KEY = () => exports2.PROCESS_ENV.OPENROUTER_API_KEY;
    exports2.OPENROUTER_API_KEY = OPENROUTER_API_KEY;
    var PATH = () => exports2.PROCESS_ENV.PATH;
    exports2.PATH = PATH;
    var PORT = () => exports2.PROCESS_ENV.PORT;
    exports2.PORT = PORT;
    var PYTHONPATH = () => exports2.PROCESS_ENV.PYTHONPATH;
    exports2.PYTHONPATH = PYTHONPATH;
    var UI_DIR = () => exports2.PROCESS_ENV.UI_DIR;
    exports2.UI_DIR = UI_DIR;
    var USER = () => exports2.PROCESS_ENV.USER;
    exports2.USER = USER;
    var USERNAME = () => exports2.PROCESS_ENV.USERNAME;
    exports2.USERNAME = USERNAME;
    var VISUAL_BASE = () => exports2.PROCESS_ENV.VISUAL_BASE;
    exports2.VISUAL_BASE = VISUAL_BASE;
    var VISUAL_FULL = () => exports2.PROCESS_ENV.VISUAL_FULL;
    exports2.VISUAL_FULL = VISUAL_FULL;
    var VISUAL_REVIEW_DIR = () => exports2.PROCESS_ENV.VISUAL_REVIEW_DIR;
    exports2.VISUAL_REVIEW_DIR = VISUAL_REVIEW_DIR;
    var VISUAL_STORY = () => exports2.PROCESS_ENV.VISUAL_STORY;
    exports2.VISUAL_STORY = VISUAL_STORY;
    var VISUAL_UPDATE = () => exports2.PROCESS_ENV.VISUAL_UPDATE;
    exports2.VISUAL_UPDATE = VISUAL_UPDATE;
  }
});

// packages/common/dist/legal.constants.js
var require_legal_constants = __commonJS({
  "packages/common/dist/legal.constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DODO_BUYER_TERMS_URL = exports2.LEGAL_CONTACT_EMAIL = exports2.LEGAL_BILLING_PATH = exports2.LEGAL_PRIVACY_PATH = exports2.LEGAL_TERMS_PATH = exports2.LEGAL_TERMS_VERSION = void 0;
    exports2.LEGAL_TERMS_VERSION = "2026-09-19";
    exports2.LEGAL_TERMS_PATH = "/legal/terms.html";
    exports2.LEGAL_PRIVACY_PATH = "/legal/privacy.html";
    exports2.LEGAL_BILLING_PATH = "/legal/billing.html";
    exports2.LEGAL_CONTACT_EMAIL = "service@octonodes.com";
    exports2.DODO_BUYER_TERMS_URL = "https://dodopayments.com/legal/buyer-terms";
  }
});

// packages/common/dist/package-cache.js
var require_package_cache = __commonJS({
  "packages/common/dist/package-cache.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.packageCacheEnvironment = packageCacheEnvironment3;
    function packageCacheEnvironment3(root) {
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
  }
});

// packages/common/dist/api-exposure.js
var require_api_exposure = __commonJS({
  "packages/common/dist/api-exposure.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PRIVATE_API_DOC_EMAIL = void 0;
    exports2.isDeveloperApiOperation = isDeveloperApiOperation;
    exports2.developerOpenApiDocument = developerOpenApiDocument;
    exports2.PRIVATE_API_DOC_EMAIL = "nivdoron1234@gmail.com";
    var DEVELOPER_API_RULES = [
      [/^\/api\/(?:capabilities|identity|workspaces|workspaces\/permissions)$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/profile$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/profiles\/(?:workspace-members|[^/]+\/avatar)$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/social\/(?:conversations|notifications)$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/social\/conversations\/[^/]+\/(?:members|messages)$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/(?:store\/projects|projects\/search)$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/projects\/[^/]+$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/projects\/[^/]+\/(?:files|files\/content|source-index|source-support|package-exports)$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/projects\/[^/]+\/files\/content$/, /* @__PURE__ */ new Set(["POST", "PUT"])],
      [/^\/api\/projects\/[^/]+\/compile$/, /* @__PURE__ */ new Set(["POST"])],
      [/^\/api\/runs(?:\/[^/]+)?$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/runs\/[^/]+\/cancel$/, /* @__PURE__ */ new Set(["POST"])],
      [/^\/api\/workflows$/, /* @__PURE__ */ new Set(["GET", "POST"])],
      [/^\/api\/workflows\/[^/]+\/(?:graph|node-catalog)$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/workflows\/[^/]+\/(?:topology|validate-connection|run|executions)$/, /* @__PURE__ */ new Set(["POST"])],
      [/^\/api\/executions\/[^/]+$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/executions\/[^/]+\/(?:events)$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/executions\/[^/]+\/cancel$/, /* @__PURE__ */ new Set(["POST"])],
      [/^\/api\/nodes$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/nodes\/[^/]+\/source$/, /* @__PURE__ */ new Set(["GET", "PUT"])],
      [/^\/api\/nodes\/[^/]+\/source\/signature$/, /* @__PURE__ */ new Set(["PUT"])],
      [/^\/api\/(?:native-nodes|plugins|marketplace|templates)$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/(?:native-nodes|plugins|marketplace|templates)\/[^/]+$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/marketplace\/plugins\/[^/]+$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/native-nodes\/[^/]+\/materialize$/, /* @__PURE__ */ new Set(["POST"])],
      [/^\/api\/plugins\/[^/]+\/nodes\/[^/]+\/add$/, /* @__PURE__ */ new Set(["POST"])],
      [/^\/api\/knowledge\/search$/, /* @__PURE__ */ new Set(["POST"])],
      [/^\/api\/github\/(?:repositories|jobs\/[^/]+)$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/architectures\/[^/]+\/github\/pull-requests(?:\/[^/]+)?$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/architectures\/[^/]+\/github\/pull-requests\/[^/]+\/(?:workflow-diff|review-file)$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/architectures\/[^/]+\/github\/pull-requests\/[^/]+\/review-threads$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/projects\/[^/]+\/data-tables$/, /* @__PURE__ */ new Set(["GET", "POST"])],
      [/^\/api\/projects\/[^/]+\/data-tables\/(?!sql$)[^/]+$/, /* @__PURE__ */ new Set(["GET", "PATCH", "DELETE"])],
      [/^\/api\/projects\/[^/]+\/data-tables\/[^/]+\/rows$/, /* @__PURE__ */ new Set(["GET", "POST"])],
      [/^\/api\/projects\/[^/]+\/data-tables\/[^/]+\/rows\/(?!bulk$)[^/]+$/, /* @__PURE__ */ new Set(["PATCH", "DELETE"])],
      [/^\/api\/projects\/[^/]+\/data-tables\/[^/]+\/rows\/bulk$/, /* @__PURE__ */ new Set(["POST"])],
      [/^\/api\/projects\/[^/]+\/data-table-schema$/, /* @__PURE__ */ new Set(["GET"])],
      [/^\/api\/projects\/[^/]+\/data-table-schema\/views\/[^/]+\/query$/, /* @__PURE__ */ new Set(["POST"])],
      [/^\/api\/workflows\/[^/]+\/triggers\/[^/]+\/events$/, /* @__PURE__ */ new Set(["POST"])]
    ];
    function isDeveloperApiOperation(method, path) {
      const normalizedPath = path.replace(/\{[^}]+\}/g, "value");
      const normalizedMethod = method.toUpperCase();
      return DEVELOPER_API_RULES.some(([pattern, methods]) => pattern.test(normalizedPath) && methods.has(normalizedMethod));
    }
    function developerOpenApiDocument(document) {
      const paths = Object.fromEntries(Object.entries(document.paths ?? {}).flatMap(([path, pathItem]) => {
        const operations = Object.fromEntries(Object.entries(pathItem).filter(([method]) => isDeveloperApiOperation(method, path)));
        return Object.keys(operations).length ? [[path, operations]] : [];
      }));
      const tags = new Set(Object.values(paths).flatMap((pathItem) => Object.values(pathItem).flatMap((operation) => Array.isArray(operation.tags) ? operation.tags : [])));
      const tagGroups = Array.isArray(document["x-tagGroups"]) ? document["x-tagGroups"].flatMap((value) => {
        const group = value;
        const groupTags = Array.isArray(group.tags) ? group.tags.filter((tag) => tags.has(tag)) : [];
        return groupTags.length ? [{ ...group, tags: groupTags }] : [];
      }) : void 0;
      return {
        ...document,
        info: {
          ...document.info,
          title: "Octonode Developer API",
          description: "Supported API for project, workflow, execution, and data integrations."
        },
        paths,
        ...tagGroups ? { "x-tagGroups": tagGroups } : {}
      };
    }
  }
});

// packages/common/dist/graph-layout.js
var require_graph_layout = __commonJS({
  "packages/common/dist/graph-layout.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.layeredLayout = layeredLayout;
    var NODE_W = 100;
    var NODE_H = 140;
    var GAP_X = 180;
    var GAP_Y = 60;
    function layeredLayout(graph) {
      const depth = /* @__PURE__ */ new Map();
      const indeg = /* @__PURE__ */ new Map();
      graph.nodes.forEach((n) => {
        depth.set(n.id, 0);
        indeg.set(n.id, 0);
      });
      const outgoing = /* @__PURE__ */ new Map();
      graph.edges.filter((edge) => edge.kind !== "dependency").forEach((e) => {
        if (!indeg.has(e.from.node) || !indeg.has(e.to.node))
          return;
        const target = e.to.node;
        indeg.set(target, (indeg.get(target) ?? 0) + 1);
        outgoing.set(e.from.node, [...outgoing.get(e.from.node) ?? [], target]);
      });
      const queue = [];
      for (const n of graph.nodes) {
        if ((indeg.get(n.id) ?? 0) === 0) {
          queue.push(n.id);
        }
      }
      for (let cursor = 0; cursor < queue.length; cursor++) {
        const id = queue[cursor];
        const d = depth.get(id) ?? 0;
        for (const target of outgoing.get(id) ?? []) {
          if (d + 1 > (depth.get(target) ?? 0))
            depth.set(target, d + 1);
          const remaining = (indeg.get(target) ?? 1) - 1;
          indeg.set(target, remaining);
          if (remaining === 0)
            queue.push(target);
        }
      }
      const layers = /* @__PURE__ */ new Map();
      for (const n of graph.nodes) {
        const d = depth.get(n.id) ?? 0;
        if (!layers.has(d))
          layers.set(d, []);
        layers.get(d).push(n.id);
      }
      const tallest = Math.max(...[...layers.values()].map((l) => l.length), 1);
      const pos = {};
      for (const [d, ids] of layers) {
        const colHeight = ids.length * (NODE_H + GAP_Y);
        const fullHeight = tallest * (NODE_H + GAP_Y);
        const offset = (fullHeight - colHeight) / 2;
        ids.forEach((id, i) => {
          pos[id] = { x: d * (NODE_W + GAP_X), y: offset + i * (NODE_H + GAP_Y) };
        });
      }
      return pos;
    }
  }
});

// packages/common/dist/plugin-nodes.js
var require_plugin_nodes = __commonJS({
  "packages/common/dist/plugin-nodes.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.installedPluginNodesPage = installedPluginNodesPage;
    function isCatalogPlugin(value) {
      if (!value || typeof value !== "object")
        return false;
      const plugin = value;
      return typeof plugin.id === "string" && typeof plugin.name === "string" && typeof plugin.version === "string" && Array.isArray(plugin.nodes) && plugin.nodes.every((node) => {
        if (!node || typeof node !== "object")
          return false;
        const item = node;
        return typeof item.id === "string" && (item.icon === void 0 || typeof item.icon === "string") && (item.description === void 0 || typeof item.description === "string");
      });
    }
    function installedPluginNodesPage(inventory, query) {
      if (!inventory.every(isCatalogPlugin))
        throw new Error("Plugin node inventory is incomplete");
      const q = query.q?.trim().toLowerCase();
      const nodes = inventory.flatMap((plugin) => plugin.nodes.filter((node) => !q || [node.id, node.description ?? "", plugin.id, plugin.name].join(" ").toLowerCase().includes(q)).map((node) => ({ ...node, pluginId: plugin.id, pluginName: plugin.name, pluginVersion: plugin.version }))).sort((a, b) => a.pluginName.localeCompare(b.pluginName) || a.id.localeCompare(b.id));
      const offset = Math.min(query.offset, nodes.length);
      return { items: nodes.slice(offset, offset + query.limit), total: nodes.length, offset, limit: query.limit };
    }
  }
});

// packages/common/dist/index.js
var require_dist2 = __commonJS({
  "packages/common/dist/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.installedPluginNodesPage = exports2.layeredLayout = exports2.packageCacheEnvironment = void 0;
    __exportStar(require_constants2(), exports2);
    __exportStar(require_legal_constants(), exports2);
    var package_cache_1 = require_package_cache();
    Object.defineProperty(exports2, "packageCacheEnvironment", { enumerable: true, get: function() {
      return package_cache_1.packageCacheEnvironment;
    } });
    __exportStar(require_api_exposure(), exports2);
    var graph_layout_1 = require_graph_layout();
    Object.defineProperty(exports2, "layeredLayout", { enumerable: true, get: function() {
      return graph_layout_1.layeredLayout;
    } });
    var plugin_nodes_1 = require_plugin_nodes();
    Object.defineProperty(exports2, "installedPluginNodesPage", { enumerable: true, get: function() {
      return plugin_nodes_1.installedPluginNodesPage;
    } });
  }
});

// packages/plugin-runtime/dist/plugin.js
var require_plugin2 = __commonJS({
  "packages/plugin-runtime/dist/plugin.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.definePlugin = definePlugin;
    exports2.startPlugin = startPlugin;
    var common_1 = require_dist2();
    var schema_1 = require_dist();
    var define_node_1 = require_define_node();
    var runner_1 = require_runner();
    function definePlugin(definition, handlers) {
      const options = definition;
      if (!handlers && (!options || !Array.isArray(options.nodes)))
        throw new Error("plugin needs a nodes array");
      if (!handlers) {
        for (const node of options.nodes) {
          if (typeof node.run !== "function")
            throw new Error(`plugin node "${node.id}" needs a handler`);
          if (node.kind && node.kind !== "function")
            throw new Error("plugin nodes must be functions");
        }
      }
      const manifest2 = schema_1.PluginManifest.parse(handlers ? definition : {
        ...options,
        nodes: options.nodes.map(({ run: _run, ...node }) => ({
          ...node,
          command: `node dist/index.js ${node.id}`,
          language: "typescript"
        }))
      });
      const nodeHandlers = handlers ?? Object.fromEntries(options.nodes.map((node) => [node.id, node.run]));
      for (const node of manifest2.nodes) {
        for (const field of ["inputs", "outputs", "defaults"]) {
          const error = node[field] === void 0 ? void 0 : (0, runner_1.jsonSafetyError)(node[field]);
          if (error)
            throw new Error(`plugin node "${node.id}" ${field} must be JSON-serializable: ${error}`);
        }
      }
      for (const id of Object.keys(nodeHandlers)) {
        if (!manifest2.nodes.some((node) => node.id === id))
          throw new Error(`handler "${id}" has no plugin node`);
      }
      return {
        manifest: manifest2,
        ...!handlers && options.assets ? { assets: options.assets } : {},
        nodes: Object.fromEntries(manifest2.nodes.map((node) => {
          if (!Object.hasOwn(nodeHandlers, node.id))
            throw new Error(`plugin node "${node.id}" needs a handler`);
          const fields = (node.connections ?? []).flatMap((id) => Object.entries(manifest2.connections?.[id]?.fields ?? {}));
          return [
            node.id,
            (0, define_node_1.defineNode)({
              ...node,
              run: (inputs, context) => {
                const missing = fields.filter(([name, field]) => field.required && !common_1.PROCESS_ENV[name]).map(([name]) => name);
                if (missing.length)
                  throw new runner_1.NodeError(`Missing connection credentials: ${missing.join(", ")}`);
                return nodeHandlers[node.id](inputs, context);
              }
            })
          ];
        }))
      };
    }
    function startPlugin(plugin, nodeId = process.argv[2]) {
      const id = nodeId ?? (plugin.manifest.nodes.length === 1 ? plugin.manifest.nodes[0].id : void 0);
      if (!id || !Object.hasOwn(plugin.nodes, id))
        throw new Error(`Choose a plugin node: ${Object.keys(plugin.nodes).join(", ")}`);
      (0, runner_1.start)(plugin.nodes[id]);
    }
  }
});

// packages/plugin-runtime/dist/plugin-file.js
var require_plugin_file = __commonJS({
  "packages/plugin-runtime/dist/plugin-file.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.pluginDefinitionPath = pluginDefinitionPath2;
    exports2.loadPluginDefinition = loadPluginDefinition3;
    var node_fs_1 = require("node:fs");
    var node_path_1 = require("node:path");
    var yaml_1 = require("yaml");
    var schema_1 = require_dist();
    function pluginDefinitionPath2(dir) {
      const files = schema_1.PLUGIN_DEFINITION_FILENAMES.map((name) => (0, node_path_1.join)(dir, name)).filter(node_fs_1.existsSync);
      if (files.length !== 1)
        throw new Error(files.length ? `Multiple plugin definitions in ${dir}; keep exactly one` : `No plugin definition in ${dir}; create octonode.yml or octonode.json`);
      const file = files[0];
      if ((0, node_path_1.dirname)((0, node_fs_1.realpathSync)(file)) !== (0, node_fs_1.realpathSync)(dir))
        throw new Error("Plugin definition must stay inside its folder");
      if (!(0, node_fs_1.statSync)(file).isFile() || (0, node_fs_1.statSync)(file).size > 1048576)
        throw new Error("Plugin definition must be a file smaller than 1 MiB");
      return file;
    }
    function loadPluginDefinition3(dir) {
      const file = pluginDefinitionPath2(dir);
      const source = (0, node_fs_1.readFileSync)(file, "utf8");
      const document = (0, yaml_1.parseDocument)(source, { version: "1.2", uniqueKeys: true });
      (0, yaml_1.visit)(document, {
        Alias() {
          throw new Error("Plugin definitions cannot contain YAML aliases");
        }
      });
      if (document.errors.length || document.warnings.length)
        throw new Error(`${file}: ${[...document.errors, ...document.warnings].map((error) => error.message).join("; ")}`);
      const raw = file.endsWith(".json") ? JSON.parse(source) : document.toJS({ maxAliasCount: 0 });
      if (file.endsWith(schema_1.PLUGIN_MANIFEST_FILENAME))
        return schema_1.PluginManifest.parse(raw);
      const settings = schema_1.OctonodeSettingsDocument.parse(raw);
      if (!settings.plugin)
        throw new Error(`${file} has no plugin section`);
      return settings.plugin;
    }
  }
});

// packages/plugin-runtime/dist/index.js
var require_dist3 = __commonJS({
  "packages/plugin-runtime/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PluginConnection = exports2.PluginNode = exports2.PluginManifest = exports2.pluginDefinitionPath = exports2.loadPluginDefinition = exports2.startPlugin = exports2.definePlugin = exports2.validate = exports2.NodeError = exports2.start = exports2.runNode = exports2.defineConst = exports2.defineClass = exports2.defineService = exports2.defineNode = void 0;
    var define_node_1 = require_define_node();
    Object.defineProperty(exports2, "defineNode", { enumerable: true, get: function() {
      return define_node_1.defineNode;
    } });
    Object.defineProperty(exports2, "defineService", { enumerable: true, get: function() {
      return define_node_1.defineService;
    } });
    Object.defineProperty(exports2, "defineClass", { enumerable: true, get: function() {
      return define_node_1.defineClass;
    } });
    Object.defineProperty(exports2, "defineConst", { enumerable: true, get: function() {
      return define_node_1.defineConst;
    } });
    var runner_1 = require_runner();
    Object.defineProperty(exports2, "runNode", { enumerable: true, get: function() {
      return runner_1.runNode;
    } });
    Object.defineProperty(exports2, "start", { enumerable: true, get: function() {
      return runner_1.start;
    } });
    Object.defineProperty(exports2, "NodeError", { enumerable: true, get: function() {
      return runner_1.NodeError;
    } });
    var json_schema_1 = require_json_schema2();
    Object.defineProperty(exports2, "validate", { enumerable: true, get: function() {
      return json_schema_1.validate;
    } });
    var plugin_1 = require_plugin2();
    Object.defineProperty(exports2, "definePlugin", { enumerable: true, get: function() {
      return plugin_1.definePlugin;
    } });
    Object.defineProperty(exports2, "startPlugin", { enumerable: true, get: function() {
      return plugin_1.startPlugin;
    } });
    var plugin_file_1 = require_plugin_file();
    Object.defineProperty(exports2, "loadPluginDefinition", { enumerable: true, get: function() {
      return plugin_file_1.loadPluginDefinition;
    } });
    Object.defineProperty(exports2, "pluginDefinitionPath", { enumerable: true, get: function() {
      return plugin_file_1.pluginDefinitionPath;
    } });
    var schema_1 = require_dist();
    Object.defineProperty(exports2, "PluginManifest", { enumerable: true, get: function() {
      return schema_1.PluginManifest;
    } });
    Object.defineProperty(exports2, "PluginNode", { enumerable: true, get: function() {
      return schema_1.PluginNode;
    } });
    Object.defineProperty(exports2, "PluginConnection", { enumerable: true, get: function() {
      return schema_1.PluginConnection;
    } });
  }
});

// packages/plugin/src/consumer/index.ts
var index_exports = {};
__export(index_exports, {
  runPluginLifecycle: () => runPluginLifecycle
});
module.exports = __toCommonJS(index_exports);

// packages/plugin/src/consumer/lifecycle.ts
var import_node_fs15 = require("node:fs");
var import_node_path15 = require("node:path");

// packages/plugin/src/lifecycle.ts
var import_node_fs10 = require("node:fs");
var import_node_path10 = require("node:path");

// packages/plugin/src/store.ts
var import_node_fs2 = require("node:fs");
var import_node_os = require("node:os");
var import_node_path2 = require("node:path");
var import_plugin_runtime = __toESM(require_dist3());

// packages/plugin/src/integrity.ts
var import_node_crypto = require("node:crypto");
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");

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

// packages/plugin/src/integrity.ts
function collectFiles(dir, base, files) {
  for (const entry of (0, import_node_fs.readdirSync)(dir, { withFileTypes: true })) {
    if (PLUGIN_BUNDLE_EXCLUDES.some((pattern) => (0, import_node_path.matchesGlob)(entry.name, pattern))) continue;
    const path = (0, import_node_path.join)(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Plugin bundles cannot contain symbolic links: ${entry.name}`);
    if (!entry.isDirectory() && !entry.isFile()) throw new Error(`Unsupported plugin asset: ${entry.name}`);
    if (entry.isDirectory()) collectFiles(path, base, files);
    else files.push((0, import_node_path.relative)(base, path).split("\\").join("/"));
  }
}
function hashPluginDir(dir) {
  const root = (0, import_node_path.resolve)(dir);
  const files = pluginBundleFiles(root);
  const hash = (0, import_node_crypto.createHash)("sha256");
  for (const file of files) {
    hash.update(file);
    hash.update("\0");
    hash.update((0, import_node_fs.readFileSync)((0, import_node_path.join)(root, file)));
    hash.update("\0");
  }
  return `sha256:${hash.digest("hex")}`;
}
function pluginBundleFiles(dir) {
  const root = (0, import_node_path.resolve)(dir);
  const files = [];
  collectFiles(root, root, files);
  return files.sort();
}

// packages/plugin/src/store.ts
function pluginStoreRoot() {
  return (0, import_node_path2.join)((0, import_node_os.homedir)(), ".octonode", "store");
}
function shortSha(sha256) {
  return sha256.replace(/^sha256:/, "").slice(0, 8);
}
function storeEntryDir(id, version, sha256, root = pluginStoreRoot()) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id) || !/^[a-zA-Z0-9.+_-]+$/.test(version) || !/^sha256:[a-f0-9]{64}$/.test(sha256))
    throw new Error("Invalid plugin store identity");
  const full = (0, import_node_path2.join)(root, `${id}@${version}-${sha256.slice(7)}`);
  const legacy = (0, import_node_path2.join)(root, `${id}@${version}-${shortSha(sha256)}`);
  return !(0, import_node_fs2.existsSync)(full) && (0, import_node_fs2.existsSync)(legacy) ? legacy : full;
}
function addToStore(srcDir, opts = {}) {
  const manifest2 = (0, import_plugin_runtime.loadPluginDefinition)(srcDir);
  const sha256 = hashPluginDir(srcDir);
  const dir = storeEntryDir(manifest2.id, manifest2.version, sha256, opts.storeRoot);
  const created = !(0, import_node_fs2.existsSync)(dir);
  if (created) {
    (0, import_node_fs2.mkdirSync)((0, import_node_path2.dirname)(dir), { recursive: true });
    const staging = (0, import_node_fs2.mkdtempSync)((0, import_node_path2.join)((0, import_node_path2.dirname)(dir), ".plugin-"));
    try {
      (0, import_node_fs2.cpSync)(srcDir, staging, { recursive: true });
      if (hashPluginDir(staging) !== sha256) throw new Error("Plugin changed while copying into the store");
      try {
        (0, import_node_fs2.renameSync)(staging, dir);
      } catch (error) {
        if (!(0, import_node_fs2.existsSync)(dir) || hashPluginDir(dir) !== sha256) throw error;
      }
    } finally {
      (0, import_node_fs2.rmSync)(staging, { recursive: true, force: true });
    }
  }
  if (hashPluginDir(dir) !== sha256) throw new Error(`Corrupt plugin store entry: ${manifest2.id}`);
  return { id: manifest2.id, version: manifest2.version, sha256, dir, manifest: manifest2, created };
}

// packages/plugin/src/loader.ts
var import_node_fs4 = require("node:fs");
var import_node_os2 = require("node:os");
var import_node_path4 = require("node:path");
var import_plugin_runtime2 = __toESM(require_dist3());
var import_schema2 = __toESM(require_dist());

// packages/plugin/src/lock.ts
var import_node_fs3 = require("node:fs");
var import_node_path3 = require("node:path");
var import_zod = require("zod");
var import_schema = __toESM(require_dist());
var LOCK_FILENAME = "octonode.lock";
var LockEntry = import_zod.z.object({
  version: import_zod.z.string(),
  /** `sha256:<hex>` dir-content hash (hashPluginDir) — the store address + integrity check. */
  sha256: import_zod.z.string(),
  /** Registry archive checksum, distinct from the unpacked file-tree identity. */
  archiveSha256: import_zod.z.string().regex(/^[a-f0-9]{64}$/).optional(),
  /** Marketplace base URL the bundle came from (absent for local installs). */
  registry: import_zod.z.string().optional(),
  /** Marketplace tier it was resolved from. */
  scope: import_schema.PluginScope.optional(),
  /** Permissions granted at install consent, frozen per locked version. */
  permissions: import_zod.z.array(import_schema.PluginPermission).optional(),
  /** Hosted marketplace install record used to report uninstall analytics. */
  installId: import_zod.z.string().optional(),
  /** Original manifest ID; record key remains the project-local alias. */
  pluginId: import_zod.z.string().regex(/^[a-z0-9][a-z0-9-]*$/).optional(),
  /** Registry-qualified marketplace ID (may differ from the manifest ID for private publications). */
  remoteId: import_zod.z.string().optional(),
  publisher: import_zod.z.string().optional()
});
var Lockfile = import_zod.z.object({
  lockfileVersion: import_zod.z.literal(1).default(1),
  plugins: import_zod.z.record(LockEntry).default({}),
  generated: import_zod.z.object({
    name: import_zod.z.literal("@octonodes/plugin"),
    spec: import_zod.z.string().regex(/^file:\.\/\.octonode-generated\/plugin-[a-f0-9]{64}\.tgz$/),
    subpaths: import_zod.z.array(import_zod.z.string()),
    packer: import_zod.z.string(),
    sha256: import_zod.z.string().regex(/^sha256:[a-f0-9]{64}$/)
  }).strict().optional()
});
function lockfilePath(cwd = process.cwd()) {
  return (0, import_node_path3.join)(cwd, LOCK_FILENAME);
}
function readLockfile(cwd = process.cwd()) {
  const file = lockfilePath(cwd);
  if (!(0, import_node_fs3.existsSync)(file)) return Lockfile.parse({});
  try {
    return Lockfile.parse(JSON.parse((0, import_node_fs3.readFileSync)(file, "utf8")));
  } catch (err) {
    throw new Error(`${file} is not a valid lockfile: ${err.message}`);
  }
}
function writeLockfile(cwd, lock) {
  const parsed = Lockfile.parse(lock);
  const plugins = Object.fromEntries(Object.entries(parsed.plugins).sort(([a], [b]) => a.localeCompare(b)));
  const staging = (0, import_node_fs3.mkdtempSync)((0, import_node_path3.join)(cwd, ".octonode-lock-"));
  try {
    (0, import_node_fs3.writeFileSync)((0, import_node_path3.join)(staging, "lock"), JSON.stringify({ ...parsed, plugins }, null, 2) + "\n", "utf8");
    (0, import_node_fs3.renameSync)((0, import_node_path3.join)(staging, "lock"), lockfilePath(cwd));
  } finally {
    (0, import_node_fs3.rmSync)(staging, { recursive: true, force: true });
  }
}
function upsertLockEntry(cwd, id, entry) {
  const lock = readLockfile(cwd);
  const next = { ...lock, plugins: { ...lock.plugins, [id]: LockEntry.parse(entry) } };
  writeLockfile(cwd, next);
  return next;
}

// packages/plugin/src/loader.ts
function userPluginRoot() {
  return (0, import_node_path4.join)((0, import_node_os2.homedir)(), ".octonode", "plugins");
}
function projectPluginRoot(cwd = process.cwd()) {
  return (0, import_node_path4.join)(cwd, "octonode_plugins");
}
function loadPluginManifest(dir) {
  return (0, import_plugin_runtime2.loadPluginDefinition)(dir);
}
function loadPlugin(dir, source = "user") {
  return { manifest: loadPluginManifest(dir), dir, source };
}
function isPluginDir(dir) {
  return import_schema2.PLUGIN_DEFINITION_FILENAMES.some((name) => (0, import_node_fs4.existsSync)((0, import_node_path4.join)(dir, name)));
}

// packages/plugin/src/dependencies.ts
var import_node_child_process = require("node:child_process");
var import_node_fs6 = require("node:fs");
var import_node_os4 = require("node:os");
var import_node_path6 = require("node:path");
var import_node_util = require("node:util");
var import_yaml = require("yaml");
var import_common = __toESM(require_dist2());

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
var import_node_fs5 = require("node:fs");
var import_node_path5 = require("node:path");
var import_node_os3 = require("node:os");
var import_zod2 = require("zod");

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
  const local = (0, import_node_path5.relative)(root, path);
  return local === "" || !(0, import_node_path5.isAbsolute)(local) && local !== ".." && !local.startsWith(`..${import_node_path5.sep}`);
}
function digestTree(root, paths, projectRoot) {
  const hash = (0, import_node_crypto2.createHash)("sha256");
  let bytes = 0;
  let count = 0;
  const visit2 = (path) => {
    if (++count > DEPENDENCY_SNAPSHOT_MAX_FILES) throw new Error("Dependency snapshot file limit");
    const file = (0, import_node_path5.join)(root, path);
    for (let parent = (0, import_node_path5.dirname)(file); inside(root, parent); parent = (0, import_node_path5.dirname)(parent)) {
      if ((0, import_node_fs5.lstatSync)(parent).isSymbolicLink()) throw new Error("Dependency snapshot ancestor is a link");
      if (parent === root) break;
    }
    const stat = (0, import_node_fs5.lstatSync)(file);
    hash.update(
      JSON.stringify([
        path,
        stat.mode & 511,
        stat.isDirectory() ? "directory" : stat.isSymbolicLink() ? "link" : "file"
      ])
    );
    if (stat.isSymbolicLink()) {
      const link = (0, import_node_fs5.readlinkSync)(file);
      if (!inside(projectRoot, (0, import_node_path5.resolve)((0, import_node_path5.dirname)((0, import_node_path5.join)(projectRoot, path)), link)))
        throw new Error("Dependency snapshot link leaves project");
      hash.update(JSON.stringify(link));
    } else if (stat.isDirectory()) {
      for (const name of (0, import_node_fs5.readdirSync)(file).sort()) visit2((0, import_node_path5.join)(path, name));
    } else if (stat.isFile()) {
      bytes += stat.size;
      if (bytes > DEPENDENCY_SNAPSHOT_MAX_BYTES) throw new Error("Dependency snapshot size limit");
      hash.update(String(stat.size)).update("\0").update((0, import_node_fs5.readFileSync)(file));
    } else throw new Error("Unsupported dependency snapshot file");
  };
  for (const path of [...paths].sort()) visit2(path);
  return hash.digest("hex");
}
function dependencySnapshot(project, cacheRoot, managerVersion, environment) {
  try {
    if (inside(cacheRoot, project.root)) return;
    if (!PACKAGE_MANAGER_LOCKS[project.manager].some((name) => (0, import_node_fs5.existsSync)((0, import_node_path5.join)(project.root, name)))) return;
    const outputs = new Set(DEPENDENCY_SNAPSHOT_OUTPUTS);
    let inputCount = 0;
    if (/--(?:require|import|loader|experimental-loader)(?:[=\s]|$)/.test(environment.NODE_OPTIONS ?? "")) return;
    const walk = (directory) => (0, import_node_fs5.readdirSync)(directory).sort().flatMap((name) => {
      const file = (0, import_node_path5.join)(directory, name);
      const local = (0, import_node_path5.relative)(project.root, file);
      if (inside(cacheRoot, file) || outputs.has(local) || name === "node_modules" || name === ".git" || name === ".octonode" || name === DEPENDENCY_MUTEX || name.startsWith(".octonode-recovery-"))
        return [];
      if (++inputCount > DEPENDENCY_SNAPSHOT_MAX_FILES) throw new Error("Dependency input file limit");
      const stat = (0, import_node_fs5.lstatSync)(file);
      if (stat.isSymbolicLink()) throw new Error("Linked source is not snapshot eligible");
      if (/^\.?pnpmfile\.[cm]?js$/.test(name))
        throw new Error("Dynamic package-manager hooks require installation");
      if (name === ".yarnrc.yml" && /^(?:plugins|yarnPath):/m.test((0, import_node_fs5.readFileSync)(file, "utf8")))
        throw new Error("Custom Yarn code requires installation");
      if (stat.isDirectory()) return walk(file);
      else {
        if (name === "package.json") {
          const manifest2 = JSON.parse((0, import_node_fs5.readFileSync)(file, "utf8"));
          for (const dependencies of [
            manifest2.dependencies,
            manifest2.devDependencies,
            manifest2.optionalDependencies
          ]) {
            for (const spec of Object.values(dependencies ?? {})) {
              if (typeof spec !== "string") throw new Error("Invalid dependency");
              const localSpec = /^(?:file:|link:|portal:)(.*)$/.exec(spec);
              if (localSpec) {
                const target = (0, import_node_path5.resolve)(directory, localSpec[1]);
                if (!inside(project.root, target) || inside(cacheRoot, target) || (0, import_node_path5.relative)(project.root, target).split(import_node_path5.sep).some((part) => ["node_modules", ".git", ".octonode"].includes(part)))
                  throw new Error("External or excluded dependency is not snapshot eligible");
              }
            }
          }
          outputs.add((0, import_node_path5.relative)(project.root, (0, import_node_path5.join)(directory, "node_modules")));
        }
        return [local];
      }
    });
    const inputs = walk(project.root);
    const inputHash = digestTree(project.root, inputs, project.root);
    const userRoot = environment.HOME ?? (0, import_node_os3.homedir)();
    const configuration = new Set(
      [
        (0, import_node_path5.join)(userRoot, ".npmrc"),
        (0, import_node_path5.join)(userRoot, ".yarnrc"),
        (0, import_node_path5.join)(userRoot, ".yarnrc.yml"),
        (0, import_node_path5.join)(userRoot, ".config/pnpm/rc"),
        "/etc/npmrc",
        "/usr/local/etc/npmrc",
        environment.npm_config_userconfig,
        environment.NPM_CONFIG_USERCONFIG,
        environment.npm_config_globalconfig,
        environment.NPM_CONFIG_GLOBALCONFIG
      ].filter((path) => !!path)
    );
    for (let cursor = (0, import_node_path5.dirname)(project.root); ; cursor = (0, import_node_path5.dirname)(cursor)) {
      for (const name of [".npmrc", ".yarnrc", ".yarnrc.yml"]) configuration.add((0, import_node_path5.join)(cursor, name));
      if (cursor === (0, import_node_path5.dirname)(cursor)) break;
    }
    const configHash = [...configuration].sort().map((file) => {
      if (!(0, import_node_fs5.existsSync)(file)) return [file, null];
      if (/(?:yarnPath|plugins|pnpmfile)/.test((0, import_node_fs5.readFileSync)(file, "utf8")))
        throw new Error("Custom package-manager configuration requires installation");
      return [file, digestTree((0, import_node_path5.dirname)(file), [(0, import_node_path5.relative)((0, import_node_path5.dirname)(file), file)], (0, import_node_path5.dirname)(file))];
    });
    const yarnCache = (0, import_node_path5.join)(cacheRoot, "yarn");
    const nativeCache = project.manager === "yarn" && (0, import_node_fs5.existsSync)(yarnCache) ? digestTree(yarnCache, (0, import_node_fs5.readdirSync)(yarnCache), yarnCache) : null;
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
        environment: Object.entries(environment).sort(([a], [b]) => a.localeCompare(b)),
        inputHash,
        configHash,
        nativeCache
      })
    ).digest("hex");
    const projectKey = (0, import_node_crypto2.createHash)("sha256").update(project.root).digest("hex");
    return {
      root: project.root,
      cacheRoot,
      directory: (0, import_node_path5.join)(cacheRoot, "prepared-v1", projectKey),
      key,
      outputs: [...outputs].sort()
    };
  } catch {
    return void 0;
  }
}
function copy(source, destination) {
  (0, import_node_fs5.cpSync)(source, destination, {
    recursive: true,
    dereference: false,
    verbatimSymlinks: true,
    mode: import_node_fs5.constants.COPYFILE_FICLONE
  });
}
function restoreDependencySnapshot(snapshot) {
  let staging;
  let activated = [];
  let previous = [];
  try {
    if ((0, import_node_fs5.lstatSync)(snapshot.directory, { throwIfNoEntry: false })?.isSymbolicLink()) return false;
    const record = import_zod2.z.object({
      format: import_zod2.z.literal(DEPENDENCY_SNAPSHOT_FORMAT),
      key: import_zod2.z.literal(snapshot.key),
      sha256: import_zod2.z.string().regex(/^[a-f0-9]{64}$/),
      outputs: import_zod2.z.array(import_zod2.z.string()).refine(
        (paths) => new Set(paths).size === paths.length && paths.every((path) => snapshot.outputs.includes(path))
      )
    }).parse(JSON.parse((0, import_node_fs5.readFileSync)((0, import_node_path5.join)(snapshot.directory, "snapshot.json"), "utf8")));
    const stored = (0, import_node_path5.join)(snapshot.directory, "files");
    if (!record.outputs.length || digestTree(stored, record.outputs, snapshot.root) !== record.sha256) return false;
    for (const path of snapshot.outputs) {
      for (let cursor = (0, import_node_path5.dirname)((0, import_node_path5.join)(snapshot.root, path)); inside(snapshot.root, cursor); cursor = (0, import_node_path5.dirname)(cursor)) {
        if ((0, import_node_fs5.lstatSync)(cursor, { throwIfNoEntry: false })?.isSymbolicLink()) return false;
        if (cursor === snapshot.root) break;
      }
    }
    staging = (0, import_node_fs5.mkdtempSync)((0, import_node_path5.join)(snapshot.root, DEPENDENCY_MUTEX, "snapshot-"));
    for (const path of record.outputs) copy((0, import_node_path5.join)(stored, path), (0, import_node_path5.join)(staging, "next", path));
    if (digestTree((0, import_node_path5.join)(staging, "next"), record.outputs, snapshot.root) !== record.sha256) return false;
    for (const path of snapshot.outputs) {
      const target = (0, import_node_path5.join)(snapshot.root, path);
      if ((0, import_node_fs5.lstatSync)(target, { throwIfNoEntry: false })) {
        const backup = (0, import_node_path5.join)(staging, "previous", path);
        (0, import_node_fs5.mkdirSync)((0, import_node_path5.dirname)(backup), { recursive: true });
        (0, import_node_fs5.renameSync)(target, backup);
        previous = [...previous, path];
      }
      if (record.outputs.includes(path)) {
        (0, import_node_fs5.mkdirSync)((0, import_node_path5.dirname)(target), { recursive: true });
        (0, import_node_fs5.renameSync)((0, import_node_path5.join)(staging, "next", path), target);
        activated = [...activated, path];
      }
    }
    return true;
  } catch {
    try {
      for (const path of [...activated].reverse()) (0, import_node_fs5.rmSync)((0, import_node_path5.join)(snapshot.root, path), { recursive: true, force: true });
      for (const path of [...previous].reverse())
        (0, import_node_fs5.renameSync)((0, import_node_path5.join)(staging, "previous", path), (0, import_node_path5.join)(snapshot.root, path));
    } catch {
      const retained = staging;
      staging = void 0;
      throw new Error(`Dependency snapshot activation failed; previous files retained in ${retained}`);
    }
    return false;
  } finally {
    if (staging) (0, import_node_fs5.rmSync)(staging, { recursive: true, force: true });
  }
}
function saveDependencySnapshot(snapshot) {
  let staging;
  try {
    const outputs = snapshot.outputs.filter((path) => (0, import_node_fs5.lstatSync)((0, import_node_path5.join)(snapshot.root, path), { throwIfNoEntry: false }));
    if (!outputs.length) return;
    const sha256 = digestTree(snapshot.root, outputs, snapshot.root);
    (0, import_node_fs5.mkdirSync)((0, import_node_path5.dirname)(snapshot.directory), { recursive: true });
    staging = (0, import_node_fs5.mkdtempSync)((0, import_node_path5.join)((0, import_node_path5.dirname)(snapshot.directory), ".prepared-"));
    for (const path of outputs) copy((0, import_node_path5.join)(snapshot.root, path), (0, import_node_path5.join)(staging, "files", path));
    if (digestTree((0, import_node_path5.join)(staging, "files"), outputs, snapshot.root) !== sha256) return;
    (0, import_node_fs5.writeFileSync)(
      (0, import_node_path5.join)(staging, "snapshot.json"),
      JSON.stringify({ format: DEPENDENCY_SNAPSHOT_FORMAT, key: snapshot.key, sha256, outputs })
    );
    (0, import_node_fs5.rmSync)(snapshot.directory, { recursive: true, force: true });
    (0, import_node_fs5.renameSync)(staging, snapshot.directory);
  } catch {
  } finally {
    if (staging) (0, import_node_fs5.rmSync)(staging, { recursive: true, force: true });
  }
}

// packages/plugin/src/dependencies.ts
var execute = (0, import_node_util.promisify)(import_node_child_process.execFile);
var installations = /* @__PURE__ */ new Map();
function checkTransactionPath(root, file) {
  const local = (0, import_node_path6.relative)(root, file);
  if (!local || local.startsWith("../") || (0, import_node_path6.resolve)(root, local) !== file)
    throw new Error("Transaction path must stay inside its project");
  for (let cursor = file; cursor !== root; cursor = (0, import_node_path6.dirname)(cursor)) {
    const stat = (0, import_node_fs6.lstatSync)(cursor, { throwIfNoEntry: false });
    if (stat?.isSymbolicLink()) throw new Error("Transaction path contains a symbolic link");
  }
}
function manifest(root) {
  const file = (0, import_node_path6.join)(root, "package.json");
  return (0, import_node_fs6.existsSync)(file) ? JSON.parse((0, import_node_fs6.readFileSync)(file, "utf8")) : {};
}
function dependencyCacheRoot(root) {
  return (0, import_node_path6.resolve)(root ?? (0, import_common.OCTONODE_PACKAGE_CACHE)() ?? (0, import_node_path6.join)((0, import_node_os4.homedir)(), ".octonode", "package-cache"));
}
function dependencyPaths(cwd) {
  const start = (0, import_node_fs6.realpathSync)(cwd);
  const ancestors = [];
  for (let path = start; ; path = (0, import_node_path6.dirname)(path)) {
    ancestors.push(path);
    if ((0, import_node_fs6.existsSync)((0, import_node_path6.join)(path, ".git")) || (0, import_node_path6.dirname)(path) === path) break;
  }
  const repository = ancestors.find((path) => (0, import_node_fs6.existsSync)((0, import_node_path6.join)(path, ".git")));
  const target = (0, import_node_fs6.existsSync)((0, import_node_path6.join)(start, "package.json")) ? start : repository ? ancestors.find((path) => (0, import_node_fs6.existsSync)((0, import_node_path6.join)(path, "package.json"))) ?? start : start;
  const root = ancestors.find((path) => {
    if (path === target || !(0, import_node_path6.relative)(path, target) || (0, import_node_path6.relative)(path, target).startsWith("..")) return false;
    const workspaces = manifest(path).workspaces;
    const pnpmWorkspace = (0, import_node_path6.join)(path, "pnpm-workspace.yaml");
    const patterns = (0, import_node_fs6.existsSync)(pnpmWorkspace) ? (0, import_yaml.parse)((0, import_node_fs6.readFileSync)(pnpmWorkspace, "utf8"))?.packages : Array.isArray(workspaces) ? workspaces : workspaces?.packages;
    if (!Array.isArray(patterns)) return false;
    const local = (0, import_node_path6.relative)(path, target).split("\\").join("/");
    const globs = patterns.filter((value) => typeof value === "string");
    return globs.some((pattern) => !pattern.startsWith("!") && (0, import_node_path6.matchesGlob)(local, pattern.replace(/\/$/, ""))) && !globs.some((pattern) => pattern.startsWith("!") && (0, import_node_path6.matchesGlob)(local, pattern.slice(1).replace(/\/$/, "")));
  }) ?? target;
  return { root, target };
}
function resolveDependencyProject(cwd) {
  const { root, target } = dependencyPaths(cwd);
  const declared = manifest(root).packageManager;
  const locked = Object.keys(PACKAGE_MANAGER_LOCKS).filter(
    (manager2) => PACKAGE_MANAGER_LOCKS[manager2].some((file) => (0, import_node_fs6.existsSync)((0, import_node_path6.join)(root, file)))
  );
  const manager = declared?.split("@")[0];
  if (manager && !(manager in PACKAGE_MANAGER_LOCKS)) throw new Error(`unsupported package manager: ${declared}`);
  if (locked.length > 1 || manager && locked.some((lockedManager) => lockedManager !== manager)) {
    throw new Error("conflicting package managers: keep the lockfile matching package.json packageManager");
  }
  return {
    target,
    root,
    manager: manager ?? locked[0] ?? ((0, import_node_fs6.existsSync)((0, import_node_path6.join)(root, "pnpm-workspace.yaml")) ? "pnpm" : (0, import_node_fs6.existsSync)((0, import_node_path6.join)(target, "package.json")) ? "npm" : "pnpm"),
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
  return (0, import_common.childProcessEnvironment)({
    ...(0, import_common.packageCacheEnvironment)(dependencyCacheRoot(cacheRoot)),
    YARN_ENABLE_SCRIPTS: "false",
    COREPACK_ENABLE_DOWNLOAD_PROMPT: "0",
    COREPACK_ENABLE_AUTO_PIN: "0"
  });
}
function isClassicYarn(project) {
  return project.manager === "yarn" && (project.declared?.startsWith("yarn@1.") || !project.declared && (0, import_node_fs6.existsSync)((0, import_node_path6.join)(project.root, "yarn.lock")) && (0, import_node_fs6.readFileSync)((0, import_node_path6.join)(project.root, "yarn.lock"), "utf8").includes("# yarn lockfile v1"));
}
async function run(project, command, cwd, cacheRoot) {
  const [file, args] = command;
  const yarnClassic = isClassicYarn(project);
  const flags = yarnClassic ? [
    ...args.filter((arg) => arg !== "--mode=skip-build").map((arg) => arg === "--immutable" ? "--frozen-lockfile" : arg),
    "--ignore-scripts"
  ] : project.manager === "pnpm" && args[0] === "add" && project.root === cwd && (0, import_node_fs6.existsSync)((0, import_node_path6.join)(cwd, "pnpm-workspace.yaml")) ? [...args, "--workspace-root"] : args;
  const pinned = project.declared && file !== "bun" || yarnClassic;
  const executable = yarnClassic && !project.declared ? CLASSIC_YARN : file;
  await execute(pinned ? "corepack" : file, pinned ? [executable, ...flags] : flags, {
    cwd,
    env: installEnvironment(cacheRoot),
    timeout: DEPENDENCY_INSTALL_TIMEOUT_MS,
    maxBuffer: 4 * 1024 * 1024
  });
}
async function verifyProjectDependencies(project, names) {
  if (!names.length) return;
  const pnp = (0, import_node_path6.join)(project.root, ".pnp.cjs");
  const loader = (0, import_node_path6.join)(project.root, ".pnp.loader.mjs");
  await execute(
    process.execPath,
    [
      ...(0, import_node_fs6.existsSync)(pnp) ? ["--require", pnp] : [],
      ...(0, import_node_fs6.existsSync)(loader) ? ["--loader", loader] : [],
      "--input-type=module",
      "-e",
      `import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const require = createRequire(${JSON.stringify((0, import_node_path6.join)(project.target, "package.json"))});
for (const name of ${JSON.stringify(names)}) {
  try { require.resolve(name); } catch {
    const entry = import.meta.resolve(name);
    if (entry.startsWith('file:') && !existsSync(fileURLToPath(entry))) throw new Error('missing package entry: ' + name);
  }
}`
    ],
    { cwd: project.target, env: (0, import_common.childProcessEnvironment)(), timeout: 3e4, maxBuffer: 1024 * 1024 }
  );
}
async function withDependencyInstall(cwd, action) {
  if (process.platform === "win32")
    throw new Error("Plugin dependency lifecycle currently supports macOS and Linux; use WSL on Windows");
  const root = dependencyPaths(cwd).root;
  const previous = installations.get(root) ?? Promise.resolve();
  const next = previous.catch(() => {
  }).then(async () => {
    const mutex = (0, import_node_path6.join)(root, DEPENDENCY_MUTEX);
    try {
      (0, import_node_fs6.mkdirSync)(mutex);
    } catch {
      throw new Error(
        "Another dependency installation is running or needs recovery; use octonodes plugin recover after it exits"
      );
    }
    (0, import_node_fs6.writeFileSync)((0, import_node_path6.join)(mutex, "owner.json"), JSON.stringify({ pid: process.pid }));
    try {
      return await action();
    } finally {
      if (!(0, import_node_fs6.existsSync)((0, import_node_path6.join)(mutex, "journal.json"))) (0, import_node_fs6.rmSync)(mutex, { recursive: true, force: true });
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
  const project = resolveDependencyProject(cwd);
  const packageJson = (0, import_node_path6.join)(project.target, "package.json");
  if (!dependencies.length && !(0, import_node_fs6.existsSync)(packageJson) && !options.commit) return;
  const hasLock = PACKAGE_MANAGER_LOCKS[project.manager].some((file) => (0, import_node_fs6.existsSync)((0, import_node_path6.join)(project.root, file)));
  if (options.frozen && !hasLock)
    throw new Error("commit the native package-manager lockfile before preparing this worktree");
  const files = [
    .../* @__PURE__ */ new Set([
      packageJson,
      (0, import_node_path6.join)(project.root, "package.json"),
      ...Object.values(PACKAGE_MANAGER_LOCKS).flat().map((file) => (0, import_node_path6.join)(project.root, file)),
      (0, import_node_path6.join)(project.root, "pnpm-workspace.yaml"),
      ...options.transactionFiles ?? []
    ])
  ];
  for (const path of files) checkTransactionPath(project.root, path);
  const before = new Map(files.map((path) => [path, (0, import_node_fs6.existsSync)(path) ? (0, import_node_fs6.readFileSync)(path) : void 0]));
  const journal = (0, import_node_path6.join)(project.root, DEPENDENCY_MUTEX, "journal.json");
  const hadModules = (0, import_node_fs6.existsSync)((0, import_node_path6.join)(project.root, "node_modules"));
  const pnpFiles = [".pnp.cjs", ".pnp.loader.mjs", ".pnp.data.json"];
  const pnpBefore = new Map(
    pnpFiles.map((file) => {
      const path = (0, import_node_path6.join)(project.root, file);
      return [path, (0, import_node_fs6.existsSync)(path) ? (0, import_node_fs6.readFileSync)(path) : void 0];
    })
  );
  const hadInstall = hadModules || (0, import_node_fs6.existsSync)((0, import_node_path6.join)(project.root, ".pnp.cjs"));
  let metadataTouched = false;
  const metadata = new Set(options.transactionFiles ?? []);
  const restoreBefore = () => {
    for (const [path, content] of before) {
      if (metadata.has(path) && !metadataTouched) continue;
      if (content === void 0) (0, import_node_fs6.rmSync)(path, { force: true });
      else (0, import_node_fs6.writeFileSync)(path, content);
    }
  };
  if (hadInstall && !hasLock && !options.metadataOnly)
    throw new Error(
      "create a native lockfile before updating existing dependencies so failed installations can be recovered"
    );
  try {
    if (options.metadataOnly && (0, import_node_fs6.existsSync)((0, import_node_path6.dirname)(journal)))
      (0, import_node_fs6.writeFileSync)((0, import_node_path6.join)((0, import_node_path6.dirname)(journal), "metadata-only"), "1");
    if ((0, import_node_fs6.existsSync)((0, import_node_path6.dirname)(journal)))
      (0, import_node_fs6.writeFileSync)(
        journal,
        JSON.stringify(
          [...before].map(([path, content]) => ({
            path: (0, import_node_path6.relative)(project.root, path).replaceAll("\\", "/"),
            content: content?.toString("base64") ?? null
          }))
        )
      );
    if (options.metadataOnly) {
      metadataTouched = true;
      options.commit?.();
      (0, import_node_fs6.rmSync)(journal, { force: true });
      (0, import_node_fs6.rmSync)((0, import_node_path6.join)((0, import_node_path6.dirname)(journal), "metadata-only"), { force: true });
      return;
    }
    if (!(0, import_node_fs6.existsSync)(packageJson)) {
      (0, import_node_fs6.mkdirSync)(project.target, { recursive: true });
      (0, import_node_fs6.writeFileSync)(
        packageJson,
        JSON.stringify({ private: true, packageManager: DEFAULT_PACKAGE_MANAGER }, null, 2) + "\n"
      );
    }
    const current = resolveDependencyProject(cwd);
    const snapshotEnvironment = installEnvironment(options.cacheRoot);
    const pinnedManager = current.declared && current.manager !== "bun" || isClassicYarn(current);
    const versionCommand = isClassicYarn(current) && !current.declared ? CLASSIC_YARN : current.manager;
    const managerVersion = options.frozen && (options.cacheRoot || (0, import_common.OCTONODE_PACKAGE_CACHE)()) ? await execute(
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
    if (!restored)
      await run(
        current,
        dependencies.length ? packageManagerAdd(
          current.manager,
          ...dependencies.map(({ name, spec }) => spec.startsWith(`${name}@`) ? spec : `${name}@${spec}`)
        ) : installCommand(current, options.frozen ?? false),
        dependencies.length ? current.target : current.root,
        options.cacheRoot
      );
    await verifyProjectDependencies(
      current,
      dependencies.flatMap(({ name, subpaths }) => subpaths ? subpaths.map((path) => name + path.slice(1)) : [name])
    );
    if (options.frozen) {
      for (const [path, content] of before) {
        const after = (0, import_node_fs6.existsSync)(path) ? (0, import_node_fs6.readFileSync)(path) : void 0;
        if (content?.equals(after ?? Buffer.alloc(0)) || !content && !after) continue;
        if (path.endsWith("package.json") && content && after && (0, import_node_util.isDeepStrictEqual)(JSON.parse(content.toString()), JSON.parse(after.toString()))) {
          (0, import_node_fs6.writeFileSync)(path, content);
        } else {
          throw new Error(`frozen installation changed ${(0, import_node_path6.relative)(project.root, path)}`);
        }
      }
    }
    for (const path of metadata) {
      const content = before.get(path);
      const current2 = (0, import_node_fs6.existsSync)(path) ? (0, import_node_fs6.readFileSync)(path) : void 0;
      if (!(content?.equals(current2 ?? Buffer.alloc(0)) || !content && !current2))
        throw new Error(
          `Owner metadata changed during installation: ${(0, import_node_path6.relative)(project.root, path)}; refresh and retry`
        );
    }
    metadataTouched = true;
    options.commit?.();
    (0, import_node_fs6.rmSync)(journal, { force: true });
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
    const changed = [...before].filter(([path, content]) => (0, import_node_fs6.existsSync)(path) && !content?.equals((0, import_node_fs6.readFileSync)(path)));
    if (changed.length) {
      const backup = (0, import_node_path6.join)(project.root, `.octonode-recovery-${Date.now()}`);
      for (const [path] of changed) {
        checkTransactionPath(project.root, path);
        const target = (0, import_node_path6.join)(backup, (0, import_node_path6.relative)(project.root, path));
        (0, import_node_fs6.mkdirSync)((0, import_node_path6.dirname)(target), { recursive: true });
        (0, import_node_fs6.writeFileSync)(target, (0, import_node_fs6.readFileSync)(path));
      }
      process.stderr.write(`Pre-rollback files preserved in ${backup}
`);
    }
    restoreBefore();
    let recovery = "";
    if (!options.metadataOnly && hadInstall && hasLock) {
      try {
        await run(project, installCommand(project, true), project.root, options.cacheRoot);
      } catch {
        recovery = "; manifests restored, but dependency recovery failed \u2014 run a frozen install before executing workflows";
      }
      restoreBefore();
    } else if (!options.metadataOnly && !hadInstall) {
      (0, import_node_fs6.rmSync)((0, import_node_path6.join)(project.root, "node_modules"), { recursive: true, force: true });
    }
    for (const [path, content] of pnpBefore) {
      if (content === void 0) (0, import_node_fs6.rmSync)(path, { force: true });
      else (0, import_node_fs6.writeFileSync)(path, content);
    }
    const failure = error;
    if (!recovery) (0, import_node_fs6.rmSync)(journal, { force: true });
    throw new Error(`package installation failed: ${failure.stderr?.trim() || failure.message}${recovery}`);
  }
}
async function recoverDependencyInstall(cwd) {
  const project = resolveDependencyProject(cwd);
  const mutex = (0, import_node_path6.join)(project.root, DEPENDENCY_MUTEX);
  if (!(0, import_node_fs6.existsSync)(mutex)) return;
  checkTransactionPath(project.root, (0, import_node_path6.join)(mutex, "owner.json"));
  const owner = JSON.parse((0, import_node_fs6.readFileSync)((0, import_node_path6.join)(mutex, "owner.json"), "utf8"));
  if (!Number.isInteger(owner.pid) || owner.pid < 1)
    throw new Error("Invalid installation owner; inspect the transaction manually");
  try {
    process.kill(owner.pid, 0);
    throw new Error("Installation owner is still running");
  } catch (error) {
    if (error.code !== "ESRCH") throw error;
  }
  const journal = (0, import_node_path6.join)(mutex, "journal.json");
  checkTransactionPath(project.root, journal);
  if ((0, import_node_fs6.existsSync)(journal)) {
    const records = JSON.parse((0, import_node_fs6.readFileSync)(journal, "utf8"));
    if (!Array.isArray(records)) throw new Error("Invalid recovery journal");
    for (const record of records) {
      if (!record || typeof record.path !== "string" || !record.path || record.path.includes("\\") || record.path.startsWith("/") || record.path.split("/").some((part) => part === ".." || part === "." || part.includes(":")) || record.content !== null && typeof record.content !== "string")
        throw new Error("Invalid recovery journal path");
      checkTransactionPath(project.root, (0, import_node_path6.join)(project.root, record.path));
      checkTransactionPath(project.root, (0, import_node_path6.join)(mutex, "recovery-backup", record.path));
    }
    for (const record of records) {
      const path = (0, import_node_path6.join)(project.root, record.path);
      if ((0, import_node_fs6.existsSync)(path)) {
        const backup = (0, import_node_path6.join)(mutex, "recovery-backup", record.path);
        (0, import_node_fs6.mkdirSync)((0, import_node_path6.dirname)(backup), { recursive: true });
        if (!(0, import_node_fs6.existsSync)(backup)) (0, import_node_fs6.writeFileSync)(backup, (0, import_node_fs6.readFileSync)(path));
      }
      if (record.content === null) (0, import_node_fs6.rmSync)(path, { force: true });
      else (0, import_node_fs6.writeFileSync)(path, Buffer.from(record.content, "base64"));
    }
    if (!(0, import_node_fs6.existsSync)((0, import_node_path6.join)(mutex, "metadata-only")) && PACKAGE_MANAGER_LOCKS[project.manager].some((file) => (0, import_node_fs6.existsSync)((0, import_node_path6.join)(project.root, file))))
      await run(project, installCommand(project, true), project.root);
  }
  if ((0, import_node_fs6.existsSync)((0, import_node_path6.join)(mutex, "recovery-backup"))) {
    const backup = (0, import_node_path6.join)(project.root, `.octonode-recovery-${Date.now()}`);
    (0, import_node_fs6.renameSync)((0, import_node_path6.join)(mutex, "recovery-backup"), backup);
    process.stderr.write(`Pre-recovery files preserved in ${backup}
`);
  }
  (0, import_node_fs6.rmSync)(mutex, { recursive: true, force: true });
}
function installProjectDependencies(cwd, dependencies = [], options = {}) {
  return withDependencyInstall(cwd, () => reconcileDependencies(cwd, dependencies, options));
}

// packages/plugin/src/generated-package.ts
var import_tar = require("tar");
var import_node_zlib = require("node:zlib");
var import_node_crypto4 = require("node:crypto");
var import_node_fs8 = require("node:fs");
var import_node_os5 = require("node:os");
var import_node_path8 = require("node:path");

// packages/plugin/src/authoring/artifact.ts
var import_node_crypto3 = require("node:crypto");
var import_node_fs7 = require("node:fs");
var import_node_path7 = require("node:path");
var import_schema3 = __toESM(require_dist());
var import_yaml2 = require("yaml");

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
var fileHash = (path) => (0, import_node_crypto3.createHash)("sha256").update((0, import_node_fs7.readFileSync)(path)).digest("hex");
function safePath(path) {
  if (!path || (0, import_node_path7.isAbsolute)(path) || path.includes("\\") || path.split("/").some((part) => !part || part === "." || part === ".." || part.includes(":") || FORBIDDEN_PART.test(part))) {
    throw new Error(`Unsafe plugin file: ${path}`);
  }
}
function pluginFiles(root, prefix = "") {
  if (!(0, import_node_fs7.lstatSync)((0, import_node_path7.join)(root, prefix)).isDirectory()) throw new Error(`Not a plugin directory: ${root}`);
  return (0, import_node_fs7.readdirSync)((0, import_node_path7.join)(root, prefix)).sort().flatMap((name) => {
    const path = prefix ? `${prefix}/${name}` : name;
    safePath(path);
    const stat = (0, import_node_fs7.lstatSync)((0, import_node_path7.join)(root, path));
    if (stat.isSymbolicLink()) throw new Error(`Plugin files cannot be symbolic links: ${path}`);
    if (stat.isDirectory()) return pluginFiles(root, path);
    if (!stat.isFile()) throw new Error(`Plugin asset must be a regular file: ${path}`);
    return [path];
  });
}
function loadManifest(directory) {
  if ((0, import_node_fs7.lstatSync)(directory).isSymbolicLink()) throw new Error("Plugin directory cannot be a symbolic link");
  const definitions = DEFINITION_FILES.filter((name) => (0, import_node_fs7.existsSync)((0, import_node_path7.join)(directory, name)));
  if (definitions.length !== 1) throw new Error("Keep exactly one plugin definition in the package");
  const path = (0, import_node_path7.join)(directory, definitions[0]);
  const stat = (0, import_node_fs7.lstatSync)(path);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 1048576)
    throw new Error("Invalid plugin definition file");
  const document = (0, import_yaml2.parseDocument)((0, import_node_fs7.readFileSync)(path, "utf8"), { uniqueKeys: true, version: "1.2" });
  (0, import_yaml2.visit)(document, {
    Alias() {
      throw new Error("Plugin definitions cannot contain YAML aliases");
    }
  });
  if (document.errors.length || document.warnings.length) throw new Error("Invalid plugin definition YAML/JSON");
  const data = document.toJS({ maxAliasCount: 0 });
  if (definitions[0] === "octonode.plugin.json") return import_schema3.PluginManifest.parse(data);
  if (data?.apiVersion !== import_schema3.SETTINGS_API_VERSION) throw new Error("Unsupported plugin apiVersion");
  return import_schema3.PluginManifest.parse(data.plugin);
}
function verifyBuild(directory) {
  const manifest2 = loadManifest(directory);
  const files = pluginFiles(directory);
  if (!files.includes(BUILD_RECORD)) throw new Error("Missing build record; run octonodes plugin build first");
  const record = JSON.parse((0, import_node_fs7.readFileSync)((0, import_node_path7.join)(directory, BUILD_RECORD), "utf8"));
  if (record.runtime) {
    const runtime = import_schema3.PreparedPluginRuntime.parse(record.runtime);
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
    if (record.files[file] !== fileHash((0, import_node_path7.join)(directory, file)))
      throw new Error(`Plugin file changed since build: ${file}`);
  }
  if (!expected.includes("dist/index.js") || !manifest2.nodes.length || manifest2.nodes.some(
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
    if (!expected.includes(entry) || (0, import_node_fs7.lstatSync)((0, import_node_path7.join)(directory, entry)).size > import_schema3.PLUGIN_UI_BUNDLE_MAX_BYTES)
      throw new Error(`Invalid plugin UI bundle: ${entry}`);
  }
  if (JSON.stringify(record.ui ?? []) !== JSON.stringify(
    ui.map((declaration) => ({
      ...declaration,
      size: (0, import_node_fs7.lstatSync)((0, import_node_path7.join)(directory, declaration.path)).size,
      sha256: fileHash((0, import_node_path7.join)(directory, declaration.path))
    }))
  ))
    throw new Error("Invalid plugin UI build record");
  return { manifest: manifest2, files };
}

// packages/plugin/src/generated-package.constants.ts
var GENERATED_PLUGIN_PACKAGE = "@octonodes/plugin";
var GENERATED_PLUGIN_DIRECTORY = ".octonode-generated";
var GENERATED_PLUGIN_FORMAT = 1;

// packages/plugin/src/generated-package.ts
async function generatePluginPackage(cwd, selections, expectedPacker) {
  const selected = [...selections].sort((a, b) => a.alias < b.alias ? -1 : a.alias > b.alias ? 1 : 0);
  if (!selected.length || new Set(selected.map(({ alias }) => alias)).size !== selected.length)
    throw new Error("Select at least one library with unique aliases");
  for (const { alias, sha256 } of selected) {
    if (!/^[a-z][a-z0-9-]*$/.test(alias) || /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/.test(alias))
      throw new Error(`Invalid plugin import alias: ${alias}`);
    if (!/^sha256:[a-f0-9]{64}$/.test(sha256)) throw new Error(`Invalid plugin checksum: ${alias}`);
  }
  const packer = "tar@7.5.22/portable-v1";
  if (expectedPacker && expectedPacker !== packer)
    throw new Error(`Plugin package restore requires ${expectedPacker}; found ${packer}`);
  const digest = (0, import_node_crypto4.createHash)("sha256").update(
    JSON.stringify({
      format: GENERATED_PLUGIN_FORMAT,
      packer,
      selections: selected.map(({ alias, sha256 }) => ({ alias, sha256 }))
    })
  ).digest("hex");
  const stage = (0, import_node_fs8.mkdtempSync)((0, import_node_path8.join)((0, import_node_os5.tmpdir)(), "octonode-package-"));
  try {
    const packageRoot = (0, import_node_path8.join)(stage, "package");
    (0, import_node_fs8.mkdirSync)(packageRoot);
    for (const { alias, directory, sha256 } of selected) {
      if ((0, import_node_fs8.lstatSync)(directory).isSymbolicLink())
        throw new Error(`Plugin directory cannot be a symbolic link: ${alias}`);
      const snapshot = (0, import_node_path8.join)(stage, "snapshots", alias);
      (0, import_node_fs8.mkdirSync)(snapshot, { recursive: true });
      for (const file of pluginBundleFiles(directory)) {
        safePath(file);
        (0, import_node_fs8.mkdirSync)((0, import_node_path8.dirname)((0, import_node_path8.join)(snapshot, file)), { recursive: true });
        (0, import_node_fs8.writeFileSync)((0, import_node_path8.join)(snapshot, file), (0, import_node_fs8.readFileSync)((0, import_node_path8.join)(directory, file)));
      }
      if (hashPluginDir(snapshot) !== sha256) throw new Error(`Plugin integrity mismatch: ${alias}`);
      const library = (0, import_node_path8.join)(snapshot, "library");
      if (!(0, import_node_fs8.existsSync)((0, import_node_path8.join)(library, "index.js")) || !(0, import_node_fs8.existsSync)((0, import_node_path8.join)(library, "index.d.ts")))
        throw new Error(`Plugin ${alias} has no importable library; rebuild with a compatible CLI`);
      for (const file of pluginFiles(library)) {
        const target = (0, import_node_path8.join)(packageRoot, alias, file);
        (0, import_node_fs8.mkdirSync)((0, import_node_path8.dirname)(target), { recursive: true });
        (0, import_node_fs8.writeFileSync)(target, (0, import_node_fs8.readFileSync)((0, import_node_path8.join)(library, file)));
        (0, import_node_fs8.chmodSync)(target, 420);
      }
    }
    const subpaths = selected.map(({ alias }) => `./${alias}`);
    (0, import_node_fs8.writeFileSync)(
      (0, import_node_path8.join)(packageRoot, "package.json"),
      JSON.stringify(
        {
          name: GENERATED_PLUGIN_PACKAGE,
          version: `0.0.0-${digest}`,
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
    (0, import_node_fs8.chmodSync)((0, import_node_path8.join)(packageRoot, "package.json"), 420);
    const archive = (0, import_node_path8.join)(stage, "package.tar");
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
    const bytes = (0, import_node_zlib.gzipSync)((0, import_node_fs8.readFileSync)(archive), { level: 0 });
    bytes[9] = 255;
    const output = (0, import_node_path8.join)(cwd, GENERATED_PLUGIN_DIRECTORY);
    (0, import_node_fs8.mkdirSync)(output, { recursive: true });
    if ((0, import_node_fs8.lstatSync)(output).isSymbolicLink()) throw new Error("Generated plugin directory cannot be a symbolic link");
    const ignore = (0, import_node_path8.join)(output, ".gitignore");
    if (!(0, import_node_fs8.existsSync)(ignore)) (0, import_node_fs8.writeFileSync)(ignore, "*\n", { flag: "wx" });
    const destination = (0, import_node_path8.join)(output, `plugin-${digest}.tgz`);
    if ((0, import_node_fs8.existsSync)(destination)) {
      if ((0, import_node_fs8.lstatSync)(destination).isSymbolicLink() || !(0, import_node_fs8.readFileSync)(destination).equals(bytes))
        throw new Error("Generated plugin package changed; remove the corrupt generated file and restore again");
    } else {
      const temporary = (0, import_node_fs8.mkdtempSync)((0, import_node_path8.join)(output, ".pack-"));
      try {
        (0, import_node_fs8.writeFileSync)((0, import_node_path8.join)(temporary, "package.tgz"), bytes);
        (0, import_node_fs8.renameSync)((0, import_node_path8.join)(temporary, "package.tgz"), destination);
      } finally {
        (0, import_node_fs8.rmSync)(temporary, { recursive: true, force: true });
      }
    }
    return {
      name: GENERATED_PLUGIN_PACKAGE,
      spec: `file:./${GENERATED_PLUGIN_DIRECTORY}/plugin-${digest}.tgz`,
      subpaths,
      packer,
      sha256: `sha256:${(0, import_node_crypto4.createHash)("sha256").update(bytes).digest("hex")}`
    };
  } finally {
    (0, import_node_fs8.rmSync)(stage, { recursive: true, force: true });
  }
}

// packages/plugin/src/plugin-dependencies.ts
function pluginNpmDependencies(manifest2) {
  return manifest2.integration?.npmDependencies ?? (manifest2.integration?.npm ? [manifest2.integration.npm] : []);
}

// packages/plugin/src/prepared/invocation.ts
var import_common3 = __toESM(require_dist2());
var import_schema5 = __toESM(require_dist());

// packages/plugin/src/prepared/runtime.ts
var import_node_fs9 = require("node:fs");
var import_node_path9 = require("node:path");
var import_tar2 = require("tar");
var import_common2 = __toESM(require_dist2());
var import_schema4 = __toESM(require_dist());
function preparedRuntime(directory) {
  const path = (0, import_node_path9.join)(directory, BUILD_RECORD);
  if (!(0, import_node_fs9.existsSync)(path)) return;
  const record = JSON.parse((0, import_node_fs9.readFileSync)(path, "utf8"));
  if (record.runtime === void 0) return;
  return import_schema4.PreparedPluginRuntime.parse(record.runtime);
}
function assertPreparedRuntime(runtime) {
  const libc = process.platform === "linux" && process.report.getReport().header?.glibcVersionRuntime ? "glibc" : "musl";
  if (Number(process.versions.node.split(".")[0]) !== runtime.nodeMajor || runtime.platform !== "portable" && (runtime.platform !== process.platform || runtime.arch !== process.arch || runtime.platform === "linux" && runtime.libc !== libc))
    throw new Error("Prepared plugin runtime is incompatible; rebuild for this Node/platform/architecture/libc");
}

// packages/plugin/src/prepared/invocation.ts
function usesPreparedRunner(directory) {
  if (import_common3.PROCESS_ENV.OCTONODE_PLUGIN_RUNNER !== "true") return false;
  const runtime = preparedRuntime(directory);
  if (!runtime) return false;
  assertPreparedRuntime(runtime);
  const { manifest: manifest2 } = verifyBuild(directory);
  return !manifest2.permissions.some((permission) => permission.resource === "project_data");
}
function preparedPluginPin(directory, pin) {
  return !!pin?.installId && !!pin.registry && pin.registry.replace(/\/$/, "") === ((0, import_common3.OCTONODE_MARKETPLACE_URL)() ?? import_common3.DEFAULT_MARKETPLACE_URL).replace(/\/$/, "") && usesPreparedRunner(directory);
}

// packages/plugin/src/lifecycle.ts
async function reconcilePluginLock(cwd, next, options = {}) {
  const project = resolveDependencyProject(cwd);
  const before = readLockfile(cwd);
  const loaded = Object.entries(next.plugins).map(([alias, pin]) => {
    const directory = storeEntryDir(pin.pluginId ?? alias, pin.version, pin.sha256, options.storeRoot);
    const manifest2 = loadPluginManifest(directory);
    if (manifest2.id !== (pin.pluginId ?? alias) || manifest2.version !== pin.version || hashPluginDir(directory) !== pin.sha256)
      throw new Error(`Plugin identity or integrity mismatch: ${alias}`);
    return { alias, directory, sha256: pin.sha256, manifest: manifest2, remote: preparedPluginPin(directory, pin) };
  });
  const libraries = loaded.filter((item) => item.manifest.library);
  const generated = libraries.length ? await generatePluginPackage(project.target, libraries) : void 0;
  const packageFile = (0, import_node_path10.join)(project.target, "package.json");
  const packageJson = (0, import_node_fs10.existsSync)(packageFile) ? JSON.parse((0, import_node_fs10.readFileSync)(packageFile, "utf8")) : {};
  const declared = { ...packageJson.devDependencies, ...packageJson.optionalDependencies, ...packageJson.dependencies };
  if (generated && declared[generated.name] && declared[generated.name].replace(/^file:\.\//, "file:") !== before.generated?.spec.replace(/^file:\.\//, "file:") && !options.migrate)
    throw new Error(
      "Existing @octonodes/plugin dependency is not managed by this lock; pass --migrate to replace it explicitly"
    );
  const dependencies = loaded.filter((item) => !item.remote || item.manifest.library).flatMap(
    ({ manifest: manifest2 }) => pluginNpmDependencies(manifest2).map((npm) => {
      const spec = npm.spec.startsWith(`${npm.package}@`) ? npm.spec.slice(npm.package.length + 1) : npm.spec;
      const sameLocal = typeof declared[npm.package] === "string" && declared[npm.package].startsWith("file:") && spec.startsWith("file:") && (0, import_node_path10.resolve)(project.target, declared[npm.package].slice(5)) === (0, import_node_path10.resolve)(project.target, spec.slice(5));
      if (declared[npm.package] && declared[npm.package] !== spec && !sameLocal)
        throw new Error(
          `Dependency conflict: ${npm.package} is ${declared[npm.package]}, plugin requires ${spec}; reconcile it explicitly first`
        );
      const subpaths = manifest2.nodes.filter((node) => node.source?.kind === "npm" && node.source.package === npm.package).flatMap(
        (node) => node.implementation?.module.startsWith(`${npm.package}/`) ? ["." + node.implementation.module.slice(npm.package.length)] : []
      );
      return { name: npm.package, spec, ...subpaths.length ? { subpaths: [...new Set(subpaths)] } : {} };
    })
  );
  const unique = [...new Map(dependencies.map((item) => [item.name, item])).values()];
  if (dependencies.some((item) => unique.some((other) => item.name === other.name && item.spec !== other.spec)))
    throw new Error("Selected plugins require conflicting npm dependency versions");
  const committed = { ...next, generated };
  if (options.dryRun) return committed;
  if (generated || before.generated || unique.length || options.commit) {
    await reconcileDependencies(project.target, [...unique, ...generated ? [generated] : []], {
      cacheRoot: options.cacheRoot,
      metadataOnly: !generated && !before.generated && !unique.length,
      remove: !generated && before.generated ? [before.generated.name] : void 0,
      transactionFiles: [lockfilePath(cwd), ...options.transactionFiles ?? []],
      commit: () => {
        options.commit?.();
        writeLockfile(cwd, committed);
      }
    });
  } else writeLockfile(cwd, committed);
  return committed;
}
async function activatePluginPin(alias, pin, options = {}) {
  const cwd = resolveDependencyProject(options.cwd ?? process.cwd()).target;
  if (!/^[a-z][a-z0-9-]*$/.test(alias)) throw new Error("Invalid project plugin alias");
  return withDependencyInstall(cwd, () => {
    const lock = readLockfile(cwd);
    const previous = lock.plugins[alias];
    if (previous && ((previous.pluginId ?? alias) !== (pin.pluginId ?? alias) || previous.registry !== pin.registry || previous.scope !== pin.scope || previous.remoteId !== pin.remoteId || previous.publisher !== pin.publisher))
      throw new Error(`Plugin alias ${alias} belongs to another source; choose another alias or remove it first`);
    return reconcilePluginLock(cwd, { ...lock, plugins: { ...lock.plugins, [alias]: pin } }, options);
  });
}
async function installLocalArtifact(directory, options = {}) {
  const manifest2 = loadPluginManifest(directory);
  if (manifest2.library) verifyBuild(directory);
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
    const plugins = Object.fromEntries(Object.entries(lock.plugins).filter(([id]) => id !== alias));
    await reconcilePluginLock(cwd, { ...lock, plugins }, options);
  });
}

// packages/plugin/src/restore.ts
var import_node_fs14 = require("node:fs");
var import_node_path14 = require("node:path");

// packages/plugin/src/remote/registry.ts
var import_node_fs13 = require("node:fs");
var import_node_os6 = require("node:os");
var import_node_path13 = require("node:path");

// packages/plugin/src/install.ts
var import_node_fs11 = require("node:fs");
var import_node_path11 = require("node:path");
var import_node_child_process2 = require("node:child_process");
var import_node_util2 = require("node:util");
var import_common4 = __toESM(require_dist2());
function commandError(err) {
  const error = err;
  return [error.stderr, error.stdout].map((output) => output?.toString().trim()).find(Boolean) ?? error.message;
}
function installRoot(opts) {
  return opts.project ? { root: projectPluginRoot(opts.cwd), source: "project" } : { root: userPluginRoot(), source: "user" };
}
async function installNodeDeps(dir, opts = {}) {
  if (opts.noDeps) return {};
  const dependencies = pluginNpmDependencies(loadPluginManifest(dir));
  if (dependencies.length) {
    try {
      if (opts.cacheOnly) {
        for (const npm of dependencies)
          await (0, import_node_util2.promisify)(import_node_child_process2.execFile)("npm", ["cache", "add", "--ignore-scripts", "--", npm.spec], {
            env: (0, import_common4.childProcessEnvironment)((0, import_common4.packageCacheEnvironment)(dependencyCacheRoot(opts.cacheRoot))),
            timeout: 10 * 6e4
          });
        return {};
      }
      await installProjectDependencies(
        opts.cwd ?? process.cwd(),
        dependencies.map((npm) => ({ name: npm.package, spec: npm.spec })),
        {
          cacheRoot: opts.cacheRoot
        }
      );
      return { depsInstalled: true };
    } catch (err) {
      return { depsInstalled: false, depsError: commandError(err) };
    }
  }
  const pjPath = (0, import_node_path11.join)(dir, "package.json");
  if (!(0, import_node_fs11.existsSync)(pjPath)) return {};
  const pj = JSON.parse((0, import_node_fs11.readFileSync)(pjPath, "utf8"));
  if (!pj.dependencies && !pj.optionalDependencies) return {};
  try {
    await (0, import_node_util2.promisify)(import_node_child_process2.execFile)(
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
        env: (0, import_common4.childProcessEnvironment)((0, import_common4.packageCacheEnvironment)(dependencyCacheRoot(opts.cacheRoot))),
        timeout: 10 * 6e4
      }
    );
    return { depsInstalled: true };
  } catch (err) {
    return { depsInstalled: false, depsError: commandError(err) };
  }
}
async function installPlugin(src, opts = {}) {
  if (!(0, import_node_fs11.existsSync)(src) || !(0, import_node_fs11.statSync)(src).isDirectory()) {
    throw new Error(`source "${src}" is not a directory`);
  }
  if (!isPluginDir(src)) {
    throw new Error(`source "${src}" has no octonode.plugin.json`);
  }
  const { manifest: manifest2 } = loadPlugin(src);
  const { root, source } = installRoot(opts);
  const dest = (0, import_node_path11.join)(root, manifest2.id);
  if ((0, import_node_fs11.existsSync)(dest)) {
    if (!opts.force) {
      throw new Error(`plugin "${manifest2.id}" is already installed at ${dest} (use --force to overwrite)`);
    }
  }
  const deps = pluginNpmDependencies(manifest2).length ? await installNodeDeps(src, { ...opts, cacheOnly: opts.cacheOnly ?? !opts.project }) : {};
  if (deps.depsError) return { manifest: manifest2, dir: dest, source, ...deps };
  if ((0, import_node_fs11.existsSync)(dest)) (0, import_node_fs11.rmSync)(dest, { recursive: true, force: true });
  (0, import_node_fs11.mkdirSync)(root, { recursive: true });
  (0, import_node_fs11.cpSync)(src, dest, { recursive: true });
  return {
    manifest: manifest2,
    dir: dest,
    source,
    ...deps,
    ...pluginNpmDependencies(manifest2).length ? {} : await installNodeDeps(dest, opts)
  };
}

// packages/plugin/src/remote/registry.ts
var import_common5 = __toESM(require_dist2());

// packages/plugin/src/archive.ts
var import_node_zlib2 = require("node:zlib");
var import_node_fs12 = require("node:fs");
var import_node_path12 = require("node:path");
var import_tar3 = require("tar");

// packages/plugin/src/archive.constants.ts
var PLUGIN_ARCHIVE_MAX_BYTES = 64 * 1024 * 1024;
var PLUGIN_ARCHIVE_MAX_FILES = 1e4;

// packages/plugin/src/archive.ts
function extractPluginArchive(bytes, stage) {
  if (bytes.length > PLUGIN_ARCHIVE_MAX_BYTES) throw new Error("Plugin archive exceeds download limit");
  const decoded = (0, import_node_zlib2.gunzipSync)(bytes, { maxOutputLength: PLUGIN_ARCHIVE_MAX_BYTES });
  const archive = (0, import_node_path12.join)(stage, "bundle.tar");
  (0, import_node_fs12.writeFileSync)(archive, decoded);
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
  const output = (0, import_node_path12.join)(stage, "plugin");
  (0, import_node_fs12.mkdirSync)(output);
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
var import_node_crypto5 = require("node:crypto");
var RemoteRegistry = class {
  constructor(opts = {}) {
    const baseUrl = opts.baseUrl ?? (0, import_common5.OCTONODE_MARKETPLACE_URL)() ?? import_common5.DEFAULT_MARKETPLACE_URL;
    if (!baseUrl) {
      throw new Error("marketplace URL is not configured (set OCTONODE_MARKETPLACE_URL or pass baseUrl)");
    }
    if (/^https?:\/\/dash\.cloudflare\.com\//.test(baseUrl)) {
      throw new Error(
        "OCTONODE_MARKETPLACE_URL must point to the Worker API endpoint (e.g. https://<worker>.workers.dev), not the Cloudflare dashboard URL."
      );
    }
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.token = opts.token ?? (0, import_common5.OCTONODE_MARKETPLACE_TOKEN)();
  }
  async request(path, init = {}) {
    const headers = new Headers(init.headers);
    if (this.token) headers.set("authorization", `Bearer ${this.token}`);
    const res = await fetch(`${this.baseUrl}${path}`, {
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
  async detail(id, scope) {
    const query = scope ? `?scope=${encodeURIComponent(scope)}` : "";
    const res = await this.request(`/marketplace/plugins/${encodeURIComponent(id)}${query}`);
    return await res.json();
  }
  /** Reauthorize an immutable pin, including older locks that only recorded the extracted tree hash. */
  async matchesLockedRelease(id, pin) {
    const remoteId = pin.remoteId ?? id;
    const detail = await this.detail(remoteId, pin.scope);
    const release2 = detail.versions.find((entry) => entry.version === pin.version);
    if (!release2 || pin.publisher && release2.publishedBy !== pin.publisher) return false;
    const checksum = release2.archiveSha256 ?? release2.sha256;
    if (pin.archiveSha256 || checksum?.startsWith("sha256:")) return checksum === (pin.archiveSha256 ?? pin.sha256);
    if (!/^[a-f0-9]{64}$/.test(checksum)) return false;
    const directory = await this.downloadBundle(remoteId, pin.version, pin.scope, id, checksum);
    try {
      return hashPluginDir(directory) === pin.sha256;
    } finally {
      (0, import_node_fs13.rmSync)((0, import_node_path13.dirname)(directory), { recursive: true, force: true });
    }
  }
  async registerInstall(id, version, scope, opts) {
    const response = await this.request(`/marketplace/plugins/${encodeURIComponent(id)}/install`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ version, scope, ownerId: opts.ownerId, environment: opts.environment ?? "self_hosted" })
    });
    return (await response.json()).installId;
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
    const packageFile = (0, import_node_path13.join)(pluginDir, "package.json");
    if ((0, import_node_fs13.existsSync)(packageFile)) {
      const metadata = JSON.parse((0, import_node_fs13.readFileSync)(packageFile, "utf8"));
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
    const digest = (0, import_node_crypto5.createHash)("sha256").update(bundle).digest("hex");
    if (release2.sha256 !== digest || release2.archiveSha256 !== void 0 && release2.archiveSha256 !== digest)
      throw new Error("Marketplace published archive checksum mismatch; check the release before publishing again");
    return release2;
  }
  /** Download a version's bundle and extract it to a fresh temp folder. */
  async downloadBundle(id, version, scope, expectedId = id, expectedChecksum) {
    const query = scope ? `?scope=${encodeURIComponent(scope)}` : "";
    const res = await this.request(
      `/marketplace/plugins/${encodeURIComponent(id)}/versions/${encodeURIComponent(version)}/bundle${query}`
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
    const digest = (0, import_node_crypto5.createHash)("sha256").update(bytes).digest("hex");
    for (const expected of checksums)
      if (/^[a-f0-9]{64}$/.test(expected) && expected !== digest) throw new Error("Plugin registry checksum mismatch");
    const dir = (0, import_node_fs13.mkdtempSync)((0, import_node_path13.join)((0, import_node_os6.tmpdir)(), "octo-bundle-"));
    try {
      const extracted = extractPluginArchive(bytes, dir);
      const manifest2 = loadPluginManifest(extracted);
      if (manifest2.id !== expectedId || manifest2.version !== version)
        throw new Error(`Downloaded plugin does not match requested ${id}@${version}`);
      for (const expected of checksums)
        if (!/^[a-f0-9]{64}$/.test(expected) && hashPluginDir(extracted) !== expected)
          throw new Error("Plugin registry checksum mismatch");
      return extracted;
    } catch (error) {
      (0, import_node_fs13.rmSync)(dir, { recursive: true, force: true });
      throw error;
    }
  }
  /**
   * Install a plugin from the hosted marketplace: resolve the version, download
   * + extract the bundle, run the normal local installer, then record the
   * install (with its granted permissions) in the marketplace DB.
   */
  async install(id, opts = {}) {
    const detail = await this.detail(id, opts.scope);
    const version = opts.version ?? detail.version;
    const release2 = detail.versions?.find((entry) => entry.version === version);
    const dir = await this.downloadBundle(
      id,
      version,
      opts.scope,
      id,
      release2?.archiveSha256 ?? release2?.sha256
    );
    const plugin = await installPlugin(dir, opts);
    const res = await this.request(`/marketplace/plugins/${encodeURIComponent(id)}/install`, {
      method: "POST",
      headers: { "content-type": "application/json" },
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
  async installToStore(id, opts = {}) {
    const detail = await this.detail(id, opts.scope);
    const version = opts.version ?? detail.version;
    const versionMeta = detail.versions?.find((v) => v.version === version);
    const releaseChecksum = versionMeta?.archiveSha256 ?? versionMeta?.sha256;
    if (!opts.cacheOnly && !opts.noDeps && !releaseChecksum)
      throw new Error("Marketplace release is missing its immutable checksum");
    const availableScopes = versionMeta?.scope ?? detail.scope;
    const scope = opts.scope && availableScopes.includes(opts.scope) ? opts.scope : availableScopes[0];
    const dir = await this.downloadBundle(id, version, scope, id, releaseChecksum);
    const entry = (() => {
      try {
        return addToStore(dir, { storeRoot: opts.storeRoot });
      } finally {
        (0, import_node_fs13.rmSync)((0, import_node_path13.dirname)(dir), { recursive: true, force: true });
      }
    })();
    const archiveSha256 = releaseChecksum && /^[a-f0-9]{64}$/.test(releaseChecksum) ? releaseChecksum : void 0;
    const prepared = this.baseUrl === ((0, import_common5.OCTONODE_MARKETPLACE_URL)() ?? import_common5.DEFAULT_MARKETPLACE_URL).replace(/\/$/, "") && usesPreparedRunner(entry.dir);
    if (entry.manifest.library && opts.noDeps && !opts.cacheOnly)
      throw new Error(
        "Library installation requires native dependency activation; use frozen --artifacts-only for CI restore"
      );
    if (!opts.cacheOnly && !opts.noDeps) {
      const alias2 = opts.alias ?? entry.id;
      const pin2 = {
        pluginId: entry.id,
        remoteId: id,
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
        installId2 = await this.registerInstall(id, version, scope, { ...opts, environment: "cloud" });
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
          installId2 = await this.registerInstall(id, version, scope, opts);
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
    const alias = opts.alias ?? entry.id;
    const pin = {
      pluginId: entry.id,
      remoteId: id,
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
      installId = await this.registerInstall(id, version, scope, { ...opts, environment: "cloud" });
      if (!installId || !/^[a-f0-9-]{36}$/.test(installId))
        throw new Error("Marketplace did not authorize the prepared installation");
      pin.installId = installId;
    }
    try {
      await withDependencyInstall(opts.cwd ?? process.cwd(), async () => {
        const previous = readLockfile(opts.cwd).plugins[alias];
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
      installId = await this.registerInstall(id, version, scope, opts);
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
  async postEvent(installId, eventType, metadata) {
    await this.request(`/marketplace/installs/${encodeURIComponent(installId)}/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ eventType, metadata })
    });
  }
  async analytics(ownerId) {
    const query = ownerId ? `?owner_id=${encodeURIComponent(ownerId)}` : "";
    const res = await this.request(`/marketplace/analytics${query}`);
    return await res.json();
  }
};
function packPluginDir(pluginDir) {
  pluginBundleFiles(pluginDir);
  const staging = (0, import_node_fs13.mkdtempSync)((0, import_node_path13.join)((0, import_node_os6.tmpdir)(), "octo-pack-"));
  const out = (0, import_node_path13.join)(staging, "bundle.tar.gz");
  try {
    (0, import_tar4.create)({ file: out, cwd: pluginDir, sync: true, portable: true, gzip: true }, pluginBundleFiles(pluginDir));
    return (0, import_node_fs13.readFileSync)(out);
  } finally {
    (0, import_node_fs13.rmSync)(staging, { recursive: true, force: true });
  }
}

// packages/plugin/src/restore.ts
async function installFromLock(opts = {}) {
  const cwd = resolveDependencyProject(opts.cwd ?? process.cwd()).target;
  if (opts.frozen && opts.force) throw new Error("Frozen restore cannot accept changed artifact bytes");
  if (opts.frozen && !(0, import_node_fs14.existsSync)((0, import_node_path14.join)(cwd, "octonode.lock"))) throw new Error("Frozen restore requires octonode.lock");
  return withDependencyInstall(cwd, async () => {
    const lock = readLockfile(cwd);
    if (lock.generated && opts.force)
      throw new Error("Generated packages require explicit version updates, not --force repinning");
    const result = { restored: [], present: [], errors: [] };
    const libraries = [];
    const dependencies = [];
    for (const [alias, pin] of Object.entries(lock.plugins)) {
      try {
        const id = pin.pluginId ?? alias;
        const remoteId = pin.remoteId ?? id;
        const registry = opts.registry ?? pin.registry;
        if (opts.frozen && opts.registry && opts.registry !== pin.registry)
          throw new Error("Frozen restore cannot change the registry");
        if (pin.scope && pin.scope !== "public" && registry) {
          if (opts.offline) throw new Error("Private plugin access must be reauthorized online before restore");
          const remote = new RemoteRegistry({ baseUrl: registry, token: opts.token });
          if (!await remote.matchesLockedRelease(id, pin))
            throw new Error("Locked private release is not authorized or changed");
        }
        let directory = storeEntryDir(id, pin.version, pin.sha256, opts.storeRoot);
        if (isPluginDir(directory)) {
          if (hashPluginDir(directory) !== pin.sha256) throw new Error("Corrupt plugin cache: " + alias);
          result.present.push(alias);
        } else {
          if (opts.offline) throw new Error("Plugin " + alias + " is not in the offline cache");
          if (!registry) throw new Error(alias + " has no registry recorded; reinstall this local artifact");
          const downloaded = await new RemoteRegistry({ baseUrl: registry, token: opts.token }).downloadBundle(
            remoteId,
            pin.version,
            pin.scope,
            id,
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
            (0, import_node_fs14.rmSync)((0, import_node_path14.dirname)(downloaded), { recursive: true, force: true });
          }
          result.restored.push(alias);
        }
        const manifest2 = loadPluginManifest(directory);
        if (manifest2.id !== id || manifest2.version !== pin.version)
          throw new Error("Plugin identity mismatch: " + alias);
        if (manifest2.library) libraries.push({ alias, directory, sha256: pin.sha256 });
        if (!manifest2.library && preparedPluginPin(directory, pin)) continue;
        if (!manifest2.library && !pluginNpmDependencies(manifest2).length && !opts.artifactsOnly && !opts.noDeps) {
          const packagePath = (0, import_node_path14.join)(directory, "package.json");
          const legacy = (0, import_node_fs14.existsSync)(packagePath) ? JSON.parse((0, import_node_fs14.readFileSync)(packagePath, "utf8")) : {};
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
        dependencies.push(...pluginNpmDependencies(manifest2).map((npm) => ({ name: npm.package, spec: npm.spec })));
      } catch (error) {
        result.errors.push({ id: alias, message: error.message });
      }
    }
    if (result.errors.length) return result;
    try {
      if (libraries.length || lock.generated) {
        if (!lock.generated)
          throw new Error("Plugin lock has no generated package pin; install the library explicitly first");
        const generated = await generatePluginPackage(cwd, libraries, lock.generated.packer);
        if (generated.spec !== lock.generated.spec || generated.sha256 !== lock.generated.sha256 || JSON.stringify(generated.subpaths) !== JSON.stringify(lock.generated.subpaths))
          throw new Error("Generated package does not match octonode.lock");
        const manifest2 = JSON.parse((0, import_node_fs14.readFileSync)((0, import_node_path14.join)(cwd, "package.json"), "utf8"));
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
var import_schema6 = __toESM(require_dist());
async function runPluginLifecycle(command, target, flags) {
  const cwd = resolveDependencyProject(typeof flags.cwd === "string" ? (0, import_node_path15.resolve)(flags.cwd) : process.cwd()).target;
  const scope = typeof flags.scope === "string" ? flags.scope : void 0;
  if (scope && !import_schema6.MARKETPLACE_SCOPES.includes(scope)) throw new Error("Invalid marketplace scope");
  const options = {
    cwd,
    alias: typeof flags.alias === "string" ? flags.alias : void 0,
    migrate: !!flags.migrate,
    dryRun: !!flags["dry-run"]
  };
  if (command === "recover") {
    await recoverDependencyInstall(cwd);
    return { recovered: true };
  }
  if (command === "list") return readLockfile(cwd);
  if (command === "restore") {
    const result2 = await installFromLock({
      cwd,
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
  if (command === "install" && (0, import_node_fs15.existsSync)((0, import_node_path15.resolve)(cwd, target))) {
    const entry = await installLocalArtifact((0, import_node_path15.resolve)(cwd, target), options);
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

re2js/build/index.cjs:
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
