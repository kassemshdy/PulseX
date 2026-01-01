import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://cms_user:cms_password@localhost:5432/cms_db?schema=public',
});

export async function cleanupTestData(email: string) {
  try {
    // Find user by email
    const user = await prisma.user.findFirst({
      where: { email },
      include: { subscription: true },
    });

    if (user) {
      // Delete user and related subscription
      await prisma.user.delete({ where: { id: user.id } });
      
      if (user.subscription) {
        await prisma.subscription.delete({ where: { id: user.subscriptionId } });
      }
    }
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
}

export async function cleanupTestSubscription(subdomain: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { code: subdomain },
      include: { users: true },
    });

    if (subscription) {
      // Delete all users first
      await prisma.user.deleteMany({
        where: { subscriptionId: subscription.id },
      });

      // Then delete subscription
      await prisma.subscription.delete({
        where: { id: subscription.id },
      });
    }
  } catch (error) {
    console.error('Error cleaning up test subscription:', error);
  }
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export async function getTableCount(tableName: string): Promise<number> {
  try {
    const result = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
      `SELECT COUNT(*) as count FROM "${tableName}"`
    );
    return Number(result[0].count);
  } catch (error) {
    console.error(`Error counting ${tableName}:`, error);
    return 0;
  }
}

export async function closeDatabaseConnection() {
  await prisma.$disconnect();
}

export { prisma };

