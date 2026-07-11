# [CanonFlow-06] Establish Cross-Platform Agreement Tests

## Context
GSTFlow proved that automated shell scripting can cross-compile rules engines into `.NET CLI` binaries and `Fable WASM` assets, pass the exact same JSON inputs into both, and rigorously `cmp -s` the resulting payloads to ensure absolute byte-for-byte output agreement. 

## Objective
Establish a Cross-Platform Agreement Test pipeline in CanonFlow to structurally test the "One-Engine Law".

## Requirements
1. Implement a test script that generates verdicts using native .NET and Fable WASM.
2. Ensure both outputs are identical and that the CI fails if any platform-specific deviation occurs.
3. Use CanonFlow Golden Fixtures to validate the consistency.
