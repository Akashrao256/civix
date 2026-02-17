export interface User {
  name: string;
  email: string;
  city: string;
  state: string;
  role: "citizen" | "official";
}

export interface Petition {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: "Active" | "Under Review" | "Closed";
  signatureGoal: number;
  currentSignatures: number;
}

export const mockUsers: Record<string, User> = {
  "citizen@civix.in": {
    name: "Aarav Sharma",
    email: "citizen@civix.in",
    city: "Bengaluru",
    state: "Karnataka",
    role: "citizen",
  },
  "official@civix.in": {
    name: "Priya Reddy",
    email: "official@civix.in",
    city: "Bengaluru",
    state: "Karnataka",
    role: "official",
  },
};

export const mockPetitions: Petition[] = [
  {
    id: "1",
    title: "Improve BMTC Bus Frequency in Whitefield",
    description: "Request to increase the number of BMTC bus services in the Whitefield IT corridor during peak hours to reduce traffic congestion.",
    category: "Transportation",
    location: "Bengaluru, Karnataka",
    status: "Active",
    signatureGoal: 1000,
    currentSignatures: 642,
  },
  {
    id: "2",
    title: "Fix Potholes on Outer Ring Road",
    description: "Multiple dangerous potholes on the ORR stretch between Marathahalli and Silk Board causing accidents and traffic delays.",
    category: "Infrastructure",
    location: "Bengaluru, Karnataka",
    status: "Under Review",
    signatureGoal: 500,
    currentSignatures: 500,
  },
  {
    id: "3",
    title: "Increase Safety Lighting in Indiranagar",
    description: "Several streets in Indiranagar lack adequate street lighting, creating safety concerns for residents and pedestrians at night.",
    category: "Public Safety",
    location: "Bengaluru, Karnataka",
    status: "Active",
    signatureGoal: 300,
    currentSignatures: 120,
  },
  {
    id: "4",
    title: "Clean-Up Drive for Ulsoor Lake",
    description: "Community initiative to restore Ulsoor Lake by removing pollutants, planting native species, and establishing regular maintenance.",
    category: "Environment",
    location: "Bengaluru, Karnataka",
    status: "Closed",
    signatureGoal: 800,
    currentSignatures: 820,
  },
];

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh",
];
