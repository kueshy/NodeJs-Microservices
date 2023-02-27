const { APIError, STATUS_CODES } = require("../../utils/app-errors");
const { CustomerModel, AddressModel } = require("../models");

// Dealing with database operations
class CustomerRepository {
  async CreateCustomer({ email, password, phone, salt }) {
    try {
      const customer = new CustomerModel({
        email,
        password,
        phone,
        salt,
        address: [],
      });
      const CustomerResult = await customer.save();
      return CustomerResult;
    } catch (error) {
      console.log(error);
    }
  }

  async CreateAddress({ _id, street, postalCode, city, country }) {
    try {
      const profile = await CustomerModel.findById(_id);

      if (profile) {
        const newAddress = new AddressModel({
          street,
          postalCode,
          city,
          country,
        });
        await newAddress.save();

        profile.address.push(newAddress);
      }

      return await profile.save();
    } catch (error) {
      console.log(error);
    }
  }

  async FindCustomer({ email }) {
    try {
      const existingCustomer = await CustomerModel.findOne({ email: email });
      return existingCustomer;
    } catch (err) {
      // throw new APIError(
      //   "API Error",
      //   STATUS_CODES.INTERNAL_ERROR,
      //   "Unable to Find Customer"
      // );
      console.log(err);
    }
  }

  async FindCustomerById({ id }) {
    try {
      const existingCustomer = await CustomerModel.findById(id).populate(
        "address"
      );
      return existingCustomer;
    } catch (error) {
      console.log(error);
    }
  }

  async WishList(customerId) {
    try {
      const profile = await CustomerModel.findById(customerId).populate(
        "wishlist"
      );

      return profile.wishlist;
    } catch (error) {
      console.log(error);
    }
  }

  async AddWishlistItem(
    customerId,
    { _id, name, desc, price, available, banner }
  ) {
    const product = {
      _id,
      name,
      desc,
      price,
      available,
      banner,
    };

    try {
      const profile = await CustomerModel.findById(customerId);
      // .populate(
      //   "wishlist"
      // );

      if (profile) {
        let wishlist = profile.wishlist;

        if (wishlist.length > 0) {
          let isExist = false;
          wishlist.map((item) => {
            if (item._id.toString() === product._id.toString()) {
              const index = wishlist.indexOf(item);
              wishlist.splice(index, 1);
              isExist = true;
            }
          });

          if (!isExist) {
            wishlist.push(product);
          }
        } else {
          wishlist.push(product);
        }
        profile.wishlist = wishlist;
      }
      const profileResult = await profile.save();
      return profileResult.wishlist;
    } catch (error) {
      console.log(error);
    }
  }

  async AddCartItem(customerId, { _id, name, price, banner }, qty, isRemove) {
    try {
      const profile = await CustomerModel.findById(customerId).populate("cart");

      if (profile) {
        const cartItem = {
          product: {
            _id,
            name,
            price,
            banner,
          },
          unit: qty,
        };
        let cartItems = profile.cart;

        if (cartItems.length > 0) {
          let isExist = false;
          cartItems.map((item) => {
            // if (item.product._id.toString() === product._id.toString()) {
            if (item.product._id.toString() === _id.toString()) {
              if (isExist) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });
          if (!isExist) {
            cartItems.push(cartItem);
          }
        } else {
          cartItems.push(cartItem);
        }

        profile.cart = cartItems;

        const cartSaveResult = await profile.save();
        return cartSaveResult;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async AddOrderToProfile(customerId, order) {
    try {
      const profile = await CustomerModel.findById(customerId);

      if (profile) {
        if ((profile.orders = undefined)) {
          profile.orders = [];
        }
        profile.orders.push(order);

        profile.cart = [];

        const profileResult = await profile.save();
        return profileResult;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = CustomerRepository;
