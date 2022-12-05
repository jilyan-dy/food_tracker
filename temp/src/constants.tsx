
export enum CATEGORY_CHOICES {
	// "" = "Select Category",
	perishable = "Perishable",
	non_perishable = "Non Perishable",
	condiments = "Condiments"
}

export enum LOCATION_CHOICES {
	// "" = "Select Location",
	freezer = "Freezer",
	fridge = "Fridge",
	kitchen = "Kitchen",
	cabinet = "Cabinet"
}

export const ITEM_FORMAT = [
  {
	name: "name",
	type: "text",
	label: "Name",
  },
  {
	name: "category",
	label: "Category",
  },
  {
	name: "quantity",
	type: "number",
	label: "Quantity",
  },
  {
	label: "Expiration Date",
  },
  {
	name: "location",
	label: "Location",
  },
  {
	name: "note",
	label: "Note",
  }
]