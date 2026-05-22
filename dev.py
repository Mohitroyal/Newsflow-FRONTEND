import subprocess
import os
import sys
import time
import threading
import signal

os.environ["PYTHONUNBUFFERED"] = "1"

def kill_ports(ports):
    """Automatically finds and kills processes listening on specified ports in Windows"""
    for port in ports:
        try:
            result = subprocess.run(f"netstat -ano | findstr :{port}", shell=True, capture_output=True, text=True)
            if result.stdout:
                lines = result.stdout.strip().split('\n')
                pids = set()
                for line in lines:
                    parts = line.strip().split()
                    # Look for LISTENING processes to avoid killing random ephemeral connections
                    if len(parts) >= 5 and "LISTENING" in line:
                        pid = parts[-1]
                        if pid != "0":
                            pids.add(pid)
                
                for pid in pids:
                    print(f"[CLEANUP] Terminating orphaned process (PID: {pid}) hogging port {port}...")
                    subprocess.run(f"taskkill /F /PID {pid} /T", shell=True, capture_output=True)
        except Exception as e:
            print(f"[CLEANUP] Warning: Could not clean port {port}: {e}")

def run_command(command, cwd, label):
    print(f"[{label}] Starting: {command}")
    process = subprocess.Popen(
        command,
        cwd=cwd,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        encoding="utf-8",
        errors="replace",
        bufsize=1,
        universal_newlines=True,
        env={**os.environ, "PYTHONUNBUFFERED": "1"}
    )
    
    for line in process.stdout:
        try:
            print(f"[{label}] {line.strip()}", flush=True)
        except UnicodeEncodeError:
            try:
                encoding = sys.stdout.encoding or 'utf-8'
                safe_line = line.strip().encode(encoding, errors='replace').decode(encoding)
                print(f"[{label}] {safe_line}", flush=True)
            except Exception:
                print(f"[{label}] {line.strip().encode('ascii', 'replace').decode('ascii')}", flush=True)

def start_backend():
    # Install requirements first
    backend_dir = os.path.join(os.getcwd(), "backend")
    print("[BACKEND] Installing dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], cwd=backend_dir)
    
    # Initialize DB
    print("[BACKEND] Initializing database tables...")
    subprocess.run([sys.executable, "-u", "app/db/init_db.py"], cwd=backend_dir, env={**os.environ, "PYTHONPATH": ".", "PYTHONUNBUFFERED": "1"})
    
    # Run FastAPI on 8001
    run_command(f"{sys.executable} -u -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload", backend_dir, "BACKEND")

def start_frontend():
    # Install npm packages
    subprocess.run("npm install", shell=True)
    
    # Run Next.js
    run_command("npm run dev", os.getcwd(), "FRONTEND")

if __name__ == "__main__":
    print("[START] NewsCraft AI Automation Script")
    print("---------------------------------")
    
    # 1. Clean up any existing orphaned ports before starting
    print("[START] Scanning for orphaned processes on ports 3000 and 8001...")
    kill_ports([3000, 8001])
    
    # Start Backend Thread
    backend_thread = threading.Thread(target=start_backend)
    backend_thread.daemon = True
    backend_thread.start()
    
    # Small delay to let backend start first
    time.sleep(3)
    
    # Start Frontend Thread
    frontend_thread = threading.Thread(target=start_frontend)
    frontend_thread.daemon = True
    frontend_thread.start()
    
    print("\n[SUCCESS] Both servers are initializing...")
    print("   - Backend: http://localhost:8001")
    print("   - Frontend: http://localhost:3000")
    print("\nPress Ctrl+C to stop both servers safely.")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[SHUTDOWN] Intercepted exit signal. Shutting down NewsCraft AI...")
        # 2. Automatically clean up ports when exiting
        kill_ports([3000, 8001])
        print("[SHUTDOWN] Servers successfully terminated. Goodbye!")
        sys.exit(0)
