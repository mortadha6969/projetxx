const { exec } = require('child_process');

const PORT = 3001;

// Find the process using the port
exec(`netstat -ano | findstr :${PORT}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error finding process: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }
  
  // Parse the output to get the PID
  const lines = stdout.trim().split('\n');
  if (lines.length === 0) {
    console.log(`No process found using port ${PORT}`);
    return;
  }
  
  // The PID is the last column in the output
  const pidMatch = lines[0].match(/\s+(\d+)$/);
  if (!pidMatch) {
    console.log(`Could not extract PID from output: ${lines[0]}`);
    return;
  }
  
  const pid = pidMatch[1];
  console.log(`Found process with PID ${pid} using port ${PORT}`);
  
  // Kill the process
  exec(`taskkill /F /PID ${pid}`, (killError, killStdout, killStderr) => {
    if (killError) {
      console.error(`Error killing process: ${killError.message}`);
      return;
    }
    
    if (killStderr) {
      console.error(`Error: ${killStderr}`);
      return;
    }
    
    console.log(`Successfully killed process with PID ${pid}`);
    console.log(`Port ${PORT} is now free to use`);
  });
});
