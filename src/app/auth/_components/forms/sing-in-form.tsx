'use client';

import {GithubButton, GoogleButton} from '@/app/auth/_components/buttons';
import {SignInFormFields, SignInValidationSchema} from '@/types/forms';
import {useSignIn} from '@/hooks/mutations/use-sign-in';
import {SubmitHandler, useForm} from 'react-hook-form';
import {Separator} from '@/components/ui/separator';
import {zodResolver} from '@hookform/resolvers/zod';
import {useSearchParams} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {MdOutlineError} from 'react-icons/md';
import {Input} from '@/components/ui/input';
import {Route} from '../../../../../routes';
import toast from 'react-hot-toast';
import {useState} from 'react';
import Link from 'next/link';

export default function SignInForm() {
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get('callbackUrl') ?? Route.MAIN;
  const {mutateAsync, reset: resetMutation, isIdle, isPending, isSuccess} = useSignIn();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<SignInFormFields>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(SignInValidationSchema),
  });

  const onSubmit: SubmitHandler<SignInFormFields> = async data => {
    await mutateAsync(
      {data, callbackURL},
      {
        onSuccess: res => {
          if (res?.error) {
            reset();
            resetMutation();
            setError(res?.error);
          } else {
            toast.success('Success');
          }
        },
      }
    );
  };

  return (
    <div className="flex w-full grow items-center justify-center">
      <form
        className="sm:-w-fit h-full w-full min-w-[300px] bg-light-primary p-5 dark:bg-dark-primary sm:h-fit sm:w-fit sm:rounded-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-5 text-center text-2xl font-bold">Sign In</h1>
        <div className="my-3">
          <div>
            <Input {...register('email')} placeholder="Email" />
            {errors?.email && (
              <span className="ml-5 text-xs text-red-500">{errors?.email.message}</span>
            )}
          </div>
        </div>
        <div className="my-3">
          <div>
            <Input {...register('password')} placeholder="Password" type="password" />
            {errors?.password && (
              <span className="ml-5 text-xs text-red-500">{errors?.password.message}</span>
            )}
          </div>
        </div>
        <Button type="submit" className="w-full">
          {isIdle && 'Sign in'}
          {isPending && 'Signing you in'}
          {isSuccess && 'Signed in successfully'}
        </Button>
        {error && (
          <div className="mt-5 flex w-full items-center justify-center gap-x-4 rounded-lg bg-red-500 px-3 py-2 text-center text-white">
            <MdOutlineError className="h-6 w-6" /> {error}
          </div>
        )}
        <Separator className="my-5" />
        <div className="space-y-2">
          <GoogleButton callbackUrl={callbackURL} />
          <GithubButton callbackUrl={callbackURL} />
        </div>
        <div className="mt-3 text-sm text-secondary">
          <div className="">Don&apos;t have an account yet?</div>
          <Button asChild variant="link" className="p-0">
            <Link href={Route.SIGN_UP}>Sign up</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
