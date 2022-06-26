#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

. "$SCRIPT_DIR"/.env

shellcheck -e SC1090,SC1091 "$SCRIPT_DIR"/../scripts/*.sh || exit 1
shellcheck -e SC1090,SC1091 "$SCRIPT_DIR"/../infra/env/*.sh "$SCRIPT_DIR"/../infra/env/*.up "$SCRIPT_DIR"/../infra/env/*.down || exit 1
shellcheck -e SC1090,SC1091 "$SCRIPT_DIR"/../infra/test-setup/*.sh "$SCRIPT_DIR"/../infra/test-setup/*.up || exit 1