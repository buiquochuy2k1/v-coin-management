'use client';

import * as React from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Currencies, Currency } from '@/lib/currencies';
import { useMutation, useQuery } from '@tanstack/react-query';
import SkeletonWrapper from './SkeletonWrapper';
import { UserSettings } from '@prisma/client';
import { UpdateUserCurrency } from '@/app/wizard/_action/userSettings';
import { toast } from 'sonner';

export default function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [selectedOptions, setSelectedOption] = React.useState<Currency | null>(null);

  //LẤY DỮ LIỆU TỪ API VÀ TRẢ VỀ CHO NGƯỜI DÙNG
  const userSettings = useQuery<UserSettings>({
    queryKey: ['userSettings'],
    queryFn: () => fetch('/api/user-settings').then((res) => res.json()),
  });

  // KHI CÓ THÔNG TIN THAY ĐỔI THÌ NÓ SẼ RENDER LẠI
  React.useEffect(() => {
    if (!userSettings.data) return;
    const userCurrency = Currencies.find((currency) => currency.value === userSettings.data.currency);
    if (userCurrency) setSelectedOption(userCurrency);
  }, [userSettings.data]);

  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserSettings) => {
      toast.success(`Cập nhật tiền tệ thành công 🎉`, {
        id: 'update-currency',
      });

      setSelectedOption(Currencies.find((c) => c.value === data.currency) || null);
    },
    onError: (e) => {
      console.error(e);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau', {
        id: 'update-currency',
      });
    },
  });

  const selectOption = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error('Hãy chọn một loại tiền tệ trước khi cập nhật');
        return;
      }

      toast.loading('Đang cập nhật tiền tệ...', {
        id: 'update-currency',
      });

      mutation.mutate(currency.value);
    },
    [mutation]
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
              {selectedOptions ? <>{selectedOptions.label}</> : <>+ Chọn tiền tệ</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
            {selectedOptions ? <>{selectedOptions.label}</> : <>+ Chọn tiền tệ</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (status: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Chọn loại tiền tệ..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(Currencies.find((priority) => priority.value === value) || null);
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
