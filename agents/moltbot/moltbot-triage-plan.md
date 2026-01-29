# 🔗 Plano de Ação: Triagem e Linkagem do Moltbot

**Objetivo:** Criar valor comentando issues e PRs com links relevantes
**Autor:** @Glucksberg
**Data:** 2026-01-28

---

## 📊 Resumo das Conexões Encontradas

| Categoria | Issues | PRs Relacionados | Comentários a Fazer |
|-----------|--------|------------------|---------------------|
| Compaction/Orphan Tool | 15 | 9 | 8 |
| Cron/Heartbeat | 16 | 10 | 7 |
| UI Chat Tab | 4 | 4 | 4 |
| i18n/Localization | 2 | - | 1 |
| State Dir Migration | 2 | 3 | 2 |
| Discord | 5 | 2 | 2 |
| Slack | 4 | 3 | 2 |
| macOS Crashes | 3 | 2 | 2 |
| Kimi/Moonshot | 3 | 2 | 1 |
| Security | 4 | 4 | 1 |
| **Total** | **58** | **39** | **30** |

---

## 🎯 COMENTÁRIOS PRONTOS PARA POSTAR

### ═══════════════════════════════════════
### 1. CLUSTER: COMPACTION & ORPHAN TOOL_RESULT
### ═══════════════════════════════════════

#### 📝 Comentário #1 - Issue #3462 (safeguard creates orphan tool_result)
**URL:** https://github.com/moltbot/moltbot/issues/3462

```markdown
This issue appears to be part of a larger cluster of compaction/orphan tool_result problems. Related issues and PRs:

**Related Issues:**
- #3528 - Session corruption with orphaned tool_use blocks
- #3455 - Compaction drops required fields (tool_use.input, thinking.signature)
- #3479 - Compaction always fails to generate summaries
- #3436 - Safeguard compaction mode fails at 186k tokens
- #2955 - transcript-sanitize extension defined but never loaded (orphan crash)

**Potentially Fixing PRs:**
- #3362 - fix: auto-repair and retry on orphan tool_result errors
- #3130 - fix: prevent tool_use/tool_result pairing issues + add diagnostics
- #3125 - fix: prevent orphan tool_result errors from streaming failures
- #2806 - Fix: Repair tool_use/tool_result pairing for Claude on any provider

Linking these for visibility and to help consolidate the fix effort.
```

---

#### 📝 Comentário #2 - Issue #3528 (orphaned tool_use with gateway tool)
**URL:** https://github.com/moltbot/moltbot/issues/3528

```markdown
This seems related to the broader compaction/orphan tool pairing issues. See also:

**Related Issues:**
- #3462 - safeguard mode creates orphan tool_result blocks
- #3455 - compaction drops required fields
- #2955 - transcript-sanitize extension never loaded

**PRs that may address this:**
- #3362 - fix: auto-repair and retry on orphan tool_result errors
- #3130 - fix: prevent tool_use/tool_result pairing issues + add diagnostics
- #3194 - fix: skip incomplete tool calls in transcript repair

The root cause across these issues appears to be incomplete tool call handling during streaming failures or compaction.
```

---

#### 📝 Comentário #3 - PR #3362 (auto-repair orphan tool_result)
**URL:** https://github.com/moltbot/moltbot/pull/3362

```markdown
Great PR! This should help address multiple open issues:

**Issues this may fix/mitigate:**
- #3462 - safeguard mode creates orphan tool_result blocks causing API rejection
- #3528 - Session corruption with orphaned tool_use blocks
- #2955 - transcript-sanitize extension defined but never loaded — tool_use/tool_result orphan crash

**Related PRs working on similar problems:**
- #3130 - fix: prevent tool_use/tool_result pairing issues + add diagnostics
- #3125 - fix: prevent orphan tool_result errors from streaming failures
- #3194 - fix: skip incomplete tool calls in transcript repair

Would be great to coordinate with these other PRs to ensure comprehensive coverage of the orphan tool pairing problem.
```

---

#### 📝 Comentário #4 - Issue #3479 (Compaction fails to generate summaries)
**URL:** https://github.com/moltbot/moltbot/issues/3479

```markdown
This appears to be part of the compaction issues cluster. Related:

**Similar/Related Issues:**
- #3436 - Safeguard compaction mode fails to generate summary at 186k tokens
- #3425 - keepRecentTokens not honored when summarization fails
- #3298 - Compaction fails for providers with authHeader: false
- #3225 - Compaction fails with 'Cannot read properties of undefined'
- #3208 - Hebrew gibberish output after multiple context compactions

**PRs that may help:**
- #3109 - fix(compaction): resolve model via runtime when ctx.model is undefined
- #3332 - fix: pass workspace context files to compaction agent session
- #3188 - fix: detect context_overflow error for auto-compaction

Some of these might share a common root cause around model resolution or context handling during compaction.
```

---

#### 📝 Comentário #5 - Issue #3452 (post-compaction recovery turn)
**URL:** https://github.com/moltbot/moltbot/issues/3452

```markdown
This feature request is related to several compaction issues where context is lost or corrupted:

**Related Issues:**
- #2824 - Post-compaction memory search hook
- #2930 - Feature request: post-context-recovery hook
- #3467 - Feature Request: Auto-extract context summary before compaction
- #2935 - Heartbeat stops firing after context compression
- #2965 - Cron jobs should be resilient to main session context compaction

These all touch on the theme of "what happens after compaction" - both recovery and resilience.
```

---

### ═══════════════════════════════════════
### 2. CLUSTER: CRON & HEARTBEAT
### ═══════════════════════════════════════

#### 📝 Comentário #6 - Issue #3486 (Cron jobs fire repeatedly)
**URL:** https://github.com/moltbot/moltbot/issues/3486

```markdown
Linking related cron scheduling issues:

**Related Issues:**
- #3220 - Cron job with 'at' schedule fires immediately instead of waiting
- #2813 - Cron job scheduled but never fired during event loop silence
- #3520 - Cron delivery routing picks up wrong target
- #3535 - Cron systemEvent runs can spam last active chat channel

**PRs that may address cron timing:**
- #3335 - Fixes cron jobs
- #2990 - fix: Re-arm cron service timer with a delay if already running
- #2183 - fix(cron): anchor 'every' jobs to lastRunAtMs instead of now

The timing/scheduling issues seem to have multiple root causes that different PRs are addressing.
```

---

#### 📝 Comentário #7 - Issue #3333 (Cron not routing to Discord)
**URL:** https://github.com/moltbot/moltbot/issues/3333

```markdown
This appears related to the broader cron delivery/routing issues:

**Related Issues:**
- #3520 - Cron delivery routing picks up wrong target from isolated session context
- #3535 - Cron systemEvent runs can spam last active chat channel
- #2937 - Cron jobs with wake=now don't deliver to Telegram

**PRs addressing cron delivery:**
- #3548 - cron: respect wakeMode=next-heartbeat for main jobs
- #2228 - fix(cron): warn when isolated job won't deliver output

The common theme is cron jobs running but output not reaching the intended channel.
```

---

#### 📝 Comentário #8 - Issue #3181 (Runaway heartbeat loop)
**URL:** https://github.com/moltbot/moltbot/issues/3181

```markdown
Related heartbeat issues that may share causes:

**Related Issues:**
- #3445 - Heartbeat causes crash loop with AbortError
- #3389 - HEARTBEAT.md not working
- #2935 - Heartbeat stops firing after context compression
- #2804 - System events trigger rapid heartbeat re-runs

**PRs that may help:**
- #3420 - fix: skip heartbeat wake for subagent exec completions
- #3396 - Config: gateway.unhandledRejections (warn|exit)

These heartbeat issues seem to involve either over-triggering or complete failure - the extremes of the same system.
```

---

#### 📝 Comentário #9 - PR #3335 (Fixes cron jobs)
**URL:** https://github.com/moltbot/moltbot/pull/3335

```markdown
This PR may help with several open cron issues:

**Issues this could address:**
- #3486 - Cron jobs fire repeatedly instead of once
- #3220 - Cron job with 'at' schedule fires immediately
- #2813 - Cron job scheduled but never fired

**Related PRs:**
- #2990 - fix: Re-arm cron service timer with a delay
- #2183 - fix(cron): anchor 'every' jobs to lastRunAtMs

Could you clarify which specific cron bugs this addresses? Would help with issue triage.
```

---

#### 📝 Comentário #10 - Issue #3318 (Timezone at install)
**URL:** https://github.com/moltbot/moltbot/issues/3318

```markdown
Good news - there's a PR addressing this!

**PR:** #3339 - feat(onboard): Add timezone prompt to onboarding wizard

Also related:
- #3329 - feat: use userTimezone as default for cron schedules

These two PRs together should provide a complete solution for timezone-aware cron scheduling.
```

---

### ═══════════════════════════════════════
### 3. CLUSTER: UI CHAT TAB
### ═══════════════════════════════════════

#### 📝 Comentário #11 - Issue #3414 (Edit session label)
**URL:** https://github.com/moltbot/moltbot/issues/3414

```markdown
There's a PR for this: #3415 - feat(ui): edit session label in Chat tab

Also related UI issues:
- #3413 - Chat tab: no way to delete session → PR #3386
- #3412 - Chat tab: no keyboard shortcut to stop generation → PR #3383
- #3367 - Sessions tab: clicking session navigates to wrong session → PR #3368

All four Chat tab issues have corresponding PRs ready for review!
```

---

#### 📝 Comentário #12 - Issue #3413 (Delete session)
**URL:** https://github.com/moltbot/moltbot/issues/3413

```markdown
PR available: #3386 - feat(ui): Delete session button in Chat tab

Related Chat tab issues with PRs:
- #3414 (edit label) → PR #3415
- #3412 (escape to stop) → PR #3383
- #3367 (wrong session nav) → PR #3368

These are all by @Lukavyi - great work on the Chat tab UX improvements!
```

---

#### 📝 Comentário #13 - Issue #3367 (Sessions tab wrong navigation)
**URL:** https://github.com/moltbot/moltbot/issues/3367

```markdown
PR available: #3368 - fix(ui): clicking session in Sessions tab navigates to wrong session + add Telegram DM thread display

This PR also adds the DM topic display mentioned in the issue description.
```

---

### ═══════════════════════════════════════
### 4. CLUSTER: DISCORD
### ═══════════════════════════════════════

#### 📝 Comentário #14 - Issue #3464 (Discord bot presence)
**URL:** https://github.com/moltbot/moltbot/issues/3464

```markdown
There's a PR for this: #3492 - feat(discord): add bot presence config for model/auth display

This will allow showing the current model and auth profile in the bot's Discord presence.
```

---

#### 📝 Comentário #15 - Issue #3228 (Discord cross-channel session bleed)
**URL:** https://github.com/moltbot/moltbot/issues/3228

```markdown
This may be related to other session routing issues:

**Related Issues:**
- #3549 - Discord: Duplicate messages being sent (double send)
- #3308 - Critical Privacy Issue - Messages Appearing in Wrong User's Chat
- #3487 - Webchat Session Messages Routing to WhatsApp

These all involve messages going to unintended destinations - could share a root cause in session key resolution.
```

---

### ═══════════════════════════════════════
### 5. CLUSTER: SLACK
### ═══════════════════════════════════════

#### 📝 Comentário #16 - Issue #3327 (Slack DM reaction but no run)
**URL:** https://github.com/moltbot/moltbot/issues/3327

```markdown
Related Slack issues:

- #3519 - Slack: User token not used for file downloads
- #3526 - Slack integration intercepts DMs between users
- #3471 - Feature Request: Receive and route threaded replies in Slack DMs

**PRs that may help:**
- #3254 - fix(slack): forward threadId in extension read action
- #3093 - feat(slack): add thread.followOnMention config
- #2414 - fix(slack): route DM replies to original channel, not App Home
```

---

### ═══════════════════════════════════════
### 6. CLUSTER: STATE DIR MIGRATION
### ═══════════════════════════════════════

#### 📝 Comentário #17 - Issue #3533 (Broken state dir migration)
**URL:** https://github.com/moltbot/moltbot/issues/3533

```markdown
There's a PR addressing this: #3561 - fix: fail fast when both state dirs exist

Also related:
- #3545 - Misleading ~/.clawdbot/credentials/ folder name
- PR #3207 - fix: use .moltbot for device identity directory
- PR #3525 - fix(daemon): support MOLTBOT_STATE_DIR environment variable

The migration from clawdbot → moltbot paths has been causing several issues.
```

---

### ═══════════════════════════════════════
### 7. CLUSTER: macOS APP CRASHES
### ═══════════════════════════════════════

#### 📝 Comentário #18 - Issue #3524 (macOS crash on code blocks)
**URL:** https://github.com/moltbot/moltbot/issues/3524

```markdown
PR available: #3337 - fix(macos-app): patch SwiftPM Bundle.module accessor for app bundle

This should fix the Bundle.module assertion failure when rendering fenced code blocks.
```

---

#### 📝 Comentário #19 - Issue #3529 (macOS Voice Wake crash)
**URL:** https://github.com/moltbot/moltbot/issues/3529

```markdown
There's a related PR: #3391 - macOS: fix voice wake crash in trimmedAfterTrigger

This fixes a crash in the voice wake system, though it may be a different root cause than the "no audio input device" scenario described here.
```

---

### ═══════════════════════════════════════
### 8. CLUSTER: KIMI/MOONSHOT
### ═══════════════════════════════════════

#### 📝 Comentário #20 - Issue #3475 (Kimi/Moonshot fails silently)
**URL:** https://github.com/moltbot/moltbot/issues/3475

```markdown
Related Kimi/Moonshot issues:

- #3443 - Message ordering conflict error when using custom Moonshot/Kimi provider
- #3213 - Moonshot Kimi K2.5 returns blank responses (reasoning_content not parsed)

**PRs:**
- #3155 - feat(models): Add Kimi K2.5 support for the kimi coding plan
- #2906 - fix: normalize Moonshot thinking signatures on message receipt

The Kimi/Moonshot provider integration seems to have several rough edges that these PRs are addressing.
```

---

### ═══════════════════════════════════════
### 9. CLUSTER: SECURITY
### ═══════════════════════════════════════

#### 📝 Comentário #21 - Issue #3277 (Path validation bypasses)
**URL:** https://github.com/moltbot/moltbot/issues/3277

```markdown
There are multiple PRs addressing the issues raised here:

- #3282 - security(archive): fix path traversal in zip/tar extraction
- #3284 - security(gateway): validate transcript sessionFile path
- #3285 - security(memory): fix workspace escape via path prefix collision

These PRs by @robbyczgw-cla appear to address all the path traversal concerns in this issue. Great security work!
```

---

### ═══════════════════════════════════════
### 10. OUTRAS CONEXÕES IMPORTANTES
### ═══════════════════════════════════════

#### 📝 Comentário #22 - Issue #3214 (Per-agent thinkingDefault)
**URL:** https://github.com/moltbot/moltbot/issues/3214

```markdown
PR available: #3301 - feat(agents): add per-agent thinkingDefault override

This adds exactly the feature requested!
```

---

#### 📝 Comentário #23 - Issue #3231 (Rate-limit cooldown per model)
**URL:** https://github.com/moltbot/moltbot/issues/3231

```markdown
PR available: #3470 - feat(auth): track cooldown per (auth profile + model)

This implements the requested feature to track cooldowns per model+profile combination.
```

---

#### 📝 Comentário #24 - Issue #3395 (Skills lazy loading)
**URL:** https://github.com/moltbot/moltbot/issues/3395

```markdown
PR available: #3397 - feat(skills): add promptMode config for compact/lazy skill injection

This adds the lazy loading feature for skills prompt injection.
```

---

#### 📝 Comentário #25 - Issue #3504 (Webchat audio playback)
**URL:** https://github.com/moltbot/moltbot/issues/3504

```markdown
There's a PR for this: #3518 - feat (webchat): add inline audio playback for TTS-generated audio

Also related: #3354 - Webchat: Add audio/video player support for MEDIA: paths

Both issues are about media playback in webchat.
```

---

#### 📝 Comentário #26 - Issue #3336 (message:sent hook)
**URL:** https://github.com/moltbot/moltbot/issues/3336

```markdown
PR available: #3428 - feat(hooks): wire up message_sent plugin hook

This implements the pre-send validation hook requested here.
```

---

#### 📝 Comentário #27 - Issue #3469 (/model status command)
**URL:** https://github.com/moltbot/moltbot/issues/3469

```markdown
PR available: #3496 - fix(tui): handle /model status and /model list subcommands

This fixes the command parsing to properly recognize 'status' and 'list' as subcommands.
```

---

#### 📝 Comentário #28 - Issue #3043 (TUI footer hardcoded provider)
**URL:** https://github.com/moltbot/moltbot/issues/3043

```markdown
PR available: #3057 - Fix TUI footer to show the actual model you're using

This fixes the footer to show the real active model instead of the hardcoded provider.
```

---

#### 📝 Comentário #29 - Issue #3031 (Pending tasks lost on subagent complete)
**URL:** https://github.com/moltbot/moltbot/issues/3031

```markdown
PR available: #3045 - fix: preserve pending tasks when subagent completes

This should fix the issue of main agent losing its pending tasks.
```

---

#### 📝 Comentário #30 - Issue #2816 (OPENAI_TTS_BASE_URL ignored)
**URL:** https://github.com/moltbot/moltbot/issues/2816

```markdown
PR available: #3341 - fix(tts): read OPENAI_TTS_BASE_URL at runtime instead of module load

This fixes the env var being captured too early at module import time.
```

---

## 📋 CHECKLIST DE EXECUÇÃO

| # | Issue/PR | Comentário | Status |
|---|----------|------------|--------|
| 1 | #3462 | Compaction cluster | ⬜ |
| 2 | #3528 | Orphan tool_use | ⬜ |
| 3 | PR #3362 | Auto-repair orphans | ⬜ |
| 4 | #3479 | Compaction fails | ⬜ |
| 5 | #3452 | Post-compaction recovery | ⬜ |
| 6 | #3486 | Cron repeats | ⬜ |
| 7 | #3333 | Cron Discord | ⬜ |
| 8 | #3181 | Heartbeat runaway | ⬜ |
| 9 | PR #3335 | Fixes cron | ⬜ |
| 10 | #3318 | Timezone | ⬜ |
| 11 | #3414 | Edit label | ⬜ |
| 12 | #3413 | Delete session | ⬜ |
| 13 | #3367 | Wrong nav | ⬜ |
| 14 | #3464 | Discord presence | ⬜ |
| 15 | #3228 | Discord bleed | ⬜ |
| 16 | #3327 | Slack DM | ⬜ |
| 17 | #3533 | State dir | ⬜ |
| 18 | #3524 | macOS code | ⬜ |
| 19 | #3529 | macOS voice | ⬜ |
| 20 | #3475 | Kimi | ⬜ |
| 21 | #3277 | Security paths | ⬜ |
| 22 | #3214 | thinkingDefault | ⬜ |
| 23 | #3231 | Cooldown | ⬜ |
| 24 | #3395 | Skills lazy | ⬜ |
| 25 | #3504 | Webchat audio | ⬜ |
| 26 | #3336 | message:sent | ⬜ |
| 27 | #3469 | /model status | ⬜ |
| 28 | #3043 | TUI footer | ⬜ |
| 29 | #3031 | Pending tasks | ⬜ |
| 30 | #2816 | TTS base URL | ⬜ |

---

## 💡 DICAS DE EXECUÇÃO

1. **Espaçamento**: Não poste todos de uma vez. Distribua em 2-3 dias para parecer natural.

2. **Prioridade sugerida**:
   - 🔴 Alta: Comentários #1-5 (Compaction) - problema muito visível
   - 🟠 Média: Comentários #6-10 (Cron) - afeta muitos usuários  
   - 🟡 Normal: Todos os outros

3. **Adaptação**: Se alguma issue/PR já foi fechada quando for postar, adapte ou pule.

4. **Engajamento**: Se o autor do PR responder, continue a conversa! Isso mostra que você está engajado.

5. **Seu toque**: Sinta-se livre para ajustar a linguagem para seu estilo pessoal.

---

## 📈 IMPACTO ESPERADO

- **30 comentários** com links úteis
- Conecta **~60 issues** a PRs relevantes  
- Demonstra conhecimento profundo do codebase
- Ajuda maintainers na triagem
- Estabelece você como contribuidor valioso

---

*Gerado por researcher agent em 2026-01-28*
