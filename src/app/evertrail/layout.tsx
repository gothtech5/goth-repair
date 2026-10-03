import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";
import type { ReactNode } from "react";

function tokenFor(password: string) {
  return createHash("sha256").update("evertrail:" + password).digest("hex");
}

async function login(formData: FormData) {
  "use server";
  const password = process.env.EVERTRAIL_PASSWORD;
  const entered = String(formData.get("password") ?? "");
  const jar = await cookies();
  if (!password || entered !== password) {
    jar.set("evertrail_err", "1", { path: "/evertrail", maxAge: 5 });
    redirect("/evertrail");
  }
  jar.set("evertrail_auth", tokenFor(password), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/evertrail",
    maxAge: 60 * 60 * 12,
  });
  redirect("/evertrail");
}

export default async function EvertrailLayout({
  children,
}: {
  children: ReactNode;
}) {
  const password = process.env.EVERTRAIL_PASSWORD;
  const jar = await cookies();
  const authed =
    !!password && jar.get("evertrail_auth")?.value === tokenFor(password);

  if (authed) return <>{children}</>;

  const failed = jar.get("evertrail_err")?.value === "1";

  return (
    <main style={{ maxWidth: 360, margin: "80px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Evertrail</h1>
      <form action={login}>
        <input
          name="password"
          type="password"
          placeholder="Password"
          autoFocus
          style={{ width: "100%", padding: 10, border: "1px solid #999", borderRadius: 6 }}
        />
        {failed && (
          <p style={{ color: "red", marginTop: 8 }}>Wrong password. Try again.</p>
        )}
        <button
          type="submit"
          style={{ marginTop: 12, padding: "10px 16px", background: "#111", color: "#fff", borderRadius: 6 }}
        >
          Log in
        </button>
      </form>
    </main>
  );
}
