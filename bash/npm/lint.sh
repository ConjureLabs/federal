#! /bin/bash
### Called on `npm run lint`

BASE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
. $BASE/../functions.cfg;

if ! hash jscs 2>/dev/null; then
  error "Could not run jscs - you may need to run 'npm install'";
  exit 1;
fi

if ! hash eslint 2>/dev/null; then
  error "Could not run eslint - you may need to run 'npm install'";
  exit 1;
fi

set -e;

eslint $SRC_DIR/*.js;
jscs $SRC_DIR/*.js;

progress "Lint passed";
