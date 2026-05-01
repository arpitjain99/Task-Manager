import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-bg-primary px-4">
      <SignIn />
    </main>
  );
}
