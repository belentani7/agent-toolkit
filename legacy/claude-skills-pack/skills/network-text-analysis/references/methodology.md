# Methodology Reference

## Formal Betweenness Centrality

For node v:

```
BC(v) = Σ(σ_st(v) / σ_st)
```

Where:
- σ_st = total shortest paths from s to t
- σ_st(v) = shortest paths from s to t passing through v

**Interpretation**: High BC nodes are bridges between clusters. They control information flow.

**Quick approximation without formal calculation**:
1. For each node, count how many distinct clusters its neighbors belong to.
2. Nodes touching 3+ clusters = high betweenness candidates.

## Community Detection (Modularity)

Modularity Q measures how well a partition into communities captures excess internal density:

```
Q = (1/2m) Σ_ij [A_ij - (k_i * k_j / 2m)] δ(c_i, c_j)
```

Where:
- A_ij = edge weight between i and j
- k_i = degree of node i
- m = total edge weight
- δ(c_i, c_j) = 1 if i,j in same community

**Practical heuristic**: Louvain algorithm (greedy modularity optimization). Available in NetworkX, igraph, graphology.

## Structural Gap Detection

```
1. Run community detection → get clusters C1, C2, ..., Cn
2. For each cluster pair (Ci, Cj):
   a. Count inter-cluster edges E(Ci, Cj)
   b. If E(Ci, Cj) < threshold (e.g., 10% of intra-cluster edges):
      → GAP detected between Ci and Cj
3. For each gap, find candidate bridging nodes:
   a. Nodes in Ci that have neighbors in Cj's neighborhood
   b. Or nodes with high BC that sit between Ci and Cj
4. Generate bridging questions:
   "How does [concept from Ci] relate to [concept from Cj]?"
```

## Cognitive State Transitions

```
BIASED → FOCUSED: Develop the dominant cluster, add adjacent concepts
FOCUSED → DIVERSIFIED: Introduce smaller clusters, bridge gaps
DIVERSIFIED → DISPERSED: Break connections, bring in outside concepts
DISPERSED → BIASED: Anchor to highest-BC node, rebuild focus

Shortcut paths (figure-8 pattern):
BIASED ↔ FOCUSED (building loop)
DIVERSIFIED ↔ DISPERSED (exploring loop)
Cross-point: shift between building and exploring
```

## Dwelling Thresholds

| State | Safe Duration | Risk After |
|-------|--------------|------------|
| Biased | 2-3 exchanges | Obsessive rigidity |
| Focused | 3-5 exchanges | Saturation fatigue |
| Diversified | 4-7 exchanges | Analysis paralysis |
| Dispersed | 2-4 exchanges | Confusion/anxiety |

## MCP Tool Catalog (when available)

If a network analysis MCP server is connected, use these tools:

| Tool | Use For |
|------|---------|
| `generate_knowledge_graph` | Text → graph |
| `generate_content_gaps` | Structural gap detection |
| `generate_topical_clusters` | Community detection |
| `optimize_text_structure` | State diagnosis (returns diversity score) |
| `develop_latent_topics` | Surface underrepresented ideas |
| `develop_conceptual_bridges` | Cross-domain connections |
| `generate_research_questions` | Gap-bridging questions |
| `analyze_google_search_results` | SEO supply analysis |
| `search_queries_vs_search_results` | SEO demand vs supply gaps |

## Python Implementation Skeleton

```python
import networkx as nx
from collections import Counter

def text_to_network(text, window=4):
    """Convert text to co-occurrence network."""
    words = preprocess(text)  # tokenize, lemmatize, remove stopwords
    G = nx.Graph()
    
    for i, word in enumerate(words):
        for j in range(i+1, min(i+window, len(words))):
            if G.has_edge(word, words[j]):
                G[word][words[j]]['weight'] += 1
            else:
                G.add_edge(word, words[j], weight=1)
    
    return G

def find_clusters(G, method='louvain'):
    """Detect topical clusters."""
    if method == 'louvain':
        from community import community_louvain
        return community_louvain.best_partition(G)
    elif method == 'label_prop':
        return nx.algorithms.community.label_propagation_communities(G)

def find_bridging_nodes(G, partition):
    """Find nodes with high betweenness that bridge clusters."""
    bc = nx.betweenness_centrality(G, weight='weight')
    # Rank by betweenness, filter to top candidates
    return sorted(bc.items(), key=lambda x: -x[1])[:10]

def find_gaps(G, partition):
    """Find cluster pairs with few inter-cluster edges."""
    clusters = {}
    for node, cluster in partition.items():
        clusters.setdefault(cluster, []).append(node)
    
    gaps = []
    cluster_ids = list(clusters.keys())
    for i in range(len(cluster_ids)):
        for j in range(i+1, len(cluster_ids)):
            inter_edges = sum(
                1 for u in clusters[cluster_ids[i]]
                for v in clusters[cluster_ids[j]]
                if G.has_edge(u, v)
            )
            intra_i = G.subgraph(clusters[cluster_ids[i]]).number_of_edges()
            intra_j = G.subgraph(clusters[cluster_ids[j]]).number_of_edges()
            ratio = inter_edges / max(intra_i + intra_j, 1)
            if ratio < 0.1:  # gap threshold
                gaps.append({
                    'cluster_a': cluster_ids[i],
                    'cluster_b': cluster_ids[j],
                    'inter_edges': inter_edges,
                    'ratio': ratio
                })
    return gaps

def diagnose_state(G, partition):
    """Diagnose cognitive state from network structure."""
    modularity = nx.algorithms.community.modularity(
        G, 
        [set([n for n,c in partition.items() if c == k]) for k in set(partition.values())]
    )
    n_clusters = len(set(partition.values()))
    
    if n_clusters <= 2 and modularity < 0.3:
        return 'biased'
    elif modularity < 0.5:
        return 'focused'
    elif modularity < 0.7:
        return 'diversified'
    else:
        return 'dispersed'
```
