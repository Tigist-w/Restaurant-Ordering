import React from "react";
import restaurantImg from "../assets/restaurant.jpg";
import { Link } from "react-router-dom";

const About = () => (
  <div className="container mx-auto py-16 px-4">
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <img
        src={restaurantImg}
        alt="About"
        className="rounded shadow object-cover w-full h-80"
      />
      <div>
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          About Our Restaurant
        </h2>
        <p className="text-gray-700 mb-6">
          We deliver premium meals crafted with fresh ingredients...{" "}
        </p>
        <Link to="/menu" className="px-6 py-2 bg-red-600 text-white rounded">
          Explore Menu
        </Link>
      </div>
    </div>
  </div>
);

export default About;
