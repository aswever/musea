export async function getPainting(): Promise<string> {
  const response = await fetch("http://127.0.0.1:7860/sdapi/v1/txt2img", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt:
        "portrait of a galactic cat, cubist oil painting by edvard munch, zdislaw beksinski",
      sampler_index: "DPM++ SDE Karras",
      steps: 20,
      width: 512,
      height: 512,
      batch_size: 1,
    }),
  });

  const data = await response.json();

  return data.images[0];
}
