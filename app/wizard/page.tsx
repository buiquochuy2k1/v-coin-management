import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import CurrencyComboBox from '@/components/CurrencyComboBox';

async function page() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }
  return (
    <div className="container flex max-w-2xl flex-col items-center justify-between gap-4">
      <div>
        <h1 className="text-center text-3xl">
          Xin chào, <span className="ml-2 font-bold">{user.fullName}</span> 👋
        </h1>
        <h2 className="mt-4 text-center text-base text-muted-foreground">
          Hãy bắt đầu bằng việc chọn loại tiền tệ bạn thích nhé
        </h2>

        <h3 className="mt-2 text-center text-muted-foreground text-sm">
          Bạn có thể thay đổi trong cài đặt sau nếu muốn đổi
        </h3>
      </div>
      <Separator />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Chọn loại tiền tệ</CardTitle>
          <CardDescription>Chọn loại tiền tệ bạn muốn sử dụng</CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyComboBox />
        </CardContent>
      </Card>
      <Separator />
      <Button className="w-full" asChild>
        <Link href={'/'}>Tiếp tục</Link>
      </Button>
      <div className="mt-8">
        <Logo />
      </div>
    </div>
  );
}

export default page;
