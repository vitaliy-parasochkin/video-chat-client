'use client';

import {StreamsContainer, VideoContainer} from '@/app/[code]/_components/containers';
import {JoinRequestDialog} from '@/app/_components/dialogs';
import {Stream} from '@/app/[code]/_components/streams';
import PeerVideo from '@/app/[code]/_components/peer';
import {useMeeting} from '@/hooks/state/use-meeting';
import {useShallow} from 'zustand/react/shallow';

function Meeting() {
  const {streamsList, mutedList, visibleList, namesList, imagesList} = useMeeting(
    useShallow(state => ({
      streamsList: state.streamsList,
      mutedList: state.mutedList,
      visibleList: state.visibleList,
      namesList: state.namesList,
      imagesList: state.imagesList,
    }))
  );

  return (
    <>
      <StreamsContainer count={Object.keys(streamsList).length + 1}>
        <Stream />
      </StreamsContainer>
      {Object.entries(streamsList).map(([peerId, stream]) => (
        <VideoContainer
          key={peerId}
          muted={mutedList[peerId]}
          visible={visibleList[peerId]}
          image={imagesList[peerId]}
          name={namesList[peerId]}
          stream={stream}
        >
          <PeerVideo stream={stream} />
        </VideoContainer>
      ))}
      <JoinRequestDialog />
    </>
  );
}

export default Meeting;
