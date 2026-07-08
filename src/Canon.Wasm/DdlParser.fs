namespace Canon.Wasm

open System
open System.Text.RegularExpressions
open Canon.Introspect

module DdlParser =
    let parseSql (sql: string) : TableDef list =
        let tables = ResizeArray<TableDef>()
        
        // Regex to find CREATE TABLE blocks
        let createTableRegex = Regex(@"CREATE TABLE\s+(?:(\w+)\.)?(\w+)\s*\(([\s\S]*?)\);", RegexOptions.IgnoreCase)
        let columnRegex = Regex(@"^\s*([a-zA-Z0-9_]+)\s+([a-zA-Z0-9_\s]+?)(?:\s+PRIMARY KEY)?(?:\s+NOT NULL)?(?:\s+NULL)?(?:\s+UNIQUE)?\s*(?:,|$)", RegexOptions.IgnoreCase ||| RegexOptions.Multiline)
        let checkRegex = Regex(@"CHECK\s*\((.*)\)", RegexOptions.IgnoreCase)

        let matches = createTableRegex.Matches(sql)
        for m in matches do
            let schema = if m.Groups.[1].Success then m.Groups.[1].Value else "public"
            let tableName = m.Groups.[2].Value
            let body = m.Groups.[3].Value
            
            let columns = ResizeArray<ColumnDef>()
            
            // Extract lines/columns
            let lines = body.Split([|','; '\n'|], StringSplitOptions.RemoveEmptyEntries)
            for line in lines do
                let line = line.Trim()
                if not (line.StartsWith("CONSTRAINT", StringComparison.OrdinalIgnoreCase)) && 
                   not (line.StartsWith("PRIMARY KEY", StringComparison.OrdinalIgnoreCase)) &&
                   not (line.StartsWith("CHECK", StringComparison.OrdinalIgnoreCase)) then
                    let cMatch = Regex.Match(line, @"^([a-zA-Z0-9_]+)\s+([a-zA-Z0-9_\s]+)")
                    if cMatch.Success then
                        let colName = cMatch.Groups.[1].Value
                        let dataType = cMatch.Groups.[2].Value.Trim()
                        let checks = ResizeArray<string>()
                        let chkMatch = checkRegex.Match(line)
                        if chkMatch.Success then
                            checks.Add(chkMatch.Groups.[1].Value)
                            
                        columns.Add({
                            Name = colName
                            DataType = dataType
                            IsNullable = not (line.Contains("NOT NULL"))
                            IsPrimaryKey = line.Contains("PRIMARY KEY")
                            DefaultValue = None
                            IsGenerated = false
                            Description = None
                            MaxLength = None
                            CheckConstraints = checks |> Seq.toList
                            ParsedConstraints = []
                            Semantics = None
                        })
                else if line.StartsWith("CONSTRAINT") || line.StartsWith("CHECK") then
                    // Try to attach to a column or something if needed, but for simplicity:
                    let chkMatch = checkRegex.Match(line)
                    if chkMatch.Success then
                        // For playground, we assume table-level checks apply to the first mentioned column
                        let content = chkMatch.Groups.[1].Value
                        // Find a column mentioned in the content
                        let targetCol = columns |> Seq.tryFind (fun c -> content.Contains(c.Name))
                        match targetCol with
                        | Some c -> 
                            let idx = columns.IndexOf(c)
                            let newC = { c with CheckConstraints = c.CheckConstraints @ [content] }
                            columns.[idx] <- newC
                        | None -> ()

            tables.Add({
                Schema = schema
                Name = tableName
                Type = Canon.Introspect.TableType.Table
                Description = None
                Columns = columns |> Seq.toList
                PrimaryKeys = []
                ForeignKeys = []
                Indexes = []
                TableConstraints = []
            })
            
        tables |> Seq.toList
