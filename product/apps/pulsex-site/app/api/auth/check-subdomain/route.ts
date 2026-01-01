import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@cms/services';

const subscriptionService = new SubscriptionService();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json(
        { available: false, error: 'Subdomain is required' },
        { status: 400 }
      );
    }

    // Use SubscriptionService to check availability
    const result = await subscriptionService.checkSubdomainAvailability(subdomain);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Check subdomain error:', error);
    return NextResponse.json(
      { available: false, error: 'Failed to check subdomain availability' },
      { status: 500 }
    );
  }
}
