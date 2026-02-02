'use client';

import {
  CameraIcon,
  MapPinIcon,
  CpuChipIcon,
  BellAlertIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const steps = [
  {
    title: 'Citizen Reporting',
    description:
      'Users capture and upload real-time evidence of street flooding or drain blockages in Guwahati’s low-lying areas.',
    icon: CameraIcon,
  },
  {
    title: 'Geo-Spatial Anchoring',
    description:
      'Every report is automatically tagged with precise GPS coordinates to identify exactly where infrastructure is failing.',
    icon: MapPinIcon,
  },
  {
    title: 'Rule-Based Analysis',
    description:
      'The WASP engine correlates report density with rainfall data to identify near-real-time overflow risks.',
    icon: CpuChipIcon,
  },
  {
    title: 'Localized Alerting',
    description:
      'Validated alerts are dispatched to the community, highlighting flood zones and suggested alternative routes.',
    icon: BellAlertIcon,
  },
  {
    title: 'Municipal Intelligence',
    description:
      'Data is visualized on a authority dashboard to help municipal teams prioritize drain clearing and flood mitigation.',
    icon: ShieldCheckIcon,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-zinc-950 px-6 py-24">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            How <span className="text-teal-500 italic">WASP</span> Protects
          </h2>
          <p className="mt-4 text-gray-400">
            A near-real-time pipeline designed to bridge the gap between citizen 
            observation and predictive warning for urban flash flooding.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-[#0f172a] border border-slate-700 rounded-lg p-6 hover:border-teal-500/40 transition-all duration-300"
            >
              {/* Step number */}
              <span className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-teal-500 text-[#020817] flex items-center justify-center text-sm font-bold shadow-lg shadow-teal-500/20">
                {index + 1}
              </span>

              {/* Icon */}
              <step.icon className="h-10 w-10 text-teal-500 mb-4" />

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer note reflecting PDF Deliverables */}
        <p className="mt-16 text-center text-sm text-gray-500">
          Built for GUenARK SIH 1.0 to support SDG-13: Urban Resilience through 
          working prototypes of localized flood alert generators.
        </p>
      </div>
    </section>
  );
}