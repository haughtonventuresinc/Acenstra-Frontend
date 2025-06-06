export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-6">
              Acenstra
            </h3>
            <p className="text-sm leading-relaxed">
              Transforming financial futures through expert credit repair and innovative
              business funding solutions.
            </p>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">QUICK LINKS</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  HOME
                </a>
              </li>
              <li>
                <a href="#credit-repair" className="hover:text-blue-400 transition-colors">
                  CREDIT REPAIR
                </a>
              </li>
              <li>
                <a href="#business-funding" className="hover:text-blue-400 transition-colors">
                  BUSINESS FUNDING
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-blue-400 transition-colors">
                  TESTIMONIALS
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">CONTACT</h4>
            <ul className="space-y-3">
              <li>Phone: (555) 123-4567</li>
              <li>Email: info@acenstra.com</li>
              <li>Hours: Mon-Fri 9am-6pm EST</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">LEGAL</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  PRIVACY POLICY
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  TERMS OF SERVICE
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  DISCLAIMERS
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} Acenstra. All rights reserved. This is a
            marketing website. Results may vary.
          </p>
        </div>
      </div>
    </footer>
  );
}