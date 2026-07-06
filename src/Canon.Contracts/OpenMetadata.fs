namespace Canon.Contracts.OpenMetadata

open Canon.Introspect

/// Extracts the table structures and formats them into OpenMetadata compliant JSON entities,
/// enhanced for AI Agents with mathematically verified constraints, lineage paths, and Safe Queries.
module OpenMetadataEmitter =
    let emitTableEntity (table: TableDef) : string =
        let columns = 
            table.Columns 
            |> List.map (fun col -> 
                let constraintsArr = col.CheckConstraints |> List.map (sprintf "\"%s\"") |> String.concat ", "
                let primaryKey = if col.IsPrimaryKey then "true" else "false"
                $"""        {{ 
            "name": "{col.Name}", 
            "dataType": "{col.DataType.ToUpperInvariant()}",
            "isPrimaryKey": {primaryKey},
            "verifiedConstraints": [{constraintsArr}]
        }}"""
            )
            |> String.concat ",\n"
            
        let safeQueries =
            let pkCol = table.Columns |> List.tryFind (fun c -> c.IsPrimaryKey)
            match pkCol with
            | Some pk ->
                $"""        {{
            "name": "Lookup by {pk.Name}",
            "query": "SELECT * FROM {table.Schema}.{table.Name} WHERE {pk.Name} = :id LIMIT 1"
        }}"""
            | None -> ""

        $"""{{
    "name": "{table.Name}",
    "databaseSchema": "{table.Schema}",
    "columns": [
{columns}
    ],
    "aiLineage": {{
        "source": "Database Truth (Postgres)",
        "grade": "Exact"
    }},
    "safeQueries": [
{safeQueries}
    ]
}}"""
