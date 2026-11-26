export type Source = { id: string; text: string; href?: string; path?: string; date: string };
export type Num = { value: string; label: string; condition: string; source: string };
export type Slug = "ipporu" | "romanian-speech" | "superstarling" | "surogates";
export type Work = {
  slug: Slug;
  title: string;
  line: string;
  stat: string; // one number with its unit, for the home row; the full figure is in numbers
  hero: { kind: "film" | "image" | "figure"; src: string; poster?: string; alt: string };
  numbers: Num[];
  links: { label: string; href: string }[];
  sections: { heading: string; body: string }[];
  // a tabbed walk through the thing, one step at a time; `shot` is a screen, `mine` says which part of a team step is mine
  walk?: { title: string; steps: { name: string; body: string; shot?: { src: string; alt: string; w: number; h: number }; mine?: string }[] };
  crew?: { name: string; role: string; face: string }[];
  mine: string;
  limits: string[];
  next: { label: string; href: string };
};
