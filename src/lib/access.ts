export type AccessProfile = {
  subscription_status: string | null;
  created_at: string;
};

const TRIAL_DAYS = 10;

export function trialDaysLeft(profile: AccessProfile): number {
  const created = new Date(profile.created_at).getTime();
  const elapsed = Date.now() - created;
  const left = TRIAL_DAYS - Math.floor(elapsed / (24 * 60 * 60 * 1000));
  return Math.max(0, left);
}

// Full access = active subscriber OR still within the trial window.
export function hasProAccess(profile: AccessProfile): boolean {
  if (profile.subscription_status === "active") return true;
  return trialDaysLeft(profile) > 0;
}
