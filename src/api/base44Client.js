import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "686873d0382a1b0e81258f0d", 
  requiresAuth: true // Ensure authentication is required for all operations
});
