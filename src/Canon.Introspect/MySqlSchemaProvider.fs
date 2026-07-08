namespace Canon.Introspect.MySql
#if !FABLE_COMPILER

open System
open Canon.Introspect

/// Placeholder schema provider for MySQL.
/// Demonstrates that CanonFlow's abstraction is database-agnostic.
type MySqlSchemaProvider(connectionString: string) =
    
    interface ISchemaProvider with
        member this.Harvest() =
            // TODO: Implement MySQL introspection logic
            // e.g. querying information_schema.tables, information_schema.columns, information_schema.check_constraints
            printfn "MySQL introspection is not yet implemented."
            []

#endif
