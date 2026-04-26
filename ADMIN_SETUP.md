# Admin Account Setup Guide

## ℹ️ About Admin Accounts

There are **no hardcoded admin credentials** in the codebase for security reasons. You need to create an admin account manually in the database or through the registration system.

---

## 🔧 Method 1: Create Admin via SQL (Recommended for First Admin)

### Step 1: Open SQL Server Management Studio (SSMS)

1. Open **SQL Server Management Studio**
2. Connect to: `DESKTOP-KFTTOVK`
3. User: `job_portal`
4. Password: `12345678`

### Step 2: Create Admin in Database

1. Navigate to: `JobPortalDB_F` → `Databases`
2. Right-click and select **New Query**
3. Copy and paste this SQL:

```sql
USE JobPortalDB_F;

-- Check if admin already exists
SELECT * FROM Admins WHERE Username = 'admin';

-- If no admin exists, create one with a hashed password
-- Password: Admin@123 (hashed with bcryptjs)
INSERT INTO Admins (Username, PasswordHash)
VALUES (
  'admin',
  '$2a$10$n/Ksi6LPXeHPWjfLhQvAHu.SxC5HyECNvEsVpYCHqcxGN2pNmXQOi'
);

-- If you want to set a different password, you need to:
-- 1. Generate the bcrypt hash first (see Method 2)
-- 2. Then update with your hash
```

4. Click **Execute** (or press F5)

### Step 3: Verify Admin Created

```sql
SELECT * FROM Admins WHERE Username = 'admin';
```

You should see one row with:
- Username: `admin`
- PasswordHash: `$2a$10$n/Ksi6LPXeHPWjfLhQvAHu.SxC5HyECNvEsVpYCHqcxGN2pNmXQOi`

### Step 4: Login

- **URL**: `http://localhost:3000/login`
- **Role**: Admin
- **Username**: `admin`
- **Password**: `Admin@123`

---

## 🔑 Method 2: Create Admin with Custom Password

If you want to use a different password, you need to generate the bcrypt hash first.

### Step 1: Generate bcrypt Hash

Run this Node.js command:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword123', 10).then(hash => console.log(hash));"
```

Example output:
```
$2a$10$abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234
```

### Step 2: Insert into Database

Replace the hash in this SQL and run it:

```sql
USE JobPortalDB_F;

INSERT INTO Admins (Username, PasswordHash)
VALUES ('admin', 'PASTE_THE_HASH_HERE');
```

### Step 3: Login with Your Password

- **Username**: `admin`
- **Password**: `YourPassword123` (the one you hashed)

---

## 📱 Method 3: Register via UI (If Registration Allows Admin)

### Step 1: Go to Registration Page

- URL: `http://localhost:3000/signup`

### Step 2: Select "Admin" Role

(If the UI doesn't show Admin option, use **Method 1 or 2** instead)

### Step 3: Fill in Credentials

- **Username**: Your chosen username
- **Password**: Your chosen password
- Confirm password

### Step 4: Create Account

You should be able to login immediately.

---

## 🔓 Default Admin (Pre-made)

If you want to use the pre-made hash, here are the credentials:

**Pre-made Admin Account:**
```
Username: admin
Password: Admin@123
Hash: $2a$10$n/Ksi6LPXeHPWjfLhQvAHu.SxC5HyECNvEsVpYCHqcxGN2pNmXQOi
```

### SQL to Create Pre-made Admin:

```sql
USE JobPortalDB_F;

-- Create the pre-made admin account
INSERT INTO Admins (Username, PasswordHash)
SELECT 'admin', '$2a$10$n/Ksi6LPXeHPWjfLhQvAHu.SxC5HyECNvEsVpYCHqcxGN2pNmXQOi'
WHERE NOT EXISTS (SELECT 1 FROM Admins WHERE Username = 'admin');
```

---

## 🚀 Quick Start for First Admin

If you just want to get started quickly:

1. **Open SQL Server Management Studio**
2. **Connect** to `DESKTOP-KFTTOVK` with user `job_portal` and password `12345678`
3. **Create new query** in `JobPortalDB_F` database
4. **Copy and paste** this:

```sql
USE JobPortalDB_F;

INSERT INTO Admins (Username, PasswordHash)
SELECT 'admin', '$2a$10$n/Ksi6LPXeHPWjfLhQvAHu.SxC5HyECNvEsVpYCHqcxGN2pNmXQOi'
WHERE NOT EXISTS (SELECT 1 FROM Admins WHERE Username = 'admin');

SELECT 'Admin account created successfully!' AS Message;
SELECT * FROM Admins;
```

5. **Click Execute** (F5)
6. **Login** at `http://localhost:3000/login` as:
   - Role: **Admin**
   - Username: **admin**
   - Password: **Admin@123**

---

## 🔄 Creating Additional Admins

You can create more admin accounts by:

### Option 1: Direct SQL Insert

```sql
INSERT INTO Admins (Username, PasswordHash)
VALUES ('admin2', '$2a$10$hash_here');
```

### Option 2: Using Node.js

```bash
node -e "
const bcrypt = require('bcryptjs');
const username = 'admin2';
const password = 'SecurePassword123';

bcrypt.hash(password, 10).then(hash => {
  console.log('INSERT INTO Admins (Username, PasswordHash) VALUES (\\'' + username + '\\', \\'' + hash + '\\');');
});
"
```

---

## ⚠️ Security Notes

1. **Change Default Password**: If using the pre-made admin account, change the password immediately in production
2. **Strong Passwords**: Always use strong passwords (12+ characters, mix of upper/lower/numbers/symbols)
3. **Hash Passwords**: Never store plain passwords - always use bcrypt
4. **Environment**: Keep `.env` file secure and never commit credentials to git
5. **JWT Secret**: Change `JWT_SECRET` in `.env` for production

---

## 🆘 Troubleshooting

### "Invalid credentials" when logging in as admin

1. Check that username and password match exactly (case-sensitive username)
2. Verify admin exists in database:
   ```sql
   SELECT * FROM Admins WHERE Username = 'admin';
   ```
3. Make sure you generated the correct bcrypt hash if using custom password

### "Admin role is not available" in registration

- The registration form might not have Admin option
- Use SQL method (Method 1) to create admin directly

### Forgot admin password

1. Generate new hash:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('NewPassword123', 10).then(hash => console.log(hash));"
   ```

2. Update in database:
   ```sql
   UPDATE Admins 
   SET PasswordHash = '$2a$10$new_hash_here'
   WHERE Username = 'admin';
   ```

3. Login with new password

---

## 📋 Summary

| Method | Steps | Time | Notes |
|--------|-------|------|-------|
| SQL Insert | 3-4 | <1 min | ✅ Fastest, use for first admin |
| Custom Password | 4-5 | 2 min | ✅ Best for production |
| UI Registration | 3 | 2 min | ❌ May not allow admin role |

**Recommended**: Use **Method 1** for quick setup, then change password using **Method 2** for production.

---

**Admin account is now ready! You can access admin dashboard at `http://localhost:3000/dashboard/admin`** 🎉
