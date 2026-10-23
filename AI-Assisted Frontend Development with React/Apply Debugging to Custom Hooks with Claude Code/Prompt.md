# Custom Hooks and Vitest Prompts

## Prompt 1: Extract Custom Hooks

```text
Extract two custom hooks into a new src/hooks folder. First, move the timer logic from src/components/DepartureCountdown.jsx into useCountdown(targetDate) in src/hooks/useCountdown.js. It should return the milliseconds left, and DepartureCountdown should use it. Second, create useLocalStorage(key, initialValue) in src/hooks/useLocalStorage.js that works like useState but saves the value to localStorage. Use it for selectedDay in src/App.jsx with the key 'tripcraft:selectedDay'. Follow CLAUDE.md.
```

## Prompt 2: Set Up Vitest and Test useCountdown

```text
Set up Vitest with React Testing Library. Install vitest, jsdom, @testing-library/react, and @testing-library/dom as dev dependencies, add test: { environment: 'jsdom' } to vite.config.js, and add a "test": "vitest" script to package.json. Then write src/hooks/useCountdown.test.js using renderHook and fake timers that checks two things: after 3 seconds, the hook reports 3000 ms less than at the start; and after unmounting, no timers are still running (vi.getTimerCount() is 0). Do not change useCountdown.js.
```