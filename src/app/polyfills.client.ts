"use client";

import { Buffer } from "buffer";

// Make Buffer available globally for browser runtime and overwrite any partial shims
if (typeof globalThis !== "undefined") {
  (globalThis as any).Buffer = Buffer;
}



