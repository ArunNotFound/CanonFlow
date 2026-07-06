#!/bin/bash
set -e

echo "Running Mutation Audit on Lattice.fs..."

# Save original
cp src/Canon.Core/Lattice.fs src/Canon.Core/Lattice.fs.bak

# Mutate eval logic (change AND to OR)
sed -i 's/eval evalLeaf a) && (eval evalLeaf b)/eval evalLeaf a) || (eval evalLeaf b)/g' src/Canon.Core/Lattice.fs

echo "Testing mutated code (should FAIL)..."
set +e
dotnet test tests/laws/Canon.Core.Tests.fsproj > /dev/null 2>&1
TEST_RESULT=$?
set -e

# Restore original immediately
mv src/Canon.Core/Lattice.fs.bak src/Canon.Core/Lattice.fs

if [ $TEST_RESULT -eq 0 ]; then
    echo "❌ MUTATION AUDIT FAILED: Laws passed even though code was mutated!"
    exit 1
else
    echo "✅ MUTATION AUDIT PASSED: Laws successfully caught the mutation."
    exit 0
fi
