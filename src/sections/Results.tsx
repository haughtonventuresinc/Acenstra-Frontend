import { ResultCard } from '../components/ResultCard';
import { results } from '../utils/results';

export function Results() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            REAL RESULTS FOR REAL PEOPLE
          </h2>
          <p className="text-xl text-gray-600">
            See what we've achieved for our clients
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {results.map((result) => (
            <ResultCard key={result.title} {...result} />
          ))}
        </div>
      </div>
    </section>
  );
}