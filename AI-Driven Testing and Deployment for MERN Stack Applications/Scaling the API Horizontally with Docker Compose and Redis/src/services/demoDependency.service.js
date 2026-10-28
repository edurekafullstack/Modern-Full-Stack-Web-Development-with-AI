const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let writeCount = 0;
let readAttempts = 0;

export async function fetchInventory(mode = "normal", signal) {
  readAttempts += 1;

  if (mode === "slow") {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, 2000);

      signal?.addEventListener(
        "abort",
        () => {
          clearTimeout(timer);
          reject(signal.reason);
        },
        { once: true }
      );
    });
  }

  if (mode === "unavailable") {
    throw new Error("Inventory service unavailable");
  }

  if (mode === "temporary" && readAttempts < 3) {
    throw new Error("Temporary inventory failure");
  }

  return {
    service: "Inventory Service",
    items: 12,
    status: "available",
  };
}

export async function createRecord() {
  writeCount += 1;

  return {
    message: "Record created",
    totalWrites: writeCount,
  };
}

export function getWriteCount() {
  return writeCount;
}

export function resetDemo() {
  writeCount = 0;
  readAttempts = 0;
}

export function getReadAttempts() {
  return readAttempts;
}