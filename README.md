<div align="center">
  <a href="https://ps-lang.dev">
    <img src="./ps-lang-logomark.png" alt="PS-LANG Logo" width="200"/>
  </a>

  <br/>
  <br/>

  # PS-LANG

  **Multi-Agent Context Control Language**

  Control what each AI agent sees in your workflows. Clean handoffs, accurate benchmarks, precise context flow.

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

  ---

  **→ [ps-lang.dev](https://ps-lang.dev) ←**

  ---
</div>

## What is PS-LANG?

PS-LANG is a context control syntax for multi-agent systems. It defines what each AI agent can see, read, or modify in agent pipelines—enabling clean handoffs, accurate benchmarking, and precise information flow between agents.

## Why is PS-LANG?

**The Problem:** Multi-agent workflows suffer from context contamination. Agent B inherits Agent A's internal reasoning, debug notes, and irrelevant data—polluting benchmarks and wasting tokens.

**The Solution:** PS-LANG creates clean context boundaries between agents.

- 🔒 **Clean Handoffs**: Pass only relevant context between agents
- 🎯 **Accurate Benchmarks**: Test agent performance without upstream hints
- 🎛️ **Granular Control**: Seven distinct context zones for different needs
- 🌐 **Universal**: Works with any AI/LLM platform

## Context Zones

🛡️ **Four Context Zones**

| Marker | Zone | Description |
|--------|------|-------------|
| `<.` | **Agent-Blind** | Completely invisible to ALL AI agents |
| `<#.` | **Read-Only** | AI can read but cannot modify |
| `<@.` | **Interactive** | Full AI interaction permitted |
| `<~.` | **Agent-Managed** | AI can autonomously modify |
| `<!.` | **Important** | High-priority agent attention |
| `<?.` | **Research** | Research and exploration zone |
| `</.` | **Dev** | Development and debugging notes |

## Auto-Tagged Commands

📋 **Simple Commands: `<.command argument >`**

Commands that automatically structure output with PS-LANG context zones.

```
.login          # Start your day
.daily          # Review schedule
.commit         # Create git commit
.blog           # Generate blog post
.journal        # Daily journal entry
.logout         # End session
.benchmark      # ...
```

## Use Cases

- **Agent Pipelines**: Research → Analysis → Writing workflows with clean context
- **Benchmark Testing**: Test agent performance without upstream contamination
- **Context Pruning**: Keep handoffs lean, reduce token waste
- **Role Separation**: Dev agents shouldn't see business strategy notes
- **MCP Integration**: Model Context Protocol agent chains
- **CI/CD Workflows**: Automated pipelines with agent-specific visibility

## Examples

### Agent Context Control

```javascript
function processPayment(amount) {
  <. TODO: Fix decimal bug - hidden from downstream agents >
  <#. Public: Handles payment processing >
  <@. Add error handling here >
  return amount * 100;
}
```

### Daily Journaling

```bash
<.journal mm-dd-yy-<topic>
<.blog mm-dd-yy-<topic|guide|research>
<#.blog mm-dd-yy-<topic|guide|research>

<#. Public: Reduced 12-hour task to 3 hours with AI >
<. Private: Still dealing with imposter syndrome >
<@. Generate blog post from today's learnings >
```

### Multi-Agent Pipeline

```javascript
// Research Agent (Agent A)
<. Internal research notes, raw data, debugging info >
This stays hidden from downstream agents

<#. Cleaned findings for Analysis Agent >
function analyzeData(input) {
  // Agent B receives only this clean context
  <@. Agent B workspace - can modify >
  return processedResults;
}

<~. Final output - managed by Agent C >
Generated report, autonomous updates
```

## Contributing

1. Fork repository
2. Create feature branch
3. Add tests
4. Submit PR

## License

MIT License - See [LICENSE](./LICENSE)

---

**Build cleaner agent pipelines. Control handoff context.**