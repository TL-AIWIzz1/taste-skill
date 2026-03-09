# SKILL: sovereign-dashboard
**Version:** 1.0
**Owner:** The Sovereign Ledger (@BannedLuigi)
**Trigger:** "open dashboard", "launch dashboard", "start dashboard", "You know what to do" (when context is dashboard)

---

## 1. IDENTITY & PURPOSE

This skill launches the Sovereign Ledger Command Center dashboard as a local web page you can open in your browser. One command — dashboard is live.

---

## 2. EXECUTION

When triggered, start a simple local HTTP server pointing at `dashboard.html` and open it in the browser.

### Steps

1. Start a lightweight Python HTTP server in the project directory on port 8888
2. Open `http://localhost:8888/dashboard.html` in the default browser
3. Report the URL back so the user can also open it manually or on another device

### Command Sequence

```bash
cd /home/user/taste-skill && python3 -m http.server 8888 &
sleep 1
xdg-open http://localhost:8888/dashboard.html 2>/dev/null || open http://localhost:8888/dashboard.html 2>/dev/null
```

### To Stop

```bash
pkill -f "python3 -m http.server 8888"
```

---

## 3. ACCESS

Once running, open this in any browser on your machine:

```
http://localhost:8888/dashboard.html
```

No installs. No accounts. No build step. All data stays in your browser (localStorage).

---

## 4. TABS REFERENCE

| Tab | What It Does |
|---|---|
| DASHBOARD | Content calendar, T1 prospect count, account health, activity log |
| SHADOW RATE | Calculator — outputs formatted diagnostic block, copy to clipboard |
| VOICE LINTER | Paste text — scores 0–100, flags banned words + voice violations |
| CHAR COUNTER | Live 280-char counter, thread mode, auto-clean em-dashes |
| CONTENT PLANNER | CIUN builder, auto CTA by gap, saves to calendar |
| PROSPECT LEDGER | Score + tier prospects, comment templates, export ledger |
