# Banyan Bench Methodology: Mutation Drift Protection

## The Challenge
The Banyan Bench dataset measures how often LLMs hallucinate database fields or ignore constraints when mutating data. Traditional architectures fail because the LLM only sees the OpenAPI schema, which often lacks precision (e.g. dropping complex regex constraints).

## How CanonFlow Fixes It
CanonFlow injects mathematically verified constraints directly into the LLM's context window via the **Agent-Native OKF Catalog**.

### 1. Extraction and NNF Normalization
CanonFlow extracts the schema and normalizes every `pg_constraint` into Negation Normal Form (NNF).

### 2. OKF Catalog Generation
The catalog emitted by CanonFlow includes an `aiLineage` object. It provides:
- The exact `CHECK` strings.
- The mathematically proven Lineage Grade (e.g., "Exact").
- `safeQueries` templates that the LLM can use instead of guessing parameter structures.

### 3. Measuring the Banyan Score
When we evaluate agents using CanonFlow-generated catalogs against the Banyan benchmark:
- **Hallucinated inserts drop to near zero** because the agent has the exact schema limits.
- **Drift is transparent** because CanonFlow's Drift Engine pre-warns the developer if an OpenAPI schema cannot accurately represent the DB rule, prompting human intervention *before* the AI is unleashed.

This document serves as the official methodology for CanonFlow's performance against Banyan Bench.
