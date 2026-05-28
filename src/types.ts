export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  image: string;
  priceEstimate?: string;
  durationEstimate?: string;
  seoTitle: string;
  seoDescription: string;
  faqs: { question: string; answer: string }[];
}

export interface Zone {
  id: string;
  city: string;
  postalCode: string;
  slug: string;
  localIntro: string;
  distance: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  keyServices: string[]; // references service IDs or titles
}

export interface Realisation {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface Testimonial {
  id: string;
  author: string;
  rating: number;
  comment: string;
  city: string;
  service: string;
  date: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SiteSettings {
  businessName: string;
  phone: string;
  email: string;
  address: string;
  chaletAddress: string;
  siret: string;
  decennale: string;
  yearsExperience: number;
}
