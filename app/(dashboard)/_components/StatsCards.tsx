'use client';

import { UserSettings } from '@prisma/client';
import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/route';
import { DateToUTCDate } from '@/lib/helpers';
import { GetFormatterForCurrency } from '@/lib/helpers';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { TrendingDown, TrendingUp, Wallet2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import CountUp from 'react-countup';

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}
function StatsCards({ userSettings, from, to }: Props) {
  const statQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ['overview', 'stats', from, to],
    queryFn: () =>
      fetch(`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then((res) =>
        res.json()
      ),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statQuery.data?.income || 0; // lấy thu nhập từ dữ liệu trả về hoặc mặc định là 0
  const expense = statQuery.data?.expense || 0; // lấy chi phí từ dữ liệu trả về hoặc mặc định là 0

  const balance = income - expense; // Doanh thu bằng tổng thu nhập trừ đi tổng chi phí

  return (
    <div className="relative flex w-full md:flex-nowrap flex-wrap gap-2">
      <SkeletonWrapper isLoading={statQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Thu nhập"
          icon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Chi"
          icon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Số dư"
          icon={
            <Wallet2 className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCards;

function StatCard({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: React.ReactNode;
}) {
  const formmaFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className="flex h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-center gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimal="2"
          formattingFn={formmaFn}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
