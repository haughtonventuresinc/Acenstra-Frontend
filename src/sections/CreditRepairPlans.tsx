import { PricingCard } from '../components/PricingCard';

export function CreditRepairPlans() {
  return (
    <section id="credit-repair" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            CHOOSE YOUR CREDIT REPAIR PLAN
          </h2>
          <p className="text-xl text-gray-600">
            Select the plan that best fits your needs and budget
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard
            title="DIY CREDIT REPAIR"
            price="$99/month"
            description="Take control of your credit with guided support and professional tools"
            features={[
              'Credit monitoring dashboard',
              'Dispute letter templates',
              'Score tracking tools',
              'Educational resources',
              'Email support',
            ]}
          />
          <PricingCard
            title="CLEAN SLATE FULL-SERVICE"
            price="$599"
            description="Let our experts handle everything for you"
            features={[
              'Professional credit analysis',
              'Unlimited dispute filing',
              'Dedicated repair specialist',
              'Priority support',
              'Identity theft protection',
            ]}
            popular
          />
        </div>
      </div>
    </section>
  );
}