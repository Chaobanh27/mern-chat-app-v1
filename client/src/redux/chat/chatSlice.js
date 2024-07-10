/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'


const CONVERSATION_ENDPOINT = `${API_ROOT}/conversation`
const MESSAGE_ENDPOINT = `${API_ROOT}/message`

const initialState = {
  status: '',
  error: '',
  conversations: [],
  activeConversation: {},
  messages: [],
  notifications: [],
  files: []
}

export const createOpenConversation = createAsyncThunk(
  'conversation/openCreate',
  async (values, { rejectWithValue }) => {
    const { access_token, receiverId, isGroup } = values
    try {
      const { data } = await authorizedAxiosInstance.post(
        CONVERSATION_ENDPOINT,
        { receiverId, isGroup },
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      )
      return data
    } catch (error) {
      return rejectWithValue(error.response.data.error.message)
    }
  }
)

export const getConversations = createAsyncThunk(
  'conversation/all',
  async (access_token, { rejectWithValue }) => {
    try {
      const { data } = await authorizedAxiosInstance.get(CONVERSATION_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      return data
    } catch (error) {
      return rejectWithValue(error.response.data.error.message)
    }
  }
)

export const getConversationMessages = createAsyncThunk(
  'conversation/messages',
  async (values, { rejectWithValue }) => {
    const { access_token, conversationId } = values
    try {
      const { data } = await authorizedAxiosInstance.get(`${MESSAGE_ENDPOINT}/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      return data
    } catch (error) {
      return rejectWithValue(error.response.data.error.message)
    }
  }
)


export const sendMessage = createAsyncThunk(
  'message/send',
  async (values, { rejectWithValue }) => {
    const { access_token, message, conversationId, files } = values
    try {
      const { data } = await authorizedAxiosInstance.post(
        MESSAGE_ENDPOINT,
        {
          message,
          conversationId,
          files
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      )
      return data
    } catch (error) {
      return rejectWithValue(error.response.data.error.message)
    }
  }
)


export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload
    },
    updateMessagesAndConversations: (state, action) => {
      //update tin nhắn trong redux
      let convo = state.activeConversation
      if (convo._id === action.payload.conversation._id) {
        state.messages = [...state.messages, action.payload]
      }
      //update cuộc trò chuyện trong redux
      let conversation = {
        ...action.payload.conversation,
        latestMessage: action.payload
      }
      let newConversation = [...state.conversations].filter(
        (c) => c._id !== conversation._id
      )
      newConversation.unshift(conversation)
      state.conversations = newConversation
    },
    addFiles: (state, action) => {
      state.files = [...state.files, action.payload]
    },
    clearFiles: (state, action) => {
      state.files = []
    },
    removeFileFromFiles: (state, action) => {
      let index = action.payload
      let files = [...state.files]
      let fileToRemove = [files[index]]
      state.files = files.filter((file) => !fileToRemove.includes(file))
    }
  },

  extraReducers(builder) {
    builder
      .addCase(getConversations.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.conversations = action.payload
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })


      .addCase(createOpenConversation.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(createOpenConversation.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.activeConversation = action.payload
        state.files = []
      })
      .addCase(createOpenConversation.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })


      .addCase(getConversationMessages.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.messages = action.payload
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })


      .addCase(sendMessage.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded'
        //cập nhật trường messages với thêm tin nhắn vừa gửi (action.payload) vào trường message trong state
        state.messages = [...state.messages, action.payload]

        //cập nhật trường conversation với latestMessage là tin nhắn vừa gửi
        let conversation = {
          ...action.payload.conversation,
          latestMessage: action.payload
        }

        //lọc ra các cuộc trò chuyện có cùng _id với cuộc trò chuyện mới từ mảng state.conversations
        let newConversation = [...state.conversations].filter(
          (c) => c._id !== conversation._id
        )

        //Cuộc trò chuyện mới sau đó được đặt lên đầu mảng và gán lại vào state.conversations.
        newConversation.unshift(conversation)
        state.conversations = newConversation
        state.files = []
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})
export const { setActiveConversation, updateMessagesAndConversations, addFiles, clearFiles, removeFileFromFiles } = chatSlice.actions

export default chatSlice.reducer
