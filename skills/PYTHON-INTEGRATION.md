# Running Python Scripts

This template includes a built-in mechanism to easily execute Python scripts from the Node/Bun backend and trigger them from the Angular frontend. This is particularly useful when you need to leverage Python's rich ecosystem (like data science, machine learning, or specific utility libraries) without the friction of maintaining a completely separate Python microservice.

## How it Works

The integration uses Node's built-in `child_process.execFile` to safely spawn a Python process and capture its standard output (`stdout`) and standard error (`stderr`).

1. **Frontend Call**: The Angular frontend makes an HTTP POST request to the backend with optional arguments.
2. **Backend Execution**: The backend receives the request and executes the target Python script, passing the arguments via the command line.
3. **Python Script**: The Python script reads the arguments using `sys.argv`, performs its logic, and prints the result to standard output.
4. **Response**: The backend captures the printed output and sends it back to the frontend as a JSON response.

## File Structure

- **Backend Route**: `backend/src/routes/api.ts` (e.g., `POST /python-test`)
- **Python Scripts**: `backend/src/scripts/*.py`
- **Frontend Integration**: `frontend/src/app/features/starter/starter.ts`

## Example Usage

### Python Script (`backend/src/scripts/test.py`)

```python
import sys

def main():
    args = sys.argv[1:]
    print(f"Hello from Python! Arguments: {', '.join(args)}")

if __name__ == "__main__":
    main()
```

### Backend Route (`backend/src/routes/api.ts`)

```typescript
import { execFile } from 'child_process';
import * as path from 'path';

router.post('/python-test', (req, res) => {
  const { args } = req.body;
  const scriptPath = path.resolve(__dirname, '../scripts/test.py');
  
  execFile('python3', [scriptPath, ...(args || [])], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ success: false, error: stderr || error.message });
    }
    res.json({ success: true, data: { output: stdout.trim() } });
  });
});
```

## Considerations & Best Practices

- **Security**: Always use `execFile` or `spawn` instead of `exec` to prevent shell injection vulnerabilities when passing user-provided arguments.
- **Performance**: Spawning a new Python process for every request adds overhead. For high-throughput scenarios, consider a persistent Python service (like FastAPI or Flask).
- **Dependencies**: If your Python scripts require external dependencies, ensure you have a `requirements.txt` and a standard way to install them (e.g., a virtual environment) documented for your team.
- **Data Transfer**: For complex data, pass a JSON string as a single argument and parse it in Python using `json.loads(sys.argv[1])`. Return complex results by printing a JSON string and parsing it in the backend with `JSON.parse(stdout)`.
