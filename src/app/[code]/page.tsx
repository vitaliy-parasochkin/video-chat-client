'use client';

import {MeetingProvider} from '@/app/[code]/_components/providers';
import getMeetingByCode from '@/actions/get/get-meeting-by-code';
import Meeting from '@/app/[code]/_components/meeting';
import {useMeeting} from '@/hooks/state/use-meeting';
import Lobby from '@/app/[code]/_components/lobby';
import {useShallow} from 'zustand/react/shallow';
import {TailSpin} from 'react-loader-spinner';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Route} from '../../../routes';
import toast from 'react-hot-toast';
import {Code} from '@/types';

type MetingPageProps = {
  params: {code: Code};
};

export default function MeetingPage({params: {code}}: MetingPageProps) {
  const [isLobby, setIsLobby] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const {meeting, setMeeting} = useMeeting(
    useShallow(state => ({
      meeting: state.meeting,
      setMeeting: state.setMeeting,
    }))
  );

  useEffect(() => {
    if (meeting) {
      setIsLoading(false);
      return;
    }
    getMeetingByCode(code).then(result => {
      if (result) {
        setMeeting(result);
        setIsLoading(false);
      } else {
        toast.error('Meeting not found');
        router.push(Route.MAIN);
      }
    });
  }, [code, meeting, setMeeting, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center rounded-xl bg-light-primary dark:bg-dark-primary">
        <TailSpin
          visible={true}
          height="120"
          width="120"
          color="#4afbe0"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return (
    <MeetingProvider joinMeeting={() => setIsLobby(false)}>
      {isLobby ? <Lobby /> : <Meeting />}
    </MeetingProvider>
  );
}
