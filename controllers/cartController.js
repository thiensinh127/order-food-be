import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

const resolveCartItems = async (cartData, findByIds) => {
  const itemIds = Object.entries(cartData || {})
    .filter(([, quantity]) => quantity > 0)
    .map(([itemId]) => itemId);

  return itemIds.length ? findByIds(itemIds) : [];
};

// add items to user cart
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId);
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.userId, { cartData });
    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove item from user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId);
    let cartData = await userData.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    } else {
      delete cartData[req.body.itemId];
    }
    await userModel.findByIdAndUpdate(req.userId, { cartData });
    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// fetch user cart data
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId);
    let cartData = await userData.cartData;
    const items = await resolveCartItems(
      cartData,
      (itemIds) => foodModel.find({ _id: { $in: itemIds } }).lean(),
    );
    res.json({ success: true, cartData, items });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart, resolveCartItems };
