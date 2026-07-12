namespace CanonFlow.Core.Verification

type RuleOutcome =
    | Pass
    | PassWithAssumptions
    | Warning
    | Unknown
    | NotSupported
    | Fail

type EvidenceKind =
    | Observed
    | Parsed
    | UserConfirmed
    | Derived
    | Assumed
    | ExternalReference

type Evidence =
    { Path: string
      Kind: EvidenceKind
      Value: string option
      Provenance: string option }

type RuleConfidence = 
    | Exact 
    | Approximate 
    | Advisory

type RuleMetadata =
    { RuleId: string
      Category: string
      EffectiveFrom: string option
      EffectiveUntil: string option
      Reference: string option
      Confidence: RuleConfidence
      MessageKey: string }

type RuleResult =
    { Metadata: RuleMetadata
      Outcome: RuleOutcome
      Evidence: Evidence list
      Parameters: Map<string,string> }

/// <summary>
/// The core Canonical Verification contract.
/// SCHEMA VERSION 1.0 IS FROZEN. 
/// Field set, outcome precedence, and canonical JSON rules are stable contracts. 
/// Breaking changes require a schema-version bump + written rationale.
/// </summary>
type VerdictEnvelope =
    { SchemaVersion: string
      EngineId: string
      EngineVersion: string
      RuleSetId: string
      RuleSetVersion: string
      SubjectType: string
      SubjectHash: string
      OverallOutcome: RuleOutcome
      Results: RuleResult list }

module VerdictEnvelope =
    let determineOverallOutcome (results: RuleResult list) =
        if results.IsEmpty then Pass
        else
            let outcomes = results |> List.map (fun r -> r.Outcome)
            if outcomes |> List.contains Fail then Fail
            elif outcomes |> List.contains NotSupported then NotSupported
            elif outcomes |> List.contains Unknown then Unknown
            elif outcomes |> List.contains Warning then Warning
            elif outcomes |> List.contains PassWithAssumptions then PassWithAssumptions
            else Pass
