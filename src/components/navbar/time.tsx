'use client';

import {useInterval} from 'usehooks-ts';
import {cn} from '@/lib/utils';
import {useState} from 'react';
import dayjs from 'dayjs';

type TimeProps = {
  className?: string;
};

export default function Time({className}: TimeProps) {
  const [time, setTime] = useState<string>('');

  useInterval(() => {
    setTime(dayjs().format('HH:mm | ddd, MMM D'));
  }, 1000);

  return (
    <div>
      <span className={cn('text-md sm:text-lg md:text-xl', className)}>{time}</span>
    </div>
  );
}
