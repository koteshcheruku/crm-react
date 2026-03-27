const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'crm-dashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Clear Leads by Status chart data
content = content.replace(
    "{ status: 'New', count: 18, percentage: 40,",
    "{ status: 'New', count: 0, percentage: 0,"
);
content = content.replace(
    "{ status: 'Contacted', count: 12, percentage: 27,",
    "{ status: 'Contacted', count: 0, percentage: 0,"
);
content = content.replace(
    "{ status: 'Qualified', count: 10, percentage: 22,",
    "{ status: 'Qualified', count: 0, percentage: 0,"
);
content = content.replace(
    "{ status: 'Converted', count: 5, percentage: 11,",
    "{ status: 'Converted', count: 0, percentage: 0,"
);

// Clear Recent Activity
content = content.replace(
    `[\r\n            { action: 'New lead created', detail: 'Sarah Thompson - Enterprise Plan', time: '2 mins ago' },\r\n            { action: 'Lead converted', detail: 'Acme Corp - Annual Contract', time: '1 hour ago' },\r\n            { action: 'Follow-up scheduled', detail: 'Tech Startups Inc', time: '3 hours ago' },\r\n            { action: 'Note added', detail: 'Call scheduled for Monday', time: '5 hours ago' },\r\n          ]`,
    '[]'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done! Demo data cleared.');
