namespace Canon.Cli

open Canon.Introspect

module ReactScaffold =
    
    let generateForm (table: TableDef) : string =
        let tableName = table.Name
        let componentName = $"{tableName.Substring(0, 1).ToUpper()}{tableName.Substring(1)}Form"
        
        let imports = 
            [ "import React from 'react';"
              "import { useForm } from 'react-hook-form';"
              sprintf "import { validate_%s } from './validators';" tableName ]
            |> String.concat "\n"

        let inputs = 
            table.Columns
            |> List.map (fun c -> 
                let inputType = 
                    match c.DataType.ToLower() with
                    | "integer" | "numeric" | "decimal" -> "number"
                    | _ -> "text"
                $"""      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">{c.Name}</label>
        <input 
          type="{inputType}" 
          {{...register('{c.Name}')}} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>"""
            )
            |> String.concat "\n"

        $"""{imports}

export default function {componentName}() {{
  const {{ register, handleSubmit, formState: {{ errors }} }} = useForm();

  const onSubmit = (data: any) => {{
    // Automatically apply CanonFlow mathematical validators before submission
    // NOTE: This assumes an aggregate validator is emitted. For now, pseudo-code.
    console.log("Validated Data:", data);
  }};

  return (
    <form onSubmit={{handleSubmit(onSubmit)}} className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">{componentName}</h2>
{inputs}
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
    </form>
  );
}}
"""
