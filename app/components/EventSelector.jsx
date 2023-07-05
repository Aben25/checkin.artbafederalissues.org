import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function EventSelector({ events, selectedEvent, handleEventChange }) {
  return (
    <Listbox value={selectedEvent} onChange={handleEventChange}>
      <div className="relative mt-1">
        <Listbox.Button
          className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        >
          <span className="block truncate text-black">
            {selectedEvent ? selectedEvent.Name : "Please select an event"}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {events.length > 0 ? (
            events.map((item, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  classNames(
                    active ? 'text-white bg-indigo-600' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                  )
                }
                value={item}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={classNames(
                        selected ? 'font-semibold' : 'font-normal',
                        'block',
                      )}
                    >
                      {item.Name}
                    </span>

                    {selected ? (
                      <span
                        className={classNames(
                          active ? 'text-white' : 'text-indigo-600',
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))
          ) : (
            <Listbox.Option disabled className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9">
              No Events Available
            </Listbox.Option>
          )}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
