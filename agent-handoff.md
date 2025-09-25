# PS-LANG: Agent Handoff Instructions

## Purpose
PS-LANG defines a structured way to control what different AI agents can **see**, **read**, or **modify** during collaboration.  
This handoff document ensures seamless switching between platforms and agents.

---

## Privacy Zone Markers

| Marker | Name                     | Agent Permissions                          |
|--------|--------------------------|---------------------------------------------|
| `</.`  | Agent-Blind              | Invisible to all agents (human-only)        |
| `<#.`  | Agent-Visible Read-Only  | Agents can read, cannot modify              |
| `<@.`  | Agent-Interactive        | Agents can read and write                   |
| `<~.`  | Agent-Managed            | Agents can autonomously modify/maintain     |
