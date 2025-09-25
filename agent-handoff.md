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

**Example**
```ps
function authenticate(user, password) {
  </. TODO: handle edge case for null passwords >
  <#. Using bcrypt with salt rounds = 10 >
  <@. Check for timing attack risks >
  return bcrypt.compare(password, user.hashedPassword);
}