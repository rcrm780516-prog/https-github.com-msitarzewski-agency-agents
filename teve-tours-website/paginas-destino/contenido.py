# -*- coding: utf-8 -*-
"""
Contenido de las tres paginas de destino.

Todo dato comercial -- precios, que incluye, que no incluye, resenas,
telefono -- sale del sitio actual (teve-config.js). Lo que NO esta en el
sitio se marca con TODO y no se inventa.
"""

# Datos tomados del sitio, no inventados.
WA = "5219987351905"
TARIFAS = [("4 hours", "$180 USD"), ("6 to 8 hours", "$250 USD"),
           ("10 to 12 hours · Full day", "$300 USD")]
RECARGO = "Pick-ups before 8:00 am carry an extra $30 USD."
INCLUYE = ["Fuel is paid for", "Van for up to 8 people",
           "Private bilingual driver", "Beer, water and soft drinks in the vehicle"]
NO_INCLUYE = ["Entrance fees to attractions or sights", "Food",
              "Parking and tolls, where they apply"]
# Las tres resenas reales del sitio. Las tres mencionan a Tim; ninguna
# menciona a Felipe. TODO: no hay resenas de Felipe en el sitio.
RESENAS = [
 ("Tim handled everything: airport, Chichen Itza, cenote, lunch. We never felt rushed and he knew every trick for dodging the crowds.", "Jennifer K.", "Houston, Texas"),
 ("As Canadians who spend six weeks in Cancun every winter, reliable transport was our biggest worry. Tim solved it completely.", "Robert &amp; Linda S.", "Vancouver, BC"),
 ("We flew in from Sydney knowing nothing about the area. Tim became our unofficial concierge. I've already recommended him to four friends.", "Michael P.", "Sydney, Australia"),
]

def por_persona(total=300):
    return [(n, f"${total//n} USD") for n in (2, 4, 6, 8)]

PAGINAS = [
{
 "slug": "private-chichen-itza-tour-from-cancun",
 "title": "Private Chichen Itza, Cenote &amp; Valladolid Tour from Cancun | $300 per Vehicle",
 "desc": "Private driver to Chichen Itza, a cenote and Valladolid from Cancun. $300 per vehicle for up to 8 people, not per person. Your schedule, no hotel stops.",
 "h1": "Private Chichen Itza, Cenote &amp; Valladolid Tour from Cancun",
 "foto": "/img/tours/xichen-clasico.jpg",
 "wa": "Hi! I'd like information about the private Chichen Itza, cenote and Valladolid tour from Cancun.",
 "intro": [
  "Chichen Itza is the reason most people rent a car in Cancun and then regret it. The drive is two and a half hours each way on a toll road, the site is enormous and almost entirely without shade, and the hour you arrive decides whether you remember the pyramid or the crowd standing in front of it. A private driver removes every one of those problems without turning the day into a group tour.",
  "This is not a coach with forty strangers and a fixed departure. It is your own van and your own bilingual driver for the day. You decide what time to leave, how long to stay, and whether to add Valladolid on the way back. We help you shape the plan before you go, and then the day runs at your pace.",
 ],
 "porque_h": "Why Chichen Itza rewards an early start",
 "porque": [
  "The site opens at eight in the morning. The first coaches from the Cancun hotel zone pull in around eleven, and from that point the Kukulkan pyramid has a semicircle of people in front of it for the rest of the day. The temperature climbs with them: by midday the open plaza offers no relief at all.",
  "Leaving Cancun around six means you walk through the gate as it opens. For the first hour you share the Great Ball Court and the Temple of the Warriors with a handful of other early risers, the light is still low enough to photograph, and the stone has not yet turned into a radiator. This is the single biggest difference between a good day at Chichen Itza and a disappointing one, and it is the reason our pick-ups before eight carry a small surcharge.",
  "By the time the buses arrive you are already finishing, which leaves the rest of the day free for a cenote and lunch rather than for queueing.",
 ],
 "itin_h": "A sample day",
 "itin": [
  ("06:00", "Pick-up at your hotel", "Your driver meets you in the lobby. Water and soft drinks are already in the van. The drive is about two and a half hours on the toll road, and most people sleep part of it."),
  ("08:30", "Chichen Itza", "You arrive close to opening. Entrance is paid at the gate and is not included. Two to three hours is comfortable for the pyramid, the Ball Court, the observatory and the sacred cenote."),
  ("11:30", "A cenote to cool off", "A short drive from the site. After three hours in the sun, swimming in cold fresh water in a limestone cave is the part of the day people tend to talk about afterwards."),
  ("13:30", "Lunch and Valladolid", "Valladolid is a colonial town twenty minutes from the ruins: painted facades, a quiet main square and Yucatecan food that is better and cheaper than anything near the site."),
  ("16:00", "Back to Cancun", "Roughly two and a half hours. You set the departure time; nobody is waiting on a bus schedule."),
 ],
 "porque2_h": "Private driver or group tour?",
 "porque2": [
  "A group tour sells a seat. That price looks lower until you count what comes with it: a pick-up window rather than a time, an hour collecting other passengers from other hotels, a fixed ninety minutes at the ruins whether or not you are ready to leave, and a souvenir stop you did not ask for.",
  "A private driver sells the vehicle. The price is the same for two people as for eight, you leave when you say, and you stay at each stop as long as you want. If the cenote turns out to be the best part of the day, you stay longer and shorten Valladolid. That decision is yours to make on the day, not ours to make in advance.",
 ],
 "faq": [
  ("How far is Chichen Itza from Cancun?", "About 200 kilometres, which is two and a half hours each way on the toll road. Counting the site, a cenote and lunch, a full day runs around ten to twelve hours door to door."),
  ("What time should we leave?", "Six in the morning if you want the site before the coaches and before the heat. Pick-ups before eight carry an extra $30 USD, which is what buys you an empty plaza."),
  ("What should we bring?", "Cash for the entrance fee, which is paid at the gate. Water, a hat, sunscreen and shoes you can walk in. Swimwear and a towel for the cenote."),
  ("Is it suitable for children?", "Yes, though it is a long day with a lot of walking in the sun. The van seats up to eight. <!-- TODO: el sitio no dice nada sobre sillas infantiles -->"),
  ("Can you pick us up in Playa del Carmen or Tulum?", "We work across Cancun and the Riviera Maya, including Playa del Carmen and Tulum. Message us with where you are staying and we will confirm."),
  ("How and when do we pay?", "You pay on the day. Entrance fees, food, and parking or tolls where they apply are paid directly at each place and are not part of the $300."),
  ("What is the cancellation policy?", "<!-- TODO: el sitio no publica politica de cancelacion. Falta el dato. --> Message us on WhatsApp and we will confirm the terms before you book."),
 ],
},
{
 "slug": "private-tulum-cenote-tour-from-cancun",
 "title": "Private Tulum &amp; Cenote Tour from Cancun | Private Driver, $300 per Vehicle",
 "desc": "Private driver to the Tulum ruins, a cenote and the beach from Cancun. $300 per vehicle for up to 8 people, not per person. Leave when you want.",
 "h1": "Private Tulum &amp; Cenote Tour from Cancun",
 "foto": "/img/destinos/tulum.jpg",
 "wa": "Hi! I'd like information about the private Tulum and cenote tour from Cancun.",
 "intro": [
  "Tulum is the only Maya city built on the coast, and that is the whole point of it. The ruins sit on a low cliff above the Caribbean, so instead of looking at grey stone against jungle you are looking at grey stone against water that is an improbable shade of turquoise. It is smaller than Chichen Itza and closer to Cancun, which leaves room in the day for a cenote and a few hours at the beach.",
  "With a private driver the day is yours to arrange. Your own van, your own bilingual driver, and no obligation to be anywhere at a particular time except the places you choose.",
 ],
 "porque_h": "Why Tulum suits a flexible day",
 "porque": [
  "The drive from Cancun is about an hour and three quarters, which is short enough that you are not committing the whole day to the road. The ruins themselves take an hour and a half at an unhurried pace. That is the only fixed cost of the day.",
  "Everything after it is a choice. There is a beach directly below the ruins reachable by a wooden staircase. There are cenotes along the road back, some of them open pools in the jungle, others caves you swim into with a torch. There is Tulum town, which is where people actually eat rather than where the coaches stop. You can do all three or linger over one.",
  "Tulum also opens at eight, and the same arithmetic applies as at Chichen Itza: the earlier you walk in, the fewer people are between you and the cliff. There is very little shade on the site, so the morning is both emptier and considerably more comfortable.",
 ],
 "itin_h": "A sample day",
 "itin": [
  ("07:00", "Pick-up at your hotel", "An hour and three quarters south along the highway. Drinks are in the van."),
  ("08:45", "Tulum ruins", "Entrance is paid at the gate and is not included. Ninety minutes covers the Castillo, the Temple of the Frescoes and the cliff path, with time to stop and look at the sea."),
  ("10:30", "The beach below the ruins", "A staircase from the site leads down to the sand. The water is clear and shallow close in."),
  ("12:30", "A cenote on the way back", "The road between Tulum and Playa del Carmen is lined with them. Your driver will tell you which ones are worth stopping at and which are a car park with a ticket booth."),
  ("14:30", "Lunch in Tulum town or Playa del Carmen", "Your choice, and your driver's recommendation if you want one."),
  ("16:30", "Back to Cancun", "Whenever you are ready."),
 ],
 "porque2_h": "Private driver or group tour?",
 "porque2": [
  "Most group trips to Tulum bundle the ruins with a cenote and a buffet lunch, and move forty people between the three on a timetable. The timetable is the product: it is how the operator fits two departures into a day. It is also why you get ninety minutes at the ruins whether the light is good or not, and lunch at a place chosen for its parking.",
  "Hiring the vehicle instead of a seat changes the shape of the day. The price covers up to eight people, so a family of five pays the same as a couple. You stop where you want to stop. And if the beach below the ruins turns out to be the best part, you can stay in the water instead of being counted back onto a bus.",
 ],
 "faq": [
  ("How far is Tulum from Cancun?", "About 130 kilometres, roughly an hour and three quarters each way. With the ruins, a cenote and the beach, the day runs around eight to ten hours."),
  ("What time should we leave?", "Seven in the morning puts you at the ruins close to opening, before the heat and before the coaches. Pick-ups before eight carry an extra $30 USD."),
  ("What should we bring?", "Cash for the entrance fee, swimwear, a towel, water, sunscreen and a hat. There is almost no shade on the site."),
  ("Can we swim at the ruins?", "Yes. A wooden staircase from the site leads down to a small beach. Bring something to change into."),
  ("Is it suitable for children?", "Yes, and it is an easier day than Chichen Itza: less driving and a swim built in. The van seats up to eight. <!-- TODO: el sitio no dice nada sobre sillas infantiles -->"),
  ("Can you pick us up in Playa del Carmen or Tulum?", "Yes. We work across Cancun and the Riviera Maya. Tell us where you are staying and we will confirm the pick-up."),
  ("How and when do we pay?", "You pay on the day. Entrance fees, food, and parking or tolls where they apply are paid at each place and are not part of the $300."),
  ("What is the cancellation policy?", "<!-- TODO: el sitio no publica politica de cancelacion. Falta el dato. --> Message us on WhatsApp and we will confirm the terms before you book."),
 ],
},
{
 "slug": "akumal-turtles-tulum-private-tour-from-cancun",
 "title": "Private Akumal Swim with Turtles &amp; Tulum Tour from Cancun | Private Driver",
 "desc": "Private driver from Cancun to Akumal to snorkel with sea turtles, then the Tulum ruins and a cenote. $300 per vehicle for up to 8 people, not per person.",
 "h1": "Private Akumal Swim with Turtles &amp; Tulum Tour from Cancun",
 # TODO: no hay foto de Akumal ni de tortugas en el inventario del sitio.
 # Se usa la del cenote, que es lo mas cercano (snorkel en agua clara).
 "foto": "/img/tours/xenotes.jpg",
 "wa": "Hi! I'd like information about the private Akumal turtles and Tulum tour from Cancun.",
 "intro": [
  "Akumal means place of the turtles in Maya, and it is one of the few places in the Caribbean where that is still literally true. The bay is shallow, protected by a reef, and carpeted with the seagrass green turtles eat. You walk in from the beach, put your face in the water, and they are there, grazing, indifferent to you.",
  "It is also an hour and a quarter from Cancun and twenty minutes from Tulum, which makes it the natural first stop of a day that ends at the ruins and a cenote. With a private driver you can take the turtles in the morning, when the water is calmest and clearest, and still have the afternoon for everything else.",
 ],
 "porque_h": "Why the morning matters at Akumal",
 "porque": [
  "Akumal bay is busiest from late morning, and the water tells you immediately. Fins stir up the sand and the seagrass, visibility drops, and the turtles move further out. Arrive at opening and the bay is clear, the surface is flat and the animals are feeding in waist-deep water.",
  "The bay is a protected area. Access is managed, snorkelling is done in a marked zone, and touching or chasing the turtles is not allowed. These rules are the reason the turtles are still there, and your driver will tell you how the entrance works on the day.",
  "From Akumal the Tulum ruins are twenty minutes south, so the drive you have already made does double duty. A cenote on the way back rinses the salt off and closes the day.",
 ],
 "itin_h": "A sample day",
 "itin": [
  ("07:00", "Pick-up at your hotel", "About an hour and a quarter south. Drinks are in the van."),
  ("08:30", "Akumal bay", "Early, while the water is clear. Entrance and any snorkel gear or guide required at the bay are paid there and are not included."),
  ("10:30", "Dry off and head to Tulum", "Twenty minutes down the coast."),
  ("11:15", "Tulum ruins", "The only Maya city on the coast. Entrance paid at the gate. An hour and a half is unhurried."),
  ("13:30", "Lunch, then a cenote", "Fresh water after a morning in the sea. Your driver will steer you away from the ones that are only a car park."),
  ("16:30", "Back to Cancun", "At the time you choose."),
 ],
 "porque2_h": "Private driver or group tour?",
 "porque2": [
  "Group trips to Akumal tend to arrive mid-morning, because that is when a bus that collected passengers from six hotels can get there. Mid-morning is exactly when the bay is cloudiest and the turtles have moved off. The itinerary works for the operator and against the thing you came to see.",
  "A private van leaves when you decide, so you can be at the bay as it opens. The vehicle is priced for up to eight people rather than per seat, you are not waiting on anyone else to finish, and the order of the day is yours: if the snorkelling is good you stay in the water and shorten the ruins.",
 ],
 "faq": [
  ("How far is Akumal from Cancun?", "About 105 kilometres, an hour and a quarter each way. Adding Tulum and a cenote, the day runs around nine to eleven hours."),
  ("What time should we leave?", "Seven in the morning. Akumal is clearest early, before the bay fills and the sand is stirred up. Pick-ups before eight carry an extra $30 USD."),
  ("Are the turtles guaranteed?", "No, and nobody honest will tell you otherwise. They are wild animals in an open bay. They are seen on most mornings, which is why early matters, but they are not on a schedule."),
  ("What should we bring?", "Swimwear, a towel, a change of clothes, reef-safe sunscreen and cash for the entrances. Akumal manages access and gear at the bay itself."),
  ("Is it suitable for children?", "Children who are comfortable in the water usually love it, since the turtles feed in shallow water close to shore. The van seats up to eight. <!-- TODO: el sitio no dice nada sobre sillas infantiles -->"),
  ("Can you pick us up in Playa del Carmen or Tulum?", "Yes. We work across Cancun and the Riviera Maya, and from Playa del Carmen or Tulum you are even closer to Akumal."),
  ("How and when do we pay?", "You pay on the day. Entrances at Akumal and Tulum, any gear, food, and parking or tolls are paid at each place and are not part of the $300."),
  ("What is the cancellation policy?", "<!-- TODO: el sitio no publica politica de cancelacion. Falta el dato. --> Message us on WhatsApp and we will confirm the terms before you book."),
 ],
},
]
