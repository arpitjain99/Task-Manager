import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-bg-primary px-4">
      <SignUp />
    </main>
  );
}
