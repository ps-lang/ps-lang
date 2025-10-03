import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Welcome back</h1>
          <p className="text-stone-600">Sign in to access PS-Lang Journal</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white shadow-xl rounded-2xl border border-stone-200",
            }
          }}
        />
      </div>
    </div>
  )
}
