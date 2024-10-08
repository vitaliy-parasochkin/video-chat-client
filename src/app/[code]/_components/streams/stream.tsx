'use client';

import {VideoContainer} from '@/app/[code]/_components/containers';
import PeerVideo from '@/app/[code]/_components/peer';
import {useStream} from '@/hooks/state/use-stream';
import {Hearts} from 'react-loader-spinner';
import {useSession} from 'next-auth/react';

function Stream() {
  const {stream, muted, visible, status} = useStream();
  const {data} = useSession();
  return (
    <>
      {status === 'loading' && (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-xl  bg-light-primary dark:bg-dark-primary">
          <Hearts
            height="80"
            width="80"
            color="#4a8be0"
            ariaLabel="hearts-loading"
            visible={true}
          />
          <div className="">Getting your stream 🚀</div>
        </div>
      )}
      {status === 'rejected' && (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-xl  bg-light-primary dark:bg-dark-primary">
          <div className="text-xl">Can not get your stream 😶‍🌫️</div>
        </div>
      )}
      {status === 'success' && stream && (
        <VideoContainer
          muted={muted}
          visible={visible}
          name={`${data?.user?.name} (YOU)`}
          image={data?.user?.image || ''}
          stream={stream}
        >
          <PeerVideo stream={stream} isMe={true} />
        </VideoContainer>
      )}
    </>
  );
}

export default Stream;
