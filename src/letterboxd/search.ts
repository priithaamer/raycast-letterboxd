import fetch from "node-fetch";
import { isNil, notNil } from "../utils/nil";
import parse from "node-html-parser";

export type SearchResult = {
  title: string;
  url: string;
  year: string;
  director: string;
};

const BaseUrl = "https://letterboxd.com";

export const search = async (query: string): Promise<SearchResult[]> => {
  if (query === "") {
    return [];
  }

  const response = await fetch(`https://letterboxd.com/search/films/${query}/`);
  const html = await response.text();
  return parseSearchPageHTML(html);
};

export const parseSearchPageHTML = (html: string): SearchResult[] => {
  const doc = parse(html);

  const result = doc
    .querySelectorAll("ul.results li")
    .map((li) => {
      const [titleA, yearA] = li.querySelectorAll(".headline-2 a");
      const title = titleA?.textContent;
      const year = yearA?.textContent;

      const url = titleA.getAttribute("href");
      const director = li.querySelector(".film-metadata a")?.textContent ?? "";

      if (isNil(title) || isNil(url) || isNil(year)) {
        return null;
      }
      return { title, url: [BaseUrl, url].join(""), year, director };
    })
    .filter(notNil);

  return result;
};
