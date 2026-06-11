# Claude chat prompts

Copy-paste prompts for using these skills inside claude.ai.

> Replace `YOUR_GITHUB_USER` with the account this repo is published under
> (e.g. `TL-AIWIzz1`) in the URLs below.

---

## Prompt 1 — Build the skill inside Claude chat (one-time setup)

Use this in a new claude.ai conversation. It makes Claude construct the skill
package for you, ready to install under **Settings → Capabilities → Skills**.
Web search must be enabled so Claude can fetch the file.

```text
I want you to build a custom Claude Skill for me called "design-taste-frontend".

1. Fetch the full contents of this file:
   https://raw.githubusercontent.com/YOUR_GITHUB_USER/skills/main/skills/design-taste-frontend/SKILL.md

2. Create a skill package with this exact structure:
   design-taste-frontend/
     SKILL.md
   The SKILL.md must keep the YAML frontmatter (name, description) and the full
   body of the fetched file, completely unchanged. Do not summarize, shorten,
   or "improve" any section — copy it verbatim.

3. Zip the folder and give it to me as a downloadable file named
   design-taste-frontend.zip so I can upload it in
   Settings → Capabilities → Skills → Upload skill.

4. Confirm the zip contains the folder with SKILL.md inside it (not SKILL.md
   at the zip root), since Claude Skills require the folder wrapper.

If you cannot fetch the URL, tell me and I will paste the file contents instead.
```

Repeat with `redesign-existing-projects` or `full-output-enforcement` in place
of `design-taste-frontend` to build the other two skills.

---

## Prompt 2 — Use the skill directly in a chat (no install)

If you don't want to install a skill, paste this at the start of a
conversation. It applies the rules to everything Claude builds in that chat.

```text
Before we start: fetch and read this file in full —
https://raw.githubusercontent.com/YOUR_GITHUB_USER/skills/main/skills/design-taste-frontend/SKILL.md

From now on in this conversation, act as the Senior UI/UX Engineer it
describes. Treat every section of that file as a hard rule for all frontend
code you write for me: the architecture conventions, the bias-correction
directives, the forbidden "AI tells", the performance guardrails, and the
final pre-flight check. Baseline dials: DESIGN_VARIANCE 8, MOTION_INTENSITY 6,
VISUAL_DENSITY 4 — adjust only if I ask.

Also apply the full-output rules from
https://raw.githubusercontent.com/YOUR_GITHUB_USER/skills/main/skills/full-output-enforcement/SKILL.md
— complete files only, no placeholder comments, no skipped sections.

Confirm you've read both files, then ask me what we're building.
```

---

## Prompt 3 — Tuning the dials mid-conversation

Once the skill is active (installed or pasted), steer it like this:

```text
Set DESIGN_VARIANCE to 3 and VISUAL_DENSITY to 8 — this is an internal data
dashboard, so keep the layout conventional and dense. Keep MOTION_INTENSITY
at 4.
```

---

## Notes

- The **installed skill** route (Prompt 1, or uploading the zips from this
  repo's releases directly) is the most reliable: Claude loads the skill
  automatically whenever a request matches its description, in every new chat.
- The **pasted prompt** route (Prompt 2) only lasts for one conversation.
- For long builds, also install `full-output-enforcement` so Claude never
  replaces code with `// rest of code` placeholders.
