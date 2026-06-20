import json

with open(r"c:\Users\MOHIT\.gemini\antigravity\brain\5d3f5ef3-a428-4cd9-9801-95da5ff0ab26\.system_generated\logs\transcript.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        data = json.loads(line)
        if data.get("type") == "TOOL_RESPONSE" and "def _async_process_clipping_task" in str(data):
            content = data.get("content", "")
            
            # The content will have "Created At: ... \nOutput:\n" at the top
            if "Output:\n" in content:
                content = content.split("Output:\n", 1)[1]
            
            with open("generate_recovered.py", "w", encoding="utf-8") as out:
                out.write(content)
            print("Recovered!")
            break
