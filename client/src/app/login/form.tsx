'use client';
 

// import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import { ArrowRight, AtSignIcon, CircleAlertIcon, KeyIcon, PhoneIcon } from 'lucide-react';
import { useFormState } from 'react-dom';

import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { login } from '../../../actions/user.actions';
import { LoginSchema } from '../../schemas/login-schema';
import { useRouter } from "next/navigation"
import Link from 'next/link';


export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useFormState(
    authenticate,
    undefined,
  );

  const router = useRouter()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    const res = await login(data)

    // console.log(res)
    if (res.success) {
      router.push("/")
    } else {
      console.log({
        description: res.message,
        variant: "destructive",
      })
    }
  }

 
  return (
    <div className='h-screen flex items-center justify-center bg-white'>
    {/* <form action={formAction} onSubmit={form.handleSubmit(onSubmit)} className="space-y-3"> */}
    <form action={formAction} className="space-y-3 w-80">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
      <div className='flex items-center justify-center'> 
      <h1 className={`mb-3 text-3xl font-bold`}>
          LocalStock
        </h1>
      </div>

        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-lg font-medium text-gray-900"
              htmlFor="phone"
            >
              Phone
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="phone"
                type="phone"
                name="phone"
                placeholder="Enter your phone number"
                required
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-lg font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
    
        <button className="mt-4 w-full bg-slate-600 rounded-2xl p-4 text-sky-50" aria-disabled={isPending}>
          Log in
        </button>

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <CircleAlertIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
      <div className="mt-4 text-center text-sm">
          Don't have an account?
          <Link className="underline ml-2" href="register">
            Sign Up
          </Link>
        </div>
    </form>
    </div>
  );
}