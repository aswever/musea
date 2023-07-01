import { json } from "@sveltejs/kit";
import { Layout } from "./layout";
import dayjs from "dayjs";
import { MuseumGenerator } from "./museum";

export async function GET({ platform }) {
  const date = dayjs().format("YYYY-MM-DD-HH");
  const imageBucket = platform?.env?.IMAGES;
  const mapsKv = platform?.env?.MAPS;
  const mapKey = `maps/${date}`;

  if (!imageBucket) throw new Error("Missing image bucket.");
  if (!mapsKv) throw new Error("Missing maps KV.");

  const mapRecord = await mapsKv.get(mapKey);
  if (mapRecord) return json(JSON.parse(mapRecord));

  mapsKv.put(
    mapKey,
    JSON.stringify({
      status: "initialized",
    })
  );

  try {
    const { theme, prompt, palette } = await new MuseumGenerator().generateMuseum();
    const layout = Layout.generateLayout(5, 5);
    await layout.generatePaintings(imageBucket, date, prompt);

    const museum = { theme, prompt, palette, map: layout.listSquares() };

    mapsKv.put(
      mapKey,
      JSON.stringify({
        status: "complete",
        ...museum,
      })
    );

    return json(museum);
  } catch (e) {
    mapsKv.put(
      mapKey,
      JSON.stringify({
        status: "error",
        error: e instanceof Error ? e.message : e,
      })
    );
    throw e;
  }
}
