interface TestimonialCardProps {
  name: string;
  image: string;
  text: string;
  rating: number;
}

export function TestimonialCard({ name, image, text, rating }: TestimonialCardProps) {
  return (
    <div className="testimonial-card">
      <div className="flex items-center mb-4">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-4">
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <div className="flex text-yellow-400">
            {Array.from({ length: rating }).map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}