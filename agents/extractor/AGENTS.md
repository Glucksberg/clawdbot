# AGENTS.md - Extractor Workspace

Agente para extração de dados de cargas de grãos via OCR.

## Fluxo

1. **Input**: Fotos do grupo WhatsApp "Transporte Contasul"
2. **Processamento**: Visão + OCR para extrair dados
3. **Output**: Mensagens formatadas no Telegram com botões de confirmação

## Arquivos

- `data/cargas.csv` - Dados das cargas (append)
- `data/cargas.json` - Backup em JSON
- `reports/` - Relatórios gerados (PDF, CSV, Excel)
- `memory/` - Logs diários

## Regras

- **NUNCA** responda no WhatsApp
- **TODO** output vai para o Telegram
- Use botões inline para confirmação
- Timeout de 3h auto-aceita a carga

## Segurança

- Não exponha dados pessoais fora do contexto
- Mantenha backup dos dados
