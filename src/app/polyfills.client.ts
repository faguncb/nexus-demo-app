"use client";

import { Buffer } from "buffer";

// Make Buffer available globally for browser runtime and overwrite any partial shims
if (typeof globalThis !== "undefined") {
  (globalThis as any).Buffer = Buffer;
}

// Fallback: some libraries may operate on plain Uint8Array instead of Buffer
// Add minimal BE methods if missing to avoid runtime errors
const u8p: any = (typeof Uint8Array !== "undefined" ? Uint8Array.prototype : null);
if (u8p && typeof u8p.writeUint32BE !== "function") {
  u8p.writeUint32BE = function(value: number, offset = 0) {
    value = value >>> 0;
    this[offset] = (value >>> 24) & 0xff;
    this[offset + 1] = (value >>> 16) & 0xff;
    this[offset + 2] = (value >>> 8) & 0xff;
    this[offset + 3] = value & 0xff;
    return offset + 4;
  };
}

if (u8p && typeof u8p.readUint32BE !== "function") {
  u8p.readUint32BE = function(offset = 0) {
    return (
      (this[offset] << 24) >>> 0 |
      (this[offset + 1] << 16) >>> 0 |
      (this[offset + 2] << 8) >>> 0 |
      (this[offset + 3]) >>> 0
    ) >>> 0;
  };
}



