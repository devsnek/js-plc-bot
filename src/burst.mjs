export async function burst(f) {
  try {
    const { result } = await pylon.requestCpuBurst(f, 1000);
    return result;
  } catch (e) {
    if (e instanceof pylon.CpuBurstRequestError) {
      return f();
    }
    throw e;
  }
}
