import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  // If SMTP settings are configured, use them
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  } else {
    // In development, use ethereal email (fake SMTP service)
    // In production without SMTP, emails will be logged only
    console.warn('Email service not configured. Using console logging in development.');
    transporter = null;
  }

  return transporter;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  const transport = getTransporter();

  if (!transport) {
    // If no transporter, just log the email
    console.log('=== EMAIL (not sent, SMTP not configured) ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML:', html);
    console.log('Text:', text || 'N/A');
    console.log('===========================================');
    return { success: true, message: 'Email logged (SMTP not configured)' };
  }

  try {
    const info = await transport.sendMail({
      from: process.env.SMTP_FROM || '"PulseX CMS" <noreply@pulsex.com>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export function getWelcomeEmailHTML(userName: string, subdomain: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to PulseX!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #14B8A6 0%, #3B82F6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <div style="display: inline-block; width: 50px; height: 50px; background: white; border-radius: 10px; margin-bottom: 10px;">
      <span style="font-size: 30px; font-weight: bold; color: #14B8A6; line-height: 50px;">P</span>
    </div>
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to PulseX!</h1>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px; margin-bottom: 20px;">Hi ${userName},</p>
    
    <p style="margin-bottom: 20px;">
      🎉 Congratulations! Your PulseX CMS account has been created successfully.
    </p>
    
    <p style="margin-bottom: 20px;">
      Your website is now live at:
    </p>
    
    <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
      <a href="http://${subdomain}.pulsex.com" style="color: #14B8A6; text-decoration: none; font-size: 18px; font-weight: 600;">
        ${subdomain}.pulsex.com
      </a>
    </div>
    
    <h2 style="color: #14B8A6; font-size: 20px; margin-top: 30px; margin-bottom: 15px;">
      🚀 Get Started in 3 Steps
    </h2>
    
    <ol style="padding-left: 20px; margin-bottom: 20px;">
      <li style="margin-bottom: 10px;">
        <strong>Access your admin panel:</strong> Visit your site and click the admin link
      </li>
      <li style="margin-bottom: 10px;">
        <strong>Create your first content type:</strong> Define the structure of your content (articles, products, etc.)
      </li>
      <li style="margin-bottom: 10px;">
        <strong>Build your pages:</strong> Use our visual page builder to design beautiful pages
      </li>
    </ol>
    
    <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
      <a href="http://${subdomain}.pulsex.com/admin" style="display: inline-block; background: #14B8A6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
        Go to Admin Panel →
      </a>
    </div>
    
    <h2 style="color: #3B82F6; font-size: 20px; margin-top: 30px; margin-bottom: 15px;">
      ✨ What You Can Do
    </h2>
    
    <ul style="list-style: none; padding-left: 0; margin-bottom: 20px;">
      <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
        <span style="position: absolute; left: 0;">✅</span>
        Create dynamic content types without coding
      </li>
      <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
        <span style="position: absolute; left: 0;">✅</span>
        Build pages with drag-and-drop components
      </li>
      <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
        <span style="position: absolute; left: 0;">✅</span>
        Auto-publish to social media platforms
      </li>
      <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
        <span style="position: absolute; left: 0;">✅</span>
        Manage media with our powerful library
      </li>
      <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
        <span style="position: absolute; left: 0;">✅</span>
        Support multiple languages effortlessly
      </li>
    </ul>
    
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 30px; border-radius: 4px;">
      <p style="margin: 0; color: #92400e;">
        <strong>💡 Pro Tip:</strong> Check out our documentation and video tutorials to make the most of PulseX!
      </p>
    </div>
    
    <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
      Need help? Reply to this email or visit our <a href="https://pulsex.com/support" style="color: #14B8A6;">support center</a>.
    </p>
    
    <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
      Happy building! 🎨<br>
      The PulseX Team
    </p>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p>© 2026 PulseX CMS. All rights reserved.</p>
    <p>
      <a href="https://pulsex.com" style="color: #9ca3af; text-decoration: none;">Website</a> •
      <a href="https://pulsex.com/docs" style="color: #9ca3af; text-decoration: none;">Docs</a> •
      <a href="https://pulsex.com/support" style="color: #9ca3af; text-decoration: none;">Support</a>
    </p>
  </div>
</body>
</html>
  `.trim();
}

export function getWelcomeEmailText(userName: string, subdomain: string) {
  return `
Hi ${userName},

Congratulations! Your PulseX CMS account has been created successfully.

Your website is now live at: ${subdomain}.pulsex.com

GET STARTED IN 3 STEPS:

1. Access your admin panel: Visit your site and click the admin link
2. Create your first content type: Define the structure of your content
3. Build your pages: Use our visual page builder to design beautiful pages

Visit your admin panel: http://${subdomain}.pulsex.com/admin

WHAT YOU CAN DO:
✓ Create dynamic content types without coding
✓ Build pages with drag-and-drop components
✓ Auto-publish to social media platforms
✓ Manage media with our powerful library
✓ Support multiple languages effortlessly

Pro Tip: Check out our documentation and video tutorials to make the most of PulseX!

Need help? Reply to this email or visit our support center at https://pulsex.com/support

Happy building!
The PulseX Team

---
© 2026 PulseX CMS. All rights reserved.
Website: https://pulsex.com
Docs: https://pulsex.com/docs
Support: https://pulsex.com/support
  `.trim();
}

export async function sendWelcomeEmail(
  email: string,
  userName: string,
  subscription: { code: string; name: string }
) {
  const html = getWelcomeEmailHTML(userName, subscription.code);
  const text = getWelcomeEmailText(userName, subscription.code);

  return sendEmail({
    to: email,
    subject: `Welcome to PulseX! Your site ${subscription.code}.pulsex.com is ready 🎉`,
    html,
    text,
  });
}

