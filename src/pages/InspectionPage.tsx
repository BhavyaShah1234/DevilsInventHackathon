import Navbar from '@/components/Navbar';
import React, { useState } from 'react';

const InspectionPage: React.FC = () => {
  const allReports = [
    {
      title: 'Boeing 747-400 Engine #2 Inspection', date: '4/2/2025', status: 'Completed', inspector: 'Jane Smith', coverage: '97%', findings: 2,
    },
    {
      title: 'Airbus A320neo Wing Composite Inspection', date: '4/1/2025', status: 'In Progress', inspector: 'John Doe', coverage: '45%', findings: 0,
    },
    {
      title: 'Cessna 172 Annual Fuselage Inspection', date: '3/31/2025', status: 'Scheduled', inspector: 'Emily Jones', coverage: '-', findings: '-',
    },
    {
      title: 'Boeing 737 MAX Pre-flight Safety Check', date: '3/30/2025', status: 'Completed', inspector: 'Sam Wilson', coverage: '100%', findings: 0,
    },
    {
      title: 'Embraer E190 Landing Gear Maintenance', date: '3/29/2025', status: 'Completed', inspector: 'Alex Johnson', coverage: '95%', findings: 1,
    },
    {
      title: 'Airbus A380 Engine Borescope Inspection', date: '3/28/2025', status: 'Cancelled', inspector: 'Chris Brown', coverage: '-', findings: '-',
    },
    {
      title: 'Bombardier CRJ900 Fuselage Corrosion Check', date: '3/27/2025', status: 'Completed', inspector: 'Jane Smith', coverage: '98%', findings: 0,
    },
    {
      title: 'Gulfstream G650 Windshield Integrity Check', date: '3/26/2025', status: 'In Progress', inspector: 'Brian Murphy', coverage: '75%', findings: 1,
    },
    {
      title: 'Cessna 208 Caravan Oil System Inspection', date: '3/25/2025', status: 'Completed', inspector: 'Nina Patel', coverage: '93%', findings: 0,
    },
    {
      title: 'Learjet 75 Avionics Review', date: '3/24/2025', status: 'Scheduled', inspector: 'David Lee', coverage: '-', findings: '-',
    },
    {
      title: 'Boeing 767 Hydraulic System Analysis', date: '3/23/2025', status: 'Completed', inspector: 'Ella Wright', coverage: '88%', findings: 2,
    },
    {
      title: 'Pilatus PC-12 Electrical System Audit', date: '3/22/2025', status: 'In Progress', inspector: 'Tom Hardy', coverage: '60%', findings: 1,
    },
    {
      title: 'Dassault Falcon 8X Engine Calibration', date: '3/21/2025', status: 'Completed', inspector: 'Rachel Kim', coverage: '99%', findings: 0,
    },
    {
      title: 'Beechcraft King Air Propeller Check', date: '3/20/2025', status: 'Cancelled', inspector: 'Liam Chen', coverage: '-', findings: '-',
    },
    {
      title: 'Antonov An-148 Flight Readiness Review', date: '3/19/2025', status: 'Scheduled', inspector: 'Olivia Stone', coverage: '-', findings: '-',
    },
    {
      title: 'McDonnell Douglas DC-10 Inspection', date: '3/18/2025', status: 'Completed', inspector: 'Noah Kim', coverage: '85%', findings: 3,
    }
  ];

  const [statusFilter, setStatusFilter] = useState('All');

  const reports = statusFilter === 'All'
    ? allReports
    : allReports.filter(report => report.status === statusFilter);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-100 via-gray-200 to-white text-black dark:from-gray-900 dark:via-slate-900 dark:to-gray-950 dark:text-white transition-colors">
      <Navbar />

      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
       

        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm rounded px-3 py-2 text-black dark:text-white shadow"
          >
            <option value="All">Sort by Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </header>

      <div className="bg-white dark:bg-black/30 backdrop-blur-lg rounded-lg border border-gray-300 dark:border-gray-800 p-6">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 dark:text-gray-400 border-b border-gray-300 dark:border-gray-700">
              <th className="py-2">Report Title</th>
              <th className="py-2">Date</th>
              <th className="py-2">Status</th>
              <th className="py-2">Inspector</th>
              <th className="py-2">Coverage</th>
              <th className="py-2">Findings</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr
                key={index}
                className="border-b border-gray-300 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-colors"
              >
                <td className="py-2 text-blue-600 dark:text-blue-300">{report.title}</td>
                <td className="py-2">{report.date}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'Completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                        : report.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100'
                        : report.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-100'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100'
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="py-2">{report.inspector}</td>
                <td className="py-2">{report.coverage}</td>
                <td className="py-2">{report.findings}</td>
                <td className="py-2">
                  <button className="text-blue-600 hover:underline dark:text-blue-400">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InspectionPage;
