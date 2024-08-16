import {immer} from 'zustand/middleware/immer';
import {Nullable, PeerId} from '@/types';
import {create} from 'zustand';
import Peer from 'peerjs';

type State = {
  peer: Nullable<Peer>;
  myPeerId: PeerId;
};

type Actions = {
  setPeer: (peer: Nullable<Peer>) => void;
  setMyPeerId: (peerId: PeerId) => void;
};

export const usePeer = create<State & Actions>()(
  immer(set => ({
    peer: null,
    myPeerId: '',
    setPeer: peer =>
      set(state => {
        state.peer = peer;
      }),
    setMyPeerId: myPeerId =>
      set(state => {
        state.myPeerId = myPeerId;
      }),
  }))
);
