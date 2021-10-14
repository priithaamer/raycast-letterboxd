import { ActionPanel, CopyToClipboardAction, List, OpenInBrowserAction, PushAction } from '@raycast/api';
import { useState, useEffect } from 'react';
import { search, SearchResult } from './letterboxd/search';
import { FilmDetail } from './ui/film_detail';
import { isNil } from './utils/nil';

export default function SearchList() {
  const [state, setState] = useState<{ searchResult: SearchResult[]; loading: boolean }>({
    searchResult: [],
    loading: false,
  });
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      if (isNil(searchQuery)) {
        return;
      }
      setState((oldState) => ({ ...oldState, loading: true }));
      const searchResult = await search(searchQuery);
      setState((oldState) => ({
        ...oldState,
        searchResult: searchResult,
        loading: false,
      }));
    }
    fetch();
  }, [searchQuery]);

  return (
    <List
      isLoading={state.loading}
      searchBarPlaceholder="Search Letterboxd..."
      onSearchTextChange={(text) => setSearchQuery(text)}
      throttle={true}
    >
      {state.searchResult.map((result, index) => (
        <List.Item
          key={index}
          title={result.title}
          subtitle={result.year}
          accessoryTitle={result.director}
          icon="video-16"
          actions={
            <ActionPanel>
              <PushAction title="Show Film Details" target={<FilmDetail url={result.url} />} />
              <OpenInBrowserAction url={result.url} />
              <CopyToClipboardAction title="Copy Letterboxd URL" content={result.url} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
