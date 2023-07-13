import React from 'react'
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Metrix({ selectedEvent, attendees }) {


    // function to count the number of attendees who attendee in eeach ticket type

    const ticketTypeCount = (attendees) => {
        let ticketTypeCount = {}
        attendees.forEach(attendee => {
            if (ticketTypeCount[attendee.TicketName]) {
                ticketTypeCount[attendee.TicketName] += 1
            } else {
                ticketTypeCount[attendee.TicketName] = 1
            }
        })
        return ticketTypeCount
    }

    // count attendees who attended
    const attendedCount = (attendees) => {
        let attendedCount = 0
        attendees.forEach(attendee => {
            if (attendee.Attended) {
                attendedCount += 1
            }
        })
        return attendedCount
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        // three columns
        <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="col-span-1">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Ticket Type</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Ticket type breakdown</p>
                    </div>
                    <div className="border-t border-gray-200">
                        <div>
                            {Object.keys(ticketTypeCount(attendees)).map((key, index) => (
                                <div key={index} className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <div className="font-medium text-gray-500">
                                        {key}
                                    </div>
                                    <div className=" text-sm text-gray-900 sm:mt-0 sm:col-span-0">
                                        {ticketTypeCount(attendees)[key]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-span-1">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Attended</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Attended breakdown</p>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Attended
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {attendedCount(attendees)}
                                </dd>
                            </div>
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Did not attend
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {attendees.length - attendedCount(attendees)}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>

    )
}
