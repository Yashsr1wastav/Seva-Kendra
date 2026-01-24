# Multi-User Authentication & Authorization Implementation

## Overview
This document describes the implementation of a comprehensive role-based access control (RBAC) system for the Seva Kendra CRM application.

## Features

### 1. Role-Based Access Control
- **Admin Role**: Full system access with ability to manage users and permissions
- **User Role**: Limited access based on assigned permissions

### 2. Module-Based Permissions
Permissions are organized by module and action:

#### Modules:
- `health` - Health Services
- `education` - Education Programs
- `socialJustice` - Social Justice Programs
- `users` - User Management
- `reports` - System Reports

#### Actions:
- `view` - Read access
- `create` - Create new records
- `edit` - Update existing records
- `delete` - Delete records
- `export` - Export data

#### Permission Format:
Permissions are stored as strings in the format: `module:action`
Example: `health:view`, `education:create`, `socialJustice:delete`

### 3. Default Permissions

#### Admin (19 permissions):
- Full access to all modules and all actions
- Can manage users and their permissions
- Cannot be deleted or have permissions removed

#### Regular User (3 permissions by default):
- `health:view`
- `education:view`
- `socialJustice:view`

## Backend Implementation

### Database Schema

#### User Model Updates (`user.model.js`)
```javascript
{
  firstName: String,        // User's first name
  lastName: String,         // User's last name
  email: String,           // Unique email (used for login)
  password: String,        // Bcrypt hashed password
  role: String,            // 'admin' or 'user'
  status: String,          // 'active', 'suspended', or 'pending'
  permissions: [String],   // Array of permission strings
  lastLogin: Date,         // Last login timestamp
  createdAt: Date,
  updatedAt: Date
}
```

### Middleware

#### Permission Middleware (`permissionMiddleware.js`)
- `checkPermission(module, action)` - Validates single permission
- `checkAnyPermission(permissionPairs)` - Validates any of multiple permissions
- `adminOnly()` - Restricts access to admins only
- `hasPermission(user, module, action)` - Utility function to check user permissions

#### Auth Middleware Updates (`authMiddleware.js`)
- Enhanced to include user permissions in `req.user`
- Validates JWT tokens
- Adds role and permissions to request context

### Services

#### User Service (`user.service.js`)
- `getAllUsers(filters, pagination)` - Get all users with filtering
- `getUserById(userId)` - Get single user details
- `createUserByAdmin(userData)` - Admin creates new user
- `updateUser(userId, updateData)` - Update user profile
- `deleteUser(userId)` - Delete user (admin only)
- `updateUserPermissions(userId, permissions)` - Update user permissions
- `getUserStats()` - Get user statistics

#### Auth Service Updates (`auth.service.js`)
- Login now returns user permissions
- Updates lastLogin timestamp
- Includes role and permissions in JWT payload

### Routes

#### User Routes (`user.router.js`)
```
GET    /api/v1/user              - Get all users (admin only)
POST   /api/v1/user              - Create user (admin only)
GET    /api/v1/user/stats        - Get user stats (admin only)
GET    /api/v1/user/profile      - Get current user profile
GET    /api/v1/user/:id          - Get user by ID (admin only)
PUT    /api/v1/user/:id          - Update user (admin only)
DELETE /api/v1/user/:id          - Delete user (admin only)
PUT    /api/v1/user/:id/permissions - Update user permissions (admin only)
```

#### Protected Module Routes
All health, education, and social justice routes now require:
1. Valid JWT token (`verifyTokenExists`)
2. Appropriate module permission (`checkPermission`)

Example:
```javascript
router.get("/", verifyTokenExists, checkPermission("health", "view"), controller.getAll);
router.post("/", verifyTokenExists, checkPermission("health", "create"), controller.create);
router.put("/:id", verifyTokenExists, checkPermission("health", "edit"), controller.update);
router.delete("/:id", verifyTokenExists, checkPermission("health", "delete"), controller.delete);
```

### Admin Creation Script (`scripts/createAdmin.js`)

Run to create the first admin user:
```bash
node scripts/createAdmin.js
```

Default admin credentials:
- Email: admin@sevakendra.com
- Password: admin123

The script automatically assigns all 19 admin permissions.

## Frontend Implementation

### Context

#### Auth Context Updates (`AuthContext.jsx`)
Added permission checking utilities:
- `hasPermission(module, action)` - Check if user has specific permission
- `hasAnyPermission(permissionPairs)` - Check if user has any of multiple permissions
- User object now includes: `role`, `permissions`, `firstName`, `lastName`, `status`, `lastLogin`

### Components

#### User Management Page (`UserManagement.jsx`)
Complete user administration interface:

**Features:**
- User listing with search and filters
- Create new users
- Edit user details
- Manage user permissions with intuitive UI
- Delete users (except admins)
- View user statistics
- Role-based UI (only admins can access)

**Permission Management UI:**
- Visual permission grid organized by module
- Checkbox interface for easy permission assignment
- Real-time permission updates
- Prevents modification of admin permissions

#### Sidebar Updates (`Sidebar.jsx`)
- User Management menu item (admin only)
- Uses `useAuth` to check user role
- Conditionally renders based on permissions

### Routes

#### App.jsx Updates
```javascript
<Route path="/users" element={
  <ProtectedRoute>
    <UserManagement />
  </ProtectedRoute>
} />
```

## Security Features

1. **JWT Authentication**: All routes protected with token verification
2. **Permission-Based Access**: Granular control over module and action access
3. **Admin Protection**: Admin users cannot be deleted or lose permissions
4. **Password Security**: Bcrypt hashing with salt rounds
5. **Token Expiry**: JWT tokens expire after configured time
6. **Input Validation**: Email uniqueness, password strength requirements
7. **Status Management**: Users can be suspended without deletion

## Usage Examples

### Creating a User (Admin)
1. Login as admin
2. Navigate to User Management
3. Click "Add User"
4. Fill in user details (firstName, lastName, email, password, role)
5. Click "Create User"
6. Optionally, click permission icon to customize permissions

### Assigning Permissions (Admin)
1. In User Management, find the user
2. Click the shield icon (Permissions)
3. Check/uncheck permissions by module and action
4. Click "Save Permissions"

### Testing Permissions
1. Login as a regular user
2. Access will be restricted based on assigned permissions
3. Unauthorized actions will return 403 Forbidden

## API Response Examples

### Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "active",
      "permissions": [
        "health:view",
        "education:view",
        "education:create"
      ],
      "lastLogin": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Permission Denied Response
```json
{
  "success": false,
  "message": "You do not have permission to perform this action. Required: education:create",
  "statusCode": 403
}
```

### Get All Users Response (Admin)
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

## Environment Variables

Add to `.env`:
```
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
```

## Testing Checklist

- [ ] Create admin user using script
- [ ] Login as admin
- [ ] Access User Management page
- [ ] Create a regular user
- [ ] Assign custom permissions to user
- [ ] Logout and login as regular user
- [ ] Verify module access based on permissions
- [ ] Test unauthorized actions (should get 403)
- [ ] Test permission-based UI rendering
- [ ] Test user CRUD operations (admin only)
- [ ] Test permission updates
- [ ] Test user status changes (suspend/activate)

## Future Enhancements

1. **Permission Groups**: Create reusable permission templates
2. **Audit Logging**: Track permission changes and user actions
3. **Time-Based Permissions**: Temporary access grants
4. **IP Restrictions**: Limit access by IP address
5. **Two-Factor Authentication**: Enhanced security
6. **Session Management**: View and revoke active sessions
7. **Bulk Operations**: Assign permissions to multiple users
8. **Permission Inheritance**: Role-based permission templates

## Troubleshooting

### Users can't login after implementation
- Run the createAdmin script to create the first admin
- Existing users need to be updated with firstName, lastName, and permissions fields
- Check database for user records

### Permission checks failing
- Verify middleware order: `verifyTokenExists` must come before `checkPermission`
- Check that permissions array exists on user object
- Ensure JWT includes role and permissions

### Admin can't access user management
- Verify role is exactly "admin" (case-sensitive)
- Check Sidebar component has `useAuth` import
- Ensure user object is available in context

### Frontend permission checks not working
- Verify AuthContext exports `hasPermission` and `hasAnyPermission`
- Check that user data includes permissions array
- Ensure localStorage has updated user object

## Migration Notes

For existing databases:
1. Run createAdmin script to create admin user
2. Existing users will have default permissions based on role
3. Update existing user documents to include firstName, lastName
4. Consider running a migration script to add missing fields

## Support

For issues or questions, refer to:
- Backend: `sevaKendra-backend/README.md`
- Frontend: `Frontend/README.md`
- API Documentation: `/api/v1/docs` (if configured)
