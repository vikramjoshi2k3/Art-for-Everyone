import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Sumant',
      email: 'admin@test.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'John',
      email: 'user@test.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      // _id: '1',
      name: 'Blue Classroom',
      slug: 'blue-classroom',
      category: 'Digital Arts',
      image: '/images/p1.jpg', // 679px × 829px
      price: 120,
      countInStock: 10,
      artist: 'Sumant',
      rating: 4.5,
      numReviews: 10,
      description: 'A blue aesthetic',
    },
    {
      // _id: '2',
      name: 'Red Demon',
      slug: 'red-demon',
      category: 'Fantasy',
      image: '/images/p2.jpg',
      price: 250,
      countInStock: 2,
      artist: 'Shirish',
      rating: 4.0,
      numReviews: 10,
      description: 'A demon on loose',
    },
    {
      // _id: '3',
      name: 'Yellow Train',
      slug: 'yellow-train',
      category: 'Photography',
      image: '/images/p3.jpg',
      price: 25,
      countInStock: 15,
      artist: 'Amey',
      rating: 4.5,
      numReviews: 14,
      description: 'A fast train',
    },
    {
      // _id: '4',
      name: 'Snow Elf',
      slug: 'snow-elf',
      category: 'Cosplay',
      image: '/images/p4.jpg',
      price: 65,
      countInStock: 5,
      artist: 'Vikram',
      rating: 4.5,
      numReviews: 10,
      description: 'Snow Elf',
    },
  ],
};
export default data;
