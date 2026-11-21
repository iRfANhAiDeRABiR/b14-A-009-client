export const EQUIPMENT_CATEGORIES = [
  {
    slug: "construction-equipment",
    name: "Construction Equipment",
    description:
      "Excavators, compact loaders, generators, and concrete tools built for active sites.",
    image: "/images/equipment/mini-excavator.jpg",
    imageAlt: "Compact construction excavator staged on clean gravel",
    href: `/equipment?category=${encodeURIComponent("Construction Equipment")}`,
  },
  {
    slug: "photography-equipment",
    name: "Photography Equipment",
    description:
      "Cinema bodies, prime lenses, studio lighting, and field audio packages.",
    image: "/images/equipment/mirrorless-camera.jpg",
    imageAlt: "Mirrorless cinema camera with zoom lens on tripod head",
    href: `/equipment?category=${encodeURIComponent("Photography Equipment")}`,
  },
  {
    slug: "vehicles-transportation",
    name: "Vehicles & Transportation",
    description:
      "Utility pickups, cargo vans, and enclosed trailers ready for regional hauls.",
    image: "/images/equipment/cargo-utility-vehicle.jpg",
    imageAlt: "Commercial utility truck and trailer staged at logistics depot",
    href: `/equipment?category=${encodeURIComponent("Vehicles & Transportation")}`,
  },
  {
    slug: "agriculture-equipment",
    name: "Agriculture Equipment",
    description:
      "Utility tractors, front loaders, and seasonal soil preparation implements.",
    image: "/images/equipment/agricultural-tractor.jpg",
    imageAlt: "Green agricultural tractor standing in open sunny farmland",
    href: `/equipment?category=${encodeURIComponent("Agriculture Equipment")}`,
  },
  {
    slug: "electronics",
    name: "Electronics",
    description:
      "Laser levels, thermal diagnostic tools, and portable battery power stations.",
    image: "/images/equipment/field-electronics.jpg",
    imageAlt: "Survey laser level, thermal camera, and portable power station",
    href: `/equipment?category=${encodeURIComponent("Electronics")}`,
  },
  {
    slug: "event-equipment",
    name: "Event Equipment",
    description:
      "Line-array PA speakers, digital mixing consoles, and stage rigging setups.",
    image: "/images/equipment/event-sound-system.jpg",
    imageAlt: "Professional event PA speakers and digital audio console on stage",
    href: `/equipment?category=${encodeURIComponent("Event Equipment")}`,
  },
];
