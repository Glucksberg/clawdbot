# 🔍 Moltbot Repository Monitor - Especificação Técnica

**Projeto:** Monitor de Repositório GitHub para Triagem de Issues/PRs
**Repositório Alvo:** moltbot/moltbot
**Criado em:** 2026-01-28
**Autor:** @Glucksberg (com assistência do Researcher Agent)

---

## 📋 Visão Geral

Sistema de monitoramento que:
1. Identifica conexões entre issues e PRs não linkados
2. Posta comentários úteis ligando itens relacionados
3. Analisa contexto das conversas antes de agir
4. Reporta atividade via Telegram

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    PLANO DE TRIAGEM INICIAL                 │
│                    (30 comentários em ~20h)                 │
├─────────────────────────────────────────────────────────────┤
│  Batch 1 ──► Batch 2 ──► Batch 3 ──► ... ──► Batch 6       │
│  (manual)   (+4h)       (+8h)              (+20h)          │
│                                              │              │
│                                              ▼              │
│                                    RELATÓRIO FINAL          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    MONITOR PERMANENTE                       │
│                    (a cada 4 horas)                         │
├─────────────────────────────────────────────────────────────┤
│  • Busca issues/PRs novos                                   │
│  • Identifica conexões óbvias e úteis                       │
│  • Posta apenas se agrega valor                             │
│  • Reporta "Tudo OK" se não há nada a fazer                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Filosofia de Atuação

### Regras de Ouro
1. **Menos é mais** - só linke o que é claramente útil
2. **Não comente só para comentar** - evite spam
3. **Se em dúvida, não poste** - conservador
4. **"Não procure pelo em ovo"** - não force conexões

### Diferencial vs. Outros Bots
| Bots Típicos | Este Monitor |
|--------------|--------------|
| Templates automáticos | Análise contextual |
| Rodam em tudo | Seletivo, conservador |
| Assinatura de bot | Parece contribuidor humano |
| Análise de código | Curadoria de conexões |

---

## 📦 Cron Jobs Configurados

### Jobs One-Shot (Triagem Inicial)

```javascript
// Batch 2-6: Estrutura do prompt
{
  "name": "moltbot-triage-batchN",
  "schedule": { "kind": "at", "atMs": <timestamp> },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "<prompt de análise>",
    "deliver": true,
    "channel": "telegram",
    "to": "-1003840574484"
  }
}
```

### Job Recorrente (Monitor Permanente)

```javascript
{
  "name": "moltbot-repo-monitor",
  "schedule": { 
    "kind": "every", 
    "everyMs": 14400000  // 4 horas
  },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "<prompt do monitor>",
    "deliver": true,
    "channel": "telegram",
    "to": "-1003840574484"
  }
}
```

---

## 📝 Prompts Utilizados

### Prompt de Batch (Triagem Inicial)

```markdown
# Monitor de Repositório Moltbot - Batch N

Você é um monitor de repositório. Sua tarefa é analisar issues/PRs 
e postar comentários úteis linkando itens relacionados.

## FASE 1: ANÁLISE DE CONTEXTO

Para cada issue/PR, execute:
gh issue view <num> --repo moltbot/moltbot --json state,comments

Analise:
1. **Estado**: Ainda está OPEN? Se CLOSED/MERGED, pule.
2. **Comentários existentes**: Alguém já linkou as mesmas issues/PRs?
3. **Contexto da conversa**: 
   - Maintainer rejeitou a abordagem?
   - Já há discussão sobre as conexões?
   - Há informação nova que muda a relevância?

## FASE 2: DECISÃO

- ✅ POSTAR - se o link agrega valor e não é redundante
- ⏭️ PULAR - se já existe comentário similar ou contexto mudou
- 🔄 ADAPTAR - se precisa ajustar baseado na conversa

## FASE 3: EXECUÇÃO

[Lista de issues/PRs específicos do batch]

## FASE 4: RELATÓRIO

Envie para Telegram:
- Quantos analisados
- Quantos postados (com links)
- Quantos pulados (e por quê)
- Insights relevantes
```

### Prompt do Monitor Permanente

```markdown
# 🔍 Monitor de Repositório Moltbot - Verificação Periódica

Você é um monitor de repositório que roda a cada 4 horas.

## FILOSOFIA
⚠️ **NÃO procure pelo em ovo!** Só sugira links que REALMENTE agregam valor.

## FASE 1: BUSCAR NOVIDADES

gh issue list --repo moltbot/moltbot --state open --limit 50 --json number,title,createdAt
gh pr list --repo moltbot/moltbot --state open --limit 50 --json number,title,createdAt

Filtre apenas os criados nas últimas ~4-6 horas.

## FASE 2: ANÁLISE DE CONEXÕES

Para cada item novo:
1. Existe issue/PR relacionado que deveria ser linkado?
2. O link é ÓBVIO e ÚTIL?
3. Alguém já fez esse link?

## FASE 3: DECISÃO CONSERVADORA

- ✅ LINKAR - apenas se for conexão clara e valiosa
- 🟢 TUDO OK - se não há links óbvios a fazer

## FASE 4: RELATÓRIO

Se houver links:
🔗 Monitor Moltbot - [DATA/HORA]
Encontrei X conexões úteis: [lista]

Se não houver:
✅ Monitor Moltbot - [DATA/HORA]
Repositório monitorado. Nenhuma conexão nova identificada.
Status: Tudo atualizado!
```

---

## 📊 Clusters Identificados (Análise Inicial)

### 1. Compaction & Orphan Tool_Result
- Issues: #3462, #3528, #3455, #3479, #3436, #3425, #3298, #3225, #3208, #2955
- PRs: #3362, #3130, #3125, #3194, #3109, #2806

### 2. Cron & Heartbeat
- Issues: #3486, #3333, #3181, #3520, #3535, #3318, #3220, #3389, #2935, #2813
- PRs: #3335, #3548, #3329, #3420, #3396, #2990, #2183

### 3. UI Chat Tab
- Issues: #3414, #3413, #3412, #3367
- PRs: #3415, #3386, #3383, #3368

### 4. State Dir Migration (clawdbot → moltbot)
- Issues: #3533, #3545
- PRs: #3561, #3207, #3525

### 5. Discord
- Issues: #3464, #3228, #3549, #3308
- PRs: #3492

### 6. Slack
- Issues: #3327, #3519, #3526, #3471
- PRs: #3254, #3093, #2414

---

## 🚀 Comandos Úteis

### Verificar cron jobs ativos
```bash
# Via Moltbot
cron action=list
```

### Cancelar um job
```bash
cron action=remove jobId=<id>
```

### Executar job manualmente
```bash
cron action=run jobId=<id>
```

### Postar comentário manualmente
```bash
gh issue comment <num> --repo moltbot/moltbot --body 'comentário'
gh pr comment <num> --repo moltbot/moltbot --body 'comentário'
```

---

## 📈 Métricas de Sucesso

1. **Comentários postados** vs **planejados**
2. **Taxa de pulo** (quanto maior, mais conservador)
3. **Respostas recebidas** (engajamento da comunidade)
4. **PRs mergeados** que foram linkados

---

## 🔮 Evolução Futura

### Possíveis Melhorias
1. Detectar duplicatas automaticamente
2. Sugerir labels baseado em análise
3. Identificar issues stale que poderiam ser fechadas
4. Monitorar múltiplos repositórios
5. Dashboard web com métricas

### Transformar em Produto
- Empacotar como MCP Tool
- Criar skill reutilizável para Moltbot
- Publicar no ClawdHub/MoltHub

---

*Documento gerado pelo Researcher Agent em 2026-01-28*
