import { configureStore } from '@reduxjs/toolkit';

import userReducer from './user/userSlice';
import patientReducer from './patient/patientSlice';
import tmjdTestReducer from './tmjdTest/tmjdTestSlice';
import mriImageReducer from './mriImage/mriImageSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    patient: patientReducer,
    tmjdTest: tmjdTestReducer,
    mriImage: mriImageReducer,
  },
});
