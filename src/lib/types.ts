export type Nutrient = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MenuItem = {
  id:string;
  name: string;
  image: string;
  imageHint?: string;
  nutrients: Nutrient;
};
