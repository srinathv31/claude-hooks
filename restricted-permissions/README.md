# restricted-permissions

A user-level `CLAUDE.md` for machines where permission rules are locked to managed settings (`allowManagedPermissionRulesOnly`), so you can't add your own allow rules.

It doesn't change any permission. It steers Claude toward commands the existing allow list can match, which cuts unnecessary prompts. The common causes it targets:

- Shell variables or `$(...)` in a command. Claude Code can't check these before they run, so it always asks.
- Chained or piped commands where one piece (often `head` or `tail`) isn't on the allow list.
- Shell commands used for reading or searching, where the built-in Read, Grep, and Glob tools would need no prompt.

## Setup

Copy `CLAUDE.md` to your Claude config folder (or append it if you already have one there):

- Windows: `%USERPROFILE%\.claude\CLAUDE.md`
- macOS/Linux: `~/.claude/CLAUDE.md`

Then edit the "Allowed without prompting" line to match your organization's actual allow list, which you can find in the managed settings file.
