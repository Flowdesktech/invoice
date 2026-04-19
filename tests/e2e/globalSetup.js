import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

let devProcess;

const PORT = process.env.E2E_PORT || '3000';

function waitForServer({ match, timeoutMs = 60000 }) {
  return new Promise((resolve, reject) => {
    let started = false;

    devProcess.stdout?.on('data', (data) => {
      const output = data.toString();
      console.log('Next server:', output);
      if (!started && match.test(output)) {
        started = true;
        setTimeout(resolve, 1500);
      }
    });

    devProcess.stderr?.on('data', (data) => {
      console.error('Next server error:', data.toString());
    });

    devProcess.on('error', (error) => {
      console.error('Failed to start Next.js server:', error);
      reject(error);
    });

    setTimeout(() => {
      if (!started) reject(new Error(`Next.js server did not become ready within ${timeoutMs}ms`));
    }, timeoutMs);
  });
}

export async function setup() {
  const isCI = process.env.CI === 'true';
  const firebaseEnv = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION:
      process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION || 'us-central1',
  };

  if (isCI) {
    console.log('Building Next.js app for E2E tests (CI mode)...');
    await new Promise((resolve, reject) => {
      const buildProcess = spawn('npm', ['run', 'build'], {
        shell: true,
        stdio: 'inherit',
        env: { ...process.env, ...firebaseEnv, NODE_ENV: 'production' },
      });
      buildProcess.on('close', (code) => {
        if (code !== 0) return reject(new Error(`Build failed with code ${code}`));
        if (!fs.existsSync(path.join(process.cwd(), '.next'))) {
          return reject(new Error('Build output missing - .next directory not found'));
        }
        console.log('Build completed successfully');
        resolve();
      });
    });

    console.log(`Starting Next.js production server on port ${PORT}...`);
    devProcess = spawn('npm', ['run', 'start', '--', '-p', PORT], {
      shell: true,
      stdio: 'pipe',
      env: { ...process.env, ...firebaseEnv, PORT },
    });
    await waitForServer({ match: /Ready in|started server on/i, timeoutMs: 60000 });
    console.log(`Next.js server ready at http://localhost:${PORT}`);
  } else {
    console.log(`Starting Next.js dev server on port ${PORT}...`);
    devProcess = spawn('npm', ['run', 'dev', '--', '-p', PORT], {
      shell: true,
      detached: false,
      stdio: 'pipe',
      env: { ...process.env, ...firebaseEnv },
    });
    await waitForServer({ match: /Ready in|compiled client and server successfully/i });
    console.log(`Next.js dev server ready at http://localhost:${PORT}`);
  }
}

export async function teardown() {
  console.log('Stopping Next.js server...');
  if (devProcess && devProcess.pid) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/F', '/T', '/PID', devProcess.pid.toString()], { shell: true });
      } else {
        process.kill(-devProcess.pid, 'SIGTERM');
      }
    } catch (error) {
      if (error.code !== 'ESRCH') {
        console.error('Error stopping Next.js server:', error);
        try {
          devProcess.kill('SIGTERM');
        } catch (_) {
          // ignore
        }
      }
    }
  }
}

process.on('SIGINT', async () => {
  await teardown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await teardown();
  process.exit(0);
});
