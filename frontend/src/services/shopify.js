const SHOPIFY_STORE_DOMAIN =
  import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;

const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const SHOPIFY_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2025-10/graphql.json`;

async function shopifyFetch(query, variables = {}) {
  const response = await fetch(SHOPIFY_API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token":
        SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },

    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.errors) {
    console.error("Shopify API Error:", data);

    throw new Error(
      data.errors?.[0]?.message ||
        "Failed to fetch data from Shopify"
    );
  }

  return data.data;
}

export async function getProducts() {
  const query = `
    query GetProducts {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description

            featuredImage {
              id
              url
              altText
            }

            images(first: 10) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }

            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  availableForSale

                  price {
                    amount
                    currencyCode
                  }

                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch(query);

  return data.products.edges.map(({ node }) => {
    const variants = node.variants.edges.map(({ node }) => node);

    return {
      id: node.id,
      name: node.title,
      slug: node.handle,
      description: node.description,

      image: node.featuredImage?.url || "",

      images: node.images.edges.map(({ node: image }) => ({
        id: image.id,
        url: image.url,
        altText: image.altText,
      })),

      price: Number(
        variants[0]?.price?.amount || 0
      ),

      variants,

      sizes: variants.map(
        (variant) =>
          variant.selectedOptions.find(
            (option) => option.name === "Size"
          )?.value
      ).filter(Boolean),
    };
  });
}

export async function getProductByHandle(handle) {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description

        featuredImage {
          id
          url
          altText
        }

        images(first: 10) {
          edges {
            node {
              id
              url
              altText
            }
          }
        }

        variants(first: 50) {
          edges {
            node {
              id
              title
              availableForSale

              price {
                amount
                currencyCode
              }

              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch(query, {
    handle,
  });

  if (!data.product) {
    return null;
  }

  const node = data.product;

  const variants = node.variants.edges.map(
    ({ node }) => node
  );

  return {
    id: node.id,
    name: node.title,
    slug: node.handle,
    description: node.description,

    image: node.featuredImage?.url || "",

    images: node.images.edges.map(
      ({ node: image }) => ({
        id: image.id,
        url: image.url,
        altText: image.altText,
      })
    ),

    price: Number(
      variants[0]?.price?.amount || 0
    ),

    variants,

    sizes: variants
      .map(
        (variant) =>
          variant.selectedOptions.find(
            (option) => option.name === "Size"
          )?.value
      )
      .filter(Boolean),
  };
}

export async function createCart(variantId, quantity = 1) {
  const mutation = `
    mutation CreateCart($lines: [CartLineInput!]!) {
      cartCreate(input: {
        lines: $lines
      }) {
        cart {
          id
          checkoutUrl

          lines(first: 50) {
            edges {
              node {
                id
                quantity

                merchandise {
                  ... on ProductVariant {
                    id
                    title

                    product {
                      title
                      handle
                    }

                    image {
                      url
                      altText
                    }

                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }

          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }

        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch(mutation, {
    lines: [
      {
        merchandiseId: variantId,
        quantity,
      },
    ],
  });

  const { cartCreate } = data;

  if (cartCreate.userErrors.length > 0) {
    throw new Error(cartCreate.userErrors[0].message);
  }

  return cartCreate.cart;
}

export async function getCart(cartId) {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl

        lines(first: 50) {
          edges {
            node {
              id
              quantity

              merchandise {
                ... on ProductVariant {
                  id
                  title

                  product {
                    title
                    handle
                  }

                  image {
                    url
                    altText
                  }

                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }

        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  const data = await shopifyFetch(query, {
    cartId,
  });

  return data.cart;
}

export async function addToCart(
  cartId,
  variantId,
  quantity = 1
) {
  const mutation = `
    mutation AddToCart(
      $cartId: ID!
      $lines: [CartLineInput!]!
    ) {
      cartLinesAdd(
        cartId: $cartId
        lines: $lines
      ) {
        cart {
          id
          checkoutUrl

          lines(first: 50) {
            edges {
              node {
                id
                quantity

                merchandise {
                  ... on ProductVariant {
                    id
                    title

                    product {
                      title
                      handle
                    }

                    image {
                      url
                      altText
                    }

                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }

          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }

        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch(mutation, {
    cartId,

    lines: [
      {
        merchandiseId: variantId,
        quantity,
      },
    ],
  });

  const { cartLinesAdd } = data;

  if (cartLinesAdd.userErrors.length > 0) {
    throw new Error(cartLinesAdd.userErrors[0].message);
  }

  return cartLinesAdd.cart;
}

export async function updateCartLine(cartId, lineId, quantity) {
  const mutation = `
    mutation UpdateCartLine(
      $cartId: ID!
      $lines: [CartLineUpdateInput!]!
    ) {
      cartLinesUpdate(
        cartId: $cartId
        lines: $lines
      ) {
        cart {
          id

          checkoutUrl

          lines(first: 50) {
            edges {
              node {
                id
                quantity

                merchandise {
                  ... on ProductVariant {
                    id
                    title

                    product {
                      title
                      handle
                    }

                    image {
                      url
                      altText
                    }

                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }

          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }

        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch(mutation, {
    cartId,
    lines: [
      {
        id: lineId,
        quantity,
      },
    ],
  });

  const { cartLinesUpdate } = data;

  if (cartLinesUpdate.userErrors.length > 0) {
    throw new Error(
      cartLinesUpdate.userErrors[0].message
    );
  }

  return cartLinesUpdate.cart;
}


export async function removeCartLine(cartId, lineId) {
  const mutation = `
    mutation RemoveCartLine(
      $cartId: ID!
      $lineIds: [ID!]!
    ) {
      cartLinesRemove(
        cartId: $cartId
        lineIds: $lineIds
      ) {
        cart {
          id

          checkoutUrl

          lines(first: 50) {
            edges {
              node {
                id
                quantity

                merchandise {
                  ... on ProductVariant {
                    id
                    title

                    product {
                      title
                      handle
                    }

                    image {
                      url
                      altText
                    }

                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }

          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }

        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch(mutation, {
    cartId,
    lineIds: [lineId],
  });

  const { cartLinesRemove } = data;

  if (cartLinesRemove.userErrors.length > 0) {
    throw new Error(
      cartLinesRemove.userErrors[0].message
    );
  }

  return cartLinesRemove.cart;
}