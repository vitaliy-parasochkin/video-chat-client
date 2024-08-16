import {immer} from 'zustand/middleware/immer';
import {persist} from 'zustand/middleware';
import {Meeting} from '@prisma/client';
import {create} from 'zustand';

type State = {
  meetings: Meeting[];
};

type Actions = {
  addMeeting: (meeting: Meeting) => void;
};

export const useRecentMeetings = create<State & Actions>()(
  immer(
    persist(
      (set, get) => ({
        meetings: [],
        addMeeting: meeting =>
          set(state => {
            state.meetings = [meeting, ...state.meetings].slice(0, 10);
          }),
      }),
      {
        name: 'recent-meetings-storage',
      }
    )
  )
);
