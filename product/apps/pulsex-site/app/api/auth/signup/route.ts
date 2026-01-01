import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@cms/services';
import { sendWelcomeEmail } from '@/lib/email';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, siteName, subdomain } = body;

    // Use AuthService for signup
    const result = await authService.signup({
      email,
      password,
      siteName,
      subdomain,
    });

    // Set httpOnly cookies for tokens
    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role,
        },
        subscription: {
          id: result.subscription.id,
          name: result.subscription.name,
          code: result.subscription.code,
          subdomain: `${result.subscription.code}.pulsex.com`,
        },
        redirectUrl: `http://${result.subscription.code}.pulsex.com/admin`,
      },
      { status: 201 }
    );

    response.cookies.set('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    response.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    // Send welcome email (async, don't wait)
    sendWelcomeEmail(
      result.user.email,
      result.user.firstName,
      result.subscription
    ).catch((error) => {
      console.error('Failed to send welcome email:', error);
      // Don't fail signup if email fails
    });

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);

    // Handle validation errors
    if (error.code === 'VALIDATION_ERROR' || error.code === 'ALREADY_EXISTS') {
      return NextResponse.json(
        {
          success: false,
          errors: [error.message],
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        errors: ['An error occurred during signup. Please try again.'],
      },
      { status: 500 }
    );
  }
}
