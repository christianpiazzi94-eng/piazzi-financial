// app/login/[[...rest]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      {/* This renders the full Clerk sign-in component */}
      <SignIn routing="path" path="/login" />
    </div>
  );
}