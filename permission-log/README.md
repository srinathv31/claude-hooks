# permission-log

A Claude Code `PermissionRequest` hook that records every approval prompt to a local log, plus a summary command that shows which commands cause the most prompts.

Use it to find out which handful of commands make up most of your approval prompts, then turn those into allow rules (or propose them for your organization's managed settings).

It only logs. It never prints a decision, so the normal approval prompt is unchanged.

## What it records

Each prompt becomes one JSON line in `~/.claude/permission-log.jsonl`:

```json
{"ts":"2026-10-14T13:02:11.000Z","tool":"Bash","command":"git status","cwd":"C:\\code\\proj1\\proj-ui","mode":"acceptEdits","session":"abc123"}
```

Fields: timestamp, tool, command (shell tools), file (file tools), working directory, permission mode, session ID, and agent type when the prompt came from a subagent.

It logs requests, not your answers. If you approve nearly everything, the request count is effectively your approval count.

## Setup

Requires Node.js on your `PATH`.

1. Copy `permission-log.js` to your Claude config folder:
   - Windows: `%USERPROFILE%\.claude\hooks\permission-log.js`
   - macOS/Linux: `~/.claude/hooks/permission-log.js`

2. Add the hook to your user settings (`~/.claude/settings.json`). Use the absolute path to the script.

   Windows:

   ```json
   {
     "hooks": {
       "PermissionRequest": [
         {
           "matcher": "*",
           "hooks": [
             {
               "type": "command",
               "command": "node",
               "args": ["C:/Users/<you>/.claude/hooks/permission-log.js"],
               "async": true
             }
           ]
         }
       ]
     }
   }
   ```

   macOS/Linux: same block, with `"args": ["/Users/<you>/.claude/hooks/permission-log.js"]` (or `/home/<you>/...`).

   If your settings file already has a `hooks` key, merge the `PermissionRequest` entry into it.

3. Restart Claude Code and run `/hooks`. The hook should be listed under `PermissionRequest`. If it isn't, your organization may restrict hooks to managed settings only (`allowManagedHooksOnly`).

## Summary

After a day of normal work:

```bash
node ~/.claude/hooks/permission-log.js summary 1
```

Pass a number of days, or omit it for the whole log. Output groups shell commands by their first two words and file edits by extension, sorted by count, with a running percentage:

```
142 permission requests in the last 1 day(s)

   38   26.8%  (cum  27%)  Bash: git status
   27   19.0%  (cum  46%)  Bash: git diff
   19   13.4%  (cum  59%)  Bash: npm run
   ...
```

The rows at the top are your candidates for allow rules.

## Privacy

The raw log contains commands and file paths from your machine, which may include internal project names. Keep the log local and out of git. Share only the summary table if you need to make the case for an allow list.

## Turning it off

Remove the `PermissionRequest` entry from your settings, and delete `~/.claude/permission-log.jsonl` if you no longer need it.
