export type GalleryCategory = "teaching" | "presentations" | "awards" | "events";

export const galleryCategories: { value: GalleryCategory; label: string }[] = [
  { value: "teaching", label: "Teaching" },
  { value: "presentations", label: "Presentations" },
  { value: "awards", label: "Awards" },
  { value: "events", label: "Events" },
];

export type GalleryItem = {
  src: string;
  alt: string;
  title: string;
  caption: string;
  category: GalleryCategory;
};

export const galleryItems: GalleryItem[] = [
  { src: "/img/gallery/lecture-session.jpg", alt: "Dr. Odhiambo lecturing a university class", title: "Lecture Session", caption: "Engaging students in advanced actuarial concepts at university", category: "teaching" },
  { src: "/img/gallery/keynote-address.jpg", alt: "Dr. Odhiambo delivering a keynote address to a conference audience", title: "Keynote Address", caption: "Presenting at the International Actuarial Conference", category: "presentations" },
  { src: "/img/gallery/award-recognition.jpg", alt: "Dr. Odhiambo receiving the Outstanding Actuary in Academia Award", title: "Award Recognition", caption: "Receiving the Outstanding Actuary in Academia Award", category: "awards" },
  { src: "/img/gallery/student-seminar.jpg", alt: "Dr. Odhiambo leading a student seminar", title: "Student Seminar", caption: "Leading a discussion on financial modelling techniques", category: "teaching" },
  { src: "/img/gallery/panel-education-reform.jpg", alt: "Panel discussion on education reforms", title: "Panel Discussion", caption: "Participating in a policy forum on education reforms", category: "presentations" },
  { src: "/img/gallery/digital-insurance-forum.jpg", alt: "Dr. Odhiambo speaking at the East African Digital Insurance Forum", title: "Digital Insurance Forum", caption: "Training insurance executives on predictive modelling techniques at the East African Digital Insurance Forum", category: "presentations" },
  { src: "/img/gallery/addressing-students.jpg", alt: "Dr. Odhiambo addressing a gathering of students", title: "Addressing Students", caption: "“Your first failed exam isn't a verdict, it's your most valuable case study.”", category: "teaching" },
  { src: "/img/gallery/panel-economic-reform.jpg", alt: "Panel discussion on economic reforms", title: "Panel Discussion", caption: "Participating in a policy forum on economic reforms", category: "presentations" },
  { src: "/img/gallery/policy-panel.jpg", alt: "Experts seated on a policy panel at a national conference", title: "Policy Panel Discussion", caption: "Discussing economic policy reforms with fellow experts at a national conference", category: "presentations" },
  { src: "/img/gallery/kicd-workshop.jpg", alt: "Curriculum development workshop at the Kenya Institute of Curriculum Development", title: "Curriculum Development Workshop", caption: "Collaborating with colleagues at the Kenya Institute of Curriculum Development on national educational frameworks", category: "events" },
  { src: "/img/gallery/graduation.jpg", alt: "Dr. Odhiambo at his PhD and MSc graduation", title: "PhD and MSc Graduation", caption: "Milestone academic achievements", category: "awards" },
  { src: "/img/gallery/collaboration.jpg", alt: "Dr. Odhiambo greeting actuaries at an international gathering", title: "Collaboration", caption: "Interacting with actuaries from different continents", category: "events" },
  { src: "/img/gallery/gala-dinner.jpg", alt: "Actuarial industry gala dinner", title: "Gala Dinner", caption: "Celebrating excellence in actuarial science at the industry gala dinner", category: "events" },
  { src: "/img/gallery/department-celebration.jpg", alt: "Department members celebrating together", title: "Department Celebration", caption: "Celebrating another successful academic year with the team", category: "events" },
  { src: "/img/gallery/tree-planting.jpg", alt: "Dr. Odhiambo planting a tree", title: "Inaugural Planting", caption: "Launching the department's sustainability initiative with the first ceremonial tree", category: "events" },
];
