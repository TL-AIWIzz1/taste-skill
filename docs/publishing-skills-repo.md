# Publishing the standalone skills repo

A standalone repo layout (modeled on [AdAdvisor/skills](https://github.com/AdAdvisor/skills))
was prepared from this project's three skills:

```
skills/
  design-taste-frontend/SKILL.md       (from taste-skill/)
  redesign-existing-projects/SKILL.md  (from redesign-skill/)
  full-output-enforcement/SKILL.md     (from output-skill/)
docs/claude-chat-prompt.md
README.md
VERSION
```

Folder names match each skill's `name:` frontmatter, so every folder zips
directly into a Claude-installable skill (claude.ai → Settings → Capabilities
→ Skills → Upload skill).

## To publish

1. Create an empty repo on GitHub (https://github.com/new), e.g. `skills`.
   Do not initialize it with a README.
2. Unzip `skills-repo.zip` (it contains the git history already), then:

```bash
cd skills
git remote add origin https://github.com/YOUR_GITHUB_USER/skills.git
git push -u origin main
```

3. Replace `YOUR_GITHUB_USER` in `docs/claude-chat-prompt.md` and the raw
   URLs with the account you published under.
