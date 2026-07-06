namespace Canon.SqlHydra

open Canon.Core
open Canon.Introspect

/// A conceptual bridge demonstrating how SqlHydra's native typed schema
/// can feed directly into CanonFlow's semantic capabilities.
module HydraBridge =

    /// Represents a mock of SqlHydra's internal table mapping
    type SqlHydraTable = {
        Schema: string
        Name: string
        Columns: {| Name: string; SqlType: string; IsNullable: bool; MaxLength: int |} list
    }

    /// Converts a SqlHydra schema into a CanonFlow TableDef
    let toTableDef (hydraTable: SqlHydraTable) : TableDef =
        {
            Schema = hydraTable.Schema
            Name = hydraTable.Name
            Columns = 
                hydraTable.Columns 
                |> List.map (fun col ->
                    {
                        Name = col.Name
                        DataType = col.SqlType
                        IsNullable = col.IsNullable
                        MaxLength = if col.MaxLength > 0 then Some col.MaxLength else None
                        CheckConstraints = [] // SqlHydra typically doesn't extract checks natively yet
                        Semantics = None
                    }
                )
        }
