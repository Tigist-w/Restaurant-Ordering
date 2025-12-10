import { useEffect, useState, useContext } from "react";
import { API } from "../services/api";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await API.get("/menu");
        setMenu(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMenu();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`, { autoClose: 2000 });
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menu.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-md p-4 text-center"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="mx-auto rounded-lg mb-4 h-40 w-40 object-cover"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            <p className="text-gray-700 mb-2">{item.description}</p>
            <p className="text-green-600 font-bold mb-2">${item.price}</p>
            <button
              onClick={() => handleAddToCart(item)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
