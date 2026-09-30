// Treatments from the build brief. Names follow compliance: no brand-drug names; compounded
// items carry the not-FDA-approved disclosure; hormone items require labs (brief §2).
export type Treatment = {
  name: string;
  category: string;
  href: string;
  compounded: boolean;
  labs?: boolean;
  tint: string; // accent glow colour, from the brand palette
  image?: string; // product render; treatments without one are left out of the vial showcases
};

const vial = (slug: string) => `/media/vials/${slug}.webp`;

export const TREATMENTS: Treatment[] = [
  { name: 'Semaglutide', category: 'Weight Management', href: '#semaglutide', compounded: true, tint: '#DDD3B9', image: vial('semaglutide') },
  { name: 'Tirzepatide', category: 'Weight Management', href: '#tirzepatide', compounded: true, tint: '#DDD3B9', image: vial('tirzepatide') },
  { name: 'NAD+', category: 'Peptide Therapy', href: '#nad', compounded: true, tint: '#F3BD25' },
  { name: 'Sermorelin', category: 'Peptide Therapy', href: '#sermorelin', compounded: true, tint: '#9EBEC9', image: vial('sermorelin') },
  { name: 'Glutathione', category: 'Peptide Therapy', href: '#glutathione', compounded: true, tint: '#ffffff', image: vial('glutathione') },
  { name: 'GHK-Cu', category: 'Skin Care', href: '#ghk-cu', compounded: true, tint: '#6f8fd8' },
  { name: 'PT-141', category: 'Sexual Health', href: '#pt-141', compounded: true, tint: '#c98a6a', image: vial('pt-141') },
  { name: 'Sildenafil', category: 'Sexual Health', href: '#sildenafil', compounded: false, tint: '#9EBEC9', image: vial('sildenafil') },
  { name: 'Tadalafil', category: 'Sexual Health', href: '#tadalafil', compounded: false, tint: '#DDD3B9', image: vial('tadalafil') },
  { name: 'Finasteride', category: 'Hair Loss', href: '#finasteride', compounded: false, tint: '#9EBEC9', image: vial('finasteride') },
  { name: 'Minoxidil', category: 'Hair Loss', href: '#minoxidil', compounded: false, tint: '#DDD3B9', image: vial('minoxidil') },
  { name: 'Estradiol', category: 'Hormone Therapy', href: '#estradiol', compounded: true, labs: true, tint: '#F3BD25' },
  { name: 'Progesterone', category: 'Hormone Therapy', href: '#progesterone', compounded: true, labs: true, tint: '#DDD3B9' },
];

// Treatments that have a render, for the vial showcases (V1 switcher, V2/V3 cards).
export const SHOWCASE = TREATMENTS.filter((t): t is Treatment & { image: string } => Boolean(t.image));

export function disclosure(t: Treatment) {
  const parts: string[] = [];
  if (t.compounded) parts.push('Compounded medications are not FDA-approved.');
  if (t.labs) parts.push('Requires lab testing and provider oversight.');
  parts.push('Prescribed only after review by a licensed provider.');
  return parts.join(' ');
}
