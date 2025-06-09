interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

import PayPalButton from './PayPalButton';

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
      <div className="mt-8 flex justify-center">
        <PayPalButton
          amount={price.replace(/[^\d.]/g, '')}
          onSuccess={() => alert('Payment successful!')}
          onError={() => alert('Payment failed. Please try again.')}
          className="w-full max-w-xs" // Ensure consistent width
        />
      </div>
    </div>
  );
}