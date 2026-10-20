import SettingsClient from "@/components/Settingsclient";
import { getAuthUser } from "@/lib/utils";

// Place at: app/(dashboard)/settings/page.tsx (same folder level as your other dashboard pages)
const SettingsPage = async () => {
  const { role } = await getAuthUser();

  return <SettingsClient role={role || "user"} />;
};

export default SettingsPage;
