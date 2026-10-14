## Shell command style (this machine has strict permission rules)

- Prefer the built-in Read, Grep, and Glob tools over shell commands for reading, searching, and listing files.
- One command per Bash call. No `&&`, `||`, `;`, or pipes unless every part is a simple allowed command.
- Never use shell variables, `$(...)`, or backticks. Write full paths literally.
- Don't pipe to `head`, `tail`, `sort`, or `wc`; read the output, or use Read with offset/limit.
- Allowed without prompting: git status/diff/log/show/branch/add/commit/stash/restore/checkout, npm run/test, npx eslint/prettier/tsc, pytest, rg, fd, jq, make. Shape commands to start with one of these.
- Use the Explore subagent for broad codebase searches. Other subagent types are not available here.

## Multi-repo workspaces

Sessions often start in a workspace folder that holds several git repos side by side. Allow rules match the start of a command, so:

- Never use `git -C <path>` or tool flags that point at another directory. They don't match the allow rules.
- To work in a repo, first run `cd "<full path to repo>"` as its own Bash call, then run plain commands (`git status`, `npm run build`) in separate calls. The shell stays in that directory for later commands.
- Never combine `cd` with anything else (`cd X && git ...`). Claude Code always asks before a command that changes directory and then runs git, as a safety check.
- When switching to another repo, `cd` to it first the same way.
- File tools (Read, Edit, Grep, Glob) take full paths and work across all repos without changing directory.
