// Honor an explicitly configured HTTPS proxy in managed development environments.
// GitHub-hosted runners normally leave this unset.
export const networkProxy = process.env.HTTPS_PROXY
  ? { server: process.env.HTTPS_PROXY }
  : undefined;
