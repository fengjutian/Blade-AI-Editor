'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// A wrapper that only renders children on the client side to prevent hydration mismatches
const ClientOnlyWrapper = ({ children, fallback = null }: ClientOnlyWrapperProps) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback as React.ReactElement;
  }

  return children as React.ReactElement;
};

export default ClientOnlyWrapper;