import { useEffect, useState, useRef } from 'react';
import { Button, Group, Notification } from '@mantine/core';
import { IconRefresh, IconCheck } from '@tabler/icons-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function PWAStatus() {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered: ' + r);

      // Set up periodic update checks every 60 seconds
      intervalRef.current = setInterval(async () => {
        try {
          console.log('Checking for updates...');
          await r?.update();
        } catch (error) {
          console.log('Error checking for updates:', error);
        }
      }, 60000);
    },
    onRegisterError(error: any) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowUpdateNotification(true);
    }
  }, [needRefresh]);

  // Auto-close offline ready notification after 3 seconds
  useEffect(() => {
    if (offlineReady) {
      const timer = setTimeout(() => {
        setOfflineReady(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [offlineReady, setOfflineReady]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowUpdateNotification(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
    close();
  };

  if (showUpdateNotification && needRefresh) {
    return (
      <Notification
        icon={<IconRefresh size={18} />}
        color="blue"
        title="App Update Available"
        onClose={close}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          maxWidth: '350px'
        }}
      >
        <div>
          A new version of Formshive is available.
          <Group gap="xs" mt="xs">
            <Button size="xs" onClick={handleUpdate}>
              Update Now
            </Button>
            <Button size="xs" variant="subtle" onClick={close}>
              Later
            </Button>
          </Group>
        </div>
      </Notification>
    );
  }

  if (offlineReady) {
    return (
      <Notification
        icon={<IconCheck size={18} />}
        color="green"
        title="App Ready"
        onClose={close}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          maxWidth: '350px'
        }}
      >
        Formshive is ready to work offline!
      </Notification>
    );
  }

  return null;
}

// Export the manual check function for use in settings/menu
export const useManualUpdateCheck = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkForUpdates = async () => {
    if (isChecking) return;

    setIsChecking(true);
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          console.log('Manual update check triggered');
          await registration.update();
        }
      }
    } catch (error) {
      console.error('Manual update check failed:', error);
    } finally {
      setTimeout(() => setIsChecking(false), 1000);
    }
  };

  return { checkForUpdates, isChecking };
};