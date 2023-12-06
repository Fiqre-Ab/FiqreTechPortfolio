
import 'bootstrap/dist/css/bootstrap.min.css';


const About = () => {
  return (
    <div className="container py-5 text-white">
      <div className="row justify-content-center text-center text-md-left">
        {/* Title always at the top with increased size and adjusted margins */}
        <div className="col-12 mb-5">
          <h1 className="display-4" style={{ color: '#da4ea2', fontWeight: 'bold' }}>About Me</h1>
        </div>

        {/* On small screens, image will appear below title. On md screens and up, it will be to the right */}
        <div className="col-12 col-md-6 order-md-2 mb-3 mb-md-0">
          <img
            src="../img/About.png"
            alt="Profile"
            className="img-fluid rounded-circle mx-auto animate-image" // Added 'animate-image' class for animation
            style={{ maxWidth: '250px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          />
        </div>

        {/* On small screens, text will appear below image. On md screens and up, it will be to the left */}
        <div className="col-12 col-md-6 order-md-1">
          <h2 className="text-info" style={{ fontWeight: 'bold' }}>Full-Stack Developer & Design Specialist</h2>
          <p className="lead" style={{ maxWidth: '400px', margin: '0 auto' }}>
            I specialize in creating sophisticated web designs, with a focus on WordPress, eCommerce solutions, and SEO optimization. Let me help you elevate your business to new heights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
