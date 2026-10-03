---
name: network-text-analysis
description: "Analyze text, discourse, or knowledge using network/graph thinking. Identifies structural gaps between topic clusters as spaces for novel ideas. Diagnoses discourse state (biased/focused/diversified/dispersal) and steers toward cognitive variability. Use when: (1) analyzing a document/article for blind spots, (2) finding content gaps in SEO or research, (3) diagnosing why a text feels one-sided or scattered, (4) generating research questions from existing knowledge, (5) comparing multiple texts for overlap/differences, (6) building knowledge graphs from notes, (7) improving writing coherence, (8) brainstorming by bridging disconnected idea clusters."
---

# Network Text Analysis

Think of any text as a network: **words are nodes, co-ocurrences are edges**. Apply graph theory to find patterns, gaps, and structure invisible to linear reading.

## Core Algorithm (4 Steps)

### 1. Extract the Network

From any text, extract:
- **Nodes**: Key concepts (nouns, noun phrases, named entities). Remove stopwords.
- **Edges**: Co-occurrence within a sentence or sliding window (4-gram). Weight = frequency.
- **Output**: Adjacency list or edge table: `(concept_a, concept_b, weight)`

### 2. Detect Topical Clusters

Group nodes that co-occur frequently into clusters. Each cluster = a主题/topic.

Heuristic without formal modularity: group nodes that share more edges with each other than with outsiders. Identify 3-7 clusters.

### 3. Rank by Betweenness Centrality

Nodes that bridge multiple clusters have HIGH betweenness centrality. These are:
- The most "influential" concepts
- Pathways for meaning circulation
- Entry points into the discourse

Simple proxy: count how many clusters a node's neighbors span.

### 4. Find Structural Gaps

Identify cluster pairs that are **distant but could connect**. These gaps are:
- Blind spots in the discourse
- Spaces where novel ideas emerge
- Research question generators

A gap exists when two clusters share NO or FEW direct connections but a bridging node could link them.

## The 4 Cognitive States

Diagnose the discourse structure to determine which state it's in:

| State | Signature | Problem | Fix |
|-------|-----------|---------|-----|
| **Biased** | 1 dominant concept, everything orbits it | Tunnel vision, obsession | Introduce perspectives from other clusters |
| **Focused** | Dense coherent cluster, clear narrative | Saturation, diminishing returns | Surface latent topics, bridge to other clusters |
| **Diversified** | Multiple distinct clusters with visible gaps | Analysis paralysis | Consolidate around one path OR bridge gaps |
| **Dispersed** | Weak connections, fragmented, scattered | Incoherence, anxiety | Anchor to highest-betweenness node |

**Cycle**: Biased → Focused → Diversified → Dispersed → Biased (healthy variability)

**Pathological**: Dwelling too long in ANY state. Recovery comes from transitions, not persistence.

## Practical Workflows

### Analyze a Document

1. Read the text. Extract 15-30 key concepts.
2. Build co-occurrence matrix (which concepts appear together).
3. Cluster into 3-5 topic groups.
4. Identify the top 3-5 bridging concepts (high betweenness).
5. Find gaps: which clusters lack connections?
6. Generate 2-3 research questions that bridge the gaps.
7. Diagnose state: biased? focused? diversified? dispersed?

### Find Content Gaps (SEO/Research)

1. Analyze existing content (yours + competitors).
2. Map what topics are covered (clusters).
3. Identify what's MISSING (gaps between clusters).
4. Generate content ideas that bridge those gaps.
5. Questions to answer: "What do people search for that nobody covers?"

### Compare Two Texts

1. Extract networks from both texts.
2. Find OVERLAP: shared concepts and clusters.
3. Find DIFFERENCE: concepts/clusters unique to each.
4. The unique parts = differentiating perspectives.
5. The overlap = common ground.

### Improve Writing Coherence

1. Extract concepts from draft.
2. Check: are ideas clustered or scattered?
3. If dispersed: add transitional concepts between clusters.
4. If biased: develop underrepresented clusters.
5. If focused: check for saturation — diversify.
6. Goal: diversified state with bridged gaps.

### Brainstorm from Gaps

1. Start with existing knowledge (a text, notes, research).
2. Extract network and find structural gaps.
3. For each gap: "What would connect these two clusters?"
4. Generate 5 wild ideas per gap.
5. Filter: which ideas are novel AND feasible?

## Quick Reference

See `references/methodology.md` for:
- Formal betweenness centrality calculation
- Community detection algorithm details
- Structural gap detection pseudocode
- Cognitive state transition rules
- Network analysis MCP tool catalog (if available)

## Key Insight

**Most creative insights live in gaps between established patterns.** Linear reading hides these gaps. Network analysis reveals them. The goal is not efficiency — it's cognitive variability: the ability to shift between focused depth and exploratory breadth, never dwelling too long in any single mode.
