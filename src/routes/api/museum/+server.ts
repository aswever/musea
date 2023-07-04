import { json } from "@sveltejs/kit";
import dayjs from "dayjs";
import { MuseumGenerator } from "$lib/server/museum/generator";

export async function GET({ platform }) {
  const date = dayjs().format("YYYY-MM-DD-HH");
  const imageBucket = platform?.env?.IMAGES;
  const mapsKv = platform?.env?.MAPS;
  console.log(platform, platform?.env);

  if (!imageBucket) throw new Error("Missing image bucket.");
  if (!mapsKv) throw new Error("Missing maps KV.");

  const maker = new MuseumGenerator(imageBucket, mapsKv, date);
  const museum = await maker.generateMuseum();

  return json(museum);
}
