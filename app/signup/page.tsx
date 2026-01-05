import RegistForm from '@/components/auth/RegistForm';

export default function SignupPage() {
  return (
    <div className="mx-auto mt-20 w-96 border p-6">
      <h1 className="mb-6 text-center font-semibold text-xl">회원가입</h1>
      <RegistForm />
    </div>
  );
}
