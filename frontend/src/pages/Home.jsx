import { Link } from "react-router-dom";

// Import local images
import grilledChicken from "../assets/grilled-chicken.jpg";
import veggiePizza from "../assets/veggie-pizza.jpg";
import pastaCarbonara from "../assets/pasta-carbonara.jpg";
import chefImg from "../assets/chef.jpg";
import customer1 from "../assets/customer1.jpg";
import customer2 from "../assets/customer2.jpg";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-32 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to MyRestaurant
        </h1>
        <p className="mb-6 text-lg md:text-xl">
          Delicious meals delivered fresh to your door
        </p>
        <Link
          to="/menu"
          className="bg-white text-green-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          View Menu
        </Link>
      </section>

      {/* Featured Menu */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <img
              src={grilledChicken}
              alt="Grilled Chicken"
              className="mx-auto rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Grilled Chicken</h3>
            <p className="text-green-600 font-bold">$12</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <img
              src={veggiePizza}
              alt="Veggie Pizza"
              className="mx-auto rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Veggie Pizza</h3>
            <p className="text-green-600 font-bold">$10</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <img
              src={pastaCarbonara}
              alt="Pasta Carbonara"
              className="mx-auto rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Pasta Carbonara</h3>
            <p className="text-green-600 font-bold">$11</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto py-16 px-4 flex flex-col md:flex-row items-center gap-8">
        <img
          src={chefImg}
          alt="Our Chef"
          className="w-full md:w-1/2 rounded-xl shadow-lg"
        />
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-gray-700 mb-4">
            At MyRestaurant, we serve the freshest and most delicious meals made
            from the finest ingredients. Our chefs bring creativity and passion
            to every dish.
          </p>
          <p className="text-gray-700">
            Join thousands of happy customers and experience the taste of
            quality food delivered right to your door.
          </p>
        </div>
      </section>

      {/* Customer Feedback Section */}
      <section className="bg-white py-16 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Customer Feedback
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-6 rounded-xl shadow-md flex gap-4">
            <img
              src={customer1}
              alt="Customer 1"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">Jane Doe</p>
              <p className="text-gray-600">
                "Absolutely love the food and quick delivery! Highly recommend."
              </p>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl shadow-md flex gap-4">
            <img
              src={customer2}
              alt="Customer 2"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">John Smith</p>
              <p className="text-gray-600">
                "Fresh meals every time. Great variety and excellent customer
                service."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>
        <form className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border p-3 rounded-lg"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border p-3 rounded-lg"
          />
          <textarea
            placeholder="Your Message"
            className="border p-3 rounded-lg"
            rows={5}
          ></textarea>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Send Message
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-green-600 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p>© {new Date().getFullYear()} MyRestaurant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
