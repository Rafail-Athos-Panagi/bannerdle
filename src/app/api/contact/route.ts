import { NextResponse, NextRequest } from 'next/server';
import * as nodemailer from 'nodemailer';
import { z, ZodIssue } from 'zod';

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Input validation schema
const contactSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email must be less than 254 characters'),
  subject: z.string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters')
    .regex(/^[a-zA-Z0-9\s\-'\.!?]+$/, 'Subject contains invalid characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
});

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // Max 5 requests per window

  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

// Input sanitization function
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// CSRF token validation (simple implementation)
function validateCSRFToken(token: string, sessionId: string): boolean {
  // In production, use a proper CSRF library
  // This is a simplified implementation
  return Boolean(token && token.length > 10 && sessionId && sessionId.length > 10);
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: 900 // 15 minutes in seconds
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate CSRF token
    const csrfToken = request.headers.get('x-csrf-token');
    const sessionId = request.headers.get('x-session-id');
    
    if (!csrfToken || !sessionId || !validateCSRFToken(csrfToken, sessionId)) {
      return NextResponse.json(
        { error: 'Invalid security token' },
        { status: 403 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name || ''),
      email: sanitizeInput(body.email || ''),
      subject: sanitizeInput(body.subject || ''),
      message: sanitizeInput(body.message || '')
    };

    // Validate input using Zod schema
    const validationResult = contactSchema.safeParse(sanitizedData);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.issues.map((err: ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'bannerdledev@gmail.com',
        pass: process.env.EMAIL_PASS
      }
    });

    // Email content
    const mailOptions = {
      from: `"Bannerdle Contact Form" <${process.env.EMAIL_USER || 'bannerdledev@gmail.com'}>`,
      to: process.env.EMAIL_USER || 'bannerdledev@gmail.com',
      replyTo: email,
      subject: `[Bannerdle Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${message}</div>
          </div>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This message was sent from the Bannerdle contact form at ${new Date().toISOString()}.<br>
            IP: ${ip}<br>
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
        
        ---
        Sent from Bannerdle contact form at ${new Date().toISOString()}
        IP: ${ip}
        Reply directly to this email to respond to ${name}.
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Log successful submission (in production, use proper logging)

    return NextResponse.json(
      { 
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Don't expose internal errors to client
    return NextResponse.json(
      { 
        error: 'Failed to send message. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? 
          (error instanceof Error ? error.message : 'Unknown error') : 
          undefined
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 
        'https://yourdomain.com' : '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-csrf-token, x-session-id',
      'Access-Control-Max-Age': '86400',
    },
  });
}
