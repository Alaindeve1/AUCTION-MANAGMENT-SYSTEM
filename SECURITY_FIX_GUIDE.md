# Security Fix Guide - SMTP Credentials Exposure

## What Was Fixed

GitGuardian detected exposed SMTP credentials in your GitHub repository. The following changes have been made to secure your application:

### 1. Removed Hardcoded Credentials

**Files Modified:**
- `auction-system/src/main/resources/application.properties` - Removed hardcoded SMTP credentials, database password, and JWT secret
- `docker-compose.yml` - Removed hardcoded credentials

**Credentials Removed:**
- SMTP Email: `alainndizeye11@gmail.com`
- SMTP Password: `deqn wdsn mrfy wtkm`
- Database Password: `@Masengesho1`
- JWT Secret: `bXktc3VwZXItc2VjcmV0LWtleS1mb3ItanVzdC1hdWN0aW9uLXN5c3RlbQ==`

### 2. Created Template Files

- `docker-compose.local.yml.example` - Template for local development
- Updated `.gitignore` to protect sensitive files

## Immediate Actions Required

### ⚠️ CRITICAL: Rotate Your Exposed Credentials

Since these credentials were exposed in your GitHub repository, you MUST:

1. **Change Your Gmail App Password**
   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification → App passwords
   - Revoke the old app password (`deqn wdsn mrfy wtkm`)
   - Generate a new app password

2. **Change Your Database Password**
   - Update the PostgreSQL password from `@Masengesho1` to a new secure password

3. **Generate a New JWT Secret**
   - Run: `openssl rand -base64 32` to generate a new secret
   - Or use an online generator

### Setting Up Local Development

1. **Create a `.env` file** in the project root:
   ```bash
   # Copy from env.example (already exists in auction-system/)
   cp auction-system/env.example .env
   ```

2. **Fill in your credentials** in `.env`:
   ```env
   DB_PASSWORD=your_new_secure_password
   POSTGRES_PASSWORD=your_new_secure_password
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_new_app_password
   JWT_SECRET=your_new_jwt_secret
   ```

3. **Create `docker-compose.local.yml`** for local development:
   ```bash
   cp docker-compose.local.yml.example docker-compose.local.yml
   ```

4. **Update `docker-compose.local.yml`** with your local credentials

5. **Run with environment variables**:
   ```bash
   # For local development
   docker-compose -f docker-compose.local.yml up
   
   # Or use the main docker-compose.yml with .env file
   docker-compose up
   ```

### For Production Deployment

1. **Set environment variables** in your hosting platform:
   - Heroku: Use Config Vars
   - AWS: Use Secrets Manager or Parameter Store
   - Docker: Use environment variables or secrets

2. **Never commit**:
   - `.env` files
   - `docker-compose.local.yml`
   - Any file containing real credentials

## How to Use Environment Variables

### Option 1: Using .env file (Recommended for local development)

Create a `.env` file in the project root:
```env
DB_PASSWORD=your_password
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
JWT_SECRET=your_secret
```

Then run:
```bash
docker-compose up
```

### Option 2: Export environment variables

```bash
export DB_PASSWORD=your_password
export MAIL_USERNAME=your_email@gmail.com
export MAIL_PASSWORD=your_app_password
export JWT_SECRET=your_secret
docker-compose up
```

### Option 3: Using docker-compose.local.yml

Copy the example file and fill in your credentials:
```bash
cp docker-compose.local.yml.example docker-compose.local.yml
# Edit docker-compose.local.yml with your credentials
docker-compose -f docker-compose.local.yml up
```

## Security Best Practices Going Forward

1. ✅ **Never commit credentials** to version control
2. ✅ **Use environment variables** for all sensitive data
3. ✅ **Rotate credentials** immediately after exposure
4. ✅ **Use secrets management** in production (AWS Secrets Manager, Azure Key Vault, etc.)
5. ✅ **Enable GitGuardian** or similar tools to scan for exposed secrets
6. ✅ **Review commits** before pushing to ensure no credentials are included

## Testing Your Changes

After setting up your environment variables:

1. **Start the application**:
   ```bash
   docker-compose up
   ```

2. **Verify email functionality**:
   - Try the password reset feature
   - Check that emails are being sent

3. **Check logs** for any configuration errors

## Need Help?

If you encounter issues:
1. Check that all required environment variables are set
2. Verify your credentials are correct
3. Check application logs for specific error messages
4. Ensure your Gmail app password is valid

## Summary

✅ Removed all hardcoded credentials from the codebase
✅ Created template files for local development
✅ Updated .gitignore to protect sensitive files
⚠️ **YOU MUST**: Rotate your exposed credentials immediately
⚠️ **YOU MUST**: Set up environment variables before running the application

Your application is now secure, but you must rotate the exposed credentials to prevent unauthorized access.

