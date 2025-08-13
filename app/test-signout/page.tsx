import { signOutAction } from "@/app/actions/auth";

export default function TestSignOutPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Sign Out</h1>
      <form action={signOutAction}>
        <button 
          type="submit" 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Test Sign Out Action
        </button>
      </form>
    </div>
  );
}
