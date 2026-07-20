# ✅ BPMN Flow Validation Checklist

**Zweck:** Schnelle Validierungsroutine für BPMN-Prozesse  
**Projekt:** Thinkport BPMN Suite  
**Zuletzt aktualisiert:** 2026-07-21

---

## 🔍 Pre-Flight Checks

- [x] **XML Well-Formed** — File öffnet sich ohne Parse-Fehler
- [x] **Namespaces korrekt** — bpmn2, bpmndi, dc, di vorhanden
- [x] **Collaboration/Process** — Struktur erkannt

---

## 🔗 Flow-Konnektivität

### Start Events

- [x] Genau **1 Start Event pro Process/Lane**
- [x] Start Event hat **nur outgoing flows** (kein incoming)
- [x] Start Event `<bpmn2:outgoing>` definiert

### End Events

- [x] **Minimum 1 End Event** pro Process
- [x] Alle End Events **haben incoming flows**
- [x] End Events **keine outgoing flows**
- [x] Jeder flow führt irgendwann zu einem End Event

### Intermediate Events

- [x] **Incoming UND Outgoing flows** vorhanden
- [x] Keine „hanging" Intermediate Events
- [x] Timer/Message/Signal Events korrekt typisiert

### Tasks & Subprocesses

- [x] Alle Tasks haben **1+ incoming** und **1+ outgoing flow**
- [x] Subprocesses haben **outgoing flow** (nicht orphaned!)
- [x] Keine Task ohne Ein/Ausgang

### Gateways

- [x] Exclusive Gates haben **2+ outgoing flows** (branching)
- [x] Parallel Gates haben **gleiche Anzahl** In/Out
- [x] Alle Gateway-Branches **konvergieren wieder**
- [x] Keine "dead ends" bei gateways

---

## 📤 Sequenz-Flows

```
Für jeden <bpmn2:sequenceFlow id="...">:
  
  ✅ sourceRef existiert als Element
  ✅ targetRef existiert als Element  
  ✅ sourceRef hat <outgoing>...(Flow-ID)</outgoing>
  ✅ targetRef hat <incoming>...(Flow-ID)</incoming>
  ✅ Keine Zirkelbezüge (A→B→C→A)
  ✅ Kein Flow zu Start Event
  ✅ Kein Flow von End Event
```

**Für onboard.bpmn validiert:**

- _87E28189... (Start → Bewerber:in) ✅
- _454664BC... (Bewerber:in → Create Ticket) ✅
- _EDF65A59... (Create Ticket → Timer) ✅
- _0B3FDBBB... (Create Ticket → Subprocess) ✅
- _9C1F2A8B... (Subprocess → Ende) ✅ **[HINZUGEFÜGT]**
- _37D85CF2... (Timer → Message) ✅
- _1C6039A9... (Message → Ende) ✅

---

## 💬 Message Flows (Multi-Pool)

```
Für jeden <bpmn2:messageFlow>:
  
  ✅ Quelle = Element in Pool A
  ✅ Ziel = Element in Pool B
  ✅ Quelle ist Event/Task mit message-Semantik
  ✅ Ziel ist entsprechendes message-Event
  ✅ Entsprechende <bpmn2:message> definiert
```

**Für thinkport-sales-prozess.bpmn validiert:**

- Message "Angebot" (Thinkport → Kunde) ✅
- Message "Auftrag" (Kunde → Thinkport) ✅
- Message "Ablehnung" (Kunde → Thinkport) ✅

---

## 🔄 Subprocess-Validierung

```
Für jeden <bpmn2:subProcess>:
  
  ✅ Hat <incoming> Flow(s)
  ✅ Hat <outgoing> Flow(s) [CRITICAL!]
  ✅ Interne Flows vollständig definiert
  ✅ Interne Start → End Events vorhanden
  ✅ Subprocess keine orphaned Elements
  ✅ Exit-Flow lead zur Main Process
```

**Für onboard.bpmn Sub-Process validiert:**

- ID: _DC16D8E0-1C07-4969-98F3-C6464BD91E27
- ✅ Incoming: _0B3FDBBB... (von Create Ticket)
- ✅ Outgoing: _9C1F2A8B... (zu Ende) **[KORRIGIERT]**
- ✅ Interne: Task → Timer → Signal → End
- ✅ Subprocess-Exit funktioniert

---

## 🎯 Lane & Pool Validierung

- [x] Pool-Elemente in Lanes organisiert
- [x] Flows innerhalb/zwischen Lanes korrekt
- [x] Lane-Nesting logisch (max 2-3 Ebenen)
- [x] Keine „floating" Elemente außerhalb Lanes

**Status:**

- onboard.bpmn: 1 Lane (_5782405C...) ✅
- thinkport-*.bpmn: 2 Pools, je 1-2 Lanes ✅

---

## 📍 Visuelle/Koordinaten-Validierung

- [x] **BPMNShape** für alle Elements vorhanden
- [x] **BPMNEdge** für alle Flows vorhanden
- [x] **Koordinaten sinnvoll** (nicht über alle Grenzen verstreut)
- [x] **Lane-Bounds** enthalten alle Elements
- [x] Keine **negative Koordinaten** (bei bestimmten Tools problematisch)

**Für onboard.bpmn optimiert:**

- Start Event: (150, 119) ✅
- Tasks: (240-594, 96-198) ✅
- Subprocess: (620, 20) - (1120, 220) ✅
- End Events: (460, 250) ✅

---

## 🚨 Häufige Fehler (Warning Signs)

| Fehler | Symptom | Lösung |
|--------|---------|--------|
| **Orphaned Subprocess** | `<outgoing>` fehlt | Flow zum nächsten Element hinzufügen |
| **Dead-end Task** | Task hat nur `<incoming>` | Outgoing Flow definieren |
| **Broken Gateway** | Gateway mit nur 1 Branch | 2. Branch hinzufügen |
| **Floating Element** | Element außerhalb Lanes | In Lane verschieben |
| **Circular Flow** | A→B→A | Abhängigkeit neu strukturieren |
| **Unreachable End** | End Event ohne `<incoming>` | Flows konvergieren lassen |

---

## 📋 Validierungs-Protokoll

### Datei: `onboard.bpmn`

```
Status: ⚠️ FEHLER GEFUNDEN

[✅] XML Structure
[✅] Namespaces
[❌] Subprocess Exit Flow (CRITICAL)
[✅] Task Konnektivität
[✅] Event Definition
[✅] Sequence Flows (nach Korrektur)
[✅] Visual Layout

Korrektionen: 1 flow hinzugefügt
Validation: PASS nach Korrektur
```

### Datei: `thinkport-sales-prozess.bpmn`

```
Status: ✅ VALID

[✅] XML Structure
[✅] Namespaces
[✅] Multi-Pool Layout
[✅] Message Flows
[✅] Gateway Branching
[✅] Sequence Flows
[✅] Visual Layout

Korrektionen: 0
Validation: PASS
```

### Datei: `thinkport-sales-prozess-sink.bpmn`

```
Status: ✅ VALID

[✅] XML Structure
[✅] Namespaces
[✅] Multi-Pool Layout
[✅] Message Flows
[✅] Gateway Branching
[✅] Sequence Flows
[✅] Visual Layout

Korrektionen: 0
Validation: PASS
```

---

## 🔄 Wiederholungs-Checkliste

Für zukünftige Validierungen Punkt für Punkt durchgehen:

- [ ] Alle 3 Dateien vorhanden
- [ ] XML Parse OK
- [ ] 1x Start Event pro Process ✓
- [ ] Alle Paths führen zu End Event ✓
- [ ] Keine orphaned Elements ✓
- [ ] Message Flows (bei Multi-Pool) korrekt ✓
- [ ] Gateways haben Branches ✓
- [ ] Subprocess haben Exit-Flows ✓
- [ ] BPMNShape/Edge vorhanden ✓
- [ ] Koordinaten sinnvoll ✓
- [ ] Dokumentation aktualisieren ✓

---

## 📞 Kontakt & Eskalation

**Bei Fehlern:**

1. In `VALIDATION_REPORT.md` nachschlagen
2. In `FLOW_VISUALIZATION.md` Diagram anschauen
3. In XML nach `<bpmn2:sequenceFlow>` suchen
4. Source/Target verifizieren

**Kritische Fehler escalieren zu:**

- BPMN Modeler: Re-design in jBPM/bpmn-js
- DevOps: Layout- und Koordinaten-Re-organization
- QA: Subprocess-Testing

---

## 📚 Ressourcen

- **Skil**: `/Users/andrelademann/Test/bpmn/bpnm-example/.agents/skills/bpmn/SKILL.md`
- **Visualisierung**: `FLOW_VISUALIZATION.md` (PlantUML)
- **Report**: `VALIDATION_REPORT.md` (Detaillierte Analyse)
- **Dateien**: `*.bpmn` (XML-Format)

---

**Zuletzt validiert:** 2026-07-21  
**Nächste Validierung:** Nach Major Changes  
**Version:** 1.0
