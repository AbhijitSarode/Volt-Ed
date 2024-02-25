/*
  Cart Slice: Manages the cart state and actions. This slice manages the state related to the user's shopping cart, including adding and removing courses,
  updating the total price, and resetting the cart.

  Dependencies:
  - Redux Toolkit's createSlice function for state management.
  - react-hot-toast for notifications.

  Initial State:
  Object containing cart items, total price, and total number of items fetched from local storage.

  Reducers:
  - addToCart: Adds a course to the cart. If the course already exists, displays an error notification.
  - removeFromCart: Removes a course from the cart and updates the total price and total items count.
  - resetCart: Resets the cart to its initial state by clearing cart data from local storage.
*/

// Import dependencies
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

// Initial state for cart slice
const initialState = {
  // Array to hold the courses in the cart
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  // Total price of all courses in the cart
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
  // Total number of items in the cart
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
};

// Create cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add course to cart
    addToCart(state, action) {
      const course = action.payload;
      // Check if course already exists in the cart
      const index = state.cart.findIndex((item) => item._id === course._id);

      if (index >= 0) {
        // Display error notification if course is already in the cart
        toast.error("Course is already in the cart");
        return;
      }

      // Add course to cart
      state.cart.push(course);
      // Increment total items count
      state.totalItems++;
      // Update total price
      state.total += course.price;

      // Update local storage with new cart data
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

      // Display success notification
      toast.success("Course added to cart");
    },
    // Remove course from cart
    removeFromCart(state, action) {
      const courseId = action.payload;
      // Find index of course to be removed
      const index = state.cart.findIndex((item) => item._id === courseId);

      if (index >= 0) {
        // Decrement total items count
        state.totalItems--;
        // Deduct course price from total price
        state.total -= state.cart[index].price;
        // Remove course from cart
        state.cart.splice(index, 1);

        // Update local storage with updated cart data
        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

        // Display success notification
        toast.success("Course removed from cart");
      }
    },
    // Reset cart to initial state
    resetCart(state) {
      // Reset cart items, total price, and total items count
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;

      // Clear cart data from local storage
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
    },
  },
});

// Export action creators and reducer
export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
