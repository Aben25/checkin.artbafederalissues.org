import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  Configure,
  RefinementList,
  InfiniteHits,
  connectStateResults,
} from "react-instantsearch-dom";
import "instantsearch.css/themes/reset.css";
import "tailwindcss/tailwind.css";
import CustomSearchBox from "../components/SearchBox";
import CustomHits from "../components/Hits";
import { RefreshContext } from "../contexts/RefreshContext";
import { useContext } from "react";


const Results = connectStateResults(
  ({ searchState, searchResults, children }) => {
    if (searchResults && searchResults.nbHits === 0) {
      return <div>No results found for "{searchState.query}"</div>;
    } else {
      return children;
    }
  }
);

export default function Home() {
  const { font ,setFontFace ,searchClient} = useContext(RefreshContext);

  const refinementListClasses = {
    root: "my-4",
    list: "list-none",
    item: "mb-2",
    label: "font-medium",
    checkbox: "form-tick appearance-none",
    active: "font-bold text-blue-600",
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 mb-0">
      <Head>
        <title>Registration Check-In 2023</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.0/css/all.min.css"
        />
      </Head>

      <main>
        <div className="max-w-7xl mx-auto">
          <div class="grid grid-flow-row-dense grid-cols-3 grid-rows-1 ...">
            <div>
              <img src="/logo.png" alt="FIP Logo" width={200} />
            </div>
            <div class="col-span-2">
              <h1 className="text-4xl font-extrabold text-gray-900">
                Registration Check-In
              </h1>
            </div>
          </div>

          <div className="mt-12">
            <InstantSearch searchClient={searchClient} indexName="FIP2023">
              <CustomSearchBox />
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="hidden sm:hidden md:block lg:col-span-0">
                  <h2 className="font-bold text-xl mb-4">Company</h2>
                  <RefinementList
                    attribute="CompanyName"
                    cssClasses={refinementListClasses}
                  />
                </div>
                <div className="">
                  <div>
                    <Results>
                      <InfiniteHits
                        hitComponent={CustomHits}
                        translations={{
                          loadMore: "Load more",
                        }}
                      />
                    </Results>
                  </div>
                </div>
              </div>

              <div className="mt-8">{/* pagination  load more button*/}</div>

              <Configure
                hitsPerPage={10}
                attributesToSnippet={["CompanyName:10"]}
                snippetEllipsisText={"..."}
              />
            </InstantSearch>
          </div>
        </div>
      </main>
    </div>
  );
}
