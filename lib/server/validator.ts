/** biome-ignore-all lint/style/useNodejsImportProtocol: 'edge runtime' */
import { compare, hash } from 'bcryptjs';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import z from 'zod';

export type ValidError = {
  error: Record<string, string | undefined>;
  data: Record<string, string | undefined>;
};

export const validate = <T extends z.ZodObject>(
  zobj: T,
  formData: FormData,
) => {
  const data = Object.fromEntries(formData.entries()) as ValidError['data'];
  for (const k of Object.keys(data)) {
    if (k.startsWith('$')) delete data[k];
  }
  const validator = zobj.safeParse(data);
  if (!validator.success) {
    const verr = z.treeifyError(validator.error).properties || {};
    const validError: ValidError = { error: {}, data };
    for (const [k, v] of Object.entries(verr)) {
      validError.error[k] = v?.errors[0];
    }
    return [validError] as const;
  }

  return [undefined, validator.data] as const;
};

export const validateAsync = async <T extends z.ZodObject>(
  zobj: T,
  formData: FormData,
) => {
  const data = Object.fromEntries(formData.entries()) as ValidError['data'];
  for (const k of Object.keys(data)) {
    if (k.startsWith('$')) delete data[k];
  }
  const validator = await zobj.safeParseAsync(data);
  if (!validator.success) {
    const verr = z.treeifyError(validator.error).properties || {};
    const validError: ValidError = { error: {}, data };
    for (const [k, v] of Object.entries(verr)) {
      validError.error[k] = v?.errors[0];
    }
    return [validError] as const;
  }

  return [undefined, validator.data] as const;
};

export const saveProfile = async (file: File) => {
  if (file && file.size > 0) {
    const fileName = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public/profile');
    if (!existsSync(uploadDir)) mkdirSync(uploadDir);
    const filePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(filePath, buffer);
    return `/profile/${fileName}`;
  }
};

export const encryptPassword = async (plainPasswd: string) =>
  hash(plainPasswd, 10);

export const comparePassword = async (
  plainPasswd: string,
  encPassword: string,
) => compare(plainPasswd, encPassword);

// ✅ 이메일 검증 헬퍼 (강화)
export const emailSchema = z
  .string()
  .min(1, '이메일을 입력해주세요.')
  .email('올바른 이메일 형식이 아닙니다.')
  .refine(
    (email) => {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    },
    { message: '유효한 이메일 주소를 입력해주세요. (예: user@example.com)' },
  )
  .refine((email) => (email.match(/@/g) || []).length === 1, {
    message: '이메일에는 @ 기호가 정확히 하나 포함되어야 합니다.',
  });

// ✅ 비밀번호 검증 헬퍼 (강화)
export const passwordSchema = z
  .string()
  .min(1, '비밀번호를 입력해주세요.')
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
  .max(100, '비밀번호는 100자 이내로 입력해주세요.')
  .refine((passwd) => /[A-Za-z]/.test(passwd), {
    message: '비밀번호는 최소 1개의 영문자를 포함해야 합니다.',
  })
  .refine((passwd) => /[0-9]/.test(passwd), {
    message: '비밀번호는 최소 1개의 숫자를 포함해야 합니다.',
  })
  .refine((passwd) => /[!@#$%^&*(),.?":{}|<>]/.test(passwd), {
    message: '비밀번호는 최소 1개의 특수문자를 포함해야 합니다.',
  });

// ✅ 이름 검증 헬퍼
export const nameSchema = z
  .string()
  .min(1, '이름을 입력해주세요.')
  .max(30, '이름은 30자 이내로 입력해주세요.')
  .refine((name) => name.trim().length > 0, {
    message: '이름은 공백만 입력할 수 없습니다.',
  });
