
import { Dialog, Transition, Listbox } from "@headlessui/react";


function EventSelector({ events, selectedEvent, onEventChange }) {
    return (
      <Listbox value={selectedEvent} onChange={onEventChange}>
        <Listbox.Button>{selectedEvent?.Name}</Listbox.Button>
        <Listbox.Options>
          {events.map((item, index) => (
            <Listbox.Option key={index} value={item}>
              {item.Name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    );
  }