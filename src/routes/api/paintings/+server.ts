import { json } from "@sveltejs/kit";
import dayjs from "dayjs";
import { getImages } from "./getImages.js";
import { v4 } from "uuid";

export async function POST({ platform }) {
  const date = dayjs().format("MM-DD-HH");
  const imageBucket = platform?.env?.IMAGES;

  try {
    if (!imageBucket) throw new Error("Missing image bucket.");

    const paintings = await imageBucket.list({ prefix: `paintings/${date}` });
    if (paintings.objects.length) {
      throw new Error("Paintings already exist for this hour.");
    }

    await imageBucket.put(`paintings/${date}`, "");

    const images = await getImages(1);

    await Promise.all(
      images.map((image) => imageBucket.put(`paintings/${date}/${v4()}.png`, image))
    );
  } catch (e) {
    console.error(e);
    imageBucket?.delete(`paintings/${date}`);
    return json({ success: false });
  }

  return json({ success: true });
}
