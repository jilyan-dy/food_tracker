export enum REACT_SESSION {
  loggedIn = "loggedIn",
  editProfile = "profileToEdit",
  editItem = "itemToEdit",
}

export enum CATEGORY_CHOICES {
  // "" = "Select Category",
  perishable = "Perishable",
  non_perishable = "Non Perishable",
  condiments = "Condiments",
}

export enum LOCATION_CHOICES {
  // "" = "Select Location",
  freezer = "Freezer",
  fridge = "Fridge",
  kitchen = "Kitchen",
  cabinet = "Cabinet",
}

export const ITEM_FORMAT = [
  {
    name: "name",
    type: "text",
    label: "Name",
  },
  {
    name: "category",
    type: "dropdown",
    label: "Category",
  },
  {
    name: "quantity",
    type: "number",
    label: "Quantity",
  },
  {
    type: "date",
    label: "Expiration Date",
  },
  {
    name: "location",
    type: "dropdown",
    label: "Location",
  },
  {
    name: "note",
    type: "textarea",
    label: "Note",
  },
];
