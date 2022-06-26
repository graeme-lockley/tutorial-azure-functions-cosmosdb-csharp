#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

. "$SCRIPT_DIR"/.env

cd "$SCRIPT_DIR"/../src/CoreLibraryTest || exit 1
dotnet test || exit 1

cd "$SCRIPT_DIR"/../src/PortInMemoryRepositoryTest || exit 1
dotnet test || exit 1
