export default async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
