import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@cms/services';

const authService = new AuthService();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { available: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase();

    // Check email format
    if (!EMAIL_REGEX.test(emailLower)) {
      return NextResponse.json({
        available: false,
        error: 'Invalid email format',
      });
    }

    // Check availability using AuthService
    const available = await authService.checkEmailAvailability(emailLower);

    if (!available) {
      return NextResponse.json({
        available: false,
        error: 'This email is already registered',
      });
    }

    return NextResponse.json({
      available: true,
      email: emailLower,
    });
  } catch (error) {
    console.error('Check email error:', error);
    return NextResponse.json(
      { available: false, error: 'Failed to check email availability' },
      { status: 500 }
    );
  }
}
