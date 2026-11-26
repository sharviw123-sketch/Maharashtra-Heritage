// ═══════════════════════════════════════════════════
//  quiz-data.js — the quiz questions
//  Each quiz is an object; "questions" is an array of objects:
//    q    = question text
//    opts = array of 4 answer choices
//    ans  = index (0-3) of the correct choice
//    exp  = explanation shown after answering
// ═══════════════════════════════════════════════════

const quizData = {
  bhuleswar: {
    name: 'Bhuleswar Temple',
    img: "bhuleshwarquiz.jpg",
    alt: "Carved pillars lit by sunlight inside the Bhuleswar Temple",
    questions: [
      { q: 'What material is primarily used in the construction of Bhuleswar Temple?', opts: ['Red sandstone','Black basalt','White marble','Terracotta bricks'], ans: 1, exp: 'Bhuleswar Temple is built using precisely cut black basalt stones — the volcanic rock abundant across the Deccan Plateau. The Hemadpanthi technique fits these stones without mortar.' },
      { q: 'The architectural style of Bhuleswar Temple is known as:', opts: ['Dravidian','Vesara','Hemadpanthi','Chalukyan'], ans: 2, exp: 'Hemadpanthi style is named after Hemadri (also called Hemadpant), the prime minister of the Yadava dynasty who is traditionally credited with popularising this dry-stone interlocking construction method.' },
      { q: 'In the iconographic programme of Hemadpanthi temples, what does the lowest carved frieze typically depict?', opts: ['Celestial dancers (Apsaras)','Elephants (Gajapatha)','Battle scenes','Lotus patterns only'], ans: 1, exp: 'The lowest register of Hemadpanthi temple walls typically shows a procession of elephants — symbolising the earth, stability, and the support of the cosmos.' },
      { q: 'The Vastu Purusha Mandala used in temple planning is a grid of how many squares?', opts: ['32 squares','64 or 81 squares','108 squares','256 squares'], ans: 1, exp: 'The Vastu Purusha Mandala is based on grids of 64 (8×8) or 81 (9×9) squares. Each square is assigned to a deity, and the temple\'s spaces are mapped onto this cosmic body.' },
      { q: 'The Natha Panth tradition associated with Bhuleswar is primarily a lineage of:', opts: ['Vaishnavite poets','Shaiva yogis','Buddhist monks','Jain scholars'], ans: 1, exp: 'The Natha Panth is a Shaiva yogic lineage associated with Gorakshanath and Matsyendranath. Their carvings at Bhuleswar reveal the temple\'s role as a living centre for yogic knowledge transmission.' }
    ]
  },
  sangameshwar: {
    name: 'Sangameshwar Temple',
    img: "sangameshwar1.jpg",
    alt: "Sangameshwar Temple with its tall shikhara",
    questions: [
      { q: 'What does the name "Sangameshwar" literally mean?', opts: ['Lord of the Mountains','Lord of the Confluence','Lord of the Rivers','Lord of Stone'], ans: 1, exp: 'Sangameshwar translates as "Lord (Ishwara) of the Confluence (Sangama)" — a Shiva form specifically worshipped at river meeting points, which were considered sacred tirthas.' },
      { q: 'The carved mandapa ceiling of Sangameshwar features which central motif?', opts: ['A seated Ganesha','A central lotus medallion','A Surya (Sun) disc','A Shiva Linga'], ans: 1, exp: 'The mandapa ceiling features a beautifully carved central lotus medallion — representing the cosmos expanding outward from a divine centre, like a lotus opening.' },
      { q: 'The Sangameshwar Temple was built during the rule of which dynasty?', opts: ['Rashtrakuta dynasty','Chalukya dynasty','Yadava dynasty','Maratha Confederacy'], ans: 2, exp: 'The temple was built during the flourishing Yadava dynasty (c. 9th–14th century CE), who were great patrons of Hemadpanthi architecture.' },
      { q: 'In Indian cosmological tradition, why were river confluences (sangamas) chosen as temple sites?', opts: ['For easier water supply','As tirthas — crossing points between human and divine worlds','To control river flooding','Because land was cheaper there'], ans: 1, exp: 'In the Puranic tradition, sangamas were identified as tirthas — literally "fords" or "crossing points" — sacred places where the boundary between the human and the divine is thinner.' },
      { q: 'The Ashtadikpalas carved on temple walls represent:', opts: ['Eight manifestations of Vishnu','Eight guardians of the cardinal and ordinal directions','Eight forms of the Devi','Eight avatars of Shiva'], ans: 1, exp: 'The Ashtadikpalas are the eight directional guardians: Indra (east), Agni (SE), Yama (south), Nirrti (SW), Varuna (west), Vayu (NW), Kubera (north), Ishana (NE).' }
    ]
  },
  bhaja: {
    name: 'Bhaja Caves',
    img: "bhajacavequiz.jpg",
    alt: "Barrel-vaulted chaitya hall at Bhaja Caves",
    questions: [
      { q: 'Approximately when were the Bhaja Caves constructed?', opts: ['5th century CE','1st century CE','2nd century BCE','7th century BCE'], ans: 2, exp: 'The Bhaja Caves are dated to approximately the 2nd century BCE, making them among the earliest surviving rock-cut Buddhist monuments in India.' },
      { q: 'The primary architectural structure of Bhaja\'s Cave 12 is a:', opts: ['Vihara (monastery hall)','Chaitya (prayer hall with stupa)','Dharmasala (rest house)','Matika (meditation pit)'], ans: 1, exp: 'Cave 12 is the great Chaitya Hall — a barrel-vaulted prayer hall 16 metres long with octagonal columns flanking the nave and a solid hemispherical stupa at the apsidal end.' },
      { q: 'Which two Vedic deities are depicted in the remarkable relief panels at Bhaja?', opts: ['Brahma and Vishnu','Surya (Sun) and Indra on Airavata','Agni and Vayu','Varuna and Mitra'], ans: 1, exp: 'Bhaja\'s two extraordinary relief panels show Surya riding his chariot trampling demons, and Indra on his elephant Airavata in divine procession.' },
      { q: 'What does the term "Hinayana" refer to in the context of Bhaja Caves?', opts: ['A type of rock-cut architectural style','An early form of Buddhist practice focused on individual liberation','A specific stone carving technique','A Vedic sacrificial tradition'], ans: 1, exp: 'Hinayana (now called Theravada) refers to the early form of Buddhist practice that emphasised individual monastic practice and liberation.' },
      { q: 'How many stupas are found in Cave 19 at Bhaja?', opts: ['3','7','14','22'], ans: 2, exp: 'Cave 19 at Bhaja contains a remarkable assembly of 14 stupas, believed to be funerary monuments for senior monks of the community.' }
    ]
  }
};
