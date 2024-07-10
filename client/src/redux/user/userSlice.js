import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API_ROOT } from '~/utils/constants'
import authorizedAxiosInstance from '~/utils/authorizeAxios'


const initialState = {
  status: '',
  error: '',
  user: {
    id: '',
    name: '',
    email: '',
    picture: '',
    status: '',
    access_token: ''
  }
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await authorizedAxiosInstance.post(`${API_ROOT}/auth/register`, {
        ...values
      })
      return data
    } catch (error) {
      return rejectWithValue(error.response.data.error.message)
    }
  }
)
export const loginUser = createAsyncThunk(
  'auth/login',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await authorizedAxiosInstance.post(`${API_ROOT}/auth/login`, {
        ...values
      })
      return data
    } catch (error) {
      return rejectWithValue(error.response.data.error.message)
    }
  }
)
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await authorizedAxiosInstance.post(`${API_ROOT}/auth/logout`, {
        ...values
      })
      return data
    } catch (error) {
      return rejectWithValue(error.response.data.error.message)
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeStatus: (state, action) => {
      state.status = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = ''
        state.user = action.payload.user
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(loginUser.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = ''
        state.user = action.payload.user
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = ''
        state.error = ''
        state.user = {
          id: '',
          name: '',
          email: '',
          picture: '',
          status: '',
          token: ''
        }
      })
  }
})

export const { changeStatus } = userSlice.actions

export default userSlice.reducer
