<<<<<<< HEAD
# CRM Dashboard Pro

A modern, professional Customer Relationship Management (CRM) dashboard built with React, Vite, and Tailwind CSS. Featuring role-based access control, responsive design, and a complete suite of CRM tools.

## 🎯 Features

### Authentication & Authorization
- ✅ Login page with email/password
- ✅ Password visibility toggle
- ✅ Remember me functionality
- ✅ Role-based access control (RBAC)
- ✅ Protected routes with RoleGuard component
- ✅ Context API for auth state management
- ✅ Demo credentials built-in

### User Roles
1. **Admin** - Full access to all features
2. **Manager** - Access to leads, customers, tasks, reports
3. **Sales Representative** - Core CRM features
4. **Voice Agent** - Voice recording and lead management
5. **Chat Specialist** - Chat and communication focus

### Dashboard
- 📊 4 Key metrics (Total Leads, New Leads, Follow-ups, Active Tasks)
- 📈 Status breakdown charts
- 📉 Performance metrics visualization
- 🔄 Recent activity feed with timeline

### Leads Management
- 👥 Comprehensive leads table
- 🔍 Search and filter functionality
- 📱 Status filtering (New, Contacted, Qualified, Converted)
- ✏️ View/Edit/Convert actions
- 📅 Follow-up date tracking
- 👤 Lead assignment tracking

### Customers
- 🏢 Customer database management
- 📞 Contact information
- 👨‍💼 Account manager assignment
- 📝 Customer details, notes, documents
- 💬 Communication history

### Tasks & Follow-ups
- ✓ Task creation and assignment
- 🎯 Priority levels (High, Medium, Low)
- 📅 Due date management
- ⚡ Status tracking (Pending, In Progress, Completed)
- 👥 Team task distribution

### Communications
- 📞 Call logs with timestamps
- 🎤 Voice recording management
- 💬 Chat logs
- 📊 Communication history tracking
- 🔗 Linked to leads/customers

### Chat Workspace
- 💭 Real-time messaging interface
- 👤 Contact list with online status
- 📎 File attachment support
- 🎤 Voice note capability
- ⏰ Message timestamps
- 🔍 Chat search functionality

### Documents Management
- 📁 File upload and storage
- 🔍 File search by name
- 📥 Download files
- 🔗 Link documents to customers
- 👤 Upload tracking
- 📅 Date organization

### Admin Features
- 👥 User management with role assignment
- 🔐 Role management system
- 📋 Permission control
- 🔑 Dynamic role creation
- ✏️ User status management

### Reports (Manager/Admin only)
- 📈 Sales Performance analytics
- 📊 Lead Analysis
- 👥 Team Activity tracking
- 💹 Conversion metrics
- 📉 Performance trends

### Settings
- 👤 Profile customization
- 🔐 Password management
- 🔔 Notification preferences
- ⚙️ User preferences

## 🎨 Design Features

- **Modern SaaS aesthetic** with clean, professional styling
- **Responsive layout** - Works seamlessly on desktop, tablet, and mobile
- **Sidebar navigation** - Collapsible on mobile devices
- **Gradient accents** - Eye-catching blues and cyans
- **Smooth transitions** - All interactions are buttery smooth
- **Dark header** - Professional navigation bar
- **Color-coded status badges** - Easy status identification
- **Accessibility-focused** - WCAG compliant design

## 🛠 Tech Stack

- **React 18.2** - UI framework
- **Vite 5.0** - Lightning-fast build tool
- **React Router v6** - Client-side routing
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Context API** - State management for auth

## 📋 Project Structure

```
crm-dashboard/
├── src/
│   ├── main.jsx              # React entry point
│   ├── crm-dashboard.jsx     # Main app component
│   ├── index.css             # Tailwind styles
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

1. **Clone/Create project:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

The app will open at `http://localhost:5173`

3. **Build for production:**
```bash
npm run build
```

4. **Preview production build:**
```bash
npm run preview
```

## 🔐 Demo Credentials

Use any of these to login (password can be anything):

| Role | Email | Features |
|------|-------|----------|
| 👤 Admin | admin@crm.com | Full access |
| 👨‍💼 Manager | manager@crm.com | Leads, Customers, Tasks, Reports |
| 🎤 Voice Agent | voice@crm.com | Voice, Leads, Tasks |
| 💬 Chat Specialist | chat@example.com | Chat, Messages |
| 📱 Sales Rep | sarah@crm.com | Leads, Customers, Tasks |

## 🎯 Key Components

### AuthProvider & AuthContext
Manages user authentication state and role-based access. Provides:
- `user` - Current user object
- `role` - User's role for RBAC
- `login(email, password)` - Async login function
- `logout()` - Clear auth state

### RoleGuard
Route protection component for role-based access:
```jsx
<RoleGuard allowedRoles={['admin', 'manager']}>
  <AdminPage />
</RoleGuard>
```

### Sidebar Component
Responsive navigation with:
- Mobile overlay and toggle
- Dynamic menu based on user role
- Gradient logo
- Settings and logout

### MainLayout
Wrapper component providing:
- Header with user info and notifications
- Responsive sidebar
- Current time display
- Notification bell

## 🎨 Customization

### Change Logo
Edit the logo div in Sidebar component:
```jsx
<div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg">
  {/* Your logo */}
</div>
```

### Adjust Color Scheme
Modify Tailwind colors in components:
- Blue: `from-blue-600 to-cyan-500`
- Emerald: `from-emerald-500 to-teal-400`
- Change `bg-gradient-to-r` for gradients

### Add New Roles
In `AuthProvider` login function:
```jsx
if (email === 'custom@crm.com') {
  mockRole = 'custom_role';
}
```

Then add to menuItems:
```jsx
{ icon: Icon, label: 'Item', path: '/path', roles: ['custom_role'] }
```

## 📱 Responsive Design

- **Mobile (<768px)** - Full-screen sidebar overlay, hamburger menu
- **Tablet (768px-1024px)** - Collapsible sidebar, adjusted spacing
- **Desktop (>1024px)** - Persistent sidebar, full layout

## ✨ Features by Role

### Admin Dashboard
- User Management
- Role Management
- All Reports
- Full Data Access

### Manager Dashboard
- Leads & Customers
- Team Reports
- Task Oversight
- All Communications

### Sales Rep
- Leads Management
- Customer Management
- Task Management
- Chat Access

### Voice Agent
- Voice Recordings
- Assigned Leads
- Task Management
- Call Logs

### Chat Specialist
- Chat Workspace
- Message Management
- Communication Logs

## 🔒 Security Notes

This is a **demo application**. For production:
- Implement real backend authentication
- Use JWT tokens instead of context
- Add CSRF protection
- Validate all inputs
- Use HTTPS only
- Implement rate limiting
- Add proper password hashing

## 🐛 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📦 Production Build

The app includes:
- Minified CSS and JavaScript
- No source maps in production
- Optimized bundle size
- Code splitting ready

## 🤝 Contributing

Feel free to extend this CRM with:
- Real backend API integration
- Database persistence
- Advanced analytics
- Calendar integration
- Email sync
- Phone system integration

## 📄 License

Free to use and modify for personal and commercial projects.

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

## 📞 Support

For issues or questions about the CRM dashboard, check:
1. Demo credentials in login page
2. Browser console for errors
3. Network tab for API issues
4. Component documentation in code

---

**Built with ❤️ for modern sales teams**
=======
# crm-react
>>>>>>> ac16491a93ca6966b9d42cb4d7fa6610efd9ff20
