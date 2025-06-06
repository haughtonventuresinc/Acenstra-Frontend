import { FAQItem } from '../components/FAQItem';
import { faqs } from '../utils/faqs';

export function FAQs() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-xl text-gray-600">
            Get answers to common questions about our services
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}