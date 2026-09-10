import type { Metadata } from "next";
import AdminApp from "./AdminApp";

export const metadata: Metadata = {
  title: "Coulisses — Fiona & Antoine",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="flex min-h-dvh bg-rose-bg p-3 sm:p-5">
      <div className="relative flex flex-1 flex-col rounded-[2rem] bg-rouge text-rose px-4 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <header className="mb-7">
            <p className="text-xs uppercase tracking-[0.3em] font-semibold opacity-70">
              Fan Club
            </p>
            <h1 className="font-display text-4xl sm:text-5xl">Les coulisses</h1>
          </header>
          <AdminApp />
        </div>
      </div>
    </main>
  );
}
