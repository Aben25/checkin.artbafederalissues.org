import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Pagination,
  Configure,
  RefinementList,
} from 'react-instantsearch-dom';
import 'instantsearch.css/themes/reset.css';
import 'instantsearch.css/themes/algolia.css';
import 'tailwindcss/tailwind.css';
import CustomSearchBox from '../components/SearchBox';
import CustomHits from '../components/Hits';
const searchClient = algoliasearch(
  'SWSFY6ZO07',
  '286c1017af1002e899ded37866d02198'
);

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Attendance Check-in</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="max-w-7xl mx-auto">
          <div className="">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Attendance Check-in
            </h1>
          </div>
          <div className="mt-12">
            <InstantSearch searchClient={searchClient} indexName="FIP2023">
              <CustomSearchBox />


              <div className="grid lg:grid-cols-3 gap-4">
                <div>
                  <h2 className="font-bold text-xl mb-4">Company</h2>
                  <RefinementList attribute="CompanyName" />
                </div>
                <div className="lg:col-span-2">
                  {/* full width hits*/}
                  <div className="flex flex-wrap">
                    <CustomHits />
                  </div>
                </div>
              </div>


              <div className="mt-8">
                <Pagination />
              </div>
              <Configure hitsPerPage={20}

              />
            </InstantSearch>
          </div>
        </div>
      </main>
    </div>
  );
}



