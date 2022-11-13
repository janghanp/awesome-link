import create from 'zustand';

import { UserWithBookmarks } from '../types';

type currentUserState = {
  currentUser: UserWithBookmarks | null;
  setCurrentUser: (currentUser: UserWithBookmarks | null) => void;
};

export const useCurrentUserState = create<currentUserState>((set) => ({
  currentUser: null,
  setCurrentUser: (currentUser: UserWithBookmarks | null) => set({ currentUser }),
}));
