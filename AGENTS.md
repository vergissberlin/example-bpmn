# Agent Rules for BPMN Diagrams Project

## 📋 Core Principles

This file defines rules that guide AI agents (like Copilot) when working with this project.

---

## 🛠 Package Manager Rules

### ✅ DO
- **Always use `pnpm`** for all package operations
  - `pnpm i` - Install dependencies
  - `pnpm add <package>` - Add packages
  - `pnpm remove <package>` - Remove packages
  - `pnpm build` - Build diagrams

### ❌ DON'T
- Never use `npm install` ❌
- Never use `yarn install` ❌
- Never use `npm update` ❌
- Never run global `pip install` or `pip3 install` ❌
- Don't create virtual environments without asking ❌

---

## 🎨 Diagram Build Rules

### Build Process
1. Edit `.puml` files in `diagrams/` directory
2. Run `pnpm build` to generate SVGs
3. SVGs output to `diagrams/build/`
4. Verify SVG generation with `ls diagrams/build/`

### PlantUML Syntax Requirements
- Use **activity diagram** syntax (not sequence, not class)
- Valid start/end: `(*)` and `([end])`
- Valid activities: `:Activity Name;`
- Valid gateways: `if (...) then ... else ... endif`
- Valid forks: `fork / fork_again ... end fork`
- **Forbidden**: `note bottom...end note` (removed from all .puml files)
- **Forbidden**: mxgraph stencil syntax (e.g., `<<ENTITY>>`, `mxgraph.bpmn.*`)

### File Naming
- `.puml` files: lowercase with hyphens (e.g., `onboarding.puml`, `sales.puml`)
- SVG outputs: Title Case with spaces (e.g., `Onboarding Process.svg`)

---

## ✅ BPMN Validation Rules

### Before Committing BPMN Files
1. **Validate flow logic**
   - Every task/subprocess must have incoming AND outgoing flows
   - No dead-end paths (processes must reach End Event)
   - All gateways must have proper branches

2. **Common bugs to check**
   - Subprocess with no outgoing flow ❌
   - Fork/fork-again without converging ❌
   - Multiple incoming flows without join gateway ❌

3. **Use VALIDATION_REPORT.md** for flow analysis

---

## 📖 Documentation Rules

### Embedding SVGs
- SVGs are embedded in `FLOW_VISUALIZATION.md` using Markdown image syntax
- Path format: `![Description](./diagrams/build/Filename.svg)`
- URL-encode spaces: `Sales%20Process.svg`
- Always regenerate after editing `.puml` files

### Documentation Files
- `README.md` - Setup & quick start
- `FLOW_VISUALIZATION.md` - Embedded diagrams + narrative
- `VALIDATION_REPORT.md` - Flow analysis & bug findings
- `VALIDATION_CHECKLIST.md` - Reusable validation framework

---

## 🔧 Development Workflow

### Typical Session
```bash
# 1. Edit a .puml file in diagrams/
# 2. Build
pnpm build

# 3. Verify SVG generated
ls diagrams/build/

# 4. Update FLOW_VISUALIZATION.md with new SVGs
# 5. Commit all changes
git add .
git commit -m "Update diagrams: [description]"

# 6. Optional: serve locally
pnpm serve
# Visit: http://localhost:8000
```

### Cleanup
```bash
pnpm clean     # Remove diagrams/build/
```

---

## 🚀 Commands Reference

| Command | Purpose |
|---------|---------|
| `pnpm build` | Generate SVGs from `.puml` files |
| `pnpm clean` | Remove all generated SVGs |
| `pnpm serve` | Serve diagrams on http://localhost:8000 |
| `pnpm i` | Install dependencies |

---

## 🎯 Project Structure Rules

### Immutable Directories
- `diagrams/*.puml` - Source files (edit these)
- `diagrams/build/` - Generated SVGs (auto-created, don't edit)
- `scripts/build-diagrams.js` - Build script (don't modify without reason)

### Configuration
- `.npmrc` - pnpm settings (don't remove)
- `package.json` - Only edit scripts, no dependencies
- `pnpm-lock.yaml` - Lock file (commit, don't edit manually)

---

## 🔐 Dependencies Rule

**This project has ZERO npm/pnpm dependencies.**

- PlantUML is installed globally via Homebrew (`brew install plantuml`)
- Python 3 is required for serving (`pnpm serve`)
- nvm manages Node version (no version constraint needed)
- Scripts are plain Node.js (no third-party npm packages)

### When Adding Packages
1. ❌ Don't add unless absolutely necessary
2. If required: Use `pnpm add <package>`
3. Commit `pnpm-lock.yaml` after adding

---

## 📝 Commit Message Format

```
feat: [description]          # New diagrams or features
fix: [description]           # Bug fixes in BPMN or flow
docs: [description]          # Documentation updates
refactor: [description]      # Restructure without changing logic
ci: [description]            # Build/workflow changes
```

Examples:
- `feat: add customer retention process diagram`
- `fix: add missing exit flow in onboarding subprocess`
- `docs: embed new sales process SVG`

---

## 🚨 Emergency Rules

### If SVGs Don't Generate
1. Check PlantUML is installed: `which plantuml`
2. Run build with verbose output: `node scripts/build-diagrams.js`
3. Validate `.puml` syntax in files
4. Check for forbidden syntax (note blocks, mxgraph)

### If Build Fails
1. Never force commit broken state
2. Check exit codes from `pnpm build`
3. Review error messages in build output
4. Fix `.puml` files before retrying

### If pnpm Fails
1. Delete `pnpm-lock.yaml` only if corrupted
2. Run `pnpm i` to reinstall
3. Never use npm/yarn as fallback
4. Report pnpm version used: `pnpm --version`

---

## ✨ Best Practices

- **Always run `pnpm build` after editing `.puml` files**
- **Keep diagrams readable** - use meaningful activity names
- **Validate BPMN logic** before committing
- **Embed SVGs immediately** after generation
- **Document process intent** in comments within `.puml`
- **Test locally** with `pnpm serve` before final commit

---

**Last Updated:** 2026-07-21  
**Project:** BPMN Diagrams + PlantUML Pipeline  
**Status:** Production-ready, pnpm-only
