import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import Cookies from 'js-cookie';

import AppContext from '../context/AppContext';
import Layout from '../components/Layout';
import withData, { API_URL } from '../lib/apollo';

class MyApp extends App {
  state = {
    user: null,
    cart: { items: [], total: 0 },
  };

  setUser = (user) => {
    this.setState({ user });
  };

  // Cookieにユーザーの情報が存在するかを確認
  componentDidMount() {
    const token = Cookies.get('token');
    const cart = Cookies.get('cart');

    if (token) {
      fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        // JWTトークンの認証に失敗した場合
        if (!res.ok) {
          Cookies.remove('token');
          this.setState({ user: null });
          return null;
        }
        const user = await res.json();
        this.setUser(user); // ログイン
      });
    }

    if (cart !== 'undefined' && typeof cart === 'string') {
      JSON.parse(cart).forEach((item) => {
        this.setState({
          cart: {
            items: JSON.parse(cart),
            total: (this.state.cart.total += item.price * item.quantity),
          },
        });
      });
    }
  }

  // カートへ商品を追加
  addItem = (item) => {
    let { items } = this.state.cart;
    const newItem = items.find((i) => i.id === item.id);
    // 新しい商品をカートに追加する場合
    if (!newItem) {
      item.quantity = 1;
      // カートに追加
      this.setState(
        {
          cart: {
            items: [...items, item],
            total: this.state.cart.total + item.price,
          },
        },
        // カートの情報をCookieに保存
        () => Cookies.set('cart', this.state.cart.items)
      );
    }
    // すでに同じ商品がカートに入っている場合
    else {
      this.setState(
        {
          cart: {
            items: this.state.cart.items.map((item) =>
              item.id === newItem.id
                ? Object.assign({}, item, { quantity: item.quantity + 1 })
                : item
            ),
            total: this.state.cart.total + item.price,
          },
        },
        () => Cookies.set('cart', this.state.cart.items)
      );
    }
  };

  // カートから商品を削除
  removeItem = (item) => {
    let { items } = this.state.cart;
    const newItem = items.find((i) => i.id === item.id);
    // 商品の数量が2以上の場合
    if (newItem.quantity > 1) {
      this.setState(
        {
          cart: {
            items: this.state.cart.items.map((item) =>
              item.id === newItem.id
                ? Object.assign({}, item, { quantity: item.quantity - 1 })
                : item
            ),
            total: this.state.cart.total - item.price,
          },
        },
        // カートの情報をCookieに保存
        () => Cookies.set('cart', this.state.cart.items)
      );
    }
    // 商品の数量が1の場合
    else {
      const items = [...this.state.cart.items];
      const index = items.findIndex((i) => i.id === newItem.id);
      items.splice(index, 1);
      this.setState(
        {
          cart: {
            items,
            total: this.state.cart.total - item.price,
          },
        },
        () => Cookies.set('cart', this.state.cart.items)
      );
    }
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <AppContext.Provider
        value={{
          user: this.state.user,
          cart: this.state.cart,
          setUser: this.setUser,
          addItem: this.addItem,
          removeItem: this.removeItem,
        }}
      >
        <Head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
          />
        </Head>

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContext.Provider>
    );
  }
}

export default withData(MyApp);
