import axios from "axios";
import * as cheerio from 'cheerio';
import {NextApiRequest, NextApiResponse} from "next";

import {HttpBadRequestError} from "../../errors/http-errors";

interface Metadata {
  title: string;
  description: string;
  ogImage?: string;
  ogVideo?: string;
}

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  const {url} = req.query;

  if (!url || typeof url !== "string")
    throw new HttpBadRequestError("url is not a string");


  const html = await axios.get(url, {timeout: 2000}).then(({data}) => data).catch(() => undefined)

  if (!html)
    throw new HttpBadRequestError("invalid url or empty data")

  const loadHtml = cheerio.load(html)

  const metadata: Metadata = {
    title: "",
    description: "",
  };

  loadHtml("meta").map((_, element) => {
    const name =
      loadHtml(element).attr("name") || loadHtml(element).attr("property");
    const content = loadHtml(element).attr("content");

    if (name && content) {
      if (name === "description") {
        metadata.description = content;
      } else if (name === "og:image") {
        metadata.ogImage = content;
      } else if (name === "og:video") {
        metadata.ogVideo = content;
      }
    }
  });

  return metadata;
}
