"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import {
  Bell,
  Camera,
  Check,
  KeyRound,
  Loader2,
  LogOut,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  ShieldCheck,
  Sun,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Density, FontSize, Theme, useTheme } from "@/components/Themeprovider";

/* ------------------------------------------------------------------ */
/* small building blocks                                               */
/* ------------------------------------------------------------------ */

const Card = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    <div className="mb-4">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
    {children}
  </span>
);

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-700/30 focus:border-blue-700 disabled:opacity-60";

const PrimaryButton = ({
  children,
  loading,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) => (
  <button
    {...rest}
    disabled={loading || rest.disabled}
    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60 transition-colors"
  >
    {loading && <Loader2 size={14} className="animate-spin" />}
    {children}
  </button>
);

const Switch = ({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) => (
  <div className="flex items-center justify-between gap-4 py-3">
    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-800">{label}</p>
      {description && (
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      )}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-blue-700" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  </div>
);

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            value === o.value
              ? "bg-blue-700 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const errMsg = (e: any) =>
  e?.errors?.[0]?.longMessage ||
  e?.errors?.[0]?.message ||
  e?.message ||
  "Something went wrong";

/* ------------------------------------------------------------------ */
/* Appearance                                                          */
/* ------------------------------------------------------------------ */

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] =
  [
    { value: "light", label: "Light", icon: <Sun size={16} /> },
    { value: "dark", label: "Dark", icon: <Moon size={16} /> },
    { value: "system", label: "System", icon: <Monitor size={16} /> },
  ];

const Appearance = () => {
  const { prefs, setPrefs, resetPrefs } = useTheme();

  return (
    <div className="flex flex-col gap-4">
      <Card
        title="Theme"
        subtitle="Choose how School TimNet looks on this device."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {THEME_OPTIONS.map((o) => {
            const active = prefs.theme === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => setPrefs({ theme: o.value })}
                className={`relative rounded-xl border p-3 text-left transition-all ${
                  active
                    ? "border-blue-700 ring-2 ring-blue-700/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* mini preview (fixed colours so it always shows the theme it represents) */}
                <div
                  className="h-16 rounded-lg overflow-hidden border flex"
                  style={{
                    background:
                      o.value === "dark"
                        ? "#0b1220"
                        : o.value === "light"
                          ? "#F6F8FB"
                          : "linear-gradient(90deg,#F6F8FB 50%,#0b1220 50%)",
                    borderColor: o.value === "dark" ? "#1f2b46" : "#e5e7eb",
                  }}
                >
                  <div
                    className="w-1/4 h-full"
                    style={{
                      background: o.value === "dark" ? "#111a2e" : "#ffffff",
                    }}
                  />
                  <div className="flex-1 p-2 flex flex-col gap-1.5">
                    <div className="h-2 w-2/3 rounded bg-blue-700" />
                    <div
                      className="h-2 w-full rounded"
                      style={{
                        background: o.value === "dark" ? "#1f2b46" : "#e5e7eb",
                      }}
                    />
                    <div
                      className="h-2 w-1/2 rounded"
                      style={{
                        background: o.value === "dark" ? "#1f2b46" : "#e5e7eb",
                      }}
                    />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-800">
                  {o.icon}
                  {o.label}
                  {active && (
                    <Check size={14} className="ml-auto text-blue-700" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card
        title="Display"
        subtitle="Make the portal easier to read or fit more on screen."
      >
        <div className="flex flex-col divide-y divide-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
            <div>
              <p className="text-sm font-medium text-gray-800">Text size</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Scales the whole interface.
              </p>
            </div>
            <Segmented<FontSize>
              value={prefs.fontSize}
              onChange={(fontSize) => setPrefs({ fontSize })}
              options={[
                { value: "sm", label: "Small" },
                { value: "md", label: "Default" },
                { value: "lg", label: "Large" },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 last:pb-0">
            <div>
              <p className="text-sm font-medium text-gray-800">Table density</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Compact shows more rows per page.
              </p>
            </div>
            <Segmented<Density>
              value={prefs.density}
              onChange={(density) => setPrefs({ density })}
              options={[
                { value: "comfortable", label: "Comfortable" },
                { value: "compact", label: "Compact" },
              ]}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            resetPrefs();
            toast.success("Appearance reset to defaults");
          }}
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-blue-700"
        >
          <RotateCcw size={13} /> Reset appearance
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

const Profile = ({ role }: { role: string }) => {
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
    }
  }, [user]);

  if (!isLoaded || !user) {
    return (
      <Card title="Profile">
        <div className="h-24 flex items-center justify-center text-gray-400">
          <Loader2 className="animate-spin" size={18} />
        </div>
      </Card>
    );
  }

  const dirty =
    firstName.trim() !== (user.firstName ?? "") ||
    lastName.trim() !== (user.lastName ?? "");

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }
    setUploading(true);
    try {
      await user.setProfileImage({ file });
      toast.success("Photo updated");
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <Card
      title="Profile"
      subtitle="Your name and photo shown across the portal."
    >
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.imageUrl}
              alt="Avatar"
              className="h-24 w-24 rounded-full object-cover border border-gray-100"
            />
            {uploading && (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <Loader2 className="animate-spin text-white" size={18} />
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onFile}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:underline"
          >
            <Camera size={13} /> Change photo
          </button>
        </div>

        <form
          onSubmit={save}
          className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <label className="flex flex-col gap-1.5">
            <Label>First name</Label>
            <input
              className={inputCls}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <Label>Last name</Label>
            <input
              className={inputCls}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <Label>Email</Label>
            <input
              className={inputCls}
              value={user.primaryEmailAddress?.emailAddress ?? ""}
              disabled
              readOnly
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <Label>Role</Label>
            <input
              className={`${inputCls} capitalize`}
              value={role}
              disabled
              readOnly
            />
          </label>
          <div className="sm:col-span-2 flex justify-end">
            <PrimaryButton type="submit" loading={saving} disabled={!dirty}>
              Save changes
            </PrimaryButton>
          </div>
        </form>
      </div>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Security                                                            */
/* ------------------------------------------------------------------ */

const Security = () => {
  const { user, isLoaded } = useUser();
  const { signOut, session } = useClerk();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const loadSessions = async () => {
    if (!user) return;
    try {
      const list = await user.getSessions();
      setSessions(list);
    } catch {
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    if (user) loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!isLoaded || !user) return null;

  const mismatch = confirm.length > 0 && next !== confirm;
  const canSubmit = current && next.length >= 8 && next === confirm;

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      await user.updatePassword({
        currentPassword: current,
        newPassword: next,
        signOutOfOtherSessions: false,
      });
      toast.success("Password changed");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const revoke = async (s: any) => {
    try {
      await s.revoke();
      toast.success("Device signed out");
      loadSessions();
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  const others = sessions.filter((s) => s.id !== session?.id);

  return (
    <div className="flex flex-col gap-4">
      <Card
        title="Change password"
        subtitle="Use at least 8 characters. You'll stay signed in on this device."
      >
        {user.passwordEnabled ? (
          <form
            onSubmit={changePassword}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <label className="flex flex-col gap-1.5">
              <Label>Current password</Label>
              <input
                type="password"
                autoComplete="current-password"
                className={inputCls}
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <Label>New password</Label>
              <input
                type="password"
                autoComplete="new-password"
                className={inputCls}
                value={next}
                onChange={(e) => setNext(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <Label>Confirm new password</Label>
              <input
                type="password"
                autoComplete="new-password"
                className={inputCls}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              {mismatch && (
                <span className="text-xs text-red-600">
                  Passwords don&apos;t match
                </span>
              )}
            </label>
            <div className="sm:col-span-3 flex justify-end">
              <PrimaryButton
                type="submit"
                loading={saving}
                disabled={!canSubmit}
              >
                <KeyRound size={14} /> Update password
              </PrimaryButton>
            </div>
          </form>
        ) : (
          <p className="text-sm text-gray-500">
            This account signs in without a password, so there is nothing to
            change here.
          </p>
        )}
      </Card>

      <Card
        title="Signed-in devices"
        subtitle="Sign out of devices you don't recognise."
      >
        {loadingSessions ? (
          <div className="h-12 flex items-center justify-center text-gray-400">
            <Loader2 className="animate-spin" size={16} />
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-gray-500">No active sessions found.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-100">
            {sessions.map((s) => {
              const a = s.latestActivity || {};
              const isCurrent = s.id === session?.id;
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {a.browserName || "Browser"} on{" "}
                      {a.isMobile ? "mobile" : "desktop"}
                      {isCurrent && (
                        <span className="ml-2 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-green-700">
                          This device
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {[a.city, a.country].filter(Boolean).join(", ") ||
                        "Unknown location"}{" "}
                      ·{" "}
                      {s.lastActiveAt
                        ? new Date(s.lastActiveAt).toLocaleString()
                        : ""}
                    </p>
                  </div>
                  {!isCurrent && (
                    <button
                      type="button"
                      onClick={() => revoke(s)}
                      className="text-xs font-medium text-red-600 hover:underline shrink-0"
                    >
                      Sign out
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {others.length > 1 && (
          <button
            type="button"
            onClick={async () => {
              await Promise.all(
                others.map((s) => s.revoke().catch(() => null)),
              );
              toast.success("Signed out of all other devices");
              loadSessions();
            }}
            className="mt-4 text-xs font-medium text-red-600 hover:underline"
          >
            Sign out of all other devices
          </button>
        )}
      </Card>

      <Card title="Sign out" subtitle="End your session on this device.">
        <button
          type="button"
          onClick={() => signOut({ redirectUrl: "/" })}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
        >
          <LogOut size={14} /> Sign out
        </button>
      </Card>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Notifications (stored per-browser)                                  */
/* ------------------------------------------------------------------ */

const NOTIFY_KEY = "tn-notify";
const NOTIFY_DEFAULTS = {
  announcements: true,
  exams: true,
  results: true,
  assignments: true,
  events: false,
  email: false,
};

const Notifications = () => {
  const [prefs, setPrefs] = useState(NOTIFY_DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTIFY_KEY);
      if (raw) setPrefs({ ...NOTIFY_DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const set = (key: keyof typeof NOTIFY_DEFAULTS, v: boolean) => {
    const next = { ...prefs, [key]: v };
    setPrefs(next);
    try {
      localStorage.setItem(NOTIFY_KEY, JSON.stringify(next));
    } catch {}
  };

  const rows: {
    key: keyof typeof NOTIFY_DEFAULTS;
    label: string;
    description: string;
  }[] = [
    {
      key: "announcements",
      label: "Announcements",
      description: "School-wide and class notices.",
    },
    { key: "exams", label: "Exams", description: "New or rescheduled exams." },
    {
      key: "results",
      label: "Results",
      description: "When new grades are published.",
    },
    {
      key: "assignments",
      label: "Assignments",
      description: "New work and due dates.",
    },
    { key: "events", label: "Events", description: "Upcoming school events." },
    {
      key: "email",
      label: "Email digest",
      description: "A daily summary to your inbox.",
    },
  ];

  return (
    <Card
      title="Notifications"
      subtitle="Choose what shows up for you. Saved on this browser."
    >
      <div className="flex flex-col divide-y divide-gray-100">
        {rows.map((r) => (
          <Switch
            key={r.key}
            label={r.label}
            description={r.description}
            checked={prefs[r.key]}
            onChange={(v) => set(r.key, v)}
          />
        ))}
      </div>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Page shell                                                          */
/* ------------------------------------------------------------------ */

const TABS = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
] as const;

type TabId = (typeof TABS)[number]["id"];

const SettingsClient = ({ role }: { role: string }) => {
  const [tab, setTab] = useState<TabId>("appearance");

  // remember the last tab (nice-to-have; ignore storage errors)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tn-settings-tab") as TabId | null;
      if (saved && TABS.some((t) => t.id === saved)) setTab(saved);
    } catch {}
  }, []);
  const choose = (id: TabId) => {
    setTab(id);
    try {
      localStorage.setItem("tn-settings-tab", id);
    } catch {}
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl">
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your account, security and how the portal looks.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <nav
          className="md:w-52 shrink-0 flex md:flex-col gap-1 overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm p-2 h-fit"
          aria-label="Settings sections"
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => choose(t.id)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </nav>

        <div className="flex-1 min-w-0">
          {tab === "appearance" && <Appearance />}
          {tab === "profile" && <Profile role={role} />}
          {tab === "security" && <Security />}
          {tab === "notifications" && <Notifications />}
        </div>
      </div>
    </div>
  );
};

export default SettingsClient;
