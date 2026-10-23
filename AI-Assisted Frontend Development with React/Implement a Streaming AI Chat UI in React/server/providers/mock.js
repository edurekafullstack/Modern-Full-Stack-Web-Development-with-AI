import {
  normalEvents,
  malformedEvents,
  markdownEvents,
} from "../recordings/tripAssistant.js";

const encoder = new TextEncoder();

export function streamFromMock(scenario) {
  const events =
    scenario === "malformed"
      ? malformedEvents
      : scenario === "markdown"
        ? markdownEvents
        : normalEvents;

  return new ReadableStream({
    async start(controller) {
      for (const { event, data } of events) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const payload = typeof data === "string" ? data : JSON.stringify(data);
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${payload}\n\n`),
        );
      }
      controller.close();
    },
  });
}
