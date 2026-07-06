namespace Canon.Conformance

open Canon.Introspect

/// A fixture that a community developer implements to prove their 
/// ISchemaProvider (e.g. MySQL, SQLite) passes the CanonFlow standards.
type IConformanceFixture =
    /// Spins up the database (e.g. via Testcontainers) and creates a standardized "Northwind-style" 
    /// test schema with PKs, FKs, Check Constraints, Enums, and Nullable fields.
    abstract member SetupTestSchema: unit -> unit
    
    /// Returns the instantiated ISchemaProvider pointing to the test DB.
    abstract member GetProvider: unit -> ISchemaProvider
    
    /// Cleans up the database container after tests.
    abstract member Teardown: unit -> unit
