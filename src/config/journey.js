/**
 * Weekend itinerary journey copy and assets.
 * Edit nicknames, activities, and photo paths here.
 */

export const nicknames = [
  'mango wango',
  'sugar plum pookie',
  'baby yoda bear',
  'mangopookie',
  'pookie bear',
  'mango mando',
]

export const photos = {
  poolDay: '/photos/pool-day.png',
  hotelMirror: '/photos/hotel-mirror.png',
  barNight: '/photos/bar-night.png',
  halloweenMango: '/photos/halloween-mango.png',
  sojuSugarplum: '/photos/soju-sugarplum.png',
  passengerPookie: '/photos/passenger-pookie.png',
  formalMando: '/photos/formal-mando.png',
  senecaSugarmango: '/photos/seneca-sugarmango.png',
}

export const welcome = {
  headline: 'hey sugar plum pookie',
  subline: 'boy mango mando has a surprise for you',
  polaroids: [
    {
      src: photos.poolDay,
      alt: 'Kaevon and Taite at the pool',
      caption: 'BLONDISHHH',
      tilt: -8,
    },
    {
      src: photos.barNight,
      alt: 'Kaevon and Taite night out mirror selfie',
      caption: 'zinque',
      tilt: 5,
    },
    {
      src: photos.hotelMirror,
      alt: 'Kaevon and Taite hotel mirror kiss',
      caption: 'VEGASSS',
      tilt: -4,
    },
  ],
  teaserCaption: 'yacht day loading…',
}

export const ready = {
  line: 'are u ready',
  polaroid: {
    src: photos.halloweenMango,
    alt: 'Kaevon and Taite dressed up in a bathroom mirror selfie',
    caption: 'halloween mango',
    tilt: -4,
  },
}

export const friday = {
  title: 'welcome to our weekend itinerary',
  dayLabel: 'Friday',
  dateLabel: 'June 12, 2026',
  activitiesPrompt: 'tap what you’re excited for ♡',
  activities: [
    { id: 'wine', label: 'wine', icon: 'wine', hint: 'glasses up' },
    { id: 'fortnite', label: 'Fortnite', icon: 'game', hint: 'duo queue' },
    { id: 'vodka-pasta', label: 'vodka pasta', icon: 'food', hint: 'carb loading' },
  ],
  polaroids: [
    {
      src: photos.sojuSugarplum,
      alt: 'Taite with Cali Soju lychee cup',
      caption: 'soju sugarplum',
      tilt: -5,
    },
    {
      src: photos.passengerPookie,
      alt: 'Taite in the car with Kaevon outside at the gas station',
      caption: 'passenger pookie baby yoda bear',
      tilt: 4,
    },
  ],
}

export const saturday = {
  dayLabel: 'Saturday',
  dateLabel: 'June 13, 2026',
  activitiesPrompt: 'tap what you’re excited for ♡',
  activities: [
    {
      id: 'breakfast',
      label: 'boy mango breakfast',
      hint: 'slow morning, good food, zero rush',
      icon: 'breakfast',
    },
    {
      id: 'cassel-earth',
      label: 'Cassel Earth',
      hint: 'coffee shop — lattes, matcha, slow morning vibes',
      icon: 'earth',
    },
    {
      id: 'beach-day',
      label: 'beach day',
      hint: 'sand + sun',
      icon: 'beach',
    },
    {
      id: 'bed-relax',
      label: 'relaxing in bed',
      hint: 'zero plans',
      icon: 'bed',
    },
  ],
  polaroids: [
    {
      src: photos.formalMando,
      alt: 'Kaevon kissing Taite in a formal mirror selfie',
      caption: 'formal mando commando',
      tilt: -3,
    },
    {
      src: photos.senecaSugarmango,
      alt: 'Taite with wine at Seneca restaurant',
      caption: 'seneca sugarmango',
      tilt: 4,
    },
  ],
}

/** Every polaroid shown across the story (for date-ask finale) */
export const allStoryPhotos = [
  ...welcome.polaroids,
  {
    src: ready.polaroid.src,
    alt: ready.polaroid.alt,
    caption: ready.polaroid.caption,
    tilt: ready.polaroid.tilt,
  },
  ...friday.polaroids,
  ...saturday.polaroids,
]

export const dateAsk = {
  headline: "ok pookie, let's make it official",
  subline: 'pick where and when. mango mando has you.',
  yesLabel: 'Yes',
  polaroids: allStoryPhotos,
}

/** Story steps before modal (for progress UI) */
export const STORY_STEPS = ['welcome', 'ready', 'friday', 'saturday', 'dateAsk']

export const STEP_LABELS = {
  welcome: 'Welcome',
  ready: 'Ready',
  friday: 'Friday',
  saturday: 'Saturday',
  dateAsk: 'The date',
}
