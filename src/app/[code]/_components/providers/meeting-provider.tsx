'use client';

import {useRecentMeetings} from '@/hooks/state/use-recent-meetings';
import {useMeeting} from '@/hooks/state/use-meeting';
import {useSocket} from '@/hooks/state/use-socket';
import {useStream} from '@/hooks/state/use-stream';
import {useShallow} from 'zustand/react/shallow';
import {usePeer} from '@/hooks/state/use-peer';
import {useSession} from 'next-auth/react';
import toast from 'react-hot-toast';
import {useEffect} from 'react';
import {PeerId} from '@/types';

type Props = {
  children: React.ReactNode;
  joinMeeting: () => void;
};

function MeetingProvider({children, joinMeeting}: Props) {
  const socket = useSocket();
  const {
    meeting,
    mutedList,
    visibleList,
    namesList,
    setPeerMuted,
    setPeerVisible,
    setJoinStatus,
    addJoinRequest,
    addConnection,
    removeConnection,
  } = useMeeting(
    useShallow(state => ({
      meeting: state.meeting,
      mutedList: state.mutedList,
      visibleList: state.visibleList,
      namesList: state.namesList,
      removeConnection: state.removeConnection,
      setPeerMuted: state.setPeerMuted,
      setPeerVisible: state.setPeerVisible,
      setJoinStatus: state.setJoinStatus,
      addJoinRequest: state.addJoinRequest,
      addConnection: state.addConnection,
    }))
  );
  const session = useSession();
  const {stream, muted, visible} = useStream(
    useShallow(state => ({
      stream: state.stream,
      muted: state.muted,
      visible: state.visible,
    }))
  );
  const {peer, myPeerId, setMyPeerId, setPeer} = usePeer();
  const addMeeting = useRecentMeetings(state => state.addMeeting);

  useEffect(() => {
    if (!meeting) return;
    addMeeting(meeting);
    socket.connect();
    return () => {
      window.location.reload();
      socket.disconnect();
    };
  }, [socket, meeting, addMeeting]);

  useEffect(() => {
    (async function createPeer() {
      try {
        const peer = new (await import('peerjs')).default();
        setPeer(peer);
        peer.on('open', peerId => {
          setMyPeerId(peerId);
        });

        peer.on('error', err => console.log('Failed to setup peer connection', err));
      } catch {
        console.log('Unable to create peer');
      }
    })();
  }, [setMyPeerId, setPeer]);

  useEffect(() => {
    socket.on('user:wait-for-owner', () => {
      setJoinStatus('wait-for-owner');
    });
    socket.on('meeting:full', () => {
      setJoinStatus('room-is-full');
    });
    socket.on('user:rejected', () => {
      setJoinStatus('rejected');
    });
    socket.on('user:join-request', user => {
      addJoinRequest(user);
    });
    socket.on('user:accepted', ({code, user}) => {
      socket.emit('meeting:join', {code, user});
      setJoinStatus('accepted');
      joinMeeting();
    });
    return () => {
      socket.off('user:wait-for-owner');
      socket.off('meeting:full');
      socket.off('user:rejected');
      socket.off('user:accepted');
      socket.off('user:join-request');
    };
  }, [joinMeeting, socket, setJoinStatus, addJoinRequest]);

  useEffect(() => {
    if (!peer) return;
    socket.on('user:joined', user => {
      toast.success(`${user.name} joined`);

      const call = peer.call(user.peerId, stream as MediaStream, {
        metadata: {
          user: {
            ...session.data?.user,
            muted,
            visible,
          },
        },
      });
      call.on('stream', (remoteStream: MediaStream) => {
        addConnection({
          stream: remoteStream,
          connection: call,
          ...user,
        });
      });
    });
    return () => {
      socket.off('user:joined');
    };
  }, [addConnection, muted, visible, peer, socket, session.data?.user, stream]);

  useEffect(() => {
    if (!peer || !stream) return;

    peer.on('call', call => {
      const {
        peer: peerId,
        metadata: {user},
      } = call;
      call.answer(stream);
      call.on('stream', (remoteStream: MediaStream) => {
        addConnection({
          stream: remoteStream,
          connection: call,
          peerId,
          ...user,
        });
      });
    });
    return () => {
      peer.off('call');
    };
  }, [peer, stream, addConnection]);

  useEffect(() => {
    socket.on('user:left', (peerId: PeerId) => {
      if (peerId !== myPeerId) {
        toast.success(`${namesList[peerId]} has left the room`);
        removeConnection(peerId);
      }
    });
    return () => {
      socket.off('user:left');
    };
  }, [myPeerId, namesList, socket, removeConnection]);

  useEffect(() => {
    socket.on('user:toggle-video', (peerId: PeerId) => {
      setPeerVisible(peerId, !visibleList[peerId]);
    });
    return () => {
      socket.off('user:toggle-video');
    };
  }, [visibleList, setPeerVisible, socket]);
  useEffect(() => {
    socket.on('user:toggle-audio', (peerId: PeerId) => {
      setPeerMuted(peerId, !mutedList[peerId]);
    });
    return () => {
      socket.off('user:toggle-audio');
    };
  }, [mutedList, socket, setPeerMuted]);

  return <div>{children}</div>;
}

export default MeetingProvider;
