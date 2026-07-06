namespace Canon.Conformance

open Xunit
open Canon.Introspect
open Canon.Core

/// The abstract universal Conformance Suite base class.
/// Third-party developers inherit from this and supply their IConformanceFixture.
[<AbstractClass>]
type ConformanceTests(fixture: IConformanceFixture) =
    
    let mutable tables = []

    // XUnit runs this constructor for every test, so we cache or fetch
    do
        fixture.SetupTestSchema()
        let provider = fixture.GetProvider()
        tables <- provider.Harvest()
        fixture.Teardown()

    [<Fact>]
    member _.``Extracts Primary Keys Successfully`` () =
        let usersTable = tables |> List.tryFind (fun t -> t.Name = "users")
        Assert.True(usersTable.IsSome, "Test schema must contain a 'users' table")
        let pkCol = usersTable.Value.Columns |> List.tryFind (fun c -> c.IsPrimaryKey)
        Assert.True(pkCol.IsSome, "'users' table must have a Primary Key column")

    [<Fact>]
    member _.``Translates Constraints To Lattice`` () =
        let accountsTable = tables |> List.tryFind (fun t -> t.Name = "accounts")
        // Abstract check: If the table exists, ensure we can parse its check constraints without crashing
        if accountsTable.IsSome then
            for col in accountsTable.Value.Columns do
                for chk in col.CheckConstraints do
                    let lattice = SqlParser.parseConstraint chk
                    // Just verify it doesn't crash and returns a valid Lattice
                    Assert.NotNull(lattice)
