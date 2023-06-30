import { json } from "@sveltejs/kit";
import { Layout } from "./layout";
import dayjs from "dayjs";

export async function GET({ platform }) {
  const date = dayjs().format("YYYY-MM-DD-HH");
  const mapsKv = platform?.env?.MAPS;
  const mapKey = `maps/${date}`;

  if (!mapsKv) throw new Error("Missing maps KV.");

  const mapRecord = await mapsKv.get(mapKey);
  if (mapRecord) return json(JSON.parse(mapRecord));

  mapsKv.put(
    mapKey,
    JSON.stringify({
      status: "initialized",
    })
  );

  const layout = await Layout.generateLayout(5, 5);

  // save to KV
  mapsKv.put(
    mapKey,
    JSON.stringify({
      status: "complete",
      map: layout.listSquares(),
    })
  );

  return json(layout.listSquares());
}
