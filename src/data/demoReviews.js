/**
 * Prototype / sample marketplace reviews for UI preview only.
 * Clearly separated from live database records so verified reviews can
 * replace these seamlessly when backend review endpoints are introduced.
 */
export const DEMO_CUSTOMER_REVIEWS = [
  {
    id: "demo-rev-01",
    customerName: "Marcus Vance",
    initials: "MV",
    roleLabel: "Site Contractor",
    category: "Construction Equipment",
    rating: 5,
    comment:
      "Booked a mini excavator for a four-day trenching job. Pickup scheduling and rate breakdown were straightforward from start to finish.",
    isDemo: true,
  },
  {
    id: "demo-rev-02",
    customerName: "Elena Rostova",
    initials: "ER",
    roleLabel: "Commercial Producer",
    category: "Photography Equipment",
    rating: 5,
    comment:
      "Rented a mirrorless camera kit and portable lighting rig for an on-location shoot. Clean gear and transparent daily pricing.",
    isDemo: true,
  },
  {
    id: "demo-rev-03",
    customerName: "Caleb Thornton",
    initials: "CT",
    roleLabel: "Orchard Operations",
    category: "Agriculture Equipment",
    rating: 5,
    comment:
      "Securing a utility tractor on a weekly term saved us from tying up capital during harvest prep. Smooth owner handoff.",
    isDemo: true,
  },
  {
    id: "demo-rev-04",
    customerName: "Nadia Patel",
    initials: "NP",
    roleLabel: "Event Coordinator",
    category: "Event Equipment",
    rating: 4,
    comment:
      "The PA speaker and mixer bundle arrived ready for setup for an outdoor reception. Online checkout took less than two minutes.",
    isDemo: true,
  },
];
