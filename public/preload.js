const {clipboard, nativeImage} = require('electron');
const fs = require('fs');
const path = require('path');
window.clipboard = clipboard;
window.nativeImage = nativeImage;
window.path = path;
window.fs = fs;
