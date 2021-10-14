import fetch from 'node-fetch';
import parse from 'node-html-parser';
import { isNil } from '../utils/nil';

export type Film = {
  title: string;
  year: number;
  director: string | null;
  runtime: number | null;
  description: string;
  image?: { src: string };
};

export const loadfilmDetails = async (url: string): Promise<Film | undefined> => {
  const response = await fetch(url);
  const html = await response.text();
  return parseFilmPageHTML(html);
};

const parseFilmPageHTML = (html: string): Film | undefined => {
  const doc = parse(html);

  const title = doc.querySelector('.site-body .film-header-lockup h1')?.text;
  const year = doc.querySelector('.site-body .film-header-lockup .number a')?.text;
  const director = doc.querySelector('meta[name="twitter:data1"]')?.getAttribute('content') ?? null;
  const runtime = doc.querySelector('.text-footer')?.firstChild?.text ?? null;
  const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? '';
  const imageSrc = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? undefined;
  const image = imageSrc != undefined ? { src: imageSrc } : undefined;

  if (isNil(title) || isNil(year)) {
    return;
  }

  return {
    title,
    year: parseInt(year, 10),
    director,
    runtime: runtime !== null ? parseInt(runtime, 10) : null,
    description,
    image,
  };
};
