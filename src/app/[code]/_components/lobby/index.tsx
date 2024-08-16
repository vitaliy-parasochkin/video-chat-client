'use client';

import {LuMic, LuMicOff, LuVideo, LuVideoOff} from 'react-icons/lu';
import Stream from '@/app/[code]/_components/streams/stream';
import {useMeeting} from '@/hooks/state/use-meeting';
import {useStream} from '@/hooks/state/use-stream';
import {useSocket} from '@/hooks/state/use-socket';
import {useShallow} from 'zustand/react/shallow';
import {usePeer} from '@/hooks/state/use-peer';
import {ColorRing} from 'react-loader-spinner';
import {Button} from '@/components/ui/button';
import {useSession} from 'next-auth/react';
import Navbar from '@/components/navbar';
import {useEffect} from 'react';

function Lobby() {
  const {stream, getStream, status, toggleVideo, toggleAudio, visible, muted} = useStream();
  const {joinStatus, meeting, setJoinStatus} = useMeeting(
    useShallow(state => ({
      joinStatus: state.joinStatus,
      meeting: state.meeting,
      setJoinStatus: state.setJoinStatus,
    }))
  );
  const peerId = usePeer(state => state.myPeerId);
  const {data} = useSession();
  const socket = useSocket();

  useEffect(() => {
    if (!stream) getStream();
  }, [stream, getStream]);

  const handleJoin = () => {
    setJoinStatus('loading');
    socket.emit('user:join-request', {
      code: meeting?.code as string,
      user: {
        peerId,
        id: data?.user?.id as string,
        name: data?.user?.name as string,
        image: data?.user?.image as string,
        email: data?.user?.email as string,
        muted,
        visible,
      },
      ownerId: meeting?.ownerId as string,
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex grow items-center p-5">
        <div className="grid md:grid-cols-[2fr,1fr] w-full h-[90%] gap-5">
          <div className="relative">
            <Stream />
            {status === 'success' && (
              <div className="absolute bottom-0 right-0 flex gap-x-1 p-3">
                <Button onClick={toggleAudio} size="icon">
                  {muted ? <LuMicOff className="w-6 h-6" /> : <LuMic className="w-6 h-6" />}
                </Button>
                <Button onClick={toggleVideo} size="icon">
                  {visible ? <LuVideo className="w-6 h-6" /> : <LuVideoOff className="w-6 h-6" />}
                </Button>
              </div>
            )}
          </div>
          <div className="grid place-content-center place-items-center gap-2 text-center">
            {joinStatus === 'idle' && (
              <>
                {status === 'loading' && <div>Waiting for your stream</div>}
                {status === 'rejected' && (
                  <div>You can not join without stream. Allow this site to use video and audio</div>
                )}
                {status === 'success' && (
                  <>
                    <div className="mb-3">{meeting?.name}</div>
                    <Button size="lg" onClick={handleJoin}>
                      Join
                    </Button>
                  </>
                )}
              </>
            )}
            {joinStatus === 'loading' && (
              <>
                <ColorRing
                  width={80}
                  height={80}
                  visible
                  ariaLabel="color-rin-loading"
                  wrapperClass="color-ring-wrapper"
                  colors={['#0060ff', '#87ceeb', '#ffffff', '#89cff0', '#c0c0c0']}
                />
                <span>Wait until meeting owner accept your request</span>
              </>
            )}
            {joinStatus === 'rejected' && <div>Meeting owner rejected your join request</div>}
            {joinStatus === 'wait-for-owner' && (
              <>
                <div>{meeting?.name}</div>
                <div>Meeting owner is not here</div>
                <Button onClick={handleJoin} size="lg">
                  Try again
                </Button>
              </>
            )}
            {joinStatus === 'room-is-full' && (
              <>
                <div className="mb-3">{meeting?.name}</div>
                <div>Meeting is full try again later</div>
                <Button onClick={handleJoin} size="lg">
                  Try again
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
