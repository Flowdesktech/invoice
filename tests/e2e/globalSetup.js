import { preview } from 'vite';
import { spawn } from 'child_process';

let server;
let devProcess;

export async function setup() {
  const isCI = process.env.CI === 'true';
  
  if (isCI) {
    // In CI, use preview mode with a built app
    console.log('🚀 Starting preview server for E2E tests (CI mode)...');
    
    // Build the app first
    console.log('📦 Building application...');
    await new Promise((resolve, reject) => {
      const buildProcess = spawn('npm', ['run', 'build'], {
        shell: true,
        stdio: 'inherit',
        env: {
          ...process.env,
          // Add any required build env vars here
          NODE_ENV: 'production'
        }
      });
      
      buildProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Build failed with code ${code}`));
        }
      });
    });
    
    // Start preview server
    server = await preview({
      preview: {
        port: 5173,
        strictPort: true,
        host: 'localhost'
      }
    });
    
    await server.listen();
    console.log('✅ Preview server started at http://localhost:5173');
    
  } else {
    // Local development mode
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
        if (!serverStarted && (output.includes('Local:') || output.includes('ready in'))) {
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
}

export async function teardown() {
  console.log('🛑 Stopping server...');
  
  // Handle preview server in CI mode
  if (server) {
    try {
      await server.close();
      console.log('✅ Preview server stopped');
    } catch (error) {
      console.error('Error stopping preview server:', error);
    }
  }
  
  // Handle dev process in local mode
  if (devProcess && devProcess.pid) {
    try {
      // Kill the process group on Windows
      if (process.platform === 'win32') {
        spawn('taskkill', ['/F', '/T', '/PID', devProcess.pid.toString()], { shell: true });
      } else {
        // Use negative PID to kill the entire process group
        process.kill(-devProcess.pid, 'SIGTERM');
      }
      console.log('✅ Dev server stopped');
    } catch (error) {
      // ESRCH error means process doesn't exist, which is fine
      if (error.code !== 'ESRCH') {
        console.error('Error stopping dev server:', error);
        try {
          devProcess.kill('SIGTERM');
        } catch (e) {
          // Ignore errors here
        }
      }
    }
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
