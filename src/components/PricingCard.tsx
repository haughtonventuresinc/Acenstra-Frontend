interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export function PricingCard({
  title,
  price,
  description,
  features,
  popular = false,
}: PricingCardProps) {
  return (
    <div className="pricing-card">
      {popular && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <div className="mt-4">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
      </div>
      <p className="mt-4 text-gray-600">{description}</p>
      <ul className="mt-8 space-y-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
        GET STARTED
      </button>
    </div>
  );
}