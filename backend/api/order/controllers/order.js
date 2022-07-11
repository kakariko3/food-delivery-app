"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const stripe = require("stripe")(
  "sk_test_51LKKQkIHZyOqZpsgXV3UiJMI1X7IxfTZJJnqeHZeh5SMOieYJzcANxDEkxYqwhP5J6Go3GngZYPhNDU87jyk9xXM00ZnUcOVAB"
);

module.exports = {
  // 注文を作成
  create: async function (ctx) {
    const { address, amount, dishes, token } = JSON.parse(ctx.request.body);

    const charge = await stripe.charges.create({
      amount,
      currency: "jpy",
      source: token,
      description: `Order ${new Date()} by ${ctx.state.user._id}`,
    });

    const order = await strapi.services.order.create({
      user: ctx.state.user._id,
      charge_id: charge.id,
      amount,
      address,
      dishes,
    });

    return order;
  },
};
