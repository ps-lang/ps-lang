# Contributing to PS-LANG

Thank you for your interest in contributing to PS-LANG! This document outlines our development standards and workflows.

---

## 🎯 TypeScript Strict Mode Policy

**Status:** ✅ Strict mode enabled (2025-10-07)

PS-LANG maintains **TypeScript strict mode** to ensure type safety, prevent runtime errors, and improve developer experience.

### Why Strict Mode?

- **Type Safety:** Catch bugs at compile-time, not runtime
- **Better IntelliSense:** Improved auto-completion and refactoring
- **Self-Documenting Code:** Types serve as inline documentation
- **Prevents `any` Proliferation:** Forces explicit typing

### Strict Flags Enabled

```json
{
  "compilerOptions": {
    "strict": true  // Enables all strict type-checking options
  }
}
```

The `strict: true` flag enables:
- `noImplicitAny` - Variables must have explicit types
- `strictNullChecks` - Null/undefined must be handled explicitly
- `strictFunctionTypes` - Function parameters are checked contravariantly
- `strictPropertyInitialization` - Class properties must be initialized
- `strictBindCallApply` - Enforces correct `bind`, `call`, `apply` usage
- `noImplicitThis` - `this` must have explicit type
- `alwaysStrict` - Parse files in ES strict mode

---

## 🛠️ Development Workflow

### Before You Start

1. **Install dependencies:**
   ```bash
   cd ps-lang.dev
   npm install
   ```

2. **Run validation locally:**
   ```bash
   npm run validate  # Runs typecheck + lint
   ```

### Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (runs validate first) |
| `npm run typecheck` | Check TypeScript types |
| `npm run lint` | Run ESLint |
| `npm run format` | Auto-fix linting issues |
| `npm run validate` | Run typecheck + lint (required before push) |

---

## 📝 Code Quality Standards

### TypeScript Guidelines

#### ✅ DO:
```typescript
// Use explicit types for function parameters
function processUser(user: User, options: ProcessOptions): Result {
  return { success: true, data: user }
}

// Use optional chaining for nullable values
const email = user?.profile?.email ?? 'no-email@example.com'

// Use type guards for union types
function isError(result: Success | Error): result is Error {
  return 'error' in result
}

// Use readonly for immutable data
interface Config {
  readonly apiKey: string
  readonly endpoints: readonly string[]
}
```

#### ❌ DON'T:
```typescript
// DON'T use `any`
function badFunction(data: any) { // ❌ Use specific type
  return data.value
}

// DON'T ignore null checks
const value = user.email.toLowerCase() // ❌ User might be null

// DON'T use non-null assertion unless absolutely necessary
const email = user!.email! // ❌ Handle null cases explicitly

// DON'T disable strict mode
// @ts-ignore  // ❌ Fix the type error instead
const result = dangerousOperation()
```

### Resolving Common Strict Mode Errors

#### Error: `Object is possibly 'null' or 'undefined'`

**Bad:**
```typescript
function getUserEmail(user: User | null) {
  return user.email  // ❌ Error: Object is possibly 'null'
}
```

**Good:**
```typescript
function getUserEmail(user: User | null) {
  return user?.email ?? 'no-email'  // ✅ Safe navigation
}

// Or with type guard
function getUserEmail(user: User | null): string {
  if (!user) return 'no-email'
  return user.email  // ✅ TypeScript knows user is not null
}
```

#### Error: `Parameter 'x' implicitly has an 'any' type`

**Bad:**
```typescript
function process(data) {  // ❌ Implicit 'any'
  return data.value
}
```

**Good:**
```typescript
interface Data {
  value: string
}

function process(data: Data) {  // ✅ Explicit type
  return data.value
}

// Or use generics for flexibility
function process<T extends { value: string }>(data: T) {
  return data.value
}
```

#### Error: `Type 'X' is not assignable to type 'Y'`

**Bad:**
```typescript
const config: Config = loadConfig()  // ❌ Type mismatch
```

**Good:**
```typescript
// Option 1: Fix the type
const config: Config = loadConfig() as Config

// Option 2: Use type guard
function isValidConfig(data: unknown): data is Config {
  return typeof data === 'object' && data !== null && 'apiKey' in data
}

const rawConfig = loadConfig()
if (isValidConfig(rawConfig)) {
  const config: Config = rawConfig  // ✅ Type is validated
}

// Option 3: Use Zod for runtime validation (recommended for external data)
import { z } from 'zod'

const ConfigSchema = z.object({
  apiKey: z.string(),
  endpoints: z.array(z.string())
})

const config = ConfigSchema.parse(loadConfig())  // ✅ Runtime + compile-time safety
```

---

## 🚫 Suppression Policy

**Only use `@ts-expect-error` when:**
1. You're dealing with a third-party library bug
2. The type error is a false positive
3. Fixing it would require architectural changes (document in issue)

**Format:**
```typescript
// @ts-expect-error - STRICT#42: Legacy API returns untyped response, migration planned for Q1 2026
const legacyData = await legacyApi.getData()
```

**Rules:**
- ✅ Must include `STRICT#<number>` tag
- ✅ Must include rationale
- ✅ Must link to issue if long-term suppression
- ❌ Never use `// @ts-ignore` (doesn't require type error to exist)

---

## 🔄 CI/CD Quality Gates

All pull requests must pass:

1. **TypeScript Type Check:** `npm run typecheck`
2. **ESLint:** `npm run lint`
3. **Build:** `npm run build`

The CI workflow runs automatically on push and will **block merges** if validation fails.

### Local Validation

Before pushing, run:
```bash
npm run validate  # Runs typecheck + lint
npm run build     # Ensures production build works
```

---

## 📚 Additional Resources

- [TypeScript Handbook - Strict Mode](https://www.typescriptlang.org/docs/handbook/2/strict-mode.html)
- [TypeScript Deep Dive - Type Guards](https://basarat.gitbook.io/typescript/type-system/typeguard)
- [Zod - Runtime Type Validation](https://zod.dev/)

---

## 🆘 Getting Help

- **Type errors?** Check the "Resolving Common Strict Mode Errors" section above
- **Unclear type?** Use `typeof` in VS Code to see inferred types
- **Still stuck?** Open an issue with the error message and code snippet

---

**Last Updated:** 2025-10-07
**Strict Mode Status:** ✅ Enabled
**TypeScript Version:** 5.x
