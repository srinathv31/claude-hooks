#!/usr/bin/env node
// Logs every Claude Code permission request to ~/.claude/permission-log.jsonl.
// Logging only: it never prints a decision, so the normal approval prompt is unchanged.
//
// Hook mode (called by Claude Code):  node permission-log.js
// Summary mode (run it yourself):     node permission-log.js summary [days]

const fs = require("fs");
const os = require("os");
const path = require("path");

const LOG = path.join(os.homedir(), ".claude", "permission-log.jsonl");

function keyFor(entry) {
  const tool = entry.tool || "unknown";
  if ((tool === "Bash" || tool === "PowerShell") && entry.command) {
    // Group by the first two words, e.g. "git status", "npm run", "mvn clean"
    const words = entry.command.trim().split(/\s+/).slice(0, 2).join(" ");
    return `${tool}: ${words}`;
  }
  if (entry.file) return `${tool}: *${path.extname(entry.file) || "(no ext)"}`;
  return tool;
}

function summary(days) {
  if (!fs.existsSync(LOG)) {
    console.log(`No log yet at ${LOG}`);
    return;
  }
  const cutoff = days ? Date.now() - days * 86400000 : 0;
  const counts = new Map();
  let total = 0;
  for (const line of fs.readFileSync(LOG, "utf8").split("\n")) {
    if (!line.trim()) continue;
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }
    if (Date.parse(entry.ts) < cutoff) continue;
    const k = keyFor(entry);
    counts.set(k, (counts.get(k) || 0) + 1);
    total++;
  }
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  console.log(`${total} permission requests${days ? ` in the last ${days} day(s)` : ""}\n`);
  let running = 0;
  for (const [k, n] of rows) {
    running += n;
    const pct = ((n / total) * 100).toFixed(1).padStart(5);
    const cum = ((running / total) * 100).toFixed(0).padStart(3);
    console.log(`${String(n).padStart(5)}  ${pct}%  (cum ${cum}%)  ${k}`);
  }
}

function hook() {
  let raw = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (c) => (raw += c));
  process.stdin.on("end", () => {
    try {
      const input = JSON.parse(raw);
      const ti = input.tool_input || {};
      const entry = {
        ts: new Date().toISOString(),
        tool: input.tool_name,
        command: ti.command,
        file: ti.file_path || ti.path,
        cwd: input.cwd,
        mode: input.permission_mode,
        session: input.session_id,
        agent: input.agent_type,
      };
      fs.mkdirSync(path.dirname(LOG), { recursive: true });
      fs.appendFileSync(LOG, JSON.stringify(entry) + "\n");
    } catch {
      // Never interfere with the prompt; a logging failure is silent.
    }
    process.exit(0); // No stdout: the normal permission flow applies.
  });
}

if (process.argv[2] === "summary") {
  summary(Number(process.argv[3]) || 0);
} else {
  hook();
}
