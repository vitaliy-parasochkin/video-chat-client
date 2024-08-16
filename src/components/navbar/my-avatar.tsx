'use client';

import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {signOut, useSession} from 'next-auth/react';
import {Switch} from '@/components/ui/switch';
import {IoMdMore} from 'react-icons/io';
import {useTheme} from 'next-themes';
import {initials} from '@/lib/utils';

export default function MyAvatar() {
  const {setTheme, theme} = useTheme();
  const {data} = useSession();

  if (!data) return null;

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex h-full cursor-pointer items-center justify-between rounded-full bg-light-secondary p-2 dark:bg-slate-800 md:w-80">
          <div className="flex items-center gap-x-5">
            <Avatar className="border-2 border-white">
              <AvatarImage src={data?.user?.image || ''} />
              <AvatarFallback>{initials(data?.user?.name as string)}</AvatarFallback>
            </Avatar>
            <div className="hidden font-medium md:block">{data?.user?.name}</div>
          </div>
          <IoMdMore className="hidden h-6 w-6 md:block" />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex cursor-pointer items-center justify-between gap-x-3 rounded-xl p-2 duration-200 hover:bg-gray-50 hover:dark:bg-gray-900">
          Switch theme
          <Switch
            defaultChecked={theme === 'dark'}
            onCheckedChange={value => setTheme(value ? 'dark' : 'light')}
          />
        </div>
        <div
          onClick={() => signOut({callbackUrl: '/auth/sign-in'})}
          className="flex cursor-pointer items-center gap-x-3 rounded-xl p-2 duration-200 hover:bg-gray-50 hover:dark:bg-gray-900"
        >
          Sign out
        </div>
      </PopoverContent>
    </Popover>
  );
}
