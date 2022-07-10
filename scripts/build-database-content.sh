#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

. "$SCRIPT_DIR"/.env

cd "$SCRIPT_DIR"/../src/CLI || exit 1
dotnet run
