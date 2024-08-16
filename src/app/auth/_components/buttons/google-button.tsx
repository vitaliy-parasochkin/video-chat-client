'use client';

import {Button} from '@/components/ui/button';
import {FcGoogle} from 'react-icons/fc';
import {signIn} from 'next-auth/react';

interface GithubButtonProps {
  callbackUrl?: string;
}
function GoogleButton({callbackUrl}: GithubButtonProps) {
  return (
    <Button
      type="button"
      onClick={() => signIn('google', {callbackUrl})}
      variant="ghost"
      className="flex cursor-pointer items-center justify-center gap-x-3 rounded-xl bg-slate-100 px-16 py-5 dark:bg-slate-800"
    >
      Continue with github <FcGoogle className="h-6 w-6" />
    </Button>
  );
}

export default GoogleButton;
