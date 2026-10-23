# Claude API Proxy Test Commands

## Normal Stream

```bash
curl -N http://localhost:5173/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"What is on Day 2?"}]}'
```

## Malformed Stream

```bash
curl -N http://localhost:5173/api/chat -H "Content-Type: application/json" -H "x-mock-scenario: malformed" -d '{"messages":[{"role":"user","content":"What is on Day 2?"}]}'
```

## Claude Provider Without a Key

```bash
curl -i http://localhost:5173/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"What is on Day 2?"}]}'
```

## Rate Limit Test

```bash
for i in $(seq 1 11); do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"Hi"}]}'; done
```