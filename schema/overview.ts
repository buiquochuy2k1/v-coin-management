import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { differenceInDays } from 'date-fns';
import { z } from 'zod';

export const Overview = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((value) => {
    const { from, to } = value;
    const days = differenceInDays(to, from);

    const isValid = days >= 0 && days <= MAX_DATE_RANGE_DAYS;

    return isValid;
  });
