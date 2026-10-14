## Shell command style (this machine has strict permission rules)

- Prefer the built-in Read, Grep, and Glob tools over shell commands for reading, searching, and listing files.
- One command per Bash call. No `&&`, `||`, `;`, or pipes unless every part is a simple allowed command.
- Never use shell variables, `$(...)`, or backticks. Write full paths literally.
- Don't pipe to `head`, `tail`, `sort`, or `wc`; read the output, or use Read with offset/limit.
- Allowed without prompting: git status/diff/log/show/branch/add/commit/stash/restore/checkout, npm run/test, npx eslint/prettier/tsc, pytest, rg, fd, jq, make. Shape commands to start with one of these.
- Use the Explore subagent for broad codebase searches. Other subagent types are not available here.
