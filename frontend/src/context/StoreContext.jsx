import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [url] = useState("https://food-te0g.onrender.com/");
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    try {
      setCartItems((prev) => {
        const newCart = { ...prev };
        newCart[itemId] = (newCart[itemId] || 0) + 1;
        localStorage.setItem("cartItems", JSON.stringify(newCart));
        return newCart;
      });

      if (token) {
        await axios.post(
          `${url}api/cart/add`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Error adding item to cart:", error.response ? error.response.data : error.message);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setCartItems((prev) => {
        const newCart = { ...prev };
        if (newCart[itemId] > 1) {
          newCart[itemId] -= 1;
        } else {
          delete newCart[itemId];
        }
        localStorage.setItem("cartItems", JSON.stringify(newCart));
        return newCart;
      });

      if (token) {
        await axios.post(
          `${url}api/cart/remove`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Error removing item from cart:", error.response ? error.response.data : error.message);
    }
  };

  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((totalAmount, [itemId, quantity]) => {
      const item = food_list.find((product) => product._id === itemId);
      if (item) {
        totalAmount += item.price * quantity;
      }
      return totalAmount;
    }, 0);
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}api/food/list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error.response ? error.response.data : error.message);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.get(
        `${url}api/cart/get`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(response.data.cartData);
      localStorage.setItem("cartItems", JSON.stringify(response.data.cartData));
    } catch (error) {
      console.error("Error loading cart data:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      } else {
        const storedCartItems = localStorage.getItem("cartItems");
        if (storedCartItems) {
          setCartItems(JSON.parse(storedCartItems));
        }
      }
    };

    loadData();
  }, [url]);

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
