// build-copy.js — copies runtime dependencies into dist/ for standalone exe packaging
// CJS format (package.json is type:module but this runs via `node scripts/build-copy.js`)

const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '..', 'dist');
const nm = path.resolve(__dirname, '..', 'node_modules');

function copyDir(src, dest) {
  fs.cpSync(src, dest, { recursive: true });
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

// --- PWA static files ---
copyDir(path.join(__dirname, '..', 'public'), path.join(dist, 'public'));

// --- @github/copilot + copilot-sdk (externalized, needed at runtime) ---
copyDir(path.join(nm, '@github', 'copilot'), path.join(dist, 'node_modules', '@github', 'copilot'));
copyDir(path.join(nm, '@github', 'copilot-sdk'), path.join(dist, 'node_modules', '@github', 'copilot-sdk'));

// --- webview-nodejs (externalized, full package) ---
copyDir(path.join(nm, 'webview-nodejs'), path.join(dist, 'node_modules', 'webview-nodejs'));

// --- libwebview-nodejs (only runtime files, skip build-time deps in node_modules/) ---
const libDest = path.join(dist, 'node_modules', 'libwebview-nodejs');
copyFile(path.join(nm, 'libwebview-nodejs', 'index.js'), path.join(libDest, 'index.js'));
copyFile(path.join(nm, 'libwebview-nodejs', 'package.json'), path.join(libDest, 'package.json'));
copyFile(
  path.join(nm, 'libwebview-nodejs', 'build', 'libwebview.node'),
  path.join(libDest, 'build', 'libwebview.node')
);

// --- bindings (required by libwebview-nodejs for native module discovery) ---
copyDir(path.join(nm, 'bindings'), path.join(dist, 'node_modules', 'bindings'));

// --- file-uri-to-path (dependency of bindings) ---
if (fs.existsSync(path.join(nm, 'file-uri-to-path'))) {
  copyDir(path.join(nm, 'file-uri-to-path'), path.join(dist, 'node_modules', 'file-uri-to-path'));
}

console.log('build-copy: dist/ populated with runtime dependencies');
