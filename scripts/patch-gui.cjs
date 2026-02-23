// patch-gui.cjs — Patch the pkg-generated exe from CONSOLE to WINDOWS subsystem
// so no console window appears alongside the WebView2 native window.
const fs = require('fs');
const path = require('path');

const exe = path.resolve(__dirname, '..', 'dist', 'squad-desktop.exe');
const buf = fs.readFileSync(exe);

// PE header offset is stored at DOS header offset 0x3C
const peOffset = buf.readUInt32LE(0x3c);

// Subsystem field is at PE + 24 (optional header start) + 68
const subsystemOffset = peOffset + 0x5c; // 24 + 68 = 92 = 0x5c
const current = buf.readUInt16LE(subsystemOffset);

if (current === 3) {
  buf.writeUInt16LE(2, subsystemOffset); // 2 = IMAGE_SUBSYSTEM_WINDOWS_GUI
  fs.writeFileSync(exe, buf);
  console.log('patch-gui: subsystem changed CONSOLE → WINDOWS (no console window)');
} else {
  console.log(`patch-gui: subsystem already ${current}, skipping`);
}
