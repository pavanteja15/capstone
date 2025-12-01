import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AccountType = 'USER' | 'BUSINESS';

export interface UserState {
  userId: number | null;
  name: string;
  email: string;
  password: string;
  username: string;
  mobile: string;
  bio: string;
  profilePath: string;
  accountType: AccountType;
  businessName: string;
  websiteUrl: string;
  description: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  userId: null,
  name: '',
  email: '',
  password: '',
  username: '',
  mobile: '',
  bio: '',
  profilePath: '',
  accountType: 'USER',
  businessName: '',
  websiteUrl: '',
  description: '',
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (_, action: PayloadAction<Partial<UserState>>) => ({
      ...initialState,
      ...action.payload,
      isAuthenticated: action.payload.isAuthenticated ?? true,
    }),
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
export { initialState as userInitialState };
