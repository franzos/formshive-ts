import * as Sentry from '@sentry/react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useRustyState } from './state';
import { SENTRY_DSN, SENTRY_ENVIRONMENT } from './constants';

// Initialize Sentry
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.01 : 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

const init = () => {
  useRustyState.getState().init();
};

init();

const AppWithSentry = SENTRY_DSN
  ? Sentry.withErrorBoundary(App, {
      fallback: ({ error }) => (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>We've been notified about this error and will fix it soon.</p>
          <details style={{ marginTop: '10px' }}>
            <summary>Error details</summary>
            <pre style={{ textAlign: 'left', overflow: 'auto' }}>{String(error)}</pre>
          </details>
        </div>
      ),
    })
  : App;

ReactDOM.createRoot(document.getElementById('root')!).render(<AppWithSentry />);
