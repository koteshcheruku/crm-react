const fs = require('fs');
const lines = fs.readFileSync('src/pages/UserManagementPage.jsx', 'utf-8').split('\n');
fs.writeFileSync('src/pages/UserManagementPage.jsx', lines.slice(0, 423).join('\n') + '\n        </div>\n    );\n};\n');
console.log('Fixed UserManagementPage.');
