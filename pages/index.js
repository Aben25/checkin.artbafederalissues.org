import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  Configure,
  RefinementList,
  InfiniteHits,
} from "react-instantsearch-dom";
import "instantsearch.css/themes/reset.css";
import "tailwindcss/tailwind.css";
import CustomSearchBox from "../components/SearchBox";
import CustomHits from "../components/Hits";

const searchClient = algoliasearch(
  "SWSFY6ZO07",
  "286c1017af1002e899ded37866d02198"
);

export default function Home() {
  const router = useRouter();

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
        <title>Registration Check-In</title>
        <link rel="shortcut icon" href="/favicon.ico" />
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
                  <div >
                    <InfiniteHits
                      hitComponent={CustomHits}
                      translations={{
                        loadMore: "Load more",
                      }}
                    />
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
