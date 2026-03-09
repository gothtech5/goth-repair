export const BUSINESS = {
  name: "GothTech",
  tagline: "Expert Repair Services",
  domain: "gothtech.repair",

  contact: {
    phone: "(612)-987-8107",
    phoneHref: "tel:+16129878107",
    email: "bookings@gothtechnology.com",
    fromEmail: "bookings@gothtechnology.com",
  },

  location: {
    address: "200 W Lake St #203",
    city: "Minneapolis",
    state: "MN",
    stateName: "Minnesota",
    zip: "55408",
    timezone: "America/Chicago",
    geo: { latitude: 44.9484517, longitude: -93.2814591 },
    googleMapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2823.0!2d-93.2814591!3d44.9484517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b333a4ebdf80e3%3A0xd7c1f279d9208b88!2sGothTech%3A%20Expert%20Repair%20Services%20for%20Phones%20and%20iPads.!5e0!3m2!1sen!2sus!4v1",
    googleMapsLink: "https://maps.app.goo.gl/RpGRgnfvj8TSac8B6",
    jurisdiction: "Hennepin County, Minnesota",
  },

  hours: {
    openHour: 11,
    closeHour: 21,
    opensDisplay: "11:00 a.m.",
    closesDisplay: "9:00 p.m.",
    opensSchema: "11:00",
    closesSchema: "21:00",
    displayHours: [
      { day: "Monday", time: "11:00 AM - 9:00 PM" },
      { day: "Tuesday", time: "11:00 AM - 9:00 PM" },
      { day: "Wednesday", time: "11:00 AM - 9:00 PM" },
      { day: "Thursday", time: "11:00 AM - 9:00 PM" },
      { day: "Friday", time: "11:00 AM - 9:00 PM" },
      { day: "Saturday", time: "11:00 AM - 9:00 PM" },
      { day: "Sunday", time: "11:00 AM - 9:00 PM" },
    ],
  },

  google: {
    rating: 5.0,
    reviewCount: 257,
    reviewUrl: "https://maps.app.goo.gl/RpGRgnfvj8TSac8B6",
  },

  seo: {
    description:
      "Fast, reliable Apple device repair in Minneapolis. iPhone, iPad, and Apple Watch screen repair, battery replacement, and more. Free diagnostics.",
    shortDescription:
      "Expert repair services for iPhones, iPads, and Apple Watches in Minneapolis.",
  },

  trust: {
    warrantyDays: 90,
    signals: [
      { title: "Free Diagnostics", description: "No charge to assess the issue" },
      { title: "90-Day Warranty", description: "On all parts and labor" },
      { title: "Same-Day Repairs", description: "Most repairs done in hours" },
      { title: "Certified Technicians", description: "Experienced Apple device specialists" },
    ],
  },
} as const
