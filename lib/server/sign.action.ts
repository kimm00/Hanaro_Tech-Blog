'use server';

import { AuthError } from 'next-auth';
import z from 'zod';
import { auth, signIn, signOut } from './auth';
import { isErrorWithMessage } from '../errors';
import { prisma } from './prisma';
import {
  comparePassword,
  encryptPassword,
  saveProfile,
  validate,
  validateAsync,
  type ValidError,
  emailSchema,
  passwordSchema,
  nameSchema,
} from './validator';

export type Provider = 'google' | 'github' | 'credentials';

/* ---------------- logout ---------------- */
export const logout = async () => {
  await signOut({ redirectTo: '/' });
};

/* ---------------- oauth login ---------------- */
const login = async (provider: Provider, formData: FormData) => {
  const redirectTo = (formData.get('redirectTo') as string) || '/';
  await signIn(provider, { redirectTo });
};

export const loginGoogle = async (formData: FormData) =>
  login('google', formData);

export const loginGithub = async (formData: FormData) =>
  login('github', formData);

/* ---------------- email login ---------------- */
export const loginEmail = async (formData: FormData) => {
  const session = await auth();
  if (session?.user) {
    return [
      {
        error: { email: '이미 로그인된 상태입니다.' },
        data: Object.fromEntries(formData.entries()),
      },
    ];
  }

  const zobj = z.object({
    email: emailSchema,
    passwd: z.string().min(1, '비밀번호를 입력해주세요.'),
  });

  const [err, data] = validate(zobj, formData);
  if (err) return [err];

  try {
    await signIn('credentials', { redirect: false, ...data });
    return [undefined, data];
  } catch (err) {
    if (err instanceof AuthError) {
      return [
        { error: { email: '이메일 또는 비밀번호가 올바르지 않습니다.' }, data },
      ];
    }
    return [{ error: { email: '로그인 중 오류가 발생했습니다.' }, data }];
  }
};

/* ---------------- register ---------------- */
export const regist = async (
  _: ValidError | undefined,
  formData: FormData,
): Promise<ValidError> => {
  const zobj = z
    .object({
      name: nameSchema,
      email: emailSchema,
      passwd: passwordSchema,
      passwd2: z.string(),
      image: z.string().optional(),
    })
    .refine(({ passwd, passwd2 }) => passwd === passwd2, {
      path: ['passwd2'],
      message: '비밀번호가 일치하지 않습니다.',
    });

  const imageFile = await saveProfile(formData.get('image') as File);
  formData.set('image', imageFile || '');

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { email, name, image, passwd } = data;

  const existUser = await prisma.user.findUnique({ where: { email } });
  if (existUser) {
    return {
      error: { email: '이미 가입된 이메일입니다.' },
      data,
    };
  }

  const enc = await encryptPassword(passwd!);
  await prisma.user.create({
    data: { email, name, passwd: enc, image },
  });

  return {
    error: {},
    data: {
      success: 'true',
    },
  };
};

/* ---------------- change password ---------------- */
export const changePassword = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user) throw new Error('Need Login');

  const zobj = z
    .object({
      email: emailSchema,
      curr_passwd: z.string().min(1),
      passwd: passwordSchema,
      passwd2: z.string(),
    })
    .superRefine(async ({ email, curr_passwd, passwd, passwd2 }, ctx) => {
      const user = await prisma.user.findFirst({
        where: {
          email,
          outdt: null, // ⭐ 탈퇴 안 한 유저만
        },
      });
      if (!user) {
        ctx.addIssue({ code: 'custom', path: ['email'], message: '유저 없음' });
        return;
      }

      const ok = await comparePassword(curr_passwd, user.passwd!);
      if (!ok) {
        ctx.addIssue({
          code: 'custom',
          path: ['curr_passwd'],
          message: '현재 비밀번호가 틀립니다.',
        });
      }

      if (passwd !== passwd2) {
        ctx.addIssue({
          code: 'custom',
          path: ['passwd2'],
          message: '비밀번호가 일치하지 않습니다.',
        });
      }
    });

  const [err, data] = await validateAsync(zobj, formData);
  if (err) return [err];

  const enc = await encryptPassword(data.passwd!);
  await prisma.user.update({
    where: { email: data.email! },
    data: { passwd: enc },
  });

  return {
    error: {},
    data: {
      success: 'true',
    },
  };
};
