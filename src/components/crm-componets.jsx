// ============================================================================
// REUSABLE HELPER COMPONENTS - COPY & PASTE READY
// ============================================================================
// Use these components across your pages
// Import them into your pages and use them directly
// ============================================================================

import React, { useState, useEffect } from 'react';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';

// ============================================================================
// 1. DATA TABLE COMPONENT - REUSABLE
// ============================================================================

export const DataTable = ({
  columns = [],
  data = [],
  onRowClick = null,
  rowActions = null,
  striped = true,
  hoverable = true,
  responsive = true,
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${responsive ? 'overflow-x-auto' : ''}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-4 text-left text-sm font-semibold text-slate-900"
                style={{ minWidth: col.minWidth || '100px' }}
              >
                {col.label}
              </th>
            ))}
            {rowActions && <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              onClick={() => onRowClick && onRowClick(row)}
              className={`border-b border-slate-100 ${hoverable ? 'hover:bg-slate-50' : ''} transition-colors cursor-pointer`}
            >
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className={`px-6 py-4 ${col.className || 'text-slate-600'}`}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {rowActions && (
                <td className="px-6 py-4 flex gap-2">
                  {rowActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================================
// 2. BADGE/PILL COMPONENT - REUSABLE
// ============================================================================

export const Badge = ({
  text,
  type = 'info', // 'success', 'error', 'warning', 'info', 'primary'
  size = 'sm', // 'sm', 'md', 'lg'
  variant = 'filled', // 'filled', 'outline'
}) => {
  const colors = {
    success: 'bg-emerald-100 text-emerald-700',
    error: 'bg-red-100 text-red-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-blue-100 text-blue-700',
    primary: 'bg-blue-100 text-blue-700',
  };

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const outlineColors = {
    success: 'border border-emerald-200 text-emerald-700 bg-emerald-50',
    error: 'border border-red-200 text-red-700 bg-red-50',
    warning: 'border border-amber-200 text-amber-700 bg-amber-50',
    info: 'border border-blue-200 text-blue-700 bg-blue-50',
    primary: 'border border-blue-200 text-blue-700 bg-blue-50',
  };

  const bgColor = variant === 'filled' ? colors[type] : outlineColors[type];
  const fontWeight = size === 'sm' ? 'font-semibold' : 'font-medium';

  return (
    <span className={`inline-block rounded-full ${sizes[size]} ${bgColor} ${fontWeight}`}>
      {text}
    </span>
  );
};

// ============================================================================
// 3. MODAL/DIALOG COMPONENT - REUSABLE
// ============================================================================

export const Modal = ({
  isOpen = false,
  onClose = () => {},
  title = '',
  children = null,
  footerActions = null,
  size = 'md', // 'sm', 'md', 'lg', 'xl'
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-xl shadow-2xl p-8 w-full ${sizes[size]}`}>
        {title && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          </div>
        )}

        <div className="mb-6">
          {children}
        </div>

        {footerActions && (
          <div className="flex gap-3 justify-end">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 4. BUTTON COMPONENT - REUSABLE
// ============================================================================

export const Button = ({
  children,
  onClick = () => {},
  variant = 'primary', // 'primary', 'secondary', 'danger', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg',
    secondary: 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-slate-600 hover:bg-slate-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-lg font-semibold transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

// ============================================================================
// 5. CARD COMPONENT - REUSABLE
// ============================================================================

export const Card = ({
  children,
  title = '',
  footer = null,
  className = '',
  hoverable = false,
  onClick = null,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border border-slate-100 p-6
        ${hoverable ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}
        ${className}
      `}
    >
      {title && (
        <h3 className="text-lg font-bold text-slate-900 mb-4">{title}</h3>
      )}
      <div>
        {children}
      </div>
      {footer && (
        <div className="mt-6 pt-6 border-t border-slate-100">
          {footer}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 6. INPUT COMPONENT - REUSABLE
// ============================================================================

export const Input = ({
  label = '',
  value = '',
  onChange = () => {},
  type = 'text',
  placeholder = '',
  required = false,
  error = '',
  helper = '',
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors
          ${error ? 'border-red-500 bg-red-50' : 'border-slate-300'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {helper && !error && <p className="text-slate-500 text-sm mt-1">{helper}</p>}
    </div>
  );
};

// ============================================================================
// 7. SELECT/DROPDOWN COMPONENT - REUSABLE
// ============================================================================

export const Select = ({
  label = '',
  value = '',
  onChange = () => {},
  options = [],
  placeholder = 'Select...',
  required = false,
  error = '',
  className = '',
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 border border-slate-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500 bg-red-50' : ''}
          ${className}
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

// ============================================================================
// 8. TOAST NOTIFICATION COMPONENT - REUSABLE
// ============================================================================

export const Toast = ({
  message = '',
  type = 'info', // 'success', 'error', 'warning', 'info'
  duration = 3000,
  onClose = () => {},
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in z-50`}>
      {message}
    </div>
  );
};

// ============================================================================
// 9. LOADING SKELETON - REUSABLE
// ============================================================================

export const Skeleton = ({
  count = 1,
  height = 'h-6',
  width = 'w-full',
  className = '',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${height} ${width} bg-slate-200 rounded-lg animate-pulse ${className} mb-4`}
        />
      ))}
    </>
  );
};

// ============================================================================
// 10. EMPTY STATE COMPONENT - REUSABLE
// ============================================================================

export const EmptyState = ({
  title = 'No items found',
  description = 'Get started by creating your first item',
  icon = null,
  action = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

// ============================================================================
// 11. PAGINATION COMPONENT - REUSABLE
// ============================================================================

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) => {
  return (
    <div className="flex gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-400"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentPage === i + 1
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-slate-300 hover:border-slate-400'
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-400"
      >
        Next
      </button>
    </div>
  );
};

// ============================================================================
// 12. STAT CARD COMPONENT - REUSABLE
// ============================================================================

export const StatCard = ({
  label = '',
  value = '',
  icon: Icon = null,
  trend = '',
  color = 'from-blue-500 to-cyan-400',
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
            <Icon size={24} className="text-white" />
          </div>
        )}
      </div>
      <p className="text-slate-600 text-sm font-medium mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {trend && <p className="text-xs text-emerald-600 font-semibold">{trend}</p>}
      </div>
    </div>
  );
};

// ============================================================================
// 13. FORM COMPONENT - REUSABLE
// ============================================================================

export const Form = ({
  fields = [], // Array of field configs
  onSubmit = () => {},
  submitText = 'Submit',
  isLoading = false,
}) => {
  const [values, setValues] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.initialValue || '' }), {})
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          {field.type === 'text' || field.type === 'email' || field.type === 'password' ? (
            <Input
              label={field.label}
              name={field.name}
              type={field.type}
              value={values[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
              error={errors[field.name]}
            />
          ) : field.type === 'select' ? (
            <Select
              label={field.label}
              name={field.name}
              value={values[field.name]}
              onChange={handleChange}
              options={field.options}
              required={field.required}
              error={errors[field.name]}
            />
          ) : null}
        </div>
      ))}

      <Button
        variant="primary"
        size="md"
        type="submit"
        loading={isLoading}
        className="w-full"
      >
        {submitText}
      </Button>
    </form>
  );
};

// ============================================================================
// 14. CONFIRMATION DIALOG - REUSABLE
// ============================================================================

export const ConfirmDialog = ({
  isOpen = false,
  title = 'Confirm',
  message = 'Are you sure?',
  onConfirm = () => {},
  onCancel = () => {},
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="sm"
    >
      <p className="text-slate-600 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button
          variant={isDangerous ? 'danger' : 'primary'}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

// ============================================================================
// 15. SEARCH INPUT - REUSABLE
// ============================================================================

import { Search } from 'lucide-react';

export const SearchInput = ({
  value = '',
  onChange = () => {},
  placeholder = 'Search...',
  onSearch = () => {},
}) => {
  return (
    <div className="relative flex-1">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================
/*

// 1. Using DataTable:
<DataTable
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => <Badge text={value} type={value === 'Active' ? 'success' : 'warning'} />
    }
  ]}
  data={users}
  rowActions={(row) => (
    <>
      <button>Edit</button>
      <button>Delete</button>
    </>
  )}
/>

// 2. Using Modal:
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Add New Lead"
  footerActions={
    <>
      <Button variant="secondary" onClick={() => setShowModal(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleAdd}>
        Save
      </Button>
    </>
  }
>
  <Form fields={formFields} onSubmit={handleSubmit} />
</Modal>

// 3. Using Badge:
<Badge text="Active" type="success" size="sm" />
<Badge text="Pending" type="warning" variant="outline" />

// 4. Using Toast:
const [toasts, setToasts] = useState([]);
const addToast = (message, type) => {
  setToasts([...toasts, { id: Date.now(), message, type }]);
};

// 5. Using Card:
<Card title="Sales Metrics">
  <p>Your content here</p>
</Card>

// 6. Using Input:
<Input
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  type="email"
  placeholder="your@email.com"
  required
/>

*/