"use client";

import { z } from "zod";
import { signup, login, redirectLayer } from "@/app/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AUTH_ERRORS,
  AUTH_ALTERNATIVE_LINKS,
  AuthType,
  FORM_FIELDS,
} from "@/types/auth";
import Link from "next/link";
import { socket } from "../../../socket";

// Auth form type: either the signup | login
interface IAuthForm {
  authText: string; // Example: on auth/signup tell the user to signup and on auth/login tell the user to log in
  authAlternative: string; // Example: on auth/signup offer the user to login, and on auth/signup offer the user to signup
  authAlternativeText: string;
  authType: AuthType; // either signup or login
}

export default function AuthForm({
  authText,
  authAlternative,
  authAlternativeText,
  authType,
}: IAuthForm) {
  const [signupError, setSignupError] = useState<string>("");
  const formSchema = z.object({
    username: z.string().min(2, {
      message: AUTH_ERRORS["username"][authType],
    }),
    password: z
      .string()
      .min(8, {
        message: AUTH_ERRORS["password"][authType],
      })
      .refine((pwd) => /\d/.test(pwd), {
        message: AUTH_ERRORS["password"][authType],
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSignupError("");
    if (authType === "signup") {
      const result = await signup(values);
      if ("message" in result) {
        setSignupError(result.message);
      } else {
        socket.emit("authentication", values.username);
        redirectLayer();
      }
    } else {
      const result = await login(values);
      if ("message" in result) {
        toast(result.message);
      } else {
        socket.emit("authentication", values.username);
        redirectLayer();
      }
      toast("Logged in successfully");
    }
  }

  return (
    <>
      <div className="w-2/3 pb-4">
        <div>
          <p className="text-black text-lg text-center pt-4 pb-12 font-semibold">
            {authText}
          </p>
        </div>
        <Form {...form}>
          <form
            className="*:cursor-pointer flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
            method="post"
          >
            {FORM_FIELDS.map((formField, index) => {
              return (
                <FormField
                  key={index}
                  control={form.control}
                  name={formField}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span className="first-letter:capitalize">
                          {formField}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div>
                          <Input
                            type={formField == "password" ? "password" : "text"}
                            placeholder={formField}
                            {...field}
                          />
                          {formField === "username" && (
                            <p
                              className={`${signupError.length > 0 ? "inline-block text-sm text-red-500 transition duration-300" : "hidden"}`}
                            >
                              {signupError}
                            </p>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
            <div className="flex justify-between mt-4 mb-2">
              <p className="cursor-auto text-blue-500 text-sm">
                {authAlternativeText}
              </p>
              <div>
                <p className="text-sm text-blue-400 first-letter:capitalize">
                  <Link href={`${AUTH_ALTERNATIVE_LINKS[authAlternative]}`}>
                    {authAlternative}
                  </Link>
                </p>
              </div>
            </div>
            <Button
              type="submit"
              className="cursor-pointer hover:duration-300 hover:transition"
            >
              <span className="first-letter:capitalize">{authType}</span>
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
