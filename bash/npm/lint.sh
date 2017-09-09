#! /bin/bash
### Called on `npm run lint`

BASE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
. $BASE/../functions.cfg;

if ! hash jscs 2>/dev/null; then
  error "Could not run jscs - you may need to run 'yarn global add jscs'";
  exit 1;
fi

if ! hash eslint 2>/dev/null; then
  error "Could not run eslint - you may need to run 'yarn global add eslint'";
  exit 1;
fi

set -e;

eslint ./**/*.js;
jscs ./**/*.js;

progress "Lint passed";
