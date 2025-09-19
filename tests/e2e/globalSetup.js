import { preview } from 'vite';
import { spawn } from 'child_process';

let server;
let devProcess;

export async function setup() {
  console.log('🚀 Starting development server for E2E tests...');
  
  return new Promise((resolve) => {
    // Start the dev server
    devProcess = spawn('npm', ['run', 'dev'], {
      shell: true,
      detached: false,
      stdio: 'pipe'
    });

    let serverStarted = false;

    // Listen for server output
    devProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Dev server:', output);
      
      // Check if server has started
      if (!serverStarted && output.includes('Local:') || output.includes('ready in')) {
        serverStarted = true;
        console.log('✅ Development server started successfully');
        
        // Wait a bit more to ensure server is fully ready
        setTimeout(() => {
          resolve();
        }, 2000);
      }
    });

    devProcess.stderr.on('data', (data) => {
      console.error('Dev server error:', data.toString());
    });

    devProcess.on('error', (error) => {
      console.error('Failed to start dev server:', error);
      process.exit(1);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverStarted) {
        console.error('❌ Dev server failed to start within 30 seconds');
        process.exit(1);
      }
    }, 30000);
  });
}

export async function teardown() {
  console.log('🛑 Stopping development server...');
  
  if (devProcess) {
    try {
      // Kill the process group on Windows
      if (process.platform === 'win32') {
        spawn('taskkill', ['/F', '/T', '/PID', devProcess.pid.toString()], { shell: true });
      } else {
        process.kill(-devProcess.pid);
      }
    } catch (error) {
      console.error('Error stopping dev server:', error);
      devProcess.kill('SIGTERM');
    }
  }
  
  if (server) {
    await server.close();
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  await teardown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await teardown();
  process.exit(0);
});
