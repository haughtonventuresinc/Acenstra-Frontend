import { TestimonialCard } from '../components/TestimonialCard';
import { testimonials } from '../utils/testimonials';
import './Testimonials.css'; // Import the new CSS file

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            WHAT OUR CLIENTS SAY
          </h2>
          <p className="text-xl text-gray-600">
            Real stories from people who transformed their financial future
          </p>
        </div>

        {/* Infinite Scroll Container */}
        <div className="testimonial-carousel-container">
          <div 
            className="testimonial-scroll-content" 
            style={{ '--scroll-width': `${testimonials.length * (384 + 32)}px` } as React.CSSProperties}
          >
          {/* Render testimonials twice for seamless loop */}
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <TestimonialCard key={`${testimonial.name}-${index}`} {...testimonial} />
          ))}
        </div>
      </div> {/* Closes testimonial-carousel-container */}
      </div> {/* Closes container mx-auto px-4 */}
    </section>
  );
}