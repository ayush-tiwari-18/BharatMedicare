// auth.middleware.js
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// This will automatically read the Bearer token header or
// session cookie, verify it, and populate req.auth.userId
export default ClerkExpressRequireAuth();
