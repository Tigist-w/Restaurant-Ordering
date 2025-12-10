import { useState, useEffect } from "react";
import { API } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MenuManagement({ token }) {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [imageFile, setImageFile] = useState(null);

  // Fetch all menu items
  const fetchMenu = async () => {
    try {
      const { data } = await API.get("/menu");
      setMenu(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch menu items");
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle adding a menu item
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      if (imageFile) formData.append("image", imageFile);

      await API.post("/menu", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset form
      setForm({ name: "", description: "", price: "" });
      setImageFile(null);
      toast.success("Menu item added!");
      fetchMenu();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add menu item");
    }
  };

  // Handle deleting a menu item
  const handleDelete = async (id) => {
    try {
      await API.delete(`/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Menu item deleted!");
      fetchMenu();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete menu item");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Menu Management</h2>

      <form onSubmit={handleAdd} className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Add Menu Item
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {menu.map((item) => (
          <div key={item._id} className="p-4 bg-white rounded shadow relative">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}
            <h3 className="font-semibold">{item.name}</h3>
            <p>{item.description}</p>
            <p className="font-bold text-green-600">${item.price}</p>
            <button
              onClick={() => handleDelete(item._id)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
