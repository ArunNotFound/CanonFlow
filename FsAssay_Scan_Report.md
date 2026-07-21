# CanonFlow FsAssay Scan Report

## Summary of Violations

```text
    997 [FSA1001] Mutation Overuse
     91 [FSA2016] Unsafe Cast
     62 [FSA2023] Nested Function Application
     61 [FSA1008] OOP Inheritance
     15 [FSA1007] Imperative Loops
     10 [FSA2026] Option Constellation
      8 [FSA2027] Stringly Error Channel
      7 [FSA2020] Signature Blindness
      6 [FSA2019] Missing Computation Expression
      5 [FSA2030] Manual Dispose
      5 [FSA1003] Null Reference
      4 [FSA1004] Primitive Obsession
      3 [FSA2022] Impure Core
      3 [FSA1009] Mutable Collections
      2 [FSA2014] Imperative Accumulation
      2 [FSA1005] Parse, Don't Validate
      1 [FSA2017] Reflection-Based Dispatch
```

## Files Scanned & Findings Overview

```text
❌ /root/canonflow/Symphony/Bridge.Spec/Spec.fs
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 3)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 4)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 4)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 5)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 5)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 17)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 17)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 17)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 23)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 24)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 24)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 25)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 25)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 25)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 26)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 26)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 26)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 27)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 27)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 28)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 28)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 28)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 30)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 30)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 30)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 52)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 66)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 66)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 83)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 90)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 97)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 101)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 110)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 112)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 112)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 112)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 112)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 112)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 112)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 112)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 112)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 125)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 125)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 125)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 125)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 125)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 125)
   └── [FSA1004] Primitive Obsession: Do not use type aliases for primitives. Use Single-Case Discriminated Unions to make illegal states unrepresentable. (Line: 108)
   └── [FSA1004] Primitive Obsession: Do not use type aliases for primitives. Use Single-Case Discriminated Unions to make illegal states unrepresentable. (Line: 121)
   └── [FSA1004] Primitive Obsession: Do not use type aliases for primitives. Use Single-Case Discriminated Unions to make illegal states unrepresentable. (Line: 123)
   └── [FSA1008] OOP Inheritance: Avoid OOP inheritance and interfaces. Use records of functions or Discriminated Unions. (Line: 63)
   └── [FSA1008] OOP Inheritance: Avoid OOP inheritance and interfaces. Use records of functions or Discriminated Unions. (Line: 84)
   └── [FSA1008] OOP Inheritance: Avoid OOP inheritance and interfaces. Use records of functions or Discriminated Unions. (Line: 85)
   └── [FSA1008] OOP Inheritance: Avoid OOP inheritance and interfaces. Use records of functions or Discriminated Unions. (Line: 86)
   └── [FSA1008] OOP Inheritance: Avoid OOP inheritance and interfaces. Use records of functions or Discriminated Unions. (Line: 87)
   └── [FSA1008] OOP Inheritance: Avoid OOP inheritance and interfaces. Use records of functions or Discriminated Unions. (Line: 91)
   └── [FSA1008] OOP Inheritance: Avoid OOP inheritance and interfaces. Use records of functions or Discriminated Unions. (Line: 92)
   └── [FSA1008] OOP Inheritance: Avoid OOP inheritance and interfaces. Use records of functions or Discriminated Unions. (Line: 93)
   └── [FSA1008] OOP Inheritance: Avoid OOP inheritance and interfaces. Use records of functions or Discriminated Unions. (Line: 94)
   └── [FSA1008] OOP Inheritance: Avoid OOP inheritance and interfaces. Use records of functions or Discriminated Unions. (Line: 98)
   └── [FSA1008] OOP Inheritance: Avoid OOP inheritance and interfaces. Use records of functions or Discriminated Unions. (Line: 102)
   └── [FSA1008] OOP Inheritance: Avoid OOP inheritance and interfaces. Use records of functions or Discriminated Unions. (Line: 103)
   └── [FSA1008] OOP Inheritance: Avoid OOP inheritance and interfaces. Use records of functions or Discriminated Unions. (Line: 104)
   └── [FSA1008] OOP Inheritance: Avoid OOP inheritance and interfaces. Use records of functions or Discriminated Unions. (Line: 105)
   └── [FSA2016] Unsafe Cast: Runtime cast detected. Model alternatives as a DU. (Line: 38)
   └── [FSA2016] Unsafe Cast: Runtime cast detected. Model alternatives as a DU. (Line: 73)
   └── [FSA2016] Unsafe Cast: Runtime cast detected. Model alternatives as a DU. (Line: 73)
   └── [FSA2017] Reflection-Based Dispatch: Runtime type inspection used for dispatch. (Line: 76)
   └── [FSA2023] Nested Function Application: Deep nesting detected. Consider using the |> operator. (Line: 33)
   └── [FSA2023] Nested Function Application: Deep nesting detected. Consider using the |> operator. (Line: 36)
   └── [FSA2023] Nested Function Application: Deep nesting detected. Consider using the |> operator. (Line: 38)
   └── [FSA2023] Nested Function Application: Deep nesting detected. Consider using the |> operator. (Line: 42)
   └── [FSA2023] Nested Function Application: Deep nesting detected. Consider using the |> operator. (Line: 45)
   └── [FSA2023] Nested Function Application: Deep nesting detected. Consider using the |> operator. (Line: 48)
❌ /root/canonflow/Symphony/Bridge.Spec/Northwind.fs
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 17)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 17)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 17)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 17)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 17)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 17)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 17)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 17)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 17)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 17)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 17)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 17)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 32)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 38)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 38)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 38)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 38)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 38)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 47)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 47)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 52)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 52)
   └── [FSA1001] Mutation Overuse: Avoid mutation. Use record copies with 'with' instead. (Line: 52)
   └── [FSA1001] Mutation Overuse: Avoid 'mutable'. Use record copies with 'with' instead. (Line: 59)
```
