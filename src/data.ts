/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, ResultDetails, CoopStyle } from './types';

export const HERO_IMAGE_PATH = '/src/assets/images/hero_chickens_1781721921549.jpg';

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    scenario: 'The Morning Choreograph',
    context: 'Your morning alarm rings, piercing the quiet farmhouse air. How do you welcome the new day?',
    answers: [
      {
        id: 'q1-a',
        text: 'Stand on top of the kitchen table, spread your arms, and scream-sing the high notes of a power ballad to ensure the entire household is fully alert and intimidated.',
        style: 'rooster',
        comicalFeedback: 'Absolute power move. The neighbors three doors down are awake and slightly afraid.'
      },
      {
        id: 'q1-b',
        text: 'Instantly jump up, activate your pre-planned kitchen spreadsheet, and prepare a 4-course hot breakfast with custom egg orders for everyone while folding laundry with your feet.',
        style: 'hen',
        comicalFeedback: 'Flawless efficiency! The butter is spread, the schedules are sync’d, and no crumbs remain.'
      },
      {
        id: 'q1-c',
        text: 'Ignore the alarm entirely, climb out of the window in your pajamas, and jog toward the enticing scent of fresh donuts coming from the local bakery’s dumpsters.',
        style: 'rebel',
        comicalFeedback: 'Ah, the call of the unknown pastry. Boundaries are merely suggestions anyway.'
      }
    ]
  },
  {
    id: 'q2',
    scenario: 'The Great WiFi Outage',
    context: 'The internet goes down. Society is crumbling, work is stalled, and panic is creeping in. What is your strategy?',
    answers: [
      {
        id: 'q2-a',
        text: 'March directly to the router, glare at it with extreme authority, and firmly press the reset button. Stand there in a power pose till the green light blinks, claiming complete credit for saving the day.',
        style: 'rooster',
        comicalFeedback: 'You tamed the machine. The status gods have witnessed your dramatic glare.'
      },
      {
        id: 'q2-b',
        text: 'Call a diagnostic meeting, hand out safety pens, draft a clipboard rotation for offline household chores, and reassure everyone with freshly baked cookies and structured hydration intervals.',
        style: 'hen',
        comicalFeedback: 'An absolute crisis manager. Under your care, a power outage is basically a premium spa retreat.'
      },
      {
        id: 'q2-c',
        text: 'Exclaim "Freedom!" and run into the backyard with a small notebook. You spend the next three hours watching a caterpillar, eventually following it over the fence into the neighboring property where you are found eating wild blackberries.',
        style: 'rebel',
        comicalFeedback: 'Who needs digital connections when you can have physical caterpillar encounters?'
      }
    ]
  },
  {
    id: 'q3',
    scenario: 'The Pizza Sovereignty',
    context: 'There is exactly one slice of pizza left in the box. Everyone is looking at it. What do you do?',
    answers: [
      {
        id: 'q3-a',
        text: 'Lock eyes with your rivals, inflate your lungs, and claim ownership by giving a 5-minute dramatic speech about why you, as the primary protector, deserve the nutrients.',
        style: 'rooster',
        comicalFeedback: 'Majestic. They handed it over just to make you stop talking about nutrients.'
      },
      {
        id: 'q3-b',
        text: 'Take out kitchen shears, divide the single slice into 8 scientifically equal portions down to the millimeter, make sure everyone gets an equal piece, and quietly snack on a piece of leftover broccoli.',
        style: 'hen',
        comicalFeedback: 'Peace is maintained! True leaders dine last, on raw vegetables and sheer organizational pride.'
      },
      {
        id: 'q3-c',
        text: 'Distract everyone by yelling "Look! A flying squirrel!", grab the entire carton—including the cardboard box—and bolt to the garden shed to feast in darkness.',
        style: 'rebel',
        comicalFeedback: 'Resourceful, stealthy, and eating in a woodpile. Top-tier goblin behavior.'
      }
    ]
  },
  {
    id: 'q4',
    scenario: 'The Dining Debate',
    context: 'Your group of friends is desperately trying to choose a restaurant. Nobody is committing. How do you intervene?',
    answers: [
      {
        id: 'q4-a',
        text: 'Declare, "We are going to Tacos!" in a voice that brooks no argument. Turn and start walking. Do not look back to check if they are following; they will follow.',
        style: 'rooster',
        comicalFeedback: 'Uncompromising charisma. You march, and the flock follows the smell of salsa.'
      },
      {
        id: 'q4-b',
        text: 'Pull out your phone, launch a ternary vote poll, cross-reference allergy lists, check Yelp ratings, verify wheelchair accessibility, and pre-book the table with a 15% discount coupon.',
        style: 'hen',
        comicalFeedback: 'They do not even deserve your genius. The Excel sheet of dining has spoken.'
      },
      {
        id: 'q4-c',
        text: 'Wander away mid-conversation because you spotted a very shiny coin on the pavement, ending up 3 blocks away watching a street performer playing the spoons.',
        style: 'rebel',
        comicalFeedback: 'Finding monetary wealth and local spoon art is infinitely better than choosing between pasta or sushi.'
      }
    ]
  },
  {
    id: 'q5',
    scenario: 'The Spring Cleaning Protocol',
    context: 'The house has reached maximum chaos. Dust bunnies have formed a union. What is your cleaning methodology?',
    answers: [
      {
        id: 'q5-a',
        text: 'Put on magnificent brass heavy metal music, stand on the couch with a broom like a scepter, and loudly dictate which corners must be swept by your helpers.',
        style: 'rooster',
        comicalFeedback: 'Every army needs a general. You dominate the dust from high elevation.'
      },
      {
        id: 'q5-b',
        text: 'Label everything with a color-coded label gun. Sort items into "Keep", "Donate", and "Shame" categories. Scrub the floorboards with an old toothbrush while humming a cheerful tune.',
        style: 'hen',
        comicalFeedback: 'Spotless! The crumbs didn’t just leave; they apologized on the way out.'
      },
      {
        id: 'q5-c',
        text: 'Find a giant corrugated cardboard box, draw a smiley face on it, crawl inside, and consider the box your new sovereign territory for the next couple of hours.',
        style: 'rebel',
        comicalFeedback: 'Box nation will never succumb to the vacuum cleaner!'
      }
    ]
  },
  {
    id: 'q6',
    scenario: 'The Pavement Slow-Walker',
    context: 'Someone is walking incredibly slowly directly in front of you, completely blocking the narrow path. What is your move?',
    answers: [
      {
        id: 'q6-a',
        text: 'Puff up your jacket, clear your throat with maximum volume, and strut past them with a high-speed wobble, shooting them a look of pure majestic disapproval.',
        style: 'rooster',
        comicalFeedback: 'Make way for the sovereign! Your feather ruffles are visible from space.'
      },
      {
        id: 'q6-b',
        text: 'Smoothly slide beside them, politely warn them about a slightly loose shoe-lace, recommend a better pair of ergonomic insoles, and gently nudge them toward the grass safety zone.',
        style: 'hen',
        comicalFeedback: 'Always nurturing, always advising. You basically just adopted a slow-moving stranger.'
      },
      {
        id: 'q6-c',
        text: 'Immediately take an sharp 90-degree turn through some ornamental bushes, stumble over a flower pot, discover a hidden neighborhood alleyway, and forget where you were originally heading.',
        style: 'rebel',
        comicalFeedback: 'Classic bypass. Sure, your shins are scratched, but you found a cool rusty key in the bush!'
      }
    ]
  }
];

export const RESULTS: Record<CoopStyle, ResultDetails> = {
  rooster: {
    title: 'Head Rooster',
    tagline: 'The Supreme Emperor of the Coop & Master of the Strut',
    description: 'You do not just walk into a room; you parade. You possess an innate need to stand on elevated surfaces (tables, desks, couches) and project your glorious opinions over the flock. Assertive, colorful, and occasionally loud, your leadership style relies heavily on showmanship and a strong puffing of the chest.',
    fullAnalysis: 'As a Head Rooster, you lead with absolute flair. If there is a project, you are the face of it. If there is a crisis, you are the loudest voice detailing how you will conquer it (even if you do not know how yet). You possess a majestic confidence that can rally people to action, though they occasionally wish you would turn down your natural megaphone before 9:00 AM.',
    strengths: [
      'Unshakeable confidence that borders on wizardry',
      'Excellent at yelling dramatic battle cries to motivate teams',
      'Capable of carrying off bold accessories (crowns, sunglasses, bright feathers)',
      'Natural-born public speaker and central focal point'
    ],
    weaknesses: [
      'A tendency to screeech at small innocent cardboard boxes',
      'Inexplicable urge to stand on expensive furniture to establish hierarchy',
      'Slightly sensitive ego (do NOT mock the comb/haircut!)',
      'Very poor listener when a quieter hen has the actual map'
    ],
    copingMechanism: 'When feeling overwhelmed, try taking deep, measured breaths. Remember: you do not need to fight every vacuum cleaner you see. Trust your flock to pick up the seeds sometimes.',
    mascotName: 'Lord Cluckington the Proud',
    statPercentages: {
      rooster: 85,
      hen: 10,
      rebel: 5
    },
    badges: ['Certified Heavy Speaker', 'Table-Stand Veteran', 'Crown Carrier', 'Vocal Powerhouse'],
    imagePath: '/src/assets/images/head_rooster_1781721933600.jpg'
  },
  hen: {
    title: 'Head Hen',
    tagline: 'The Commander-in-Chief of Meal Prep & Strategic Order',
    description: 'The real glue holding the cooperative universe together. While the roster screams at clouds, you are the one tracking the feed inventory, routing the chicks safely past the cat, and keeping the wood shavings fresh. You run a tight ship powered by spreadsheets, label makers, and deep maternal love.',
    fullAnalysis: 'You lead through flawless systems and continuous, active care. You know everyone’s allergies, their birthdays, and their exact preferred tea temperature. Your clipboard is a sacred implement. Though you rarely seek the spotlight, everyone in the flock knows that without your meticulous planning, the entire yard would collapse into absolute chaos in about eight seconds.',
    strengths: [
      'Gold-medal level organizational skills with a label gun',
      'Infinite stash of emergency snacks, adhesive bandages, and lozenges',
      'Highly protective of your flock (will fight a hawk with an umbrella)',
      'Unmatched ability to spot a mess before it actually happens'
    ],
    weaknesses: [
      'High risk of organizational twitching if a mug is placed without a coaster',
      'Refusal to sit down and rest (you will tidy up at your own birthday party)',
      'A secret urge to peck people who do not stick to the agenda',
      'Worrying about things that haven’t happened since the late Mesozoic era'
    ],
    copingMechanism: 'Step away from the clipboard. Allow someone else to make a slightly messy dinner. True control sometimes means letting the garden grow wild for a weekend.',
    mascotName: 'Colonel Henrietta the Organized',
    statPercentages: {
      rooster: 10,
      hen: 85,
      rebel: 5
    },
    badges: ['Clipboard Guardian', 'Snack Allocator Supreme', 'Hawk Deflector', 'Label Gun Commando'],
    imagePath: '/src/assets/images/head_hen_1781721946665.jpg'
  },
  rebel: {
    title: 'Free-Range Rebel',
    tagline: 'The Boundary-Shattering Explorer of the Neighbor’s Yard',
    description: 'You view fences not as limits, but as small parkour challenges. Rules, schedules, and property lines do not register in your adventurous brain. You are driven by pure curiosity, the allure of shiny objects, and the thrill of wandering directly into places you are absolutely not supposed to be.',
    fullAnalysis: 'As a Free-Range Rebel, you cannot be contained by standard structural plans or coop guidelines. You are the innovator, the trailblazer, and the person most likely to be found exploring a muddy ditch instead of attending the budget meeting. You keep life exceedingly unpredictable and introduce the flock to wild ideas (and neighboring lawns they would never have braved alone).',
    strengths: [
      'Total immunity to social embarrassment or rigid protocol',
      'Incredible talent for discovering secret paths and shiny discarded metal',
      'Unbounded creativity and out-of-the-coop problem solving',
      'Highly capable of having fun with a single cardboard tube'
    ],
    weaknesses: [
      'Zero sense of direction (frequently lost in your own driveway)',
      'Inability to answer the question: "Why did you climb that tree?"',
      'Short attention span that is easily disrupted by shiny foil wrapper',
      'Consistently trespassing in neighbor gardens seeking wild salads'
    ],
    copingMechanism: 'Try wearing a bell so your flock can locate you when you wander off. Write your address on your shoe. Keep a small map handy so you don’t end up in another county.',
    mascotName: 'Buster Barn-Breaker the Bold',
    statPercentages: {
      rooster: 10,
      hen: 10,
      rebel: 80
    },
    badges: ['Fence Jumper', 'Shiny Object Retriever', 'Bush Navigator', 'Shed Trespasser'],
    imagePath: '/src/assets/images/free_range_rebel_1781721959020.jpg'
  }
};
