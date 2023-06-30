import { json } from "@sveltejs/kit";
import dayjs from "dayjs";
import { getImages } from "./getImages.js";
import { IMAGES_HOST } from "$env/static/private";

export async function POST({ request, platform }) {
  const { count } = await request.json();
  const date = dayjs().format("MM-DD-HH");
  const imageBucket = platform?.env?.IMAGES;

  try {
    if (!imageBucket) throw new Error("Missing image bucket.");

    const paintings = await imageBucket.list({ prefix: `paintings/${date}` });
    if (paintings.objects.length) {
      return json({
        success: true,
        images: paintings.objects
          .filter((object) => object.key.endsWith("png"))
          .map((object) => `${IMAGES_HOST}/${object.key}`),
      });
    }

    await imageBucket.put(`paintings/${date}`, "");

    const images = await getImages(count);

    await Promise.all(
      images.map(({ uuid, image }) => imageBucket.put(`paintings/${date}/${uuid}.png`, image))
    );

    return json({
      success: true,
      images: images.map(({ uuid }) => `${IMAGES_HOST}/paintings/${date}/${uuid}.png`),
    });
  } catch (e) {
    console.error(e);
    await imageBucket?.delete(`paintings/${date}`);

    const error = e instanceof Error ? e.message : e;
    return json({ success: false, error });
  }
}
