# AB Dev Studio account system

This version adds login/signup, dashboard and a one-free-service flow.

Important: the included auth is a **frontend real** using localStorage. It is not suitable for real accounts, real passwords, payments, or enforcing a free-service limit against determined users. For production, connect the same UI to a real authentication/database backend (for example Supabase or Firebase) and enforce `freeUsed` server-side.
