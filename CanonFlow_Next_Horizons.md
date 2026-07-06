# CanonFlow Next Horizons: Phase 6 & 7

With the parser now robust enough to ingest complex PostgreSQL schemas (including recursive brackets, casts, and relative bounds), the AST is mathematically sound. However, the ecosystem needs to close the loop on *generation* and *automation*.

Here is the proposed plan for what we should build next:

## Phase 6: Transpilation Fidelity (Closing the Loop)
*We have successfully parsed complex bounds (like `status = ANY(ARRAY['CREDIT', 'DEBIT'])` and `end_time > start_time`) into the F# AST, but our Code Generators (TypeScript / OpenAPI) do not yet know how to translate those specific AST nodes.*

**Action Items:**
1. **TypeScript Transpiler Upgrade (`Canon.Fable/Transpiler.fs`)**:
   - Map `InSet` AST nodes to Zod Enums: `z.enum(['CREDIT', 'DEBIT'])`.
   - Map `RelativeBound` AST nodes to Zod Refinements: `.refine(data => data.end_time > data.start_time)`.
2. **OpenAPI Transpiler Upgrade (`Canon.Emit/OpenApiTranspiler.fs`)**:
   - Map `InSet` to the OpenAPI `enum` property.
   - Map relative bounds to description strings (as OpenAPI doesn't natively support cross-field validation).
3. **Proof Engine Update (`ProofEmitter.fs`)**:
   - Update the grading logic to mark `InSet` and `RelativeBound` as `✅ Exact` for TypeScript, instead of `❌ Unsupported`.

## Phase 7: The "Drift Check" CI/CD Pipeline
*CanonFlow’s true value proposition is catching drift before it hits production.*

**Action Items:**
1. **GitHub Action Creation**: Write a reusable `.github/workflows/canonflow-drift-check.yml` that runs `canonflow --contracts --verify`.
2. **Strict Mode**: Implement a CLI flag that returns a non-zero exit code (failing the CI build) if the `PROOF.md` detects any `Approximate` or `Unsupported` downgrades.
3. **Apply to Fintech Wallet**: Wire this GitHub action directly into the `Canonflow.Samples` repository.

## Phase 8: AI-Assisted Component Generation
*We generate TypeScript validators, but developers still have to build the HTML/React forms.*

**Action Items:**
1. **Scaffolding CLI**: Create an experimental feature `canonflow --scaffold-forms` that reads the `AgentCatalog.yaml` and leverages a local LLM or API to spit out fully styled React Hook Form components wired directly to our generated Zod schemas.
2. **The Result**: A single CLI command that takes a Postgres Database and outputs a fully functional, mathematically secure, visually styled Next.js dashboard.
