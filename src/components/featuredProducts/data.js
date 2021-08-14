// L18n
import strings from './strings.json'

// Assets
import Image1 from './assets/images/image1.jpg'
import Image2 from './assets/images/image2.jpg'
import Image3 from './assets/images/image3.jpg'

export const items = [
  {
    id: 1,
    image: Image1,
    badge: strings.badge1,
    title: strings.title1,
    content: strings.content1,
    label: strings.label,
    link: '#',
    score: 4.5,
    price: 25,
  },
  {
    id: 2,
    image: Image2,
    badge: strings.badge2,
    title: strings.title2,
    content: strings.content2,
    label: strings.label,
    link: '#',
    score: 4.5,
    price: 45,
    reverse: true,
  },
  {
    id: 3,
    image: Image3,
    badge: strings.badge3,
    title: strings.title3,
    content: strings.content3,
    label: strings.label,
    link: '#',
    score: 4.5,
    price: 88,
  },
]
