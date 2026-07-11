# [CanonFlow-05] Enforce "No Prose" Rule Outcomes

## Context
During GSTFlow hardening, we discovered that `System.Decimal` serialization and `sprintf "%M"` string interpolation format strings differently depending on whether the compiler is .NET Native or Fable (JS). If localized string formats are embedded within core validation outcomes, the system fails the byte-for-byte cross-platform agreement test.

## Objective
CanonFlow must strictly forbid localized, prose, or dynamically formatted strings in its core validation logic.

## Requirements
1. Refactor existing rules to exclusively return a standard `MessageKey`.
2. Move human-readable string interpolation and locale-specific logic out of the core engine and into the Presentation/Emit boundary.
3. Ensure the rule compiler outputs strict structured data and keys instead of prose.
