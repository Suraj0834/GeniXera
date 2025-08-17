import { useState } from 'react';
import { useAppKit } from '@reown/appkit-react-native';

export function useReownWallet() {
  const { connect, disconnect, address, isConnected, error, isConnecting } = useAppKit();
  const [showModal, setShowModal] = useState(false);

  const handleConnect = async () => {
    setShowModal(true);
    try {
      await connect();
      setShowModal(false);
    } catch (e) {
      setShowModal(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  return {
    address,
    isConnected,
    error,
    isConnecting,
    showModal,
    setShowModal,
    handleConnect,
    handleDisconnect,
  };
}
