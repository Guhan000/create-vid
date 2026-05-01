import { inngest } from "./client";

/**
 * Placeholder for wiring Inngest; replace or extend with real video-generation
 * steps when you are ready.
 */
export default inngest.createFunction(
  {
    id: "hello-world",
    name: "Hello World",
    triggers: [{ event: "app/hello.world" }],
  },
  async ({ step }) => {
    const message = await step.run("say-hello", () => "Hello, world!");
    return { message };
  },
);
