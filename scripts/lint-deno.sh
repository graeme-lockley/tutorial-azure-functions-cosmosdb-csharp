#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "$SCRIPT_DIR"/../src/infra 
cd "$SCRIPT_DIR"/../src/infra || exit 1

# Verify that the code is formatted according to convention
deno fmt --check || exit 1

# Perform linting on the code
deno lint || exit 1