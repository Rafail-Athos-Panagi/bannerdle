# Security Measures for Contact Form

## 🔒 Implemented Security Features

### 1. **Input Validation & Sanitization**
- **Zod Schema Validation**: Server-side validation using Zod library
- **Character Limits**: Maximum lengths for all fields (name: 100, email: 254, subject: 200, message: 5000)
- **Pattern Validation**: Regex patterns to prevent malicious input
- **HTML Sanitization**: Removes potential HTML tags and JavaScript protocols
- **XSS Prevention**: Strips dangerous characters and event handlers

### 2. **Rate Limiting**
- **IP-based Rate Limiting**: 5 requests per 15-minute window per IP
- **Memory Store**: In-memory rate limiting (use Redis in production)
- **429 Status Code**: Proper HTTP status for rate limit exceeded
- **Retry-After Header**: Tells clients when to retry

### 3. **CSRF Protection**
- **Token Generation**: Random CSRF tokens generated client-side
- **Session Management**: Session IDs for additional security
- **Header Validation**: CSRF tokens sent in custom headers
- **Token Rotation**: New tokens generated after successful submission

### 4. **Email Security**
- **SMTP Authentication**: Secure Gmail SMTP with app passwords
- **Environment Variables**: Sensitive credentials stored in env vars
- **Email Validation**: Proper email format validation
- **Reply-To Header**: Proper email routing for responses

### 5. **Error Handling**
- **Generic Error Messages**: No internal details exposed to clients
- **Development Mode**: Detailed errors only in development
- **Logging**: Server-side logging for debugging
- **Graceful Degradation**: Proper error states in UI

### 6. **CORS Protection**
- **Origin Validation**: Restrictive CORS policy for production
- **Method Limitation**: Only POST and OPTIONS allowed
- **Header Control**: Specific headers allowed
- **Preflight Handling**: Proper OPTIONS request handling

## 🚨 Security Vulnerabilities Addressed

### **OWASP Top 10 Protection**

1. **A01: Broken Access Control**
   - ✅ Rate limiting prevents abuse
   - ✅ CSRF tokens prevent unauthorized submissions

2. **A02: Cryptographic Failures**
   - ✅ HTTPS required for production
   - ✅ Secure SMTP authentication

3. **A03: Injection**
   - ✅ Input sanitization prevents XSS
   - ✅ Parameterized email content
   - ✅ No SQL injection (no database)

4. **A04: Insecure Design**
   - ✅ Security-first design approach
   - ✅ Multiple layers of validation

5. **A05: Security Misconfiguration**
   - ✅ Environment variables for secrets
   - ✅ Proper CORS configuration
   - ✅ Error message sanitization

6. **A06: Vulnerable Components**
   - ✅ Latest versions of dependencies
   - ✅ Regular security audits

7. **A07: Authentication Failures**
   - ✅ CSRF protection
   - ✅ Rate limiting prevents brute force

8. **A08: Software Integrity Failures**
   - ✅ Input validation prevents tampering
   - ✅ Content-Type validation

9. **A09: Logging Failures**
   - ✅ Server-side logging implemented
   - ✅ Security event logging

10. **A10: Server-Side Request Forgery**
    - ✅ No external requests made
    - ✅ Email sending only to configured address

## 🔧 Production Recommendations

### **Additional Security Measures**

1. **Use Redis for Rate Limiting**
   ```bash
   npm install redis
   ```

2. **Implement Proper CSRF Library**
   ```bash
   npm install csurf
   ```

3. **Add Request Logging**
   ```bash
   npm install morgan
   ```

4. **Use Helmet.js for Security Headers**
   ```bash
   npm install helmet
   ```

5. **Implement CAPTCHA**
   ```bash
   npm install react-google-recaptcha
   ```

6. **Add Content Security Policy**
   ```typescript
   // In next.config.ts
   const securityHeaders = [
     {
       key: 'Content-Security-Policy',
       value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
     }
   ];
   ```

### **Environment Variables Required**

```bash
# Email Configuration
EMAIL_USER=bannerdledev@gmail.com
EMAIL_PASS=your_gmail_app_password
GMAIL_APP_PASSWORD=your_gmail_app_password

# Security
NODE_ENV=production
NEXTAUTH_SECRET=your_secret_key_here

# CORS
ALLOWED_ORIGIN=https://yourdomain.com
```

### **Gmail App Password Setup**

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: Google Account → Security → App passwords
3. Use the generated password in `EMAIL_PASS` environment variable

## 🧪 Testing Security

### **Security Test Cases**

1. **Rate Limiting Test**
   - Send 6 requests quickly → Should get 429 error

2. **Input Validation Test**
   - Submit HTML tags → Should be sanitized
   - Submit JavaScript → Should be removed
   - Submit very long text → Should be rejected

3. **CSRF Test**
   - Submit without CSRF token → Should be rejected
   - Submit with invalid token → Should be rejected

4. **Email Validation Test**
   - Submit invalid email → Should be rejected
   - Submit very long email → Should be rejected

## 📊 Security Monitoring

### **Logs to Monitor**

- Rate limit violations
- CSRF token failures
- Input validation errors
- Email sending failures
- Unusual request patterns

### **Alerts to Set Up**

- High rate of failed submissions
- Multiple IPs hitting rate limits
- Unusual email patterns
- Server errors in contact API
