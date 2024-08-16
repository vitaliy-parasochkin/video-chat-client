'use client';

import {JoinMeetingFields, JoinMeetingValidationSchema} from '@/types/forms';
import {SubmitErrorHandler, SubmitHandler, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';
import {cn} from '@/lib/utils';

export default function JoinMeetingWidget() {
  const {
    register,
    handleSubmit,
    watch,
    formState: {isSubmitting},
  } = useForm<JoinMeetingFields>({
    mode: 'onBlur',
    defaultValues: {
      code: '',
    },
    resolver: zodResolver(JoinMeetingValidationSchema),
  });
  const router = useRouter();

  const watcherCode = watch('code');

  const onSubmit: SubmitHandler<JoinMeetingFields> = async data => {
    await router.push(data.code);
  };
  const onError: SubmitErrorHandler<JoinMeetingFields> = async data => {
    toast.error(data.code?.message || '');
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="grid gap-3 sm:grid-cols-[3fr,1fr]"
      >
        <Input
          {...register('code')}
          placeholder="Enter code"
          className="h-14 sm:rounded-2xl"
          maxLength={18}
        />
        <Button type="submit" className={cn('sm:rounded-2xl', {'opacity-50': isSubmitting})}>
          {isSubmitting ? 'Validating' : 'Join'}
        </Button>
      </form>
      <div className="ml-2 mt-1">{watcherCode.length}/18</div>
    </>
  );
}
