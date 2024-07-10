import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { signUpSchema } from '~/utils/validation'
import CustomInput from '~/components/CustomInput/CustomInput'
import { useDispatch, useSelector } from 'react-redux'
import PulseLoader from 'react-spinners/PulseLoader'
import { Link, useNavigate } from 'react-router-dom'
import { changeStatus, registerUser } from '~/redux/user/userSlice'
import { useState } from 'react'
import axios from 'axios'
import UploadAvatarInput from '~/components/UploadAvatarInput/UploadAvatarInput'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((state) => state.user)
  const [picture, setPicture] = useState()
  const [readablePicture, setReadablePicture] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signUpSchema)
  })
  const onSubmit = async (data) => {
    // console.log(picture)
    dispatch(changeStatus('loading'))
    if (picture) {
      //upload to cloudinary and then register user
      await uploadImage()
        .then(async (response) => {
          let res = await dispatch(
            registerUser({ ...data, picture: response.secure_url })
          )
          if (res?.payload) {
            navigate('/login')
          }
        })
    } else {
      let res = await dispatch(registerUser({ ...data, picture: '' }))
      if (res?.payload) {
        navigate('/login')
      }
    }
  }

  const uploadImage = async () => {
    let formData = new FormData()
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    formData.append('file', picture)
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)
    formData.append('folder', 'chat-app-user')
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    )
    return data
  }

  return (
    <div className="min-h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
      {/*Container*/}
      <div className="flex w-[1600px] mx-auto h-full">
        {/*Register form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/*Heading*/}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="mt-6 text-3xl font-bold">Welcome</h2>
              <p className="mt-2 text-sm">Sign up</p>
            </div>
            {/*Form*/}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
              <CustomInput
                name="name"
                type="text"
                placeholder="Full Name"
                register={register}
                error={errors?.name?.message}
              />
              <CustomInput
                name="email"
                type="text"
                placeholder="Email address"
                register={register}
                error={errors?.email?.message}
              />
              <CustomInput
                name="status"
                type="text"
                placeholder="Status (Optional)"
                register={register}
                error={errors?.status?.message}
              />
              <CustomInput
                name="password"
                type="password"
                placeholder="Password"
                register={register}
                error={errors?.password?.message}
              />
              {/* Picture */}
              <UploadAvatarInput
                readablePicture={readablePicture}
                setReadablePicture={setReadablePicture}
                setPicture={setPicture}
              />
              {/*if we have an error*/}
              {error ? (
                <div>
                  <p className="text-red-400">{error}</p>
                </div>
              ) : null}
              {/*Submit button*/}
              <button className="w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-full tracking-wide
              font-semibold focus:outline-none hover:bg-green_2 shadow-lg cursor-pointer transition ease-in duration-300"
              type="submit"
              >
                {status === 'loading' ? (
                  <PulseLoader color="#fff" size={16} />
                ) : (
                  'Sign up'
                )}
              </button>
              {/* Sign in link */}
              <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1">
                <span>have an account ?</span>
                <Link
                  to="/login"
                  className=" hover:underline cursor-pointer transition ease-in duration-300"
                >
              Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register