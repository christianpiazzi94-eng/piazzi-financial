// app/signup/[[...rest]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      {/* This renders the full Clerk sign-up component */}
      <SignUp routing="path" path="/signup" />
    </div>
  );
}