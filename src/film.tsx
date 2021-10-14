import { ActionPanel, CopyToClipboardAction, Detail, OpenInBrowserAction } from '@raycast/api';
import { useEffect, useState } from 'react';
import { loadfilmDetails, Film } from './letterboxd/film';
import { isNil, notNil } from './utils/nil';

type Props = {
  url: string;
};

const filmToMarkdown = (film: Film) => {
  return [
    `## ${film.title}`,
    notNil(film.year) && notNil(film.director) ? `**${film.year}** directed by **${film.director}**` : undefined,
    notNil(film.year) && isNil(film.director) ? `**${film.year}**` : undefined,
    notNil(film.runtime) ? `${film.runtime} minutes` : undefined,
    `${film.description}`,
    notNil(film.image) ? `![${film.title}](${film.image.src})` : undefined,
  ]
    .filter(notNil)
    .join('\n\n');
};

export function FilmDetail(props: Props) {
  const [state, setState] = useState<{ film: Film | undefined; loading: boolean }>({ film: undefined, loading: false });

  useEffect(() => {
    async function fetch() {
      setState((oldState) => ({ ...oldState, loading: true }));
      const film = await loadfilmDetails(props.url);
      setState(() => ({ film, loading: false }));
    }
    fetch();
  }, [props.url]);

  return (
    <Detail
      markdown={state.film !== undefined ? filmToMarkdown(state.film) : null}
      isLoading={state.loading}
      actions={
        <ActionPanel>
          <OpenInBrowserAction url={props.url} />
          <CopyToClipboardAction title="Copy Letterboxd URL" content={props.url} />
        </ActionPanel>
      }
    />
  );
}
