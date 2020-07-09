
export default [
  {
    url: '/vue-element-admin/article/list2o2',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: [
          {
            kg: '13 kg',
            price: '700 P /kg',
            name: 'Apple',
            description: 'This is Apple',
          },
          {
            kg: '25 kg',
            price: '159.99 P /kg',
            name: 'Апельсин',
            description: 'Это не яблоко',
          },
          {
            kg: '5 kg',
            price: '100 P /kg',
            name: 'Огурец',
            description: 'Огурец обыкновенны',
          },
          {
            kg: '1.6 kg',
            price: '20 0P /kg',
            name: 'Арбуз',
            description: 'Нет описания',
          },
        ],
      }
    },
  },
]

