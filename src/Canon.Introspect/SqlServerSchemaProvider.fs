namespace Canon.Introspect.SqlServer

open System
open Canon.Introspect

/// Placeholder schema provider for SQL Server.
/// Demonstrates that CanonFlow's abstraction is database-agnostic.
type SqlServerSchemaProvider(connectionString: string) =
    
    interface ISchemaProvider with
        member this.Harvest() =
            // TODO: Implement SQL Server introspection logic
            // e.g. querying sys.tables, sys.columns, sys.check_constraints
            printfn "SQL Server introspection is not yet implemented."
            []
