export type Source = { id: string; text: string; href?: string; path?: string; date: string };
export type Num = { value: string; label: string; condition: string; source: string };
export type Slug = "ipporu" | "romanian-speech" | "superstarling" | "surogates";
export type Work = {
  slug: Slug;
  title: string;
  line: string;
  hero: { kind: "film" | "image" | "figure"; src: string; poster?: string; alt: string };
  numbers: Num[];
  links: { label: string; href: string }[];
  sections: { heading: string; body: string }[];
  mine: string;
  limits: string[];
  next: { label: string; href: string };
};
