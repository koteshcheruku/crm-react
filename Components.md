# 🏗️ Component Documentation & Architecture

## Component Tree

```
CRMDashboard (main)
├── Router
└── AuthProvider
    └── App
        ├── LoginPage
        ├── MainLayout
        │   ├── Sidebar
        │   ├── Header
        │   └── [Page Content]
        │       ├── DashboardPage
        │       ├── LeadsPage
        │       ├── CustomersPage
        │       ├── TasksPage
        │       ├── CommunicationsPage
        │       ├── ChatPage
        │       ├── DocumentsPage
        │       ├── ReportsPage
        │       ├── UserManagementPage
        │       ├── RoleManagementPage
        │       └── SettingsPage
        └── RoleGuard (for protected routes)
```

## Core Components

### 1. AuthProvider & AuthContext

**Purpose:** Global authentication state management

**Props:** None (wrapper component)

**Provides:**
```jsx
{
  user: { name: string, email: string },
  role: 'admin' | 'manager' | 'sales' | 'voice' | 'chat',
  login: (email: string, password: string) => Promise<boolean>,
  logout: () => void,
  isLoading: boolean
}
```

**Example:**
```jsx
const { user, role, login, logout } = useAuth();
```

---

### 2. Sidebar

**Purpose:** Main navigation menu

**Props:**
- `isOpen: boolean` - Mobile sidebar visibility
- `onClose: () => void` - Close sidebar handler

**Features:**
- Role-based menu items
- Company logo
- Settings & logout
- Mobile overlay
- Responsive design

**Menu Items Shown by Role:**
```
Admin:      All 11 items
Manager:    10 items (no admin features)
Sales:      7 items (core CRM)
Voice:      4 items (voice focused)
Chat:       3 items (chat focused)
```

---

### 3. Header

**Purpose:** Top navigation and user info

**Props:**
- `onMenuClick: () => void` - Mobile menu toggle

**Features:**
- Current time display (updates every second)
- User name & role
- Notifications bell
- Profile dropdown
- Responsive layout

**Displays:**
- User's full name
- User's role (formatted)
- Time in HH:MM:SS format
- Notification indicator

---

### 4. MainLayout

**Purpose:** Layout wrapper for all pages

**Props:**
- `children: ReactNode` - Page content

**Structure:**
- Sidebar (responsive)
- Header (sticky)
- Main content area (scrollable)

**Features:**
- Mobile hamburger menu
- Responsive grid
- Auto-hide mobile sidebar

---

### 5. RoleGuard

**Purpose:** Route protection based on user role

**Props:**
- `allowedRoles: string[]` - Array of allowed roles
- `children: ReactNode` - Page content

**Behavior:**
- If user role in allowedRoles → render children
- Otherwise → redirect to dashboard

**Example:**
```jsx
<RoleGuard allowedRoles={['admin', 'manager']}>
  <AdminPage />
</RoleGuard>
```

---

### 6. Toast (Notification)

**Purpose:** Temporary notifications

**Props:**
- `message: string` - Notification text
- `type: 'success' | 'error' | 'info' | 'warning'` - Type
- `duration: number` - Display duration (ms)

**Colors:**
- Success: `bg-emerald-500`
- Error: `bg-red-500`
- Info: `bg-blue-500`
- Warning: `bg-amber-500`

---

## Page Components

### DashboardPage

**Route:** `/dashboard`

**Access:** All roles

**Displays:**
- 4 metric cards (Leads, New Leads, Follow-ups, Tasks)
- Leads by Status chart
- Performance metrics
- Recent activity feed

**Metrics:**
```jsx
[
  { Total Leads: 45 },
  { New Leads Today: 8 },
  { Follow-ups Today: 12 },
  { Active Tasks: 24 }
]
```

---

### LeadsPage

**Route:** `/leads`

**Access:** admin, manager, sales, voice

**Features:**
- Leads table with 7 columns
- Search by name or phone
- Filter by status (New, Contacted, Qualified, Converted)
- View/Edit/Convert actions
- Add Lead button

**Table Columns:**
- Name (string)
- Phone (string)
- Source (Website, LinkedIn, Referral, Cold Call, Email)
- Status (New, Contacted, Qualified, Converted)
- Assigned To (user name)
- Follow-up (date)
- Actions (buttons)

**Status Colors:**
- New: Blue
- Contacted: Purple
- Qualified: Emerald
- Converted: Orange

---

### CustomersPage

**Route:** `/customers`

**Access:** admin, manager, sales

**Features:**
- Customers table with 5 columns
- Company information
- Contact details
- Account manager assignment
- Edit/View actions
- Add Customer button

**Table Columns:**
- Name (company name)
- Phone (contact number)
- Email (contact email)
- Account Manager (assigned user)
- Actions (buttons)

---

### TasksPage

**Route:** `/tasks`

**Access:** admin, manager, sales, voice, chat

**Features:**
- Tasks table with 5 columns
- Priority levels
- Status tracking
- Due date management
- Create Task button

**Table Columns:**
- Task (description)
- Assigned To (user name)
- Priority (High, Medium, Low)
- Status (Pending, In Progress, Completed)
- Due Date (YYYY-MM-DD)

**Priority Colors:**
- High: Red
- Medium: Amber
- Low: Emerald

**Status Colors:**
- Pending: Slate
- In Progress: Blue
- Completed: Emerald

---

### CommunicationsPage

**Route:** `/communications`

**Access:** admin, manager, sales, voice

**Features:**
- 3 tabs (Calls, Voice Recordings, Chat)
- Communications table
- Type, contact, user, summary, date
- Search functionality

**Table Columns:**
- Type (Call, Voice Recording, Chat)
- Contact (lead/customer name)
- User (who handled)
- Summary (description)
- Date & Time (timestamp)

---

### ChatPage

**Route:** `/chat`

**Access:** admin, manager, chat

**Features:**
- Chat list sidebar (hidden on mobile)
- Main chat window
- Message display
- Send message box
- File attachment button
- Online status indicators

**Message Structure:**
```jsx
{
  id: number,
  user: 'You' | string,
  text: string,
  timestamp: string (HH:MM format)
}
```

**Chat List Items:**
```jsx
{
  id: number,
  name: string,
  status: 'Active' | 'Away',
  lastMessage: string,
  time: string
}
```

---

### DocumentsPage

**Route:** `/documents`

**Access:** admin, manager, sales

**Features:**
- Documents table
- File type badge
- Upload tracking
- Download/View actions
- Upload Document button

**Table Columns:**
- File Name (string)
- Type (PDF, DOCX, etc.)
- Uploaded By (user name)
- Date (YYYY-MM-DD)
- Actions (Download, View)

---

### UserManagementPage

**Route:** `/users`

**Access:** admin only

**Features:**
- Users table
- Role assignment
- Status tracking
- Edit actions
- Add User button

**Table Columns:**
- Name (user name)
- Email (contact email)
- Role (Admin, Manager, Sales, Voice, Chat)
- Status (Active/Inactive)
- Actions (Edit)

---

### RoleManagementPage

**Route:** `/roles`

**Access:** admin only

**Features:**
- Role cards (grid layout)
- Permissions display
- User count per role
- Edit actions
- Create Role button

**Role Cards Display:**
```jsx
{
  name: string,
  permissions: string[],
  users: number
}
```

---

### ReportsPage

**Route:** `/reports`

**Access:** admin, manager only

**Features:**
- 3 report cards
- Icons for each report type
- Interactive cards

**Available Reports:**
1. Sales Performance
2. Lead Analysis
3. Team Activity

---

### SettingsPage

**Route:** `/settings`

**Access:** All roles

**Sections:**

1. **Profile Settings**
   - Full Name (text input)
   - Email (text input)

2. **Change Password**
   - Current Password (password input)
   - New Password (password input)
   - Update button

3. **Notification Preferences**
   - Email Notifications (checkbox)
   - Task Reminders (checkbox)
   - Lead Updates (checkbox)

---

### LoginPage

**Route:** `/login`

**Access:** Unauthenticated users only

**Features:**
- Email input
- Password input
- Show/Hide password toggle
- Remember me checkbox
- Sign In button
- Forgot password link
- Demo credentials display

**Styling:**
- Gradient background
- Centered card layout
- Animated background elements
- Error message display

**Demo Credentials Shown:**
```
👤 Admin: admin@crm.com
👤 Manager: manager@crm.com
🎤 Voice: voice@crm.com
Password: any text
```

---

## Hooks & Functions

### useAuth()

```jsx
const { user, role, login, logout, isLoading } = useAuth();

// user: { name, email } | null
// role: 'admin' | 'manager' | 'sales' | 'voice' | 'chat' | null
// login: (email, password) => Promise<boolean>
// logout: () => void
// isLoading: boolean
```

### useNavigate() (React Router)

```jsx
const navigate = useNavigate();
navigate('/path');
navigate(-1); // Go back
```

### useLocation() (React Router)

```jsx
const location = useLocation();
console.log(location.pathname); // Current path
```

---

## Styling System

### Color Scheme

**Primary Colors:**
- Blue: `#2563eb` (600), `#3b82f6` (500), `#60a5fa` (400)
- Cyan: `#06b6d4` (400)
- Slate: `#64748b` (600), `#0f172a` (900)

**Status Colors:**
- Success: Emerald `#10b981` (500), `#d1fae5` (100)
- Error: Red `#ef4444` (500), `#fee2e2` (100)
- Warning: Amber `#f59e0b` (500), `#fef3c7` (100)
- Info: Blue `#3b82f6` (500), `#dbeafe` (100)

### Spacing

- Small: `px-3 py-2` (buttons, badges)
- Medium: `px-4 py-3` (inputs, cards)
- Large: `px-6 py-4` (table cells)

### Shadows

- `shadow-sm` - Cards, tables
- `shadow-lg` - Dropdowns, overlays
- `shadow-2xl` - Sidebar, large modals

### Border Radius

- Small: `rounded-lg` (buttons, inputs)
- Medium: `rounded-xl` (cards)
- Full: `rounded-full` (avatars, badges)

---

## State Management

### Authentication State
```jsx
user: { name: string, email: string } | null
role: string | null
isLoading: boolean
```

### Component State Examples

**LeadsPage:**
```jsx
leads: Lead[]
statusFilter: string
searchTerm: string
```

**ChatPage:**
```jsx
selectedChat: number
messages: Message[]
newMessage: string
```

**Header:**
```jsx
time: Date (updates every second)
showDropdown: boolean
```

---

## Data Structures

### User Object
```jsx
{
  name: string,
  email: string
}
```

### Lead Object
```jsx
{
  id: number,
  name: string,
  phone: string,
  source: 'Website' | 'LinkedIn' | 'Referral' | 'Cold Call' | 'Email',
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted',
  assignedTo: string,
  followUp: string // YYYY-MM-DD
}
```

### Customer Object
```jsx
{
  id: number,
  name: string,
  company: string,
  phone: string,
  email: string,
  manager: string
}
```

### Task Object
```jsx
{
  id: number,
  task: string,
  assignedTo: string,
  priority: 'High' | 'Medium' | 'Low',
  status: 'Pending' | 'In Progress' | 'Completed',
  dueDate: string // YYYY-MM-DD
}
```

### Message Object
```jsx
{
  id: number,
  user: 'You' | string,
  text: string,
  timestamp: string // HH:MM format
}
```

---

## Responsive Breakpoints

```
Mobile:  < 768px  (w-full, single column)
Tablet:  768px - 1024px (2 columns)
Desktop: > 1024px (3-4 columns)
```

**Responsive Classes Used:**
- `hidden lg:flex` - Hide on mobile, show on desktop
- `grid grid-cols-1 lg:grid-cols-2` - Single column mobile, 2 columns desktop
- `w-full lg:w-64` - Full width mobile, fixed width desktop
- `block lg:hidden` - Show mobile menu only

---

## Icons Used (Lucide React)

- `Menu` - Mobile menu toggle
- `X` - Close button
- `Bell` - Notifications
- `Settings` - Settings menu
- `LogOut` - Logout button
- `ChevronDown` - Dropdown arrow
- `Search` - Search input
- `Plus` - Add buttons
- `Eye` - View/Show
- `Edit2` - Edit buttons
- `Send` - Send message
- `BarChart3` - Analytics
- `TrendingUp` - Growth
- `Clock` - Time/Schedule
- `CheckSquare` - Tasks
- `Users` - People
- `Phone` - Calls
- `MessageSquare` - Messages
- `FileText` - Documents
- `Lock` - Security
- `User` - Profile
- `Calendar` - Dates
- `Paperclip` - Attachments
- `Mic` - Audio/Voice
- `Play` - Play audio
- `Download` - Download files
- `Home` - Dashboard
- `Filter` - Filtering
- `AlertCircle` - Alerts/Errors

---

## Performance Optimizations

1. **React.StrictMode** - Development warnings
2. **Lazy Loading** - Routes with suspense-ready
3. **Event Delegation** - Click handlers on containers
4. **Conditional Rendering** - Show/hide based on state
5. **Memoization Ready** - Components can use React.memo()

---

## Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Accessibility Features

- Semantic HTML (`<button>`, `<input>`, `<table>`)
- Alt text for icons (via Lucide)
- Focus states on interactive elements
- Keyboard navigation ready
- Color contrast compliance (WCAG AA)
- Form labels present

---

## Testing Considerations

### Unit Test Examples

```jsx
describe('RoleGuard', () => {
  it('renders children when role is allowed', () => {
    // Test with allowedRoles
  });

  it('redirects when role is not allowed', () => {
    // Test redirect behavior
  });
});
```

### Component Tests
- Login flow
- Role-based access
- Navigation between pages
- Form submissions
- Data filtering

---

**Component Architecture Complete ✅**