# [CanonFlow-04] Implement VerdictEnvelope and Canonical JSON Emission

## Context
In GSTFlow, the "One-Engine Law" required us to prove that the exact same inputs yielded the exact same validation output across Native AOT and Fable WASM. We achieved this by defining a `VerdictEnvelope` and strict JSON serialization (omitting nulls, deterministically sorting keys).

## Objective
Adopt `VerdictEnvelope` as a Canonical output type in CanonFlow. 
Implement an invariant-culture `CanonicalJson` emitter so the system can yield verifiable, identical byte-streams regardless of the underlying runtime (.NET vs JS/WASM).

## Requirements
1. Define a `VerdictEnvelope` that standardizes outputs (OverallOutcome, Results array with metadata and typed parameters).
2. Use an invariant-culture JSON emitter that enforces deterministic key ordering and standardizes decimal parsing across platforms.
