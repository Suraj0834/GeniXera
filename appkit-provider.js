import React from 'react';
import { AppKitProvider } from '@reown/appkit-react-native';
import { getDefaultConfig } from '@reown/appkit-react-native';

const config = getDefaultConfig({
  chains: ['mainnet', 'polygon'],
  appName: 'GeniXera',
});

export function ReownAppKitProvider({ children }) {
  return <AppKitProvider config={config}>{children}</AppKitProvider>;
}
