import { Overview } from '@/schema/overview';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const url = new URL(request.url);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  const queryParams = Overview.safeParse({ from, to });

  if (!queryParams.success) {
    return new Response(JSON.stringify(queryParams.error.message), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const stats = await getBalanceStats(user.id, queryParams.data.from, queryParams.data.to);

  return new Response(JSON.stringify(stats), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export type GetBalanceStatsResponseType = Awaited<ReturnType<typeof getBalanceStats>>;

async function getBalanceStats(userId: string, from: Date, to: Date) {
  const total = await prisma.transaction.groupBy({
    by: ['type'],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    expense: total.find((t) => t.type === 'expense')?._sum.amount || 0,
    income: total.find((t) => t.type === 'income')?._sum.amount || 0,
  };
}
