# 🎨 BPMN Diagrams – PlantUML + Minimalist Setup

> Business process diagrams for **onboarding**, **sales**, and **sink** variants. Auto-generated from PlantUML sources.

## 🚀 Quick Start

### Prerequisites
- **pnpm** (only package manager)
- **PlantUML** CLI: `brew install plantuml`
- **Python 3** (for local serving)
- **nvm** (Node version management)

### Setup

```bash
# Install dependencies (pnpm only)
pnpm i

# Build SVG diagrams
pnpm build

# Serve diagrams locally
pnpm serve
```

## 📦 Project Structure

```
.
├── diagrams/
│   ├── onboarding.puml         # Onboarding process (dual-path)
│   ├── sales.puml              # Thinkport sales process
│   ├── sink.puml               # Sink variant (test)
│   └── build/                  # Generated SVGs (*.svg)
├── scripts/
│   └── build-diagrams.js       # PlantUML → SVG builder
├── FLOW_VISUALIZATION.md       # Embedded diagrams + docs
├── VALIDATION_REPORT.md        # Flow validation analysis
├── VALIDATION_CHECKLIST.md     # Reusable validation framework
├── package.json                # pnpm configuration
└── .npmrc                       # pnpm settings
```

## 🛠 Scripts

| Command | Purpose |
|---------|---------|
| `pnpm build` | Generate SVGs from `.puml` files |
| `pnpm clean` | Remove `diagrams/build/` |
| `pnpm serve` | Serve SVGs on http://localhost:8000 |

## 📋 Workflows

### Generate Diagrams
```bash
pnpm build
# Output: diagrams/build/*.svg
```

### Edit & Rebuild
1. Edit `diagrams/*.puml`
2. Run `pnpm build`
3. SVGs auto-refresh in browser if serving

### View Locally
```bash
pnpm serve
# http://localhost:8000 → browse SVGs
```

## 📝 Package Manager: pnpm

**Why pnpm only?**
- No npm/yarn lock files
- Minimal dependencies (Node.js scripts only)
- Faster installs
- Strict dependency resolution

**Always use:**
```bash
pnpm i      # Install
pnpm add    # Add packages
pnpm remove # Remove packages
```

**Never use:**
```bash
npm install     # ❌
yarn install    # ❌
npm update      # ❌
```

## 🔧 Configuration

### .npmrc
```ini
shamefully-hoist=true          # Flatten node_modules
save-workspace-protocol=false  # pnpm workspace protocol
```

### Node.js
- Managed by **nvm** (`.nvmrc` not required, uses system default)
- Works with Node 20+

## 🎯 BPMN Processes

### 1. Onboarding (onboard.bpmn)
- **Type:** Single-pool, dual-path routing
- **Paths:** Timer-based vs Subprocess-based
- **Status:** ✅ Validated & fixed (subprocess exit flow added)

### 2. Thinkport Sales (thinkport-sales-prozess.bpmn)
- **Type:** Multi-pool collaboration
- **Message Flows:** 3 (Angebot, Auftrag, Ablehnung)
- **Gateways:** Binary qualification & response gates
- **Status:** ✅ Validated

### 3. Sink Variant (thinkport-sales-prozess-sink.bpmn)
- **Type:** Identical to #2 (test variant)
- **Purpose:** Validation & separate environment testing
- **Status:** ✅ Validated

---

**See [FLOW_VISUALIZATION.md](./FLOW_VISUALIZATION.md) for embedded diagrams.**

**See [VALIDATION_REPORT.md](./VALIDATION_REPORT.md) for detailed flow analysis.**
