import {
  FileText,
  MessageSquare,
  Building2,
  Users,
} from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <FileText size={32} />,
      title: 'CREDIT REPORT ANALYSIS',
      description:
        'Get a detailed analysis of your credit report with actionable insights',
    },
    {
      icon: <MessageSquare size={32} />,
      title: 'DISPUTE SERVICES',
      description:
        'Professional dispute filing and tracking for inaccurate items',
    },
    {
      icon: <Building2 size={32} />,
      title: 'BUSINESS CREDIT CONSULTING',
      description:
        'Learn how to build and maintain strong business credit',
    },
    {
      icon: <Users size={32} />,
      title: 'FUNDING STRATEGY SESSION',
      description:
        'Personalized consultation to determine the best funding options',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            EVERYTHING YOU NEED TO SUCCEED
          </h2>
          <p className="text-xl text-gray-600">
            Comprehensive solutions for your credit and funding needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}