namespace Canon.Cli

open Canon.Introspect

module ComposeScaffold =
    
    let generateForm (table: TableDef) : string =
        let tableName = table.Name
        let componentName = $"{tableName.Substring(0, 1).ToUpper()}{tableName.Substring(1)}Form"
        
        let imports = 
            [ "import androidx.compose.foundation.layout.*"
              "import androidx.compose.material3.*"
              "import androidx.compose.runtime.*"
              "import androidx.compose.ui.Modifier"
              "import androidx.compose.ui.unit.dp"
              "import com.layam.validators.*" ]
            |> String.concat "\n"

        let inputs = 
            table.Columns
            |> List.map (fun c -> 
                let inputType = 
                    match c.DataType.ToLower() with
                    | "integer" | "numeric" | "decimal" -> "androidx.compose.ui.text.input.KeyboardType.Number"
                    | _ -> "androidx.compose.ui.text.input.KeyboardType.Text"
                
                let validationCall =
                    if c.CheckConstraints.IsEmpty then
                        "true"
                    else
                        $"validate_{tableName}_{c.Name}({c.Name}Value)"

                $"""        var {c.Name}Value by remember {{ mutableStateOf("") }}
        val is{c.Name}Valid = {validationCall}
        OutlinedTextField(
            value = {c.Name}Value,
            onValueChange = {{ {c.Name}Value = it }},
            label = {{ Text("{c.Name}") }},
            isError = !is{c.Name}Valid,
            keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(keyboardType = {inputType}),
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
        )
        if (!is{c.Name}Valid) {{
            Text("Invalid {c.Name}", color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
        }}"""
            )
            |> String.concat "\n\n"

        $"""{imports}

@Composable
fun {componentName}(onSubmit: (Map<String, String>) -> Unit) {{
    Column(modifier = Modifier.padding(16.dp)) {{
        Text("{componentName}", style = MaterialTheme.typography.headlineSmall, modifier = Modifier.padding(bottom = 24.dp))
        
{inputs}

        Button(
            onClick = {{ onSubmit(emptyMap()) /* TODO: map state to data class */ }},
            modifier = Modifier.fillMaxWidth().padding(top = 16.dp)
        ) {{
            Text("Submit")
        }}
    }}
}}
"""
