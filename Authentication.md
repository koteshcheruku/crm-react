# 🔐 Authentication & Role System

## Overview

The CRM Dashboard includes a complete authentication system with role-based access control (RBAC) using React Context API.

## User Roles & Permissions

### 1. Admin Role
**Email:** `admin@crm.com`

**Access:**
- ✅ Dashboard
- ✅ Leads Management (full)
- ✅ Customers (full)
- ✅ Tasks (full)
- ✅ Communications (full)
- ✅ Chat Workspace
- ✅ Documents (full)
- ✅ Reports (full)
- ✅ User Management
- ✅ Role Management
- ✅ Settings

**Use Case:** System administrators and company owners

---

### 2. Manager Role
**Email:** `manager@crm.com`

**Access:**
- ✅ Dashboard
- ✅ Leads Management (full)
- ✅ Customers (full)
- ✅ Tasks (full)
- ✅ Communications (full)
- ✅ Chat Workspace
- ✅ Documents (full)
- ✅ Reports (full)
- ❌ User Management
- ❌ Role Management

**Permissions:**
- `view_leads`, `create_lead`, `edit_lead`, `assign_lead`
- `view_customers`, `edit_customer`
- `create_task`, `assign_task`
- `view_reports`, `export_reports`
- `chat_access`, `message_send`

**Use Case:** Sales managers, team leads

---

### 3. Sales Representative Role
**Email:** `sarah@crm.com`

**Access:**
- ✅ Dashboard
- ✅ Leads Management (assigned & created)
- ✅ Customers
- ✅ Tasks
- ✅ Communications
- ✅ Chat
- ✅ Documents
- ❌ Reports
- ❌ User Management
- ❌ Role Management

**Permissions:**
- `view_leads`, `create_lead`, `edit_own_leads`
- `view_customers`
- `create_task`, `own_tasks`
- `chat_access`
- `view_documents`

**Use Case:** Sales representatives, account executives

---

### 4. Voice Agent Role
**Email:** `voice@crm.com`

**Access:**
- ✅ Dashboard (limited)
- ✅ Leads Management (assigned)
- ✅ Tasks (assigned)
- ✅ Communications (voice focus)
- ❌ Customers (view only)
- ❌ Chat
- ❌ Documents
- ❌ Reports
- ❌ User Management
- ❌ Role Management

**Permissions:**
- `upload_voice_recording`
- `view_call_logs`
- `create_follow_up`
- `view_assigned_leads`

**Use Case:** Call center agents, voice specialists

---

### 5. Chat Specialist Role
**Email:** `chat@crm.com`

**Access:**
- ✅ Dashboard (limited)
- ✅ Chat Workspace (full)
- ✅ Communications (chat focus)
- ✅ Tasks (assigned)
- ❌ Leads Management
- ❌ Customers
- ❌ Documents
- ❌ Reports
- ❌ User Management
- ❌ Role Management

**Permissions:**
- `chat_access`
- `message_send`
- `file_attachment`
- `create_task`

**Use Case:** Chat support specialists, customer service reps

---

## How Authentication Works

### 1. Login Flow

```
User enters credentials → Login form validation
→ AuthProvider.login() called → Mock authentication
→ User & Role state updated → Redirect to dashboard
```

### 2. Route Protection

```
Protected Route → Check user exists → Check role authorized
→ Render page OR redirect to dashboard
```

### 3. Menu Filtering

```
Load menu items → Filter by user role → Only show accessible items
```

## Code Implementation

### AuthContext & AuthProvider

```jsx
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const login = async (email, password) => {
    // Determine role based on email
    // Set user and role state
  };

  const logout = () => {
    // Clear user and role
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Using Auth Hook

```jsx
const MyComponent = () => {
  const { user, role, login, logout } = useAuth();

  // Check role
  if (role === 'admin') {
    // Show admin features
  }

  return (
    <div>
      Hello, {user?.name}!
    </div>
  );
};
```

### RoleGuard Component

```jsx
<RoleGuard allowedRoles={['admin', 'manager']}>
  <AdminOnlyPage />
</RoleGuard>
```

If user's role is not in `allowedRoles`, they're redirected to dashboard.

## Sidebar Menu Items by Role

```
Admin         →  All 11 menu items
Manager       →  10 items (no User/Role Management)
Sales         →  7 items (no Reports/Admin features)
Voice Agent   →  4 items (focused on voice/leads)
Chat Spec     →  3 items (chat & messaging focused)
```

## Protected Pages

| Page | Admin | Manager | Sales | Voice | Chat |
|------|-------|---------|-------|-------|------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Leads | ✅ | ✅ | ✅ | ✅ | ❌ |
| Customers | ✅ | ✅ | ✅ | ❌ | ❌ |
| Tasks | ✅ | ✅ | ✅ | ✅ | ✅ |
| Communications | ✅ | ✅ | ✅ | ✅ | ✅ |
| Chat | ✅ | ✅ | ✅ | ❌ | ✅ |
| Documents | ✅ | ✅ | ✅ | ❌ | ❌ |
| Reports | ✅ | ✅ | ❌ | ❌ | ❌ |
| Users (Admin) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Roles (Admin) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Settings | ✅ | ✅ | ✅ | ✅ | ✅ |

## Customizing Roles

### Add New Role

1. **In login function:**
```jsx
const login = (email, password) => {
  if (email === 'newrole@crm.com') {
    mockRole = 'custom_role';
    mockUser = { name: 'Custom User', email };
  }
  setUser(mockUser);
  setRole(mockRole);
};
```

2. **Add to menu items:**
```jsx
const menuItems = [
  {
    icon: YourIcon,
    label: 'New Feature',
    path: '/new-feature',
    roles: ['custom_role', 'admin']
  }
];
```

3. **Protect the route:**
```jsx
<Route
  path="/new-feature"
  element={
    <RoleGuard allowedRoles={['custom_role', 'admin']}>
      <NewFeaturePage />
    </RoleGuard>
  }
/>
```

### Change Role Permissions

Edit the `menuItems` array in the Sidebar component to change which roles can access what.

Example - Make Reports available to all:
```jsx
{
  icon: BarChart3,
  label: 'Reports',
  path: '/reports',
  roles: ['admin', 'manager', 'sales'] // Added 'sales'
}
```

## Demo Credentials Summary

| Email | Role | Purpose |
|-------|------|---------|
| admin@crm.com | Admin | Full system access |
| manager@crm.com | Manager | Team management |
| sarah@crm.com | Sales | Core CRM work |
| voice@crm.com | Voice Agent | Call handling |
| chat@crm.com | Chat | Messaging |

**Password:** Any password works (demo mode)

## Session Management

Currently, the authentication is **in-memory** (resets on page refresh).

### For Production:
```jsx
// Use JWT tokens instead
const [token, setToken] = useState(localStorage.getItem('token'));

// Persist to localStorage
const login = async (email, password) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  setToken(data.token);
};

// Clear on logout
const logout = () => {
  localStorage.removeItem('token');
  setToken(null);
};
```

## Backend Integration

### Current (Demo)
```jsx
const login = (email, password) => {
  // Mocked - determines role by email
  return new Promise(resolve => {
    setTimeout(() => {
      // Set user and role
      resolve(true);
    }, 800);
  });
};
```

### With Real Backend
```jsx
const login = async (email, password) => {
  const response = await fetch('https://api.yourserver.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (data.success) {
    setUser(data.user);
    setRole(data.role);
    return true;
  }
  throw new Error(data.message);
};
```

## Permission-Based Features

You can expand the role system to check specific permissions:

```jsx
const hasPermission = (permission) => {
  const permissions = {
    'admin': ['*'], // all permissions
    'manager': ['view_leads', 'edit_leads', 'view_reports'],
    'sales': ['view_leads', 'create_lead', 'edit_own_leads'],
    'voice': ['upload_voice', 'view_calls'],
    'chat': ['send_message', 'view_chat']
  };

  const userPerms = permissions[role] || [];
  return userPerms.includes(permission) || userPerms.includes('*');
};
```

Then use it in components:
```jsx
{hasPermission('edit_lead') && <EditButton />}
```

## Security Notes

⚠️ **This is a DEMO application**

For production use:
- Never hardcode roles based on email
- Implement proper backend authentication
- Use JWT tokens with expiration
- Store tokens securely (httpOnly cookies)
- Validate permissions on backend
- Implement CSRF protection
- Use HTTPS only
- Add rate limiting
- Log authentication events

## Support

For questions about the auth system:
1. Check the code comments in crm-dashboard.jsx
2. Review the README.md for full documentation
3. Examine the demo credentials above
4. Test each role to understand access levels

---

**Authentication System Complete ✅**