"use client";

import { useEffect, useRef, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField, {
  adminInputClass,
} from "@/components/admin/AdminFormField";
import { useAuth } from "@/context/AuthContext";
import { updatePassword, updateProfile } from "@/lib/api/profile";

export default function ProfilePage() {
  const { user, refresh } = useAuth();

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  /*
   * Keyed on the user id so the fields re-initialise from fresh data after a
   * save, without an effect that mirrors props into state.
   */
  return <ProfileForm key={user.id} user={user} refresh={refresh} />;
}

function ProfileForm({
  user,
  refresh,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  refresh: () => Promise<void>;
}) {
  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [city, setCity] = useState(user.city ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [toast, setToast] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({ name, email, phone, city, avatarFile });
      await refresh();
      setAvatarFile(null);
      setToast({ kind: "success", text: "Profile updated." });
    } catch (err: unknown) {
      setToast({
        kind: "error",
        text: err instanceof Error ? err.message : "Could not update your profile.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setToast({ kind: "error", text: "The two new passwords do not match." });
      return;
    }

    setSavingPassword(true);
    try {
      await updatePassword({ currentPassword, password, passwordConfirmation });
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
      setToast({ kind: "success", text: "Password changed." });
    } catch (err: unknown) {
      setToast({
        kind: "error",
        text: err instanceof Error ? err.message : "Could not change your password.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const shownAvatar = avatarPreview || user.avatar;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="My Profile"
        description="Your account details and password."
        breadcrumbs={[{ label: "Account" }, { label: "My Profile" }]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Details */}
        <form
          onSubmit={handleSaveProfile}
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-[14px] font-semibold text-gray-800">Your details</h2>

          <div className="mt-4 flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-primary/10">
              {shownAvatar ? (
                <SafeImage src={shownAvatar} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-[17px] font-bold text-primary">
                  {initials(user.name)}
                </span>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-[11.5px] font-semibold text-gray-700 hover:border-primary hover:text-primary"
              >
                Change photo
              </button>
              <p className="mt-1 text-[10px] text-gray-400">JPG, PNG or WebP · max 2MB</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatar}
                className="hidden"
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminFormField label="Full Name" name="name">
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={adminInputClass} />
            </AdminFormField>
            <AdminFormField label="Email" name="email">
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={adminInputClass} />
            </AdminFormField>
            <AdminFormField label="Phone" name="phone">
              <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={adminInputClass} />
            </AdminFormField>
            <AdminFormField label="City" name="city">
              <input id="city" value={city} onChange={(e) => setCity(e.target.value)} className={adminInputClass} />
            </AdminFormField>
          </div>

          {email !== user.email && (
            <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-[11.5px] text-amber-700">
              Changing your email will require verifying the new address, and it
              becomes your new login.
            </p>
          )}

          <div className="mt-5 flex justify-end border-t border-gray-100 pt-4">
            <button
              type="submit"
              disabled={savingProfile}
              className="h-9 rounded-md bg-primary px-5 text-[12px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {savingProfile ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>

        {/* Password + account summary */}
        <div className="space-y-6">
          <form
            onSubmit={handleSavePassword}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-[14px] font-semibold text-gray-800">Change password</h2>
            <p className="mt-0.5 text-[11px] text-gray-500">
              You will stay signed in on this device.
            </p>

            <div className="mt-4 space-y-3">
              <AdminFormField label="Current Password" name="currentPassword">
                <input id="currentPassword" type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={adminInputClass} />
              </AdminFormField>
              <AdminFormField label="New Password" name="password">
                <input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={adminInputClass} />
              </AdminFormField>
              <AdminFormField label="Confirm New Password" name="passwordConfirmation">
                <input id="passwordConfirmation" type="password" autoComplete="new-password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className={adminInputClass} />
              </AdminFormField>
            </div>

            <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
              <button
                type="submit"
                disabled={savingPassword || !currentPassword || !password}
                className="h-9 rounded-md bg-primary px-5 text-[12px] font-semibold text-white hover:opacity-90 disabled:opacity-40"
              >
                {savingPassword ? "Updating..." : "Update password"}
              </button>
            </div>
          </form>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-semibold text-gray-800">Account</h2>
            <dl className="mt-3 space-y-2.5 text-[12px]">
              <Row label="Role" value={capitalize(user.role)} />
              <Row label="Status" value={capitalize(user.status)} />
              <Row label="Email verified" value={user.emailVerified ? "Yes" : "No"} />
              <Row
                label="Member since"
                value={new Date(user.joinedAt).toLocaleDateString("en-PK", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              />
            </dl>
          </div>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-lg px-4 py-3 text-[12px] font-semibold shadow-lg ${
            toast.kind === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-semibold text-gray-800">{value}</dd>
    </div>
  );
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";
}
