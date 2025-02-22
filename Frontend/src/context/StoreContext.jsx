import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = import.meta.env.VITE_BACKEND_URI;
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    // Handle the async request first
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error adding item to cart:", error);
        // Optionally handle the error, such as showing a notification to the user
        return;
      }
    }

    // Now update the cart state
    setCartItems((prev) => {
      const updatedCartItems = { ...prev };

      // Check if the item already exists in the cart
      if (updatedCartItems[itemId]) {
        // If it exists, increment the quantity by 1
        updatedCartItems[itemId] = updatedCartItems[itemId] + 1;
      } else {
        // If it doesn't exist, add the item to the cart with quantity 1
        updatedCartItems[itemId] = 1;
      }

      // Return the updated cartItems object
      return updatedCartItems;
    });
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const getTotalCartAmount = () => {
    if (!food_list.length) return 0; // Return 0 if food_list is not loaded yet

    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        // Ensure IDs are being compared correctly (as strings, if necessary)
        let itemInfo = food_list.find(
          (product) => String(product._id) === String(item)
        );
        if (itemInfo) {
          // Check if itemInfo is found
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );

    setCartItems(response.data.cartData);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
