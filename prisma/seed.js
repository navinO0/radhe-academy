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

// node_modules/@noble/hashes/_u64.js
var require_u64 = __commonJS({
  "node_modules/@noble/hashes/_u64.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toBig = exports2.shrSL = exports2.shrSH = exports2.rotrSL = exports2.rotrSH = exports2.rotrBL = exports2.rotrBH = exports2.rotr32L = exports2.rotr32H = exports2.rotlSL = exports2.rotlSH = exports2.rotlBL = exports2.rotlBH = exports2.add5L = exports2.add5H = exports2.add4L = exports2.add4H = exports2.add3L = exports2.add3H = void 0;
    exports2.add = add;
    exports2.fromBig = fromBig;
    exports2.split = split;
    var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
    var _32n = /* @__PURE__ */ BigInt(32);
    function fromBig(n, le = false) {
      if (le)
        return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
      return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
    }
    function split(lst, le = false) {
      const len = lst.length;
      let Ah = new Uint32Array(len);
      let Al = new Uint32Array(len);
      for (let i = 0; i < len; i++) {
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
      }
      return [Ah, Al];
    }
    var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
    exports2.toBig = toBig;
    var shrSH = (h, _l, s) => h >>> s;
    exports2.shrSH = shrSH;
    var shrSL = (h, l, s) => h << 32 - s | l >>> s;
    exports2.shrSL = shrSL;
    var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
    exports2.rotrSH = rotrSH;
    var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
    exports2.rotrSL = rotrSL;
    var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
    exports2.rotrBH = rotrBH;
    var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
    exports2.rotrBL = rotrBL;
    var rotr32H = (_h, l) => l;
    exports2.rotr32H = rotr32H;
    var rotr32L = (h, _l) => h;
    exports2.rotr32L = rotr32L;
    var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
    exports2.rotlSH = rotlSH;
    var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
    exports2.rotlSL = rotlSL;
    var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
    exports2.rotlBH = rotlBH;
    var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
    exports2.rotlBL = rotlBL;
    function add(Ah, Al, Bh, Bl) {
      const l = (Al >>> 0) + (Bl >>> 0);
      return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
    }
    var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
    exports2.add3L = add3L;
    var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
    exports2.add3H = add3H;
    var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
    exports2.add4L = add4L;
    var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
    exports2.add4H = add4H;
    var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
    exports2.add5L = add5L;
    var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
    exports2.add5H = add5H;
    var u64 = {
      fromBig,
      split,
      toBig,
      shrSH,
      shrSL,
      rotrSH,
      rotrSL,
      rotrBH,
      rotrBL,
      rotr32H,
      rotr32L,
      rotlSH,
      rotlSL,
      rotlBH,
      rotlBL,
      add,
      add3L,
      add3H,
      add4L,
      add4H,
      add5H,
      add5L
    };
    exports2.default = u64;
  }
});

// node_modules/@noble/hashes/cryptoNode.js
var require_cryptoNode = __commonJS({
  "node_modules/@noble/hashes/cryptoNode.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.crypto = void 0;
    var nc = require("node:crypto");
    exports2.crypto = nc && typeof nc === "object" && "webcrypto" in nc ? nc.webcrypto : nc && typeof nc === "object" && "randomBytes" in nc ? nc : void 0;
  }
});

// node_modules/@noble/hashes/utils.js
var require_utils = __commonJS({
  "node_modules/@noble/hashes/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.wrapXOFConstructorWithOpts = exports2.wrapConstructorWithOpts = exports2.wrapConstructor = exports2.Hash = exports2.nextTick = exports2.swap32IfBE = exports2.byteSwapIfBE = exports2.swap8IfBE = exports2.isLE = void 0;
    exports2.isBytes = isBytes;
    exports2.anumber = anumber;
    exports2.abytes = abytes;
    exports2.ahash = ahash;
    exports2.aexists = aexists;
    exports2.aoutput = aoutput;
    exports2.u8 = u8;
    exports2.u32 = u32;
    exports2.clean = clean;
    exports2.createView = createView;
    exports2.rotr = rotr;
    exports2.rotl = rotl;
    exports2.byteSwap = byteSwap;
    exports2.byteSwap32 = byteSwap32;
    exports2.bytesToHex = bytesToHex;
    exports2.hexToBytes = hexToBytes;
    exports2.asyncLoop = asyncLoop;
    exports2.utf8ToBytes = utf8ToBytes;
    exports2.bytesToUtf8 = bytesToUtf8;
    exports2.toBytes = toBytes;
    exports2.kdfInputToBytes = kdfInputToBytes;
    exports2.concatBytes = concatBytes;
    exports2.checkOpts = checkOpts;
    exports2.createHasher = createHasher;
    exports2.createOptHasher = createOptHasher;
    exports2.createXOFer = createXOFer;
    exports2.randomBytes = randomBytes2;
    var crypto_1 = require_cryptoNode();
    function isBytes(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    function anumber(n) {
      if (!Number.isSafeInteger(n) || n < 0)
        throw new Error("positive integer expected, got " + n);
    }
    function abytes(b, ...lengths) {
      if (!isBytes(b))
        throw new Error("Uint8Array expected");
      if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
    }
    function ahash(h) {
      if (typeof h !== "function" || typeof h.create !== "function")
        throw new Error("Hash should be wrapped by utils.createHasher");
      anumber(h.outputLen);
      anumber(h.blockLen);
    }
    function aexists(instance, checkFinished = true) {
      if (instance.destroyed)
        throw new Error("Hash instance has been destroyed");
      if (checkFinished && instance.finished)
        throw new Error("Hash#digest() has already been called");
    }
    function aoutput(out, instance) {
      abytes(out);
      const min = instance.outputLen;
      if (out.length < min) {
        throw new Error("digestInto() expects output buffer of length at least " + min);
      }
    }
    function u8(arr) {
      return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    function u32(arr) {
      return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    }
    function clean(...arrays) {
      for (let i = 0; i < arrays.length; i++) {
        arrays[i].fill(0);
      }
    }
    function createView(arr) {
      return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    function rotr(word, shift) {
      return word << 32 - shift | word >>> shift;
    }
    function rotl(word, shift) {
      return word << shift | word >>> 32 - shift >>> 0;
    }
    exports2.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    function byteSwap(word) {
      return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
    }
    exports2.swap8IfBE = exports2.isLE ? (n) => n : (n) => byteSwap(n);
    exports2.byteSwapIfBE = exports2.swap8IfBE;
    function byteSwap32(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = byteSwap(arr[i]);
      }
      return arr;
    }
    exports2.swap32IfBE = exports2.isLE ? (u) => u : byteSwap32;
    var hasHexBuiltin = /* @__PURE__ */ (() => (
      // @ts-ignore
      typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
    ))();
    var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex(bytes) {
      abytes(bytes);
      if (hasHexBuiltin)
        return bytes.toHex();
      let hex = "";
      for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
      }
      return hex;
    }
    var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    function asciiToBase16(ch) {
      if (ch >= asciis._0 && ch <= asciis._9)
        return ch - asciis._0;
      if (ch >= asciis.A && ch <= asciis.F)
        return ch - (asciis.A - 10);
      if (ch >= asciis.a && ch <= asciis.f)
        return ch - (asciis.a - 10);
      return;
    }
    function hexToBytes(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      if (hasHexBuiltin)
        return Uint8Array.fromHex(hex);
      const hl = hex.length;
      const al = hl / 2;
      if (hl % 2)
        throw new Error("hex string expected, got unpadded hex of length " + hl);
      const array = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex[hi] + hex[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
      }
      return array;
    }
    var nextTick = async () => {
    };
    exports2.nextTick = nextTick;
    async function asyncLoop(iters, tick, cb) {
      let ts = Date.now();
      for (let i = 0; i < iters; i++) {
        cb(i);
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick)
          continue;
        await (0, exports2.nextTick)();
        ts += diff;
      }
    }
    function utf8ToBytes(str) {
      if (typeof str !== "string")
        throw new Error("string expected");
      return new Uint8Array(new TextEncoder().encode(str));
    }
    function bytesToUtf8(bytes) {
      return new TextDecoder().decode(bytes);
    }
    function toBytes(data) {
      if (typeof data === "string")
        data = utf8ToBytes(data);
      abytes(data);
      return data;
    }
    function kdfInputToBytes(data) {
      if (typeof data === "string")
        data = utf8ToBytes(data);
      abytes(data);
      return data;
    }
    function concatBytes(...arrays) {
      let sum = 0;
      for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        abytes(a);
        sum += a.length;
      }
      const res = new Uint8Array(sum);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
      }
      return res;
    }
    function checkOpts(defaults, opts) {
      if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
        throw new Error("options should be object or undefined");
      const merged = Object.assign(defaults, opts);
      return merged;
    }
    var Hash = class {
    };
    exports2.Hash = Hash;
    function createHasher(hashCons) {
      const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
      const tmp = hashCons();
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = () => hashCons();
      return hashC;
    }
    function createOptHasher(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    function createXOFer(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    exports2.wrapConstructor = createHasher;
    exports2.wrapConstructorWithOpts = createOptHasher;
    exports2.wrapXOFConstructorWithOpts = createXOFer;
    function randomBytes2(bytesLength = 32) {
      if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
        return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
      }
      if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
        return Uint8Array.from(crypto_1.crypto.randomBytes(bytesLength));
      }
      throw new Error("crypto.getRandomValues must be defined");
    }
  }
});

// node_modules/@noble/hashes/sha3.js
var require_sha3 = __commonJS({
  "node_modules/@noble/hashes/sha3.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.shake256 = exports2.shake128 = exports2.keccak_512 = exports2.keccak_384 = exports2.keccak_256 = exports2.keccak_224 = exports2.sha3_512 = exports2.sha3_384 = exports2.sha3_256 = exports2.sha3_224 = exports2.Keccak = void 0;
    exports2.keccakP = keccakP;
    var _u64_ts_1 = require_u64();
    var utils_ts_1 = require_utils();
    var _0n = BigInt(0);
    var _1n = BigInt(1);
    var _2n = BigInt(2);
    var _7n = BigInt(7);
    var _256n = BigInt(256);
    var _0x71n = BigInt(113);
    var SHA3_PI = [];
    var SHA3_ROTL = [];
    var _SHA3_IOTA = [];
    for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
      [x, y] = [y, (2 * x + 3 * y) % 5];
      SHA3_PI.push(2 * (5 * y + x));
      SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
      let t = _0n;
      for (let j = 0; j < 7; j++) {
        R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
        if (R & _2n)
          t ^= _1n << (_1n << /* @__PURE__ */ BigInt(j)) - _1n;
      }
      _SHA3_IOTA.push(t);
    }
    var IOTAS = (0, _u64_ts_1.split)(_SHA3_IOTA, true);
    var SHA3_IOTA_H = IOTAS[0];
    var SHA3_IOTA_L = IOTAS[1];
    var rotlH = (h, l, s) => s > 32 ? (0, _u64_ts_1.rotlBH)(h, l, s) : (0, _u64_ts_1.rotlSH)(h, l, s);
    var rotlL = (h, l, s) => s > 32 ? (0, _u64_ts_1.rotlBL)(h, l, s) : (0, _u64_ts_1.rotlSL)(h, l, s);
    function keccakP(s, rounds = 24) {
      const B = new Uint32Array(5 * 2);
      for (let round = 24 - rounds; round < 24; round++) {
        for (let x = 0; x < 10; x++)
          B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
        for (let x = 0; x < 10; x += 2) {
          const idx1 = (x + 8) % 10;
          const idx0 = (x + 2) % 10;
          const B0 = B[idx0];
          const B1 = B[idx0 + 1];
          const Th = rotlH(B0, B1, 1) ^ B[idx1];
          const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
          for (let y = 0; y < 50; y += 10) {
            s[x + y] ^= Th;
            s[x + y + 1] ^= Tl;
          }
        }
        let curH = s[2];
        let curL = s[3];
        for (let t = 0; t < 24; t++) {
          const shift = SHA3_ROTL[t];
          const Th = rotlH(curH, curL, shift);
          const Tl = rotlL(curH, curL, shift);
          const PI = SHA3_PI[t];
          curH = s[PI];
          curL = s[PI + 1];
          s[PI] = Th;
          s[PI + 1] = Tl;
        }
        for (let y = 0; y < 50; y += 10) {
          for (let x = 0; x < 10; x++)
            B[x] = s[y + x];
          for (let x = 0; x < 10; x++)
            s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
        }
        s[0] ^= SHA3_IOTA_H[round];
        s[1] ^= SHA3_IOTA_L[round];
      }
      (0, utils_ts_1.clean)(B);
    }
    var Keccak = class _Keccak extends utils_ts_1.Hash {
      // NOTE: we accept arguments in bytes instead of bits here.
      constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
        super();
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        this.enableXOF = false;
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        (0, utils_ts_1.anumber)(outputLen);
        if (!(0 < blockLen && blockLen < 200))
          throw new Error("only keccak-f1600 function is supported");
        this.state = new Uint8Array(200);
        this.state32 = (0, utils_ts_1.u32)(this.state);
      }
      clone() {
        return this._cloneInto();
      }
      keccak() {
        (0, utils_ts_1.swap32IfBE)(this.state32);
        keccakP(this.state32, this.rounds);
        (0, utils_ts_1.swap32IfBE)(this.state32);
        this.posOut = 0;
        this.pos = 0;
      }
      update(data) {
        (0, utils_ts_1.aexists)(this);
        data = (0, utils_ts_1.toBytes)(data);
        (0, utils_ts_1.abytes)(data);
        const { blockLen, state } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          for (let i = 0; i < take; i++)
            state[this.pos++] ^= data[pos++];
          if (this.pos === blockLen)
            this.keccak();
        }
        return this;
      }
      finish() {
        if (this.finished)
          return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        state[pos] ^= suffix;
        if ((suffix & 128) !== 0 && pos === blockLen - 1)
          this.keccak();
        state[blockLen - 1] ^= 128;
        this.keccak();
      }
      writeInto(out) {
        (0, utils_ts_1.aexists)(this, false);
        (0, utils_ts_1.abytes)(out);
        this.finish();
        const bufferOut = this.state;
        const { blockLen } = this;
        for (let pos = 0, len = out.length; pos < len; ) {
          if (this.posOut >= blockLen)
            this.keccak();
          const take = Math.min(blockLen - this.posOut, len - pos);
          out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
          this.posOut += take;
          pos += take;
        }
        return out;
      }
      xofInto(out) {
        if (!this.enableXOF)
          throw new Error("XOF is not possible for this instance");
        return this.writeInto(out);
      }
      xof(bytes) {
        (0, utils_ts_1.anumber)(bytes);
        return this.xofInto(new Uint8Array(bytes));
      }
      digestInto(out) {
        (0, utils_ts_1.aoutput)(out, this);
        if (this.finished)
          throw new Error("digest() was already called");
        this.writeInto(out);
        this.destroy();
        return out;
      }
      digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
      }
      destroy() {
        this.destroyed = true;
        (0, utils_ts_1.clean)(this.state);
      }
      _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
      }
    };
    exports2.Keccak = Keccak;
    var gen = (suffix, blockLen, outputLen) => (0, utils_ts_1.createHasher)(() => new Keccak(blockLen, suffix, outputLen));
    exports2.sha3_224 = (() => gen(6, 144, 224 / 8))();
    exports2.sha3_256 = (() => gen(6, 136, 256 / 8))();
    exports2.sha3_384 = (() => gen(6, 104, 384 / 8))();
    exports2.sha3_512 = (() => gen(6, 72, 512 / 8))();
    exports2.keccak_224 = (() => gen(1, 144, 224 / 8))();
    exports2.keccak_256 = (() => gen(1, 136, 256 / 8))();
    exports2.keccak_384 = (() => gen(1, 104, 384 / 8))();
    exports2.keccak_512 = (() => gen(1, 72, 512 / 8))();
    var genShake = (suffix, blockLen, outputLen) => (0, utils_ts_1.createXOFer)((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === void 0 ? outputLen : opts.dkLen, true));
    exports2.shake128 = (() => genShake(31, 168, 128 / 8))();
    exports2.shake256 = (() => genShake(31, 136, 256 / 8))();
  }
});

// node_modules/@paralleldrive/cuid2/src/index.js
var require_src = __commonJS({
  "node_modules/@paralleldrive/cuid2/src/index.js"(exports2, module2) {
    var { sha3_512: sha3 } = require_sha3();
    var defaultLength = 24;
    var bigLength = 32;
    var createEntropy = (length = 4, random = Math.random) => {
      let entropy = "";
      while (entropy.length < length) {
        entropy = entropy + Math.floor(random() * 36).toString(36);
      }
      return entropy;
    };
    function bufToBigInt(buf) {
      let bits = 8n;
      let value = 0n;
      for (const i of buf.values()) {
        const bi = BigInt(i);
        value = (value << bits) + bi;
      }
      return value;
    }
    var hash = (input = "") => {
      return bufToBigInt(sha3(input)).toString(36).slice(1);
    };
    var alphabet = Array.from(
      { length: 26 },
      (x, i) => String.fromCharCode(i + 97)
    );
    var randomLetter = (random) => alphabet[Math.floor(random() * alphabet.length)];
    var createFingerprint = ({
      globalObj = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : {},
      random = Math.random
    } = {}) => {
      const globals = Object.keys(globalObj).toString();
      const sourceString = globals.length ? globals + createEntropy(bigLength, random) : createEntropy(bigLength, random);
      return hash(sourceString).substring(0, bigLength);
    };
    var createCounter = (count) => () => {
      return count++;
    };
    var initialCountMax = 476782367;
    var init = ({
      // Fallback if the user does not pass in a CSPRNG. This should be OK
      // because we don't rely solely on the random number generator for entropy.
      // We also use the host fingerprint, current time, and a session counter.
      random = Math.random,
      counter = createCounter(Math.floor(random() * initialCountMax)),
      length = defaultLength,
      fingerprint = createFingerprint({ random })
    } = {}) => {
      return function cuid2() {
        const firstLetter = randomLetter(random);
        const time = Date.now().toString(36);
        const count = counter().toString(36);
        const salt = createEntropy(length, random);
        const hashInput = `${time + salt + count + fingerprint}`;
        return `${firstLetter + hash(hashInput).substring(1, length)}`;
      };
    };
    var createId2 = init();
    var isCuid = (id, { minLength = 2, maxLength = bigLength } = {}) => {
      const length = id.length;
      const regex = /^[0-9a-z]+$/;
      try {
        if (typeof id === "string" && length >= minLength && length <= maxLength && regex.test(id))
          return true;
      } finally {
      }
      return false;
    };
    module2.exports.getConstants = () => ({ defaultLength, bigLength });
    module2.exports.init = init;
    module2.exports.createId = createId2;
    module2.exports.bufToBigInt = bufToBigInt;
    module2.exports.createCounter = createCounter;
    module2.exports.createFingerprint = createFingerprint;
    module2.exports.isCuid = isCuid;
  }
});

// node_modules/@paralleldrive/cuid2/index.js
var require_cuid2 = __commonJS({
  "node_modules/@paralleldrive/cuid2/index.js"(exports2, module2) {
    var { createId: createId2, init, getConstants, isCuid } = require_src();
    module2.exports.createId = createId2;
    module2.exports.init = init;
    module2.exports.getConstants = getConstants;
    module2.exports.isCuid = isCuid;
  }
});

// prisma/seed.ts
var seed_exports = {};
__export(seed_exports, {
  OFFICIAL_COURSES: () => OFFICIAL_COURSES
});
module.exports = __toCommonJS(seed_exports);

// src/lib/db/prisma.ts
var import_client = require("@prisma/client");
var globalForPrisma = globalThis;
var prisma = globalForPrisma.prisma ?? new import_client.PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});
globalForPrisma.prisma = prisma;

// src/lib/auth/permissions.ts
var PERMISSIONS = {
  // Academy module
  ACADEMY_VIEW: "academy.view",
  // Students
  STUDENTS_VIEW: "academy.students.view",
  STUDENTS_CREATE: "academy.students.create",
  STUDENTS_UPDATE: "academy.students.update",
  STUDENTS_ARCHIVE: "academy.students.archive",
  // Courses
  COURSES_VIEW: "academy.courses.view",
  COURSES_MANAGE: "academy.courses.manage",
  // Batches
  BATCHES_VIEW: "academy.batches.view",
  BATCHES_MANAGE: "academy.batches.manage",
  // Fees
  FEES_VIEW: "academy.fees.view",
  FEES_MANAGE: "academy.fees.manage",
  // Payments
  PAYMENTS_VIEW: "academy.payments.view",
  PAYMENTS_CREATE: "academy.payments.create",
  PAYMENTS_CANCEL: "academy.payments.cancel",
  PAYMENTS_REFUND: "academy.payments.refund",
  // Receipts
  RECEIPTS_VIEW: "academy.receipts.view",
  RECEIPTS_GENERATE: "academy.receipts.generate",
  // Attendance
  ATTENDANCE_VIEW: "academy.attendance.view",
  ATTENDANCE_MARK: "academy.attendance.mark",
  ATTENDANCE_EDIT: "academy.attendance.edit",
  // Reports
  REPORTS_VIEW: "academy.reports.view",
  REPORTS_EXPORT: "academy.reports.export",
  // Administration
  USERS_MANAGE: "admin.users.manage",
  ROLES_MANAGE: "admin.roles.manage",
  AUDIT_VIEW: "admin.audit.view"
};
var ROLE_PERMISSIONS = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  ADMIN: [
    PERMISSIONS.ACADEMY_VIEW,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.STUDENTS_CREATE,
    PERMISSIONS.STUDENTS_UPDATE,
    PERMISSIONS.STUDENTS_ARCHIVE,
    PERMISSIONS.COURSES_VIEW,
    PERMISSIONS.COURSES_MANAGE,
    PERMISSIONS.BATCHES_VIEW,
    PERMISSIONS.BATCHES_MANAGE,
    PERMISSIONS.FEES_VIEW,
    PERMISSIONS.FEES_MANAGE,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYMENTS_CREATE,
    PERMISSIONS.PAYMENTS_CANCEL,
    PERMISSIONS.PAYMENTS_REFUND,
    PERMISSIONS.RECEIPTS_VIEW,
    PERMISSIONS.RECEIPTS_GENERATE,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.ATTENDANCE_EDIT,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.AUDIT_VIEW
  ],
  STAFF: [
    PERMISSIONS.ACADEMY_VIEW,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.STUDENTS_CREATE,
    PERMISSIONS.STUDENTS_UPDATE,
    PERMISSIONS.COURSES_VIEW,
    PERMISSIONS.BATCHES_VIEW,
    PERMISSIONS.RECEIPTS_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK
  ],
  ACCOUNTANT: [
    PERMISSIONS.ACADEMY_VIEW,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.COURSES_VIEW,
    PERMISSIONS.BATCHES_VIEW,
    PERMISSIONS.FEES_VIEW,
    PERMISSIONS.FEES_MANAGE,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYMENTS_CREATE,
    PERMISSIONS.PAYMENTS_CANCEL,
    PERMISSIONS.PAYMENTS_REFUND,
    PERMISSIONS.RECEIPTS_VIEW,
    PERMISSIONS.RECEIPTS_GENERATE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT
  ],
  INSTRUCTOR: [
    PERMISSIONS.ACADEMY_VIEW,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.COURSES_VIEW,
    PERMISSIONS.BATCHES_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.ATTENDANCE_EDIT
  ]
};

// prisma/seed.ts
var import_cuid2 = __toESM(require_cuid2());

// node_modules/@better-auth/utils/dist/password.node.mjs
var import_node_crypto = require("node:crypto");
var config = {
  N: 16384,
  r: 16,
  p: 1,
  dkLen: 64
};
function generateKey(password, salt) {
  return new Promise((resolve, reject) => {
    (0, import_node_crypto.scrypt)(
      password.normalize("NFKC"),
      salt,
      config.dkLen,
      {
        N: config.N,
        r: config.r,
        p: config.p,
        maxmem: 128 * config.N * config.r * 2
      },
      (err, key) => {
        if (err)
          reject(err);
        else
          resolve(key);
      }
    );
  });
}
async function hashPassword(password) {
  const salt = (0, import_node_crypto.randomBytes)(16).toString("hex");
  const key = await generateKey(password, salt);
  return `${salt}:${key.toString("hex")}`;
}

// node_modules/better-auth/dist/crypto/password.mjs
var hashPassword$1 = hashPassword;

// prisma/seed.ts
var OFFICIAL_COURSES = [
  // Fashion Designing Courses
  {
    name: "Basic Fashion Designing",
    description: "1-Month foundational fashion design course covering core concepts, garment aesthetics, and design principles. Regular Fee: \u20B930,000 (Founder's Batch 40% OFF: \u20B918,000). Admission fee \u20B92,000 extra. Includes: Expert Trainers, Hands-on Practical Training, Certificate on Completion, Portfolio Development, Lifetime Support, Business & Career Guidance.",
    duration: "1 Month",
    defaultFee: "30000"
  },
  {
    name: "Fashion Designing",
    description: "Comprehensive 3-Month fashion designing program with practical training, portfolio development, and design techniques. Regular Fee: \u20B990,000 (Founder's Batch 40% OFF: \u20B954,000). Admission fee \u20B92,000 extra. Includes: Expert Trainers, Hands-on Practical Training, Certificate on Completion, Portfolio Development, Lifetime Support, Business & Career Guidance.",
    duration: "3 Months",
    defaultFee: "90000"
  },
  {
    name: "Advanced Fashion Designing",
    description: "6-Month in-depth fashion designing program with advanced styling, pattern making, textile studies, and professional portfolio. Regular Fee: \u20B91,80,000 (Founder's Batch 40% OFF: \u20B91,08,000). Admission fee \u20B92,000 extra. Includes: Expert Trainers, Hands-on Practical Training, Certificate on Completion, Portfolio Development, Lifetime Support, Business & Career Guidance.",
    duration: "6 Months",
    defaultFee: "180000"
  },
  {
    name: "Professional Fashion Designing (Complete Course)",
    description: "Full 1-Year master professional fashion designing course covering end-to-end couture, fashion illustration, garment construction, boutique business management, and portfolio. Regular Fee: \u20B93,00,000 (Founder's Batch 40% OFF: \u20B91,80,000). Admission fee \u20B92,000 extra. Includes: Expert Trainers, Hands-on Practical Training, Certificate on Completion, Portfolio Development, Lifetime Support, Business & Career Guidance.",
    duration: "1 Year",
    defaultFee: "300000"
  },
  // Boutique & Stitching Courses
  {
    name: "Personalized Learning",
    description: "1-Month tailored one-on-one boutique learning module customized to student pace and learning goals. Regular Fee: \u20B925,000 (Founder's Batch 40% OFF: \u20B915,000). Admission fee \u20B92,000 extra. Includes: Expert Trainers, Practical Training, Certificate on Completion, Lifetime Support, Career & Business Guidance.",
    duration: "1 Month",
    defaultFee: "25000"
  },
  {
    name: "Foundation Stitching",
    description: "2-Month foundational stitching course focusing on machine handling, basic cuts, measurements, and finishing techniques. Regular Fee: \u20B950,000 (Founder's Batch 40% OFF: \u20B930,000). Admission fee \u20B92,000 extra. Includes: Expert Trainers, Practical Training, Certificate on Completion, Lifetime Support, Career & Business Guidance.",
    duration: "2 Months",
    defaultFee: "50000"
  },
  {
    name: "Professional Stitching",
    description: "3-Month professional stitching course covering blouses, kurtis, western dresses, and precision tailoring. Regular Fee: \u20B975,000 (Founder's Batch 40% OFF: \u20B945,000). Admission fee \u20B92,000 extra. Includes: Expert Trainers, Practical Training, Certificate on Completion, Lifetime Support, Career & Business Guidance.",
    duration: "3 Months",
    defaultFee: "75000"
  },
  {
    name: "Advanced Boutique",
    description: "4-Month advanced boutique course covering designer cuts, bridal tailoring, pattern making, and boutique client management. Regular Fee: \u20B91,00,000 (Founder's Batch 40% OFF: \u20B960,000). Admission fee \u20B92,000 extra. Includes: Expert Trainers, Practical Training, Certificate on Completion, Lifetime Support, Career & Business Guidance.",
    duration: "4 Months",
    defaultFee: "100000"
  },
  {
    name: "Designer Course",
    description: "5-Month boutique designer course featuring high-end bridal couture, indo-western concepts, drafting, and custom embellishments. Regular Fee: \u20B91,25,000 (Founder's Batch 40% OFF: \u20B975,000). Admission fee \u20B92,000 extra. Includes: Expert Trainers, Practical Training, Certificate on Completion, Lifetime Support, Career & Business Guidance.",
    duration: "5 Months",
    defaultFee: "125000"
  },
  {
    name: "Master Boutique Course",
    description: "Comprehensive 6-Month boutique entrepreneurship course: master stitching, boutique setup, fabric sourcing, pricing, and business scaling. Regular Fee: \u20B91,50,000 (Founder's Batch 40% OFF: \u20B990,000). Admission fee \u20B92,000 extra. Includes: Expert Trainers, Practical Training, Certificate on Completion, Lifetime Support, Career & Business Guidance.",
    duration: "6 Months",
    defaultFee: "150000"
  },
  {
    name: "Machine Embroidery & Maggam Essentials",
    description: "1-Month specialized intensive training in machine embroidery, zardosi, aari/maggam work, and bridal motifs. Regular Fee: \u20B920,000 (Founder's Batch 40% OFF: \u20B912,000). Admission fee \u20B92,000 extra. Includes: Expert Trainers, Practical Training, Certificate on Completion, Lifetime Support, Career & Business Guidance.",
    duration: "1 Month",
    defaultFee: "20000"
  }
];
async function syncCourses(organizationId) {
  console.log(`\u{1F4DA} Syncing ${OFFICIAL_COURSES.length} official courses for organization ${organizationId}...`);
  for (const course of OFFICIAL_COURSES) {
    const existing = await prisma.course.findFirst({
      where: { organizationId, name: course.name }
    });
    if (!existing) {
      await prisma.course.create({
        data: {
          id: (0, import_cuid2.createId)(),
          publicId: (0, import_cuid2.createId)(),
          organizationId,
          name: course.name,
          description: course.description,
          duration: course.duration,
          defaultFee: course.defaultFee,
          status: "ACTIVE"
        }
      });
      console.log(`  \u2795 Created: ${course.name} (${course.duration} \u2022 \u20B9${course.defaultFee})`);
    } else {
      await prisma.course.update({
        where: { id: existing.id },
        data: {
          description: course.description,
          duration: course.duration,
          defaultFee: course.defaultFee,
          status: "ACTIVE"
        }
      });
      console.log(`  \u{1F504} Updated: ${course.name} (${course.duration} \u2022 \u20B9${course.defaultFee})`);
    }
  }
}
async function main() {
  console.log("\u{1F331} Checking database seed status...");
  const targetOrgName = process.env.ORGANIZATION_NAME ?? "Radhe Vastraz Academy";
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@radhevastraz.in";
  const forceSeed = process.env.FORCE_SEED === "true" || process.env.SEED_FORCE === "true";
  if (!forceSeed) {
    try {
      const existingOrg2 = await prisma.organization.findFirst({
        where: {
          OR: [
            { slug: "raadhe-label-academy" },
            { slug: "radhe-vastraz-academy" },
            { name: "Raadhe Label Academy" },
            { name: targetOrgName }
          ]
        }
      });
      const userCount = await prisma.user.count();
      if (existingOrg2 && userCount > 0) {
        console.log(
          `\u2139\uFE0F Database is already initialized (Organization: "${existingOrg2.name}", Users: ${userCount}).`
        );
        if (existingOrg2.name !== targetOrgName) {
          await prisma.organization.update({
            where: { id: existingOrg2.id },
            data: { name: targetOrgName }
          });
          console.log(`\u{1F504} Updated organization name from "${existingOrg2.name}" to "${targetOrgName}"`);
        }
        await syncCourses(existingOrg2.id);
        console.log("\u2705 Courses and Organization sync completed.");
        return;
      }
    } catch (err) {
      console.warn("\u26A0\uFE0F Could not verify existing seed status, proceeding with full seed:", err);
    }
  } else {
    console.log("\u26A1 FORCE_SEED=true detected. Proceeding with full seed execution...");
  }
  console.log("\u{1F331} Executing complete database seed...");
  const existingOrg = await prisma.organization.findFirst({
    where: {
      OR: [
        { slug: "raadhe-label-academy" },
        { slug: "radhe-vastraz-academy" }
      ]
    }
  });
  const org = existingOrg ? await prisma.organization.update({
    where: { id: existingOrg.id },
    data: { name: targetOrgName }
  }) : await prisma.organization.create({
    data: {
      id: (0, import_cuid2.createId)(),
      publicId: (0, import_cuid2.createId)(),
      name: targetOrgName,
      slug: "radhe-vastraz-academy",
      timezone: "Asia/Kolkata",
      currency: "INR",
      isActive: true
    }
  });
  console.log(`\u2705 Organization: ${org.name} (${org.id})`);
  const permissionDefs = Object.values(PERMISSIONS).map((name) => {
    const [module2] = name.split(".");
    return {
      id: (0, import_cuid2.createId)(),
      name,
      description: name,
      module: module2 ?? "system"
    };
  });
  for (const perm of permissionDefs) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm
    });
  }
  console.log(`\u2705 Permissions: ${permissionDefs.length} created/updated`);
  const roleDefs = [
    { name: "SUPER_ADMIN", description: "Full system access", isSystem: true },
    { name: "ADMIN", description: "Academy management", isSystem: true },
    { name: "STAFF", description: "Student and payment operations", isSystem: true },
    { name: "ACCOUNTANT", description: "Financial operations", isSystem: true },
    { name: "INSTRUCTOR", description: "Batch and attendance operations", isSystem: true }
  ];
  const roles = {};
  for (const roleDef of roleDefs) {
    const role = await prisma.role.upsert({
      where: { name: roleDef.name },
      update: {},
      create: {
        id: (0, import_cuid2.createId)(),
        name: roleDef.name,
        description: roleDef.description,
        isSystem: roleDef.isSystem
      }
    });
    roles[roleDef.name] = role.id;
  }
  console.log(`\u2705 Roles: ${roleDefs.length} created/updated`);
  for (const [roleName, permissions] of Object.entries(ROLE_PERMISSIONS)) {
    const roleId = roles[roleName];
    if (!roleId) continue;
    await prisma.rolePermission.deleteMany({ where: { roleId } });
    for (const permName of permissions) {
      const perm = await prisma.permission.findUnique({ where: { name: permName } });
      if (!perm) continue;
      await prisma.rolePermission.create({
        data: {
          id: (0, import_cuid2.createId)(),
          roleId,
          permissionId: perm.id
        }
      });
    }
  }
  console.log("\u2705 Role permissions assigned and synced");
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123456";
  const hashedPassword = await hashPassword$1(adminPassword);
  let adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminUser) {
    const adminId = (0, import_cuid2.createId)();
    adminUser = await prisma.user.create({
      data: {
        id: adminId,
        name: "Super Admin",
        email: adminEmail,
        emailVerified: true,
        status: "ACTIVE",
        accounts: {
          create: {
            id: (0, import_cuid2.createId)(),
            accountId: adminId,
            providerId: "credential",
            password: hashedPassword
          }
        }
      }
    });
  }
  console.log(`\u2705 Admin user: ${adminUser.email}`);
  await prisma.userOrganization.upsert({
    where: {
      userId_organizationId: {
        userId: adminUser.id,
        organizationId: org.id
      }
    },
    update: {},
    create: {
      id: (0, import_cuid2.createId)(),
      userId: adminUser.id,
      organizationId: org.id
    }
  });
  const superAdminRoleId = roles["SUPER_ADMIN"];
  if (superAdminRoleId) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId_organizationId: {
          userId: adminUser.id,
          roleId: superAdminRoleId,
          organizationId: org.id
        }
      },
      update: {},
      create: {
        id: (0, import_cuid2.createId)(),
        userId: adminUser.id,
        roleId: superAdminRoleId,
        organizationId: org.id
      }
    });
  }
  console.log("\u2705 Super admin role assigned");
  await syncCourses(org.id);
  console.log("\n\u{1F389} Seed completed successfully!");
  console.log(`
\u{1F4E7} Admin login: ${adminEmail}`);
  console.log(`\u{1F511} Admin password: ${adminPassword}`);
}
main().catch((e) => {
  console.error("\u274C Seed failed:", e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OFFICIAL_COURSES
});
/*! Bundled license information:

@noble/hashes/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
