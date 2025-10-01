import { useState, useEffect } from 'react';
import { Button, Card, Text, Group, ActionIcon } from '@mantine/core';
import { IconDownload, IconX } from '@tabler/icons-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppMode = (window.navigator as any).standalone === true;

    if (isStandalone || isInWebAppMode) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show install prompt after a short delay
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error installing app:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  // Don't show if app is installed, prompt was dismissed, or no deferred prompt
  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null;
  }

  // Don't show if user dismissed it this session
  if (sessionStorage.getItem('installPromptDismissed')) {
    return null;
  }

  return (
    <Card
      shadow="md"
      padding="md"
      radius="md"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        zIndex: 1000,
        maxWidth: '400px',
        margin: '0 auto'
      }}
    >
      <Group justify="space-between" align="flex-start">
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500} mb="xs">
            Install Formshive
          </Text>
          <Text size="xs" c="dimmed" mb="md">
            Get quick access to form building with our desktop app.
          </Text>

          <Group gap="xs">
            <Button
              size="xs"
              leftSection={<IconDownload size={14} />}
              onClick={handleInstallClick}
            >
              Install App
            </Button>
            <Button
              size="xs"
              variant="subtle"
              onClick={handleDismiss}
            >
              Not now
            </Button>
          </Group>
        </div>

        <ActionIcon
          size="sm"
          variant="subtle"
          color="gray"
          onClick={handleDismiss}
        >
          <IconX size={14} />
        </ActionIcon>
      </Group>
    </Card>
  );
}