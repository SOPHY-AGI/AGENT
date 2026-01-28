import { describe, expect, it } from "vitest";

import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it("detects help/version flags", () => {
    expect(hasHelpOrVersion(["node", "AGENT", "--help"])).toBe(true);
    expect(hasHelpOrVersion(["node", "AGENT", "-V"])).toBe(true);
    expect(hasHelpOrVersion(["node", "AGENT", "status"])).toBe(false);
  });

  it("extracts command path ignoring flags and terminator", () => {
    expect(getCommandPath(["node", "AGENT", "status", "--json"], 2)).toEqual(["status"]);
    expect(getCommandPath(["node", "AGENT", "agents", "list"], 2)).toEqual(["agents", "list"]);
    expect(getCommandPath(["node", "AGENT", "status", "--", "ignored"], 2)).toEqual(["status"]);
  });

  it("returns primary command", () => {
    expect(getPrimaryCommand(["node", "AGENT", "agents", "list"])).toBe("agents");
    expect(getPrimaryCommand(["node", "AGENT"])).toBeNull();
  });

  it("parses boolean flags and ignores terminator", () => {
    expect(hasFlag(["node", "AGENT", "status", "--json"], "--json")).toBe(true);
    expect(hasFlag(["node", "AGENT", "--", "--json"], "--json")).toBe(false);
  });

  it("extracts flag values with equals and missing values", () => {
    expect(getFlagValue(["node", "AGENT", "status", "--timeout", "5000"], "--timeout")).toBe(
      "5000",
    );
    expect(getFlagValue(["node", "AGENT", "status", "--timeout=2500"], "--timeout")).toBe("2500");
    expect(getFlagValue(["node", "AGENT", "status", "--timeout"], "--timeout")).toBeNull();
    expect(getFlagValue(["node", "AGENT", "status", "--timeout", "--json"], "--timeout")).toBe(
      null,
    );
    expect(getFlagValue(["node", "AGENT", "--", "--timeout=99"], "--timeout")).toBeUndefined();
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "AGENT", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "AGENT", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "AGENT", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it("parses positive integer flag values", () => {
    expect(getPositiveIntFlagValue(["node", "AGENT", "status"], "--timeout")).toBeUndefined();
    expect(
      getPositiveIntFlagValue(["node", "AGENT", "status", "--timeout"], "--timeout"),
    ).toBeNull();
    expect(
      getPositiveIntFlagValue(["node", "AGENT", "status", "--timeout", "5000"], "--timeout"),
    ).toBe(5000);
    expect(
      getPositiveIntFlagValue(["node", "AGENT", "status", "--timeout", "nope"], "--timeout"),
    ).toBeUndefined();
  });

  it("builds parse argv from raw args", () => {
    const nodeArgv = buildParseArgv({
      programName: "AGENT",
      rawArgs: ["node", "AGENT", "status"],
    });
    expect(nodeArgv).toEqual(["node", "AGENT", "status"]);

    const versionedNodeArgv = buildParseArgv({
      programName: "AGENT",
      rawArgs: ["node-22", "AGENT", "status"],
    });
    expect(versionedNodeArgv).toEqual(["node-22", "AGENT", "status"]);

    const versionedNodeWindowsArgv = buildParseArgv({
      programName: "AGENT",
      rawArgs: ["node-22.2.0.exe", "AGENT", "status"],
    });
    expect(versionedNodeWindowsArgv).toEqual(["node-22.2.0.exe", "AGENT", "status"]);

    const versionedNodePatchlessArgv = buildParseArgv({
      programName: "AGENT",
      rawArgs: ["node-22.2", "AGENT", "status"],
    });
    expect(versionedNodePatchlessArgv).toEqual(["node-22.2", "AGENT", "status"]);

    const versionedNodeWindowsPatchlessArgv = buildParseArgv({
      programName: "AGENT",
      rawArgs: ["node-22.2.exe", "AGENT", "status"],
    });
    expect(versionedNodeWindowsPatchlessArgv).toEqual(["node-22.2.exe", "AGENT", "status"]);

    const versionedNodeWithPathArgv = buildParseArgv({
      programName: "AGENT",
      rawArgs: ["/usr/bin/node-22.2.0", "AGENT", "status"],
    });
    expect(versionedNodeWithPathArgv).toEqual(["/usr/bin/node-22.2.0", "AGENT", "status"]);

    const nodejsArgv = buildParseArgv({
      programName: "AGENT",
      rawArgs: ["nodejs", "AGENT", "status"],
    });
    expect(nodejsArgv).toEqual(["nodejs", "AGENT", "status"]);

    const nonVersionedNodeArgv = buildParseArgv({
      programName: "AGENT",
      rawArgs: ["node-dev", "AGENT", "status"],
    });
    expect(nonVersionedNodeArgv).toEqual(["node", "AGENT", "node-dev", "AGENT", "status"]);

    const directArgv = buildParseArgv({
      programName: "AGENT",
      rawArgs: ["AGENT", "status"],
    });
    expect(directArgv).toEqual(["node", "AGENT", "status"]);

    const bunArgv = buildParseArgv({
      programName: "AGENT",
      rawArgs: ["bun", "src/entry.ts", "status"],
    });
    expect(bunArgv).toEqual(["bun", "src/entry.ts", "status"]);
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "AGENT",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "AGENT", "status"]);
  });

  it("decides when to migrate state", () => {
    expect(shouldMigrateState(["node", "AGENT", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "AGENT", "health"])).toBe(false);
    expect(shouldMigrateState(["node", "AGENT", "sessions"])).toBe(false);
    expect(shouldMigrateState(["node", "AGENT", "memory", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "AGENT", "agent", "--message", "hi"])).toBe(false);
    expect(shouldMigrateState(["node", "AGENT", "agents", "list"])).toBe(true);
    expect(shouldMigrateState(["node", "AGENT", "message", "send"])).toBe(true);
  });

  it("reuses command path for migrate state decisions", () => {
    expect(shouldMigrateStateFromPath(["status"])).toBe(false);
    expect(shouldMigrateStateFromPath(["agents", "list"])).toBe(true);
  });
});
